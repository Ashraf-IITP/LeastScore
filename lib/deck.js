// lib/deck.js - Deck creation, shuffling, and drawing logic

const { SUITS, RANKS } = require('./types');
    
function createDeck() {
  return SUITS.flatMap(suit => RANKS.map(rank => ({ suit, rank })));
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function draw(deck) {
  return deck.pop();
}

module.exports = { createDeck, shuffle, draw };