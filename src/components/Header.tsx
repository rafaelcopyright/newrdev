import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, Code2 } from 'lucide-react';
import { useTheme } from '@/features/theme/useTheme';

const links = [
  { label: 'Início', to: '/' },
  { label: 'Blog', to: '/blog/' },
  { label: 'Portfólio', to: '/portfolio-de-sites/' },
  { label: 'Sobre', to: '/sobre/' },
];

export default function Header() {
  const { pathname } = useLocation();
  const { toggle, isLight } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded-lg text-sm font-medium ${isActive ? 'text-blue-bright' : 'text-muted hover:text-text'}`;
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 ${scrolled || open ? 'glass border-b border-border' : 'bg-bg'}`}
    >
      <div className="max-w-8xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" aria-label="Rafael.dev — Início" className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-blue flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </span>
          <span className="text-lg font-medium">
            Rafael<span className="text-blue-bright">.</span>dev
          </span>
        </Link>
        <nav aria-label="Principal" className="hidden md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Alternar tema"
            className="w-11 h-11 rounded-lg flex items-center justify-center text-muted hover:text-text"
          >
            {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <Link
            to="/orcamento/"
            className="hidden sm:block px-4 py-2 rounded-lg bg-blue text-white text-sm font-medium"
          >
            Solicitar orçamento
          </Link>
          <button
            onClick={() => setOpen((value) => !value)}
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="md:hidden w-11 h-11 flex items-center justify-center"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="menu-mobile" aria-label="Principal móvel" className="md:hidden px-6 py-4">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/orcamento/" className={linkClass}>
            Orçamento
          </NavLink>
        </nav>
      )}
    </header>
  );
}
