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

    // Setup global hardware back button handler for Capacitor.
    // IMPORTANT: On Android, the swipe-back gesture fires this event AND the
    // WebView handles the history pop natively. Calling history.back() here too
    // would consume a second history entry (double-back bug). So we only
    // intercept the "nothing to go back to" case to minimize the app instead of
    // exiting, and let all other back navigation be handled natively by Android.
    if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform()) {
      import('@capacitor/app').then(({ App }) => {
        App.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            App.minimizeApp();
          }
          // When canGoBack is true, do nothing — the WebView/Android OS already
          // handles the history.go(-1) natively for both hardware button and swipe.
        });
      }).catch(err => console.error('Failed to load Capacitor App plugin:', err));
    }

    return () => mq.removeEventListener('change', onChange);
  }, []);

  return <Component {...pageProps} />;
}
