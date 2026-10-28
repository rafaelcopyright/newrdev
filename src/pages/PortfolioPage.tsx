import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import ArticleBody from '@/features/content/ArticleBody';

export default function PortfolioPage() {
  return (
    <div className="pt-16">
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg" />
        <div className="relative max-w-8xl mx-auto px-6 lg:px-10 py-24">
          <p className="text-xs uppercase tracking-widest text-blue-bright mb-4">Portfólio</p>
          <h1 className="font-display text-5xl sm:text-7xl mb-6">
            Projetos que
            <br />
            entregam resultado.
          </h1>
          <p className="text-lg text-muted max-w-2xl">
            Conheça os sites e projetos que construí, de blogs a lojas virtuais e sites
            institucionais.
          </p>
        </div>
      </header>
      <ArticleBody
        id="portfolio-de-sites"
        className="portfolio-gallery max-w-7xl mx-auto px-6 py-16"
      />
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="rounded-3xl border border-border bg-bg-elev p-10 sm:p-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl mb-3">Tem um projeto em mente?</h2>
            <p className="text-muted">Vamos conversar sobre seu próximo site.</p>
          </div>
          <Link
            to="/orcamento/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue text-white font-medium hover:bg-blue/90 whitespace-nowrap"
          >
            Solicitar orçamento <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
