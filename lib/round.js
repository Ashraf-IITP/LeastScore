// lib/round.js - Declare logic and score calculation

const { calculateSum } = require('./hand');
const { createDeck, shuffle } = require('./deck');

function findNextActivePlayer(players, fromIndex) {
  if (!players.length) return -1;

  for (let offset = 1; offset <= players.length; offset++) {
    const idx = (fromIndex + offset) % players.length;
    if (!players[idx].eliminated) return idx;
  }

  return -1;
}

function declare(gameState, playerId) {
  if (gameState.gameOver) return { error: 'Game over' };

  const declarer = gameState.players[playerId];
  if (!declarer) return { error: 'Invalid player' };
  // Calculate sums only for active (non-eliminated) players. Eliminated players are ignored.
  const roundSums = gameState.players.map((player) => player.eliminated ? Infinity : calculateSum(player.hand));
  const declarerSum = roundSums[playerId];
  const minSum = Math.min(...roundSums);
  const declarerMatchedAnother = roundSums.some((sum, idx) => idx !== playerId && sum === declarerSum);

  const declaredWon = declarerMatchedAnother || declarerSum === minSum;
  const roundResults = gameState.players.map((p, idx) => {
    if (p.eliminated) return null;
    if (idx === playerId) {
      return declaredWon ? 0 : 20 + (declarerSum - minSum);
    } else {
      return declaredWon ? Math.max(0, roundSums[idx] - declarerSum) : 0;
    }
  });

  const score = roundResults[playerId]; // declarer's point change

  if (!gameState.roundHistory) gameState.roundHistory = [];
  gameState.roundHistory.push({
    declarerId: playerId,
    won: declaredWon,
    scores: roundResults
  });

  // Update total scores
  gameState.players.forEach((player, idx) => {
    if (roundResults[idx] !== null) {
      player.score += roundResults[idx];
    }
  });

  const summary = {
    players: gameState.players.map((p, idx) => ({
      username: p.username,
      hand: [...p.hand],
      sum: p.eliminated ? Infinity : calculateSum(p.hand),
    })),
    declarerId: playerId,
    minSum,
    declarerSum,
    declarerMatchedAnother,
    declaredWon: declarerMatchedAnother || declarerSum === minSum
  };

  // Determine newly eliminated players (score >= 100)
  const newlyEliminated = [];
  gameState.players.forEach((player, idx) => {
    if (!player.eliminated && player.score >= 100) {
      player.eliminated = true;
      newlyEliminated.push(idx);
    }
  });

  const activePlayers = gameState.players.filter(p => !p.eliminated).length;
  if (activePlayers <= 1) {
    // Game ends when <=1 active player remains
    gameState.gameOver = true;
    if (activePlayers === 1) {
      gameState.winner = gameState.players.findIndex(p => !p.eliminated);
    } else {
      // No active players (edge-case): pick lowest score as winner
      const rankedByScore = gameState.players
        .map((player, idx) => ({ idx, score: player.score }))
        .sort((a, b) => a.score - b.score);
      gameState.winner = rankedByScore.length ? rankedByScore[0].idx : null;
    }
  } else {
    const previousRoundStarter = Number.isInteger(gameState.roundStartPlayer)
      ? gameState.roundStartPlayer
      : gameState.currentPlayer;

    // Reshuffle and redistribute for new round
    const deck = shuffle(createDeck());
    // Deal only to active players; clear hands for eliminated players
    gameState.players.forEach(player => {
      player.hand = [];
      player.lastDiscard = null;
      player.lastDrawnCard = null;
      player.lastDrawnFrom = null;
      player.isThinking = false;
      if (player.isBot) player.botState = null;
      if (!player.eliminated) {
        for (let i = 0; i < 5; i++) {
          player.hand.push(deck.pop());
        }
      }
    });
    gameState.visibleCard = [deck.pop()];
    gameState.exposedCards = [];
    gameState.deck = deck;
    // Rotate the first turn each round, skipping eliminated seats.
    const nextRoundStarter = findNextActivePlayer(gameState.players, previousRoundStarter);
    gameState.roundStartPlayer = nextRoundStarter;
    gameState.currentPlayer = nextRoundStarter;
  }

  return { success: true, gameState, score, newlyEliminated, roundSummary: summary };
}

module.exports = { declare, findNextActivePlayer };
