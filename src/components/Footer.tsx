import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-elev mt-20">
      <div className="max-w-8xl mx-auto px-6 lg:px-10 py-14 grid md:grid-cols-2 gap-10">
        <div>
          <p className="font-display text-3xl mb-4">
            Rafael<span className="text-blue-bright">.</span>dev
          </p>
          <p className="text-muted text-sm max-w-md">
            Desenvolvimento web, inteligência artificial e marketing digital — soluções para a
            presença digital do seu negócio.
          </p>
        </div>
        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6 gap-y-4 text-sm">
          <Link to="/blog/">Blog</Link>
          <Link to="/portfolio-de-sites/">Portfólio</Link>
          <Link to="/sobre/">Sobre</Link>
          <Link to="/orcamento/">Orçamento</Link>
          <Link to="/politica-de-privacidade/">Política de privacidade</Link>
        </nav>
      </div>
      <p className="text-xs text-muted text-center px-6 pb-8">
        © {new Date().getUTCFullYear()} Rafael.dev — Todos os direitos reservados.
      </p>
    </footer>
  );
}
