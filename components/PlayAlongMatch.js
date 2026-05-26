import { useEffect, useRef } from 'react';
import {
  createBotState,
  makePlayAlongHint,
  observeHintState,
  recordSeenCards,
} from '../lib/bot';
import { calculateSum } from '../lib/hand';

export const PLAY_ALONG_DECLARATION_NOTE =
  'You may declare whenever your score is less than your opponent\'s, but we suggest bringing your hand sum below 10 before declaring. In a real match you cannot see opponents\' cards, so a higher hand sum is risky.';

const SUIT_SYMBOLS = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };

export function getHandSum(hand) {
  if (!hand || hand.length === 0) return 0;
  return calculateSum(hand);
}

export function usePlayAlongHintMemory(gameState, myPlayerIndex, active) {
  const hintStateRef = useRef(null);
  const prevGsRef = useRef(null);

  useEffect(() => {
    if (!active) {
      hintStateRef.current = null;
      prevGsRef.current = null;
      return;
    }
    if (!gameState || myPlayerIndex == null) return;

    if (!hintStateRef.current) {
      hintStateRef.current = createBotState();
      recordSeenCards(hintStateRef.current, gameState.visibleCard || []);
      recordSeenCards(hintStateRef.current, gameState.players[myPlayerIndex]?.hand || []);
    }

    const prev = prevGsRef.current;
    if (prev && prev.currentPlayer !== gameState.currentPlayer) {
      observeHintState(
        hintStateRef.current,
        gameState,
        prev.currentPlayer,
        prev.visibleCard || [],
        myPlayerIndex
      );
    }
    prevGsRef.current = gameState;
  }, [gameState, myPlayerIndex, active]);

  return hintStateRef;
}

export function computePlayAlongHint(gameState, myPlayerIndex, hintStateRef) {
  const hintState = hintStateRef.current || createBotState();
  const result = makePlayAlongHint(gameState, myPlayerIndex, hintState);
  hintStateRef.current = result.hintState;
  return result;
}

export function isHintDiscardCard(card, hint) {
  if (!hint?.discardCards) return false;
  return hint.discardCards.some((c) => c.suit === card.suit && c.rank === card.rank);
}

export function isHintVisibleDraw(index, hint) {
  return hint?.drawFrom === 'visible' && hint.visibleIndex === index;
}

export function isHintDeckDraw(hint) {
  return hint?.drawFrom === 'deck';
}

/** Apply hint discard/draw choices so the player can use Make Turn immediately. */
export function applyPlayAlongHintSelection(hint, { setSelectedCards, setDrawFrom, setVisibleIndex }) {
  if (!hint) return;
  setSelectedCards(hint.discardCards || []);
  setDrawFrom(hint.drawFrom || null);
  setVisibleIndex(hint.drawFrom === 'visible' ? (hint.visibleIndex ?? null) : null);
}

export function confirmPlayAlongDeclare(hand, onDeclare) {
  const sum = getHandSum(hand);
  if (sum < 10) {
    onDeclare();
    return;
  }
  const ok = window.confirm(
    `Your hand sum is ${sum} (not below 10). Are you sure you want to declare?\n\n` +
    'In a real match you cannot see opponents\' hands. Someone may have a lower sum and you could lose the round.'
  );
  if (ok) onDeclare();
}

export function PlayAlongDeclarationBanner() {
  return (
    <div
      style={{
        margin: '12px 0 16px',
        padding: '12px 16px',
        background: '#e3f2fd',
        border: '1px solid #90caf9',
        borderRadius: '10px',
        color: '#0d47a1',
        fontSize: '14px',
        lineHeight: 1.5,
        textAlign: 'left',
      }}
    >
      <strong>Declaration tip:</strong> {PLAY_ALONG_DECLARATION_NOTE}
    </div>
  );
}

export function PlayAlongHintReasoningPanel({ reasoning, onDismiss }) {
  if (!reasoning || reasoning.length === 0) return null;
  return (
    <div
      style={{
        marginTop: '16px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #5c6bc0',
      }}
    >
      <div
        style={{
          padding: '14px 18px',
          background: 'linear-gradient(135deg, #1a237e, #283593)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 style={{ margin: 0, color: '#c5cae9', fontSize: '15px' }}>💡 Hint — why this move?</h4>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              style={{
                padding: '4px 10px',
                fontSize: '12px',
                cursor: 'pointer',
                background: 'transparent',
                color: '#c5cae9',
                border: '1px solid #7986cb',
                borderRadius: '6px',
              }}
            >
              Hide
            </button>
          )}
        </div>
        {reasoning.map((line, i) => (
          <div
            key={`hint-line-${i}`}
            style={{
              padding: '3px 0',
              color: '#e8eaf6',
              fontSize: '14px',
              lineHeight: 1.6,
            }}
          >
            {line}
          </div>
        ))}
        <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#9fa8da' }}>
          Red glow = suggested discard. Gold glow = suggested draw (hidden deck or visible card).
        </p>
      </div>
    </div>
  );
}

/** Card styles matching Observe a Game (ScriptedMatch) glows */
export function playAlongCardStyle(card, { discardGlow = false, drawnGlow = false, selected = false, highlight = false } = {}) {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  let boxShadow = '0 2px 8px rgba(0,0,0,0.25)';
  let background = '#ffffff';
  let border = '1px solid rgba(255,255,255,0.12)';

  if (selected === 'discard' || selected === true || discardGlow) {
    border = '2px solid #e53935';
    background = '#ffebee';
    boxShadow = '0 0 14px 4px rgba(244, 67, 54, 0.85)';
  } else if (selected === 'draw' || drawnGlow || highlight) {
    border = '2px solid #ffb300';
    background = '#fffde7';
    boxShadow = '0 0 12px 4px rgba(255, 152, 0, 0.7)';
  }

  return {
    cursor: 'pointer',
    margin: '5px',
    padding: '8px 6px',
    minWidth: '54px',
    minHeight: '78px',
    borderRadius: '12px',
    border,
    background,
    boxShadow,
    color: isRed ? '#c11' : '#111',
    display: 'inline-flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '15px',
    fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif",
    transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
    transform: selected ? 'translateY(-4px)' : 'none',
  };
}

export function formatHandSumLabel(sum) {
  return `Hand sum: ${sum}`;
}

export function cardLabel(card) {
  return `${card.rank}${SUIT_SYMBOLS[card.suit] || ''}`;
}
