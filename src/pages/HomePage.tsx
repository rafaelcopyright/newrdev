import { ArrowUpRight, Sparkles, Zap, Brain, TrendingUp, Play } from 'lucide-react';
import { posts, projects } from '@/data';
import { PostCard } from '@/components/PostCard';
import { ProjectCard } from '@/components/ProjectCard';
import { useNav } from '@/nav';

const topics = [
  { icon: Zap, label: 'Desenvolvimento Web', desc: 'Frontend, arquitetura, performance' },
  { icon: Brain, label: 'Inteligência Artificial', desc: 'LLMs, agentes, automação' },
  { icon: TrendingUp, label: 'Marketing Digital', desc: 'SEO, funis, conversão' },
];

const marqueeItems = [
  'React', 'TypeScript', 'Next.js', 'Supabase', 'Tailwind', 'Node.js',
  'Python', 'OpenAI', 'Stripe', 'Vite', 'PostgreSQL', 'Astro',
];

export default function HomePage() {
  const { navigate } = useNav();
  const articles = posts.filter((p) => p.type === 'article');
  const videos = posts.filter((p) => p.type === 'video');

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-8xl mx-auto px-6 lg:px-10 w-full">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-bg-elev/60 backdrop-blur text-xs text-muted mb-8 animate-fade-up">
              <Sparkles className="w-3.5 h-3.5 text-amber" />
              Disponível para novos projetos em 2026
            </div>

            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl mb-8 animate-fade-up delay-100">
              Construindo a web
              <br />
              com <span className="gradient-text">inteligência</span>
              <br />
              e intenção.
            </h1>

            <p className="text-lg text-muted leading-relaxed max-w-2xl mb-10 animate-fade-up delay-200">
              Sou Rafael — desenvolvedor e estrategista digital. Escrevo, gravo e
              construo soluções em desenvolvimento web, IA e marketing digital para
              marcas que querem crescer com tecnologia bem aplicada.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up delay-300">
              <button
                onClick={() => navigate({ name: 'quote' })}
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue text-white font-medium hover:bg-blue-bright transition-all duration-300 hover:gap-3"
              >
                Solicitar orçamento
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </button>
              <button
                onClick={() => navigate({ name: 'portfolio' })}
                className="px-6 py-3.5 rounded-xl border border-border text-text font-medium hover:border-blue/40 hover:bg-bg-elev transition-all duration-300"
              >
                Ver portfólio
              </button>
            </div>
          </div>

          {/* Topics */}
          <div className="grid sm:grid-cols-3 gap-4 mt-20 max-w-5xl animate-fade-up delay-400">
            {topics.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="group p-5 rounded-2xl border border-border bg-bg-elev/40 backdrop-blur hover:border-blue/30 transition-all duration-400 hover:-translate-y-1"
              >
                <Icon className="w-6 h-6 text-blue-bright mb-3 transition-transform group-hover:scale-110" />
                <h3 className="font-medium text-base mb-1">{label}</h3>
                <p className="text-xs text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-border py-6 overflow-hidden bg-bg-elev/30">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="text-2xl font-display text-muted/60 flex items-center gap-12">
              {item}
              <span className="w-1.5 h-1.5 rounded-full bg-blue/40" />
            </span>
          ))}
        </div>
      </section>

      {/* FEATURED ARTICLES */}
      <section className="max-w-8xl mx-auto px-6 lg:px-10 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-blue-bright mb-3">Artigos</p>
            <h2 className="font-display text-4xl sm:text-5xl">
              Textos recentes
            </h2>
          </div>
          <button className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted hover:text-blue-bright transition-colors">
            Ver todos <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((p, i) => (
            <PostCard key={p.id} post={p} index={i} />
          ))}
        </div>
      </section>

      {/* VIDEO POSTS */}
      <section className="max-w-8xl mx-auto px-6 lg:px-10 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber mb-3">Vídeos</p>
            <h2 className="font-display text-4xl sm:text-5xl">
              Conteúdo em vídeo
            </h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {videos.map((v, i) => (
            <PostCard key={v.id} post={v} index={i} />
          ))}
        </div>
      </section>

      {/* FEATURED PROJECTS PREVIEW */}
      <section className="max-w-8xl mx-auto px-6 lg:px-10 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-blue-bright mb-3">Trabalhos</p>
            <h2 className="font-display text-4xl sm:text-5xl">
              Projetos selecionados
            </h2>
          </div>
          <button
            onClick={() => navigate({ name: 'portfolio' })}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted hover:text-blue-bright transition-colors"
          >
            Ver portfólio completo <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section className="max-w-8xl mx-auto px-6 lg:px-10 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-bg-elev p-10 sm:p-16 text-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue/15 rounded-full blur-[100px]" />
          <div className="relative">
            <h2 className="font-display text-4xl sm:text-5xl mb-4">
              Receba o que eu publico
            </h2>
            <p className="text-muted max-w-xl mx-auto mb-8">
              Um email quinzenal com artigos, vídeos e ferramentas sobre web, IA e
              marketing. Sem ruído, sem spam.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="seu@email.com"
                className="flex-1 px-4 py-3.5 rounded-xl bg-bg border border-border text-text placeholder:text-muted/60 focus:outline-none focus:border-blue/50 transition-colors"
              />
              <button className="px-6 py-3.5 rounded-xl bg-blue text-white font-medium hover:bg-blue-bright transition-colors whitespace-nowrap">
                Inscrever
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
