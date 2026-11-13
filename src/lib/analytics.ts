export const GA4_MEASUREMENT_ID = 'G-3B3ZY6JK8E';

type EventParameters = Record<string, string | number | boolean>;

type AnalyticsWindow = Window & {
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

export function reportQuoteConversion(): void {
  reportAnalyticsEvent('generate_lead', { form_name: 'orcamento', method: 'email' });
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
