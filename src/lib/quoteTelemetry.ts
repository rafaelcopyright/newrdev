import { reportAnalyticsEvent } from './analytics';

export type QuoteEvent =
  | 'quote_view'
  | 'quote_project_selected'
  | 'quote_form_start'
  | 'quote_field_started'
  | 'quote_submit_click'
  | 'quote_submit_attempt'
  | 'quote_validation_error'
  | 'quote_submit_success'
  | 'quote_submit_error'
  | 'quote_whatsapp_click';

type QuoteContext = {
  project?: string;
  field?: string;
  reason?: string;
  status?: number;
  request_id?: string;
};

type TelemetryWindow = Window & {
  clarity?: (command: 'event' | 'set', key: string, value?: string) => void;
};

let sessionId: string | undefined;

export function createQuoteId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    // Compatibility fallback only for diagnostic correlation, never for authentication.
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const value = Math.floor(Math.random() * 16);
      return (char === 'x' ? value : (value & 3) | 8).toString(16);
    });
  }
}

export function getQuoteSessionId(): string {
  if (!sessionId) {
    try {
      const stored = sessionStorage.getItem('quote-session');
      sessionId = stored && /^[a-f0-9-]{36}$/.test(stored) ? stored : createQuoteId();
      sessionStorage.setItem('quote-session', sessionId);
    } catch {
      sessionId = createQuoteId();
    }
  }
  return sessionId;
}

// Only machine-defined metadata belongs here. Never pass values, labels, URLs or error messages.
export function reportQuoteEvent(event: QuoteEvent, context: QuoteContext = {}): void {
  const parameters: Record<string, string | number> = { form_name: 'orcamento' };
  for (const key of ['project', 'field', 'reason', 'status'] as const) {
    const value = context[key];
    if (value !== undefined) parameters[key] = value;
  }
  // Session/request IDs and field values stay out of GA4.
  reportAnalyticsEvent(event, parameters);
  try {
    void fetch('/api/quote-events.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, session_id: getQuoteSessionId(), ...context }),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Diagnostics must never block the form or WhatsApp navigation.
  }
  try {
    const client = window as TelemetryWindow;
    client.clarity?.('event', event);
    for (const key of ['project', 'field', 'reason'] as const) {
      if (context[key]) client.clarity?.('set', `quote_${key}`, context[key]);
    }
    if (context.status) client.clarity?.('set', 'quote_http_status', String(context.status));
  } catch {
    // First-party diagnostics still work when analytics is unavailable.
  }
}

export function getValidationReason(validity: ValidityState): string {
  if (validity.valueMissing) return 'required';
  if (validity.typeMismatch) return 'invalid_type';
  if (validity.badInput) return 'bad_input';
  if (validity.rangeOverflow || validity.rangeUnderflow) return 'range';
  if (validity.stepMismatch) return 'step';
  if (validity.tooLong || validity.tooShort) return 'length';
  if (validity.patternMismatch) return 'pattern';
  return 'invalid';
}
