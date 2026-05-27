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
    { suit: 'hearts', rank: '2' },
    { suit: 'hearts', rank: '3' },
    { suit: 'hearts', rank: '4' },
    { suit: 'diamonds', rank: 'K' },
    { suit: 'clubs', rank: 'K' }
  ];

  it('validates single card', () => {
    expect(isValidDiscard(hand, [{ suit: 'hearts', rank: '2' }])).toBe(true);
  });

  it('validates two same rank', () => {
    expect(isValidDiscard(hand, [
      { suit: 'diamonds', rank: 'K' },
      { suit: 'clubs', rank: 'K' }
    ])).toBe(true);
  });

  it('validates sequence', () => {
    expect(isValidDiscard(hand, [
      { suit: 'hearts', rank: '2' },
      { suit: 'hearts', rank: '3' },
      { suit: 'hearts', rank: '4' }
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

  it('validates high-ace sequence Q-K-A', () => {
    const highAceHand = [
      { suit: 'hearts', rank: 'Q' },
      { suit: 'clubs', rank: 'K' },
      { suit: 'spades', rank: 'A' }
    ];
    expect(isValidDiscard(highAceHand, highAceHand)).toBe(true);
  });

  it('validates high-ace sequence 10-J-Q-K-A', () => {
    const highAceHand = [
      { suit: 'hearts', rank: '10' },
      { suit: 'clubs', rank: 'J' },
      { suit: 'spades', rank: 'Q' },
      { suit: 'diamonds', rank: 'K' },
      { suit: 'hearts', rank: 'A' }
    ];
    expect(isValidDiscard(highAceHand, highAceHand)).toBe(true);
  });

  it('rejects wrapped sequence K-A-2', () => {
    const wrappedHand = [
      { suit: 'hearts', rank: 'K' },
      { suit: 'clubs', rank: 'A' },
      { suit: 'spades', rank: '2' }
    ];
    expect(isValidDiscard(wrappedHand, wrappedHand)).toBe(false);
  });

  it('validates low-ace sequence A-2-3', () => {
    const lowAceHand = [
      { suit: 'hearts', rank: 'A' },
      { suit: 'clubs', rank: '2' },
      { suit: 'spades', rank: '3' }
    ];
    expect(isValidDiscard(lowAceHand, lowAceHand)).toBe(true);
  });

  it('validates low-ace sequence A-2-3-4-5', () => {
    const lowAceHand = [
      { suit: 'hearts', rank: 'A' },
      { suit: 'clubs', rank: '2' },
      { suit: 'spades', rank: '3' },
      { suit: 'diamonds', rank: '4' },
      { suit: 'clubs', rank: '5' }
    ];
    expect(isValidDiscard(lowAceHand, lowAceHand)).toBe(true);
  });

  it('rejects wrapped sequence K-A-2-3-4', () => {
    const wrappedHand = [
      { suit: 'hearts', rank: 'K' },
      { suit: 'clubs', rank: 'A' },
      { suit: 'spades', rank: '2' },
      { suit: 'diamonds', rank: '3' },
      { suit: 'clubs', rank: '4' }
    ];
    expect(isValidDiscard(wrappedHand, wrappedHand)).toBe(false);
  });

  it('rejects invalid discard', () => {
    expect(isValidDiscard(hand, [
      { suit: 'hearts', rank: 'A' },
      { suit: 'diamonds', rank: 'K' }
    ])).toBe(false);
  });
});
