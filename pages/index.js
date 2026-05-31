// pages/index.js - Frontend for the card game (LeastScore themed UI)

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import io from 'socket.io-client';
import ScriptedMatch from '../components/ScriptedMatch';
import MatchHistory from '../components/MatchHistory';
import GlobalSocialOverlays from '../components/GlobalSocialOverlays';
import {
    usePlayAlongHintMemory,
    computePlayAlongHint,
    applyPlayAlongHintSelection,
    isHintDiscardCard,
    isHintVisibleDraw,
    isHintDeckDraw,
    confirmPlayAlongDeclare,
    PlayAlongDeclarationBanner,
    PlayAlongHintReasoningPanel,
    playAlongCardStyle,
    getHandSum,
} from '../components/PlayAlongMatch';

// ── Shared Design Tokens ──────────────────────────────────────
const COLORS = {
    bg: '#07090F',
    frame: '#0D1117',
    gold: '#FFC857',
    goldLight: '#FFD166',
    blue: '#3A4DFF',
    blueDark: '#2D3DE6',
    text: '#F0F4FF',
    muted: '#8896A7',
    border: 'rgba(255,255,255,0.07)',
    cardBg: 'rgba(255,255,255,0.028)',
    error: '#FC8181',
    success: '#6EE7B7',
    red: '#ef4444',
};

// ── Global CSS — mirrors login.js exactly ────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; background: #07090F; }

  :root {
    --card-w: min(22vw, 90px);
    --card-h: calc(var(--card-w) * 1.6);
    --card-overlap: calc(var(--card-w) * -0.62);
    --card-font: calc(var(--card-w) * 0.25);
    --card-padding-x: calc(var(--card-w) * 0.08);
    --card-padding-y: calc(var(--card-w) * 0.1);
    --card-padding-bottom: calc(var(--card-w) * 0.25);
  }

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

  /* ── Mode cards (image-backed 21:9) ── */
   .ls-mode-card {
     position: relative;
     display: flex;
     flex-direction: column;
     justify-content: flex-end;
     aspect-ratio: 21 / 9;
     border-radius: 20px;
     overflow: hidden;
     cursor: pointer;
     transition: transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s, border-color 0.2s;
     margin-bottom: 12px;
     width: 100%;
     text-align: left;
     font-family: 'DM Sans', sans-serif;
     border: 1px solid rgba(255,255,255,0.08);
     background: #0D1117;
     box-shadow: 0 4px 24px rgba(0,0,0,0.4);
   }
   .ls-mode-card:hover {
     transform: translateY(-4px) scale(1.01);
     box-shadow: 0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.1);
     border-color: rgba(255,255,255,0.15);
   }
   .ls-mode-card:active { transform: scale(0.985); }

   .ls-mode-card-img {
     position: absolute;
     inset: 0;
     width: 100%;
     height: 100%;
     object-fit: cover;
     z-index: 0;
     transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), filter 0.3s;
     filter: brightness(0.85);
   }
   .ls-mode-card:hover .ls-mode-card-img {
     transform: scale(1.05);
     filter: brightness(0.95);
   }

   /* Gradient overlay for text readability */
   .ls-mode-card-overlay {
     position: absolute;
     inset: 0;
     z-index: 1;
     background: linear-gradient(
       to top,
       rgba(7, 9, 15, 0.92) 0%,
       rgba(7, 9, 15, 0.55) 40%,
       rgba(7, 9, 15, 0.10) 70%,
       transparent 100%
     );
     pointer-events: none;
   }

   /* Text content on top of overlay */
   .ls-mode-card-content {
     position: relative;
     z-index: 2;
     padding: 16px 20px;
     display: flex;
     align-items: flex-end;
     justify-content: space-between;
     gap: 10px;
   }
   .ls-mode-label {
     font-size: 17px;
     font-weight: 700;
     color: #F0F4FF;
     margin: 0 0 3px;
     text-shadow: 0 2px 8px rgba(0,0,0,0.6);
     letter-spacing: 0.02em;
   }
   .ls-mode-desc {
     font-size: 12.5px;
     color: rgba(240,244,255,0.7);
     margin: 0;
     text-shadow: 0 1px 4px rgba(0,0,0,0.5);
     line-height: 1.4;
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
  .ls-friends-card {
    padding: 22px;
    border-radius: 24px;
  }
  .ls-friends-panel-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }
  .ls-friends-panel-copy {
    flex: 1;
    min-width: 0;
  }
  .ls-friends-panel-title {
    margin: 0 0 4px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;
    color: #F0F4FF;
    letter-spacing: 1px;
    line-height: 1;
  }
  .ls-friends-panel-sub {
    margin: 0;
    color: #8896A7;
    font-size: 12.5px;
    line-height: 1.45;
  }
  .ls-friends-counts {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: 9px;
  }
  .ls-friends-dropdown-toggle {
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    border: 1px solid rgba(255,200,87,0.24);
    background: rgba(255,200,87,0.08);
    color: #FFC857;
    font-size: 0;
    line-height: 0;
    cursor: pointer;
    transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.18s, box-shadow 0.18s;
  }
  .ls-friends-dropdown-toggle:hover {
    background: rgba(255,200,87,0.14);
    border-color: rgba(255,200,87,0.42);
    color: #FFD166;
    box-shadow: 0 0 16px rgba(255,200,87,0.12);
  }
  .ls-friends-dropdown-toggle:active { transform: scale(0.96); }
  .ls-friends-dropdown-toggle:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255,200,87,0.16);
  }
  .ls-friends-chevron {
    width: 18px;
    height: 18px;
    display: block;
    transform: rotate(0deg);
    transition: transform 0.2s ease;
  }
  .ls-friends-dropdown-toggle[aria-expanded="true"] .ls-friends-chevron {
    transform: rotate(180deg);
  }
  .ls-friends-notice {
    margin-bottom: 12px;
    padding: 14px;
    border-radius: 18px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.035);
  }
  .ls-friends-notice.party {
    border-color: rgba(58,77,255,0.28);
    background: rgba(58,77,255,0.07);
  }
  .ls-friends-notice.friend {
    border-color: rgba(74,222,128,0.25);
    background: rgba(74,222,128,0.06);
  }
  .ls-friends-notice-kicker {
    margin: 0 0 5px;
    color: #8896A7;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }
  .ls-friends-notice-title {
    margin: 0;
    color: #F0F4FF;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.4;
  }
  .ls-friends-notice-name { color: #FFC857; }
  .ls-friends-notice-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 12px;
  }
  .ls-friends-notice-more {
    margin: 10px 0 0;
    color: #8896A7;
    font-size: 12px;
    text-align: center;
  }
  .ls-global-social-overlay {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10050;
    width: min(420px, calc(100vw - 32px));
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
  }
  .ls-global-social-overlay > * {
    pointer-events: auto;
  }
  .ls-global-social-toast {
    padding: 14px 16px;
    border-radius: 18px;
    border: 1px solid rgba(74,222,128,0.25);
    background: rgba(74,222,128,0.1);
    color: #F0F4FF;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    box-shadow: 0 16px 40px rgba(0,0,0,0.35);
    animation: viewIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .ls-friend-search-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;
    margin-bottom: 14px;
  }
  .ls-friend-search-row .ls-copy-input { min-width: 0; }
  .ls-friend-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 11px 12px;
    border-radius: 16px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 8px;
    transition: background 0.2s, border-color 0.2s;
  }
  .ls-friend-row:hover {
    background: rgba(255,255,255,0.045);
    border-color: rgba(255,255,255,0.09);
  }
  .ls-friend-info {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }
  .ls-friend-avatar {
    width: 34px; height: 34px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(58,77,255,0.28), rgba(255,200,87,0.12));
    border: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #F0F4FF;
    font-size: 15px;
    font-weight: 800;
    flex-shrink: 0;
  }
  .ls-friend-copy { min-width: 0; }
  .ls-friend-name {
    margin: 0;
    font-size: 13.5px;
    font-weight: 700;
    color: #F0F4FF;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 150px;
  }
  .ls-friend-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin: 3px 0 0;
    font-size: 11px;
    color: #8896A7;
  }
  .ls-status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #64748B;
    flex-shrink: 0;
  }
  .ls-status-dot.online {
    background: #4ade80;
    box-shadow: 0 0 9px rgba(74,222,128,0.55);
  }
  .ls-friend-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }
  .ls-empty-state {
    padding: 24px 12px;
    border: 1px dashed rgba(255,255,255,0.1);
    border-radius: 18px;
    background: rgba(0,0,0,0.12);
    text-align: center;
  }
  .ls-empty-state-title {
    margin: 0 0 5px;
    color: #F0F4FF;
    font-size: 13.5px;
    font-weight: 700;
  }
  .ls-empty-state-copy {
    margin: 0;
    color: #8896A7;
    font-size: 12.5px;
    line-height: 1.5;
  }
  .ls-party-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
    padding: 10px 12px;
    border-radius: 16px;
    background: rgba(0,0,0,0.18);
    border: 1px solid rgba(255,255,255,0.06);
  }
  .ls-party-summary-label {
    margin: 0 0 2px;
    color: #F0F4FF;
    font-size: 13px;
    font-weight: 700;
  }
  .ls-party-summary-copy {
    margin: 0;
    color: #8896A7;
    font-size: 12px;
  }
  .ls-party-list {
    display: grid;
    gap: 8px;
  }
  .ls-friends-locked {
    text-align: center;
    padding: 22px 0 18px;
  }
  .ls-friends-locked-mark {
    width: 42px;
    height: 42px;
    margin: 0 auto 14px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,200,87,0.08);
    border: 1px solid rgba(255,200,87,0.18);
    color: #FFC857;
    font-size: 22px;
    font-weight: 800;
  }

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
    background: rgba(0,0,0,0.28);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 14px;
    padding: 4px;
    margin-bottom: 16px;
    gap: 4px;
  }
  .ls-tab {
    flex: 1;
    min-width: 0;
    padding: 9px 8px;
    border-radius: 11px;
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
    background: rgba(255,255,255,0.085);
    color: #F0F4FF;
    box-shadow: 0 1px 0 rgba(255,255,255,0.05) inset;
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
    gap: 4px;
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
  .ls-draw-zone {
    container-type: inline-size;
    padding: 10px 6px;
    --card-w: calc((100cqi - 24px) / 6);
    --card-h: calc(var(--card-w) * 1.6);
    --card-overlap: calc(var(--card-w) * -0.62);
    --card-font: calc(var(--card-w) * 0.25);
    --card-padding-x: calc(var(--card-w) * 0.08);
    --card-padding-y: calc(var(--card-w) * 0.1);
    --card-padding-bottom: calc(var(--card-w) * 0.25);
  }
  .ls-draw-zone .ls-playing-card,
  .ls-draw-zone .ls-deck-btn {
    margin: 2px;
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
    padding: var(--card-padding-y) var(--card-padding-x) var(--card-padding-bottom);
    width: var(--card-w);
    height: var(--card-h);
    min-width: var(--card-w);
    min-height: var(--card-h);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.12);
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    font-size: var(--card-font);
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    position: relative;
    overflow: visible;
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
    padding: var(--card-padding-y) var(--card-padding-x) var(--card-padding-bottom);
    width: var(--card-w);
    height: var(--card-h);
    min-width: var(--card-w);
    min-height: var(--card-h);
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
    position: relative;
    overflow: hidden;
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
  }
  .ls-action-btn.turn-shine::before {
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
    width: var(--card-w);
    height: var(--card-h);
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

  /* Main menu responsive layout */
  .ls-main-menu-grid {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  .ls-main-menu-game-col,
  .ls-menu-friends-col {
    flex: 1 1 280px;
    min-width: 260px;
  }

  /* ── Friends panel collapsible (mobile only) ── */
  /* The header is always visible; only the body collapses */
  .ls-friends-panel-header {
    cursor: default;
  }
  .ls-friends-collapsible-body {
    display: none;
  }
  .ls-friends-collapsible-body.expanded {
    display: block;
    animation: viewIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  @media (min-width: 600px) {
    .ls-friends-collapsible-body {
      display: block;
    }
  }

  @media (max-width: 599px) {
    .ls-main-menu-grid {
      flex-direction: column;
      gap: 12px;
    }
    .ls-main-menu-game-col {
      display: contents;
      min-width: 0;
    }
    .ls-menu-logo-wrap {
      order: 0;
      width: 100%;
    }
    .ls-menu-friends-col {
      order: 1;
      flex: none;
      min-width: 0;
      width: 100%;
    }
    .ls-menu-game-card {
      order: 2;
      width: 100%;
    }

    .ls-friends-panel-header {
      border-radius: 12px;
      margin: -4px;
      padding: 4px;
    }
    .ls-friends-collapsible-body {
      display: none;
    }
    .ls-friends-collapsible-body.expanded {
      display: block;
      animation: viewIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .ls-friends-card {
      padding: 18px;
      border-radius: 20px;
    }
    .ls-friend-row {
      align-items: flex-start;
      flex-direction: column;
    }
    .ls-friend-actions {
      width: 100%;
      justify-content: flex-end;
    }
    .ls-friend-name {
      max-width: 220px;
    }
    .ls-party-summary {
      align-items: flex-start;
      flex-direction: column;
    }
    .ls-logo-section {
      margin: 36px 0 24px;
    }
  }

  /* Spacing utils */
  .mt-2 { margin-top: 8px; }
  .mt-3 { margin-top: 12px; }
  .mt-4 { margin-top: 16px; }
`;

// ── Suit Particles ────────────────────────────────────────────
const PARTICLES = [
    { suit: '♠', style: { top: '8%', left: '6%', animationDelay: '0s', animationDuration: '18s', fontSize: '22px', opacity: 0.12 } },
    { suit: '♥', style: { top: '15%', right: '8%', animationDelay: '3s', animationDuration: '22s', fontSize: '16px', opacity: 0.09, color: '#FF6B6B' } },
    { suit: '♦', style: { top: '55%', left: '4%', animationDelay: '6s', animationDuration: '20s', fontSize: '18px', opacity: 0.1, color: '#FF6B6B' } },
    { suit: '♣', style: { top: '70%', right: '5%', animationDelay: '1.5s', animationDuration: '25s', fontSize: '20px', opacity: 0.11 } },
    { suit: '♠', style: { top: '40%', right: '3%', animationDelay: '9s', animationDuration: '16s', fontSize: '13px', opacity: 0.08 } },
    { suit: '♥', style: { top: '85%', left: '10%', animationDelay: '4.5s', animationDuration: '19s', fontSize: '14px', opacity: 0.07, color: '#FF6B6B' } },
];

// ── Page Shell ────────────────────────────────────────────────
function PageShell({ children, wide = false, particles = true }) {
    return (
        <>
            <Head>
                <title>LeastScore</title>
                <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Head>
            <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
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

// ── Logo Header — flipping card, identical to login.js ────────
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
function UserChip({ username }) {
    return (
        <div className="ls-user-chip">
            <span>👤</span>
            <strong>{username}</strong>
        </div>
    );
}

// ── Stepper ───────────────────────────────────────────────────
function Stepper({ value, onChange, min = 2, max = 8, label }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button className="ls-stepper-btn" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>−</button>
            <span className="ls-stepper-val">{value}</span>
            <button className="ls-stepper-btn" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>+</button>
            {label && <span className="ls-stepper-label">{label}</span>}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────
function FriendsDropdownIcon() {
    return (
        <svg className="ls-friends-chevron" viewBox="0 0 256 256" aria-hidden="true" focusable="false">
            <path
                fill="currentColor"
                d="M128 168c-3.1 0-6.1-1.2-8.5-3.5l-64-64a12 12 0 0 1 17-17L128 139l55.5-55.5a12 12 0 0 1 17 17l-64 64A12 12 0 0 1 128 168Z"
            />
        </svg>
    );
}

export default function Home() {
    const router = useRouter();
    const [socket, setSocket] = useState(null);
    const [matchRoomId, setMatchRoomId] = useState('');
    const [lobbyId, setLobbyId] = useState('');
    const [username, setUsername] = useState('');
    const [authToken, setAuthToken] = useState('');
    const [userType, setUserType] = useState('');
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [connected, setConnected] = useState(false);
    const [myPlayerIndex, setMyPlayerIndex] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [selectedCards, setSelectedCards] = useState([]);
    const [drawFrom, setDrawFrom] = useState(null);
    const [visibleIndex, setVisibleIndex] = useState(null);
    const [gameMode, setGameMode] = useState(null);
    const [showMatchHistory, setShowMatchHistory] = useState(false);
    const [playAlongHint, setPlayAlongHint] = useState(null);
    const [easyBotCount, setEasyBotCount] = useState(1);
    const [hardBotCount, setHardBotCount] = useState(0);
    const [botReasoning, setBotReasoning] = useState(null);
    const [botInfoExpanded, setBotInfoExpanded] = useState(false);
    const prevRoundCountRef = useRef(-1);
    const [lobbyAction, setLobbyAction] = useState(null);
    const [inQueue, setInQueue] = useState(false);
    const [onlineLobbyPlayers, setOnlineLobbyPlayers] = useState([]);
    const [onlineLobbyVotes, setOnlineLobbyVotes] = useState(0);
    const [myOnlineVote, setMyOnlineVote] = useState(false);
    const [lobbyCreated, setLobbyCreated] = useState(false);
    const [inLobby, setInLobby] = useState(false);
    const [lobbyTargetPlayers, setLobbyTargetPlayers] = useState(2);
    const [lobbyCurrentPlayers, setLobbyCurrentPlayers] = useState(1);
    const [lobbyPlayers, setLobbyPlayers] = useState([]);
    const [isLobbyCreator, setIsLobbyCreator] = useState(false);
    const [lobbyReadyToStart, setLobbyReadyToStart] = useState(false);
    const [fillLobbyWithBots, setFillLobbyWithBots] = useState(false);
    const [friendsEasyBotCount, setFriendsEasyBotCount] = useState(0);
    const [friendsHardBotCount, setFriendsHardBotCount] = useState(0);
    const [joinViaUrl, setJoinViaUrl] = useState(false);
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState({ incoming: [], outgoing: [] });
    const [friendQuery, setFriendQuery] = useState('');
    const [friendMessage, setFriendMessage] = useState('');
    const [partyMembers, setPartyMembers] = useState([]);
    const [partyCreator, setPartyCreator] = useState(null);
    const [incomingInvite, setIncomingInvite] = useState(null);
    const [socialToast, setSocialToast] = useState('');
    const socialToastTimerRef = useRef(null);
    const [playerWhoExited, setPlayerWhoExited] = useState(null);
    const [disconnectDecisions, setDisconnectDecisions] = useState({});
    const [activeMatchPrompt, setActiveMatchPrompt] = useState(null);
    const disconnectChoiceTimersRef = useRef({});
    const [eliminationPolls, setEliminationPolls] = useState({});
    const [pollCountdowns, setPollCountdowns] = useState({});
    const [reconnectRejectedInfo, setReconnectRejectedInfo] = useState(null);
    const [passScreen, setPassScreen] = useState(false);
    const [turnFinishedScreen, setTurnFinishedScreen] = useState(false);
    const [roundSummary, setRoundSummary] = useState(null);
    const [summaryCountdown, setSummaryCountdown] = useState(0);
    const summaryTimerRef = useRef(null);
    const gameModeRef = useRef(gameMode);
    useEffect(() => { gameModeRef.current = gameMode; }, [gameMode]);
    const gameStateRef = useRef(gameState);
    useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
    const eliminatedLeaderboardShownRef = useRef(false);
    const eliminatedSoundPlayedRef = useRef(false);
    const playAlongHintStateRef = usePlayAlongHintMemory(
        gameState,
        myPlayerIndex,
        gameMode === 'play_along'
    );
    const [friendsTab, setFriendsTab] = useState('friends');
    // Controls whether the collapsible body (tabs + content) is open on mobile
    const [mobileFriendsExpanded, setMobileFriendsExpanded] = useState(false);
    const friendsSectionRef = useRef(null);
    const pendingFriendsScrollRef = useRef(false);

    const applyPartyHomeFocus = useCallback(() => {
        setFriendsTab('party');
        setMobileFriendsExpanded(true);
        pendingFriendsScrollRef.current = true;
    }, []);

    useEffect(() => {
        let audio;
        const isPlayingGame = !!gameState || gameMode === 'tutorial_observe';

        const onInteract = () => {
            if (audio) audio.play().catch(() => { });
            document.removeEventListener('click', onInteract);
            document.removeEventListener('keydown', onInteract);
            document.removeEventListener('touchstart', onInteract);
            document.removeEventListener('scroll', onInteract);
            document.removeEventListener('touchmove', onInteract);
            document.removeEventListener('wheel', onInteract);
        };

        if (!isPlayingGame) {
            audio = new Audio('/sound/home page song.mp3');
            audio.loop = true;
            audio.play().catch(() => {
                document.addEventListener('click', onInteract);
                document.addEventListener('keydown', onInteract);
                document.addEventListener('touchstart', onInteract);
                document.addEventListener('scroll', onInteract);
                document.addEventListener('touchmove', onInteract);
                document.addEventListener('wheel', onInteract);
            });
        }
        return () => {
            document.removeEventListener('click', onInteract);
            document.removeEventListener('keydown', onInteract);
            document.removeEventListener('touchstart', onInteract);
            document.removeEventListener('scroll', onInteract);
            document.removeEventListener('touchmove', onInteract);
            document.removeEventListener('wheel', onInteract);
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        };
    }, [!!gameState, gameMode === 'tutorial_observe']);

    useEffect(() => {
        if (gameState && gameState.currentPlayer !== undefined) {
            if (gameMode !== 'pass_and_play') {
                const audio = new Audio('/sound/turn sound.mp3');
                audio.play().catch(() => { });
            }
        }
    }, [gameState?.currentPlayer, gameMode]);

    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.mode === 'tutorial') {
            setGameMode('tutorial');
            router.replace('/', undefined, { shallow: true });
        }
        if (router.query.expandParty === '1') {
            applyPartyHomeFocus();
            router.replace('/', undefined, { shallow: true });
        }
    }, [router.isReady, router.query.mode, router.query.expandParty, applyPartyHomeFocus]);

    useEffect(() => {
        if (!pendingFriendsScrollRef.current) return;
        if (connected || gameMode || showMatchHistory) return;
        pendingFriendsScrollRef.current = false;
        const timer = setTimeout(() => {
            friendsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
        return () => clearTimeout(timer);
    }, [connected, gameMode, showMatchHistory, partyMembers]);

    const myPlayerIndexRef = useRef(myPlayerIndex);
    useEffect(() => { myPlayerIndexRef.current = myPlayerIndex; }, [myPlayerIndex]);
    const usernameRef = useRef(username);
    useEffect(() => { usernameRef.current = username; }, [username]);

    const getLocalPlayerIndex = useCallback((state) => {
        if (!state || !state.players) return -1;
        const refIndex = myPlayerIndexRef.current;
        if (typeof refIndex === 'number' && refIndex >= 0 && state.players[refIndex]) return refIndex;
        const currentUsername = usernameRef.current;
        return currentUsername ? state.players.findIndex(p => p.username === currentUsername) : -1;
    }, []);

    useEffect(() => {
        if (gameState && myPlayerIndex !== null) {
            const myPlayer = gameState.players[myPlayerIndex];
            if (myPlayer && myPlayer.eliminated && !eliminatedSoundPlayedRef.current) {
                eliminatedSoundPlayedRef.current = true;
                new Audio('/sound/you were eliminated.mp3').play().catch(() => { });
            } else if (myPlayer && !myPlayer.eliminated) {
                eliminatedSoundPlayedRef.current = false;
            }
        }
    }, [gameState, myPlayerIndex]);

    useEffect(() => {
        const playClickSound = (e) => {
            const isEliminated = gameMode !== 'pass_and_play' && myPlayerIndex !== null && gameState && gameState.players[myPlayerIndex] && gameState.players[myPlayerIndex].eliminated;
            const isGamePage = gameState && !gameState.gameOver && !isEliminated;
            if (isGamePage) return;

            const target = e.target.closest('button, .ls-link-text, .link-text, .ls-logo-card-wrap, .logo-card-wrap, .ls-mode-card, .ls-checkbox-row, .ls-tab');
            if (target) {
                const audio = new Audio('/sound/touch%20sound.wav');
                audio.play().catch(() => { });
            }
        };

        document.addEventListener('click', playClickSound);
        return () => document.removeEventListener('click', playClickSound);
    }, [gameState, myPlayerIndex, gameMode]);

    useEffect(() => {
        if (gameState) {
            const currentRoundCount = gameState.roundHistory ? gameState.roundHistory.length : 0;
            const isPlayAlong = gameMode === 'play_along' || gameState.isPlayAlong;

            if (currentRoundCount !== prevRoundCountRef.current) {
                if (isPlayAlong) {
                    setBotInfoExpanded(true);
                } else {
                    setBotInfoExpanded(false);
                }
                prevRoundCountRef.current = currentRoundCount;
            }
        }
    }, [gameState?.roundHistory, gameMode, gameState?.isPlayAlong]);

    useEffect(() => {
        fetch('/api/auth/me', { credentials: 'include' })
            .then(r => r.json())
            .then(data => {
                if (!data.user) {
                    router.replace('/login');
                } else {
                    setUsername(data.user.username);
                    setUserType(data.user.type || '');
                    const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
                    const token = match ? decodeURIComponent(match[1]) : '';
                    setAuthToken(token);
                    setCheckingAuth(false);
                }
            })
            .catch(() => router.replace('/login'));
    }, []);

    const refreshFriendData = async () => {
        if (userType !== 'registered') return;
        try {
            const [friendsRes, requestsRes] = await Promise.all([
                fetch('/api/friends/list', { credentials: 'include' }),
                fetch('/api/friends/requests', { credentials: 'include' }),
            ]);
            if (friendsRes.ok) { const j = await friendsRes.json(); setFriends(j.friends || []); }
            if (requestsRes.ok) { const j = await requestsRes.json(); setFriendRequests(j.requests || { incoming: [], outgoing: [] }); }
        } catch (e) { console.error('Unable to refresh friend data', e); }
    };

    useEffect(() => {
        if (!checkingAuth && userType === 'registered') refreshFriendData();
    }, [checkingAuth, userType]);

    const showSocialToast = useCallback((message) => {
        if (!message) return;
        setSocialToast(message);
        if (socialToastTimerRef.current) clearTimeout(socialToastTimerRef.current);
        socialToastTimerRef.current = setTimeout(() => setSocialToast(''), 5000);
    }, []);

    useEffect(() => {
        return () => {
            if (socialToastTimerRef.current) clearTimeout(socialToastTimerRef.current);
        };
    }, []);

    useEffect(() => {
        setLobbyTargetPlayers(prev => Math.max(prev, partyMembers.length || 1));
    }, [partyMembers]);



    useEffect(() => {
        if (!fillLobbyWithBots) return;
        const vacancies = Math.max(0, lobbyTargetPlayers - lobbyCurrentPlayers);
        const clampedEasy = Math.max(0, Math.min(friendsEasyBotCount, vacancies));
        const remaining = vacancies - clampedEasy;
        if (clampedEasy !== friendsEasyBotCount) { setFriendsEasyBotCount(clampedEasy); setFriendsHardBotCount(remaining); return; }
        if (friendsHardBotCount !== remaining) setFriendsHardBotCount(remaining);
    }, [fillLobbyWithBots, lobbyTargetPlayers, lobbyCurrentPlayers, friendsEasyBotCount, friendsHardBotCount]);

    const sendFriendRequest = async () => {
        if (!friendQuery.trim()) return;
        if (userType === 'guest') {
            const ok = window.confirm('Friend features are available only for registered users. Click OK to upgrade now.');
            if (ok) { if (socket) socket.emit('guestUpgradeIntent'); fetch('/api/auth/guest/upgrade-intent', { method: 'POST' }).catch(() => null).finally(() => router.push('/login?upgradeGuest=1')); }
            return;
        }
        try {
            const res = await fetch('/api/friends/request', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: friendQuery.trim() }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Unable to send request');
            setFriendQuery('');
            refreshFriendData();
            showSocialToast(data.message);
        } catch (error) { showSocialToast(error.message || 'Unable to send request'); }
    };

    const respondFriendRequest = async (requestId, action) => {
        try {
            const res = await fetch('/api/friends/respond', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestId, action }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Unable to respond to request');
            setFriendRequests(prev => ({
                incoming: prev.incoming.filter(request => request.requestId !== requestId),
                outgoing: prev.outgoing,
            }));
            if (action === 'accept') showSocialToast(data.message);
            else setFriendMessage(data.message);
            refreshFriendData();
        } catch (error) { setFriendMessage(error.message || 'Unable to respond to request'); }
    };

    const unfriendFriend = async (friendUsername) => {
        if (!window.confirm(`Are you sure you want to unfriend ${friendUsername}?`)) return;
        try {
            const res = await fetch('/api/friends/unfriend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ friendUsername }), credentials: 'include' });
            const data = await res.json();
            if (res.ok) { setFriendMessage(data.message); setTimeout(() => setFriendMessage(''), 3000); refreshFriendData(); }
            else alert(data.error || 'Unable to unfriend');
        } catch (e) { alert('Network error while unfriending'); }
    };

    const inviteFriendToParty = (friend) => { if (socket) socket.emit('sendPartyInvite', friend.username); };
    const acceptPartyInvite = () => { if (socket && incomingInvite) socket.emit('acceptPartyInvite', incomingInvite.creator || incomingInvite.from); };
    const rejectPartyInvite = () => setIncomingInvite(null);
    const incomingFriendRequest = friendRequests.incoming[0] || null;
    const onlineFriendsCount = friends.filter(friend => friend.online).length;
    const partyMemberCount = partyMembers.length;
    const partySlotCount = Math.max(1, partyMemberCount);
    const acceptFriendRequest = () => {
        if (incomingFriendRequest) respondFriendRequest(incomingFriendRequest.requestId, 'accept');
    };
    const declineFriendRequest = () => {
        if (incomingFriendRequest) respondFriendRequest(incomingFriendRequest.requestId, 'reject');
    };
    const leaveParty = () => { if (socket) socket.emit('leaveParty'); };
    const kickPartyMember = (u) => { if (socket) socket.emit('kickPartyMember', u); };
    const removePartyMember = (fu) => {
        if (partyCreator) { partyCreator === username ? kickPartyMember(fu) : fu === username && leaveParty(); return; }
        setPartyMembers(prev => prev.filter(m => m.username !== fu));
    };

    const checkSoloQueue = (modeName, action) => {
        if (partyMembers.length > 1) { alert(`You can only solo queue in ${modeName} mode. Please leave your party first.`); return; }
        action();
    };

    const handlePlayWithFriends = () => {
        if (partyCreator && partyCreator !== username) { alert("Only the party leader can start a 'Play with Friends' lobby for the entire party."); return; }
        setGameMode('friends');
    };

    const handleJoinLobbyAction = () => {
        if (partyMembers.length > 1) { alert("Your party cannot join a lobby. Create a lobby to play with your party."); return; }
        setLobbyAction('join');
    };

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
            if (res.ok) { if (socket) socket.disconnect(); router.replace('/login'); }
        } catch (e) { console.error('Logout failed', e); }
    };

    useEffect(() => {
        const minSize = Math.max(2, partyMembers.length);
        if (lobbyTargetPlayers < minSize) setLobbyTargetPlayers(minSize);
    }, [partyMembers.length, lobbyTargetPlayers]);

    useEffect(() => {
        if (checkingAuth || !username) return;
        const newSocket = io({
            auth: { token: authToken, username },
            withCredentials: true,
            transports: ['polling', 'websocket'],
            extraHeaders: { "ngrok-skip-browser-warning": "true" }
        });
        setSocket(newSocket);

        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const roomParam = urlParams.get('room');
            if (roomParam) { setLobbyId(roomParam); setGameMode('friends'); setJoinViaUrl(true); }
            const setupPartyParam = urlParams.get('setupParty');
            if (setupPartyParam === '1') { setGameMode('friends'); setLobbyAction('create'); window.history.replaceState({}, '', window.location.pathname); }
        }

        newSocket.on('joined', (playerIndex) => { setConnected(true); setMyPlayerIndex(playerIndex); setInQueue(false); setInLobby(true); });
        newSocket.on('botReasoning', (data) => { setBotReasoning(data && (data.observation || data.decision) ? data : null); });
        newSocket.on('friendStatusUpdate', ({ userId, online }) => { setFriends(prev => prev.map(f => f.userId === userId ? { ...f, online } : f)); });
        newSocket.on('friendDataChanged', () => { refreshFriendData(); });
        newSocket.on('partyInviteReceived', (invite) => setIncomingInvite(invite));
        newSocket.on('partyUpdate', ({ creator, members }) => { setPartyCreator(creator); setPartyMembers(members); if (creator) setIncomingInvite(null); });
        newSocket.on('partyInviteRevoked', () => setIncomingInvite(null));
        newSocket.on('partyMemberJoined', ({ username }) => {
            showSocialToast(`${username} joined your party`);
        });
        newSocket.on('returnHome', ({ expandParty } = {}) => {
            setShowMatchHistory(false);
            setGameMode(null);
            setGameState(null);
            setPlayAlongHint(null);
            setLobbyAction(null);
            setConnected(false);
            setInQueue(false);
            setMyOnlineVote(false);
            setInLobby(false);
            setMatchRoomId('');
            setLobbyId('');
            setJoinViaUrl(false);
            setMyPlayerIndex(null);
            setSelectedCards([]);
            setDrawFrom(null);
            setVisibleIndex(null);
            setLobbyCurrentPlayers(1);
            setLobbyTargetPlayers(2);
            setLobbyPlayers([]);
            setIsLobbyCreator(false);
            setLobbyReadyToStart(false);
            setFillLobbyWithBots(false);
            setFriendsEasyBotCount(0);
            setFriendsHardBotCount(0);
            setActiveMatchPrompt(null);
            setBotReasoning(null);
            setLobbyCreated(false);
            setOnlineLobbyPlayers([]);
            setOnlineLobbyVotes(0);
            if (expandParty !== false) applyPartyHomeFocus();
        });
        newSocket.on('queueLeft', () => { setInQueue(false); setMyOnlineVote(false); });
        newSocket.on('friendRequestAccepted', ({ username }) => {
            showSocialToast(`Friend request accepted by ${username}`);
        });
        newSocket.on('info', (msg) => { showSocialToast(msg); });

        newSocket.on('gameStart', (state, playerIndex, serverRoomId) => {
            eliminatedLeaderboardShownRef.current = false;
            setConnected(true); setGameState(state); setMyPlayerIndex(playerIndex); setBotReasoning(null); setPlayAlongHint(null);
            if (gameModeRef.current === 'pass_and_play') { setMyPlayerIndex(state.currentPlayer); setPassScreen(true); }
            if (serverRoomId) setMatchRoomId(serverRoomId);
            setLobbyCreated(false); setInLobby(false); setJoinViaUrl(false); setLobbyAction(null);
            setLobbyPlayers([]); setLobbyReadyToStart(false); setIsLobbyCreator(false); setPlayerWhoExited(null);
            setLobbyCurrentPlayers(state.players.length);
            if (Object.keys(disconnectChoiceTimersRef.current).length > 0) {
                for (const key of Object.keys(disconnectChoiceTimersRef.current)) clearInterval(disconnectChoiceTimersRef.current[key]);
                disconnectChoiceTimersRef.current = {};
            }
            const restoredTimers = {}; const restoredDecisions = {}; const now = Date.now();
            if (state && state.players) {
                state.players.forEach((p, idx) => {
                    if (idx !== playerIndex && p.disconnectExpiresAt && p.disconnectExpiresAt > now) {
                        const remainingSeconds = Math.ceil((p.disconnectExpiresAt - now) / 1000);
                        restoredTimers[idx] = remainingSeconds;
                        restoredDecisions[idx] = { disconnectedPlayerIndex: idx, isGuestDisconnect: false };
                    }
                });
            }
            Object.keys(restoredTimers).forEach(idxStr => {
                const idx = Number(idxStr);
                disconnectChoiceTimersRef.current[idx] = setInterval(() => {
                    setPollCountdowns(prev => {
                        const val = prev[idx];
                        if (val == null || val <= 1) { clearInterval(disconnectChoiceTimersRef.current[idx]); delete disconnectChoiceTimersRef.current[idx]; const { [idx]: _, ...rest } = prev; return rest; }
                        return { ...prev, [idx]: val - 1 };
                    });
                }, 1000);
            });
            setPollCountdowns(restoredTimers); setDisconnectDecisions(restoredDecisions);
            setActiveMatchPrompt(null); setReconnectRejectedInfo(null);
            if (summaryTimerRef.current) { clearInterval(summaryTimerRef.current); summaryTimerRef.current = null; }
            setRoundSummary(null); setSelectedCards([]); setVisibleIndex(null); setDrawFrom(null);
        });

        newSocket.on('gameUpdate', (state, info) => {
            if (gameModeRef.current === 'friends' && eliminatedLeaderboardShownRef.current) return;
            setGameState(state);
            if (gameModeRef.current === 'pass_and_play') {
                if (!state.gameOver && state.currentPlayer !== myPlayerIndexRef.current) setTurnFinishedScreen(true);
                else setMyPlayerIndex(state.currentPlayer);
            }
            if (info !== undefined) {
                if (info && typeof info === 'object' && info.roundSummary) {
                    setRoundSummary(info.roundSummary); setSummaryCountdown(10);
                    const myPlayerIdx = myPlayerIndexRef.current;
                    if (state.roundHistory && state.roundHistory.length > 0 && myPlayerIdx !== null) {
                        const lastRound = state.roundHistory[state.roundHistory.length - 1];
                        const myScoreChange = lastRound.scores[myPlayerIdx];
                        const amIEliminated = state.players[myPlayerIdx]?.eliminated;
                        if (myScoreChange !== null && !amIEliminated) {
                            if (myScoreChange > 0) {
                                new Audio('/sound/round lost.mp3').play().catch(() => { });
                            } else {
                                new Audio('/sound/round won.mp3').play().catch(() => { });
                            }
                        }
                    }
                    if (summaryTimerRef.current) clearInterval(summaryTimerRef.current);
                    summaryTimerRef.current = setInterval(() => {
                        setSummaryCountdown(prev => {
                            if (prev <= 1) { clearInterval(summaryTimerRef.current); summaryTimerRef.current = null; setRoundSummary(null); return 0; }
                            return prev - 1;
                        });
                    }, 1000);
                } else if (info && typeof info === 'object' && info.declaredPlayerIndex !== undefined) {
                    const declarer = state.players[info.declaredPlayerIndex];
                    const declarerName = declarer ? declarer.username : `Player ${info.declaredPlayerIndex + 1}`;
                    const declaredWon = !!info.declaredWon;
                    alert(`${declarerName} declared and ${declaredWon ? 'won' : 'lost'}.`);
                }
            }
            setSelectedCards([]); setVisibleIndex(null); setDrawFrom(null); setPlayAlongHint(null);
        });

        newSocket.on('gameEnded', (state, exitingPlayerIndex) => {
            if (gameModeRef.current === 'friends' && eliminatedLeaderboardShownRef.current) return;
            const localIndex = getLocalPlayerIndex(state);
            if (gameModeRef.current === 'friends' && localIndex !== -1 && state.players[localIndex]?.eliminated) {
                eliminatedLeaderboardShownRef.current = true;
            }
            setConnected(true); setGameState(state); setPlayerWhoExited(exitingPlayerIndex);
            setMyPlayerIndex(prev => { if (prev !== null || !username) return prev; const r = state.players.findIndex(p => p.username === username); return r !== -1 ? r : prev; });
            setSelectedCards([]); setVisibleIndex(null);
            if (Object.keys(disconnectChoiceTimersRef.current).length > 0) { for (const key of Object.keys(disconnectChoiceTimersRef.current)) clearInterval(disconnectChoiceTimersRef.current[key]); disconnectChoiceTimersRef.current = {}; }
            setDisconnectDecisions({}); setEliminationPolls({}); setPollCountdowns({}); setReconnectRejectedInfo(null);
        });

        newSocket.on('guestDisconnected', (state, guestPlayerIndex) => {
            new Audio('/sound/disconnected.mp3').play().catch(() => { });
            setGameState(state); setPlayerWhoExited(guestPlayerIndex); setSelectedCards([]); setVisibleIndex(null);
            if (Object.keys(disconnectChoiceTimersRef.current).length > 0) { for (const key of Object.keys(disconnectChoiceTimersRef.current)) clearInterval(disconnectChoiceTimersRef.current[key]); disconnectChoiceTimersRef.current = {}; }
            setDisconnectDecisions({});
            setTimeout(() => {
                alert('Your opponent (guest player) has been disconnected for too long and their temporary account has been deleted. You are declared the winner as they were unable to reconnect. Guest accounts are temporary and expire if inactive for 60 seconds.');
            }, 100);
        });

        newSocket.on('playerDisconnected', (disconnectedPlayerIndex, isGuestDisconnect, expiresAt) => {
            new Audio('/sound/disconnected.mp3').play().catch(() => { });
            const initialSeconds = expiresAt ? Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)) : 60;
            setPollCountdowns(prev => ({ ...prev, [disconnectedPlayerIndex]: initialSeconds }));
            setDisconnectDecisions(prev => ({ ...prev, [disconnectedPlayerIndex]: { disconnectedPlayerIndex, isGuestDisconnect: isGuestDisconnect === true } }));
            const timers = disconnectChoiceTimersRef.current;
            if (timers[disconnectedPlayerIndex]) clearInterval(timers[disconnectedPlayerIndex]);
            timers[disconnectedPlayerIndex] = setInterval(() => {
                setPollCountdowns(prev => {
                    const val = prev[disconnectedPlayerIndex];
                    if (val == null) { clearInterval(timers[disconnectedPlayerIndex]); delete timers[disconnectedPlayerIndex]; return prev; }
                    if (val <= 1) { clearInterval(timers[disconnectedPlayerIndex]); delete timers[disconnectedPlayerIndex]; const { [disconnectedPlayerIndex]: _, ...rest } = prev; return rest; }
                    return { ...prev, [disconnectedPlayerIndex]: val - 1 };
                });
            }, 1000);
        });

        newSocket.on('startEliminationPoll', (state, disconnectedPlayerIndex) => {
            const timers = disconnectChoiceTimersRef.current;
            if (timers[disconnectedPlayerIndex]) { clearInterval(timers[disconnectedPlayerIndex]); delete timers[disconnectedPlayerIndex]; }
            setPollCountdowns(prev => { const { [disconnectedPlayerIndex]: _, ...rest } = prev; return rest; });
            setDisconnectDecisions(prev => ({ ...prev, [disconnectedPlayerIndex]: { disconnectedPlayerIndex } }));
            setEliminationPolls(prev => ({ ...prev, [disconnectedPlayerIndex]: { targetIndex: disconnectedPlayerIndex, counts: { eliminate: 0, wait: 0, total: 0, phase: 'waiting' }, myVote: 'wait', gameState: state } }));
        });

        newSocket.on('eliminationVoteUpdate', (state, disconnectedPlayerIndex, counts) => {
            setEliminationPolls(prev => { if (!prev[disconnectedPlayerIndex]) return prev; return { ...prev, [disconnectedPlayerIndex]: { ...prev[disconnectedPlayerIndex], counts: { ...prev[disconnectedPlayerIndex].counts, ...counts }, gameState: state } }; });
        });

        newSocket.on('eliminationPollCancelled', (reconnectedIndex) => {
            const timers = disconnectChoiceTimersRef.current;
            if (timers[reconnectedIndex]) { clearInterval(timers[reconnectedIndex]); delete timers[reconnectedIndex]; }
            setPollCountdowns(prev => { const { [reconnectedIndex]: _, ...rest } = prev; return rest; });
            setDisconnectDecisions(prev => { const { [reconnectedIndex]: _, ...rest } = prev; return rest; });
            setEliminationPolls(prev => { const { [reconnectedIndex]: _, ...rest } = prev; return rest; });
            setTimeout(() => {
                alert(`Player ${reconnectedIndex + 1} reconnected — poll cancelled.`);
            }, 100);
        });

        newSocket.on('opponentReconnected', (reconnectedUserType, reconnectedIndex) => {
            new Audio('/sound/disconnected.mp3').play().catch(() => { });
            if (typeof reconnectedIndex === 'number') {
                const timers = disconnectChoiceTimersRef.current;
                if (timers[reconnectedIndex]) { clearInterval(timers[reconnectedIndex]); delete timers[reconnectedIndex]; }
                setDisconnectDecisions(prev => { const { [reconnectedIndex]: _, ...rest } = prev; return rest; });
                setPollCountdowns(prev => { const { [reconnectedIndex]: _, ...rest } = prev; return rest; });
                setEliminationPolls(prev => { const { [reconnectedIndex]: _, ...rest } = prev; return rest; });
            } else {
                for (const key of Object.keys(disconnectChoiceTimersRef.current)) clearInterval(disconnectChoiceTimersRef.current[key]);
                disconnectChoiceTimersRef.current = {}; setDisconnectDecisions({}); setPollCountdowns({}); setEliminationPolls({});
            }
            setTimeout(() => {
                alert(reconnectedUserType === 'guest' ? 'Your opponent (guest player) has reconnected.' : 'Your opponent (registered player) has reconnected.');
            }, 100);
        });

        newSocket.on('opponentReconnectedAndExited', (reconnectedUserType) => {
            new Audio('/sound/disconnected.mp3').play().catch(() => { });
            for (const key of Object.keys(disconnectChoiceTimersRef.current)) clearInterval(disconnectChoiceTimersRef.current[key]);
            disconnectChoiceTimersRef.current = {}; setDisconnectDecisions({}); setPollCountdowns({}); setEliminationPolls({});
            setTimeout(() => {
                alert(reconnectedUserType === 'guest' ? 'Your opponent (guest player) reconnected, then chose to exit the game. You win this match.' : 'Your opponent (registered player) reconnected, then chose to exit the game. You win this match.');
            }, 100);
        });

        newSocket.on('activeMatchFound', ({ roomId: activeRoomId, opponentUsername }) => { setActiveMatchPrompt({ roomId: activeRoomId, opponentUsername: opponentUsername || 'Opponent' }); });
        newSocket.on('lastMatchExited', () => { setActiveMatchPrompt(null); alert('You exited your previous active match. Showing final leaderboard.'); });
        newSocket.on('error', (msg) => { alert(msg); setInQueue(false); });

        newSocket.on('playerEliminated', (state, eliminatedPlayerIndex, info) => {
            const localIndex = getLocalPlayerIndex(state);
            if (gameModeRef.current === 'friends' && localIndex !== -1 && localIndex === eliminatedPlayerIndex) {
                eliminatedLeaderboardShownRef.current = true;
            }
            setGameState(state);
            if (info && info.reason === 'exit') setPlayerWhoExited(eliminatedPlayerIndex);
            setSelectedCards([]); setVisibleIndex(null);
            setEliminationPolls(prev => { if (!prev[eliminatedPlayerIndex]) return prev; const { [eliminatedPlayerIndex]: _, ...rest } = prev; return rest; });
            setDisconnectDecisions(prev => { if (!prev[eliminatedPlayerIndex]) return prev; const { [eliminatedPlayerIndex]: _, ...rest } = prev; return rest; });
            setPollCountdowns(prev => { if (!prev[eliminatedPlayerIndex]) return prev; const { [eliminatedPlayerIndex]: _, ...rest } = prev; return rest; });
            const eliminatedPlayer = state.players[eliminatedPlayerIndex];
            const name = eliminatedPlayer ? eliminatedPlayer.username : `Player ${eliminatedPlayerIndex + 1}`;
            if (localIndex !== -1 && localIndex === eliminatedPlayerIndex) {
                setTimeout(() => alert('You have been eliminated. Redirecting to leaderboard.'), 50);
            } else {
                new Audio('/sound/someone else eliminated.mp3').play().catch(() => { });
                const reasonText = info && info.reason === 'exit' ? 'exited and is therefore eliminated' : 'has been eliminated';
                setTimeout(() => alert(`${name} ${reasonText}.`), 50);
            }
        });

        newSocket.on('roomFull', () => alert('Room is full'));
        newSocket.on('queueJoined', () => { setInQueue(true); setMyOnlineVote(false); });
        newSocket.on('onlineLobbyUpdate', (players, votes) => { setOnlineLobbyPlayers(players); setOnlineLobbyVotes(votes); });

        newSocket.on('lobbyCreated', (generatedRoomId, currentPlayers, targetPlayers, usernames) => {
            setLobbyId(generatedRoomId); setLobbyCreated(true); setInLobby(true); setConnected(true);
            setLobbyCurrentPlayers(currentPlayers || 1); setLobbyTargetPlayers(targetPlayers || 2);
            setLobbyPlayers(usernames || []); setIsLobbyCreator(true); setLobbyReadyToStart(false);
            setFillLobbyWithBots(false); setFriendsEasyBotCount(0); setFriendsHardBotCount(0);
        });

        newSocket.on('partyLobbyJoined', ({ roomId: joinedRoomId, currentPlayers, targetPlayers, playerUsernames }) => {
            setGameMode('friends'); setLobbyAction('create'); setLobbyId(joinedRoomId); setConnected(true); setInLobby(true);
            setLobbyCreated(false); setLobbyCurrentPlayers(currentPlayers || 1); setLobbyTargetPlayers(targetPlayers || 2);
            setLobbyPlayers(playerUsernames || []); setIsLobbyCreator(false); setLobbyReadyToStart(currentPlayers === targetPlayers);
            setFillLobbyWithBots(false); setFriendsEasyBotCount(0); setFriendsHardBotCount(0);
        });

        newSocket.on('lobbyUpdate', (currentPlayers, targetPlayers, usernames) => {
            setInLobby(true); setLobbyCurrentPlayers(currentPlayers || 1); setLobbyTargetPlayers(targetPlayers || 2);
            setLobbyPlayers(usernames || []); setLobbyReadyToStart(false);
        });

        newSocket.on('lobbyReady', (currentPlayers, targetPlayers, usernames) => {
            setLobbyCurrentPlayers(currentPlayers || 1); setLobbyTargetPlayers(targetPlayers || 2);
            setLobbyPlayers(usernames || []); setLobbyReadyToStart(true);
        });

        newSocket.on('playerLeftMultiplayer', (playerIndex) => {
            new Audio('/sound/disconnected.mp3').play().catch(() => { });
            setTimeout(() => {
                alert(`Player ${playerIndex + 1} disconnected from the multiplayer game.`);
            }, 100);
        });

        newSocket.on('lobbyCancelled', () => {
            alert('The lobby was cancelled by the creator.');
            setConnected(false); setGameMode(null); setLobbyAction(null); setLobbyId('');
            setLobbyCreated(false); setInLobby(false); setLobbyPlayers([]); setIsLobbyCreator(false); setLobbyReadyToStart(false);
        });

        newSocket.on('disconnect', () => {
            setConnected(false); setInQueue(false); setLobbyCreated(false); setInLobby(false);
            setLobbyPlayers([]); setIsLobbyCreator(false); setLobbyReadyToStart(false);
            if (Object.keys(disconnectChoiceTimersRef.current).length > 0) { for (const key of Object.keys(disconnectChoiceTimersRef.current)) clearInterval(disconnectChoiceTimersRef.current[key]); disconnectChoiceTimersRef.current = {}; }
            setDisconnectDecisions({}); setPollCountdowns({}); setEliminationPolls({}); setReconnectRejectedInfo(null);
        });

        newSocket.on('reconnectRejected', ({ message, finalState, playerIndex }) => {
            const msg = message || 'Your opponents chose to eliminate you while you were disconnected.';
            setReconnectRejectedInfo({ message: msg }); setActiveMatchPrompt(null);
            setEliminationPolls({}); setPollCountdowns({}); setDisconnectDecisions({});
            if (gameModeRef.current === 'friends' && finalState) eliminatedLeaderboardShownRef.current = true;
            setConnected(true); if (finalState) setGameState(finalState); if (typeof playerIndex === 'number') setMyPlayerIndex(playerIndex);
        });

        return () => {
            if (Object.keys(disconnectChoiceTimersRef.current).length > 0) { for (const key of Object.keys(disconnectChoiceTimersRef.current)) clearInterval(disconnectChoiceTimersRef.current[key]); disconnectChoiceTimersRef.current = {}; }
            if (summaryTimerRef.current) clearInterval(summaryTimerRef.current);
            newSocket.close();
        };
    }, [checkingAuth, authToken, showSocialToast, applyPartyHomeFocus]);

    // ── Action handlers ───────────────────────────────────────
    const joinRoom = () => { if (socket && matchRoomId && username) socket.emit('joinRoom', matchRoomId, username); };
    const joinQueue = () => { if (socket && username) socket.emit('joinQueue', username); };

    const tryOnlineMode = () => {
        if (userType === 'guest') {
            const ok = window.confirm('Online mode is available only for registered users.\n\nClick OK to register now, or Cancel to go back.');
            if (ok) { if (socket) socket.emit('guestUpgradeIntent'); fetch('/api/auth/guest/upgrade-intent', { method: 'POST' }).catch(() => null).finally(() => router.push('/login?upgradeGuest=1')); }
            return;
        }
        setGameMode('online');
    };

    const createLobby = () => {
        if (socket && username) {
            const finalTargetPlayers = Math.max(lobbyTargetPlayers, partyMembers.length || 1);
            if (finalTargetPlayers !== lobbyTargetPlayers) setLobbyTargetPlayers(finalTargetPlayers);
            const payload = { username, targetPlayers: finalTargetPlayers };
            if (partyMembers.length > 0) payload.partyMembers = partyMembers.map(f => f.username);
            socket.emit('createLobby', payload);
        }
    };

    const cancelLobby = () => {
        if (socket && lobbyId) socket.emit('leaveLobby', lobbyId);
        window.location.href = window.location.origin + '?setupParty=1';
    };

    const joinLobby = () => { if (socket && lobbyId && username) { setIsLobbyCreator(false); socket.emit('joinLobby', lobbyId, username); } };

    const startLobbyGame = (allowPartialStart = false) => {
        if (socket && lobbyId) {
            const options = { allowPartialStart };
            if (fillLobbyWithBots) {
                const vacancies = Math.max(0, lobbyTargetPlayers - lobbyCurrentPlayers);
                const easy = Number(friendsEasyBotCount) || 0;
                const hard = Number(friendsHardBotCount) || 0;
                if (easy < 0 || hard < 0 || easy + hard !== vacancies) { alert(`Please set Easy + Hard bots to exactly ${vacancies}.`); return; }
                options.includeBots = true; options.easyBotCount = easy; options.hardBotCount = hard;
            }
            socket.emit('startLobbyGame', lobbyId, options);
        }
    };

    const leaveLobby = () => {
        if (socket && lobbyId) socket.emit('leaveLobby', lobbyId);
        setConnected(false); setInLobby(false); setLobbyCreated(false); setGameMode('friends'); setLobbyAction('join');
        setLobbyId(''); setLobbyCurrentPlayers(1); setLobbyTargetPlayers(2); setLobbyPlayers([]);
        setIsLobbyCreator(false); setLobbyReadyToStart(false); setFillLobbyWithBots(false);
        setFriendsEasyBotCount(0); setFriendsHardBotCount(0);
    };

    const goBackHome = () => {
        if (socket && matchRoomId) socket.emit('leaveRoom', matchRoomId);
        setGameState(null); setGameMode(null); setPlayAlongHint(null); setLobbyAction(null);
        setConnected(false); setInLobby(false); setMatchRoomId(''); setLobbyId('');
        setMyPlayerIndex(null); setSelectedCards([]); setDrawFrom(null); setVisibleIndex(null);
        setLobbyCurrentPlayers(1); setLobbyTargetPlayers(2); setLobbyPlayers([]);
        setIsLobbyCreator(false); setLobbyReadyToStart(false); setFillLobbyWithBots(false);
        setFriendsEasyBotCount(0); setFriendsHardBotCount(0); setActiveMatchPrompt(null); setBotReasoning(null);
    };

    const startAIGame = () => {
        if (!socket) return;
        const easy = Number(easyBotCount) || 0;
        const hard = Number(hardBotCount) || 0;
        const totalBots = easy + hard;
        if (totalBots < 1 || totalBots > 7) { alert('AI matches support between 1 and 7 bots (max 8 total players).'); return; }
        const targetPlayers = totalBots + 1;
        socket.emit('createAIGame', { username, targetPlayers, difficulty: 'both', easyBotCount: easy, hardBotCount: hard });
        setGameMode('ai'); setConnected(true);
    };

    const startPlayAlongGame = () => {
        if (!socket) return;
        socket.emit('createAIGame', { username, targetPlayers: 2, difficulty: 'both', easyBotCount: 1, hardBotCount: 0, mode: 'play_along' });
        setGameMode('play_along'); setConnected(true); setPlayAlongHint(null);
    };

    const requestPlayAlongHint = () => {
        if (!gameState || myPlayerIndex === null) return;
        if (gameState.currentPlayer !== myPlayerIndex) return;
        const result = computePlayAlongHint(gameState, myPlayerIndex, playAlongHintStateRef);
        setPlayAlongHint(result);
        applyPlayAlongHintSelection(result, { setSelectedCards, setDrawFrom, setVisibleIndex });
    };

    const makeTurn = () => {
        if (!socket || !gameState || myPlayerIndex === null) return;
        if (!drawFrom) { alert('Please select a card source to draw from (Hidden Deck or a Visible Card).'); return; }
        if (drawFrom === 'visible' && visibleIndex == null) { alert('Choose one visible card to draw.'); return; }
        setBotReasoning(null); setPlayAlongHint(null);
        const data = { playerId: myPlayerIndex, drawFrom, discardCards: selectedCards };
        if (drawFrom === 'visible') data.visibleIndex = visibleIndex;
        socket.emit('makeTurn', matchRoomId, data);
    };

    const declare = () => {
        if (!socket || !gameState || myPlayerIndex === null) return;
        setPlayAlongHint(null);
        socket.emit('declare', matchRoomId, { playerId: myPlayerIndex });
    };

    const exitGame = () => {
        new Audio('/sound/touch sound.wav').play().catch(() => { });
        const isLocalGame = gameMode === 'pass_and_play' || gameMode === 'ai' || gameMode === 'play_along';
        const msg = isLocalGame ? 'Do you want to end this game?' : 'Are you sure you want to exit? This will count as a declaration and your opponent will win.';
        setTimeout(() => {
            const confirmed = window.confirm(msg);
            if (confirmed && socket && gameState && myPlayerIndex !== null) socket.emit('exitGame', matchRoomId, { playerId: myPlayerIndex });
        }, 50);
    };

    const continueLastMatch = () => { if (!socket || !activeMatchPrompt?.roomId) return; socket.emit('resumeLastMatch', activeMatchPrompt.roomId); };

    const exitLastMatch = () => {
        if (!socket || !activeMatchPrompt?.roomId) return;
        const confirmed = window.confirm('Exit your last active match? Your opponent will be declared the winner.');
        if (!confirmed) return;
        socket.emit('exitLastMatch', activeMatchPrompt.roomId);
    };

    const chooseToKeepWaiting = () => {
        if (!socket || !matchRoomId) return;
        socket.emit('continueWaiting', matchRoomId);
        for (const key of Object.keys(disconnectChoiceTimersRef.current)) clearInterval(disconnectChoiceTimersRef.current[key]);
        disconnectChoiceTimersRef.current = {}; setDisconnectDecisions({}); setPollCountdowns({}); setEliminationPolls({});
    };

    const endGameDueToDisconnect = () => {
        if (!socket || !matchRoomId) return;
        const confirmed = window.confirm('End the game now and claim the win because your opponent is still disconnected?');
        if (!confirmed) return;
        socket.emit('claimDisconnectWin', matchRoomId);
    };

    const castEliminationVote = (targetIndex, choice) => {
        if (!socket || !matchRoomId) return;
        const poll = eliminationPolls[targetIndex];
        if (!poll) return;
        const currentVote = poll.myVote;
        if (currentVote && currentVote !== choice) { const confirmed = window.confirm('Do you really want to change your decision?'); if (!confirmed) return; }
        socket.emit('castEliminationVote', matchRoomId, targetIndex, choice);
        setEliminationPolls(prev => prev[targetIndex] ? { ...prev, [targetIndex]: { ...prev[targetIndex], myVote: choice } } : prev);
    };

    const toggleCardSelection = (card) => {
        setSelectedCards(prev =>
            prev.some(c => c.suit === card.suit && c.rank === card.rank)
                ? prev.filter(c => !(c.suit === card.suit && c.rank === card.rank))
                : [...prev, card]
        );
    };

    const skipSummary = () => {
        if (summaryTimerRef.current) { clearInterval(summaryTimerRef.current); summaryTimerRef.current = null; }
        setRoundSummary(null);
    };

    const copyToClipboard = (text) => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => alert('Link copied to clipboard!')).catch(() => { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); alert('Link copied to clipboard!'); });
        } else { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); alert('Link copied to clipboard!'); }
    };

    const suitSymbols = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
    const isSelectedCard = (card) => selectedCards.some(c => c.suit === card.suit && c.rank === card.rank);

    // ── Card renderer ─────────────────────────────────────────
    const renderCard = (key, card, onClick, selected = false, highlight = false, hintGlow = null, customStyle = {}) => {
        const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
        const isPlayAlong = gameMode === 'play_along' || (gameState && gameState.isPlayAlong);
        const usePlayAlongGlow = isPlayAlong && playAlongHint && hintGlow;

        if (usePlayAlongGlow) {
            const paStyle = playAlongCardStyle(card, { discardGlow: hintGlow.discardGlow, drawnGlow: hintGlow.drawnGlow, selected, highlight });
            return (
                <button key={key} onClick={onClick} style={{ ...paStyle, ...customStyle }}>
                    <div style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 0.9 }}>
                        <span style={{ fontSize: 'calc(var(--card-w) * 0.25)', fontWeight: 900 }}>{card.rank}</span>
                        <span style={{ fontSize: 'calc(var(--card-w) * 0.2)' }}>{suitSymbols[card.suit]}</span>
                    </div>
                    <span style={{ fontSize: 'calc(var(--card-w) * 0.55)', lineHeight: 1 }}>{suitSymbols[card.suit]}</span>
                    <div style={{ alignSelf: 'flex-end', display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 0.9, transform: 'rotate(180deg)' }}>
                        <span style={{ fontSize: 'calc(var(--card-w) * 0.25)', fontWeight: 900 }}>{card.rank}</span>
                        <span style={{ fontSize: 'calc(var(--card-w) * 0.2)' }}>{suitSymbols[card.suit]}</span>
                    </div>
                </button>
            );
        }

        const noInteract = !onClick;
        let cls = 'ls-playing-card';
        if (selected === 'discard' || selected === true) cls += ' selected-discard';
        else if (selected === 'draw') cls += ' selected-draw';
        else if (highlight) cls += ' highlight';
        if (noInteract) cls += ' no-interact';

        return (
            <button key={key} onClick={onClick || (() => { })} className={cls} style={{ color: isRed ? '#c11' : '#111', ...customStyle }}>
                <div style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 0.9 }}>
                    <span style={{ fontSize: 'calc(var(--card-w) * 0.25)', fontWeight: 900 }}>{card.rank}</span>
                    <span style={{ fontSize: 'calc(var(--card-w) * 0.2)' }}>{suitSymbols[card.suit]}</span>
                </div>
                <span style={{ fontSize: 'calc(var(--card-w) * 0.55)', lineHeight: 1 }}>{suitSymbols[card.suit]}</span>
                <div style={{ alignSelf: 'flex-end', display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 0.9, transform: 'rotate(180deg)' }}>
                    <span style={{ fontSize: 'calc(var(--card-w) * 0.25)', fontWeight: 900 }}>{card.rank}</span>
                    <span style={{ fontSize: 'calc(var(--card-w) * 0.2)' }}>{suitSymbols[card.suit]}</span>
                </div>
            </button>
        );
    };

    // ── Loading ───────────────────────────────────────────────
    const showGlobalSocial = userType === 'registered' && !(gameState && !gameState.gameOver);
    const globalSocialOverlay = showGlobalSocial ? (
        <GlobalSocialOverlays
            incomingInvite={incomingInvite}
            incomingFriendRequest={incomingFriendRequest}
            pendingFriendRequestCount={friendRequests.incoming.length}
            socialToast={socialToast}
            onAcceptParty={acceptPartyInvite}
            onRejectParty={rejectPartyInvite}
            onAcceptFriend={acceptFriendRequest}
            onDeclineFriend={declineFriendRequest}
        />
    ) : null;
    const wrapScreen = (content) => (<>{content}{globalSocialOverlay}</>);

    if (checkingAuth) {
        return wrapScreen(
            <PageShell>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="ls-spinner" />
                </div>
            </PageShell>
        );
    }

    // ── Active match prompt ───────────────────────────────────
    if (!connected && activeMatchPrompt) {
        return wrapScreen(
            <PageShell>
                <LogoHeader subtitle="You have an unfinished match" />
                <div className="ls-card view-animate">
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ fontSize: '44px', marginBottom: '14px', filter: 'drop-shadow(0 0 16px rgba(255,200,87,0.3))' }}>⚔️</div>
                        <p className="ls-section-title" style={{ textAlign: 'center', fontSize: '26px' }}>Resume Match</p>
                        <p style={{ color: '#8896A7', fontSize: '14px', margin: '8px 0 0', lineHeight: 1.6 }}>
                            Active match against <strong style={{ color: '#FFC857' }}>{activeMatchPrompt.opponentUsername}</strong>
                        </p>
                    </div>
                    <button className="btn-green" onClick={continueLastMatch} style={{ marginBottom: '10px' }}>
                        ▶ Continue Match
                    </button>
                    <button className="btn-danger" onClick={exitLastMatch}>
                        ✕ Exit & Forfeit
                    </button>
                </div>
            </PageShell>
        );
    }

    // ── Match History ─────────────────────────────────────────
    if (!connected && showMatchHistory) {
        return wrapScreen(<MatchHistory onBack={() => setShowMatchHistory(false)} />);
    }

    // ── Main Menu ─────────────────────────────────────────────
    if (!connected && !gameMode) {
        const gameModes = [
            { label: 'Online Match', desc: 'Play against others worldwide', img: '/images/menu/online-match.png', action: () => checkSoloQueue('Online Match', tryOnlineMode), guestBlocked: true },
            { label: 'Play with Friends', desc: 'Create or join a private lobby', img: '/images/menu/play-with-friends.png', action: handlePlayWithFriends },
            { label: 'Pass and Play', desc: 'Local multiplayer on one device', img: '/images/menu/pass-and-play.png', action: () => checkSoloQueue('Pass and Play', () => setGameMode('pass_and_play')) },
            { label: 'Play with AI', desc: 'Practice vs smart bots', img: '/images/menu/play-with-ai.png', action: () => checkSoloQueue('Play with AI', () => setGameMode('ai')) },
            { label: 'Tutorial', desc: 'Learn how to play', img: '/images/menu/tutorial.png', action: () => setGameMode('tutorial') },
        ];

        return wrapScreen(
            <PageShell wide>
                <Head><title>LeastScore — Home</title></Head>
                <div className="ls-main-menu-grid">
                    {/* Left: Game modes */}
                    <div className="ls-main-menu-game-col">
                        <div className="ls-menu-logo-wrap">
                            <LogoHeader badge="The card game where less wins" />
                        </div>
                        <div className="ls-card ls-menu-game-card">
                            <div className="ls-section-header" style={{ marginBottom: '16px' }}>
                                <h3>Game Modes</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div className="ls-user-chip" style={{ margin: 0 }}>
                                        <span>👤</span>
                                        <strong>{username}</strong>
                                    </div>
                                    <button className="btn-icon danger" onClick={handleLogout}>Logout</button>
                                </div>
                            </div>
                            {gameModes.map((mode, i) => (
                                <button key={i} className="ls-mode-card" onClick={mode.action} style={{ animationDelay: `${i * 0.07}s` }}>
                                    <img src={mode.img} alt={mode.label} className="ls-mode-card-img" loading="lazy" />
                                    <div className="ls-mode-card-overlay" />
                                    <div className="ls-mode-card-content">
                                        <div>
                                            <p className="ls-mode-label">{mode.label}</p>
                                            <p className="ls-mode-desc">{mode.desc}</p>
                                        </div>
                                        {mode.guestBlocked && userType === 'guest' && (
                                            <span className="ls-badge" style={{ flexShrink: 0 }}>Register</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                            {userType === 'registered' && (
                                <button className="ls-mode-card" onClick={() => setShowMatchHistory(true)} style={{ aspectRatio: 'auto', minHeight: '64px' }}>
                                    <div className="ls-mode-card-overlay" style={{ background: 'linear-gradient(135deg, rgba(100,116,139,0.15), rgba(13,17,23,0.95))' }} />
                                    <div className="ls-mode-card-content">
                                        <div>
                                            <p className="ls-mode-label">📊 Match History</p>
                                            <p className="ls-mode-desc">Review your past games</p>
                                        </div>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: Friends & Party */}
                    {userType === 'registered' ? (
                        <div className="ls-menu-friends-col" ref={friendsSectionRef}>
                            {friendMessage && <div className="ls-alert-success" style={{ marginBottom: '12px' }}>{friendMessage}</div>}

                            <div className="ls-card ls-friends-card">
                                {/*
                                  The header is always visible.
                                  On mobile (≤599px) it becomes a tap target to expand/collapse the body.
                                  On desktop it is non-interactive (cursor: default).
                                */}
                                <div
                                    className="ls-friends-panel-header"
                                >
                                    <div className="ls-friends-panel-copy">
                                        <p className="ls-friends-panel-title">Friends & Party</p>
                                        <p className="ls-friends-panel-sub">Invite online friends and create a Party</p>

                                        <div className="ls-friends-counts">
                                            <span className="ls-badge green">{onlineFriendsCount} Online</span>
                                            <span className="ls-badge">{partyMemberCount} Party</span>
                                        </div>
                                        {/* Chevron — only visible on mobile via CSS */}
                                    </div>
                                    <button
                                        type="button"
                                        className="ls-friends-dropdown-toggle"
                                        onClick={() => setMobileFriendsExpanded(open => !open)}
                                        aria-expanded={mobileFriendsExpanded}
                                        aria-label={mobileFriendsExpanded ? 'Collapse friends and party menu' : 'Expand friends and party menu'}
                                    >
                                        {mobileFriendsExpanded ? '▲' : '▼'}
                                        <FriendsDropdownIcon />
                                    </button>
                                </div>

                                {/* Collapsible body: tabs + content */}
                                <div className={`ls-friends-collapsible-body${mobileFriendsExpanded ? ' expanded' : ''}`}>
                                    <div className="ls-tabs">
                                        {[{ key: 'friends', label: 'Friends' }, { key: 'party', label: 'Party' }].map(tab => (
                                            <button key={tab.key} className={`ls-tab${friendsTab === tab.key ? ' active' : ''}`} onClick={() => setFriendsTab(tab.key)}>
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Friends tab */}
                                    {friendsTab === 'friends' && (
                                        <div className="view-animate">
                                            <div className="ls-friend-search-row">
                                                <input
                                                    className="ls-copy-input"
                                                    placeholder="username#TAG"
                                                    value={friendQuery}
                                                    onChange={e => setFriendQuery(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && sendFriendRequest()}
                                                />
                                                <button className="btn-icon success" onClick={sendFriendRequest}>Add</button>
                                            </div>
                                            {friends.length === 0 && (
                                                <div className="ls-empty-state">
                                                    <p className="ls-empty-state-title">No friends yet</p>
                                                    <p className="ls-empty-state-copy">Send a request with a username and tag.</p>
                                                </div>
                                            )}
                                            {friends.map(friend => (
                                                <div key={friend.username} className="ls-friend-row">
                                                    <div className="ls-friend-info">
                                                        <div className="ls-friend-avatar">{friend.username[0].toUpperCase()}</div>
                                                        <div className="ls-friend-copy">
                                                            <p className="ls-friend-name">{friend.username}</p>
                                                            <p className="ls-friend-status" style={{ color: friend.online ? '#4ade80' : '#8896A7' }}>
                                                                <span className={`ls-status-dot${friend.online ? ' online' : ''}`} />
                                                                {friend.online ? 'Online' : 'Offline'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="ls-friend-actions">
                                                        {friend.online && (
                                                            partyMembers.some(m => m.username === friend.username)
                                                                ? <span className="ls-badge green">In Party</span>
                                                                : <button className="btn-icon" onClick={() => inviteFriendToParty(friend)}>+ Party</button>
                                                        )}
                                                        <button className="btn-icon danger" onClick={() => unfriendFriend(friend.username)}>✕</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Party tab */}
                                    {friendsTab === 'party' && (
                                        <div className="view-animate">
                                            <div className="ls-party-summary">
                                                <div>
                                                    <p className="ls-party-summary-label">Party Lobby</p>
                                                    <p className="ls-party-summary-copy">Lobby needs at least {partySlotCount} slots.</p>
                                                </div>
                                                {partyCreator && partyMembers.length > 1 && (
                                                    <button className="btn-icon danger" onClick={leaveParty}>Leave</button>
                                                )}
                                            </div>
                                            {partyMembers.length === 0 && (
                                                <div className="ls-empty-state">
                                                    <p className="ls-empty-state-title">No party yet</p>
                                                    <p className="ls-empty-state-copy">Invite an online friend from your friends list.</p>
                                                </div>
                                            )}
                                            <div className="ls-party-list">
                                                {partyMembers.map(member => (
                                                    <div key={member.username} className="ls-player-row">
                                                        <div className="ls-player-meta">
                                                            {partyCreator === member.username && <span className="ls-badge">Leader</span>}
                                                            <span className="ls-player-name">{member.username}</span>
                                                            {member.username === username && <span style={{ color: '#8896A7', fontSize: '12px' }}>(You)</span>}
                                                        </div>
                                                        {partyCreator === username && member.username !== username && (
                                                            <button className="btn-icon danger" onClick={() => kickPartyMember(member.username)}>Kick</button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="ls-menu-friends-col">
                            <div className="ls-card ls-friends-card">
                                {/* Header always visible; body toggles on mobile */}
                                <div
                                    className="ls-friends-panel-header"
                                >
                                    <div className="ls-friends-panel-copy">
                                        <p className="ls-friends-panel-title">Friends & Party</p>
                                        <p className="ls-friends-panel-sub">Register to invite friends, build a party, and track online status.</p>

                                        <div className="ls-friends-counts">
                                            <span className="ls-badge">{onlineFriendsCount} Online</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="ls-friends-dropdown-toggle"
                                        onClick={() => setMobileFriendsExpanded(open => !open)}
                                        aria-expanded={mobileFriendsExpanded}
                                        aria-label={mobileFriendsExpanded ? 'Collapse friends and party menu' : 'Expand friends and party menu'}
                                    >
                                        {mobileFriendsExpanded ? '▲' : '▼'}
                                        <FriendsDropdownIcon />
                                    </button>
                                </div>

                                <div className={`ls-friends-collapsible-body${mobileFriendsExpanded ? ' expanded' : ''}`}>
                                    <div className="ls-friends-locked" style={{ paddingTop: '8px' }}>
                                        <div className="ls-friends-locked-mark">!</div>
                                        <p className="ls-section-title" style={{ textAlign: 'center' }}>Register to Unlock</p>
                                        <p style={{ color: '#8896A7', fontSize: '13px', marginTop: '6px', lineHeight: 1.6 }}>
                                            Create an account to add friends, form a party, and play together.
                                        </p>
                                        <button className="btn-primary mt-4" onClick={() => router.push('/login')}>Register Now</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </PageShell>
        );
    }

    // ── Tutorial observe ──────────────────────────────────────
    if (!connected && gameMode === 'tutorial_observe') {
        return wrapScreen(<ScriptedMatch onExit={() => setGameMode('tutorial')} />);
    }

    // ── Tutorial ──────────────────────────────────────────────
    if (!connected && gameMode === 'tutorial') {
        return wrapScreen(
            <PageShell>
                <LogoHeader subtitle="Learn how to play" />
                <div className="ls-card view-animate">
                    <button className="btn-back" onClick={() => setGameMode(null)}>← Back</button>
                    <p className="ls-section-title">Tutorial</p>
                    <p className="ls-section-desc">Pick how you'd like to learn the game.</p>
                    <button className="btn-secondary" style={{ marginBottom: '10px' }} onClick={() => router.push('/rules')}>
                        📜 Read the Rules
                    </button>
                    <button className="btn-secondary" style={{ marginBottom: '10px' }} onClick={() => setGameMode('tutorial_observe')}>
                        👁 Observe a Game
                    </button>
                    <div className="ls-divider"><span className="line" /><span className="text">OR</span><span className="line" /></div>
                    <button
                        className="btn-gold"
                        onClick={() => {
                            if (!socket) { alert('Please wait — connecting to the server.'); return; }
                            startPlayAlongGame();
                        }}
                    >
                        🎮 Play Along with Hints
                    </button>
                </div>
            </PageShell>
        );
    }

    // ── Online Match Lobby ────────────────────────────────────
    if (!connected && gameMode === 'online') {
        const majority = Math.floor(onlineLobbyPlayers.length / 2) + 1;
        return wrapScreen(
            <PageShell>
                <LogoHeader subtitle="Matchmaking" />
                <div className="ls-card view-animate">
                    <button className="btn-back" onClick={() => {
                        if (inQueue && socket) socket.emit('leaveQueue');
                        setGameMode(null); setInQueue(false); setMyOnlineVote(false);
                    }}>← Back</button>
                    <div className="ls-section-header">
                        <p className="ls-section-title">Online Lobby</p>
                        <UserChip username={username} />
                    </div>
                    {!inQueue ? (
                        <button className="btn-gold" onClick={joinQueue}>Join Queue ♠</button>
                    ) : (
                        <>
                            <div className="ls-alert-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span className="ls-queue-dot" />
                                <span>Searching for players…</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <p style={{ margin: 0, fontSize: '12px', color: '#8896A7', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Players in Lobby</p>
                                <span className="ls-badge">{onlineLobbyPlayers.length} / 8</span>
                            </div>
                            <div className="ls-progress-wrap">
                                <div className="ls-progress-bar" style={{ width: `${(onlineLobbyPlayers.length / 8) * 100}%` }} />
                            </div>
                            {onlineLobbyPlayers.map((player, idx) => (
                                <div key={idx} className="ls-player-row">
                                    <span className="ls-player-name">{player}</span>
                                    {player === username && <span className="ls-badge">You</span>}
                                </div>
                            ))}
                            {onlineLobbyPlayers.length > 1 && (
                                <div style={{ marginTop: '16px', padding: '18px 20px', background: 'rgba(58,77,255,0.06)', borderRadius: '20px', border: '1px solid rgba(58,77,255,0.15)', backdropFilter: 'blur(8px)' }}>
                                    <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#F0F4FF', fontWeight: 600 }}>Start Early?</p>
                                    <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#8896A7' }}>
                                        {onlineLobbyVotes} vote{onlineLobbyVotes !== 1 ? 's' : ''} — need {majority} to start
                                    </p>
                                    {myOnlineVote ? (
                                        <button className="btn-danger" style={{ padding: '10px' }} onClick={() => { setMyOnlineVote(false); socket.emit('voteStartOnlineLobby', false); }}>
                                            Change to Wait
                                        </button>
                                    ) : (
                                        <button className="btn-green" style={{ padding: '10px' }} onClick={() => { setMyOnlineVote(true); socket.emit('voteStartOnlineLobby', true); }}>
                                            Vote to Start Now
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </PageShell>
        );
    }

    // ── AI Setup ──────────────────────────────────────────────
    if (!connected && gameMode === 'ai' && !gameState) {
        return wrapScreen(
            <PageShell>
                <LogoHeader subtitle="Configure your match" />
                <div className="ls-card view-animate">
                    <button className="btn-back" onClick={() => setGameMode(null)}>← Back</button>
                    <p className="ls-section-title">Play with AI</p>
                    <p className="ls-section-desc">Bot cards are visible for training. Bot explains its reasoning after each turn.</p>

                    <div className="ls-divider"><span className="line" /><span className="text">Bot Mix</span><span className="line" /></div>

                    <div className="ls-bot-row">
                        <div>
                            <p className="ls-bot-label">🟢 Easy Bots</p>
                            <p className="ls-bot-sub">Makes mistakes, simpler strategy</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button className="ls-stepper-btn" onClick={() => setEasyBotCount(Math.max(0, easyBotCount - 1))} disabled={easyBotCount <= 0 || (easyBotCount === 1 && hardBotCount === 0)}>−</button>
                            <span className="ls-stepper-val" style={{ fontSize: '22px' }}>{easyBotCount}</span>
                            <button className="ls-stepper-btn" onClick={() => setEasyBotCount(easyBotCount + 1)} disabled={easyBotCount + hardBotCount >= 7}>+</button>
                        </div>
                    </div>

                    <div className="ls-bot-row">
                        <div>
                            <p className="ls-bot-label">🔴 Hard Bots</p>
                            <p className="ls-bot-sub">Optimal play, full reasoning</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button className="ls-stepper-btn" onClick={() => setHardBotCount(Math.max(0, hardBotCount - 1))} disabled={hardBotCount <= 0 || (hardBotCount === 1 && easyBotCount === 0)}>−</button>
                            <span className="ls-stepper-val" style={{ fontSize: '22px' }}>{hardBotCount}</span>
                            <button className="ls-stepper-btn" onClick={() => setHardBotCount(hardBotCount + 1)} disabled={easyBotCount + hardBotCount >= 7}>+</button>
                        </div>
                    </div>

                    <button className="btn-gold mt-4" onClick={startAIGame} disabled={easyBotCount + hardBotCount === 0}>
                        🤖 Start vs Bots
                    </button>

                    <div className="ls-footer-links">
                        <span className="ls-link-text" onClick={() => setGameMode('tutorial')}>
                            New to the game? Try the tutorial →
                        </span>
                    </div>
                </div>
            </PageShell>
        );
    }

    // ── Pass and Play Setup ───────────────────────────────────
    if (!connected && gameMode === 'pass_and_play' && !gameState) {
        return wrapScreen(
            <PageShell>
                <LogoHeader subtitle="Local multiplayer" />
                <div className="ls-card view-animate">
                    <button className="btn-back" onClick={() => setGameMode(null)}>← Back</button>
                    <p className="ls-section-title">Pass and Play</p>
                    <p className="ls-section-desc">Share the device — each player takes turns on the same screen.</p>

                    <div className="ls-input-group">
                        <label>Number of Players</label>
                        <div style={{ marginTop: '8px' }}>
                            <Stepper value={lobbyTargetPlayers} onChange={setLobbyTargetPlayers} min={2} max={8} label={`player${lobbyTargetPlayers > 1 ? 's' : ''}`} />
                        </div>
                    </div>

                    <div className="ls-divider"><span className="line" /><span className="text">Ready?</span><span className="line" /></div>

                    <button
                        className="btn-gold"
                        onClick={() => {
                            const players = Array.from({ length: lobbyTargetPlayers }, (_, i) => `Player ${i + 1}`);
                            socket.emit('createPassAndPlay', players);
                        }}
                    >
                        🎮 Start Game
                    </button>
                </div>
            </PageShell>
        );
    }

    // ── Friends – URL invite ──────────────────────────────────
    if (!connected && gameMode === 'friends' && joinViaUrl) {
        return wrapScreen(
            <PageShell>
                <LogoHeader subtitle="You've been invited!" />
                <div className="ls-card view-animate">
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ fontSize: '44px', marginBottom: '12px', filter: 'drop-shadow(0 0 12px rgba(255,200,87,0.25))' }}>🎟️</div>
                        <p className="ls-section-title" style={{ textAlign: 'center', fontSize: '26px' }}>Lobby Invite</p>
                        <p style={{ color: '#8896A7', fontSize: '14px', margin: '8px 0 0', lineHeight: 1.6 }}>
                            You were invited to join a private lobby.
                        </p>
                    </div>
                    <UserChip username={username} />
                    <button className="btn-gold" style={{ marginBottom: '10px' }} onClick={() => { setJoinViaUrl(false); setLobbyAction('join'); }}>
                        🔗 Join Lobby
                    </button>
                    <button className="btn-secondary" onClick={() => { setGameMode(null); setJoinViaUrl(false); setLobbyId(''); }}>
                        ← Back to Menu
                    </button>
                </div>
            </PageShell>
        );
    }

    // ── Friends – Choose action ───────────────────────────────
    if (!connected && gameMode === 'friends' && !lobbyAction) {
        return wrapScreen(
            <PageShell>
                <LogoHeader subtitle="Private matches" />
                <div className="ls-card view-animate">
                    <button className="btn-back" onClick={() => setGameMode(null)}>← Back</button>
                    <p className="ls-section-title">Play with Friends</p>
                    <p className="ls-section-desc">Create a private lobby and share the link, or join an existing one.</p>
                    <UserChip username={username} />
                    <button className="btn-gold" style={{ marginBottom: '10px' }} onClick={() => setLobbyAction('create')}>
                        🏠 Create Lobby
                    </button>
                    <div className="ls-divider"><span className="line" /><span className="text">OR</span><span className="line" /></div>
                    <button className="btn-secondary" onClick={handleJoinLobbyAction}>
                        🔗 Join with Code
                    </button>
                </div>
            </PageShell>
        );
    }

    // ── Friends – Create Lobby ────────────────────────────────
    if (!connected && gameMode === 'friends' && lobbyAction === 'create') {
        return wrapScreen(
            <PageShell>
                <LogoHeader subtitle="Set up your game" />
                <div className="ls-card view-animate">
                    <button className="btn-back" onClick={() => setLobbyAction(null)}>← Back</button>
                    <p className="ls-section-title">Create Lobby</p>
                    <p className="ls-section-desc">Choose how many slots to open, then share the link with your friends.</p>
                    <UserChip username={username} />

                    <div className="ls-input-group">
                        <label>Player Slots</label>
                        <div style={{ marginTop: '8px' }}>
                            <Stepper
                                value={lobbyTargetPlayers}
                                onChange={setLobbyTargetPlayers}
                                min={Math.max(2, partyMembers.length)}
                                max={8}
                                label={`slot${lobbyTargetPlayers !== 1 ? 's' : ''}`}
                            />
                        </div>
                    </div>

                    {partyMembers.length > 0 && (
                        <div className="ls-alert-info">
                            <strong>Party invite:</strong> {partyMembers.map(f => f.username).join(', ')} will be auto-invited.
                        </div>
                    )}

                    <button className="btn-gold mt-3" onClick={createLobby}>
                        🏠 Create Lobby
                    </button>
                </div>
            </PageShell>
        );
    }

    // ── Friends – Join Lobby ──────────────────────────────────
    if (!connected && gameMode === 'friends' && lobbyAction === 'join') {
        return wrapScreen(
            <PageShell>
                <LogoHeader subtitle="Enter lobby code" />
                <div className="ls-card view-animate">
                    <button className="btn-back" onClick={() => setLobbyAction(null)}>← Back</button>
                    <p className="ls-section-title">Join Lobby</p>
                    <p className="ls-section-desc">Paste the lobby code your friend shared with you.</p>
                    <UserChip username={username} />
                    <div className="ls-input-group">
                        <label>Lobby Code</label>
                        <input
                            placeholder="Paste lobby code here…"
                            value={lobbyId}
                            onChange={e => setLobbyId(e.target.value)}
                        />
                    </div>
                    <button className="btn-gold mt-3" onClick={joinLobby} disabled={!lobbyId}>
                        🔗 Join Lobby
                    </button>
                </div>
            </PageShell>
        );
    }

    // ── Connected – Waiting Lobby ─────────────────────────────
    if (connected && inLobby && !gameState) {
        const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}?room=${lobbyId}`;
        const progress = Math.round((lobbyCurrentPlayers / lobbyTargetPlayers) * 100);
        const vacancies = Math.max(0, lobbyTargetPlayers - lobbyCurrentPlayers);
        return wrapScreen(
            <PageShell>
                <LogoHeader subtitle="Waiting for players" />
                <div className="ls-card view-animate">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <p className="ls-section-title">Lobby</p>
                        {isLobbyCreator && <span className="ls-badge">Host</span>}
                    </div>
                    <p style={{ margin: '0 0 2px', fontSize: '13px', color: '#8896A7' }}>
                        {lobbyCurrentPlayers} of {lobbyTargetPlayers} players joined
                    </p>
                    <div className="ls-progress-wrap"><div className="ls-progress-bar" style={{ width: `${progress}%` }} /></div>

                    {lobbyPlayers.map((playerName, index) => (
                        <div key={`${playerName}-${index}`} className="ls-player-row">
                            <div className="ls-player-meta">
                                {index === 0 && <span className="ls-badge">Host</span>}
                                <span className="ls-player-name">{playerName}</span>
                            </div>
                            {playerName === username && <span style={{ color: '#8896A7', fontSize: '12px' }}>You</span>}
                        </div>
                    ))}

                    {!lobbyReadyToStart && (
                        <p style={{ color: '#8896A7', fontSize: '13px', textAlign: 'center', padding: '12px 0 4px' }}>
                            {vacancies > 0
                                ? <><span className="ls-queue-dot" style={{ marginRight: '6px' }} />Waiting for {vacancies} more player{vacancies !== 1 ? 's' : ''}…</>
                                : 'All players joined!'}
                        </p>
                    )}

                    {/* Fill with bots (creator only, partial lobby) */}
                    {isLobbyCreator && lobbyCurrentPlayers >= 2 && !lobbyReadyToStart && (
                        <div style={{ marginTop: '16px' }}>
                            <div className="ls-checkbox-row" onClick={() => {
                                const enabled = !fillLobbyWithBots;
                                setFillLobbyWithBots(enabled);
                                if (enabled) { setFriendsEasyBotCount(0); setFriendsHardBotCount(vacancies); }
                                else { setFriendsEasyBotCount(0); setFriendsHardBotCount(0); }
                            }}>
                                <div className={`ls-checkbox${fillLobbyWithBots ? ' checked' : ''}`}>
                                    {fillLobbyWithBots && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
                                </div>
                                <div>
                                    <p className="ls-checkbox-text">Fill remaining slots with bots</p>
                                    <p className="ls-checkbox-sub">{vacancies} slot{vacancies !== 1 ? 's' : ''} vacant</p>
                                </div>
                            </div>

                            {fillLobbyWithBots && (
                                <div style={{ marginBottom: '12px' }}>
                                    <div className="ls-bot-row" style={{ marginBottom: '8px' }}>
                                        <div><p className="ls-bot-label">🟢 Easy</p></div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <button className="ls-stepper-btn" style={{ width: '28px', height: '28px', fontSize: '14px' }} onClick={() => { const e = Math.max(0, friendsEasyBotCount - 1); setFriendsEasyBotCount(e); setFriendsHardBotCount(vacancies - e); }}>−</button>
                                            <span className="ls-stepper-val" style={{ fontSize: '18px' }}>{friendsEasyBotCount}</span>
                                            <button className="ls-stepper-btn" style={{ width: '28px', height: '28px', fontSize: '14px' }} onClick={() => { const e = Math.min(vacancies, friendsEasyBotCount + 1); setFriendsEasyBotCount(e); setFriendsHardBotCount(vacancies - e); }}>+</button>
                                        </div>
                                    </div>
                                    <div className="ls-bot-row">
                                        <div><p className="ls-bot-label">🔴 Hard</p></div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <button className="ls-stepper-btn" style={{ width: '28px', height: '28px', fontSize: '14px' }} onClick={() => { const h = Math.max(0, friendsHardBotCount - 1); setFriendsHardBotCount(h); setFriendsEasyBotCount(vacancies - h); }}>−</button>
                                            <span className="ls-stepper-val" style={{ fontSize: '18px' }}>{friendsHardBotCount}</span>
                                            <button className="ls-stepper-btn" style={{ width: '28px', height: '28px', fontSize: '14px' }} onClick={() => { const h = Math.min(vacancies, friendsHardBotCount + 1); setFriendsHardBotCount(h); setFriendsEasyBotCount(vacancies - h); }}>+</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button className="btn-green" onClick={() => startLobbyGame(!fillLobbyWithBots)}>
                                {fillLobbyWithBots
                                    ? `▶ Start with ${lobbyCurrentPlayers}P + ${vacancies} Bot${vacancies !== 1 ? 's' : ''}`
                                    : `▶ Start with ${lobbyCurrentPlayers} Players`}
                            </button>
                        </div>
                    )}

                    {lobbyReadyToStart && isLobbyCreator && (
                        <button className="btn-gold mt-3" onClick={() => startLobbyGame(false)}>▶ Start Match</button>
                    )}
                    {lobbyReadyToStart && !isLobbyCreator && (
                        <div className="ls-alert-info mt-3">All players joined! Waiting for the host to start.</div>
                    )}
                </div>

                {/* Share section */}
                {isLobbyCreator && (
                    <div className="ls-card">
                        <p className="ls-section-title">Invite Friends</p>
                        <p className="ls-section-desc">Share the link or lobby code.</p>
                        <div className="ls-copy-row">
                            <input className="ls-copy-input" value={shareUrl} readOnly />
                            <button className="btn-icon success" onClick={() => copyToClipboard(shareUrl)}>Copy Link</button>
                        </div>
                        <div className="ls-copy-row">
                            <input className="ls-copy-input" value={lobbyId} readOnly />
                            <button className="btn-icon" onClick={() => copyToClipboard(lobbyId)}>Copy Code</button>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '14px' }}>
                    <button className="btn-danger" onClick={isLobbyCreator ? cancelLobby : leaveLobby}>
                        {isLobbyCreator ? '✕ Cancel Lobby' : '← Leave Lobby'}
                    </button>
                </div>
            </PageShell>
        );
    }

    // ── Connecting spinner ────────────────────────────────────
    if (connected && !gameState) {
        return wrapScreen(
            <PageShell>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                    <div className="ls-spinner" />
                    <p style={{ color: '#8896A7', fontSize: '14px' }}>Starting game…</p>
                </div>
            </PageShell>
        );
    }

    // ── Game Over / Leaderboard ───────────────────────────────
    const myPlayer = gameState && gameState.players[myPlayerIndex];
    const isMyTurn = gameState && gameState.currentPlayer === myPlayerIndex;
    const amEliminated = gameMode !== 'pass_and_play' && myPlayerIndex !== null && gameState && gameState.players[myPlayerIndex] && gameState.players[myPlayerIndex].eliminated;

    if (gameState && (gameState.gameOver || amEliminated)) {
        const winnerIndex = gameState.winner;
        const rankedPlayers = [...gameState.players].sort((a, b) => {
            const aIdx = gameState.players.indexOf(a);
            const bIdx = gameState.players.indexOf(b);
            if (gameState.gameOver) { if (aIdx === winnerIndex) return -1; if (bIdx === winnerIndex) return 1; }
            const aElim = !!a.eliminated; const bElim = !!b.eliminated;
            if (aElim !== bElim) return aElim ? 1 : -1;
            const aOrder = typeof a.eliminatedOrder === 'number' ? a.eliminatedOrder : 0;
            const bOrder = typeof b.eliminatedOrder === 'number' ? b.eliminatedOrder : 0;
            if (aElim && bElim && aOrder !== bOrder) return bOrder - aOrder;
            return a.score - b.score;
        });

        const rankClass = (index, total) => {
            if (index === 0) return 'gold';
            if (total > 3 && index === 1) return 'silver';
            if (total > 3 && index === 2) return 'bronze';
            return 'default';
        };
        const medal = (index, total) => {
            if (index === 0) return '🥇';
            if (total > 3 && index === 1) return '🥈';
            if (total > 3 && index === 2) return '🥉';
            return '';
        };

        return wrapScreen(
            <PageShell>
                <Head><title>LeastScore — Game Over</title></Head>
                <LogoHeader />
                <div className="ls-card view-animate" style={{ marginBottom: '16px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ fontSize: '44px', marginBottom: '10px', filter: 'drop-shadow(0 0 20px rgba(255,200,87,0.4))' }}>🏆</div>
                        <p style={{ margin: 0, fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#F0F4FF', letterSpacing: '2px' }}>Game Over</p>
                        <p style={{ margin: '6px 0 0', color: '#8896A7', fontSize: '14px' }}>Final Leaderboard</p>
                    </div>

                    {rankedPlayers.map((player, index) => {
                        const total = rankedPlayers.length;
                        const cls = rankClass(index, total);
                        const isEliminated = player.eliminated;
                        const eliminatedReason = player.eliminatedReason;
                        const didExit = eliminatedReason === 'exit';
                        const disconnectedEliminated = isEliminated && ['disconnect-eliminated', 'poll-eliminate', 'disconnect-claimed', 'guest-expire'].includes(eliminatedReason);
                        return (
                            <div key={index} className={`ls-rank-row ${cls}`}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '22px', minWidth: '28px' }}>{medal(index, total)}</span>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#F0F4FF' }}>{player.username}</p>
                                        <div style={{ display: 'flex', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
                                            {isEliminated && <span className="ls-badge red">Eliminated</span>}
                                            {disconnectedEliminated && <span className="ls-badge blue">Disconnected</span>}
                                            {didExit && <span className="ls-badge red">Exited</span>}
                                        </div>
                                    </div>
                                </div>
                                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: cls === 'gold' ? '#FFC857' : '#F0F4FF', letterSpacing: '1px' }}>
                                    {player.score}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Round History */}
                {gameState.roundHistory && gameState.roundHistory.length > 0 && (
                    <div className="ls-card view-animate" style={{ marginBottom: '16px', overflowX: 'auto' }}>
                        <p className="ls-section-title" style={{ marginBottom: '12px' }}>Round History</p>
                        <table className="ls-round-table">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Round</th>
                                    {gameState.players.map((p, i) => <th key={i}>{p.username}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {gameState.roundHistory.map((round, rIdx) => (
                                    <tr key={rIdx}>
                                        <td style={{ textAlign: 'left', color: '#8896A7' }}>#{rIdx + 1}</td>
                                        {round.scores.map((score, pIdx) => {
                                            if (score === null) return <td key={pIdx} />;
                                            const isDeclarer = round.declarerId === pIdx;
                                            return (
                                                <td key={pIdx}>
                                                    <span className={`ls-score-chip ${score === 0 ? 'zero' : 'pos'}`}>
                                                        {score}
                                                        {isDeclarer && <span title={round.won ? 'Won' : 'Lost'}>{round.won ? ' ✓' : ' ✗'}</span>}
                                                    </span>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                    <td style={{ textAlign: 'left', fontWeight: 700, color: '#F0F4FF' }}>Final</td>
                                    {gameState.players.map((p, i) => (
                                        <td key={i} style={{ fontWeight: 700, color: '#FFC857' }}>{p.score}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                        <p style={{ marginTop: '10px', fontSize: '12px', color: '#8896A7', textAlign: 'center' }}>
                            <span style={{ color: '#4ade80' }}>✓</span> Won Declare · <span style={{ color: '#FC8181' }}>✗</span> Lost Declare
                        </p>
                    </div>
                )}

                <button className="btn-primary" onClick={goBackHome}>← Back to Home</button>
            </PageShell>
        );
    }

    // ── In-Game UI ────────────────────────────────────────────
    if (!gameState) return wrapScreen(null);

    const isPlayAlong = gameMode === 'play_along' || gameState.isPlayAlong;
    const isAIMode = gameMode === 'ai' || gameState.isAIGame;

    return (
        <>
            {globalSocialOverlay}
            <Head><title>LeastScore — In Game</title></Head>
            <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
            <div className="ls-container">
                <div className="ls-frame" style={{ color: '#F0F4FF' }}>
                    <div className="ls-bg-mesh" />
                    <div className="ls-noise" />

                    {/* Top bar */}
                    <div className="ls-topbar" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
                        <div className="ls-topbar-badges">
                            <span className="ls-topbar-brand">LEASTSCORE</span>
                            {isPlayAlong && <span className="ls-badge">Play Along</span>}
                            {isAIMode && <span className="ls-badge blue">vs AI</span>}
                            {gameMode === 'pass_and_play' && <span className="ls-badge">Pass & Play</span>}
                        </div>
                        <button className="ls-topbar-exit" onClick={exitGame}>Exit</button>
                    </div>

                    {isPlayAlong && <PlayAlongDeclarationBanner />}

                    {/* Scoreboard moved below action buttons */}

                    {/* Game area */}
                    <div className="ls-game-area" style={{ position: 'relative', zIndex: 1 }}>

                        {/* Draw from zone */}
                        <div className="ls-zone ls-draw-zone">
                            <p className="ls-zone-label">
                                <span>Draw From</span>
                                {drawFrom === 'visible' && gameState.visibleCard.length > 1 && visibleIndex == null && (
                                    <span style={{ fontSize: '11px', color: '#FC8181', fontWeight: 600, textTransform: 'none', letterSpacing: 0 }}>Select one visible card</span>
                                )}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {gameState.visibleCard.map((card, i) => renderCard(
                                        `visible-${card.rank}${card.suit}-${i}`,
                                        card,
                                        () => { setDrawFrom('visible'); setVisibleIndex(i); },
                                        drawFrom === 'visible' && visibleIndex === i ? 'draw' : false,
                                        false,
                                        isPlayAlong && playAlongHint && isHintVisibleDraw(i, playAlongHint) ? { drawnGlow: true } : null
                                    ))}
                                </div>
                                <button
                                    onClick={() => { setDrawFrom('deck'); setVisibleIndex(null); }}
                                    className={`ls-deck-btn${drawFrom === 'deck' ? ' selected-draw' : ''}${isPlayAlong && playAlongHint && isHintDeckDraw(playAlongHint) ? ' hint-glow' : ''}`}
                                >
                                    <span style={{ fontSize: 'calc(var(--card-w) * 0.5)', color: '#111' }}>🂠</span>
                                    <span style={{ fontSize: 'calc(var(--card-w) * 0.25)', fontWeight: 700, color: '#111' }}>Deck</span>
                                    <span style={{ fontSize: 'calc(var(--card-w) * 0.18)', color: '#475569', background: '#f1f5f9', borderRadius: '4px', padding: '1px 4px' }}>
                                        {Array.isArray(gameState.deck) ? gameState.deck.length : (gameState.deckCount || 0)}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Your hand zone */}
                        <div className={`ls-zone${isMyTurn ? ' active' : ''}`}>
                            <p className="ls-zone-label">
                                <span>
                                    {passScreen ? `Pass to ${myPlayer.username}` : `Your Hand (${myPlayer.hand.length} cards)`}
                                </span>
                                {isPlayAlong && !passScreen && (
                                    <span className="ls-badge">Sum: {getHandSum(myPlayer.hand)}</span>
                                )}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', minHeight: 'calc(var(--card-h) * 1.15)', marginTop: '4px', overflow: 'visible', alignItems: 'flex-end', paddingBottom: '12px', transform: 'translateY(-8px)' }}>
                                {passScreen
                                    ? Array.from({ length: myPlayer.hand.length }).map((_, i) => {
                                        const total = myPlayer.hand.length;
                                        const mid = (total - 1) / 2;
                                        const offset = i - mid;
                                        const angle = offset * 5;
                                        const yOffset = Math.abs(offset) * 4;
                                        return (
                                            <div key={`blank-${i}`} className="ls-blank-card" style={{
                                                transform: `rotate(${angle}deg) translateY(${yOffset}px)`,
                                                marginLeft: i === 0 ? '0' : 'var(--card-overlap)',
                                                zIndex: i,
                                                position: 'relative',
                                                marginRight: '0',
                                                marginTop: '0',
                                                marginBottom: '0'
                                            }} />
                                        );
                                    })
                                    : myPlayer.hand.map((card, i) => {
                                        const total = myPlayer.hand.length;
                                        const mid = (total - 1) / 2;
                                        const offset = i - mid;
                                        const angle = offset * 5;
                                        const yOffset = Math.abs(offset) * 4;
                                        return (
                                            <div key={`hand-wrap-${i}`} style={{
                                                transform: `rotate(${angle}deg) translateY(${yOffset}px)`,
                                                marginLeft: i === 0 ? '0' : 'var(--card-overlap)',
                                                zIndex: i,
                                                position: 'relative',
                                                transition: 'transform 0.2s'
                                            }}>
                                                {renderCard(
                                                    `hand-${card.rank}${card.suit}-${i}`, card,
                                                    () => toggleCardSelection(card),
                                                    isSelectedCard(card) ? 'discard' : false,
                                                    !isMyTurn && myPlayer.lastDrawnCard && myPlayer.lastDrawnCard.rank === card.rank && myPlayer.lastDrawnCard.suit === card.suit,
                                                    isPlayAlong && playAlongHint && isHintDiscardCard(card, playAlongHint) ? { discardGlow: true } : null
                                                )}
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>

                        {/* Action buttons */}
                        {turnFinishedScreen ? (
                            <button className="btn-gold" onClick={() => {
                                new Audio('/sound/turn sound.mp3').play().catch(() => { });
                                try { const AudioContext = window.AudioContext || window.webkitAudioContext; if (AudioContext) { const ctx = new AudioContext(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.frequency.value = 440; osc.type = 'triangle'; gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15); osc.start(); osc.stop(ctx.currentTime + 0.15); } } catch (e) { }
                                setTurnFinishedScreen(false); setPassScreen(true); setMyPlayerIndex(gameState.currentPlayer);
                            }}>
                                🔄 Pass Device
                            </button>
                        ) : passScreen ? (
                            <button className="btn-primary" onClick={() => {
                                new Audio('/sound/turn sound.mp3').play().catch(() => { });
                                try { const AudioContext = window.AudioContext || window.webkitAudioContext; if (AudioContext) { const ctx = new AudioContext(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.frequency.value = 880; osc.type = 'sine'; gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1); osc.start(); osc.stop(ctx.currentTime + 0.1); } } catch (e) { }
                                setPassScreen(false);
                            }}>
                                🃏 Show My Cards
                            </button>
                        ) : (
                            <div className="ls-action-row">
                                <button
                                    className={`ls-action-btn make-turn${isMyTurn ? ' turn-shine' : ''}`}
                                    onClick={makeTurn}
                                    disabled={!isMyTurn}
                                >
                                    ▶ Make Turn
                                </button>
                                <button
                                    className={`ls-action-btn declare${isMyTurn ? ' turn-shine' : ''}`}
                                    onClick={() => { if (isPlayAlong) confirmPlayAlongDeclare(myPlayer.hand, declare); else declare(); }}
                                    disabled={!isMyTurn}
                                >
                                    ♛ Declare
                                </button>
                                {isPlayAlong && (
                                    <button
                                        className="ls-action-btn hint-btn"
                                        onClick={requestPlayAlongHint}
                                        disabled={!isMyTurn}
                                    >
                                        💡 Hint
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Disconnect panels */}
                        {Object.keys(disconnectDecisions).length > 0 && Object.values(disconnectDecisions).map(dd => {
                            const dpi = dd.disconnectedPlayerIndex;
                            const isGuestDisconnect = dd.isGuestDisconnect === true;
                            const countdown = pollCountdowns[dpi];
                            const poll = eliminationPolls[dpi];
                            const playerName = gameState?.players[dpi]?.username || ('Player ' + (dpi + 1));
                            return (
                                <div key={dpi} className="ls-disconnect-panel" style={{ marginTop: '16px' }}>
                                    <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#FFC857', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span>⚠</span> {playerName} disconnected
                                    </p>
                                    {countdown != null ? (
                                        <>
                                            <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#8896A7' }}>
                                                {isGuestDisconnect ? `Guest session expires in ${countdown}s` : `Poll opens in ${countdown}s`}
                                            </p>
                                            {!isGuestDisconnect && <p style={{ margin: 0, fontSize: '12px', color: '#8896A7' }}>All remaining players will vote to eliminate or wait.</p>}
                                        </>
                                    ) : poll ? (
                                        <>
                                            <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#8896A7' }}>
                                                Eliminate: <strong style={{ color: '#FC8181' }}>{poll.counts.eliminate}</strong> · Wait: <strong style={{ color: '#4ade80' }}>{poll.counts.wait}</strong>
                                            </p>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="btn-green" style={{ flex: 1, padding: '10px', fontSize: '13px' }} onClick={() => castEliminationVote(dpi, 'wait')} disabled={poll.myVote === 'wait'}>
                                                    {poll.myVote === 'wait' ? '✓ Voted Wait' : 'Wait'}
                                                </button>
                                                <button className="btn-danger" style={{ flex: 1, padding: '10px', fontSize: '13px' }} onClick={() => castEliminationVote(dpi, 'eliminate')} disabled={poll.myVote === 'eliminate'}>
                                                    {poll.myVote === 'eliminate' ? '✓ Voted Eliminate' : 'Eliminate'}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <p style={{ margin: 0, fontSize: '13px', color: '#8896A7' }}>Waiting for poll…</p>
                                    )}
                                </div>
                            );
                        })}

                        {/* Scoreboard (Table Layout) */}
                        <div className="ls-scoreboard-wrap" style={{ position: 'relative', zIndex: 1, marginTop: '16px', padding: '20px 0 0', overflowX: 'hidden' }}>
                            <div className="ls-scoreboard-inner" style={{ flexDirection: 'column', minWidth: '100%', paddingBottom: 0 }}>
                                {gameState.players.map((_, i) => {
                                    const idx = (myPlayerIndex != null && myPlayerIndex !== -1) ? (myPlayerIndex + i) % gameState.players.length : i;
                                    const player = gameState.players[idx];
                                    const isCurrentTurn = gameState.currentPlayer === idx;
                                    const isMe = idx === myPlayerIndex;
                                    const isEliminated = !!player.eliminated;
                                    let cardCls = 'ls-player-card';
                                    if (isCurrentTurn) cardCls += player.isThinking ? ' active-thinking' : ' active-turn';
                                    else if (isMe) cardCls += ' is-me';
                                    if (isEliminated) cardCls += ' eliminated';

                                    return (
                                        <div key={`scoreboard-${idx}`} className={cardCls} style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', marginBottom: 0, width: '100%', padding: '12px' }}>

                                            {/* Column 1: Name and Turn Badge */}
                                            <div style={{ width: '30%', minWidth: '90px', borderRight: '1px solid rgba(255,255,255,0.07)', paddingRight: '12px', marginRight: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
                                                {isCurrentTurn && (
                                                    <div className={`ls-player-card-turn-badge ${player.isThinking ? 'thinking' : 'normal'}`} style={{ top: '-18px' }}>
                                                        {player.isThinking ? '🤖 Thinking…' : 'Active Turn'}
                                                    </div>
                                                )}
                                                <p className="ls-player-card-name" style={{ color: isMe ? '#FFC857' : '#F0F4FF', margin: 0, fontSize: '13px' }}>
                                                    {isMe && '👤 '}
                                                    {player.username}
                                                    {isEliminated && <span style={{ fontSize: '10px', color: '#FC8181', display: 'block', marginTop: '2px' }}>(Out)</span>}
                                                </p>
                                            </div>

                                            {/* Column 2: Stats and Scores */}
                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>

                                                {/* Row 1: Draw and Discard */}
                                                <div className="ls-player-card-footer" style={{ borderTop: 'none', margin: 0, padding: 0, display: 'flex', gap: '8px' }}>
                                                    <div className="ls-player-card-stat" style={{ flex: 1, minWidth: 0 }}>
                                                        <p className="ls-player-card-stat-label">Draw</p>
                                                        {player.lastDrawnCard ? (
                                                            (player.lastDrawnCard.hidden || (idx !== myPlayerIndex && player.lastDrawnFrom === 'deck')) ? (
                                                                <span style={{ fontSize: '10px', color: '#8896A7', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', padding: '2px 5px', whiteSpace: 'nowrap' }}>🂠</span>
                                                            ) : (
                                                                <span style={{ fontSize: '10px', fontWeight: 700, color: (player.lastDrawnCard.suit === 'hearts' || player.lastDrawnCard.suit === 'diamonds') ? '#FC8181' : '#F0F4FF', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', padding: '2px 5px', whiteSpace: 'nowrap' }}>
                                                                    {player.lastDrawnCard.rank}{suitSymbols[player.lastDrawnCard.suit]}
                                                                </span>
                                                            )
                                                        ) : <span style={{ fontSize: '10px', color: '#4A5568' }}>—</span>}
                                                    </div>
                                                    <div className="ls-player-card-stat" style={{ flex: 2, minWidth: 0 }}>
                                                        <p className="ls-player-card-stat-label">Discard</p>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                            {player.lastDiscard && player.lastDiscard.length > 0
                                                                ? player.lastDiscard.map((card, i) => (
                                                                    <span key={i} style={{ fontSize: '10px', fontWeight: 700, color: (card.suit === 'hearts' || card.suit === 'diamonds') ? '#FC8181' : '#F0F4FF', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', padding: '2px 5px', whiteSpace: 'nowrap' }}>
                                                                        {card.rank}{suitSymbols[card.suit]}
                                                                    </span>
                                                                ))
                                                                : <span style={{ fontSize: '10px', color: '#4A5568' }}>—</span>}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Row 2: Scores */}
                                                <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '6px' }}>
                                                    {/* Column 2.1: Total Score */}
                                                    <div style={{ paddingRight: '12px', borderRight: '1px solid rgba(255,255,255,0.07)', marginRight: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        <p style={{ fontSize: '10px', color: '#8896A7', margin: '0 0 2px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</p>
                                                        <p style={{ color: isCurrentTurn ? '#FFC857' : '#F0F4FF', margin: 0, fontWeight: 'bold', fontSize: '16px' }}>
                                                            {player.score}
                                                        </p>
                                                    </div>
                                                    {/* Column 2.2: Roundwise Score */}
                                                    {gameState.roundHistory && gameState.roundHistory.length > 0 && (
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <p style={{ fontSize: '10px', color: '#8896A7', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Roundwise</p>
                                                            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
                                                                {gameState.roundHistory.map((round, rIdx) => {
                                                                    const score = round.scores[idx];
                                                                    if (score === null) return null;
                                                                    const isDeclarer = round.declarerId === idx;
                                                                    return (
                                                                        <span key={rIdx} className={`ls-score-chip ${score === 0 ? 'zero' : 'pos'}`} style={{ fontSize: '10px', padding: '2px 5px', whiteSpace: 'nowrap' }}>
                                                                            {score}{isDeclarer ? (round.won ? ' ✓' : ' ✗') : ''}
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>


                        {/* Play Along Hint Panel */}
                        {isPlayAlong && playAlongHint && (
                            <PlayAlongHintReasoningPanel reasoning={playAlongHint.reasoning} onDismiss={() => setPlayAlongHint(null)} />
                        )}

                        {/* Bot Info Section (Collapsible) */}
                        {(isAIMode || isPlayAlong) && (
                            <div style={{ marginTop: '16px' }}>
                                <button
                                    className="btn-secondary"
                                    style={{ width: '100%', marginBottom: '12px' }}
                                    onClick={() => setBotInfoExpanded(!botInfoExpanded)}
                                >
                                    {botInfoExpanded ? '▲ Hide Bot Info' : '▼ Show Bot Info'}
                                </button>

                                {botInfoExpanded && (
                                    <>
                                        {/* Bot hands */}
                                        {gameState.players.map((botPlayer, actualIndex) => {
                                            if (actualIndex === myPlayerIndex) return null;
                                            if (!botPlayer || !botPlayer.hand || botPlayer.hand.length === 0 || botPlayer.eliminated) return null;
                                            return (
                                                <div key={`bot-hand-${actualIndex}`} className="ls-zone" style={{ borderColor: 'rgba(232,30,99,0.12)', background: 'rgba(232,30,99,0.04)' }}>
                                                    <p className="ls-zone-label">
                                                        <span>{botPlayer.username}'s Hand ({botPlayer.hand.length})</span>
                                                        <span className="ls-badge red">Sum: {getHandSum(botPlayer.hand)}</span>
                                                    </p>
                                                    <div style={{ display: 'flex', justifyContent: 'center', minHeight: 'calc(var(--card-h) * 1.1)', marginTop: '4px', overflow: 'hidden', alignItems: 'center' }}>
                                                        {botPlayer.hand.map((card, i) => {
                                                            const total = botPlayer.hand.length;
                                                            const mid = (total - 1) / 2;
                                                            const offset = i - mid;
                                                            const angle = offset * 5;
                                                            const yOffset = Math.abs(offset) * 4;
                                                            return (
                                                                <div key={`bot-hand-${actualIndex}-${card.rank}${card.suit}-${i}`} style={{
                                                                    transform: `rotate(${angle}deg) translateY(${yOffset}px)`,
                                                                    marginLeft: i === 0 ? '0' : 'var(--card-overlap)',
                                                                    zIndex: i,
                                                                    position: 'relative',
                                                                    transition: 'transform 0.2s'
                                                                }}>
                                                                    {renderCard(`bot-hand-card-${actualIndex}-${card.rank}${card.suit}-${i}`, card, () => { }, false, false)}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Bot Reasoning Panel */}
                                        {isAIMode && botReasoning && (botReasoning.observation?.length > 0 || botReasoning.decision?.length > 0) && (
                                            <div className="ls-reasoning-panel">
                                                <div className="ls-reasoning-obs">
                                                    <p className="ls-reasoning-label" style={{ color: '#7B8FFF' }}>
                                                        <span>👁</span> What {gameState.players[botReasoning.botIndex ?? 1]?.username || 'Bot'} Understood
                                                    </p>
                                                    {botReasoning.observation && botReasoning.observation.length > 0
                                                        ? botReasoning.observation.map((line, i) => <p key={i} className="ls-reasoning-line">{line}</p>)
                                                        : <p className="ls-reasoning-line">Studying your plays…</p>
                                                    }
                                                </div>
                                                {botReasoning.decision?.length > 0 && (
                                                    <div className="ls-reasoning-dec">
                                                        <p className="ls-reasoning-label" style={{ color: '#FFC857' }}>
                                                            <span>🧠</span> Why {gameState.players[botReasoning.botIndex ?? 1]?.username || 'Bot'} Played This
                                                        </p>
                                                        {botReasoning.decision.map((line, i) => (
                                                            <p key={i} className="ls-reasoning-line" style={{ color: '#F0F4FF' }}>{line}</p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Round Summary Overlay */}
                    {roundSummary && (
                        <div className="ls-overlay">
                            <div style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
                                {/* Header card */}
                                <div style={{ background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '28px', padding: '28px 24px', marginBottom: '16px', backdropFilter: 'blur(24px)', boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 48px rgba(0,0,0,0.5)', animation: 'cardEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
                                    <p style={{ margin: '0 0 6px', fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#FFC857', letterSpacing: '2px' }}>Round Summary</p>
                                    <p style={{ color: '#8896A7', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
                                        <strong style={{ color: '#F0F4FF' }}>{roundSummary.players[roundSummary.declarerId].username}</strong> declared and{' '}
                                        <strong style={{ color: roundSummary.declaredWon ? '#4ade80' : '#FC8181' }}>
                                            {roundSummary.declaredWon ? 'WON' : 'LOST'}
                                        </strong>!
                                    </p>
                                </div>

                                {/* Player cards grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                                    {roundSummary.players.map((p, idx) => (
                                        <div key={idx} style={{
                                            background: idx === roundSummary.declarerId ? 'rgba(255,200,87,0.06)' : 'rgba(255,255,255,0.028)',
                                            border: idx === roundSummary.declarerId ? '1px solid rgba(255,200,87,0.3)' : '1px solid rgba(255,255,255,0.07)',
                                            borderRadius: '20px', padding: '16px 14px',
                                            backdropFilter: 'blur(12px)',
                                            animation: `cardEntrance 0.5s ${idx * 0.08}s cubic-bezier(0.16, 1, 0.3, 1) both`,
                                        }}>
                                            <p style={{ margin: '0 0 12px', fontWeight: 600, color: idx === roundSummary.declarerId ? '#FFC857' : '#F0F4FF', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {idx === roundSummary.declarerId && <span className="ls-badge">Declarer</span>}
                                                {idx !== roundSummary.declarerId && <span style={{ opacity: 0 }} className="ls-badge">_</span>}
                                                {p.username}
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'center', minHeight: 'calc(var(--card-h) * 1.1)', marginTop: '4px', overflow: 'hidden', alignItems: 'center', marginBottom: '10px' }}>
                                                {p.hand.map((card, i) => {
                                                    const total = p.hand.length;
                                                    const mid = (total - 1) / 2;
                                                    const offset = i - mid;
                                                    const angle = offset * 5;
                                                    const yOffset = Math.abs(offset) * 4;
                                                    return (
                                                        <div key={`sum-card-wrap-${idx}-${i}`} style={{
                                                            transform: `rotate(${angle}deg) translateY(${yOffset}px)`,
                                                            marginLeft: i === 0 ? '0' : 'var(--card-overlap)',
                                                            zIndex: i,
                                                            position: 'relative'
                                                        }}>
                                                            {renderCard(`sum-card-${idx}-${i}`, card, () => { }, false, false)}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <p style={{ margin: '12px 0 0', fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: '#FFC857', letterSpacing: '1px' }}>
                                                {p.sum === Infinity ? <span className="ls-badge red">Eliminated</span> : p.sum}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '18px 20px', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                                    <p style={{ color: '#8896A7', fontSize: '14px', margin: 0 }}>
                                        Next round in <strong style={{ color: '#F0F4FF', fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px' }}>{summaryCountdown}s</strong>
                                    </p>
                                    <button className="btn-gold" style={{ maxWidth: '220px' }} onClick={skipSummary}>
                                        Skip & Play Next Round
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
