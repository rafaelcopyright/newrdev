import { useEffect, useState } from 'react';
import { Moon, Sun, Menu, X, Code2 } from 'lucide-react';
import { useNav, useTheme, type Page } from '@/nav';

const links: { label: string; page: Page }[] = [
  { label: 'Início', page: { name: 'home' } },
  { label: 'Portfólio', page: { name: 'portfolio' } },
  { label: 'Orçamento', page: { name: 'quote' } },
];

export default function Header() {
  const { navigate, page } = useNav();
  const { toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains('light'));
  }, [toggle]);

  const isActive = (p: Page) => p.name === page.name;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-8xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <button
          onClick={() => navigate({ name: 'home' })}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue flex items-center justify-center transition-transform group-hover:rotate-6 group-hover:scale-105">
            <Code2 className="w-5 h-5 text-white" strokeWidth={2.2} />
          </div>
          <span className="text-lg font-medium tracking-tight">
            Rafael<span className="text-blue-bright">.</span>dev
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => navigate(l.page)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive(l.page)
                  ? 'text-blue-bright'
                  : 'text-muted hover:text-text hover:bg-bg-elev'
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              toggle();
              setIsLight((v) => !v);
            }}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-text hover:bg-bg-elev transition-all duration-300"
            aria-label="Alternar tema"
          >
            {isLight ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
          </button>
          <button
            onClick={() => navigate({ name: 'quote' })}
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-blue text-white text-sm font-medium hover:bg-blue-bright transition-colors duration-300"
          >
            Solicitar orçamento
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-text hover:bg-bg-elev transition-colors"
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${
          open ? 'max-h-72' : 'max-h-0'
        } glass border-b border-border`}
      >
        <div className="px-6 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => {
                navigate(l.page);
                setOpen(false);
              }}
              className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(l.page)
                  ? 'text-blue-bright bg-bg-elev'
                  : 'text-muted hover:text-text hover:bg-bg-elev'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
