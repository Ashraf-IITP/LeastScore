const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const next = require('next');

// Load .env.local so server.js has the correct JWT_SECRET
const dev = process.env.NODE_ENV !== 'production';
require('@next/env').loadEnvConfig(process.cwd(), dev);

const { verifyJWT, parseUsername } = require('./lib/auth');
const { getPool } = require('./lib/db');
const { addOnline, removeOnline, getSocketIds, isOnline } = require('./lib/online');
const matchHistory = require('./lib/matchHistory');

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const port = process.env.PORT || 3000;
const HARD_BOT_NAMES = ['ChatJPT', 'Claud', 'Geminy', 'Grokk', 'CoPylot', 'Purplexity', 'MetaXAI'];
const EASY_BOT_NAMES = ['Nexus', 'Cortex', 'Athena', 'Neural', 'Nemesis', 'Obsidian', 'Nova'];
let lastHardBotName = null;
let lastEasyBotName = null;

// Function to create player-specific game state view
function getPlayerGameState(fullGameState, playerIndex) {
  const gameState = JSON.parse(JSON.stringify(fullGameState)); // Deep copy
  // Hide other players' hands for the given playerIndex
  gameState.players.forEach((p, idx) => {
    const shouldHide = idx !== playerIndex && !(fullGameState.isAIGame && p.isBot);
    if (shouldHide) {
      p.hand = [];
      if (p.lastDrawnCard) {
        if (p.lastDrawnFrom === 'deck') {
          p.lastDrawnCard = { hidden: true };
        }
      }
    }
  });
  if (gameState.deck) {
    gameState.deckCount = gameState.deck.length;
    delete gameState.deck;
  }
  return gameState;
}

function markEliminated(gameState, playerIndex, reason, room) {
  if (!gameState || !gameState.players || !gameState.players[playerIndex]) return;
  const player = gameState.players[playerIndex];
  const wasEliminated = player.eliminated && typeof player.eliminatedOrder === 'number';

  // If already eliminated but missing an order, still assign one so leaderboard can be stable.
  if (player.eliminated && typeof player.eliminatedOrder === 'number') return;

  if (!player.eliminated) player.eliminated = true;
  if (typeof gameState.eliminationSeq !== 'number') gameState.eliminationSeq = 0;
  gameState.eliminationSeq += 1;
  player.eliminatedOrder = gameState.eliminationSeq; // 1 = first eliminated (worst), higher = later eliminated (better)
  if (reason) player.eliminatedReason = reason;

  if (room && !wasEliminated && player.eliminated) {
    matchHistory.recordElimination(room, playerIndex, reason);
  }
}

function finalizeRecordedMatch(room, endReason) {
  if (!room || room.matchHistoryFinalized || !room.matchHistoryId) return;
  return matchHistory.finalizeMatch(room, endReason);
}

// If the eliminated player was the current turn holder (or current already points at an
// eliminated player), advance to the next active player.
// Must be called AFTER markEliminated so the player is already flagged as eliminated.
function advanceCurrentPlayerIfNeeded(gameState, eliminatedIndex) {
  if (!gameState || gameState.gameOver) return;

  const len = gameState.players.length;
  const cur = gameState.currentPlayer;
  const curPlayer = gameState.players[cur];
  const shouldAdvance =
    cur === eliminatedIndex || (curPlayer && curPlayer.eliminated);
  if (!shouldAdvance) return;

  const startFrom = curPlayer && curPlayer.eliminated ? cur : eliminatedIndex;
  for (let i = 1; i <= len; i++) {
    const candidate = (startFrom + i) % len;
    if (gameState.players[candidate] && !gameState.players[candidate].eliminated) {
      if (curPlayer && curPlayer.isThinking) curPlayer.isThinking = false;
      gameState.currentPlayer = candidate;
      return;
    }
  }
  // All players eliminated — game should end; leave as-is
}

/** Set once the socket handler defines executeBotTurn. */
let resumeBotTurnAfterElimination = null;

function advanceTurnAfterElimination(gameState, eliminatedIndex, roomId) {
  advanceCurrentPlayerIfNeeded(gameState, eliminatedIndex);
  if (roomId && resumeBotTurnAfterElimination) resumeBotTurnAfterElimination(roomId);
}

function shuffleArray(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createHardBotNamePicker() {
  const prepareNames = () => {
    const names = shuffleArray(HARD_BOT_NAMES);
    if (names.length > 1 && names[0] === lastHardBotName) {
      [names[0], names[1]] = [names[1], names[0]];
    }
    return names;
  };

  let names = prepareNames();
  let index = 0;

  return () => {
    if (index >= names.length) {
      names = prepareNames();
      index = 0;
    }
    const name = names[index++];
    lastHardBotName = name;
    return name;
  };
}

function createEasyBotNamePicker() {
  const prepareNames = () => {
    const names = shuffleArray(EASY_BOT_NAMES);
    if (names.length > 1 && names[0] === lastEasyBotName) {
      [names[0], names[1]] = [names[1], names[0]];
    }
    return names;
  };

  let names = prepareNames();
  let index = 0;

  return () => {
    if (index >= names.length) {
      names = prepareNames();
      index = 0;
    }
    const name = names[index++];
    lastEasyBotName = name;
    return name;
  };
}

nextApp.prepare().then(() => {
  const app = express();
  const server = http.createServer(app);
  const io = socketIo(server, {
    pingTimeout: 60000,
    pingInterval: 15000
  });
  global.io = io;

  // Repair orphaned matches that were not properly finalized (runs once at startup)
  (async () => {
    try {
      const repair = require('./lib/matchHistory').repairOrphanedMatches;
      if (repair) await repair();
    } catch (e) {
      console.error('Failed to run matchHistory.repairOrphanedMatches on startup:', e.message);
    }
  })();

  // Game state storage (in memory, for now)
  const games = {}; // roomId -> gameState
  const queue = []; // Deprecated: Array of { username, socketId, queueKey, guestSessionId? }
  let activeOnlineLobbyId = null;
  const socketToRoom = new Map(); // socketId -> roomId (to find game during guest expiry)
  const guestToSocketId = new Map(); // guestSessionId -> socketId (to find socket during expiry)
  const disconnectTimers = new Map(); // roomId -> Map(playerIndex -> timeoutHandle) for registered disconnects
  const eliminationPolls = new Map(); // roomId -> Map(targetIndex -> { targetIndex, votes: Map(playerIndex->'eliminate'|'wait'), phase })

  // Guest session expiry timers: guestSessionId -> timeoutHandle
  const guestTimers = new Map();

  // Party management: creatorUsername -> { members: [{username, userId, socketId}], invited: Set(username) }
  const parties = new Map();
  // Map of username -> creatorUsername (to find which party a user belongs to)
  const userToPartyCreator = new Map();

  // Helper: cancel pending expiry timer for a guest and refresh their DB row
  async function refreshGuestSession(guestSessionId, socketId) {
    console.log(`[GuestAuth] Refreshing guest session ${guestSessionId} for socket ${socketId}`);
    if (guestTimers.has(guestSessionId)) {
      clearTimeout(guestTimers.get(guestSessionId));
      guestTimers.delete(guestSessionId);
      console.log(`[GuestAuth] Cancelled pending expiry timer for guest ${guestSessionId}`);
    }
    try {
      const [result] = await getPool().query(
        'UPDATE guest_sessions SET socket_id = ?, expires_at = DATE_ADD(NOW(), INTERVAL 7 DAY) WHERE id = ?',
        [socketId, guestSessionId]
      );
      console.log(`[GuestAuth] DB update result: ${result.affectedRows} rows affected`);
    } catch (e) { console.error('refreshGuestSession:', e.message); }
  }

  // Helper: start 60-second expiry timer for a guest
  function startGuestExpiry(guestSessionId, guestSocketId, roomId) {
    console.log(`[GuestAuth] Starting 60s expiry for guest ${guestSessionId}`);
    if (guestTimers.has(guestSessionId)) return; // already counting

    // Store socketId for later lookup if needed, though we rely on args now
    if (guestSocketId) {
      guestToSocketId.set(guestSessionId, guestSocketId);
    }

    // Update DB so the MySQL event can clean it up if the Node server restarts
    getPool().query('UPDATE guest_sessions SET expires_at = DATE_ADD(NOW(), INTERVAL 60 SECOND) WHERE id = ?', [guestSessionId])
      .then(([res]) => console.log(`[GuestAuth] DB expires_at updated for 60s expiry: ${res.affectedRows} rows affected`))
      .catch(e => console.error('Failed to update expires_at:', e.message));

    const timer = setTimeout(async () => {
      guestTimers.delete(guestSessionId);
      guestToSocketId.delete(guestSessionId);

      try {
        if (roomId && guestSocketId) {
          const room = games[roomId];

          if (room && room.gameState && !room.gameState.gameOver) {
            // Game is still active - find guest player index and mark eliminated
            let guestPlayerIndex = room.players.findIndex(p => p.socketId === guestSocketId);
            if (guestPlayerIndex === -1 && guestSessionId) {
              // socketId may already be nulled after disconnect; fall back to stable guest session id
              guestPlayerIndex = room.players.findIndex(p => p.guestSessionId === guestSessionId);
            }
            if (guestPlayerIndex !== -1) {
              markEliminated(room.gameState, guestPlayerIndex, 'guest-expire', room);
              advanceTurnAfterElimination(room.gameState, guestPlayerIndex, roomId);
              const active = room.gameState.players.filter(p => !p.eliminated).length;
              if (active <= 1) {
                room.gameState.gameOver = true;
                if (active === 1) {
                  room.gameState.winner = room.gameState.players.findIndex(p => !p.eliminated);
                } else {
                  const rankedByScore = room.gameState.players
                    .map((player, idx) => ({ idx, score: player.score }))
                    .sort((a, b) => a.score - b.score);
                  room.gameState.winner = rankedByScore.length ? rankedByScore[0].idx : null;
                }
                finalizeRecordedMatch(room, 'guest_expired');
                room.players.forEach((pl, idx) => {
                  if (idx === guestPlayerIndex || !room.gameState.players[idx].eliminated) {
                    io.to(pl.socketId).emit('gameEnded', getPlayerGameState(room.gameState, idx), guestPlayerIndex);
                  }
                });
              } else {
                room.players.forEach((pl, idx) => {
                  if (idx === guestPlayerIndex || !room.gameState.players[idx].eliminated) {
                    io.to(pl.socketId).emit('playerEliminated', getPlayerGameState(room.gameState, idx), guestPlayerIndex, { reason: 'guest-expire' });
                  }
                });
              }
            }
          }
        }

        // Delete guest session from DB
        const [res] = await getPool().query('DELETE FROM guest_sessions WHERE id = ?', [guestSessionId]);
        console.log(`[GuestAuth] Guest session ${guestSessionId} expired and removed. DB rows affected: ${res.affectedRows}`);
      } catch (e) { console.error('guestExpiry:', e.message); }
    }, 60_000);
    guestTimers.set(guestSessionId, timer);
  }

  function ensureSoloParty(socket) {
    if (!socket.username || !socket.userId) return;

    // Only create if not already in a party
    if (!userToPartyCreator.has(socket.username)) {
      const creatorName = socket.username;
      parties.set(creatorName, {
        members: [{ username: socket.username, userId: socket.userId, socketId: socket.id }],
        invited: new Set()
      });
      userToPartyCreator.set(socket.username, creatorName);
      socket.emit('partyUpdate', { creator: creatorName, members: [{ username: socket.username }] });
    }
  }

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // ── Auth: track guest sessions via JWT from socket handshake ──
    let authToken = socket.handshake.auth?.token;
    console.log(`[GuestAuth] Socket connected. Auth token provided explicitly: ${!!authToken}`);
    if (!authToken) {
      const cookieHeader = socket.handshake.headers.cookie || socket.request?.headers?.cookie || '';
      const match = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]+)/);
      if (match) {
        authToken = decodeURIComponent(match[1]);
        console.log(`[GuestAuth] Found auth_token in HTTP cookies.`);
      }
    }

    if (authToken) {
      const decoded = verifyJWT(authToken);
      console.log(`[GuestAuth] JWT verified. User type: ${decoded?.type}, guestSessionId: ${decoded?.guestSessionId}, username: ${decoded?.username}`);
      if (decoded?.type === 'guest' && decoded.guestSessionId) {
        socket.guestSessionId = decoded.guestSessionId;
        refreshGuestSession(decoded.guestSessionId, socket.id);
      }
      if (decoded?.type === 'registered' && decoded.username) {
        socket.username = decoded.username;
        socket.userId = decoded.userId;
        socket.userType = decoded.type;
        const wasAlreadyOnline = isOnline(decoded.userId);
        addOnline(decoded.userId, socket.id);
        if (!wasAlreadyOnline) {
          io.emit('friendStatusUpdate', { userId: decoded.userId, online: true });
        }

        // Update party socket if user was in a party
        const creatorName = userToPartyCreator.get(decoded.username);
        if (creatorName) {
          const party = parties.get(creatorName);
          if (party) {
            const member = party.members.find(m => m.username === decoded.username);
            if (member) {
              member.socketId = socket.id;
              // Sync the reconnected user's local state
              socket.emit('partyUpdate', { creator: creatorName, members: party.members.map(m => ({ username: m.username })) });
            }
          }
        } else {
          // New connection with no party: ensure solo party
          ensureSoloParty(socket);
        }
      }
    } else {
      console.log(`[GuestAuth] No auth token found for socket ${socket.id}`);
    }

    // Immediately check if this socket is returning to an active match and prompt to resume/exit
    try {
      if (socket.guestSessionId || socket.username) {
        checkActiveReconnection(socket.username);
      }
    } catch (e) { console.error('active match check failed:', e.message); }

    // Helper: check if player is already in an active game and reconnect them
    function checkActiveReconnection(username) {
      if (!username && socket.username) {
        username = socket.username;
      }

      // First, if this socket is a guest, try to match by guestSessionId and prompt for resume
      if (socket.guestSessionId) {
        for (const [roomId, room] of Object.entries(games)) {
          if (room.gameState && !room.gameState.gameOver) {
            const gIndex = room.players.findIndex(p => p.guestSessionId === socket.guestSessionId);
            if (gIndex !== -1) {
              // If the guest previously chose to exit this match, don't prompt again
              if (room.players[gIndex].hasExited) continue;

              // Found an active game where this guest was participating. Do not auto-rejoin — prompt the client.
              socketToRoom.set(socket.id, roomId);
              socket.join(roomId);
              const otherUsernames = room.players.filter((p, idx) => idx !== gIndex).map(p => p.username || `Player ${idx + 1}`);
              socket.emit('activeMatchFound', { roomId, opponentUsername: otherUsernames.join(', ') || 'Opponent' });
              return true;
            }
          }
        }
      }

      if (username) {
        for (const [roomId, room] of Object.entries(games)) {
          if (room.gameState && !room.gameState.gameOver) {
            const pIndex = room.players.findIndex(p => p.username === username);
            if (pIndex !== -1) {
              if (room.players[pIndex].hasExited) continue;
              // If player was eliminated due to long disconnect, do not allow rejoin
              if (room.players[pIndex].blockedFromRejoin) {
                socket.emit('reconnectRejected', {
                  roomId,
                  reason: room.players[pIndex].blockedFromRejoinReason || 'eliminated',
                  message: room.players[pIndex].blockedFromRejoinMessage || 'You were eliminated while disconnected.',
                  finalState: getPlayerGameState(room.gameState, pIndex),
                  playerIndex: pIndex
                });
                return true;
              }

              const oldSocketId = room.players[pIndex].socketId;
              const stillConnected = oldSocketId && io.sockets.sockets.has(oldSocketId);
              if (stillConnected) {
                continue;
              }

              // Found an active game for this registered player. Do not auto-rejoin — prompt the client.
              socketToRoom.set(socket.id, roomId);
              socket.join(roomId);
              const otherUsernames = room.players.filter((p, idx) => idx !== pIndex).map(p => p.username || `Player ${idx + 1}`);
              socket.emit('activeMatchFound', { roomId, opponentUsername: otherUsernames.join(', ') || 'Opponent' });
              return true;
            }
          }
        }
      }
      return false;
    }

    function getQueueKey(usernameArg) {
      // Prefer stable identifiers from verified auth over client-provided values.
      if (socket.userType === 'registered') {
        return socket.userId ? `u:${socket.userId}` : (socket.username ? `name:${socket.username}` : (usernameArg ? `name:${usernameArg}` : `sock:${socket.id}`));
      }
      if (socket.guestSessionId) return `g:${socket.guestSessionId}`;
      return usernameArg ? `name:${usernameArg}` : `sock:${socket.id}`;
    }

    function resolveQueueUsername(usernameArg) {
      // Prevent a second tab from spoofing a different username while logged in.
      if (socket.userType === 'registered' && socket.username) return socket.username;
      return usernameArg;
    }

    function startOnlineLobbyMatch(roomId) {
      const room = games[roomId];
      if (!room) return;

      // Randomize turn order for online matches so join order does not decide first turn.
      room.players = shuffleArray(room.players);

      const { initializeGame } = require('./lib/game');
      room.gameState = initializeGame(room.players.length);
      room.gameState.players.forEach((p, idx) => {
        p.username = room.players[idx].username;
        if (room.players[idx].guestSessionId) {
          p.guestSessionId = room.players[idx].guestSessionId;
        }
      });

      matchHistory.startMatch(room, roomId).then(() => {
        room.players.forEach((player, index) => {
          if (player.socketId) {
            io.to(player.socketId).emit('joined', index);
            io.to(player.socketId).emit('gameStart', getPlayerGameState(room.gameState, index), index, roomId);
          }
        });
      });
    }

    // Guest/registered resume/exit handlers
    socket.on('resumeLastMatch', (roomId) => {
      const room = games[roomId];
      if (!room || !room.gameState) return;
      // Find player index by guestSessionId if present, else by registered username
      let pIndex = -1;
      if (socket.guestSessionId) {
        pIndex = room.players.findIndex(p => p.guestSessionId === socket.guestSessionId);
      } else {
        const currentUsername = socket.username || socket.handshake.auth?.username || socket.handshake.query?.username;
        pIndex = room.players.findIndex(p => p.username && currentUsername && p.username === currentUsername);
      }
      if (pIndex === -1) return;

      room.players[pIndex].socketId = socket.id;
      socket.join(roomId);
      socketToRoom.set(socket.id, roomId);

      // Cancel any pending guest expiry timers or elimination polls
      if (socket.guestSessionId && guestTimers.has(socket.guestSessionId)) {
        clearTimeout(guestTimers.get(socket.guestSessionId));
        guestTimers.delete(socket.guestSessionId);
      }
      // Cancel any pending registered disconnect timer for this specific player
      if (!socket.guestSessionId) {
        const timerMap = disconnectTimers.get(roomId);
        if (timerMap && timerMap.has(pIndex)) {
          clearTimeout(timerMap.get(pIndex));
          timerMap.delete(pIndex);
          if (timerMap.size === 0) disconnectTimers.delete(roomId);
        }
        if (room.gameState && room.gameState.players && room.gameState.players[pIndex]) {
          delete room.gameState.players[pIndex].disconnectExpiresAt;
        }
      }
      // Cancel poll for this specific reconnecting player
      const pollMap = eliminationPolls.get(roomId);
      if (pollMap && pollMap.has(pIndex)) {
        pollMap.delete(pIndex);
        if (pollMap.size === 0) eliminationPolls.delete(roomId);
        // Inform active (non-eliminated) opponents that poll is cancelled because target reconnected
        room.players.forEach((pl, idx) => {
          if (idx !== pIndex && pl.socketId && !room.gameState.players[idx].eliminated) {
            io.to(pl.socketId).emit('eliminationPollCancelled', pIndex);
          }
        });
      }

      // Send game state to reconnected player
      socket.emit('gameStart', getPlayerGameState(room.gameState, pIndex), pIndex, roomId);

      // Notify other active (non-eliminated) players
      room.players.forEach((pl, idx) => {
        if (idx !== pIndex && pl.socketId && !room.gameState.players[idx].eliminated) {
          io.to(pl.socketId).emit('opponentReconnected', socket.guestSessionId ? 'guest' : 'registered', pIndex);
        }
      });

      // If other elimination polls are running, this player is now an eligible voter again.
      refreshPollsForMembershipChange(roomId, pIndex);
    });

    socket.on('exitLastMatch', (roomId) => {
      const room = games[roomId];
      if (!room || !room.gameState) return;
      let pIndex = -1;
      if (socket.guestSessionId) {
        pIndex = room.players.findIndex(p => p.guestSessionId === socket.guestSessionId);
      } else {
        const currentUsername = socket.username || socket.handshake.auth?.username || socket.handshake.query?.username;
        pIndex = room.players.findIndex(p => p.username && currentUsername && p.username === currentUsername);
      }
      if (pIndex === -1) return;

      // Cancel any pending guest expiry timers or elimination polls
      if (socket.guestSessionId && guestTimers.has(socket.guestSessionId)) {
        clearTimeout(guestTimers.get(socket.guestSessionId));
        guestTimers.delete(socket.guestSessionId);
      }
      // Cancel any pending registered disconnect timer for this specific player
      if (!socket.guestSessionId) {
        const timerMap = disconnectTimers.get(roomId);
        if (timerMap && timerMap.has(pIndex)) {
          clearTimeout(timerMap.get(pIndex));
          timerMap.delete(pIndex);
          if (timerMap.size === 0) disconnectTimers.delete(roomId);
        }
        if (room.gameState && room.gameState.players && room.gameState.players[pIndex]) {
          delete room.gameState.players[pIndex].disconnectExpiresAt;
        }
      }
      // Cancel poll for this specific exiting player
      const pollMap2 = eliminationPolls.get(roomId);
      if (pollMap2 && pollMap2.has(pIndex)) {
        pollMap2.delete(pIndex);
        if (pollMap2.size === 0) eliminationPolls.delete(roomId);
      }

      // Notify active (non-eliminated) opponents that the player reconnected and chose to exit
      const reconnectedUserType = socket.guestSessionId ? 'guest' : 'registered';
      room.players.forEach((pl, idx) => {
        if (idx !== pIndex && pl.socketId && !room.gameState.players[idx].eliminated) {
          io.to(pl.socketId).emit('opponentReconnectedAndExited', reconnectedUserType);
        }
      });

      // Mark as eliminated due to exit
      markEliminated(room.gameState, pIndex, 'exit', room);
      advanceTurnAfterElimination(room.gameState, pIndex, roomId);
      room.players[pIndex].hasExited = true;
      const active = room.gameState.players.filter(p => !p.eliminated).length;
      if (active <= 1) {
        room.gameState.gameOver = true;
        if (active === 1) room.gameState.winner = room.gameState.players.findIndex(p => !p.eliminated);
        finalizeRecordedMatch(room, 'exit');
        room.players.forEach((pl, idx) => {
          if (pl.socketId && !room.gameState.players[idx].eliminated) io.to(pl.socketId).emit('gameEnded', getPlayerGameState(room.gameState, idx), pIndex);
        });
      } else {
        room.players.forEach((pl, idx) => {
          if (pl.socketId && (idx === pIndex || !room.gameState.players[idx].eliminated)) io.to(pl.socketId).emit('playerEliminated', getPlayerGameState(room.gameState, idx), pIndex, { reason: 'exit' });
        });
      }
      // Notify the exiting player (if connected) with final game state so they see the leaderboard
      socket.emit('gameEnded', getPlayerGameState(room.gameState, pIndex), pIndex);
    });

    socket.on('joinRoom', (roomId, username) => {
      if (checkActiveReconnection(username)) return;

      socket.join(roomId);
      socketToRoom.set(socket.id, roomId); // Track this socket's room
      if (!games[roomId]) {
        games[roomId] = { players: [], gameState: null };
      }
      const room = games[roomId];
      if (room.players.length < 2) {
        const playerEntry = { username: username, socketId: socket.id, queueKey: getQueueKey(username) };
        if (socket.guestSessionId) playerEntry.guestSessionId = socket.guestSessionId;
        if (socket.userType === 'registered' && socket.userId) playerEntry.userId = socket.userId;
        room.players.push(playerEntry);
        socket.emit('joined', room.players.length - 1); // player index
        if (room.players.length === 2) {
          // Start game
          const { initializeGame } = require('./lib/game');
          room.gameState = initializeGame();
          // Add usernames to players
          room.gameState.players.forEach((p, idx) => {
            p.username = room.players[idx].username;
            if (room.players[idx].guestSessionId) p.guestSessionId = room.players[idx].guestSessionId;
          });
          // Send filtered game state to each player
          matchHistory.startMatch(room, roomId).then(() => {
            room.players.forEach((player, index) => {
              io.to(player.socketId).emit('gameStart', getPlayerGameState(room.gameState, index), index, roomId);
            });
          });
        }
      } else {
        socket.emit('roomFull');
      }
    });

    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
      socketToRoom.delete(socket.id);
      console.log(`[Room] User ${socket.username || socket.id} left room ${roomId}`);
    });

    socket.on('createPassAndPlay', (playersList) => {
      const roomId = `local_${socket.id}`;
      games[roomId] = {
        id: roomId,
        localGame: true,
        players: playersList.map(name => ({
          username: name,
          socketId: socket.id
        }))
      };

      const { initializeGame } = require('./lib/game');
      games[roomId].gameState = initializeGame(playersList.length);

      games[roomId].players.forEach((p, idx) => {
        if (games[roomId].gameState.players[idx]) {
          games[roomId].gameState.players[idx].username = p.username;
        }
      });

      socket.join(roomId);
      // Send the FULL game state (do not use getPlayerGameState to hide cards)
      socket.emit('gameStart', games[roomId].gameState, 0, roomId);
    });

    // ── Play with AI ─────────────────────────────────────────────────────────
    socket.on('createAIGame', (data) => {
      const playerUsername = typeof data === 'string' ? data : data.username;
      const rawTargetPlayers = (typeof data === 'object' && data.targetPlayers) ? Number(data.targetPlayers) : 2;
      const targetPlayers = Math.max(2, Math.min(8, rawTargetPlayers || 2));
      const botDifficulty = (typeof data === 'object' && data.difficulty) ? data.difficulty : 'hard';
      const totalBots = targetPlayers - 1;

      let easyBotCount = 0;
      let hardBotCount = totalBots;
      if (botDifficulty === 'easy') {
        easyBotCount = totalBots;
        hardBotCount = 0;
      } else if (botDifficulty === 'both') {
        const requestedEasy = Number(data?.easyBotCount);
        const requestedHard = Number(data?.hardBotCount);
        easyBotCount = Number.isFinite(requestedEasy) ? requestedEasy : 0;
        hardBotCount = Number.isFinite(requestedHard) ? requestedHard : 0;
        if (
          easyBotCount < 0 ||
          hardBotCount < 0 ||
          easyBotCount + hardBotCount !== totalBots
        ) {
          socket.emit('error', `Invalid bot mix. Easy + Hard must equal ${totalBots}.`);
          return;
        }
      }

      const roomId = `ai_${socket.id}_${Date.now()}`;
      const { initializeGame } = require('./lib/game');
      const gameState = initializeGame(targetPlayers);

      // Build all players in a flat array, then shuffle for random turn order
      const humanPlayer = { username: playerUsername || username || 'Player', socketId: socket.id };
      if (socket.userType === 'registered' && socket.userId) {
        humanPlayer.userId = socket.userId;
        humanPlayer.queueKey = getQueueKey(playerUsername);
      } else if (socket.guestSessionId) {
        humanPlayer.guestSessionId = socket.guestSessionId;
        humanPlayer.queueKey = getQueueKey(playerUsername);
      }
      const allPlayers = [humanPlayer];
      const pickEasyBotName = createEasyBotNamePicker();
      const pickHardBotName = createHardBotNamePicker();
      for (let i = 0; i < totalBots; i++) {
        const difficulty = i < easyBotCount ? 'easy' : 'hard';
        const botName = difficulty === 'easy' ? pickEasyBotName() : pickHardBotName();
        allPlayers.push({ username: botName, socketId: null, isBot: true, difficulty });
      }

      // Shuffle to randomize turn order
      const shuffledPlayers = shuffleArray(allPlayers);

      // Apply shuffled order to gameState
      shuffledPlayers.forEach((p, idx) => {
        gameState.players[idx].username = p.username;
        if (p.isBot) {
          gameState.players[idx].isBot = true;
          gameState.players[idx].difficulty = p.difficulty;
        }
      });

      gameState.isAIGame = true;
      if (typeof data === 'object' && data.mode === 'play_along') {
        gameState.isPlayAlong = true;
      }

      // Find which index the human ended up at
      const humanPlayerIndex = shuffledPlayers.findIndex(p => !p.isBot);

      games[roomId] = {
        id: roomId,
        isAIGame: true,
        isPlayAlong: typeof data === 'object' && data.mode === 'play_along',
        humanPlayerIndex,
        players: shuffledPlayers,
        gameState
      };

      socketToRoom.set(socket.id, roomId);
      socket.join(roomId);

      matchHistory.startMatch(games[roomId], roomId).then(() => {
        socket.emit('gameStart', gameState, humanPlayerIndex, roomId);
      });

      // In AI mode, we automatically start the bot turn if a bot goes first
      const firstIndex = gameState.currentPlayer;
      if (gameState.players[firstIndex] && gameState.players[firstIndex].isBot) {
        setTimeout(() => executeBotTurn(roomId), 900);
      }
    });



    function emitBotRoomUpdate(room, payload) {
      room.players.forEach((player, index) => {
        if (!player.socketId || player.isBot) return;
        if (room.gameState.players[index] && !room.gameState.players[index].eliminated) {
          io.to(player.socketId).emit('gameUpdate', getPlayerGameState(room.gameState, index), payload);
        }
      });
    }

    function endLobbyIfOnlyBotsRemain(roomId) {
      const room = games[roomId];
      if (!room || (!room.hasLobbyBots && !room.isAIGame) || !room.gameState || room.gameState.gameOver) return false;

      const activeIndexes = room.gameState.players
        .map((p, idx) => ({ idx, eliminated: p.eliminated }))
        .filter(p => !p.eliminated)
        .map(p => p.idx);

      if (activeIndexes.length === 0) return false;

      const hasActiveHuman = activeIndexes.some(idx => !room.players[idx]?.isBot);
      const activeBotIndexes = activeIndexes.filter(idx => room.players[idx]?.isBot);
      if (hasActiveHuman || activeBotIndexes.length === 0) return false;

      const winnerByBotScore = activeBotIndexes
        .map(idx => ({ idx, score: room.gameState.players[idx].score }))
        .sort((a, b) => a.score - b.score)[0];

      room.gameState.gameOver = true;
      room.gameState.winner = winnerByBotScore ? winnerByBotScore.idx : activeBotIndexes[0];

      matchHistory.recordBotsOnlyEnd(room);

      if (room.isAIGame) {
        const humanIdx = room.humanPlayerIndex !== undefined
          ? room.humanPlayerIndex
          : room.players.findIndex((p) => p.socketId && !p.isBot);
        const hSock = humanIdx >= 0 ? room.players[humanIdx]?.socketId : null;
        if (hSock && socketToRoom.get(hSock) === roomId) {
          io.to(hSock).emit('gameEnded', room.gameState, room.gameState.winner);
        }
      } else {
        room.players.forEach((pl, idx) => {
          if (pl.socketId && socketToRoom.get(pl.socketId) === roomId) {
            io.to(pl.socketId).emit('gameEnded', getPlayerGameState(room.gameState, idx), room.gameState.winner);
          }
        });
      }
      return true;
    }

    function scheduleBotTurnIfNeeded(roomId) {
      const room = games[roomId];
      if (!room || !room.gameState || room.gameState.gameOver) return;
      if (!room.hasLobbyBots && !room.isAIGame) return;

      const idx = room.gameState.currentPlayer;
      if (!room.players[idx] || !room.players[idx].isBot) return;
      const botGs = room.gameState.players[idx];
      if (!botGs || botGs.eliminated || botGs.isThinking) return;

      setTimeout(() => executeBotTurn(roomId), 900);
    }
    resumeBotTurnAfterElimination = scheduleBotTurnIfNeeded;

    // Execute the bot's turn in an AI game
    function executeBotTurn(roomId) {
      const room = games[roomId];
      if (!room || !room.gameState || (!room.isAIGame && !room.hasLobbyBots)) return;
      if (room.gameState.gameOver) return;

      const botIndex = room.gameState.currentPlayer;
      // Guard: only run if the current player is actually a bot
      if (!room.players[botIndex] || !room.players[botIndex].isBot) return;

      const gs = room.gameState;
      const botPlayer = gs.players[botIndex];
      if (!botPlayer || botPlayer.eliminated) return;

      // If already thinking, don't trigger again
      if (botPlayer.isThinking) return;

      // Set thinking flag to true
      botPlayer.isThinking = true;

      // Helper: find the human socket for AI games
      const getHumanSocketId = (r) => {
        if (r.humanPlayerIndex !== undefined) return r.players[r.humanPlayerIndex]?.socketId;
        const hp = r.players.find(p => p.socketId && !p.isBot);
        return hp ? hp.socketId : null;
      };

      // Broadcast the state immediately so client shows "Thinking" UI
      if (room.isAIGame) {
        const hSock = getHumanSocketId(room);
        if (hSock) io.to(hSock).emit('gameUpdate', gs);
      } else {
        emitBotRoomUpdate(room);
      }

      // Delay by 5 seconds
      setTimeout(() => {
        // Re-verify room/game state after 5 seconds
        const currentRoom = games[roomId];
        if (!currentRoom || !currentRoom.gameState || currentRoom.gameState.gameOver) return;

        const currentGs = currentRoom.gameState;
        const currentBotIndex = currentGs.currentPlayer;
        const currentBotPlayer = currentGs.players[botIndex];
        if (!currentBotPlayer) return;

        if (currentBotIndex !== botIndex || currentBotPlayer.eliminated) {
          currentBotPlayer.isThinking = false;
          scheduleBotTurnIfNeeded(roomId);
          return;
        }

        // Clear the thinking flag
        currentBotPlayer.isThinking = false;

        // Execute actual bot decision and turn
        const { makeBotDecision, recordSeenCards, observePlayerMove } = require('./lib/bot');
        const { makeEasyBotDecision, observeEasyBotMove } = require('./lib/easyBot');
        const { processTurn } = require('./lib/turn');
        const { declare } = require('./lib/round');

        const isEasy = currentBotPlayer.difficulty === 'easy';

        // Retrieve pending observations for this specific bot
        const observation = currentBotPlayer.botState && currentBotPlayer.botState.pendingObservations ? [...currentBotPlayer.botState.pendingObservations] : [];
        if (currentBotPlayer.botState) {
          currentBotPlayer.botState.pendingObservations = []; // clear them
        }

        // Capture previous visible cards for bot-observing-bot logic
        const prevVisible = (currentGs.visibleCard || []).map(c => ({ ...c }));

        const decision = isEasy ? makeEasyBotDecision(currentGs, botIndex) : makeBotDecision(currentGs, botIndex);
        const decisionReasoning = [...(decision.decisionReasoning || [])];

        const hSocket = getHumanSocketId(currentRoom);

        const sendReasoning = () => {
          if (!currentRoom.isAIGame || !hSocket) return;
          io.to(hSocket).emit('botReasoning', { botIndex, observation, decision: decisionReasoning });
        };

        if (decision.action === 'declare') {
          const result = declare(currentGs, botIndex);
          if (result.success) {
            const declaredWon = result.score === 0;
            if (result.newlyEliminated && result.newlyEliminated.length) {
              result.newlyEliminated.forEach((elimIdx) => {
                markEliminated(currentGs, elimIdx, 'score', currentRoom);
                advanceTurnAfterElimination(currentGs, elimIdx, roomId);
              });
            }
            matchHistory.recordDeclare(currentRoom, botIndex, {
              declaredWon,
              score: result.score,
              roundSummary: result.roundSummary,
            });
            if (currentGs.gameOver) finalizeRecordedMatch(currentRoom, 'declare');
            if (endLobbyIfOnlyBotsRemain(roomId)) return;
            sendReasoning();
            if (currentRoom.isAIGame) {
              if (hSocket) io.to(hSocket).emit('gameUpdate', currentGs, {
                declaredPlayerIndex: botIndex, declaredWon, score: result.score, gameOver: !!currentGs.gameOver,
                roundSummary: result.roundSummary
              });
            } else {
              emitBotRoomUpdate(currentRoom, {
                declaredPlayerIndex: botIndex, declaredWon, score: result.score, gameOver: !!currentGs.gameOver,
                roundSummary: result.roundSummary
              });
            }
            // After declare, if next player is a bot, auto-trigger only in lobby
            if (!currentGs.gameOver) {
              const next = currentGs.currentPlayer;
              if (currentRoom.players[next] && currentRoom.players[next].isBot && !currentGs.players[next].eliminated) {
                if (!currentRoom.isAIGame) {
                  setTimeout(() => executeBotTurn(roomId), 1500);
                } else {
                  setTimeout(() => executeBotTurn(roomId), 1500);
                }
              }
            }
          }
          return;
        }

        if (decision.drawFrom === 'deck') {
          const result = processTurn(currentGs, botIndex, 'deck', undefined, decision.discardCards);
          if (result.success) {
            matchHistory.recordTurn(currentRoom, botIndex, 'deck', undefined, decision.discardCards);
            if (currentGs.players[botIndex].botState && !isEasy) recordSeenCards(currentGs.players[botIndex].botState, currentGs.visibleCard || []);
            observePlayerMove(currentGs, botIndex, prevVisible);
            observeEasyBotMove(currentGs, botIndex, prevVisible);
            if (endLobbyIfOnlyBotsRemain(roomId)) return;
            sendReasoning();
            if (currentRoom.isAIGame && hSocket) io.to(hSocket).emit('gameUpdate', currentGs);
            else if (!currentRoom.isAIGame) emitBotRoomUpdate(currentRoom);
          }
        } else {
          const result = processTurn(currentGs, botIndex, 'visible', decision.visibleIndex || 0, decision.discardCards);
          if (result.success) {
            matchHistory.recordTurn(currentRoom, botIndex, 'visible', decision.visibleIndex || 0, decision.discardCards);
            if (currentGs.players[botIndex].botState && !isEasy) recordSeenCards(currentGs.players[botIndex].botState, currentGs.visibleCard || []);
            observePlayerMove(currentGs, botIndex, prevVisible);
            observeEasyBotMove(currentGs, botIndex, prevVisible);
            if (endLobbyIfOnlyBotsRemain(roomId)) return;
            sendReasoning();
            if (currentRoom.isAIGame && hSocket) io.to(hSocket).emit('gameUpdate', currentGs);
            else if (!currentRoom.isAIGame) emitBotRoomUpdate(currentRoom);
          }
        }

        // Auto-play consecutive bot turns
        if (!currentGs.gameOver) {
          const next = currentGs.currentPlayer;
          if (currentRoom.players[next] && currentRoom.players[next].isBot && !currentGs.players[next].eliminated) {
            setTimeout(() => executeBotTurn(roomId), 900);
          }
        }
      }, 5000);
    }

    socket.on('joinQueue', (username) => {
      if (checkActiveReconnection(username)) return;

      const queueKey = getQueueKey(username);
      const resolvedUsername = resolveQueueUsername(username);

      const currentRoomId = socketToRoom.get(socket.id);
      if (currentRoomId && currentRoomId.startsWith('online_')) {
        socket.emit('error', 'You are already in an online lobby.');
        return;
      }

      if (!activeOnlineLobbyId || !games[activeOnlineLobbyId] || games[activeOnlineLobbyId].players.length >= 8) {
        activeOnlineLobbyId = 'online_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        games[activeOnlineLobbyId] = { players: [], gameState: null, startVotes: new Set() };
      }

      const lobbyId = activeOnlineLobbyId;
      const lobby = games[lobbyId];

      if (lobby.players.some(p => p.queueKey === queueKey)) {
        socket.emit('error', 'You are already in this lobby.');
        return;
      }

      const playerObj = { username: resolvedUsername, socketId: socket.id, queueKey };
      if (socket.guestSessionId) playerObj.guestSessionId = socket.guestSessionId;
      if (socket.userType === 'registered' && socket.userId) playerObj.userId = socket.userId;

      lobby.players.push(playerObj);
      socketToRoom.set(socket.id, lobbyId);
      socket.join(lobbyId);

      socket.emit('queueJoined');

      const playerUsernames = lobby.players.map(p => p.username);
      io.to(lobbyId).emit('onlineLobbyUpdate', playerUsernames, lobby.startVotes.size);

      if (lobby.players.length === 8) {
        startOnlineLobbyMatch(lobbyId);
        if (activeOnlineLobbyId === lobbyId) activeOnlineLobbyId = null;
      }
    });

    socket.on('leaveQueue', () => {
      const roomId = socketToRoom.get(socket.id);
      if (roomId && roomId.startsWith('online_') && games[roomId] && !games[roomId].gameState) {
        const room = games[roomId];
        room.players = room.players.filter(p => p.socketId !== socket.id);
        if (room.startVotes) room.startVotes.delete(socket.id);
        socketToRoom.delete(socket.id);
        socket.leave(roomId);

        if (room.players.length === 0) {
          delete games[roomId];
          if (activeOnlineLobbyId === roomId) activeOnlineLobbyId = null;
        } else {
          if (room.players.length === 1 && room.startVotes) room.startVotes.clear();
          const playerUsernames = room.players.map(p => p.username);
          io.to(roomId).emit('onlineLobbyUpdate', playerUsernames, room.startVotes ? room.startVotes.size : 0);
        }
      }
    });

    socket.on('voteStartOnlineLobby', (voteStatus) => {
      const roomId = socketToRoom.get(socket.id);
      if (!roomId || !roomId.startsWith('online_')) return;
      const room = games[roomId];
      if (!room || room.gameState) return;

      if (!room.startVotes) room.startVotes = new Set();

      if (voteStatus) {
        room.startVotes.add(socket.id);
      } else {
        room.startVotes.delete(socket.id);
      }

      const startVotes = room.startVotes.size;
      const playerUsernames = room.players.map(p => p.username);
      io.to(roomId).emit('onlineLobbyUpdate', playerUsernames, startVotes);

      const threshold = Math.floor(room.players.length / 2) + 1;
      if (room.players.length > 1 && startVotes >= threshold) {
        startOnlineLobbyMatch(roomId);
        if (activeOnlineLobbyId === roomId) activeOnlineLobbyId = null;
      }
    });

    socket.on('createLobby', async (payload, targetPlayers) => {
      let username = payload;
      let requestedPlayers = targetPlayers;
      let partyMembers = [];

      if (payload && typeof payload === 'object') {
        username = payload.username;
        requestedPlayers = payload.targetPlayers;
        if (Array.isArray(payload.partyMembers)) {
          partyMembers = payload.partyMembers.map(String).map(p => p.trim()).filter(Boolean);
        }
      }

      if (checkActiveReconnection(username)) return;

      const creatorUsername = resolveQueueUsername(username);
      const uniquePartyUsers = [...new Set(partyMembers.filter(name => name !== creatorUsername))];
      const invitedPlayers = [];
      let effectiveTargetPlayers = Number(requestedPlayers) || 2;

      if (uniquePartyUsers.length > 0) {
        if (socket.userType !== 'registered') {
          socket.emit('error', 'Party play requires a registered account.');
          return;
        }

        const pool = getPool();
        for (const partyUsername of uniquePartyUsers) {
          const parsed = parseUsername(partyUsername);
          if (!parsed) {
            socket.emit('error', `Invalid friend username: ${partyUsername}`);
            return;
          }
          const [rows] = await pool.query(
            'SELECT id, display_name, tag FROM users WHERE display_name = ? AND tag = ?',
            [parsed.name, parsed.tag]
          );
          const friendUser = rows[0];
          if (!friendUser) {
            socket.emit('error', `Friend ${partyUsername} is not available for party play.`);
            return;
          }

          const friendSocketIds = getSocketIds(friendUser.id);
          if (!friendSocketIds || friendSocketIds.size === 0) {
            socket.emit('error', `Friend ${partyUsername} is offline.`);
            return;
          }

          const friendSocketId = [...friendSocketIds][0];
          const currentRoomId = socketToRoom.get(friendSocketId);
          if (currentRoomId) {
            const room = games[currentRoomId];
            // Only block if the room exists and is NOT a finished game
            if (room && (!room.gameState || !room.gameState.gameOver)) {
              socket.emit('error', `Friend ${partyUsername} is already in another match or lobby.`);
              return;
            }
          }

          invitedPlayers.push({ username: `${friendUser.display_name}#${friendUser.tag}`, socketId: friendSocketId, userId: friendUser.id });
        }

        effectiveTargetPlayers = Math.max(effectiveTargetPlayers, invitedPlayers.length + 1);
      }

      const tp = Math.max(2, Math.min(8, effectiveTargetPlayers));
      const roomId = 'lobby_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      games[roomId] = { players: [], gameState: null, targetPlayers: tp, creatorSocketId: socket.id };

      socket.join(roomId);
      socketToRoom.set(socket.id, roomId);
      const entry = { username: creatorUsername, socketId: socket.id, queueKey: getQueueKey(creatorUsername) };
      if (socket.guestSessionId) entry.guestSessionId = socket.guestSessionId;
      if (socket.userType === 'registered' && socket.userId) entry.userId = socket.userId;
      games[roomId].players.push(entry);

      socket.emit('lobbyCreated', roomId, 1, tp, [creatorUsername]);

      if (invitedPlayers.length > 0) {
        for (const friend of invitedPlayers) {
          const friendSocket = io.sockets.sockets.get(friend.socketId);
          if (!friendSocket) continue;
          friendSocket.join(roomId);
          socketToRoom.set(friend.socketId, roomId);
          const friendEntry = { username: friend.username, socketId: friend.socketId, userId: friend.userId, queueKey: friend.userId ? `u:${friend.userId}` : getQueueKey(friend.username) };
          games[roomId].players.push(friendEntry);
          io.to(friend.socketId).emit('partyLobbyJoined', {
            roomId,
            currentPlayers: games[roomId].players.length,
            targetPlayers: games[roomId].targetPlayers,
            playerUsernames: games[roomId].players.map(p => p.username),
          });
        }

        const playerUsernames = games[roomId].players.map(p => p.username);
        io.to(roomId).emit('lobbyUpdate', games[roomId].players.length, games[roomId].targetPlayers, playerUsernames);
        if (games[roomId].players.length === games[roomId].targetPlayers) {
          io.to(roomId).emit('lobbyReady', games[roomId].players.length, games[roomId].targetPlayers, playerUsernames);
        }
      }
    });

    socket.on('joinLobby', (roomId, username) => {
      if (checkActiveReconnection(username)) return;

      if (!games[roomId]) {
        socket.emit('error', 'Lobby not found');
        return;
      }

      const room = games[roomId];
      if (room.players.length >= (room.targetPlayers || 2)) {
        socket.emit('roomFull');
        return;
      }

      const resolvedUsername = resolveQueueUsername(username);
      const joiningKey = getQueueKey(resolvedUsername);
      const alreadyInLobby = room.players.some(p => p.queueKey && p.queueKey === joiningKey);
      if (alreadyInLobby) {
        socket.emit('error', 'You are already in this lobby (possibly from another tab).');
        return;
      }

      socket.join(roomId);
      socketToRoom.set(socket.id, roomId); // Track this socket's room
      const entry = { username: resolvedUsername, socketId: socket.id, queueKey: joiningKey };
      if (socket.guestSessionId) entry.guestSessionId = socket.guestSessionId;
      if (socket.userType === 'registered' && socket.userId) entry.userId = socket.userId;
      room.players.push(entry);
      socket.emit('joined', room.players.length - 1);

      const playerUsernames = room.players.map(p => p.username);
      // Notify lobby occupants about updated counts and player names
      io.to(roomId).emit('lobbyUpdate', room.players.length, room.targetPlayers || 2, playerUsernames);

      if (room.players.length === (room.targetPlayers || 2)) {
        io.to(roomId).emit('lobbyReady', room.players.length, room.targetPlayers || 2, playerUsernames);
      }
    });

    socket.on('cancelLobby', (roomId) => {
      if (games[roomId]) {
        // Notify other players in the lobby that it's cancelled
        const room = games[roomId];
        room.players.forEach(player => {
          if (player.socketId !== socket.id) {
            io.to(player.socketId).emit('lobbyCancelled');
          }
        });
        // Remove the lobby
        delete games[roomId];
      }
    });

    socket.on('leaveLobby', (roomId) => {
      const room = games[roomId];
      if (!room) return;

      const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
      if (playerIndex === -1) return;

      const isCreator = (socket.id === room.creatorSocketId);

      if (isCreator) {
        // If creator leaves, everyone else should also leave the lobby
        room.players.forEach(p => {
          const s = io.sockets.sockets.get(p.socketId);
          if (s) {
            s.leave(roomId);
            s.emit('lobbyCancelled'); // Notify others that lobby is gone
          }
          socketToRoom.delete(p.socketId);
        });
        delete games[roomId];
        console.log(`[Lobby] Creator left. Lobby ${roomId} dissolved.`);
        return;
      }

      // Remove only this player from lobby
      room.players.splice(playerIndex, 1);
      socket.leave(roomId);
      socketToRoom.delete(socket.id);

      // If lobby is now empty, delete it
      if (room.players.length === 0) {
        delete games[roomId];
        return;
      }

      // Notify remaining players about the departure with updated player list
      const playerUsernames = room.players.map(p => p.username);
      io.to(roomId).emit('lobbyUpdate', room.players.length, room.targetPlayers || 2, playerUsernames);
    });

    // ── Party Management ─────────────────────────────────────────────────────
    socket.on('sendPartyInvite', async (targetUsername) => {
      if (socket.userType !== 'registered' || !socket.username) {
        socket.emit('error', 'Only registered users can use party features.');
        return;
      }

      const parsed = parseUsername(targetUsername);
      if (!parsed) {
        socket.emit('error', 'Invalid username format.');
        return;
      }

      // Check if target is online
      const [rows] = await getPool().query('SELECT id FROM users WHERE display_name = ? AND tag = ?', [parsed.name, parsed.tag]);
      const targetUser = rows[0];
      if (!targetUser) {
        socket.emit('error', 'User not found.');
        return;
      }

      const targetSocketIds = getSocketIds(targetUser.id);
      if (!targetSocketIds || targetSocketIds.size === 0) {
        socket.emit('error', 'User is offline.');
        return;
      }

      const targetSocketId = [...targetSocketIds][0];

      // Don't invite yourself
      if (targetSocketId === socket.id) {
        socket.emit('error', 'You cannot invite yourself.');
        return;
      }

      // If sender is not in a party, create one where they are the creator
      let creatorName = userToPartyCreator.get(socket.username);
      if (!creatorName) {
        creatorName = socket.username;
        parties.set(creatorName, {
          members: [{ username: socket.username, userId: socket.userId, socketId: socket.id }],
          invited: new Set()
        });
        userToPartyCreator.set(socket.username, creatorName);
        // Initial update for the creator
        socket.emit('partyUpdate', { creator: creatorName, members: [{ username: socket.username }] });
      }
      // Anyone in the party can invite friends

      const party = parties.get(creatorName);
      if (party.members.length >= 8) {
        socket.emit('error', 'Party is full (max 8 members).');
        return;
      }

      if (party.members.some(m => m.username === targetUsername)) {
        socket.emit('error', 'User is already in your party.');
        return;
      }

      party.invited.add(targetUsername);
      io.to(targetSocketId).emit('partyInviteReceived', { from: socket.username, creator: creatorName });
      socket.emit('info', `Invitation sent to ${targetUsername}`);
    });

    socket.on('acceptPartyInvite', (inviterUsername) => {
      if (!socket.username) return;

      const party = parties.get(inviterUsername);
      if (!party || !party.invited.has(socket.username)) {
        socket.emit('error', 'Invitation no longer valid.');
        return;
      }

      if (party.members.length >= 8) {
        socket.emit('error', 'Party is full.');
        return;
      }

      // If user was already in another party, leave it
      const oldCreator = userToPartyCreator.get(socket.username);
      if (oldCreator) {
        const oldParty = parties.get(oldCreator);
        if (oldParty) {
          oldParty.members = oldParty.members.filter(m => m.username !== socket.username);
          userToPartyCreator.delete(socket.username);

          if (oldParty.members.length === 0) {
            parties.delete(oldCreator);
          } else {
            let newOldCreator = oldCreator;
            if (oldCreator === socket.username) {
              newOldCreator = oldParty.members[0].username;
              parties.delete(oldCreator);
              parties.set(newOldCreator, oldParty);
              oldParty.members.forEach(m => userToPartyCreator.set(m.username, newOldCreator));
            }
            const oldMemberList = oldParty.members.map(mem => ({ username: mem.username }));
            oldParty.members.forEach(m => {
              io.to(m.socketId).emit('partyUpdate', { creator: newOldCreator, members: oldMemberList });
            });
          }
        }
      }

      party.invited.delete(socket.username);
      party.members.push({ username: socket.username, userId: socket.userId, socketId: socket.id });
      userToPartyCreator.set(socket.username, inviterUsername);

      // Broadcast update to all party members
      const memberList = party.members.map(m => ({ username: m.username }));
      party.members.forEach(m => {
        io.to(m.socketId).emit('partyUpdate', { creator: inviterUsername, members: memberList });
      });
    });

    socket.on('leaveParty', () => {
      if (!socket.username) return;
      const creatorName = userToPartyCreator.get(socket.username);
      if (!creatorName) return;

      const party = parties.get(creatorName);
      if (!party) return;

      party.members = party.members.filter(m => m.username !== socket.username);
      userToPartyCreator.delete(socket.username);
      socket.emit('partyUpdate', { creator: null, members: [] });

      if (party.members.length === 0) {
        parties.delete(creatorName);
      } else {
        let newCreatorName = creatorName;
        if (creatorName === socket.username) {
          newCreatorName = party.members[0].username;
          parties.delete(creatorName);
          parties.set(newCreatorName, party);
          party.members.forEach(m => userToPartyCreator.set(m.username, newCreatorName));
        }

        const memberList = party.members.map(m => ({ username: m.username }));
        party.members.forEach(m => {
          io.to(m.socketId).emit('partyUpdate', { creator: newCreatorName, members: memberList });
        });
      }

      // Ensure the leaving player is put into a solo party
      ensureSoloParty(socket);
    });

    socket.on('kickPartyMember', (targetUsername) => {
      if (!socket.username) return;
      const creatorName = userToPartyCreator.get(socket.username);
      if (!creatorName || creatorName !== socket.username) {
        socket.emit('error', 'Only the party creator can kick members.');
        return;
      }

      const party = parties.get(creatorName);
      if (!party) return;

      const targetMember = party.members.find(m => m.username === targetUsername);
      if (!targetMember) return;

      party.members = party.members.filter(m => m.username !== targetUsername);
      userToPartyCreator.delete(targetUsername);

      io.to(targetMember.socketId).emit('partyUpdate', { creator: null, members: [] });
      io.to(targetMember.socketId).emit('error', 'You have been removed from the party.');

      const memberList = party.members.map(m => ({ username: m.username }));
      party.members.forEach(m => {
        io.to(m.socketId).emit('partyUpdate', { creator: creatorName, members: memberList });
      });

      // Kicked member gets a solo party (find their socket if online)
      const targetSocketIds = getSocketIds(targetMember.userId);
      if (targetSocketIds && targetSocketIds.size > 0) {
        const targetSocketId = [...targetSocketIds][0];
        const targetSocket = io.sockets.sockets.get(targetSocketId);
        if (targetSocket) {
          ensureSoloParty(targetSocket);
        }
      }
    });

    socket.on('startLobbyGame', (roomId, options = {}) => {
      const room = games[roomId];
      if (!room) {
        socket.emit('error', 'Lobby not found');
        return;
      }
      if (socket.id !== room.creatorSocketId) {
        socket.emit('error', 'Only the lobby creator can start the match.');
        return;
      }
      const playerCount = room.players.length;
      const targetPlayers = room.targetPlayers || 2;
      const allowPartialStart = !!(options && options.allowPartialStart);
      const includeBots = !!(options && options.includeBots);

      if (playerCount < 2) {
        socket.emit('error', 'At least 2 players are required to start.');
        return;
      }

      if (playerCount !== targetPlayers && !allowPartialStart && !includeBots) {
        socket.emit('error', 'Cannot start match until all players have joined.');
        return;
      }

      const vacancies = Math.max(0, targetPlayers - playerCount);
      let easyBotCount = 0;
      let hardBotCount = 0;
      if (includeBots) {
        easyBotCount = Number(options.easyBotCount);
        hardBotCount = Number(options.hardBotCount);
        if (
          !Number.isFinite(easyBotCount) ||
          !Number.isFinite(hardBotCount) ||
          easyBotCount < 0 ||
          hardBotCount < 0 ||
          easyBotCount + hardBotCount !== vacancies
        ) {
          socket.emit('error', `Invalid bot mix. Easy + Hard must equal ${vacancies}.`);
          return;
        }
      }

      const finalPlayerCount = includeBots
        ? targetPlayers
        : ((allowPartialStart && playerCount < targetPlayers) ? playerCount : targetPlayers);
      room.targetPlayers = finalPlayerCount;

      const { initializeGame } = require('./lib/game');
      room.gameState = initializeGame(finalPlayerCount);
      const allParticipants = [...room.players];
      if (includeBots) {
        const pickEasyBotName = createEasyBotNamePicker();
        const pickHardBotName = createHardBotNamePicker();
        for (let i = 0; i < easyBotCount; i++) {
          allParticipants.push({ username: pickEasyBotName(), socketId: null, isBot: true, difficulty: 'easy' });
        }
        for (let i = 0; i < hardBotCount; i++) {
          allParticipants.push({ username: pickHardBotName(), socketId: null, isBot: true, difficulty: 'hard' });
        }
      }

      const finalPlayers = shuffleArray(allParticipants);
      room.players = finalPlayers;
      room.hasLobbyBots = includeBots;
      room.gameState.players.forEach((p, idx) => {
        p.username = room.players[idx].username;
        if (room.players[idx].isBot) {
          p.isBot = true;
          p.difficulty = room.players[idx].difficulty || 'hard';
        }
      });

      matchHistory.startMatch(room, roomId).then(() => {
        room.players.forEach((player, index) => {
          if (player.socketId) {
            io.to(player.socketId).emit('gameStart', getPlayerGameState(room.gameState, index), index, roomId);
          }
        });

        const firstIndex = room.gameState.currentPlayer;
        if (room.hasLobbyBots && room.players[firstIndex] && room.players[firstIndex].isBot) {
          setTimeout(() => executeBotTurn(roomId), 900);
        }
      });
    });

    socket.on('makeTurn', (roomId, data) => {
      const room = games[roomId];
      if (!room || !room.gameState) return;
      const playerIndex = room.localGame ? data.playerId : (room.isAIGame ? (room.humanPlayerIndex !== undefined ? room.humanPlayerIndex : 0) : room.players.findIndex(p => p.socketId === socket.id));
      if (!room.localGame && !room.isAIGame && playerIndex !== room.gameState.currentPlayer) return;
      if (room.isAIGame && playerIndex !== room.gameState.currentPlayer) return;
      if (room.localGame && room.players[0].socketId !== socket.id) return;
      if (room.localGame && playerIndex !== room.gameState.currentPlayer) return;

      // Capture previous visible cards for AI opponent observation
      const prevVisible = (room.isAIGame || room.hasLobbyBots) ? (room.gameState.visibleCard || []).map(c => ({ ...c })) : null;

      const { processTurn } = require('./lib/turn');
      const result = processTurn(room.gameState, data.playerId, data.drawFrom, data.visibleIndex, data.discardCards);
      if (result.success) {
        matchHistory.recordTurn(room, data.playerId, data.drawFrom, data.visibleIndex, data.discardCards);
        if (room.isAIGame || room.hasLobbyBots) {
          // AI game: send full state (bot cards visible for testing)
          const { observePlayerMove } = require('./lib/bot');
          const { observeEasyBotMove } = require('./lib/easyBot');
          // Run both observers once per human move to avoid duplicate observations.
          observePlayerMove(room.gameState, playerIndex, prevVisible);
          observeEasyBotMove(room.gameState, playerIndex, prevVisible);

          if (room.isAIGame) {
            socket.emit('gameUpdate', room.gameState);
            const nextIndex = room.gameState.currentPlayer;
            if (room.players[nextIndex] && room.players[nextIndex].isBot && !room.gameState.players[nextIndex].eliminated) {
              setTimeout(() => executeBotTurn(roomId), 900);
            }
          } else {
            room.players.forEach((player, index) => {
              if (player.socketId && !room.gameState.players[index].eliminated) {
                io.to(player.socketId).emit('gameUpdate', getPlayerGameState(room.gameState, index));
              }
            });
            const nextIndex = room.gameState.currentPlayer;
            if (room.players[nextIndex] && room.players[nextIndex].isBot && !room.gameState.players[nextIndex].eliminated) {
              setTimeout(() => executeBotTurn(roomId), 900);
            }
          }
        } else if (room.localGame) {
          socket.emit('gameUpdate', room.gameState);
        } else {
          // Send filtered game state to each active (non-eliminated) player
          room.players.forEach((player, index) => {
            if (!room.gameState.players[index].eliminated) {
              io.to(player.socketId).emit('gameUpdate', getPlayerGameState(room.gameState, index));
            }
          });
        }
      } else {
        socket.emit('error', result.error);
      }
    });

    socket.on('declare', (roomId, data) => {
      const room = games[roomId];
      if (!room || !room.gameState) return;
      const playerIndex = room.localGame ? data.playerId : (room.isAIGame ? (room.humanPlayerIndex !== undefined ? room.humanPlayerIndex : 0) : room.players.findIndex(p => p.socketId === socket.id));
      if (!room.localGame && !room.isAIGame && playerIndex !== room.gameState.currentPlayer) return;
      if (room.isAIGame && playerIndex !== room.gameState.currentPlayer) return;
      if (room.localGame && room.players[0].socketId !== socket.id) return;
      if (room.localGame && playerIndex !== room.gameState.currentPlayer) return;

      const { declare } = require('./lib/round');
      const result = declare(room.gameState, data.playerId);
      if (result.success) {
        // Determine declare outcome (success if score === 0)
        const declaredWon = result.score === 0;

        // If any players were newly eliminated by this declare, notify players
        matchHistory.recordDeclare(room, data.playerId, {
          declaredWon,
          score: result.score,
          roundSummary: result.roundSummary,
        });

        if (result.newlyEliminated && result.newlyEliminated.length) {
          result.newlyEliminated.forEach((elimIdx) => {
            markEliminated(room.gameState, elimIdx, 'score', room);
            advanceTurnAfterElimination(room.gameState, elimIdx, roomId);

            if (room.isAIGame) {
              socket.emit('playerEliminated', room.gameState, elimIdx, { reason: 'score' });
            } else if (room.localGame) {
              socket.emit('playerEliminated', room.gameState, elimIdx, { reason: 'score' });
            } else {
              room.players.forEach((player, index) => {
                // Always notify the eliminated player themselves; skip others who are already eliminated
                if (index === elimIdx || !room.gameState.players[index].eliminated) {
                  io.to(player.socketId).emit('playerEliminated', getPlayerGameState(room.gameState, index), elimIdx, { reason: 'score' });
                }
              });
            }
          });
        }

        if (room.gameState.gameOver) finalizeRecordedMatch(room, 'declare');
        if (endLobbyIfOnlyBotsRemain(roomId)) return;
        if (room.isAIGame) {
          socket.emit('gameUpdate', room.gameState, {
            declaredPlayerIndex: data.playerId,
            declaredWon,
            score: result.score,
            gameOver: !!room.gameState.gameOver,
            roundSummary: result.roundSummary
          });
          // If game not over and next player is a bot, automatically trigger it
          if (!room.gameState.gameOver) {
            const nextIndex = room.gameState.currentPlayer;
            if (room.players[nextIndex] && room.players[nextIndex].isBot && !room.gameState.players[nextIndex].eliminated) {
              setTimeout(() => executeBotTurn(roomId), 1500);
            }
          }
        } else if (room.hasLobbyBots) {
          room.players.forEach((player, index) => {
            if (player.socketId && !room.gameState.players[index].eliminated) {
              io.to(player.socketId).emit('gameUpdate', getPlayerGameState(room.gameState, index), {
                declaredPlayerIndex: data.playerId,
                declaredWon,
                score: result.score,
                gameOver: !!room.gameState.gameOver,
                roundSummary: result.roundSummary
              });
            }
          });
          const nextIndex = room.gameState.currentPlayer;
          if (!room.gameState.gameOver && room.players[nextIndex] && room.players[nextIndex].isBot && !room.gameState.players[nextIndex].eliminated) {
            setTimeout(() => executeBotTurn(roomId), 900);
          }
        } else if (room.localGame) {
          socket.emit('gameUpdate', room.gameState, {
            declaredPlayerIndex: data.playerId,
            declaredWon,
            score: result.score,
            gameOver: !!room.gameState.gameOver,
            roundSummary: result.roundSummary
          });
        } else {
          // Send filtered game state to each active (non-eliminated) player with declare info
          room.players.forEach((player, index) => {
            if (!room.gameState.players[index].eliminated) {
              io.to(player.socketId).emit('gameUpdate', getPlayerGameState(room.gameState, index), {
                declaredPlayerIndex: data.playerId,
                declaredWon,
                score: result.score,
                gameOver: !!room.gameState.gameOver,
                roundSummary: result.roundSummary
              });
            }
          });
        }
      } else {
        socket.emit('error', result.error);
      }
    });

    socket.on('exitGame', (roomId, data) => {
      const room = games[roomId];
      if (!room || !room.gameState) return;

      const exitingPlayerIndex = data.playerId;
      // Mark the exiting player as eliminated
      markEliminated(room.gameState, exitingPlayerIndex, 'exit', room);
      advanceTurnAfterElimination(room.gameState, exitingPlayerIndex, roomId);
      room.players[exitingPlayerIndex].hasExited = true;

      if (endLobbyIfOnlyBotsRemain(roomId)) return;

      const activePlayers = room.gameState.players.filter(p => !p.eliminated).length;

      if (room.localGame || room.isAIGame || activePlayers <= 1) {
        // Game ends immediately when someone exits in Pass and Play / AI, or if 1 player left
        room.gameState.gameOver = true;
        if (activePlayers === 1) {
          room.gameState.winner = room.gameState.players.findIndex(p => !p.eliminated);
        } else {
          const rankedByScore = room.gameState.players
            .map((player, idx) => ({ idx, score: player.score, eliminated: player.eliminated }))
            .filter(p => !p.eliminated)
            .sort((a, b) => a.score - b.score);
          room.gameState.winner = rankedByScore.length ? rankedByScore[0].idx : null;
        }

        finalizeRecordedMatch(room, 'exit');
        if (room.localGame || room.isAIGame) {
          socket.emit('gameEnded', room.gameState, exitingPlayerIndex);
        } else {
          room.players.forEach((player, index) => {
            if (index === exitingPlayerIndex || !room.gameState.players[index].eliminated) {
              io.to(player.socketId).emit('gameEnded', getPlayerGameState(room.gameState, index), exitingPlayerIndex);
            }
          });
        }
      } else {
        // Notify the exiting player and all non-eliminated players about the elimination
        room.players.forEach((player, index) => {
          if (index === exitingPlayerIndex || !room.gameState.players[index].eliminated) {
            io.to(player.socketId).emit('playerEliminated', getPlayerGameState(room.gameState, index), exitingPlayerIndex, { reason: 'exit' });
          }
        });
      }
    });

    socket.on('claimDisconnectWin', (roomId) => {
      const room = games[roomId];
      if (room && room.gameState && !room.gameState.gameOver) {
        const callerIndex = room.players.findIndex(p => p.socketId === socket.id);
        if (callerIndex !== -1) {
          const discIndex = room.players.findIndex(p => p.socketId === null || p.socketId === undefined || p.socketId === '' || p.disconnected);
          // Mark the disconnected player as eliminated if known otherwise use symmetric index when 2 players
          const toEliminate = discIndex !== -1 ? discIndex : (room.players.length === 2 ? (1 - callerIndex) : null);
          if (toEliminate !== null) {
            markEliminated(room.gameState, toEliminate, 'disconnect-claimed', room);
            advanceTurnAfterElimination(room.gameState, toEliminate, roomId);
          }

          if (endLobbyIfOnlyBotsRemain(roomId)) return;

          // clear any pending disconnect timers for this room
          const claimTimerMap = disconnectTimers.get(roomId);
          if (claimTimerMap) {
            for (const [, t] of claimTimerMap) clearTimeout(t);
            disconnectTimers.delete(roomId);
          }

          const activePlayers = room.gameState.players.filter(p => !p.eliminated).length;
          if (activePlayers <= 1) {
            room.gameState.gameOver = true;
            if (activePlayers === 1) {
              room.gameState.winner = room.gameState.players.findIndex(p => !p.eliminated);
            } else {
              const rankedByScore = room.gameState.players
                .map((player, idx) => ({ idx, score: player.score }))
                .sort((a, b) => a.score - b.score);
              room.gameState.winner = rankedByScore.length ? rankedByScore[0].idx : null;
            }
            finalizeRecordedMatch(room, 'disconnect_claimed');
            room.players.forEach((player, index) => {
              if (index === toEliminate || !room.gameState.players[index].eliminated) {
                io.to(player.socketId).emit('gameEnded', getPlayerGameState(room.gameState, index), toEliminate);
              }
            });
          } else {
            room.players.forEach((player, index) => {
              if (index === toEliminate || !room.gameState.players[index].eliminated) {
                io.to(player.socketId).emit('playerEliminated', getPlayerGameState(room.gameState, index), toEliminate, { reason: 'disconnect-claimed' });
              }
            });
          }
        }
      }
    });

    socket.on('continueWaiting', (roomId) => {
      // Opponent chose to wait — cancel the 10s auto-declare timer
      if (disconnectTimers.has(roomId)) {
        clearTimeout(disconnectTimers.get(roomId));
        disconnectTimers.delete(roomId);
      }
    });

    function getEligibleVoters(room, targetIndex) {
      return room.gameState.players.reduce((acc, p, idx) => {
        if (idx !== targetIndex && !p.eliminated) {
          // Only include players who are actually connected right now
          const playerSocketId = room.players[idx]?.socketId;
          if (playerSocketId && io.sockets.sockets.has(playerSocketId)) {
            acc.push(idx);
          }
        }
        return acc;
      }, []);
    }

    function computeVoteCounts(poll, eligibleVoters) {
      let eliminateVotes = 0;
      let waitVotes = 0;
      for (const vIdx of eligibleVoters) {
        const v = poll.votes.get(vIdx);
        if (v === 'eliminate') eliminateVotes++;
        if (v === 'wait') waitVotes++;
      }
      return { eliminateVotes, waitVotes, totalVoters: eligibleVoters.length };
    }

    function broadcastVoteUpdate(roomId, targetIndex) {
      const room = games[roomId];
      if (!room || !room.gameState) return;
      const pollMap = eliminationPolls.get(roomId);
      if (!pollMap) return;
      const poll = pollMap.get(targetIndex);
      if (!poll) return;

      const eligibleVoters = getEligibleVoters(room, targetIndex);
      const { eliminateVotes, waitVotes, totalVoters } = computeVoteCounts(poll, eligibleVoters);

      room.players.forEach((pl, idx) => {
        if (idx !== targetIndex && !room.gameState.players[idx].eliminated) {
          io.to(pl.socketId).emit(
            'eliminationVoteUpdate',
            getPlayerGameState(room.gameState, idx),
            targetIndex,
            { eliminate: eliminateVotes, wait: waitVotes, total: totalVoters, phase: poll.phase }
          );
        }
      });
      return { eliminateVotes, waitVotes, totalVoters };
    }

    function reevaluatePollOutcome(roomId, targetIndex) {
      const counts = broadcastVoteUpdate(roomId, targetIndex);
      if (!counts) return;
      if (counts.totalVoters === 0 || (counts.eliminateVotes > counts.totalVoters / 2 && counts.eliminateVotes > counts.waitVotes)) {
        eliminateDisconnectedPlayer(roomId, targetIndex, 'poll-eliminate');
      }
    }

    function refreshPollsForMembershipChange(roomId, changedPlayerIndex) {
      const pollMap = eliminationPolls.get(roomId);
      if (!pollMap) return;
      for (const [targetIndex] of pollMap.entries()) {
        if (targetIndex === changedPlayerIndex) continue;
        reevaluatePollOutcome(roomId, targetIndex);
      }
    }

    function eliminateDisconnectedPlayer(roomId, targetIndex, reason) {
      const room = games[roomId];
      if (!room || !room.gameState || room.gameState.gameOver) return;
      if (!room.gameState.players[targetIndex] || room.gameState.players[targetIndex].eliminated) return;

      markEliminated(room.gameState, targetIndex, reason || 'disconnect-eliminated', room);
      advanceTurnAfterElimination(room.gameState, targetIndex, roomId);
      room.players[targetIndex].blockedFromRejoin = true;
      room.players[targetIndex].blockedFromRejoinReason = reason || 'disconnect-eliminated';
      room.players[targetIndex].blockedFromRejoinMessage =
        'You were eliminated because you stayed disconnected for too long and your opponents chose to eliminate you.';

      if (endLobbyIfOnlyBotsRemain(roomId)) return;

      // Close poll for this specific target
      const ePollMap = eliminationPolls.get(roomId);
      if (ePollMap) {
        ePollMap.delete(targetIndex);
        if (ePollMap.size === 0) eliminationPolls.delete(roomId);
      }
      // Clear pending disconnect timer for this specific target
      const eTimerMap = disconnectTimers.get(roomId);
      if (eTimerMap) {
        if (eTimerMap.has(targetIndex)) {
          clearTimeout(eTimerMap.get(targetIndex));
          eTimerMap.delete(targetIndex);
        }
        if (eTimerMap.size === 0) disconnectTimers.delete(roomId);
      }

      const active = room.gameState.players.filter(p => !p.eliminated).length;
      if (active <= 1) {
        room.gameState.gameOver = true;
        if (active === 1) {
          room.gameState.winner = room.gameState.players.findIndex(p => !p.eliminated);
        } else {
          const rankedByScore = room.gameState.players
            .map((player, idx) => ({ idx, score: player.score }))
            .sort((a, b) => a.score - b.score);
          room.gameState.winner = rankedByScore.length ? rankedByScore[0].idx : null;
        }
        finalizeRecordedMatch(room, reason || 'disconnect_eliminated');
        room.players.forEach((pl, idx) => {
          if (pl.socketId && (idx === targetIndex || !room.gameState.players[idx].eliminated)) io.to(pl.socketId).emit('gameEnded', getPlayerGameState(room.gameState, idx), targetIndex);
        });
      } else {
        room.players.forEach((pl, idx) => {
          // Always notify the newly-eliminated player; skip others already eliminated
          if (pl.socketId && (idx === targetIndex || !room.gameState.players[idx].eliminated)) {
            io.to(pl.socketId).emit('playerEliminated', getPlayerGameState(room.gameState, idx), targetIndex, { reason });
          }
        });
      }
    }

    // Handle votes coming from players during an elimination poll
    socket.on('castEliminationVote', (roomId, targetIndex, vote) => {
      try {
        const votePollMap = eliminationPolls.get(roomId);
        if (!votePollMap) return;
        const poll = votePollMap.get(targetIndex);
        if (!poll) return;

        const room = games[roomId];
        if (!room || !room.gameState) return;

        // Identify voter index
        const voterIndex = room.players.findIndex(p => p.socketId === socket.id);
        if (voterIndex === -1) return;
        if (voterIndex === targetIndex) return; // target cannot vote
        if (room.gameState.players[voterIndex].eliminated) return; // eliminated players cannot vote

        if (vote !== 'eliminate' && vote !== 'wait') return;
        poll.votes.set(voterIndex, vote);

        // In any phase, if elimination becomes majority, eliminate immediately.
        reevaluatePollOutcome(roomId, targetIndex);
      } catch (e) { console.error('castEliminationVote error:', e.message); }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      if (socket.userType === 'registered' && socket.userId) {
        removeOnline(socket.userId, socket.id);
        if (!isOnline(socket.userId)) {
          io.emit('friendStatusUpdate', { userId: socket.userId, online: false });
        }
      }

      // Remove from queue if waiting
      const queueIndex = queue.findIndex(p => p.socketId === socket.id);
      if (queueIndex !== -1) {
        queue.splice(queueIndex, 1);
      }

      // Capture room ID before deleting mapping
      const currentRoomId = socketToRoom.get(socket.id);

      // Clean up socket-to-room mapping
      socketToRoom.delete(socket.id);

      // If the player was in an active game or lobby, notify others
      if (currentRoomId && games[currentRoomId]) {
        const room = games[currentRoomId];
        if (!room.gameState && currentRoomId.startsWith('online_')) {
          // Online lobby waiting phase
          room.players = room.players.filter(p => p.socketId !== socket.id);
          if (room.startVotes) room.startVotes.delete(socket.id);

          if (room.players.length === 0) {
            delete games[currentRoomId];
            if (activeOnlineLobbyId === currentRoomId) activeOnlineLobbyId = null;
          } else {
            if (room.players.length === 1 && room.startVotes) room.startVotes.clear();
            const playerUsernames = room.players.map(p => p.username);
            io.to(currentRoomId).emit('onlineLobbyUpdate', playerUsernames, room.startVotes ? room.startVotes.size : 0);
          }
        } else if (room.gameState && !room.gameState.gameOver) {
          const discIndex = room.players.findIndex(p => p.socketId === socket.id);
          if (discIndex !== -1) {
            const isGuestDisconnect = !!socket.guestSessionId;
            // Reflect connectivity in room state so voter eligibility updates immediately.
            room.players[discIndex].socketId = null;
            matchHistory.recordDisconnect(room, discIndex, isGuestDisconnect);

            if (!isGuestDisconnect) {
              room.gameState.players[discIndex].disconnectExpiresAt = Date.now() + 60000;
            }

            // Notify all other players that this player disconnected
            room.players.forEach((pl, idx) => {
              if (idx !== discIndex && !room.gameState.players[idx].eliminated) {
                io.to(pl.socketId).emit('playerDisconnected', discIndex, isGuestDisconnect, room.gameState.players[discIndex].disconnectExpiresAt);
              }
            });

            // Recompute counts for any active polls where this player can vote.
            refreshPollsForMembershipChange(currentRoomId, discIndex);

            // If a registered user disconnected, start an independent 60s window then begin a poll for this player
            if (!isGuestDisconnect) {
              let timerMap = disconnectTimers.get(currentRoomId);
              if (!timerMap) {
                timerMap = new Map();
                disconnectTimers.set(currentRoomId, timerMap);
              }
              if (!timerMap.has(discIndex)) {
                const capturedDiscIndex = discIndex;
                const capturedRoomId = currentRoomId;
                const t = setTimeout(() => {
                  try {
                    // Clean up this timer entry
                    const tm = disconnectTimers.get(capturedRoomId);
                    if (tm) {
                      tm.delete(capturedDiscIndex);
                      if (tm.size === 0) disconnectTimers.delete(capturedRoomId);
                    }

                    const r = games[capturedRoomId];
                    if (r && r.gameState && !r.gameState.gameOver) {
                      // Ensure the player is still disconnected and not already eliminated
                      if (r.gameState.players[capturedDiscIndex] && !r.gameState.players[capturedDiscIndex].eliminated) {
                        delete r.gameState.players[capturedDiscIndex].disconnectExpiresAt;

                        const eligibleVoters = getEligibleVoters(r, capturedDiscIndex);
                        if (eligibleVoters.length === 0) {
                          // No one is online to vote, eliminate immediately
                          eliminateDisconnectedPlayer(capturedRoomId, capturedDiscIndex, 'disconnect-eliminated');
                        } else {
                          // Start elimination poll for this specific player
                          let pMap = eliminationPolls.get(capturedRoomId);
                          if (!pMap) {
                            pMap = new Map();
                            eliminationPolls.set(capturedRoomId, pMap);
                          }
                          const poll = { targetIndex: capturedDiscIndex, votes: new Map(), phase: 'waiting' };
                          pMap.set(capturedDiscIndex, poll);

                          // Default all eligible voters to "wait"
                          for (const vIdx of eligibleVoters) {
                            poll.votes.set(vIdx, 'wait');
                          }

                          matchHistory.recordPollStart(r, capturedDiscIndex);

                          // Send poll start to all other active players
                          r.players.forEach((pl, idx) => {
                            if (idx !== capturedDiscIndex && !r.gameState.players[idx].eliminated) {
                              io.to(pl.socketId).emit('startEliminationPoll', getPlayerGameState(r.gameState, idx), capturedDiscIndex);
                            }
                          });

                          // Broadcast the default counts immediately (everyone starts at "wait")
                          broadcastVoteUpdate(capturedRoomId, capturedDiscIndex);
                        }
                      }
                    }
                  } catch (e) { console.error('start elimination poll failed:', e.message); }
                }, 60_000);
                timerMap.set(discIndex, t);
              }
            }
          }
        }
      }

      // Start 60-second expiry for guest sessions
      if (socket.guestSessionId) {
        startGuestExpiry(socket.guestSessionId, socket.id, currentRoomId);
      }
    });
  });

  app.all('*', (req, res) => {
    return handle(req, res);
  });

  const nextUpgradeHandler = nextApp.getUpgradeHandler();
  server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/_next/')) {
      nextUpgradeHandler(req, socket, head);
    }
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
