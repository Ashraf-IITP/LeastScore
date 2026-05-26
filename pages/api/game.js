// pages/api/game.js - API endpoints for game actions

let gameState = null;

export default (req, res) => {
  const { action, ...data } = req.body || {};
  if (req.method === 'POST' && action === 'new') {
    const { initializeGame } = require('../../lib/game');
    gameState = initializeGame();
    res.status(200).json({ gameState });
  } else if (req.method === 'GET' || (req.method === 'POST' && action === 'state')) {
    res.status(200).json({ gameState });
  } else if (req.method === 'POST' && action === 'turn') {
    const { playerId, drawFrom, visibleIndex, discardCards } = data;
    const { processTurn } = require('../../lib/turn');
    const result = processTurn(gameState, playerId, drawFrom, visibleIndex, discardCards);
    if (result.error) {
      res.status(400).json({ error: result.error });
    } else {
      gameState = result.gameState;
      res.status(200).json({ gameState });
    }
  } else if (req.method === 'POST' && action === 'declare') {
    const { playerId } = data;
    const { declare } = require('../../lib/round');
    const result = declare(gameState, playerId);
    if (result.error) {
      res.status(400).json({ error: result.error });
    } else {
      gameState = result.gameState;
      res.status(200).json({ gameState, score: result.score });
    }
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};