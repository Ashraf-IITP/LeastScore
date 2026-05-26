import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; background: #07090F; }

  /* ── Layout ── */
  .ls-container {
    min-height: 100vh;
    background: #07090F;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
  }

  .ls-frame {
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
  .ls-frame::-webkit-scrollbar { display: none; }

  @media (min-width: 600px) {
    .ls-frame {
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

  /* Wide frame for main menu */
  @media (min-width: 900px) {
    .ls-frame-wide {
      max-width: 860px;
    }
  }

  /* ── Background mesh ── */
  .ls-bg-mesh {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse 70% 50% at 90% 5%, rgba(58,77,255,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 10% 95%, rgba(255,200,87,0.10) 0%, transparent 65%),
      radial-gradient(ellipse 40% 30% at 50% 50%, rgba(58,77,255,0.04) 0%, transparent 80%);
  }

  /* ── Noise texture overlay ── */
  .ls-noise {
    position: absolute;
    inset: 0;
    opacity: 0.025;
    pointer-events: none;
    z-index: 2;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    background-size: 200px 200px;
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
  .ls-scroll {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 10;
    padding: 24px 28px 40px;
  }

  /* ── Logo section ── */
  .ls-logo-section {
    text-align: center;
    margin: 60px 0 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* 3D card flip — mirrors login.js exactly */
  .ls-logo-card-wrap {
    perspective: 400px;
    display: inline-block;
    margin-bottom: 20px;
    cursor: pointer;
  }
  .ls-logo-card-inner {
    width: 56px;
    height: 56px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    margin: 0 auto;
  }
  .ls-logo-card-inner.flipped {
    transform: rotateY(180deg);
  }
  .ls-logo-card-face {
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
  .ls-logo-card-face.back {
    transform: rotateY(180deg);
  }

  .ls-logo-title {
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
  .ls-logo-title::after {
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
  .ls-logo-badge {
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
  .ls-logo-sub {
    margin: 12px auto 0;
    color: #8896A7;
    font-size: 14px;
    line-height: 1.6;
    max-width: 240px;
    font-weight: 400;
  }

  /* ── Card surface — mirrors login.js .card-surface ── */
  .ls-card {
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
  .ls-card + .ls-card { margin-top: 16px; }

  /* ── Section title / desc inside card ── */
  .ls-section-title {
    margin: 0 0 6px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    color: #F0F4FF;
    letter-spacing: 1px;
  }
  .ls-section-desc {
    margin: 0 0 22px;
    font-size: 13.5px;
    color: #8896A7;
    line-height: 1.6;
  }

  /* ── Buttons ── */
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
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(58,77,255,0.5);
  }
  .btn-primary:active:not(:disabled) { transform: scale(0.98); }
  .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

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
  .btn-gold:disabled { opacity: 0.45; cursor: not-allowed; }

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
  .btn-secondary:disabled { opacity: 0.45; cursor: not-allowed; }

  .btn-danger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: rgba(239,68,68,0.10);
    color: #FC8181;
    padding: 15px;
    border-radius: 16px;
    border: 1px solid rgba(239,68,68,0.2);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .btn-danger:hover:not(:disabled) {
    background: rgba(239,68,68,0.18);
    transform: translateY(-1px);
  }
  .btn-danger:active:not(:disabled) { transform: scale(0.98); }

  .btn-green {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: rgba(34,197,94,0.12);
    color: #4ade80;
    padding: 15px;
    border-radius: 16px;
    border: 1px solid rgba(34,197,94,0.25);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .btn-green:hover:not(:disabled) {
    background: rgba(34,197,94,0.2);
    transform: translateY(-1px);
  }
  .btn-green:disabled { opacity: 0.45; cursor: not-allowed; }

  /* Back button — identical to login.js .btn-back */
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

  /* Inline icon button */
  .btn-icon {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: #A8B4C2;
    border-radius: 10px;
    padding: 6px 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .btn-icon:hover { background: rgba(255,255,255,0.08); color: #F0F4FF; }
  .btn-icon.danger { color: #FC8181; border-color: rgba(239,68,68,0.2); }
  .btn-icon.danger:hover { background: rgba(239,68,68,0.1); }
  .btn-icon.success { color: #4ade80; border-color: rgba(34,197,94,0.25); }
  .btn-icon.success:hover { background: rgba(34,197,94,0.1); }

  @keyframes btnSweep {
    0%   { left: -130%; }
    18%  { left: 150%; }
    100% { left: 150%; }
  }

  /* ── Inputs — mirrors login.js exactly ── */
  .ls-input-group { margin-bottom: 16px; }
  .ls-input-group label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: #8896A7;
    margin-bottom: 7px;
    text-transform: uppercase;
    letter-spacing: 0.09em;
  }
  .ls-input-group input,
  .ls-input-group select {
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
    appearance: none;
    box-sizing: border-box;
  }
  .ls-input-group input:focus,
  .ls-input-group select:focus {
    border-color: rgba(255,200,87,0.5);
    box-shadow: 0 0 0 3px rgba(255,200,87,0.1);
    background: rgba(0,0,0,0.5);
  }
  .ls-input-group input::placeholder { color: #3D4A5A; }

  /* ── Divider — mirrors login.js .divider ── */
  .ls-divider {
    display: flex;
    align-items: center;
    margin: 20px 0;
    gap: 12px;
  }
  .ls-divider .line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
  .ls-divider .text { color: #4A5568; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; }

  /* ── Footer links — mirrors login.js .footer-links ── */
  .ls-footer-links {
    margin-top: 20px;
    text-align: center;
  }
  .ls-link-text {
    color: #FFC857;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 1px solid transparent;
    transition: color 0.2s, border-color 0.2s, text-shadow 0.2s;
  }
  .ls-link-text:hover {
    border-color: rgba(255,200,87,0.8);
    text-shadow: 0 0 12px rgba(255,200,87,0.8);
  }

  /* ── Alerts ── */
  .ls-alert-error {
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
  .ls-alert-success {
    background: rgba(52,211,153,0.08);
    border: 1px solid rgba(52,211,153,0.25);
    color: #6EE7B7;
    padding: 11px 15px;
    border-radius: 13px;
    font-size: 13.5px;
    margin-bottom: 18px;
    font-weight: 500;
  }
  .ls-alert-info {
    background: rgba(58,77,255,0.08);
    border: 1px solid rgba(58,77,255,0.25);
    color: #7B8FFF;
    padding: 11px 15px;
    border-radius: 13px;
    font-size: 13.5px;
    margin-bottom: 16px;
    font-weight: 500;
    line-height: 1.5;
  }

  /* ── Spinner — mirrors login.js .premium-spinner ── */
  .ls-spinner {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2.5px solid rgba(58,77,255,0.12);
    border-top-color: #3A4DFF;
    border-right-color: #FFC857;
    animation: spin 0.85s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── View enter animation ── */
  .view-animate {
    animation: viewIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  @keyframes viewIn {
    from { opacity: 0; transform: translateX(8px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* ── Badges / Tags ── */
  .ls-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(255,200,87,0.08);
    border: 1px solid rgba(255,200,87,0.2);
    color: #FFC857;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 100px;
  }
  .ls-badge.blue {
    background: rgba(58,77,255,0.1);
    border-color: rgba(58,77,255,0.25);
    color: #7B8FFF;
  }
  .ls-badge.green {
    background: rgba(34,197,94,0.1);
    border-color: rgba(34,197,94,0.25);
    color: #4ade80;
  }
  .ls-badge.red {
    background: rgba(239,68,68,0.1);
    border-color: rgba(239,68,68,0.25);
    color: #FC8181;
  }

  /* ── User chip ── */
  .ls-user-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,200,87,0.08);
    border: 1px solid rgba(255,200,87,0.15);
    border-radius: 10px;
    padding: 6px 12px;
    margin-bottom: 16px;
  }
  .ls-user-chip span { color: #8896A7; font-size: 12px; }
  .ls-user-chip strong { color: #FFC857; font-size: 13px; }

  /* ── Mode cards ── */
  .ls-mode-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 18px;
    border-radius: 18px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
    margin-bottom: 10px;
    width: 100%;
    text-align: left;
    font-family: 'DM Sans', sans-serif;
  }
  .ls-mode-card:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.12);
    transform: translateX(4px);
  }
  .ls-mode-card:active { transform: scale(0.99); }
  .ls-mode-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }
  .ls-mode-label {
    font-size: 15px;
    font-weight: 600;
    color: #F0F4FF;
    margin: 0 0 2px;
  }
  .ls-mode-desc {
    font-size: 12px;
    color: #8896A7;
    margin: 0;
  }

  /* ── Player list row ── */
  .ls-player-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-radius: 14px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 8px;
    transition: background 0.2s;
  }
  .ls-player-row:hover { background: rgba(255,255,255,0.04); }
  .ls-player-name {
    font-size: 14px;
    font-weight: 600;
    color: #F0F4FF;
  }
  .ls-player-meta {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ── Stepper ── */
  .ls-stepper {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .ls-stepper-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    color: #F0F4FF;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .ls-stepper-btn:hover { background: rgba(255,255,255,0.1); }
  .ls-stepper-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .ls-stepper-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    color: #FFC857;
    min-width: 32px;
    text-align: center;
    line-height: 1;
  }
  .ls-stepper-label {
    font-size: 12px;
    color: #8896A7;
    margin-left: 4px;
  }

  /* ── Queue dot ── */
  .ls-queue-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 6px rgba(74,222,128,0.6);
    display: inline-block;
    animation: dotPulse 1.5s infinite ease-in-out;
  }
  @keyframes dotPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.7; }
  }

  /* ── Bot row ── */
  .ls-bot-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    border-radius: 14px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 8px;
  }
  .ls-bot-label {
    font-size: 13px;
    font-weight: 600;
    color: #F0F4FF;
  }
  .ls-bot-sub {
    font-size: 11px;
    color: #8896A7;
    margin-top: 1px;
  }

  /* ── Friends list ── */
  .ls-friend-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-radius: 14px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 8px;
  }
  .ls-friend-info { display: flex; align-items: center; gap: 10px; }
  .ls-friend-avatar {
    width: 34px; height: 34px;
    border-radius: 10px;
    background: rgba(58,77,255,0.15);
    border: 1px solid rgba(58,77,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
  .ls-friend-name { font-size: 13.5px; font-weight: 600; color: #F0F4FF; }
  .ls-friend-status { font-size: 11px; color: #8896A7; }
  .ls-friend-actions { display: flex; gap: 6px; }

  /* ── Section header ── */
  .ls-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .ls-section-header h3 {
    margin: 0;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 1px;
    color: #F0F4FF;
  }

  /* ── Tabs ── */
  .ls-tabs {
    display: flex;
    background: rgba(0,0,0,0.3);
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 16px;
    gap: 4px;
  }
  .ls-tab {
    flex: 1;
    padding: 8px;
    border-radius: 9px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    color: #8896A7;
    background: transparent;
  }
  .ls-tab.active {
    background: rgba(255,255,255,0.07);
    color: #F0F4FF;
  }

  /* ── Checkbox ── */
  .ls-checkbox-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 14px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    cursor: pointer;
    margin-bottom: 10px;
  }
  .ls-checkbox {
    width: 20px; height: 20px;
    border-radius: 6px;
    border: 1.5px solid rgba(255,255,255,0.15);
    background: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
  }
  .ls-checkbox.checked {
    background: #3A4DFF;
    border-color: #3A4DFF;
  }
  .ls-checkbox-text {
    font-size: 13.5px;
    font-weight: 500;
    color: #F0F4FF;
  }
  .ls-checkbox-sub {
    font-size: 11.5px;
    color: #8896A7;
    margin-top: 1px;
  }

  /* ── Progress bar ── */
  .ls-progress-wrap {
    height: 4px;
    background: rgba(255,255,255,0.06);
    border-radius: 4px;
    overflow: hidden;
    margin: 14px 0;
  }
  .ls-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #3A4DFF, #FFC857);
    border-radius: 4px;
    transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
  }

  /* ── Copy row ── */
  .ls-copy-row {
    display: flex;
    gap: 8px;
    align-items: stretch;
    margin-bottom: 12px;
  }
  .ls-copy-input {
    flex: 1;
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.08);
    color: #8896A7;
    padding: 10px 14px;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    outline: none;
  }

  /* ── Leaderboard rank rows ── */
  .ls-rank-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px;
    border-radius: 16px;
    margin-bottom: 8px;
    border: 1px solid rgba(255,255,255,0.06);
    transition: transform 0.15s;
  }
  .ls-rank-row:hover { transform: translateX(2px); }
  .ls-rank-row.gold { background: rgba(255,200,87,0.1); border-color: rgba(255,200,87,0.3); }
  .ls-rank-row.silver { background: rgba(192,192,192,0.07); border-color: rgba(192,192,192,0.2); }
  .ls-rank-row.bronze { background: rgba(205,127,50,0.07); border-color: rgba(205,127,50,0.2); }
  .ls-rank-row.default { background: rgba(255,255,255,0.025); }

  /* ── Round history table ── */
  .ls-round-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .ls-round-table th {
    padding: 10px 12px;
    text-align: left;
    color: #8896A7;
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .ls-round-table td {
    padding: 9px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    color: #F0F4FF;
    text-align: center;
  }
  .ls-round-table tr:last-child td { border-bottom: none; }

  /* ── Score chip ── */
  .ls-score-chip {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 3px 8px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
  }
  .ls-score-chip.zero { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }
  .ls-score-chip.pos { background: rgba(239,68,68,0.1); color: #FC8181; border: 1px solid rgba(239,68,68,0.2); }

  /* ── Disconnect panel ── */
  .ls-disconnect-panel {
    margin-top: 14px;
    padding: 18px 20px;
    border-radius: 20px;
    background: rgba(255,200,87,0.05);
    border: 1px solid rgba(255,200,87,0.2);
    box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.3);
    backdrop-filter: blur(12px);
    animation: cardEntrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  /* ── Overlay ── */
  .ls-overlay {
    position: absolute;
    inset: 0;
    background: rgba(7,9,15,0.95);
    z-index: 9999;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 20px 20px 40px;
    backdrop-filter: blur(8px);
    border-radius: inherit;
    overflow-y: auto;
  }

  /* ── In-game top bar ── */
  .ls-topbar {
    background: rgba(13,17,23,0.95);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 13px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .ls-topbar-brand {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    color: #FFC857;
    letter-spacing: 2px;
  }
  .ls-topbar-badges {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ls-topbar-exit {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.2);
    color: #FC8181;
    border-radius: 12px;
    padding: 7px 16px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s, transform 0.15s;
  }
  .ls-topbar-exit:hover {
    background: rgba(239,68,68,0.18);
    transform: translateY(-1px);
  }
  .ls-topbar-exit:active { transform: scale(0.97); }

  /* ── In-game scoreboard card ── */
  .ls-scoreboard-wrap {
    padding: 16px 16px 0;
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .ls-scoreboard-wrap::-webkit-scrollbar { display: none; }
  .ls-scoreboard-inner {
    display: flex;
    gap: 10px;
    min-width: max-content;
    padding-bottom: 8px;
  }
  .ls-player-card {
    padding: 12px 16px;
    border-radius: 18px;
    min-width: 128px;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    position: relative;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.025);
  }
  .ls-player-card.active-turn {
    background: rgba(255,200,87,0.06);
    border-color: rgba(255,200,87,0.5);
    box-shadow: 0 0 20px rgba(255,200,87,0.15);
    transform: translateY(-2px);
  }
  .ls-player-card.active-thinking {
    background: rgba(239,108,0,0.06);
    animation: pulseGlow 2s infinite ease-in-out;
  }
  .ls-player-card.is-me {
    border-color: rgba(58,77,255,0.4);
  }
  .ls-player-card.eliminated {
    opacity: 0.45;
  }
  .ls-player-card-turn-badge {
    position: absolute;
    top: -9px;
    left: 50%;
    transform: translateX(-50%);
    padding: 2px 9px;
    border-radius: 12px;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }
  .ls-player-card-turn-badge.normal {
    background: #FFC857;
    color: #1A1200;
  }
  .ls-player-card-turn-badge.thinking {
    background: #ef6c00;
    color: #fff;
    animation: pulse 1.5s infinite ease-in-out;
  }
  .ls-player-card-name {
    margin: 0 0 4px;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .ls-player-card-score {
    margin: 0;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 30px;
    line-height: 1;
  }
  .ls-player-card-footer {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    border-top: 1px solid rgba(255,255,255,0.05);
    padding-top: 6px;
  }
  .ls-player-card-stat {
    flex: 1;
  }
  .ls-player-card-stat-label {
    margin: 0 0 3px;
    font-size: 8px;
    color: #8896A7;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 700;
  }
  .ls-round-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    margin-top: 6px;
    max-width: 120px;
  }

  /* ── In-game zone panels ── */
  .ls-game-area {
    padding: 16px;
  }
  .ls-zone {
    border-radius: 20px;
    padding: 16px;
    margin-bottom: 14px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.025);
    backdrop-filter: blur(8px);
    transition: border-color 0.3s, background 0.3s;
  }
  .ls-zone.active {
    background: rgba(255,200,87,0.04);
    border-color: rgba(255,200,87,0.2);
  }
  .ls-zone-label {
    margin: 0 0 12px;
    font-size: 11px;
    color: #8896A7;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* ── Playing card ── */
  .ls-playing-card {
    cursor: pointer;
    margin: 5px;
    padding: 8px 6px;
    min-width: 54px;
    min-height: 78px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.12);
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    position: relative;
    overflow: hidden;
  }
  .ls-playing-card:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.35); }
  .ls-playing-card.selected-discard {
    border: 2px solid #e53935;
    background: #ffebee;
    box-shadow: 0 0 14px 4px rgba(244, 67, 54, 0.85);
    transform: translateY(-4px);
  }
  .ls-playing-card.selected-draw {
    border: 2px solid #ffb300;
    background: #fffde7;
    box-shadow: 0 0 12px 4px rgba(255, 152, 0, 0.7);
    transform: translateY(-4px);
  }
  .ls-playing-card.highlight {
    border: 2px solid #ffb300;
    background: #fffde7;
    box-shadow: 0 0 12px 4px rgba(255, 152, 0, 0.7);
  }
  .ls-playing-card.no-interact { cursor: default; }
  .ls-playing-card.no-interact:hover { transform: none; box-shadow: 0 2px 8px rgba(0,0,0,0.25); }

  /* ── Deck button ── */
  .ls-deck-btn {
    cursor: pointer;
    margin: 5px;
    padding: 8px 6px;
    min-width: 64px;
    min-height: 78px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.12);
    background: #ffffff;
    color: #111;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .ls-deck-btn:hover { transform: translateY(-3px); }
  .ls-deck-btn.selected-draw {
    border: 2px solid #ffb300;
    background: #fffde7;
    box-shadow: 0 0 12px 4px rgba(255, 152, 0, 0.7);
    transform: translateY(-4px);
    color: #111;
  }
  .ls-deck-btn.selected-draw span {
    color: #111 !important;
  }
  .ls-deck-btn.hint-glow {
    border: 2px solid #ffb300;
    background: #fffde7;
    box-shadow: 0 0 12px 4px rgba(255, 152, 0, 0.7);
  }

  /* ── Action button row ── */
  .ls-action-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 4px;
  }
  .ls-action-btn {
    flex: 1;
    min-width: 100px;
    padding: 14px;
    border-radius: 14px;
    border: none;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .ls-action-btn.make-turn {
    background: linear-gradient(135deg, #3A4DFF, #2D3DE6);
    color: #fff;
    box-shadow: 0 4px 16px rgba(58,77,255,0.35);
  }
  .ls-action-btn.make-turn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(58,77,255,0.5); }
  .ls-action-btn.make-turn:disabled { background: rgba(255,255,255,0.04); color: #8896A7; box-shadow: none; cursor: not-allowed; }
  .ls-action-btn.declare {
    background: linear-gradient(135deg, #FFD166, #FFC857);
    color: #1A1200;
    box-shadow: 0 4px 16px rgba(255,200,87,0.3);
    position: relative;
    overflow: hidden;
  }
  .ls-action-btn.declare::before {
    content: '';
    position: absolute;
    top: 0; left: -130%;
    width: 55%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transform: skewX(-18deg);
    animation: btnSweep 4s 1s infinite;
  }
  .ls-action-btn.declare:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,200,87,0.45); }
  .ls-action-btn.declare:disabled { background: rgba(255,255,255,0.04); color: #8896A7; box-shadow: none; cursor: not-allowed; }
  .ls-action-btn.hint-btn {
    flex: 0 0 auto;
    padding: 14px 18px;
    background: rgba(147,51,234,0.1);
    color: #c084fc;
    border: 1px solid rgba(147,51,234,0.3);
  }
  .ls-action-btn.hint-btn:hover:not(:disabled) { background: rgba(147,51,234,0.18); transform: translateY(-1px); }
  .ls-action-btn.hint-btn:disabled { background: rgba(255,255,255,0.04); color: #8896A7; border-color: rgba(255,255,255,0.06); cursor: not-allowed; }

  /* ── Blank card (pass & play hidden) ── */
  .ls-blank-card {
    width: 54px;
    height: 78px;
    margin: 5px;
    background: linear-gradient(135deg, #1A2040, #0D1117);
    border: 1px solid rgba(58,77,255,0.3);
    border-radius: 12px;
    background-image: repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.03) 5px, rgba(255,255,255,0.03) 10px);
    flex-shrink: 0;
  }

  /* ── Reasoning panel ── */
  .ls-reasoning-panel {
    margin-top: 14px;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.018);
    backdrop-filter: blur(12px);
    animation: cardEntrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .ls-reasoning-obs {
    padding: 14px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .ls-reasoning-dec {
    padding: 14px 18px;
    background: rgba(255,200,87,0.02);
  }
  .ls-reasoning-label {
    margin: 0 0 10px;
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .ls-reasoning-line {
    margin: 2px 0;
    font-size: 13px;
    color: #8896A7;
    line-height: 1.6;
  }

  /* ── In-game animations ── */
  @keyframes pulseGlow {
    0% { box-shadow: 0 0 5px rgba(239,108,0,0.3); border-color: rgba(239,108,0,0.5); }
    50% { box-shadow: 0 0 20px rgba(239,108,0,0.8); border-color: rgba(239,108,0,1); }
    100% { box-shadow: 0 0 5px rgba(239,108,0,0.3); border-color: rgba(239,108,0,0.5); }
  }
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; transform: scale(1.05); }
    100% { opacity: 0.6; }
  }

  /* Spacing utils */
  .mt-2 { margin-top: 8px; }
  .mt-3 { margin-top: 12px; }
  .mt-4 { margin-top: 16px; }
`;


const PARTICLES = [
    { suit: '♠', style: { top: '8%', left: '6%', animationDelay: '0s', animationDuration: '18s', fontSize: '22px', opacity: 0.12 } },
    { suit: '♥', style: { top: '15%', right: '8%', animationDelay: '3s', animationDuration: '22s', fontSize: '16px', opacity: 0.09, color: '#FF6B6B' } },
    { suit: '♦', style: { top: '55%', left: '4%', animationDelay: '6s', animationDuration: '20s', fontSize: '18px', opacity: 0.1, color: '#FF6B6B' } },
    { suit: '♣', style: { top: '70%', right: '5%', animationDelay: '1.5s', animationDuration: '25s', fontSize: '20px', opacity: 0.11 } },
    { suit: '♠', style: { top: '40%', right: '3%', animationDelay: '9s', animationDuration: '16s', fontSize: '13px', opacity: 0.08 } },
    { suit: '♥', style: { top: '85%', left: '10%', animationDelay: '4.5s', animationDuration: '19s', fontSize: '14px', opacity: 0.07, color: '#FF6B6B' } },
];


function PageShell({ children, wide = false, particles = true }) {
    return (
        <>
            <Head>
                <title>LeastScore</title>
                <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Head>
            <style>{GLOBAL_CSS}</style>
            <div className="ls-container">
                <div className={`ls-frame${wide ? ' ls-frame-wide' : ''}`}>
                    <div className="ls-bg-mesh" />
                    <div className="ls-noise" />
                    {particles && PARTICLES.map((p, i) => (
                        <div key={i} className="suit-particle" style={p.style}>{p.suit}</div>
                    ))}
                    <div className="ls-scroll">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}


function LogoHeader({ subtitle, badge }) {
    const [flipped, setFlipped] = useState(false);
    useEffect(() => {
        const t = setInterval(() => setFlipped(f => !f), 3000);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="ls-logo-section">
            <div
                className="ls-logo-card-wrap"
                onClick={() => setFlipped(f => !f)}
                title="Click to flip"
            >
                <div className={`ls-logo-card-inner${flipped ? ' flipped' : ''}`}>
                    <div className="ls-logo-card-face front">🃏</div>
                    <div className="ls-logo-card-face back">🎴</div>
                </div>
            </div>
            <h1 className="ls-logo-title">LeastScore</h1>
            {badge && (
                <div className="ls-logo-badge"><span>♠</span>{badge}</div>
            )}
            {subtitle && <p className="ls-logo-sub">{subtitle}</p>}
        </div>
    );
}

// ── User Chip ─────────────────────────────────────────────────




const suitSymbols = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
const getCardPoints = (rank) => {
  if (rank === 'A') return 1;
  if (rank === 'J') return 11;
  if (rank === 'Q') return 12;
  if (rank === 'K') return 13;
  return parseInt(rank, 10) || 0;
};
const getHandScore = (hand) => hand.reduce((sum, c) => sum + getCardPoints(c.r), 0);
const OPPONENT_HAND_BY_CASE = [24, 31, 18, 42, 27, 15, 38, 22, 11, 5];
const STAGES = [
  {
    kind: 'intro',
    caseId: 0,
    p: [{ r: '4', s: 'spades' }, { r: '5', s: 'diamonds' }, { r: '6', s: 'clubs' }, { r: '9', s: 'hearts' }, { r: '2', s: 'diamonds' }, { r: '8', s: 'clubs' }, { r: 'K', s: 'spades' }],
    v: { r: 'J', s: 'diamonds' },
    prompt: 'Your turn is one move: discard, draw. We will cover each legal discard type, then declaration scoring.',
    playerScore: 0,
  },
  {
    kind: 'turn',
    caseId: 1,
    discardType: 'Single card',
    p: [{ r: '4', s: 'spades' }, { r: '5', s: 'diamonds' }, { r: '6', s: 'clubs' }, { r: '9', s: 'hearts' }, { r: '2', s: 'diamonds' }, { r: '8', s: 'clubs' }, { r: 'K', s: 'spades' }],
    v: { r: 'J', s: 'diamonds' },
    discardGlow: [6],
    drawGlow: 'hidden',
    prompt: 'In this case — single card discard\n\nThe best card to discard is K♠ (red). You can always discard one card; dropping a King removes 13 points from your hand.\n\nNow choose where to draw from: J♦ on the visible pile is still a poor pick (11 points, no combo), so draw from the Hidden deck (gold).',
    playerScore: 0,
  },
  {
    kind: 'turn',
    caseId: 2,
    discardType: 'Pair',
    p: [{ r: '4', s: 'spades' }, { r: '5', s: 'diamonds' }, { r: '6', s: 'clubs' }, { r: '9', s: 'hearts' }, { r: '9', s: 'clubs' }, { r: '2', s: 'diamonds' }, { r: '8', s: 'clubs' }],
    v: { r: 'Q', s: 'spades' },
    discardGlow: [3, 4],
    drawGlow: 'hidden',
    prompt: 'In this case — pair (two cards, same rank)\n\nThe best cards to discard are 9♥ and 9♣ (red) — a pair clears 18 points at once.\n\nNow choose where to draw from: Q♠ does not help this hand, so take the Hidden deck (gold).',
    playerScore: 0,
  },
  {
    kind: 'turn',
    caseId: 3,
    discardType: 'Sequence of 3',
    p: [{ r: '8', s: 'spades' }, { r: '9', s: 'diamonds' }, { r: '10', s: 'clubs' }, { r: '4', s: 'hearts' }, { r: '5', s: 'clubs' }, { r: '2', s: 'hearts' }, { r: 'A', s: 'clubs' }],
    v: { r: '7', s: 'hearts' },
    discardGlow: [0, 1, 2],
    drawGlow: 'hidden',
    prompt: 'In this case — sequence of 3\n\nThe best cards to discard are 8♠ 9♦ 10♣ (red) — three consecutive ranks; suits can differ.\n\nNow choose where to draw from: 7♥ does not fit what is left, so draw from the Hidden deck (gold).',
    playerScore: 0,
  },
  {
    kind: 'turn',
    caseId: 4,
    discardType: 'Four of a kind',
    p: [{ r: 'Q', s: 'hearts' }, { r: 'Q', s: 'diamonds' }, { r: 'Q', s: 'clubs' }, { r: 'Q', s: 'spades' }, { r: '5', s: 'diamonds' }, { r: '6', s: 'clubs' }, { r: '2', s: 'hearts' }],
    v: { r: '4', s: 'clubs' },
    discardGlow: [0, 1, 2, 3],
    drawGlow: 'visible',
    prompt: 'In this case — four of a kind (quadruple)\n\nThe best cards to discard are all four Queens (red) — four cards of the same rank.\n\nNow choose where to draw from: 4♣ on the visible pile is low and also forms a combo of 4♣ - 5♦ - 6♣ instead of gambling for a card blindly from the hidden deck.',
    playerScore: 0,
  },
  {
    kind: 'turn',
    caseId: 5,
    discardType: 'Sequence of 5',
    p: [{ r: '5', s: 'clubs' }, { r: '6', s: 'diamonds' }, { r: '7', s: 'hearts' }, { r: '8', s: 'spades' }, { r: '9', s: 'clubs' }, { r: '2', s: 'diamonds' }, { r: 'A', s: 'hearts' }],
    v: { r: 'K', s: 'spades' },
    discardGlow: [0, 1, 2, 3, 4],
    drawGlow: 'hidden',
    prompt: 'In this case — sequence of 5\n\nThe best cards to discard are 5♣ 6♦ 7♥ 8♠ 9♣ (red) — five consecutive ranks (mixed suits are fine).\n\nNow choose where to draw from: K♠ is 13 points and useless here, so draw from the Hidden deck (gold).',
    playerScore: 0,
  },
  {
    kind: 'turn',
    caseId: 6,
    discardType: 'Flush',
    p: [{ r: '2', s: 'diamonds' }, { r: '4', s: 'diamonds' }, { r: '6', s: 'diamonds' }, { r: '7', s: 'diamonds' }, { r: '9', s: 'diamonds' }],
    v: { r: '8', s: 'hearts' },
    discardGlow: [0, 1, 2, 3, 4],
    drawGlow: 'hidden',
    prompt: 'In this case — flush (five cards, same suit)\n\nThe best cards to discard are all five diamonds (red) — 2♦ 4♦ 6♦ 7♦ 9♦.\n\nNow choose where to draw from: 8♥ is okay but does not form a combo and drawing from the Hidden deck could get us an even a smaller card (gold).',
    playerScore: 0,
  },
  {
    kind: 'info',
    caseId: 7,
    discardType: 'Correct declaration',
    p: [{ r: '3', s: 'spades' }, { r: 'A', s: 'clubs' }],
    v: { r: '5', s: 'clubs' },
    prompt: 'In this case — correct declaration\n\nYour hand score is 4 (3♠ + A♣). Opponent Bot\'s hand totals 11 in this case.\n\nYou declare correctly. Opponent gains 11 − 4 = 7 points toward elimination (first to 100 is out).',
    playerScore: 7,
    opponentHandScore: 11,
  },
  {
    kind: 'info',
    caseId: 8,
    discardType: 'Wrong declaration',
    p: [{ r: '4', s: 'spades' }, { r: '4', s: 'clubs' }],
    v: { r: '5', s: 'clubs' },
    prompt: 'In this case — wrong declaration\n\nYour hand score is 8 (4♠ + 4♣). Opponent Bot\'s hand totals 5 in this case — lower than yours.\n\nWrong declare penalty: 20 + (8 − 5) = 23 points added to your score.',
    playerScore: 23,
    opponentHandScore: 5,
  },
  {
    kind: 'end',
    caseId: 9,
    p: [],
    v: null,
    prompt: 'Tutorial summary:\n\n✔ Each case is separate — each turn = discard then draw\n✔ Single → Pair → Sequence of 3 → Four of a kind → Sequence of 5 → Flush\n✔ Pick visible cards only when they help; otherwise use the hidden deck\n✔ Wrong declare: 20 + (your hand − lowest hand)\n\nGood luck!',
    playerScore: 0,
  },
];
function getOpponentHandScore(stage) {
  if (stage.opponentHandScore != null) return stage.opponentHandScore;
  const id = stage.caseId ?? 0;
  return OPPONENT_HAND_BY_CASE[id] ?? 20;
}

export default function ScriptedMatch({ onExit }) {
  const [stepIdx, setStepIdx] = useState(0);
  const stage = STAGES[stepIdx];
  const currentP = stage.p;
  const totalSteps = STAGES.filter((s) => s.kind !== 'end').length;
  const opponentHandScore = getOpponentHandScore(stage);

  const handleNext = () => {
    if (stepIdx < STAGES.length - 1) {
      setStepIdx(stepIdx + 1);
    } else {
      onExit();
    }
  };

  const handleBack = () => {
    if (stepIdx > 0) setStepIdx(stepIdx - 1);
  };

  const handleStartOver = () => setStepIdx(0);

  const toGameCard = (c) => ({ rank: c.r, suit: c.s });

  const renderCard = (key, card, { discardGlow = false, drawnGlow = false } = {}) => {
    let cls = 'ls-playing-card no-interact';
    if (discardGlow) cls += ' selected-discard';
    if (drawnGlow) cls += ' selected-draw';
    const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
    
    return (
      <button key={key} className={cls} style={{ color: isRed ? '#c11' : '#111' }}>
        <span style={{ alignSelf: 'flex-start', fontSize: '12px' }}>{card.rank}</span>
        <span style={{ fontSize: '24px', lineHeight: 1 }}>{suitSymbols[card.suit]}</span>
        <span style={{ alignSelf: 'flex-end', fontSize: '12px' }}>{card.rank}</span>
      </button>
    );
  };

  const renderVisibleCard = () => {
    if (!stage.v) {
      return <div className="ls-blank-card" style={{ opacity: 0.5 }}></div>;
    }
    const c = toGameCard(stage.v);
    return renderCard('visible', c, { drawnGlow: stage.drawGlow === 'visible' });
  };

  const navButtons = (
    <div style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
      <button className="btn-secondary" onClick={handleBack} disabled={stepIdx === 0} style={{ flex: 1, minWidth: '100px' }}>
        Back
      </button>
      <button className="btn-gold" onClick={handleNext} style={{ flex: 2, minWidth: '120px' }}>
        {stepIdx === STAGES.length - 2 ? 'Finish' : 'Next'}
      </button>
      <button className="btn-primary" onClick={handleStartOver} style={{ flex: 1, minWidth: '100px' }}>
        Restart
      </button>
    </div>
  );

  if (stage.kind === 'end') {
    return (
      <PageShell>
        <LogoHeader subtitle="Tutorial Complete" />
        <div className="ls-card view-animate" style={{ textAlign: 'center' }}>
          <button className="btn-back" onClick={onExit} style={{ position: 'absolute', top: '24px', left: '24px' }}>
            ← Exit
          </button>
          
          <div style={{ margin: '20px 0 30px' }}>
            <h2 className="ls-section-title">Tutorial Summary</h2>
            <div style={{ textAlign: 'left', fontSize: '14px', lineHeight: '1.8', color: '#A8B4C2', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'pre-wrap' }}>
              {stage.prompt}
            </div>
          </div>
          
          <button className="btn-gold" onClick={onExit}>
            ✓ Back to Tutorial
          </button>
          {stepIdx > 0 && (
            <button className="btn-secondary mt-3" onClick={handleStartOver}>
              Start Over
            </button>
          )}
        </div>
      </PageShell>
    );
  }

  const handScore = getHandScore(currentP);
  const isTurnStep = stage.kind === 'turn';

  return (
    <PageShell>
      <LogoHeader subtitle="Observe a Game" />
      <div className="ls-card view-animate">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button className="btn-back" onClick={onExit} style={{ margin: 0 }}>
            ← Exit
          </button>
          <span className="ls-badge blue">Step {stepIdx + 1} / {totalSteps}</span>
        </div>

        <p className="ls-section-title" style={{ fontSize: '18px' }}>
          {stage.discardType ? `Scenario: ${stage.discardType}` : 'Introduction'}
        </p>

        {/* Players Scoreboard */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          {[
            { name: 'You', gameScore: stage.playerScore ?? 0, active: true, handScore },
            { name: 'Bot', gameScore: 0, active: false, handScore: opponentHandScore },
          ].map((pl) => (
            <div key={pl.name} style={{
              flex: 1, padding: '12px', borderRadius: '16px',
              background: pl.active ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${pl.active ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.06)'}`,
              textAlign: 'center'
            }}>
              {pl.active && <div style={{ fontSize: '10px', color: '#4ade80', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>Active Turn</div>}
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#F0F4FF', marginBottom: '4px' }}>{pl.name}</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: pl.active ? '#4ade80' : '#FFC857' }}>{pl.gameScore}</div>
              <div style={{ fontSize: '11px', color: '#8896A7', marginTop: '4px' }}>Hand: {pl.handScore} pts</div>
            </div>
          ))}
        </div>

        {/* Explanation Prompt */}
        <div className="ls-alert-info" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
          {stage.prompt}
        </div>

        {isTurnStep && (
          <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#8896A7', fontStyle: 'italic', textAlign: 'center' }}>
            One turn: discard (red) → then draw (gold)
          </p>
        )}

        {/* Game Area */}
        <div className="ls-zone">
          <p className="ls-zone-label">Table</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            {renderVisibleCard()}
            <div className={`ls-deck-btn ${stage.drawGlow === 'hidden' ? 'selected-draw' : ''}`}>
              <span style={{ fontSize: '24px', lineHeight: '1.2' }}>🂠</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Deck</span>
            </div>
          </div>
        </div>

        <div className="ls-zone active">
          <p className="ls-zone-label">Your Hand ({currentP.length})</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {currentP.map((c, i) =>
              renderCard(`hand-${i}`, toGameCard(c), {
                discardGlow: stage.discardGlow?.includes(i),
                drawnGlow: stage.drawnGlow === i,
              })
            )}
          </div>
        </div>

        {navButtons}
      </div>
    </PageShell>
  );
}
