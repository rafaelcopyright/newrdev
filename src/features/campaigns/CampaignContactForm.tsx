import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Campaign } from './campaigns';
import { useQuoteDiagnostics } from '@/lib/useQuoteDiagnostics';
import { reportQuoteEvent } from '@/lib/quoteTelemetry';
import { submitQuote } from '@/lib/submitQuote';

export function CampaignContactForm({ campaign }: { campaign: Campaign }) {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const diagnostics = useQuoteDiagnostics(campaign.projectSlug, campaign.id);
  const inputClass =
    'w-full rounded-xl border border-border bg-bg px-4 py-3 text-base text-text placeholder:text-muted/70 focus:border-blue-bright focus:outline-none focus:ring-2 focus:ring-blue/20';
  const update = (field: keyof typeof values, value: string) => {
    diagnostics.fieldChanged(field, value);
    setValues((current) => ({ ...current, [field]: value }));
  };
  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending.current) return;
    pending.current = true;
    setSending(true);
    setError('');
    const website = new FormData(event.currentTarget).get('website');
    try {
      await submitQuote({
        project: campaign.project,
        projectSlug: campaign.projectSlug,
        campaign: campaign.id,
        email: values.email.trim(),
        website,
        details: [
          { label: 'Nome', value: values.name.trim() },
          { label: 'E-mail', value: values.email.trim() },
          { label: 'Mensagem', value: values.message.trim() },
          { label: 'Origem', value: campaign.path },
        ],
      });
      setSent(true);
    } catch {
      setError(
        'Não consegui confirmar o envio. Seus dados continuam aqui. Tente novamente ou fale comigo pelo WhatsApp.',
      );
    } finally {
      setSending(false);
      pending.current = false;
    }
  };
  return (
    <div
      id="formulario"
      className="scroll-mt-24 rounded-2xl border border-border bg-bg-elev p-6 sm:p-8"
    >
      {sent ? (
        <div role="status" className="py-10">
          <CheckCircle2 className="mb-5 h-10 w-10 text-blue-bright" aria-hidden="true" />
          <h3 className="font-display-md text-2xl">Solicitação enviada.</h3>
          <p className="mt-3 text-muted">
            Vou analisar seu projeto e responder pelo e-mail informado.
          </p>
        </div>
      ) : (
        <form onSubmit={send} onInvalidCapture={diagnostics.invalid} aria-busy={sending}>
          <h3 className="font-display-md text-xl">Prefere receber uma resposta por e-mail?</h3>
          <p className="mb-6 mt-2 text-sm text-muted">
            Deixe seu contato. Os detalhes a gente conversa depois.
          </p>
          <div className="hidden" aria-hidden="true">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <fieldset disabled={sending} className="space-y-4">
            <label className="block text-sm font-medium">
              Nome <span className="text-blue-bright">*</span>
              <input
                name="name"
                autoComplete="name"
                required
                pattern=".*\S.*"
                maxLength={100}
                value={values.name}
                onChange={(event) => update('name', event.target.value)}
                className={inputClass + ' mt-2'}
                placeholder="Como posso chamar você?"
              />
            </label>
            <label className="block text-sm font-medium">
              E-mail <span className="text-blue-bright">*</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={values.email}
                onChange={(event) => update('email', event.target.value)}
                className={inputClass + ' mt-2'}
                placeholder="voce@empresa.com.br"
              />
            </label>
            <label className="block text-sm font-medium">
              {campaign.id === 'sites' ? 'O que você quer criar?' : 'O que você quer organizar?'}{' '}
              <span className="font-normal text-muted">(opcional)</span>
              <textarea
                name="message"
                rows={3}
                maxLength={1000}
                value={values.message}
                onChange={(event) => update('message', event.target.value)}
                className={inputClass + ' mt-2 resize-y'}
                placeholder={
                  campaign.id === 'sites'
                    ? 'Um site para apresentar meus serviços, um blog para publicar...'
                    : 'Hoje usamos planilhas para... e precisamos de...'
                }
              />
            </label>
            <button
              type="submit"
              onClick={() =>
                reportQuoteEvent('quote_submit_click', {
                  project: campaign.projectSlug,
                  campaign: campaign.id,
                  position: 'contact',
                })
              }
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue px-5 py-3.5 font-semibold text-white hover:bg-blue/90 disabled:opacity-60"
            >
              {sending ? 'Enviando...' : 'Quero conversar sobre meu projeto'}
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </fieldset>
          {error && (
            <p role="alert" className="mt-4 text-sm text-text">
              {error}
            </p>
          )}
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Uso seu contato para responder à solicitação.{' '}
            <Link className="underline underline-offset-2" to="/politica-de-privacidade/">
              Política de privacidade
            </Link>
            .
          </p>
        </form>
      )}
    </div>
  );
}
