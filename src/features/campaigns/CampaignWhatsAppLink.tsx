import { ArrowUpRight, MessageCircle } from 'lucide-react';
import type { Campaign } from './campaigns';
import { reportQuoteEvent } from '@/lib/quoteTelemetry';

type Props = { campaign: Campaign; position: string; compact?: boolean; className?: string };

export function CampaignWhatsAppLink({ campaign, position, compact, className = '' }: Props) {
  return (
    <a
      href="https://wa.me/5511969005617"
      aria-label={`${compact ? 'Falar com Rafael' : campaign.cta} pelo WhatsApp`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        event.preventDefault();
        reportQuoteEvent('quote_whatsapp_click', {
          project: campaign.projectSlug,
          campaign: campaign.id,
          position,
        });
        window.open(
          'https://wa.me/5511969005617?text=' + encodeURIComponent(campaign.whatsapp),
          '_blank',
          'noopener,noreferrer',
        );
      }}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue/90 ${className}`}
    >
      <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      {compact ? 'Falar com Rafael' : campaign.cta}
      {!compact && <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />}
    </a>
  );
}
