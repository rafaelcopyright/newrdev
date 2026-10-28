import { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/data';
import { ProjectCard } from '@/components/ProjectCard';
import { useNav } from '@/nav';

const categories = ['Todos', 'Site Simples', 'Portal/Blog', 'E-Commerce', 'Sistema', 'Consultoria'];

export default function PortfolioPage() {
  const { navigate } = useNav();
  const [active, setActive] = useState('Todos');

  const filtered = useMemo(
    () => (active === 'Todos' ? projects : projects.filter((p) => p.category === active)),
    [active]
  );

  return (
    <div className="pt-16">
      {/* HEADER */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue/15 rounded-full blur-[120px]" />
        <div className="relative max-w-8xl mx-auto px-6 lg:px-10 py-24">
          <p className="text-xs uppercase tracking-widest text-blue-bright mb-4 animate-fade-up">Portfólio</p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl mb-6 animate-fade-up delay-100">
            Projetos que
            <br />
            entregam resultado.
          </h1>
          <p className="text-lg text-muted max-w-2xl animate-fade-up delay-200">
            Uma seleção dos trabalhos mais recentes — de sites institucionais a
            sistemas complexos. Cada projeto abaixo tem um detalhamento completo das
            ferramentas e do processo de criação.
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <section className="sticky top-16 z-30 glass border-b border-border">
        <div className="max-w-8xl mx-auto px-6 lg:px-10 py-4 flex gap-2 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                active === c
                  ? 'bg-blue text-white'
                  : 'text-muted hover:text-text hover:bg-bg-elev'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-8xl mx-auto px-6 lg:px-10 py-16">
        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted py-20">Nenhum projeto nesta categoria ainda.</p>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-8xl mx-auto px-6 lg:px-10 py-20">
        <div className="rounded-3xl border border-border bg-bg-elev p-10 sm:p-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl mb-3">Tem um projeto em mente?</h2>
            <p className="text-muted max-w-md">Vamos conversar. O orçamento é personalizado conforme o tipo de projeto.</p>
          </div>
          <button
            onClick={() => navigate({ name: 'quote' })}
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue text-white font-medium hover:bg-blue-bright transition-all duration-300 hover:gap-3 whitespace-nowrap"
          >
            Solicitar orçamento
            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
