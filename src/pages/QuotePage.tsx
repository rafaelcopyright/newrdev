import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { reportQuoteConversion } from '../lib/analytics';
import {
  ArrowRight,
  Check,
  FileText,
  Newspaper,
  ShoppingCart,
  Server,
  Lightbulb,
  Send,
  CheckCircle2,
} from 'lucide-react';

type ProjectType = 'Site Simples' | 'Portal/Blog' | 'E-Commerce' | 'Sistema' | 'Consultoria';

const projectTypes: { slug: string; type: ProjectType; icon: typeof FileText; desc: string }[] = [
  {
    slug: 'site-simples',
    type: 'Site Simples',
    icon: FileText,
    desc: 'Landing page ou site institucional',
  },
  {
    slug: 'portal-blog',
    type: 'Portal/Blog',
    icon: Newspaper,
    desc: 'Publicação de conteúdo em escala',
  },
  { slug: 'e-commerce', type: 'E-Commerce', icon: ShoppingCart, desc: 'Loja virtual com checkout' },
  { slug: 'sistema', type: 'Sistema', icon: Server, desc: 'Aplicação web sob medida' },
  {
    slug: 'consultoria',
    type: 'Consultoria',
    icon: Lightbulb,
    desc: 'Diagnóstico e estratégia digital',
  },
];

type Field = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  half?: boolean;
};

const fieldsByType: Record<ProjectType, Field[]> = {
  'Site Simples': [
    {
      name: 'pages',
      label: 'Número de páginas',
      type: 'number',
      placeholder: 'ex: 4',
      required: true,
      half: true,
    },
    {
      name: 'deadline',
      label: 'Prazo desejado',
      type: 'text',
      placeholder: 'ex: 3 semanas',
      half: true,
    },
    {
      name: 'style',
      label: 'Estilo visual',
      type: 'select',
      options: ['Minimalista', 'Corporativo', 'Criativo', 'Outro'],
      half: true,
    },
    {
      name: 'hosting',
      label: 'Já tem domínio/hospedagem?',
      type: 'select',
      options: ['Sim', 'Não', 'Preciso de ajuda'],
      half: true,
    },
    {
      name: 'features',
      label: 'Funcionalidades desejadas',
      type: 'textarea',
      placeholder: 'Formulário de contato, integração com WhatsApp, etc.',
    },
  ],
  'Portal/Blog': [
    {
      name: 'volume',
      label: 'Volume de publicações/mês',
      type: 'number',
      placeholder: 'ex: 20',
      required: true,
      half: true,
    },
    {
      name: 'authors',
      label: 'Número de autores',
      type: 'number',
      placeholder: 'ex: 5',
      half: true,
    },
    {
      name: 'cms',
      label: 'Preferência de CMS',
      type: 'select',
      options: ['Headless (Sanity, Contentful)', 'WordPress', 'Custom', 'Sem preferência'],
      half: true,
    },
    {
      name: 'search',
      label: 'Precisa de busca avançada?',
      type: 'select',
      options: ['Sim', 'Não'],
      half: true,
    },
    {
      name: 'monetization',
      label: 'Modelo de monetização',
      type: 'textarea',
      placeholder: 'Anúncios, assinaturas, patrocínios...',
    },
  ],
  'E-Commerce': [
    {
      name: 'products',
      label: 'Catálogo (nº de produtos)',
      type: 'number',
      placeholder: 'ex: 200',
      required: true,
      half: true,
    },
    {
      name: 'payment',
      label: 'Gateways de pagamento',
      type: 'select',
      options: ['Stripe', 'Pix', 'Mercado Pago', 'Múltiplos'],
      half: true,
    },
    {
      name: 'shipping',
      label: 'Integração de frete',
      type: 'select',
      options: ['Sim', 'Não', 'A definir'],
      half: true,
    },
    {
      name: 'erp',
      label: 'Integração com ERP/estoque',
      type: 'select',
      options: ['Sim', 'Não'],
      half: true,
    },
    {
      name: 'platform',
      label: 'Plataforma preferida',
      type: 'textarea',
      placeholder: 'Shopify, WooCommerce, custom...',
    },
  ],
  Sistema: [
    {
      name: 'users',
      label: 'Usuários simultâneos estimados',
      type: 'number',
      placeholder: 'ex: 500',
      required: true,
      half: true,
    },
    {
      name: 'auth',
      label: 'Necessita autenticação?',
      type: 'select',
      options: ['Sim, email/senha', 'Sim, SSO', 'Não'],
      half: true,
    },
    {
      name: 'integrations',
      label: 'Integrações externas',
      type: 'textarea',
      placeholder: 'APIs de terceiros, webhooks, etc.',
    },
    {
      name: 'data',
      label: 'Volume de dados estimado',
      type: 'text',
      placeholder: 'ex: 100 mil registros',
      half: true,
    },
    {
      name: 'access',
      label: 'Acesso (web, mobile, ambos)',
      type: 'select',
      options: ['Web', 'Mobile', 'Ambos'],
      half: true,
    },
  ],
  Consultoria: [
    {
      name: 'area',
      label: 'Área de foco',
      type: 'select',
      options: [
        'Presença digital',
        'SEO/Performance',
        'Estratégia de conteúdo',
        'Automação com IA',
      ],
      half: true,
    },
    {
      name: 'duration',
      label: 'Duração esperada',
      type: 'select',
      options: ['1 mês', '3 meses', '6 meses', 'Contínuo'],
      half: true,
    },
    {
      name: 'team',
      label: 'Tamanho da equipe envolvida',
      type: 'number',
      placeholder: 'ex: 4',
      half: true,
    },
    {
      name: 'current',
      label: 'Situação atual',
      type: 'textarea',
      placeholder: 'O que você já tem hoje e o que gostaria de melhorar.',
    },
  ],
};

const commonFields: Field[] = [
  {
    name: 'name',
    label: 'Nome',
    type: 'text',
    placeholder: 'Seu nome',
    required: true,
    half: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'voce@email.com',
    required: true,
    half: true,
  },
  {
    name: 'phone',
    label: 'WhatsApp (opcional)',
    type: 'tel',
    placeholder: '(11) 90000-0000',
    half: true,
  },
];

export default function QuotePage() {
  const [searchParams] = useSearchParams();
  const projectFromUrl = projectTypes.find(
    ({ slug }) => slug === searchParams.get('projeto'),
  )?.type;
  const detailsRef = useRef<HTMLFormElement>(null);
  const pendingScroll = useRef(false);
  const [selected, setSelected] = useState<ProjectType | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    pendingScroll.current = Boolean(projectFromUrl);
    if (projectFromUrl) {
      setSelected(projectFromUrl);
      setForm({});
    }
  }, [projectFromUrl]);

  useEffect(() => {
    if (!selected || !pendingScroll.current) return;
    const frame = requestAnimationFrame(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
      pendingScroll.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [selected, projectFromUrl]);

  const update = (name: string, value: string) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected || sending) return;
    setSending(true);
    setError('');
    const fields = [
      ...commonFields,
      { name: 'company', label: 'Empresa' },
      ...fieldsByType[selected],
      { name: 'message', label: 'Mensagem' },
    ];
    try {
      const response = await fetch('/api/orcamento.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: selected,
          email: form.email,
          website: new FormData(e.currentTarget).get('website'),
          details: fields.map(({ name, label }) => ({ label, value: form[name] ?? '' })),
        }),
        signal: AbortSignal.timeout(20000),
      });
      const result: { success?: boolean } = await response.json();
      if (!response.ok || result.success !== true) throw new Error('Falha no envio');
      setSubmitted(true);
      reportQuoteConversion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError(
        'Não foi possível confirmar o envio. Tente novamente ou entre em contato pelo contato@rafaeldev.com.br.',
      );
    } finally {
      setSending(false);
    }
  };

  const whatsappMessage = selected
    ? [
        'Olá! Gostaria de um orçamento para ' + selected + '.',
        ...[
          ...commonFields,
          { name: 'company', label: 'Empresa' },
          ...fieldsByType[selected],
          { name: 'message', label: 'Mensagem' },
        ]
          .filter(({ name }) => form[name]?.trim())
          .map(({ name, label }) => label + ': ' + form[name]),
      ].join('\n')
    : '';

  if (submitted) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-blue/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-blue-bright" />
          </div>
          <h1 className="font-display text-4xl mb-4">Pedido enviado!</h1>
          <p className="text-muted mb-8">
            Sua solicitação de {selected} foi enviada. Responderei pelo contato informado.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setSelected(null);
              setForm({});
            }}
            className="px-6 py-3.5 rounded-xl border border-border text-text font-medium hover:border-blue/40 hover:bg-bg-elev transition-all duration-300"
          >
            Enviar nova solicitação
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* HEADER */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue/15 rounded-full blur-[120px]" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-10 py-10 sm:py-24 text-center">
          <p className="text-xs uppercase tracking-widest text-blue-bright mb-4 animate-fade-up">
            Orçamento
          </p>
          <h1 className="font-display text-5xl sm:text-7xl mb-6 animate-fade-up delay-100">
            <a href="#tipo-de-projeto">
              Vamos construir
              <br />
              algo <span className="gradient-text">juntos</span>.
            </a>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto animate-fade-up delay-200">
            <a href="#tipo-de-projeto">
              Escolha o tipo de projeto e deixe seu contato. Podemos definir os detalhes juntos, sem
              compromisso.
            </a>
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-8 sm:py-16">
        {/* STEP 1: TYPE SELECTION */}
        <div id="tipo-de-projeto" className="mb-10 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-7 h-7 rounded-full bg-blue text-white text-sm font-medium flex items-center justify-center">
              1
            </span>
            <h2 className="font-display-md text-2xl">Tipo de projeto</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {projectTypes.map(({ type, icon: Icon, desc }, i) => (
              <button
                key={type}
                aria-pressed={selected === type}
                onClick={() => {
                  setSelected(type);
                }}
                className={`group flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-400 animate-fade-up ${
                  selected === type
                    ? 'border-blue bg-blue/5 ring-1 ring-blue/30'
                    : 'border-border bg-bg-elev hover:border-blue/30 hover:-translate-y-0.5'
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    selected === type ? 'bg-blue text-white' : 'bg-bg-elev2 text-blue-bright'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-base">{type}</h3>
                    {selected === type && <Check className="w-4 h-4 text-blue-bright" />}
                  </div>
                  <p className="text-xs text-muted mt-0.5">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 2: DYNAMIC FORM */}
        {selected && (
          <form
            ref={detailsRef}
            onSubmit={handleSubmit}
            className="animate-fade-up scroll-mt-24"
            aria-busy={sending}
          >
            <div className="hidden" aria-hidden="true">
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <fieldset disabled={sending} className="min-w-0">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-7 h-7 rounded-full bg-blue text-white text-sm font-medium flex items-center justify-center">
                  2
                </span>
                <h2 className="font-display-md text-2xl">Solicite seu orçamento</h2>
              </div>

              <div className="rounded-2xl border border-border bg-bg-elev p-6 sm:p-8 space-y-5">
                {/* Common contact fields */}
                <div className="grid sm:grid-cols-2 gap-5">
                  {commonFields.map((f) => (
                    <FieldInput
                      key={f.name}
                      field={f}
                      value={form[f.name] ?? ''}
                      onChange={(v) => update(f.name, v)}
                    />
                  ))}
                </div>

                {/* Optional message */}
                <div className="border-t border-border pt-5">
                  <FieldInput
                    field={{
                      name: 'message',
                      label: 'O que você precisa? (opcional)',
                      type: 'textarea',
                      placeholder:
                        'Conte sua ideia ou o problema que quer resolver. Não precisa ter tudo definido.',
                    }}
                    value={form.message ?? ''}
                    onChange={(v) => update('message', v)}
                    full
                  />
                </div>
                <details className="border-t border-border pt-5">
                  <summary className="cursor-pointer text-sm font-medium text-blue-bright py-2">
                    Adicionar detalhes (opcional)
                  </summary>
                  <div className="grid sm:grid-cols-2 gap-5 mt-4">
                    <FieldInput
                      field={{ name: 'company', label: 'Empresa (opcional)', type: 'text' }}
                      value={form.company ?? ''}
                      onChange={(v) => update('company', v)}
                      full
                    />
                    {fieldsByType[selected].map((f) => (
                      <FieldInput
                        key={f.name}
                        field={{ ...f, required: false }}
                        value={form[f.name] ?? ''}
                        onChange={(v) => update(f.name, v)}
                        full={!f.half}
                      />
                    ))}
                  </div>
                </details>
              </div>
            </fieldset>
            {error && (
              <p role="alert" className="mt-4 text-sm text-text">
                {error}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                disabled={sending}
                type="submit"
                className="group mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue text-white font-medium hover:bg-blue/90 transition-all duration-300"
              >
                {sending ? 'Enviando...' : 'Solicitar orçamento'}
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={'https://wa.me/5511969005617?text=' + encodeURIComponent(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center px-6 py-4 rounded-xl border border-border text-text font-medium hover:border-blue/40 transition-colors"
              >
                Prefiro conversar no WhatsApp
              </a>
            </div>

            <p className="text-center text-xs text-muted mt-4">
              Envio direto para contato@rafaeldev.com.br · Sem compromisso
            </p>
          </form>
        )}

        {!selected && (
          <div className="text-center py-12 text-muted text-sm flex items-center justify-center gap-2">
            <ArrowRight className="w-4 h-4 animate-pulse" />
            Escolha um tipo de projeto acima para continuar
          </div>
        )}
      </div>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
  full,
}: {
  field: Field;
  value: string;
  onChange: (v: string) => void;
  full?: boolean;
}) {
  const base =
    'w-full px-4 py-3 rounded-xl bg-bg border border-border text-text placeholder:text-muted/60 focus:outline-none focus:border-blue/50 focus:ring-1 focus:ring-blue/20 transition-all duration-300 text-base';
  const width = full ? 'sm:col-span-2' : '';

  return (
    <label className={`block ${width}`}>
      <span className="block text-sm font-medium mb-2">
        {field.label}
        {field.required && <span className="text-blue-bright ml-1">*</span>}
      </span>
      {field.type === 'textarea' ? (
        <textarea
          rows={3}
          placeholder={field.placeholder}
          value={value}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
          className={base + ' resize-none'}
        />
      ) : field.type === 'select' ? (
        <select
          value={value}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
          className={base + ' cursor-pointer'}
        >
          <option value="">Selecione...</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={field.name}
          autoComplete={
            { name: 'name', email: 'email', phone: 'tel', company: 'organization' }[field.name]
          }
          type={field.type}
          placeholder={field.placeholder}
          value={value}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      )}
    </label>
  );
}
