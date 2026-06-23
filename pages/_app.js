// pages/_app.js — Applies theme on mount, listens for system changes
import { useEffect } from 'react';
import { loadTheme, applyTheme } from '../lib/themeSettings';
import '../styles/theme.css';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const pref = loadTheme();
    applyTheme(pref);

    // Listen for system theme changes when preference is 'system'
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      const current = loadTheme();
      if (current === 'system') applyTheme('system');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return <Component {...pageProps} />;
}
