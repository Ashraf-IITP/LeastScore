const fs = require('fs');

const rulesContent = fs.readFileSync('pages/rules.js', 'utf8');
const match1 = rulesContent.indexOf('const GLOBAL_CSS');
const match2 = rulesContent.indexOf('export default function Rules');
const sharedComponents = rulesContent.substring(match1, match2);

const scriptedMatchContent = `import React, { useState, useEffect } from 'react';
import Head from 'next/head';

${sharedComponents}

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
    prompt: 'In this case — single card discard\\n\\nThe best card to discard is K♠ (red). You can always discard one card; dropping a King removes 13 points from your hand.\\n\\nNow choose where to draw from: J♦ on the visible pile is still a poor pick (11 points, no combo), so draw from the Hidden deck (gold).',
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
    prompt: 'In this case — pair (two cards, same rank)\\n\\nThe best cards to discard are 9♥ and 9♣ (red) — a pair clears 18 points at once.\\n\\nNow choose where to draw from: Q♠ does not help this hand, so take the Hidden deck (gold).',
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
    prompt: 'In this case — sequence of 3\\n\\nThe best cards to discard are 8♠ 9♦ 10♣ (red) — three consecutive ranks; suits can differ.\\n\\nNow choose where to draw from: 7♥ does not fit what is left, so draw from the Hidden deck (gold).',
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
    prompt: 'In this case — four of a kind (quadruple)\\n\\nThe best cards to discard are all four Queens (red) — four cards of the same rank.\\n\\nNow choose where to draw from: 4♣ on the visible pile is low and also forms a combo of 4♣ - 5♦ - 6♣ instead of gambling for a card blindly from the hidden deck.',
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
    prompt: 'In this case — sequence of 5\\n\\nThe best cards to discard are 5♣ 6♦ 7♥ 8♠ 9♣ (red) — five consecutive ranks (mixed suits are fine).\\n\\nNow choose where to draw from: K♠ is 13 points and useless here, so draw from the Hidden deck (gold).',
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
    prompt: 'In this case — flush (five cards, same suit)\\n\\nThe best cards to discard are all five diamonds (red) — 2♦ 4♦ 6♦ 7♦ 9♦.\\n\\nNow choose where to draw from: 8♥ is okay but does not form a combo and drawing from the Hidden deck could get us an even a smaller card (gold).',
    playerScore: 0,
  },
  {
    kind: 'info',
    caseId: 7,
    discardType: 'Correct declaration',
    p: [{ r: '3', s: 'spades' }, { r: 'A', s: 'clubs' }],
    v: { r: '5', s: 'clubs' },
    prompt: 'In this case — correct declaration\\n\\nYour hand score is 4 (3♠ + A♣). Opponent Bot\\'s hand totals 11 in this case.\\n\\nYou declare correctly. Opponent gains 11 − 4 = 7 points toward elimination (first to 100 is out).',
    playerScore: 7,
    opponentHandScore: 11,
  },
  {
    kind: 'info',
    caseId: 8,
    discardType: 'Wrong declaration',
    p: [{ r: '4', s: 'spades' }, { r: '4', s: 'clubs' }],
    v: { r: '5', s: 'clubs' },
    prompt: 'In this case — wrong declaration\\n\\nYour hand score is 8 (4♠ + 4♣). Opponent Bot\\'s hand totals 5 in this case — lower than yours.\\n\\nWrong declare penalty: 20 + (8 − 5) = 23 points added to your score.',
    playerScore: 23,
    opponentHandScore: 5,
  },
  {
    kind: 'end',
    caseId: 9,
    p: [],
    v: null,
    prompt: 'Tutorial summary:\\n\\n✔ Each case is separate — each turn = discard then draw\\n✔ Single → Pair → Sequence of 3 → Four of a kind → Sequence of 5 → Flush\\n✔ Pick visible cards only when they help; otherwise use the hidden deck\\n✔ Wrong declare: 20 + (your hand − lowest hand)\\n\\nGood luck!',
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
          {stage.discardType ? \`Scenario: \${stage.discardType}\` : 'Introduction'}
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
              border: \`1px solid \${pl.active ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.06)'}\`,
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
            <div className={\`ls-deck-btn \${stage.drawGlow === 'hidden' ? 'selected-draw' : ''}\`}>
              <span style={{ fontSize: '24px', lineHeight: '1.2' }}>🂠</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Deck</span>
            </div>
          </div>
        </div>

        <div className="ls-zone active">
          <p className="ls-zone-label">Your Hand ({currentP.length})</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {currentP.map((c, i) =>
              renderCard(\`hand-\${i}\`, toGameCard(c), {
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
`;

fs.writeFileSync('components/ScriptedMatch.js', scriptedMatchContent);
console.log('Done writing ScriptedMatch.js');
