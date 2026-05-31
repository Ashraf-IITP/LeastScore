const SUIT_SYMBOLS = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

function isRedSuit(suit) {
  return suit === 'hearts' || suit === 'diamonds';
}

/** Compact chip used for Last Draw / Last Discard on the game page */
export function MiniCard({ card }) {
  if (!card || card.hidden) return null;
  return (
    <span
      style={{
        fontSize: '11px',
        padding: '2px 5px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '4px',
        fontWeight: 600,
        color: isRedSuit(card.suit) ? '#FC8181' : '#F0F4FF',
        display: 'inline-block',
      }}
    >
      {card.rank}
      {SUIT_SYMBOLS[card.suit] || ''}
    </span>
  );
}

export function HiddenDeckChip() {
  return (
    <span
      style={{
        fontSize: '11px',
        padding: '2px 6px',
        background: 'rgba(255,200,87,0.15)',
        border: '1px solid rgba(255,200,87,0.3)',
        borderRadius: '4px',
        fontWeight: 700,
        color: '#FFC857',
        display: 'inline-block',
      }}
    >
      🂠 Deck
    </span>
  );
}

/** Hidden deck chip with remaining card count (match history table area) */
export function HiddenDeckWithCount({ count }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      <HiddenDeckChip />
      {typeof count === 'number' && (
        <span style={{ fontSize: '10px', color: '#8896A7', fontWeight: 600 }}>
          {count} {count === 1 ? 'card' : 'cards'} left
        </span>
      )}
    </span>
  );
}

/** Row of compact mini cards (same style as last draw / last discard) */
export function MiniCardRow({ cards, emptyLabel = '—' }) {
  if (!cards?.length) {
    return <span style={{ fontSize: '9px', color: '#cbd5e1', fontStyle: 'italic' }}>{emptyLabel}</span>;
  }
  return (
    <span style={{ display: 'inline-flex', gap: '3px', flexWrap: 'wrap' }}>
      {cards.map((card, i) => {
        if (!card || card.hidden) {
          return <HiddenDeckChip key={`hidden-${i}`} />;
        }
        return <MiniCard key={`${card.rank}-${card.suit}-${i}`} card={card} />;
      })}
    </span>
  );
}

export function LastDrawChip({ card, fromDeck }) {
  if (!card) {
    return <span style={{ fontSize: '9px', color: '#cbd5e1', fontStyle: 'italic' }}>—</span>;
  }
  if (card.hidden || fromDeck) return <HiddenDeckChip />;
  return <MiniCard card={card} />;
}

export function LastDiscardChips({ cards }) {
  if (!cards?.length) {
    return <span style={{ fontSize: '9px', color: '#cbd5e1', fontStyle: 'italic' }}>—</span>;
  }
  return (
    <span style={{ display: 'inline-flex', gap: '3px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {cards.map((card, i) => (
        <MiniCard key={`${card.rank}-${card.suit}-${i}`} card={card} />
      ))}
    </span>
  );
}

/** Full playing card (same layout as the main game table) */
export function PlayingCard({ card, selected = false, highlight = false, onClick = null }) {
  if (!card || card.hidden) {
    return (
      <div
        style={{
          margin: '4px',
          padding: '8px 8px 20px',
          minWidth: '48px',
          minHeight: '80px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 700,
          color: '#8896A7',
        }}
      >
        🂠
      </div>
    );
  }

  const isRed = isRedSuit(card.suit);
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick || undefined}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        margin: '4px',
        padding: '8px 8px 20px',
        minWidth: '56px',
        minHeight: '92px',
        borderRadius: '10px',
        border: selected ? '3px solid #7B8FFF' : '1px solid rgba(255,255,255,0.2)',
        background: highlight ? '#fffde7' : '#ffffff',
        boxShadow: highlight ? '0 0 12px 4px rgba(255, 152, 0, 0.7)' : '0 3px 6px rgba(0,0,0,0.3)',
        color: isRed ? '#c11' : '#111',
        display: 'inline-flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '16px',
        fontWeight: 600,
        transform: selected ? 'translateY(-2px)' : 'none',
      }}
    >
      <span style={{ alignSelf: 'flex-start' }}>{card.rank}</span>
      <span style={{ fontSize: '26px' }}>{SUIT_SYMBOLS[card.suit]}</span>
      <span style={{ alignSelf: 'flex-end' }}>{card.rank}</span>
    </Tag>
  );
}

export function CardRow({ cards, emptyLabel = '—' }) {
  if (!cards?.length) {
    return <span style={{ fontSize: '13px', color: '#94a3b8' }}>{emptyLabel}</span>;
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
      {cards.map((card, i) => (
        <PlayingCard key={`${card.rank}-${card.suit}-${i}`} card={card} />
      ))}
    </div>
  );
}

export { SUIT_SYMBOLS };
