// pages/oauth-callback.js
// Handles the deep-link redirect on mobile after OAuth:
//   cc.altius.leastscore://oauth?token=<JWT>&provider=<provider>
// Capacitor's Browser plugin fires this page, we parse the URL params,
// save the token, then navigate to home (or show an error).

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { saveToken } from '../lib/tokenStorage';

export default function OAuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('Processing…');

  useEffect(() => {
    if (!router.isReady) return;

    const { token, provider, error } = router.query;

    if (error) {
      setStatus('Login failed. Redirecting…');
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (token) {
      saveToken(token);
      setStatus('Logged in! Redirecting…');
      router.replace('/');
      return;
    }

    // No token or error — fall back gracefully
    setStatus('Something went wrong. Redirecting…');
    router.replace('/login?error=' + encodeURIComponent('OAuth callback received no token.'));
  }, [router.isReady, router.query]);

  return (
    <>
      <Head>
        <title>Signing in… — LeastScore</title>
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #07090F; }
        .wrap {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0D1117;
          font-family: 'DM Sans', system-ui, sans-serif;
          gap: 20px;
        }
        .spinner {
          width: 48px; height: 48px;
          border-radius: 50%;
          border: 3px solid rgba(58,77,255,0.15);
          border-top-color: #3A4DFF;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .label {
          color: #8896A7;
          font-size: 14px;
          letter-spacing: 0.02em;
        }
      `}</style>

      <div className="wrap">
        <div className="spinner" />
        <p className="label">{status}</p>
      </div>
    </>
  );
}
