const { makeBotDecision } = require('../lib/bot');
const { makeEasyBotDecision } = require('../lib/easyBot');

function card(rank, suit = 'hearts') {
  return { rank, suit };
}

function gameState(botHand, difficulty = 'hard') {
  return {
    players: [
      {
        username: `${difficulty} bot`,
        hand: botHand,
        score: 0,
        isBot: true,
        difficulty,
        eliminated: false,
      },
      {
        username: 'Human',
        hand: [card('4'), card('5'), card('6'), card('7'), card('8')],
        score: 0,
        eliminated: false,
      },
    ],
    currentPlayer: 0,
    deck: [],
    visibleCard: [],
    exposedCards: [],
    gameOver: false,
  };
}

function rankKey(cards) {
  return cards.map(c => c.rank).sort().join('-');
}

describe('bot sequence rules', () => {
  it('hard bot does not discard K-A-2 as a sequence combo', () => {
    const state = gameState([
      card('K', 'hearts'),
      card('A', 'clubs'),
      card('2', 'spades'),
      card('7', 'diamonds'),
      card('9', 'clubs'),
    ]);

    const decision = makeBotDecision(state, 0);

    expect(rankKey(decision.discardCards)).not.toBe('2-A-K');
  });

  it('easy bot does not discard K-A-2 as a sequence combo', () => {
    const state = gameState([
      card('K', 'hearts'),
      card('A', 'clubs'),
      card('2', 'spades'),
      card('7', 'diamonds'),
      card('9', 'clubs'),
    ], 'easy');

    const decision = makeEasyBotDecision(state, 0);

    expect(rankKey(decision.discardCards)).not.toBe('2-A-K');
  });
});
