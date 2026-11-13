import { reportQuoteConversion } from './analytics';
import { createQuoteId, getQuoteSessionId, reportQuoteEvent } from './quoteTelemetry';
import type { CampaignId } from '@/features/campaigns/campaigns';

type QuoteRequest = {
  project: string;
  projectSlug: string;
  email: string;
  website: FormDataEntryValue | null;
  details: { label: string; value: string }[];
  campaign?: CampaignId;
};

export async function submitQuote({ projectSlug, ...data }: QuoteRequest): Promise<void> {
  const requestId = createQuoteId();
  const context = { project: projectSlug, campaign: data.campaign, request_id: requestId };
  let status: number | undefined;
  let failure = 'network';
  reportQuoteEvent('quote_submit_attempt', context);
  try {
    const response = await fetch('/api/orcamento.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, request_id: requestId, session_id: getQuoteSessionId() }),
      signal: AbortSignal.timeout(20000),
    });
    status = response.status;
    if (!response.ok) {
      failure = 'http';
      throw new Error('Falha HTTP');
    }
    failure = 'invalid_response';
    const result: { success?: boolean } = await response.json();
    if (result?.success !== true) {
      failure = 'rejected';
      throw new Error('Envio recusado');
    }
    reportQuoteEvent('quote_submit_success', { ...context, status });
    reportQuoteConversion(data.campaign);
  } catch (cause) {
    reportQuoteEvent('quote_submit_error', {
      ...context,
      status,
      reason: cause instanceof DOMException && cause.name === 'TimeoutError' ? 'timeout' : failure,
    });
    throw cause;
  }
}
