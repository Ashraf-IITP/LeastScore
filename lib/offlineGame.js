// lib/offlineGame.js
// Self-contained offline game engine for 'Play with AI' and 'Pass and Play' modes.
// No server, no socket — all state is kept in memory and returned to the caller.
// Usable in both Node.js (server) and browser (via Next.js/webpack bundling).

const { initializeGame } = require('./game');
const { processTurn } = require('./turn');
const { declare } = require('./round');
const { calculateSum } = require('./hand');
const { RANK_VALUES } = require('./types');
const { makeBotDecision, observePlayerMove } = require('./bot');
const { makeEasyBotDecision, observeEasyBotMove } = require('./easyBot');

// ─── startOfflineGame ────────────────────────────────────────────────────────
// mode: 'ai' | 'pass_and_play'
// options for 'ai'           : { playerName, easyBotCount, hardBotCount }
// options for 'pass_and_play': { playerCount, playerNames[] }
//
// Returns a plain game state object compatible with the existing UI.
function startOfflineGame(mode, options = {}) {
  if (mode === 'ai') {
    const {
      playerName = 'You',
      easyBotCount = 1,
      hardBotCount = 0,
    } = options;

    const totalBots = (easyBotCount || 0) + (hardBotCount || 0);
    if (totalBots < 1 || totalBots > 7) {
      throw new Error('AI matches require 1–7 bots.');
    }

    const playerCount = totalBots + 1;
    const state = initializeGame(playerCount);

    // Slot 0 = human player
    state.players[0].username = playerName;
    state.players[0].isBot = false;

    // Fill remaining slots: easy bots first, then hard bots
    let slot = 1;
    for (let i = 0; i < easyBotCount; i++, slot++) {
      state.players[slot].username = easyBotCount === 1 ? 'Easy Bot' : `Easy Bot ${i + 1}`;
      state.players[slot].isBot = true;
      state.players[slot].difficulty = 'easy';
    }
    for (let i = 0; i < hardBotCount; i++, slot++) {
      state.players[slot].username = hardBotCount === 1 ? 'Hard Bot' : `Hard Bot ${i + 1}`;
      state.players[slot].isBot = true;
      state.players[slot].difficulty = 'hard';
    }

    state.mode = 'ai';
    return state;
  }

  if (mode === 'pass_and_play') {
    const { playerCount = 2, playerNames = [] } = options;
    const safe = Math.max(2, Math.min(8, Number(playerCount) || 2));
    const state = initializeGame(safe);

    state.players.forEach((p, i) => {
      p.username = playerNames[i] || `Player ${i + 1}`;
      p.isBot = false;
    });

    state.mode = 'pass_and_play';
    return state;
  }

  throw new Error(`Unknown offline mode: "${mode}"`);
}

// ─── processOfflineAction ────────────────────────────────────────────────────
// Applies one human action to the state and returns the updated state.
// Returns a new state object (does NOT mutate the input).
//
// action shapes:
//   { type: 'turn', playerId, drawFrom, visibleIndex, discardCards }
//   { type: 'declare', playerId }
//
// Returns: { success, gameState, error?, roundSummary?, newlyEliminated? }
function processOfflineAction(state, action) {
  // Deep-clone so React state stays immutable
  const gs = JSON.parse(JSON.stringify(state));

  if (action.type === 'turn') {
    const { playerId, drawFrom, visibleIndex, discardCards } = action;
    const result = processTurn(gs, playerId, drawFrom, visibleIndex, discardCards);
    if (result.error) {
      return { success: false, error: result.error, gameState: state };
    }
    return { success: true, gameState: result.gameState };
  }

  if (action.type === 'declare') {
    const { playerId } = action;
    const result = declare(gs, playerId);
    if (result.error) {
      return { success: false, error: result.error, gameState: state };
    }
    return {
      success: true,
      gameState: result.gameState,
      roundSummary: result.roundSummary,
      newlyEliminated: result.newlyEliminated,
      score: result.score,
    };
  }

  return { success: false, error: `Unknown action type: ${action.type}`, gameState: state };
}

// ─── getBotMove ──────────────────────────────────────────────────────────────
// Runs the current bot player's turn. The bot is whoever gameState.currentPlayer
// points to, and that player must have isBot === true.
//
// Returns:
//   {
//     gameState,                // updated state after bot acts
//     action: 'declare'|'turn',
//     reasoning: string[],
//     botPlayerIndex: number,
//     roundSummary?,           // present when bot declared
//     newlyEliminated?,        // present when bot declared
//   }
function getBotMove(state) {
  const gs = JSON.parse(JSON.stringify(state));
  const botIndex = gs.currentPlayer;
  const botPlayer = gs.players[botIndex];

  if (!botPlayer || !botPlayer.isBot) {
    return { gameState: gs, action: null, reasoning: [], botPlayerIndex: botIndex };
  }

  const previousVisible = [...(gs.visibleCard || [])];

  // Ask the appropriate bot engine for a decision
  let decision;
  if (botPlayer.difficulty === 'easy') {
    decision = makeEasyBotDecision(gs, botIndex);
  } else {
    decision = makeBotDecision(gs, botIndex);
  }

  const reasoning = decision.decisionReasoning || [];

  // ── Declare path ──────────────────────────────────────────────
  if (decision.action === 'declare') {
    const result = declare(gs, botIndex);
    if (result.error) {
      // Can't declare yet (not everyone has played) — fall back to a turn
      return _botFallbackTurn(gs, botIndex, reasoning, previousVisible);
    }
    _observeAll(result.gameState, botIndex, previousVisible);
    return {
      gameState: result.gameState,
      action: 'declare',
      roundSummary: result.roundSummary,
      newlyEliminated: result.newlyEliminated,
      score: result.score,
      reasoning,
      botPlayerIndex: botIndex,
    };
  }

  // ── Turn path ─────────────────────────────────────────────────
  const { drawFrom, visibleIndex, discardCards } = decision;
  const safeDiscard =
    discardCards && discardCards.length > 0
      ? discardCards
      : [gs.players[botIndex].hand[0]];

  const result = processTurn(gs, botIndex, drawFrom, visibleIndex ?? 0, safeDiscard);
  if (result.error) {
    return _botFallbackTurn(gs, botIndex, reasoning, previousVisible);
  }

  _observeAll(result.gameState, botIndex, previousVisible);
  return {
    gameState: result.gameState,
    action: 'turn',
    reasoning,
    botPlayerIndex: botIndex,
  };
}

// ─── Private helpers ─────────────────────────────────────────────────────────

/** Fallback when the bot's chosen move is invalid: draw from deck, discard highest card. */
function _botFallbackTurn(gs, botIndex, reasoning, previousVisible) {
  const hand = gs.players[botIndex].hand;
  let worstCard = hand[0];
  for (const c of hand) {
    if (RANK_VALUES[c.rank] > RANK_VALUES[worstCard.rank]) worstCard = c;
  }
  const result = processTurn(gs, botIndex, 'deck', undefined, [worstCard]);
  if (result.error) {
    // Truly stuck — advance turn manually and return current state
    const fallback = JSON.parse(JSON.stringify(gs));
    fallback.currentPlayer = _findNextActive(fallback.players, botIndex);
    return { gameState: fallback, action: 'turn', reasoning, botPlayerIndex: botIndex };
  }
  _observeAll(result.gameState, botIndex, previousVisible);
  return { gameState: result.gameState, action: 'turn', reasoning, botPlayerIndex: botIndex };
}

/** Returns the next active (non-eliminated) player index after fromIndex. */
function _findNextActive(players, fromIndex) {
  const len = players.length;
  for (let i = 1; i <= len; i++) {
    const idx = (fromIndex + i) % len;
    if (!players[idx].eliminated) return idx;
  }
  return fromIndex;
}

/** Let all other bots in the game observe what just happened. */
function _observeAll(gs, actingIndex, previousVisible) {
  try { observePlayerMove(gs, actingIndex, previousVisible); } catch (_) {}
  try { observeEasyBotMove(gs, actingIndex, previousVisible); } catch (_) {}
}

module.exports = { startOfflineGame, processOfflineAction, getBotMove };
