import { createContext, useContext } from 'react';

export type Page =
  | { name: 'home' }
  | { name: 'post'; id: string }
  | { name: 'portfolio' }
  | { name: 'project'; id: string }
  | { name: 'quote' };

type NavContextType = {
  navigate: (page: Page) => void;
  page: Page;
};

export const NavContext = createContext<NavContextType | null>(null);

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavContext');
  return ctx;
}

export function useTheme() {
  const toggle = () => {
    const root = document.documentElement;
    const isLight = root.classList.contains('light');
    if (isLight) root.classList.remove('light');
    else root.classList.add('light');
    localStorage.setItem('theme', isLight ? 'dark' : 'light');
  };
  return { toggle };
}

export function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') document.documentElement.classList.add('light');
}
