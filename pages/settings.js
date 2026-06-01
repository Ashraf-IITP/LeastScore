import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { loadSoundSettings, saveSoundSettings, DEFAULT_SOUND_SETTINGS } from '../lib/soundSettings';
import { playBGM, setBGMVolume } from '../lib/bgm';


export default function SettingsPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [tag, setTag] = useState('');
  const [authProvider, setAuthProvider] = useState('');
  const [soundSettings, setSoundSettings] = useState(DEFAULT_SOUND_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');



  // Sounds
  useEffect(() => {
    const playClickSound = (e) => {
      const target = e.target.closest('button, .link-text, .logo-card-wrap');
      if (target) {
        const audio = new Audio('/sound/touch%20sound.wav');
        const settings = loadSoundSettings();
        audio.volume = Math.min(1, Math.max(0, settings.clickVolume / 100));
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

  // Update real-time volume when user tweaks slider
  useEffect(() => {
    setBGMVolume(soundSettings.homeVolume / 100);
  }, [soundSettings.homeVolume]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data?.user) {
          router.replace('/login');
          return;
        }
        setDisplayName(data.user.display_name || '');
        setTag((data.user.tag || '').toUpperCase());
        setAuthProvider(data.user.auth_provider || '');
        setSoundSettings(loadSoundSettings());
      })
      .catch(() => {
        router.replace('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const cancel = () => {
    router.push('/');
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

  return (
    <>
      <Head>
        <title>Settings — LeastScore</title>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="mobile-app-container">
        <div className="mobile-frame">
          <div className="bg-mesh" />
          <div className="noise-overlay" />

          {/* Suit particles */}
          <div className="suit-particle" style={{ top: '8%', left: '6%', animationDelay: '0s', animationDuration: '18s', fontSize: '22px', opacity: 0.12 }}>♠</div>
          <div className="suit-particle" style={{ top: '15%', right: '8%', animationDelay: '3s', animationDuration: '22s', fontSize: '16px', opacity: 0.09, color: '#FF6B6B' }}>♥</div>
          <div className="suit-particle" style={{ top: '55%', left: '4%', animationDelay: '6s', animationDuration: '20s', fontSize: '18px', opacity: 0.1, color: '#FF6B6B' }}>♦</div>
          <div className="suit-particle" style={{ top: '70%', right: '5%', animationDelay: '1.5s', animationDuration: '25s', fontSize: '20px', opacity: 0.11 }}>♣</div>

          <div className="scroll-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card-surface" style={{ width: '100%', maxWidth: '520px' }}>
              <button className="btn-back" onClick={cancel}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <h1 className="view-title">Settings</h1>
              <p className="view-desc">Update your profile and audio levels.</p>

              <div className="settings-section" style={{ marginBottom: '12px' }}>
                <p className="settings-section-title">Profile</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#F0F4FF' }}>{displayName} <span style={{ color: '#8896A7' }}>#{tag}</span></div>
                  </div>
                  <button onClick={() => router.push('/change-name')} className="btn-gold" style={{ padding: '8px 16px', fontSize: '13px', margin: 0, width: 'auto' }}>
                    Edit
                  </button>
                </div>
              </div>

              {/* Change Password row — local accounts only */}
              {authProvider === 'local' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#F0F4FF' }}>🔒 Change Password</div>
                    <div style={{ fontSize: '12px', color: '#8896A7', marginTop: '2px' }}>Update your login password</div>
                  </div>
                  <button onClick={() => router.push('/change-password')} className="btn-gold" style={{ padding: '8px 16px', fontSize: '13px', margin: 0, width: 'auto' }}>
                    Update
                  </button>
                </div>
              )}
              <br></br>

              <div className="settings-section">
                <p className="settings-section-title">Sound Levels</p>

                <div className="settings-slider-row">
                  <label>Home screen song</label>
                  <span>{soundSettings.homeVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soundSettings.homeVolume}
                  onChange={(e) => {
                    const newSettings = { ...soundSettings, homeVolume: Number(e.target.value) };
                    setSoundSettings(newSettings);
                    saveSoundSettings(newSettings);
                  }}
                />
                <p className="settings-note">Controls the music volume on the home screen and menu areas.</p>

                <div className="settings-slider-row">
                  <label>Click & notification sound</label>
                  <span>{soundSettings.clickVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soundSettings.clickVolume}
                  onChange={(e) => {
                    const newSettings = { ...soundSettings, clickVolume: Number(e.target.value) };
                    setSoundSettings(newSettings);
                    saveSoundSettings(newSettings);
                  }}
                />
                <p className="settings-note">Controls button clicks, menu taps, and friend/party notification sounds.</p>

                <div className="settings-slider-row">
                  <label>In-game sound</label>
                  <span>{soundSettings.gameVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soundSettings.gameVolume}
                  onChange={(e) => {
                    const newSettings = { ...soundSettings, gameVolume: Number(e.target.value) };
                    setSoundSettings(newSettings);
                    saveSoundSettings(newSettings);
                  }}
                />
                <p className="settings-note">Controls round win/loss, elimination, disconnected, and other gameplay audio.</p>
              </div>

              {error && <div className="alert-error view-animate">{error}</div>}

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

        .settings-section {
          margin-bottom: 24px;
        }
        .settings-section-title {
          margin: 0 0 16px;
          color: #F0F4FF;
          font-size: 14px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 700;
        }

        .settings-slider-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
          color: #F0F4FF;
          font-size: 14px;
          font-weight: 600;
        }
        input[type='range'] {
          width: 100%;
          accent-color: #FFC857;
          margin-bottom: 10px;
        }
        .settings-note {
          margin: 0 0 18px;
          color: #8896A7;
          font-size: 12.5px;
          line-height: 1.45;
        }

        .settings-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
          margin-top: 10px;
        }
        .settings-actions button {
          flex: 1;
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

        /* ── Buttons ── */
        .btn-gold {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, #FFD166 0%, #FFC857 100%);
          color: #1A1200;
          padding: 14px 18px;
          border-radius: 14px;
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: rgba(255,255,255,0.04);
          color: #A8B4C2;
          padding: 14px 18px;
          border-radius: 14px;
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

        .pw-wrap { position: relative; display: flex; align-items: center; }
        .pw-field {
          width: 100%;
          background: rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.08);
          color: #F0F4FF;
          padding: 13px 44px 13px 15px;
          border-radius: 13px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .pw-field:focus {
          border-color: rgba(255,200,87,0.5);
          box-shadow: 0 0 0 3px rgba(255,200,87,0.1);
          background: rgba(0,0,0,0.5);
        }
        .pw-field::placeholder { color: #3D4A5A; }
        .pw-eye {
          position: absolute; right: 12px;
          background: none; border: none;
          color: #8896A7; cursor: pointer;
          font-size: 16px; padding: 4px; line-height: 1;
          transition: color 0.2s;
        }
        .pw-eye:hover { color: #F0F4FF; }
        .pw-strength { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
        .pw-bars { display: flex; gap: 4px; flex: 1; }
        .pw-bar { height: 4px; flex: 1; border-radius: 4px; transition: background 0.3s; }
        .pw-label { font-size: 11px; font-weight: 600; }
      `}</style>
    </>
  );
}

