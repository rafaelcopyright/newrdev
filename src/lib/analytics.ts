type ConversionParameters = {
  send_to: string;
  value?: number;
  currency?: string;
};

type AnalyticsWindow = Window & {
  gtag?: (command: 'event', event: 'conversion', parameters: ConversionParameters) => void;
};

export function reportQuoteConversion(): void {
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
