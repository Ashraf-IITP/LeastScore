import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { playBGM } from '../lib/bgm';
import { loadSoundSettings, getVolumeForCategory } from '../lib/soundSettings';
import { apiFetch } from '../lib/apiFetch';

function Field({ label, type = 'text', value, onChange, placeholder, maxLength, autoComplete }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
      />
    </div>
  );
}

const SuitParticle = ({ suit, style }) => (
  <div className="suit-particle" style={style}>
    {suit}
  </div>
);

export default function ChangeNamePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [authProvider, setAuthProvider] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    const playClickSound = (e) => {
      const target = e.target.closest('button, .link-text, .logo-card-wrap');
      if (target) {
        const audio = new Audio('/sound/touch%20sound.wav');
        const settings = loadSoundSettings();
        audio.volume = getVolumeForCategory(settings, 'click');
        audio.play().catch(() => { });
      }
    };
    document.addEventListener('click', playClickSound);
    return () => document.removeEventListener('click', playClickSound);
  }, []);

  useEffect(() => {
    const onInteract = () => {
      playBGM();
      document.removeEventListener('click', onInteract);
      document.removeEventListener('keydown', onInteract);
      document.removeEventListener('touchstart', onInteract);
      document.removeEventListener('scroll', onInteract);
      document.removeEventListener('touchmove', onInteract);
      document.removeEventListener('wheel', onInteract);
    };

    playBGM();
    document.addEventListener('click', onInteract);
    document.addEventListener('keydown', onInteract);
    document.addEventListener('touchstart', onInteract);
    document.addEventListener('scroll', onInteract);
    document.addEventListener('touchmove', onInteract);
    document.addEventListener('wheel', onInteract);

    return () => {
      document.removeEventListener('click', onInteract);
      document.removeEventListener('keydown', onInteract);
      document.removeEventListener('touchstart', onInteract);
      document.removeEventListener('scroll', onInteract);
      document.removeEventListener('touchmove', onInteract);
      document.removeEventListener('wheel', onInteract);
    };
  }, []);

  useEffect(() => {
    apiFetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data?.user) {
          router.replace('/login');
          return;
        }
        setFirstName(data.user.first_name || '');
        setLastName(data.user.last_name || '');
        setNickname(data.user.nickname || '');
        setAuthProvider(data.user.type || '');
      })
      .catch(() => {
        router.replace('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const saveChanges = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await apiFetch('/api/auth/settings', {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, nickname }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Unable to update profile.');
        setSaving(false);
        return;
      }
      setSuccess('Profile updated! Redirecting…');
      setTimeout(() => router.push('/settings'), 500);
    } catch (err) {
      console.error(err);
      setError('Unable to update profile.');
      setSaving(false);
    }
  };

  const cancel = () => {
    router.push('/settings');
  };

  if (loading) {
    return (
      <div className="mobile-app-container">
        <div className="mobile-frame" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div className="premium-spinner" />
        </div>
      </div>
    );
  }

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
        <title>Update Profile — LeastScore</title>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="mobile-app-container">
        <div className="mobile-frame">
          <div className="bg-mesh" />
          <div className="noise-overlay" />
          
          {particles.map((p, i) => (
            <SuitParticle key={i} suit={p.suit} style={p.style} />
          ))}

          <div className="scroll-content">
            <div className="logo-section">
              <div className="logo-card-wrap" onClick={() => setCardFlipped(f => !f)} title="Click to flip">
                <div className={`logo-card-inner${cardFlipped ? ' flipped' : ''}`}>
                  <div className="logo-card-face front">🃏</div>
                  <div className="logo-card-face back">🎴</div>
                </div>
              </div>

              <h1 className="logo-title">LeastScore</h1>
            </div>

            <div className="card-surface">
              <div className="view-animate">
                <h2 className="view-title">Update Profile</h2>
                <p className="view-desc">
                    Update your name and nickname.
                  </p>
                {authProvider !== 'guest' && <div className="input-row mt-4" style={{ marginTop: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <Field label="First Name" value={firstName} onChange={setFirstName} placeholder="John" maxLength={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Field label="Last Name" value={lastName} onChange={setLastName} placeholder="Doe" maxLength={20} />
                  </div>
                </div>}
                <div className="input-group">
                  <Field label="Nickname" value={nickname} onChange={setNickname} placeholder="Johnny" maxLength={20} />
                </div>
                <p className="field-hint">Names and nickname must be up to 20 characters.</p>

                {error && <div className="alert-error view-animate">{error}</div>}
                {success && <div className="alert-success view-animate">{success}</div>}

                <button className="btn-gold mt-4" type="button" onClick={saveChanges} disabled={saving || (authProvider !== 'guest' && !firstName) || !nickname}>
                  {saving ? 'Saving…' : 'Save Changes 🎮'}
                </button>
                <button className="btn-secondary mt-3" type="button" onClick={cancel} disabled={saving} style={{ marginTop: '12px' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #07090F; }

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

        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          pointer-events: none;
          z-index: 2;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

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

        .view-title {
          margin: 0 0 6px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px;
          font-weight: 400;
          color: #F0F4FF;
          letter-spacing: 1px;
        }
        .view-desc {
          margin: 0 0 16px;
          font-size: 13.5px;
          color: #8896A7;
          line-height: 1.6;
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
        .input-row { display: flex; gap: 10px; }
        .field-hint {
          font-size: 12.5px;
          color: #A8B6CC;
          margin: -6px 0 14px;
          line-height: 1.45;
        }

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

        /* ── Buttons ── */
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
        @keyframes btnSweep {
          0%   { left: -130%; }
          18%  { left: 150%; }
          100% { left: 150%; }
        }
        .btn-gold:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(255,200,87,0.45);
        }
        .btn-gold:active:not(:disabled) { transform: scale(0.98); }
        .btn-gold:disabled { opacity: 0.55; cursor: not-allowed; }

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
      `}</style>
    </>
  );
}
