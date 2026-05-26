// tests/hand.test.js - Tests for hand operations

const { calculateSum, isValidDiscard } = require('../lib/hand');

describe('calculateSum', () => {
  it('calculates sum correctly', () => {
    const hand = [
      { rank: 'A' },
      { rank: '2' },
      { rank: 'K' }
    ];
    expect(calculateSum(hand)).toBe(1 + 2 + 13);
  });

  it('handles empty hand', () => {
    expect(calculateSum([])).toBe(0);
  });
});

describe('isValidDiscard', () => {
  const hand = [
    { suit: 'hearts', rank: 'A' },
    { suit: 'hearts', rank: '2' },
    { suit: 'hearts', rank: '3' },
    { suit: 'diamonds', rank: 'K' },
    { suit: 'clubs', rank: 'K' }
  ];

  it('validates single card', () => {
    expect(isValidDiscard(hand, [{ suit: 'hearts', rank: 'A' }])).toBe(true);
  });

  it('validates two same rank', () => {
    expect(isValidDiscard(hand, [
      { suit: 'diamonds', rank: 'K' },
      { suit: 'clubs', rank: 'K' }
    ])).toBe(true);
  });

  it('validates sequence', () => {
    expect(isValidDiscard(hand, [
      { suit: 'hearts', rank: 'A' },
      { suit: 'hearts', rank: '2' },
      { suit: 'hearts', rank: '3' }
    ])).toBe(true);
  });

  it('validates mixed-suit sequence', () => {
    const mixedHand = [
      { suit: 'clubs', rank: '4' },
      { suit: 'hearts', rank: '5' },
      { suit: 'hearts', rank: '6' },
      { suit: 'diamonds', rank: 'K' },
      { suit: 'clubs', rank: 'K' }
    ];
    expect(isValidDiscard(mixedHand, [
      { suit: 'clubs', rank: '4' },
      { suit: 'hearts', rank: '5' },
      { suit: 'hearts', rank: '6' }
    ])).toBe(true);
  });

  it('validates circular sequence Q-K-A', () => {
    const circularHand = [
      { suit: 'hearts', rank: 'Q' },
      { suit: 'clubs', rank: 'K' },
      { suit: 'spades', rank: 'A' }
    ];
    expect(isValidDiscard(circularHand, circularHand)).toBe(true);
  });

  it('rejects invalid discard', () => {
    expect(isValidDiscard(hand, [
      { suit: 'hearts', rank: 'A' },
      { suit: 'diamonds', rank: 'K' }
    ])).toBe(false);
  });
});