// pages/reset-password.js — Forced password reset after using a temp password
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');

  // Guard: only users with mustResetPassword flag may access this page
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.user || d.user.type !== 'registered') {
          router.replace('/login');
          return;
        }
        if (!d.user.mustResetPassword) {
          router.replace('/');
          return;
        }
        setUsername(d.user.username || '');
        setChecking(false);
      })
      .catch(() => router.replace('/login'));
  }, []);

  const handleSubmit = async () => {
    setError('');
    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    setLoading(true);
    try {
      const r = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });
      const d = await r.json();
      if (d.error) { setError(d.error); setLoading(false); return; }
      router.replace('/');
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = newPassword;
    if (!p) return null;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    if (s <= 1) return { label: 'Weak', color: '#EF4444', bars: 1 };
    if (s <= 3) return { label: 'Fair', color: '#F59E0B', bars: 2 };
    if (s <= 4) return { label: 'Good', color: '#3A4DFF', bars: 3 };
    return { label: 'Strong', color: '#10B981', bars: 4 };
  })();

  if (checking) return (
    <div className="rp-container">
      <div className="rp-frame" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="rp-spinner" />
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Set New Password — LeastScore</title>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #07090F; }

        .rp-container {
          min-height: 100vh;
          background: #07090F;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
        }

        .rp-frame {
          width: 100%;
          min-height: 100vh;
          background: #0D1117;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .rp-frame::-webkit-scrollbar { display: none; }

        @media (min-width: 600px) {
          .rp-frame {
            max-width: 420px;
            min-height: 820px;
            height: 92vh;
            border-radius: 44px;
            box-shadow:
              0 40px 100px rgba(0,0,0,0.7),
              0 0 0 1px rgba(255,255,255,0.04),
              0 0 160px rgba(58,77,255,0.08);
          }
        }

        .rp-bg-mesh {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 70% 50% at 20% 10%, rgba(58,77,255,0.16) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 90% 90%, rgba(16,185,129,0.08) 0%, transparent 65%);
        }

        .rp-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 10;
          padding: 40px 28px 48px;
          justify-content: center;
        }

        /* ── Header ── */
        .rp-header {
          text-align: center;
          margin-bottom: 36px;
        }
        .rp-icon {
          font-size: 52px;
          margin-bottom: 16px;
          display: block;
          animation: iconPop 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes iconPop {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        .rp-title {
          margin: 0 0 8px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          color: #F0F4FF;
          letter-spacing: 2px;
        }
        .rp-subtitle {
          margin: 0;
          font-size: 13.5px;
          color: #8896A7;
          line-height: 1.6;
        }
        .rp-user-badge {
          display: inline-block;
          margin-top: 10px;
          background: rgba(255,200,87,0.09);
          border: 1px solid rgba(255,200,87,0.22);
          color: #FFC857;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 100px;
          letter-spacing: 0.05em;
        }

        /* ── Warning banner ── */
        .rp-warning {
          background: rgba(245,158,11,0.08);
          border: 1px solid rgba(245,158,11,0.25);
          border-radius: 14px;
          padding: 14px 16px;
          margin-bottom: 24px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .rp-warning-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
        .rp-warning-text { font-size: 13px; color: #FCD34D; line-height: 1.55; }

        /* ── Card ── */
        .rp-card {
          background: rgba(255,255,255,0.028);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 28px;
          padding: 28px 24px;
          box-shadow: 0 24px 48px rgba(0,0,0,0.5);
          backdrop-filter: blur(24px);
          animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Input group ── */
        .rp-input-group { margin-bottom: 18px; }
        .rp-input-group label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #8896A7;
          margin-bottom: 7px;
          text-transform: uppercase;
          letter-spacing: 0.09em;
        }
        .rp-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .rp-input-wrap input {
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
        }
        .rp-input-wrap input:focus {
          border-color: rgba(58,77,255,0.5);
          box-shadow: 0 0 0 3px rgba(58,77,255,0.1);
          background: rgba(0,0,0,0.5);
        }
        .rp-input-wrap input::placeholder { color: #3D4A5A; }
        .rp-eye-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #8896A7;
          cursor: pointer;
          font-size: 17px;
          padding: 4px;
          line-height: 1;
          transition: color 0.2s;
        }
        .rp-eye-btn:hover { color: #F0F4FF; }

        /* ── Strength bar ── */
        .rp-strength {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rp-strength-bars {
          display: flex;
          gap: 4px;
          flex: 1;
        }
        .rp-strength-bar {
          height: 4px;
          flex: 1;
          border-radius: 4px;
          background: rgba(255,255,255,0.07);
          transition: background 0.3s;
        }
        .rp-strength-bar.active { background: var(--sc); }
        .rp-strength-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        /* ── Match indicator ── */
        .rp-match {
          font-size: 12px;
          margin-top: 7px;
          font-weight: 500;
          min-height: 18px;
        }
        .rp-match.ok  { color: #10B981; }
        .rp-match.err { color: #EF4444; }

        /* ── Alert ── */
        .rp-alert-error {
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

        /* ── Button ── */
        .rp-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #3A4DFF 0%, #2D3DE6 100%);
          color: #fff;
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
          margin-top: 8px;
        }
        .rp-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(58,77,255,0.5);
        }
        .rp-btn:active:not(:disabled) { transform: scale(0.98); }
        .rp-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .rp-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -130%;
          width: 55%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: skewX(-18deg);
          animation: btnSweep 5s 1s infinite;
        }
        @keyframes btnSweep {
          0%  { left: -130%; }
          18% { left: 150%; }
          100%{ left: 150%; }
        }

        /* ── Spinner ── */
        .rp-spinner {
          width: 44px; height: 44px;
          border-radius: 50%;
          border: 2.5px solid rgba(58,77,255,0.12);
          border-top-color: #3A4DFF;
          border-right-color: #FFC857;
          animation: spin 0.85s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="rp-container">
        <div className="rp-frame">
          <div className="rp-bg-mesh" />
          <div className="rp-content">

            <div className="rp-header">
              <span className="rp-icon">🔐</span>
              <h1 className="rp-title">Set New Password</h1>
              <p className="rp-subtitle">You logged in with a temporary password.<br />Create a permanent one to continue.</p>
              {username && <div className="rp-user-badge">👤 {username}</div>}
            </div>

            <div className="rp-warning">
              <span className="rp-warning-icon">⚠️</span>
              <p className="rp-warning-text">
                For security, you must set a new password before accessing the game.
                Choose something you haven't used before.
              </p>
            </div>

            <div className="rp-card">
              {error && <div className="rp-alert-error">{error}</div>}

              {/* New password */}
              <div className="rp-input-group">
                <label>New Password</label>
                <div className="rp-input-wrap">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                  />
                  <button className="rp-eye-btn" onClick={() => setShowNew(v => !v)} type="button">
                    {showNew ? '🙈' : '👁️'}
                  </button>
                </div>
                {strength && (
                  <div className="rp-strength">
                    <div className="rp-strength-bars">
                      {[1, 2, 3, 4].map(n => (
                        <div
                          key={n}
                          className={`rp-strength-bar${n <= strength.bars ? ' active' : ''}`}
                          style={{ '--sc': strength.color }}
                        />
                      ))}
                    </div>
                    <span className="rp-strength-label" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="rp-input-group">
                <label>Confirm Password</label>
                <div className="rp-input-wrap">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your new password"
                    autoComplete="new-password"
                  />
                  <button className="rp-eye-btn" onClick={() => setShowConfirm(v => !v)} type="button">
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {confirmPassword && (
                  <p className={`rp-match ${newPassword === confirmPassword ? 'ok' : 'err'}`}>
                    {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              <button
                className="rp-btn"
                onClick={handleSubmit}
                disabled={
                  loading ||
                  newPassword.length < 6 ||
                  newPassword !== confirmPassword
                }
              >
                {loading ? 'Saving…' : '🔒 Save New Password'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
