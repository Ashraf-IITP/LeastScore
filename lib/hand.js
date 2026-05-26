// lib/hand.js - Hand operations: sum calculation, discard validation

const { RANK_VALUES, RANK_ORDER } = require('./types');

function calculateSum(hand) {
  return hand.reduce((sum, card) => sum + RANK_VALUES[card.rank], 0);
}

function isSequence(cards) {
  if (cards.length < 3) return false;
  const ranks = cards.map(c => RANK_ORDER[c.rank]);
  const unique = [...new Set(ranks)];
  if (unique.length !== cards.length) return false;
  unique.sort((a, b) => a - b);

  const min = unique[0];
  const max = unique[unique.length - 1];
  if (max - min === unique.length - 1) return true;

  return isCircularSequence(unique);
}

function isCircularSequence(uniqueRanks) {
  const length = uniqueRanks.length;
  for (const start of uniqueRanks) {
    let valid = true;
    for (let offset = 0; offset < length; offset++) {
      const expected = (start + offset) % 13;
      if (!uniqueRanks.includes(expected)) {
        valid = false;
        break;
      }
    }
    if (valid) return true;
  }
  return false;
}

function isValidDiscard(hand, discardCards) {
  // Check if all discard cards are in hand
  const inHand = discardCards.every(dc => hand.some(hc => hc.suit === dc.suit && hc.rank === dc.rank));
  if (!inHand) return false;

  const count = discardCards.length;
  if (count === 1) return true;
  if (count === 2) return discardCards.every(c => c.rank === discardCards[0].rank);
  if (count === 3) return isSequence(discardCards);
  if (count === 4) return discardCards.every(c => c.rank === discardCards[0].rank);
  if (count === 5) return isSequence(discardCards) || discardCards.every(c => c.suit === discardCards[0].suit);
  return false;
}

function removeCards(hand, cardsToRemove) {
  return hand.filter(hc => !cardsToRemove.some(rc => rc.suit === hc.suit && rc.rank === hc.rank));
}

module.exports = { calculateSum, isValidDiscard, removeCards };