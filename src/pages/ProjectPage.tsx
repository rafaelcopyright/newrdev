import { ArrowLeft, ExternalLink, Calendar, Wrench, Layers, GitBranch, Rocket } from 'lucide-react';
import { projects } from '@/data';
import { ProjectCard } from '@/components/ProjectCard';
import { useNav } from '@/nav';

const processSteps = [
  {
    icon: Layers,
    title: '01 · Descoberta',
    desc: 'Imersão no problema do cliente, mapeamento de stakeholders e definição clara de metas mensuráveis antes de qualquer linha de código.',
  },
  {
    icon: GitBranch,
    title: '02 · Arquitetura',
    desc: 'Escolha do stack técnico, modelagem de dados e prototipação de baixa fidelidade para validar fluxos com usuários reais.',
  },
  {
    icon: Wrench,
    title: '03 · Construção',
    desc: 'Desenvolvimento iterativo em sprints curtos, com revisões contínuas e integração contínua do feedback do cliente.',
  },
  {
    icon: Rocket,
    title: '04 · Lançamento',
    desc: 'Testes de performance e acessibilidade, deploy monitorado e acompanhamento pós-go-live para ajustes rápidos.',
  },
];

export default function ProjectPage({ id }: { id: string }) {
  const { navigate } = useNav();
  const project = projects.find((p) => p.id === id) ?? projects[0];
  const related = projects.filter((p) => p.id !== project.id).slice(0, 3);

  return (
    <div className="pt-16">
      {/* HERO */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img src={project.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/90 to-bg/50" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 lg:px-10 pt-32 pb-16">
          <button
            onClick={() => navigate({ name: 'portfolio' })}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors mb-8 animate-fade-up"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao portfólio
          </button>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border border-blue/20 bg-blue/10 text-blue-bright mb-6 animate-fade-up delay-100">
            {project.category}
          </span>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-6 animate-fade-up delay-200">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted animate-fade-up delay-300">
            <span>Cliente: <span className="text-text">{project.client}</span></span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {project.year}
            </span>
          </div>
        </div>
      </header>

      {/* OVERVIEW */}
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-16">
        <h2 className="font-display-md text-3xl mb-4">Sobre o projeto</h2>
        <p className="text-lg text-text/80 leading-relaxed mb-6">
          {project.excerpt} O desafio central era entregar uma experiência rápida e
          confiável sem comprometer a flexibilidade que a equipe precisava para
          crescer. A solução combinou um frontend enxuto com um backend robusto,
          mantendo o tempo de carregamento abaixo de 1 segundo em conexões médias.
        </p>
        <p className="text-lg text-text/80 leading-relaxed">
          O resultado foi um produto que escalou junto com o negócio, reduzindo
          custos operacionais e aumentando a satisfação dos usuários finais —
          métricas que continuam saudáveis meses após o lançamento.
        </p>

        <div className="flex flex-wrap gap-2 mt-8">
          {project.tags.map((t) => (
            <span key={t} className="px-3 py-1.5 rounded-lg bg-bg-elev border border-border text-sm text-muted">
              {t}
            </span>
          ))}
        </div>

        <a
          href="#"
          className="mt-8 inline-flex items-center gap-2 text-blue-bright hover:gap-3 transition-all"
        >
          Ver projeto ao vivo <ExternalLink className="w-4 h-4" />
        </a>
      </section>

      {/* TOOLS */}
      <section className="max-w-8xl mx-auto px-6 lg:px-10 py-16">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-blue-bright mb-3">Stack técnico</p>
          <h2 className="font-display text-4xl sm:text-5xl">Ferramentas usadas</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {project.tags.map((tool, i) => (
            <div
              key={tool}
              className="group p-6 rounded-2xl border border-border bg-bg-elev hover:border-blue/30 transition-all duration-400 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-blue/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <Wrench className="w-5 h-5 text-blue-bright" />
              </div>
              <h3 className="font-medium text-base mb-1">{tool}</h3>
              <p className="text-xs text-muted">Tecnologia chave do projeto</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="max-w-8xl mx-auto px-6 lg:px-10 py-16">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-amber mb-3">Metodologia</p>
          <h2 className="font-display text-4xl sm:text-5xl">O processo de criação</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {processSteps.map((step, i) => (
            <div
              key={step.title}
              className="relative p-6 rounded-2xl border border-border bg-bg-elev/50 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <step.icon className="w-7 h-7 text-blue-bright mb-4" />
              <h3 className="font-display-md text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              {i < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-px bg-border" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* RELATED */}
      <section className="max-w-8xl mx-auto px-6 lg:px-10 py-20 border-t border-border">
        <h2 className="font-display text-3xl sm:text-4xl mb-10">Outros projetos</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
