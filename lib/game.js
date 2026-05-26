// lib/game.js - Game state initialization and management

const { createDeck, shuffle } = require('./deck');

function initializeGame(playerCount = 2) {
  const safePlayerCount = Math.max(2, Math.min(8, Number(playerCount) || 2));
  let deck = shuffle(createDeck());
  const players = Array.from({ length: safePlayerCount }, (_, i) => ({
    id: i,
    hand: [],
    score: 0,
    eliminated: false
  }));

  // Deal 5 cards each
  for (let i = 0; i < 5; i++) {
    players.forEach((player) => {
      player.hand.push(deck.pop());
    });
  }

  const visibleCard = [deck.pop()];
  const exposedCards = [];

  return {
    players,
    currentPlayer: 0,
    deck,
    visibleCard,
    exposedCards,
    gameOver: false,
    winner: null,
    roundHistory: []
  };
}

module.exports = { initializeGame };