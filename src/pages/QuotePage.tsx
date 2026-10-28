import { useState } from 'react';
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

const projectTypes: { type: ProjectType; icon: typeof FileText; desc: string }[] = [
  { type: 'Site Simples', icon: FileText, desc: 'Landing page ou site institucional' },
  { type: 'Portal/Blog', icon: Newspaper, desc: 'Publicação de conteúdo em escala' },
  { type: 'E-Commerce', icon: ShoppingCart, desc: 'Loja virtual com checkout' },
  { type: 'Sistema', icon: Server, desc: 'Aplicação web sob medida' },
  { type: 'Consultoria', icon: Lightbulb, desc: 'Diagnóstico e estratégia digital' },
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
    label: 'Nome completo',
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
  { name: 'company', label: 'Empresa', type: 'text', placeholder: 'Opcional', half: true },
  { name: 'phone', label: 'Telefone', type: 'tel', placeholder: '(11) 90000-0000', half: true },
];

export default function QuotePage() {
  const [selected, setSelected] = useState<ProjectType | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const update = (name: string, value: string) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-blue/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-blue-bright" />
          </div>
          <h1 className="font-display text-4xl mb-4">Revise e envie seu pedido</h1>
          <p className="text-muted mb-8">
            Seu resumo para <span className="text-text">{selected}</span> está pronto. Abra seu
            aplicativo de email para revisar e enviar. O pedido só será recebido depois do envio por
            você.
          </p>
          <a
            href={`mailto:contato@rafaeldev.com.br?subject=${encodeURIComponent(`Orçamento: ${selected}`)}&body=${encodeURIComponent(
              Object.entries(form)
                .map(
                  ([key, value]) =>
                    `${[...commonFields, ...fieldsByType[selected!], { name: 'message', label: 'Mensagem' }].find((field) => field.name === key)?.label || key}: ${value}`,
                )
                .join('\n'),
            )}`}
            className="block px-6 py-3.5 mb-4 rounded-xl bg-blue text-white"
          >
            Abrir email para enviar
          </a>
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
        <div className="relative max-w-4xl mx-auto px-6 lg:px-10 py-24 text-center">
          <p className="text-xs uppercase tracking-widest text-blue-bright mb-4 animate-fade-up">
            Orçamento
          </p>
          <h1 className="font-display text-5xl sm:text-7xl mb-6 animate-fade-up delay-100">
            Vamos construir
            <br />
            algo <span className="gradient-text">juntos</span>.
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto animate-fade-up delay-200">
            Selecione o tipo de projeto e preencha o formulário. Os campos se ajustam para que eu
            entenda exatamente o que você precisa.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16">
        {/* STEP 1: TYPE SELECTION */}
        <div className="mb-10">
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
                onClick={() => {
                  setSelected(type);
                  setForm({});
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
          <form onSubmit={handleSubmit} className="animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-7 h-7 rounded-full bg-blue text-white text-sm font-medium flex items-center justify-center">
                2
              </span>
              <h2 className="font-display-md text-2xl">Detalhes do projeto</h2>
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

              <div className="border-t border-border pt-5">
                <p className="text-xs uppercase tracking-widest text-blue-bright mb-4">
                  Específico · {selected}
                </p>
                <div className="grid sm:grid-cols-2 gap-5">
                  {fieldsByType[selected].map((f) => (
                    <FieldInput
                      key={f.name}
                      field={f}
                      value={form[f.name] ?? ''}
                      onChange={(v) => update(f.name, v)}
                      full={!f.half}
                    />
                  ))}
                </div>
              </div>

              {/* Optional message */}
              <div className="border-t border-border pt-5">
                <FieldInput
                  field={{
                    name: 'message',
                    label: 'Algo mais?',
                    type: 'textarea',
                    placeholder: 'Compartilhe qualquer detalhe extra que ache relevante...',
                  }}
                  value={form.message ?? ''}
                  onChange={(v) => update('message', v)}
                  full
                />
              </div>
            </div>

            <button
              type="submit"
              className="group mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue text-white font-medium hover:bg-blue/90 transition-all duration-300"
            >
              Preparar pedido por email
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-center text-xs text-muted mt-4">
              Revise o resumo e envie pelo seu aplicativo de email · Sem compromisso
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
    'w-full px-4 py-3 rounded-xl bg-bg border border-border text-text placeholder:text-muted/60 focus:outline-none focus:border-blue/50 focus:ring-1 focus:ring-blue/20 transition-all duration-300 text-sm';
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
