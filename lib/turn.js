// lib/turn.js - Handle player turns: draw and discard

const { draw, shuffle } = require('./deck');
const { isValidDiscard, removeCards } = require('./hand');

function processTurn(gameState, playerId, drawFrom, visibleIndex, discardCards) {
  // Ensure currentPlayer points to an active (non-eliminated) player.
  function findNextActive(startIndex) {
    const len = gameState.players.length;
    for (let i = 0; i < len; i++) {
      const idx = (startIndex + i) % len;
      const p = gameState.players[idx];
      if (p && !p.eliminated) return idx;
    }
    return -1;
  }

  if (gameState.players[gameState.currentPlayer] && gameState.players[gameState.currentPlayer].eliminated) {
    const nextActive = findNextActive(gameState.currentPlayer);
    if (nextActive === -1) return { error: 'No active players' };
    gameState.currentPlayer = nextActive;
  }

  if (gameState.currentPlayer !== playerId) return { error: 'Not your turn' };
  if (gameState.gameOver) return { error: 'Game over' };

  const player = gameState.players[playerId];

  // Draw
  let drawnCard;
  if (drawFrom === 'visible') {
    if (gameState.visibleCard.length === 0) return { error: 'No visible card' };
    if (typeof visibleIndex !== 'number' || visibleIndex < 0 || visibleIndex >= gameState.visibleCard.length) {
      return { error: 'Select a valid visible card to draw' };
    }
    drawnCard = gameState.visibleCard.splice(visibleIndex, 1)[0];
  } else if (drawFrom === 'deck') {
    if (gameState.deck.length === 0) {
      if (gameState.exposedCards.length === 0) return { error: 'No cards left' };
      gameState.deck = shuffle([...gameState.exposedCards]);
      gameState.exposedCards = [];
    }
    drawnCard = draw(gameState.deck);

    // If we just drew the last card, reshuffle and replenish immediately
    if (gameState.deck.length === 0 && gameState.exposedCards.length > 0) {
      gameState.deck = shuffle([...gameState.exposedCards]);
      gameState.exposedCards = [];
    }
  } else {
    return { error: 'Invalid draw source' };
  }

  player.hand.push(drawnCard);

  // Validate discard
  if (!isValidDiscard(player.hand, discardCards)) {
    // Roll back the draw if discard is invalid
    player.hand.pop();
    if (drawFrom === 'visible') {
      gameState.visibleCard.splice(visibleIndex, 0, drawnCard);
    } else {
      gameState.deck.push(drawnCard);
    }
    return { error: 'Invalid discard' };
  }

  // Discard
  player.hand = removeCards(player.hand, discardCards);
  
  // Set last drawn and discarded cards so client can track history
  player.lastDrawnCard = drawnCard;
  player.lastDrawnFrom = drawFrom;
  player.lastDiscard = [...discardCards];

  // Update visible card
  gameState.exposedCards.push(...gameState.visibleCard);
  gameState.visibleCard = [...discardCards];

  // Next player: advance to next active (non-eliminated) player
  const next = findNextActive(gameState.currentPlayer + 1);
  if (next === -1) {
    // no other active players — keep current (should trigger game end elsewhere)
    // leave as is
  } else {
    gameState.currentPlayer = next;
  }

  return { success: true, gameState };
}

module.exports = { processTurn };