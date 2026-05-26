// lib/types.js - Shared types and constants for the card game

const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const RANK_VALUES = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 11, 'Q': 12, 'K': 13, 'A': 1
};
const RANK_ORDER = RANKS.reduce((acc, rank, i) => ({ ...acc, [rank]: i }), {});

module.exports = { SUITS, RANKS, RANK_VALUES, RANK_ORDER };