const { declare, findNextActivePlayer } = require('../lib/round');

function card(rank, suit = 'hearts') {
  return { rank, suit };
}

function player(username, hand, score = 0, extras = {}) {
  return {
    username,
    hand,
    score,
    eliminated: false,
    ...extras,
  };
}

function gameState(players, roundStartPlayer = 0) {
  return {
    players,
    currentPlayer: roundStartPlayer,
    roundStartPlayer,
    deck: [],
    visibleCard: [card('9', 'clubs')],
    exposedCards: [],
    gameOver: false,
    winner: null,
    roundHistory: [],
  };
}

describe('findNextActivePlayer', () => {
  it('returns the next active player after the provided seat', () => {
    const players = [
      player('A', []),
      player('B', [], 0, { eliminated: true }),
      player('C', []),
    ];

    expect(findNextActivePlayer(players, 0)).toBe(2);
  });
});

describe('declare round rotation', () => {
  it('starts the next round with the next active player after the previous round starter', () => {
    const state = gameState([
      player('A', [card('A'), card('A'), card('A'), card('A'), card('A')]),
      player('B', [card('2'), card('2'), card('2'), card('2'), card('2')]),
      player('C', [card('3'), card('3'), card('3'), card('3'), card('3')]),
    ], 0);

    const result = declare(state, 0);

    expect(result.success).toBe(true);
    expect(state.gameOver).toBe(false);
    expect(state.roundStartPlayer).toBe(1);
    expect(state.currentPlayer).toBe(1);
  });

  it('skips eliminated players when choosing the next round starter', () => {
    const state = gameState([
      player('A', [card('A'), card('A'), card('A'), card('A'), card('A')]),
      player('B', [card('2'), card('2'), card('2'), card('2'), card('2')]),
      player('C', [card('A'), card('A'), card('A'), card('A'), card('6')], 99),
      player('D', [card('3'), card('3'), card('3'), card('3'), card('3')]),
    ], 1);

    const result = declare(state, 0);

    expect(result.success).toBe(true);
    expect(result.newlyEliminated).toContain(2);
    expect(state.gameOver).toBe(false);
    expect(state.roundStartPlayer).toBe(3);
    expect(state.currentPlayer).toBe(3);
  });

  it('clears bot thinking and bot memory for the fresh round', () => {
    const state = gameState([
      player('Human', [card('A'), card('A'), card('A'), card('A'), card('A')]),
      player('Bot', [card('2'), card('2'), card('2'), card('2'), card('2')], 0, {
        isBot: true,
        isThinking: true,
        botState: { turnCount: 4 },
        lastDrawnFrom: 'visible',
      }),
    ], 0);

    const result = declare(state, 0);

    expect(result.success).toBe(true);
    expect(state.players[1].isThinking).toBe(false);
    expect(state.players[1].botState).toBeNull();
    expect(state.players[1].lastDrawnFrom).toBeNull();
  });
});
