// pages/login.js — Beautiful auth page: Login | Register | Guest
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// ── SVG Brand Icons ───────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.3 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13 17.8 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.6 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8C43.8 37.3 46.6 31.4 46.6 24.5z" />
    <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.7 10.7l7.8-6z" />
    <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.2 0-11.5-4.2-13.4-9.8l-7.8 6C6.6 42.6 14.6 48 24 48z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.5h-2.79V24C19.61 23.1 24 18.1 24 12.07z" />
  </svg>
);

// ── Reusable field ────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, placeholder, maxLength, autoComplete }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} maxLength={maxLength} autoComplete={autoComplete}
      />
    </div>
  );
}

// ── Floating suit particle ────────────────────────────────────
function SuitParticle({ suit, style }) {
  return <div className="suit-particle" style={style}>{suit}</div>;
}

// ── Main component ────────────────────────────────────────────
export default function Login() {
  const router = useRouter();
  const [view, setView] = useState('main');
  const [checking, setChecking] = useState(true);

  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [regName, setRegName] = useState('');
  const [regTag, setRegTag] = useState('');

  const [guestName, setGuestName] = useState('');
  const [guestTag, setGuestTag] = useState('');

  const [oauthTempToken, setOauthTempToken] = useState('');
  const [oauthProvider, setOauthProvider] = useState('');
  const [upgradeGuestSessionId, setUpgradeGuestSessionId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Card flip state for logo
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    const flipInterval = setInterval(() => {
      setCardFlipped(f => !f);
    }, 3000);
    return () => clearInterval(flipInterval);
  }, []);

  useEffect(() => {
    const audio = new Audio('/sound/home page song.mp3');
    audio.loop = true;
    
    const onInteract = () => {
      audio.play().catch(() => {});
      document.removeEventListener('click', onInteract);
      document.removeEventListener('keydown', onInteract);
      document.removeEventListener('touchstart', onInteract);
      document.removeEventListener('scroll', onInteract);
      document.removeEventListener('touchmove', onInteract);
      document.removeEventListener('wheel', onInteract);
    };

    audio.play().catch(() => {
      document.addEventListener('click', onInteract);
      document.addEventListener('keydown', onInteract);
      document.addEventListener('touchstart', onInteract);
      document.addEventListener('scroll', onInteract);
      document.addEventListener('touchmove', onInteract);
      document.addEventListener('wheel', onInteract);
    });

    return () => {
      document.removeEventListener('click', onInteract);
      document.removeEventListener('keydown', onInteract);
      document.removeEventListener('touchstart', onInteract);
      document.removeEventListener('scroll', onInteract);
      document.removeEventListener('touchmove', onInteract);
      document.removeEventListener('wheel', onInteract);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      const isUpgradeFlow = router.query?.upgradeGuest === '1';
      if (d.user) {
        if (isUpgradeFlow && d.user.type === 'guest') {
          setGuestName(d.user.display_name || '');
          setGuestTag((d.user.tag || '').toUpperCase());
          setRegName(d.user.display_name || '');
          setRegTag((d.user.tag || '').toUpperCase());
          setUpgradeGuestSessionId(d.user.guestSessionId || null);
          setView('main');
          setChecking(false);
        } else {
          router.replace('/');
        }
      } else {
        setChecking(false);
      }
    }).catch(() => setChecking(false));
  }, [router.query]);

  useEffect(() => {
    const { step, provider, tempToken, suggestedName, guestName: qGuestName, guestTag: qGuestTag, guestSessionId: qGuestSessionId, error: qErr } = router.query || {};
    if (qErr) setError(decodeURIComponent(qErr));
    if (step === 'choose-username' && provider && tempToken) {
      setView('oauth-username');
      setOauthProvider(provider);
      setOauthTempToken(decodeURIComponent(tempToken));
      if (suggestedName) setRegName(decodeURIComponent(suggestedName).replace(/[^A-Za-z0-9_]/g, '').slice(0, 20));
      if (qGuestName) setRegName(decodeURIComponent(qGuestName).replace(/[^A-Za-z0-9_]/g, '').slice(0, 20));
      if (qGuestTag) setRegTag(decodeURIComponent(qGuestTag).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4));
      if (qGuestSessionId) setUpgradeGuestSessionId(Number(qGuestSessionId));
      setChecking(false);
    }
  }, [router.query]);

  useEffect(() => {
    const playClickSound = (e) => {
      const target = e.target.closest('button, .link-text, .logo-card-wrap');
      if (target) {
        const audio = new Audio('/sound/touch%20sound.wav');
        audio.play().catch(() => {});
      }
    };
    
    document.addEventListener('click', playClickSound);
    return () => document.removeEventListener('click', playClickSound);
  }, []);

  const post = async (url, body) => {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return r.json();
  };

  const go = async (fn) => {
    setLoading(true); setError(''); setSuccess('');
    try { await fn(); } catch (e) { setError('An unexpected error occurred.'); }
    finally { setLoading(false); }
  };

  const handleLogin = () => go(async () => {
    const d = await post('/api/auth/login', { username: loginUser, password: loginPass });
    if (d.error) return setError(d.error);
    router.replace('/');
  });

  const handleOAuthUsername = () => go(async () => {
    const d = await post('/api/auth/oauth/set-username', {
      tempToken: oauthTempToken,
      displayName: regName,
      tag: regTag,
      guestSessionId: upgradeGuestSessionId || undefined
    });
    if (d.error) return setError(d.error);
    router.replace('/');
  });

  const handleGuest = () => go(async () => {
    const d = await post('/api/auth/guest', { displayName: guestName, tag: guestTag });
    if (d.error) return setError(d.error);
    router.replace('/');
  });

  const handleOAuth = (provider) => {
    if (upgradeGuestSessionId) {
      const query = new URLSearchParams({
        upgradeGuestSessionId: String(upgradeGuestSessionId),
        upgradeGuestName: regName || guestName || '',
        upgradeGuestTag: (regTag || guestTag || '').toUpperCase()
      }).toString();
      window.location.href = `/api/auth/oauth/${provider}?${query}`;
      return;
    }
    window.location.href = `/api/auth/oauth/${provider}`;
  };

  const changeView = (v) => { setView(v); setError(''); setSuccess(''); };

  if (checking) return (
    <div className="mobile-app-container">
      <div className="mobile-frame" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="premium-spinner" />
      </div>
    </div>
  );

  const usernameHint = (name, tag) => (
    <p className="username-hint">
      Playing as <strong>{name || 'Name'}#{(tag || 'XXXX').toUpperCase()}</strong>
    </p>
  );

  // Suit particles config
  const particles = [
    { suit: '♠', style: { top: '8%', left: '6%', animationDelay: '0s', animationDuration: '18s', fontSize: '22px', opacity: 0.12 } },
    { suit: '♥', style: { top: '15%', right: '8%', animationDelay: '3s', animationDuration: '22s', fontSize: '16px', opacity: 0.09, color: '#FF6B6B' } },
    { suit: '♦', style: { top: '55%', left: '4%', animationDelay: '6s', animationDuration: '20s', fontSize: '18px', opacity: 0.1, color: '#FF6B6B' } },
    { suit: '♣', style: { top: '70%', right: '5%', animationDelay: '1.5s', animationDuration: '25s', fontSize: '20px', opacity: 0.11 } },
    { suit: '♠', style: { top: '40%', right: '3%', animationDelay: '9s', animationDuration: '16s', fontSize: '13px', opacity: 0.08 } },
    { suit: '♥', style: { top: '85%', left: '10%', animationDelay: '4.5s', animationDuration: '19s', fontSize: '14px', opacity: 0.07, color: '#FF6B6B' } },
  ];

  return (
    <>
      <Head>
        <title>Login — LeastScore</title>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        body {
          margin: 0;
          background: #07090F;
        }

        /* ── Layout ── */
        .mobile-app-container {
          min-height: 100vh;
          background: #07090F;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        .mobile-frame {
          width: 100%;
          min-height: 100vh;
          background: #0D1117;
          position: relative;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          -webkit-overflow-scrolling: touch;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .mobile-frame::-webkit-scrollbar { display: none; }

        @media (min-width: 600px) {
          .mobile-frame {
            max-width: 420px;
            min-height: 820px;
            height: 92vh;
            border-radius: 44px;
            box-shadow:
              0 40px 100px rgba(0,0,0,0.7),
              0 0 0 1px rgba(255,255,255,0.04),
              0 0 0 2px rgba(0,0,0,0.6),
              0 0 160px rgba(58,77,255,0.08);
          }
        }

        /* ── Background mesh gradient (static, no animation = no layout cost) ── */
        .bg-mesh {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 70% 50% at 90% 5%, rgba(58,77,255,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 10% 95%, rgba(255,200,87,0.10) 0%, transparent 65%),
            radial-gradient(ellipse 40% 30% at 50% 50%, rgba(58,77,255,0.04) 0%, transparent 80%);
        }

        /* ── Suit particles ── */
        .suit-particle {
          position: absolute;
          pointer-events: none;
          z-index: 1;
          color: #CBD5E1;
          font-size: 18px;
          user-select: none;
          animation: suitDrift linear infinite;
        }
        @keyframes suitDrift {
          0%   { transform: translateY(0px) rotate(0deg); }
          33%  { transform: translateY(-14px) rotate(6deg); }
          66%  { transform: translateY(8px) rotate(-4deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        /* ── Scroll content ── */
        .scroll-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 10;
          padding: 24px 28px 40px;
        }

        /* ── Logo ── */
        .logo-section {
          text-align: center;
          margin: 60px 0 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* 3D card flip */
        .logo-card-wrap {
          perspective: 400px;
          display: inline-block;
          margin-bottom: 20px;
          cursor: pointer;
        }
        .logo-card-inner {
          width: 56px;
          height: 56px;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 0 auto;
        }
        .logo-card-inner.flipped {
          transform: rotateY(180deg);
        }
        .logo-card-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          line-height: 1;
          filter: drop-shadow(0 0 16px rgba(255,200,87,0.3));
        }
        .logo-card-face.back {
          transform: rotateY(180deg);
        }

        .logo-title {
          margin: 0;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 44px;
          font-weight: 400;
          color: #F0F4FF;
          letter-spacing: 3px;
          line-height: 1;
          position: relative;
          display: inline-block;
        }
        /* Gold underline accent with glow */
        .logo-title::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 10%;
          width: 80%;
          height: 2.5px;
          background: linear-gradient(90deg, transparent, #FFC857, transparent);
          border-radius: 4px;
          box-shadow: 0 0 16px rgba(255,200,87,0.6);
        }

        .logo-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 14px;
          background: rgba(255,200,87,0.08);
          border: 1px solid rgba(255,200,87,0.2);
          color: #FFC857;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 100px;
          width: fit-content;
          max-width: 100%;
        }

        .logo-subtitle {
          margin: 12px auto 0;
          color: #8896A7;
          font-size: 14px;
          line-height: 1.6;
          max-width: 240px;
          font-weight: 400;
        }

        /* ── Card surface ── */
        .card-surface {
          background: rgba(255,255,255,0.028);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 28px;
          padding: 28px 24px;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.04) inset,
            0 24px 48px rgba(0,0,0,0.5);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          animation: cardEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Buttons ── */

        /* Google — white/light treatment for authenticity */
        .btn-google {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #F8F9FA;
          color: #1A1A2E;
          padding: 15px;
          border-radius: 16px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
        }
        .btn-google:hover:not(:disabled) {
          background: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }
        .btn-google:active:not(:disabled) { transform: scale(0.98); }
        .btn-google:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Primary — gold accent */
        .btn-primary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, #3A4DFF 0%, #2D3DE6 100%);
          color: #FFFFFF;
          padding: 15px;
          border-radius: 16px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(58,77,255,0.35);
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%);
          pointer-events: none;
        }
        /* Sweeping shimmer */
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0; left: -130%;
          width: 55%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: skewX(-18deg);
          animation: btnSweep 5s 1.2s infinite;
        }
        @keyframes btnSweep {
          0%   { left: -130%; }
          18%  { left: 150%; }
          100% { left: 150%; }
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(58,77,255,0.5);
        }
        .btn-primary:active:not(:disabled) { transform: scale(0.98); }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

        /* Facebook — brand blue treatment */
        .btn-facebook {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #1877F2;
          color: #FFFFFF;
          padding: 15px;
          border-radius: 16px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(24,119,242,0.35);
        }
        .btn-facebook:hover:not(:disabled) {
          background: #2D88FF;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(24,119,242,0.45);
        }
        .btn-facebook:active:not(:disabled) { transform: scale(0.98); }
        .btn-facebook:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-secondary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: rgba(255,255,255,0.04);
          color: #A8B4C2;
          padding: 15px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, transform 0.15s, border-color 0.2s;
        }
        .btn-secondary:hover:not(:disabled) {
          background: rgba(255,255,255,0.08);
          color: #F0F4FF;
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-1px);
        }
        .btn-secondary:active:not(:disabled) { transform: scale(0.98); }
        .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Gold CTA — for the "play" action that matters most */
        .btn-gold {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, #FFD166 0%, #FFC857 100%);
          color: #1A1200;
          padding: 15px;
          border-radius: 16px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(255,200,87,0.3);
        }
        .btn-gold::before {
          content: '';
          position: absolute;
          top: 0; left: -130%;
          width: 55%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: skewX(-18deg);
          animation: btnSweep 4s 0.5s infinite;
        }
        .btn-gold:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(255,200,87,0.45);
        }
        .btn-gold:active:not(:disabled) { transform: scale(0.98); }
        .btn-gold:disabled { opacity: 0.55; cursor: not-allowed; }

        .btn-back {
          background: transparent;
          border: none;
          color: #FF5A5A;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          padding: 0;
          margin-bottom: 20px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s, text-shadow 0.2s, transform 0.15s;
          letter-spacing: 0.01em;
          text-shadow: 0 0 12px rgba(255, 90, 90, 0.7);
        }
        .btn-back:hover {
          color: #FF5A5A;
          transform: translateX(-2px);
          text-shadow: 0 0 16px rgba(255, 90, 90, 0.9);
        }

        /* ── Spacing utils ── */
        .mt-3 { margin-top: 12px; }
        .mt-4 { margin-top: 14px; }

        /* ── View typography ── */
        .view-title {
          margin: 0 0 6px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #F0F4FF;
          letter-spacing: -0.5px;
        }
        .view-desc {
          margin: 0 0 22px;
          font-size: 13.5px;
          color: #8896A7;
          line-height: 1.6;
        }

        /* ── Divider ── */
        .divider {
          display: flex;
          align-items: center;
          margin: 20px 0;
          gap: 12px;
        }
        .divider .line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }
        .divider .text {
          color: #4A5568;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
        }

        /* ── Footer links ── */
        .footer-links {
          margin-top: 20px;
          text-align: center;
        }
        .link-text {
          color: #FFC857;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 1px solid transparent;
          transition: color 0.2s, border-color 0.2s, text-shadow 0.2s, transform 0.1s;
        }
        .link-text:hover, .link-text:active {
          border-color: rgba(255,200,87,0.8);
          text-shadow: 0 0 12px rgba(255,200,87,0.8);
        }
        .link-text:active {
          transform: scale(0.98);
        }

        /* ── Inputs ── */
        .input-group {
          margin-bottom: 16px;
        }
        .input-group label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #8896A7;
          margin-bottom: 7px;
          text-transform: uppercase;
          letter-spacing: 0.09em;
        }
        .input-group input {
          width: 100%;
          background: rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.08);
          color: #F0F4FF;
          padding: 13px 15px;
          border-radius: 13px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .input-group input:focus {
          border-color: rgba(255,200,87,0.5);
          box-shadow: 0 0 0 3px rgba(255,200,87,0.1);
          background: rgba(0,0,0,0.5);
        }
        .input-group input::placeholder { color: #3D4A5A; }
        .input-row { display: flex; gap: 10px; }

        /* ── Username hint ── */
        .username-hint {
          font-size: 12.5px;
          color: #8896A7;
          margin: -8px 0 18px;
          line-height: 1.4;
        }
        .username-hint strong {
          color: #FFC857;
          font-weight: 600;
        }

        /* ── Alerts ── */
        .alert-error {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.25);
          color: #FC8181;
          padding: 11px 15px;
          border-radius: 13px;
          font-size: 13.5px;
          margin-bottom: 18px;
          font-weight: 500;
          line-height: 1.4;
        }
        .alert-success {
          background: rgba(52,211,153,0.08);
          border: 1px solid rgba(52,211,153,0.25);
          color: #6EE7B7;
          padding: 11px 15px;
          border-radius: 13px;
          font-size: 13.5px;
          margin-bottom: 18px;
          font-weight: 500;
        }

        /* ── View enter animation ── */
        .view-animate {
          animation: viewIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes viewIn {
          from { opacity: 0; transform: translateX(8px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* ── Spinner ── */
        .premium-spinner {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2.5px solid rgba(58,77,255,0.12);
          border-top-color: #3A4DFF;
          border-right-color: #FFC857;
          animation: spin 0.85s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Noise texture overlay ── */
        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          pointer-events: none;
          z-index: 2;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        /* ── Section label for upgrade flow ── */
        .upgrade-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(58,77,255,0.12);
          border: 1px solid rgba(58,77,255,0.25);
          color: #7B8FFF;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 100px;
          margin-bottom: 18px;
        }
      `}</style>

      <div className="mobile-app-container">
        <div className="mobile-frame">
          {/* Background */}
          <div className="bg-mesh" />
          <div className="noise-overlay" />

          {/* Floating suit particles */}
          {particles.map((p, i) => (
            <SuitParticle key={i} suit={p.suit} style={p.style} />
          ))}

          <div className="scroll-content">
            {/* Logo */}
            <div className="logo-section">
              <div
                className="logo-card-wrap"
                onClick={() => setCardFlipped(f => !f)}
                title="Click to flip"
              >
                <div className={`logo-card-inner${cardFlipped ? ' flipped' : ''}`}>
                  <div className="logo-card-face front">🃏</div>
                  <div className="logo-card-face back">🎴</div>
                </div>
              </div>

              <h1 className="logo-title">LeastScore</h1>

              {view === 'oauth-username' ? (
                <p className="logo-subtitle">Set your username for {oauthProvider}</p>
              ) : upgradeGuestSessionId ? (
                <p className="logo-subtitle">Link your account to save stats</p>
              ) : (
                <>
                  <div className="logo-badge">
                    <span>♠</span> The card game where less wins
                  </div>
                </>
              )}
            </div>

            {/* Card */}
            <div className="card-surface">
              {error && <div className="alert-error">{error}</div>}
              {success && <div className="alert-success">{success}</div>}

              {/* ── MAIN VIEW ── */}
              {view === 'main' && (
                <div className="view-animate">
                  {upgradeGuestSessionId && (
                    <div className="upgrade-badge">⬆ Upgrade account</div>
                  )}

                  <button className="btn-google" onClick={() => handleOAuth('google')} disabled={loading}>
                    <GoogleIcon /> Continue with Google
                  </button>

                  <button className="btn-facebook mt-3" onClick={() => handleOAuth('facebook')} disabled={loading}>
                    <FacebookIcon /> Continue with Facebook
                  </button>

                  {!upgradeGuestSessionId && (
                    <>
                      <div className="divider">
                        <span className="line" />
                        <span className="text">OR</span>
                        <span className="line" />
                      </div>

                      <button className="btn-secondary" onClick={() => changeView('guest')} disabled={loading}>
                        <span>👤</span> Play as Guest
                      </button>

                      <div className="footer-links">
                        <span className="link-text" onClick={() => changeView('login')}>
                          Login with username & password
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── GUEST VIEW ── */}
              {view === 'guest' && (
                <div className="view-animate">
                  <button className="btn-back" onClick={() => changeView('main')}>← Back</button>
                  <h2 className="view-title">Guest Login</h2>
                  <p className="view-desc">
                    Play without an account. Your username will be reserved while you're connected.
                  </p>
                  <div className="input-row">
                    <div style={{ flex: 2 }}><Field label="Name" value={guestName} onChange={setGuestName} placeholder="YourName" maxLength={20} /></div>
                    <div style={{ flex: 1 }}><Field label="#ID" value={guestTag} onChange={v => setGuestTag(v.toUpperCase())} placeholder="AB12" maxLength={4} /></div>
                  </div>
                  {usernameHint(guestName, guestTag)}
                  <button className="btn-primary mt-4" onClick={handleGuest} disabled={loading || !guestName || guestTag.length < 4}>
                    {loading ? 'Joining…' : 'Play as Guest 🎮'}
                  </button>
                </div>
              )}

              {/* ── LOGIN VIEW ── */}
              {view === 'login' && (
                <div className="view-animate">
                  <button className="btn-back" onClick={() => changeView('main')}>← Back</button>
                  <h2 className="view-title">Account Login</h2>
                  <p className="view-desc">Log in with your username and password.</p>
                  <Field label="Username (Name#ID)" value={loginUser} onChange={setLoginUser} placeholder="e.g. Altius#AB12" autoComplete="username" />
                  <Field label="Password" type="password" value={loginPass} onChange={setLoginPass} placeholder="Your password" autoComplete="current-password" />
                  <button className="btn-primary mt-4" onClick={handleLogin} disabled={loading || !loginUser || !loginPass}>
                    {loading ? 'Logging in…' : 'Log In'}
                  </button>
                </div>
              )}

              {/* ── OAUTH USERNAME VIEW ── */}
              {view === 'oauth-username' && (
                <div className="view-animate">
                  <h2 className="view-title">Almost there!</h2>
                  <p className="view-desc">
                    Pick a unique username to complete your <strong style={{ color: '#F0F4FF', textTransform: 'capitalize' }}>{oauthProvider}</strong> sign-up.
                  </p>
                  <div className="input-row">
                    <div style={{ flex: 2 }}><Field label="Name" value={regName} onChange={setRegName} placeholder="YourName" maxLength={20} /></div>
                    <div style={{ flex: 1 }}><Field label="#ID" value={regTag} onChange={v => setRegTag(v.toUpperCase())} placeholder="AB12" maxLength={4} /></div>
                  </div>
                  {usernameHint(regName, regTag)}
                  <button className="btn-gold" onClick={handleOAuthUsername} disabled={loading || !regName || regTag.length < 4}>
                    {loading ? 'Saving…' : 'Set Username & Play 🎮'}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}