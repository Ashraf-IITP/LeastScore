const fs = require('fs');
const content = fs.readFileSync('pages/index.js', 'utf8');

const cssStr = content.substring(content.indexOf('const GLOBAL_CSS'), content.indexOf('// ── Suit Particles'));
const partStr = content.substring(content.indexOf('const PARTICLES'), content.indexOf('// ── Page Shell'));
const pageShellStr = content.substring(content.indexOf('function PageShell'), content.indexOf('// ── Logo Header'));
const logoHeaderStr = content.substring(content.indexOf('function LogoHeader'), content.indexOf('function UserChip'));

const rulesContent = `import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

${cssStr}
${partStr}
${pageShellStr}
${logoHeaderStr}

export default function Rules() {
  const router = useRouter();

  useEffect(() => {
    const playClickSound = (e) => {
      const target = e.target.closest('button, .ls-link-text, .ls-logo-card-wrap');
      if (target) {
        const audio = new Audio('/sound/touch%20sound.wav');
        audio.play().catch(() => {});
      }
    };
    
    document.addEventListener('click', playClickSound);
    return () => document.removeEventListener('click', playClickSound);
  }, []);

  return (
    <PageShell>
      <LogoHeader subtitle="Game Rules" />
      <div className="ls-card view-animate" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button className="btn-back" style={{ margin: 0 }} onClick={() => router.push('/?mode=tutorial')}>← Back</button>
          <h2 className="ls-section-title" style={{ margin: 0, fontSize: '24px' }}>Least Score Rules</h2>
          <div style={{ width: '60px' }}></div>
        </div>

        <p style={{ fontSize: '15px', fontStyle: 'italic', color: '#FFC857', fontWeight: '600', marginBottom: '20px', background: 'rgba(255,200,87,0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,200,87,0.2)' }}>
          "The player with the lowest score wins, while other players gain points toward elimination"
        </p>

        <p style={{ fontSize: '15px', color: '#F0F4FF', marginBottom: '24px', lineHeight: '1.6' }}>
          Your goal is to keep the lowest possible sum of cards in hand and declare when you think your score is the lowest among all players.
        </p>

        <div className="ls-divider"><span className="line" /><span className="text">ON EVERY TURN</span><span className="line" /></div>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 style={{ color: '#FFD166', fontSize: '16px', marginTop: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: 'rgba(255,209,102,0.2)', padding: '4px 8px', borderRadius: '8px' }}>1</span> Discard
                </h3>
                <ul style={{ color: '#A8B4C2', fontSize: '14px', margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
                    <li>Either a <strong style={{ color: '#F0F4FF' }}>single card</strong>, or</li>
                    <li>A <strong style={{ color: '#F0F4FF' }}>valid combination</strong></li>
                </ul>
            </div>
            <div style={{ flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 style={{ color: '#4ade80', fontSize: '16px', marginTop: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: 'rgba(74,222,128,0.2)', padding: '4px 8px', borderRadius: '8px' }}>2</span> Draw
                </h3>
                <ul style={{ color: '#A8B4C2', fontSize: '14px', margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
                    <li>From the <strong style={{ color: '#F0F4FF' }}>Visible Deck</strong> (card discarded by the previous player), or</li>
                    <li>From the <strong style={{ color: '#F0F4FF' }}>Hidden Deck</strong></li>
                </ul>
            </div>
        </div>

        <div className="ls-divider"><span className="line" /><span className="text">VALID COMBINATIONS</span><span className="line" /></div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <ul style={{ color: '#F0F4FF', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#FFC857' }}>Pair:</strong> 2 cards of the same rank <span style={{ color: '#8896A7' }}>(e.g. two 9s of different suits)</span></li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#FFC857' }}>Sequence of 3:</strong> 3 consecutive cards irrespective of suit <span style={{ color: '#8896A7' }}>(e.g. 4-5-6, A-2-3, Q-K-A)</span></li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#FFC857' }}>Four of a Kind:</strong> 4 cards of the same rank</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#FFC857' }}>Flush of 5:</strong> 5 cards of the same suit</li>
            <li><strong style={{ color: '#FFC857' }}>Sequence of 5:</strong> 5 consecutive cards</li>
            </ul>
        </div>

        <div className="ls-divider"><span className="line" /><span className="text">SCORING & ELIMINATION</span><span className="line" /></div>
        <p style={{ color: '#A8B4C2', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>The player with the higher score loses points toward elimination.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', padding: '16px', borderRadius: '16px' }}>
                <h4 style={{ margin: '0 0 8px', color: '#6EE7B7', fontSize: '15px' }}>Correct Declaration ✓</h4>
                <p style={{ margin: '0 0 8px', color: '#F0F4FF', fontSize: '14px' }}>If your score is the lowest among all players:</p>
                <p style={{ margin: 0, color: '#A8B4C2', fontSize: '13px' }}>Every other player gains: <strong style={{ color: '#6EE7B7' }}>(their score - your score)</strong></p>
            </div>
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', padding: '16px', borderRadius: '16px' }}>
                <h4 style={{ margin: '0 0 8px', color: '#FC8181', fontSize: '15px' }}>Wrong Declaration ✕</h4>
                <p style={{ margin: '0 0 8px', color: '#F0F4FF', fontSize: '14px' }}>If another player has a lower score than you:</p>
                <p style={{ margin: 0, color: '#A8B4C2', fontSize: '13px' }}>You gain: <strong style={{ color: '#FC8181' }}>20 + (your score - lowest player's score)</strong></p>
            </div>
        </div>

        <div className="ls-alert-error" style={{ textAlign: 'center', fontWeight: 'bold' }}>
            The first player to reach 100 points is eliminated.
        </div>

        <div className="ls-alert-info" style={{ marginTop: '20px', textAlign: 'center' }}>
          <strong>Note:</strong> Value of Ace is 1, Joker is 11, Queen is 12 and King is 13.
        </div>
      </div>
    </PageShell>
  );
}
`;

fs.writeFileSync('pages/rules.js', rulesContent);
console.log('Done writing rules.js');
