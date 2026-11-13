export const GA4_MEASUREMENT_ID = 'G-3B3ZY6JK8E';

type EventParameters = Record<string, string | number | boolean>;

type AnalyticsWindow = Window & {
  oaiq?: (
    command: 'measure',
    event: 'registration_completed',
    data: { type: 'customer_action' },
  ) => void;
  gtag?: (command: 'event', event: string, parameters: EventParameters) => void;
};

export function reportAnalyticsEvent(event: string, parameters: EventParameters = {}): void {
  try {
    (window as AnalyticsWindow).gtag?.('event', event, {
      ...parameters,
      send_to: GA4_MEASUREMENT_ID,
    });
  } catch {
    // Analytics must never interrupt the visitor's action.
  }
}

export function reportQuoteConversion(campaign?: string): void {
  if (campaign === 'sistemas') {
    try {
      (window as AnalyticsWindow).oaiq?.('measure', 'registration_completed', {
        type: 'customer_action',
      });
    } catch {
      // Pixel failures must not interrupt a successfully submitted quote.
    }
  }
  reportAnalyticsEvent('generate_lead', {
    form_name: campaign ? `campanha_${campaign}` : 'orcamento',
    method: 'email',
    ...(campaign ? { landing_campaign: campaign } : {}),
  });
  try {
    (window as AnalyticsWindow).gtag?.('event', 'conversion', {
      send_to: 'AW-18568226466/ZkgtCPGrgLYdEKLNgpZF',
      value: 1.0,
      currency: 'BRL',
    });
    (window as AnalyticsWindow).gtag?.('event', 'conversion', {
      send_to: 'AW-18568226466/RaHHCNvTuLYdEKLNgpZF',
    });
  } catch {
    // Analytics failures must not interrupt a successfully submitted quote.
  }
}
