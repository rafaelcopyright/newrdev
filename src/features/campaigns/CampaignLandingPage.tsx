import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Code2,
  FileText,
  FolderClosed,
  LayoutDashboard,
  ListChecks,
  LockKeyhole,
  MonitorSmartphone,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '@/features/seo/Seo';
import { useTheme } from '@/features/theme/useTheme';
import { reportQuoteEvent } from '@/lib/quoteTelemetry';
import type { Campaign } from './campaigns';
import { CampaignContactForm } from './CampaignContactForm';
import { CampaignWhatsAppLink } from './CampaignWhatsAppLink';
import './campaigns.css';

const steps = [
  {
    title: 'Você conta o que precisa',
    description: 'Conversamos sobre seu negócio, a rotina e o que o projeto precisa resolver.',
  },
  {
    title: 'Eu desenho o caminho',
    description: 'Você recebe uma proposta com o escopo, as etapas, o investimento e o prazo.',
  },
  {
    title: 'Construímos com acompanhamento',
    description:
      'Você participa das revisões e acompanha o desenvolvimento até a entrega combinada.',
  },
];

export default function CampaignLandingPage({ campaign }: { campaign: Campaign }) {
  const { isLight, toggle } = useTheme();
  const sites = campaign.id === 'sites';
  return (
    <div className="campaign-page">
      <Seo title={campaign.metaTitle} description={campaign.description} />
      <header className="campaign-header">
        <div className="campaign-container flex h-[72px] items-center justify-between gap-3">
          <Link
            to="/"
            aria-label="Rafael.dev — Início"
            className="flex items-center gap-2.5 font-medium"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue text-white">
              <Code2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg">
              Rafael<span className="text-blue-bright">.</span>dev
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted lg:block">
              Seu projeto, direto com o desenvolvedor.
            </span>
            <button
              onClick={toggle}
              aria-label="Alternar tema"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-muted hover:text-text"
            >
              {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <CampaignWhatsAppLink
              campaign={campaign}
              position="header"
              compact
              className="hidden sm:inline-flex"
            />
          </div>
        </div>
      </header>

      <section className="campaign-hero">
        <div className="campaign-container campaign-hero-grid">
          <div>
            <p className="campaign-eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-bright" />
              {campaign.eyebrow}
            </p>
            <h1 className="campaign-headline">
              {campaign.title} <span className="gradient-text">{campaign.emphasis}</span>
            </h1>
            <p className="campaign-lead">{campaign.description}</p>
            <div className="mt-7 flex flex-col items-start gap-4">
              <CampaignWhatsAppLink
                campaign={campaign}
                position="hero"
                className="w-full sm:w-auto"
              />
              <a
                href="#formulario"
                onClick={() =>
                  reportQuoteEvent('quote_contact_click', {
                    project: campaign.projectSlug,
                    campaign: campaign.id,
                    position: 'hero',
                  })
                }
                className="inline-flex min-h-11 items-center gap-2 text-sm text-muted underline decoration-border underline-offset-4 hover:text-text"
              >
                Prefiro deixar meu contato <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
            <p className="mt-2 text-xs text-muted">
              No WhatsApp, direto com Rafael. Conversa sem compromisso.
            </p>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-3 border-t border-border pt-6 text-xs text-muted">
              {(sites
                ? ['Sites e blogs', 'Pensado para celular', 'Contato direto']
                : ['Escopo sob medida', 'Web e celular', 'Contato direto']
              ).map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-blue-bright" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {sites ? <WebsitePreview /> : <SystemPreview />}
        </div>
      </section>

      <section className="border-y border-border bg-bg-elev/50">
        <div className="campaign-container grid gap-7 py-9 md:grid-cols-3">
          {campaign.benefits.map((benefit, index) => (
            <div key={benefit.title} className="flex gap-3">
              <span className="mt-1 font-mono text-xs text-blue-bright">0{index + 1}</span>
              <div>
                <h2 className="text-base font-semibold">{benefit.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="campaign-container campaign-section">
        <div className="campaign-section-intro">
          <p className="campaign-eyebrow">
            {sites ? 'O ponto de partida' : 'Sua rotina como ponto de partida'}
          </p>
          <h2 className="campaign-section-title">
            {sites
              ? 'O formato certo para o que você quer comunicar.'
              : 'O que hoje dá trabalho pode virar um fluxo mais simples.'}
          </h2>
          <p className="campaign-section-description">
            {sites
              ? 'Uma empresa que apresenta serviços e um blog que publica conteúdo precisam de estruturas diferentes. O projeto começa entendendo o seu objetivo.'
              : 'Você não precisa chegar com uma lista de telas. Pode começar mostrando onde a equipe perde tempo ou onde a informação se perde.'}
          </p>
        </div>
        <div className={`grid gap-4 ${sites ? 'md:grid-cols-2' : 'sm:grid-cols-2'}`}>
          {campaign.solutions.map((solution, index) => (
            <article key={solution.title} className="campaign-solution">
              <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg text-blue-bright">
                {index === 0 ? (
                  <LayoutDashboard className="h-5 w-5" />
                ) : index === 1 ? (
                  <Users className="h-5 w-5" />
                ) : index === 2 ? (
                  <FolderClosed className="h-5 w-5" />
                ) : (
                  <MonitorSmartphone className="h-5 w-5" />
                )}
              </span>
              <h3 className="font-display-md text-xl">{solution.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{solution.description}</p>
            </article>
          ))}
        </div>
      </section>

      {sites ? <WebsiteProof /> : <SystemScope />}

      <section className="campaign-container campaign-section">
        <div className="campaign-section-intro">
          <p className="campaign-eyebrow">Como vamos trabalhar</p>
          <h2 className="campaign-section-title">Clareza desde a primeira conversa.</h2>
          <p className="campaign-section-description">
            Sou Rafael, desenvolvedor web. Você conversa comigo sobre o objetivo, acompanha as
            decisões e sabe o que está sendo construído.
          </p>
        </div>
        <div className="grid gap-7 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="border-t border-border pt-5">
              <span className="font-mono text-sm text-blue-bright">0{index + 1}</span>
              <h3 className="mb-3 mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{step.description}</p>
            </article>
          ))}
        </div>
        <Link
          to="/sobre/"
          className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-muted underline underline-offset-4 hover:text-text"
        >
          Conheça quem vai desenvolver seu projeto <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <section id="contato" className="campaign-contact scroll-mt-24">
        <div className="campaign-container grid items-start gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="campaign-eyebrow">Vamos conversar</p>
            <h2 className="campaign-section-title">
              {sites
                ? 'Vamos tirar seu site do papel?'
                : 'Qual parte da sua rotina precisa funcionar melhor?'}
            </h2>
            <p className="mb-7 mt-5 max-w-lg leading-relaxed text-muted">
              {sites
                ? 'Conte o que você faz e o que espera do seu site. Eu ajudo a organizar o próximo passo e preparo uma proposta para o seu projeto.'
                : 'Me conte como vocês trabalham hoje. Vamos entender o problema e avaliar uma primeira versão que faça sentido para sua equipe.'}
            </p>
            <CampaignWhatsAppLink
              campaign={campaign}
              position="contact"
              className="w-full sm:w-auto"
            />
            <p className="mt-4 text-sm text-muted">Pode mandar sua ideia do jeito que ela está.</p>
            <div className="mt-8 flex items-start gap-3 border-t border-border pt-6 text-sm text-muted">
              <ShieldCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-blue-bright"
                aria-hidden="true"
              />
              <p>Primeiro entendemos o projeto. Você avalia a proposta antes de contratar.</p>
            </div>
          </div>
          <CampaignContactForm campaign={campaign} />
        </div>
      </section>

      <section className="campaign-container campaign-section grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="campaign-eyebrow">Antes de começar</p>
          <h2 className="campaign-section-title">Dúvidas que podemos resolver agora.</h2>
        </div>
        <div>
          {campaign.faq.map((item) => (
            <details key={item.question} className="campaign-faq">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="campaign-container flex flex-col justify-between gap-6 py-8 text-xs text-muted sm:flex-row sm:items-center">
          <p>
            <span className="font-semibold text-text">Rafael.dev</span> · Desenvolvimento web com
            atenção ao seu negócio.
          </p>
          <div className="flex gap-5">
            <Link to="/portfolio-de-sites/" className="py-2 underline underline-offset-4">
              Portfólio
            </Link>
            <Link to="/politica-de-privacidade/" className="py-2 underline underline-offset-4">
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
      <div className="campaign-mobile-cta">
        <CampaignWhatsAppLink campaign={campaign} position="sticky" className="w-full" />
      </div>
    </div>
  );
}

function WebsitePreview() {
  return (
    <figure className="campaign-website-preview">
      <div className="campaign-browser-bar">
        <span className="flex gap-1.5" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>Projeto do portfólio · Alpha International</span>
        <LockKeyhole className="h-3 w-3" aria-hidden="true" />
      </div>
      <a href="#projetos" aria-label="Conhecer os projetos de sites e blogs" className="block">
        <img
          src="/media/bebc9e41f66dbc57.webp"
          width={1200}
          height={675}
          alt="Site institucional da Alpha International, projeto do portfólio de Rafael."
          loading="eager"
          srcSet="/media/bebc9e41f66dbc57-480.webp 480w, /media/bebc9e41f66dbc57-768.webp 768w, /media/bebc9e41f66dbc57.webp 1200w"
          sizes="(min-width: 1024px) 550px, calc(100vw - 40px)"
          className="w-full"
        />
      </a>
      <figcaption className="flex items-center justify-between gap-4 border-t border-border bg-bg-elev p-5">
        <div>
          <p className="text-sm font-semibold">Uma apresentação à altura do negócio.</p>
          <p className="mt-1 text-xs text-muted">Site institucional · Assessoria e tradução</p>
        </div>
        <a
          href="#projetos"
          aria-label="Ver projetos de sites e blogs"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-blue-bright hover:bg-bg"
        >
          <ArrowDown className="h-4 w-4" />
        </a>
      </figcaption>
    </figure>
  );
}

function SystemPreview() {
  return (
    <figure className="campaign-system-preview">
      <div className="campaign-browser-bar">
        <span className="flex gap-1.5" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>Painel da operação</span>
        <LockKeyhole className="h-3 w-3" aria-hidden="true" />
      </div>
      <div className="p-5 sm:p-7">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">Sua equipe, no mesmo lugar</p>
            <p className="mt-1 text-xl font-semibold">Visão da operação</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue/15 text-blue-bright">
            <LayoutDashboard className="h-4 w-4" />
          </span>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {['Solicitações', 'Documentos', 'Equipe'].map((name, index) => (
            <span
              key={name}
              className={`rounded-lg px-3 py-2 text-xs ${index === 0 ? 'bg-blue text-white' : 'border border-border text-muted'}`}
            >
              {name}
            </span>
          ))}
        </div>
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2.5 text-xs text-muted">
          <Search className="h-3.5 w-3.5" />
          Encontre uma solicitação ou documento
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          {[
            { name: 'Cadastro de fornecedor', team: 'Administração', state: 'Em revisão' },
            { name: 'Contrato de prestação de serviço', team: 'Documentos', state: 'Aprovado' },
            { name: 'Solicitação de acesso', team: 'Equipe', state: 'Em andamento' },
          ].map((row, index) => (
            <div
              key={row.name}
              className={`flex items-center justify-between gap-3 p-4 ${index > 0 ? 'border-t border-border' : ''}`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <FileText className="hidden h-4 w-4 shrink-0 text-blue-bright sm:block" />
                <div>
                  <p className="text-xs font-medium">{row.name}</p>
                  <p className="mt-1 text-[11px] text-muted">{row.team}</p>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[10px] ${index === 1 ? 'bg-blue/15 text-blue-bright' : 'bg-bg text-muted'}`}
              >
                {row.state}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2 text-xs text-muted">
          <Users className="h-4 w-4 text-blue-bright" />
          Cada pessoa acompanha o que precisa.
        </div>
      </div>
      <figcaption className="border-t border-border bg-bg px-5 py-3 text-[11px] text-muted">
        Interface ilustrativa. As funcionalidades são definidas no seu projeto.
      </figcaption>
    </figure>
  );
}

function WebsiteProof() {
  return (
    <section id="projetos" className="campaign-proof scroll-mt-24">
      <div className="campaign-container">
        <div className="campaign-section-intro">
          <p className="campaign-eyebrow">Trabalho que você pode ver</p>
          <h2 className="campaign-section-title">Projetos reais, com objetivos diferentes.</h2>
          <p className="campaign-section-description">
            Estes trabalhos já fazem parte do meu portfólio. Veja como apresentação e conteúdo
            ganham uma estrutura própria.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="overflow-hidden rounded-2xl border border-border bg-bg">
            <img
              src="/media/bebc9e41f66dbc57.webp"
              alt="Página do site institucional Alpha International."
              loading="lazy"
              width={1200}
              height={675}
              className="aspect-video w-full object-cover"
            />
            <div className="p-6">
              <p className="campaign-eyebrow">Institucional</p>
              <h3 className="font-display-md text-2xl">Alpha International</h3>
              <p className="mb-4 mt-3 text-sm leading-relaxed text-muted">
                Apresentação da empresa júnior de assessoria e tradução, com seus serviços e
                caminhos de contato.
              </p>
              <Link
                to="/portfolio-de-sites/"
                className="inline-flex min-h-11 items-center gap-2 text-sm text-blue-bright"
              >
                Ver no portfólio <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
          <article className="overflow-hidden rounded-2xl border border-border bg-bg">
            <img
              src="/media/5cf78d9554030b56.webp"
              alt="Blog Sob as Asas do Segredo, desenvolvido para os textos de Rivelino Reis."
              loading="lazy"
              width={1200}
              height={675}
              className="aspect-video w-full object-cover"
            />
            <div className="p-6">
              <p className="campaign-eyebrow">Blog e landing page</p>
              <h3 className="font-display-md text-2xl">Sob as Asas do Segredo</h3>
              <p className="mb-4 mt-3 text-sm leading-relaxed text-muted">
                Um espaço para os textos de Rivelino Reis, organizado para leitura e apresentação do
                livro do autor.
              </p>
              <Link
                to="/portfolio/sob-as-asas-do-segredo-blog-e-landing-page/"
                className="inline-flex min-h-11 items-center gap-2 text-sm text-blue-bright"
              >
                Conhecer o projeto <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function SystemScope() {
  return (
    <section className="campaign-proof">
      <div className="campaign-container grid gap-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="campaign-eyebrow">Comece pelo que importa</p>
          <h2 className="campaign-section-title">
            Primeiro, o processo que sua equipe precisa resolver.
          </h2>
          <p className="campaign-section-description">
            Uma primeira versão pode focar em um fluxo específico. Assim, o escopo fica claro e você
            consegue avaliar o uso antes de planejar novas etapas.
          </p>
        </div>
        <div className="space-y-5">
          {[
            {
              icon: ListChecks,
              title: 'Fluxo mapeado antes das telas',
              description:
                'Quem solicita, quem executa, quem aprova e quais informações acompanham cada etapa.',
            },
            {
              icon: LockKeyhole,
              title: 'Acesso e dados no planejamento',
              description:
                'Permissões, hospedagem, backups e integrações entram na conversa desde o início.',
            },
            {
              icon: MonitorSmartphone,
              title: 'Uma interface que combina com o trabalho',
              description:
                'Uso no escritório, no celular ou em campo: o contexto define o que vamos construir.',
            },
          ].map(({ icon: Icon, title, description }) => (
            <article key={title} className="flex items-start gap-4 border-b border-border pb-5">
              <Icon className="mt-1 h-5 w-5 shrink-0 text-blue-bright" />
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
