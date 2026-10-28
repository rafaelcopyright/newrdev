import { useEffect, useState } from 'react';

export function useTheme() {
  const [isLight, setIsLight] = useState(false);
  useEffect(() => {
    try {
      const light = localStorage.getItem('theme') === 'light';
      document.documentElement.classList.toggle('light', light);
      setIsLight(light);
    } catch {
      // Browsers with storage disabled retain the default theme.
    }
  }, []);

  const toggle = () => {
    const light = document.documentElement.classList.toggle('light');
    setIsLight(light);
    try {
      localStorage.setItem('theme', light ? 'light' : 'dark');
    } catch {
      // Theme switching still works without persistent storage.
    }
  };

  return { isLight, toggle };
}
