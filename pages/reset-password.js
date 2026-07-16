// pages/reset-password.js — Forced password reset after using a temp password
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { apiFetch } from '../lib/apiFetch';
import { saveToken } from '../lib/tokenStorage';

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
    apiFetch('/api/auth/me')
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
        setUsername(d.user.displayName || d.user.nickname || d.user.email || '');
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
      const r = await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ newPassword, confirmPassword }),
      });
      const d = await r.json();
      if (d.error) { setError(d.error); setLoading(false); return; }
      if (d.token) saveToken(d.token);
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
        
        /* ── Light Theme Overrides ── */
        [data-theme="light"] body,
        [data-theme="light"] .rp-container { background: #0F2318; }
        [data-theme="light"] .rp-frame {
          background:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M13 18 C13 15 11 13 8.5 13 C6 13 4 15.5 4 18 C4 21 8.5 26 13 30 C17.5 26 22 21 22 18 C22 15.5 20 13 17.5 13 C15 13 13 15 13 18 Z' fill='%23000' opacity='0.13'/%3E%3Cpath d='M53 10 C53 10 44 17 44 22 C44 25 46.5 27 49.5 26.5 C48 28.5 47 30 47 30 L59 30 C59 30 58 28.5 56.5 26.5 C59.5 27 62 25 62 22 C62 17 53 10 53 10 Z' fill='%23000' opacity='0.13'/%3E%3Ccircle cx='13' cy='55' r='4.5' fill='%23000' opacity='0.13'/%3E%3Ccircle cx='18.5' cy='62' r='4.5' fill='%23000' opacity='0.13'/%3E%3Ccircle cx='7.5' cy='62' r='4.5' fill='%23000' opacity='0.13'/%3E%3Crect x='11' y='63' width='4' height='6' rx='1' fill='%23000' opacity='0.13'/%3E%3Cpath d='M53 50 L60 60 L53 70 L46 60 Z' fill='%23000' opacity='0.13'/%3E%3C/svg%3E") repeat,
            radial-gradient(ellipse 110% 55% at 50% 0%,   #2E7D4F 0%, transparent 60%),
            radial-gradient(ellipse 80%  50% at 100% 40%,  #1B5C38 0%, transparent 55%),
            radial-gradient(ellipse 70%  45% at 0%   70%,  #163E28 0%, transparent 55%),
            radial-gradient(ellipse 90%  60% at 50% 100%,  #0D2B1A 0%, transparent 70%),
            linear-gradient(175deg, #1E4D32 0%, #142D1E 40%, #0F2318 100%);
        }
        [data-theme="light"] .rp-bg-mesh {
          background:
            radial-gradient(ellipse 65% 45% at 95% 5%,  rgba(214,59,59,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 55% 40% at 5%  95%, rgba(93,201,138,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 80% 85%, rgba(46,125,82,0.18)  0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 20% 20%, rgba(30,77,50,0.22)   0%, transparent 55%);
        }
        [data-theme="light"] .rp-title { color: #D8F0E0; }
        [data-theme="light"] .rp-subtitle { color: #ffc439; }
        [data-theme="light"] .rp-user-badge {
          background: linear-gradient(135deg, rgba(200,150,10,0.18), rgba(248,224,112,0.12));
          border-color: rgba(255,204,65,0.4);
          color: #ffc439;
          text-shadow: 0 1px 2px rgba(200,150,10,0.15);
        }
        [data-theme="light"] .rp-warning {
          background: rgba(245,158,11,0.10);
          border-color: rgba(245,158,11,0.30);
        }
        [data-theme="light"] .rp-warning-text { color: #A0700A; font-weight: 600; }
        [data-theme="light"] .rp-card {
          background: linear-gradient(160deg, #D8F0E0 0%, #E4F5EA 100%);
          border: 1px solid rgba(13,33,24,0.10);
          box-shadow: 0 1px 0 rgba(255,255,255,1.0) inset, 0 -1px 0 rgba(13,33,24,0.06) inset, 0 16px 40px rgba(0,0,0,0.24);
        }
        [data-theme="light"] .rp-back { color: #D8F0E0; text-shadow: none; }
        [data-theme="light"] .rp-back:hover { color: #FFFFFF; text-shadow: none; }
        [data-theme="light"] .rp-input-group label { color: #5A8C72; }
        [data-theme="light"] .rp-input-wrap input {
          background: linear-gradient(160deg, #F2FBF5, #FEFFFD);
          border: 1px solid rgba(13,33,24,0.12);
          color: #0D2118;
        }
        [data-theme="light"] .rp-input-wrap input:focus {
          border-color: rgba(58,158,104,0.70);
          box-shadow: 0 0 0 3px rgba(58,158,104,0.14);
          background: linear-gradient(160deg, #F2FBF5, #FEFFFD);
        }
        [data-theme="light"] .rp-input-wrap input::placeholder { color: #8ABEA4; }
        [data-theme="light"] .rp-eye-btn { color: #5A8C72; }
        [data-theme="light"] .rp-eye-btn:hover { color: #0D2118; }
        [data-theme="light"] .rp-btn {
          background: linear-gradient(135deg, #E0AD18 0%, #A0700A 100%);
          color: #FFFBE8;
          box-shadow: 0 4px 16px rgba(160,112,10,0.48);
          text-shadow: 0 1px 2px rgba(100,65,0,0.35);
        }
        [data-theme="light"] .rp-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #F0C832 0%, #C8960A 100%);
          box-shadow: 0 8px 24px rgba(160,112,10,0.55);
        }
        [data-theme="light"] .rp-btn:disabled {
          background: linear-gradient(160deg, #C8DED2, #B8D0C4);
          color: #8ABEA4;
          box-shadow: none;
        }
        [data-theme="light"] .rp-spinner {
          border: 2.5px solid rgba(30,77,48,0.14);
          border-top-color: #3A9E68;
          border-right-color: #E0AD18;
        }
        [data-theme="light"] .rp-strength-bar { background: rgba(13,33,24,0.08); }
        [data-theme="light"] .rp-alert-error {
          background: rgba(214,59,59,0.09);
          border: 1px solid rgba(214,59,59,0.26);
          color: #B82E2E;
        }
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
