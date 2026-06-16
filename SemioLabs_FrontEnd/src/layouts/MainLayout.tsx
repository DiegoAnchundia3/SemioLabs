import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light';

function MainLayout({ children }: PropsWithChildren) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('semiolabs.theme');
    setThemeMode(storedTheme === 'light' ? 'light' : 'dark');
  }, []);

  useEffect(() => {
    document.body.dataset.theme = themeMode;
    window.localStorage.setItem('semiolabs.theme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <>
      <button
        className="theme-toggle-button"
        onClick={toggleTheme}
        aria-label={`Cambiar a modo ${themeMode === 'dark' ? 'día' : 'noche'}`}
        title={`Cambiar a modo ${themeMode === 'dark' ? 'día' : 'noche'}`}
      >
        {themeMode === 'dark' ? '☀️' : '🌙'}
      </button>
      <main className="app-shell">{children}</main>
    </>
  );
}

export default MainLayout;