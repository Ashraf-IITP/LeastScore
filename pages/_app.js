// pages/_app.js — Applies theme on mount, listens for system changes
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { loadTheme, applyTheme } from '../lib/themeSettings';
import { handleNativeBack } from '../lib/appNavigation';
import '../styles/theme.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();

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

    // Setup global hardware back button handler for Capacitor
    if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform()) {
      import('@capacitor/app').then(({ App }) => {
        App.addListener('backButton', ({ canGoBack }) => {
          if (handleNativeBack(router)) return;
          if (canGoBack) {
            window.history.back();
          } else {
            App.minimizeApp();
          }
        });
      }).catch(err => console.error('Failed to load Capacitor App plugin:', err));
    }

    return () => mq.removeEventListener('change', onChange);
  }, [router]);

  return <Component {...pageProps} />;
}
