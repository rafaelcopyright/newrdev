import { Github, Linkedin, Twitter, Mail, ArrowUpRight } from 'lucide-react';
import { useNav, type Page } from '@/nav';

const navLinks: { label: string; page: Page }[] = [
  { label: 'Início', page: { name: 'home' } },
  { label: 'Portfólio', page: { name: 'portfolio' } },
  { label: 'Orçamento', page: { name: 'quote' } },
];

export default function Footer() {
  const { navigate } = useNav();

  return (
    <footer className="border-t border-border bg-bg-elev mt-32">
      <div className="max-w-8xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-display text-3xl mb-3">
              Rafael<span className="text-blue-bright">.</span>dev
            </h3>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              Desenvolvimento web, inteligência artificial e marketing digital —
              soluções sob medida para a presença digital do seu negócio.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-4">Navegação</p>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => navigate(l.page)}
                    className="text-sm text-text/80 hover:text-blue-bright transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-4">Conecte-se</p>
            <div className="flex gap-3">
              {[
                { icon: Github, label: 'GitHub' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Mail, label: 'Email' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted hover:text-blue-bright hover:border-blue/40 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Icon className="w-[18px] h-[18px]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            © 2026 Rafael.dev — Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted flex items-center gap-1">
            Construído com atenção aos detalhes
            <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>
      </div>
    </footer>
  );
}
