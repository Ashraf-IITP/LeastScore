const { getPool } = require('./db');

function parseUserIdFromQueueKey(queueKey) {
  if (!queueKey || !queueKey.startsWith('u:')) return null;
  const id = parseInt(queueKey.slice(2), 10);
  return Number.isFinite(id) ? id : null;
}

function roomHasRegisteredUser(room) {
  if (!room || !room.players) return false;
  return room.players.some((p) => {
    if (p.userId) return true;
    if (p.queueKey && p.queueKey.startsWith('u:')) return true;
    return false;
  });
}

function shouldRecordMatch(room) {
  if (!room || room.localGame || room.isPlayAlong) return false;
  return roomHasRegisteredUser(room);
}

function resolveMatchMode(room, roomId) {
  if (room.isPlayAlong) return 'play_along';
  if (room.isAIGame) return 'ai';
  if (roomId && roomId.startsWith('online_')) return 'online';
  return 'friends';
}

function buildPlayerSnapshots(gameState, room) {
  return gameState.players.map((p, idx) => ({
    seatIndex: idx,
    username: p.username || room?.players?.[idx]?.username || `Player ${idx + 1}`,
    userId: room?.players?.[idx]?.userId || parseUserIdFromQueueKey(room?.players?.[idx]?.queueKey) || null,
    isBot: !!(p.isBot || room?.players?.[idx]?.isBot),
    botDifficulty: p.difficulty || room?.players?.[idx]?.difficulty || null,
    hand: Array.isArray(p.hand) ? p.hand.map((c) => ({ ...c })) : [],
    score: p.score ?? 0,
    eliminated: !!p.eliminated,
    eliminatedReason: p.eliminatedReason || null,
    eliminatedOrder: typeof p.eliminatedOrder === 'number' ? p.eliminatedOrder : null,
    lastDrawnCard: p.lastDrawnCard ? { ...p.lastDrawnCard } : null,
    lastDrawnFrom: p.lastDrawnFrom || null,
    lastDiscard: Array.isArray(p.lastDiscard) ? p.lastDiscard.map((c) => ({ ...c })) : null,
  }));
}

function buildStateSnapshot(gameState, room, extra = {}) {
  return {
    currentPlayer: gameState.currentPlayer,
    gameOver: !!gameState.gameOver,
    winner: gameState.winner,
    visibleCard: Array.isArray(gameState.visibleCard)
      ? gameState.visibleCard.map((c) => ({ ...c }))
      : [],
    exposedCards: Array.isArray(gameState.exposedCards)
      ? gameState.exposedCards.map((c) => ({ ...c }))
      : [],
    deckCount: Array.isArray(gameState.deck) ? gameState.deck.length : (gameState.deckCount ?? 0),
    players: buildPlayerSnapshots(gameState, room),
    ...extra,
  };
}

function participantRow(matchId, seatIndex, roomPlayer, gamePlayer) {
  const userId = roomPlayer?.userId || parseUserIdFromQueueKey(roomPlayer?.queueKey) || null;
  return {
    matchId,
    seatIndex,
    username: gamePlayer?.username || roomPlayer?.username || `Player ${seatIndex + 1}`,
    userId,
    isBot: roomPlayer?.isBot ? 1 : 0,
    botDifficulty: roomPlayer?.difficulty || null,
    isGuest: roomPlayer?.guestSessionId ? 1 : 0,
    guestSessionId: roomPlayer?.guestSessionId || null,
  };
}

async function startMatch(room, roomId) {
  if (!shouldRecordMatch(room) || !room.gameState) return null;

  try {
    const pool = getPool();
    const mode = resolveMatchMode(room, roomId);
    const playerCount = room.gameState.players.length;

    const [result] = await pool.query(
      `INSERT INTO matches (room_id, mode, player_count) VALUES (?, ?, ?)`,
      [roomId, mode, playerCount]
    );
    const matchId = result.insertId;

    for (let i = 0; i < playerCount; i++) {
      const row = participantRow(matchId, i, room.players[i], room.gameState.players[i]);
      await pool.query(
        `INSERT INTO match_participants
         (match_id, seat_index, username, user_id, is_bot, bot_difficulty, is_guest, guest_session_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          row.matchId,
          row.seatIndex,
          row.username,
          row.userId,
          row.isBot,
          row.botDifficulty,
          row.isGuest,
          row.guestSessionId,
        ]
      );
    }

    room.matchHistoryId = matchId;
    room.matchMoveSeq = 0;

    await appendMove(room, 'deal', null, {
      label: 'Initial deal',
      state: buildStateSnapshot(room.gameState, room),
    });

    return matchId;
  } catch (err) {
    console.error('[matchHistory] startMatch:', err.message);
    return null;
  }
}

async function appendMove(room, eventType, actingPlayer, payload) {
  if (!room?.matchHistoryId) return;
  try {
    const pool = getPool();
    room.matchMoveSeq = (room.matchMoveSeq || 0) + 1;
    await pool.query(
      `INSERT INTO match_moves (match_id, move_number, event_type, acting_player, payload)
       VALUES (?, ?, ?, ?, ?)`,
      [room.matchHistoryId, room.matchMoveSeq, eventType, actingPlayer, JSON.stringify(payload)]
    );
  } catch (err) {
    console.error('[matchHistory] appendMove:', err.message);
  }
}

function recordTurn(room, playerIndex, drawFrom, visibleIndex, discardCards) {
  if (!room?.matchHistoryId || !room.gameState) return;
  const player = room.gameState.players[playerIndex];
  appendMove(room, 'turn', playerIndex, {
    drawFrom,
    visibleIndex: drawFrom === 'visible' ? visibleIndex : null,
    discardCards: Array.isArray(discardCards) ? discardCards.map((c) => ({ ...c })) : [],
    drawnCard: player?.lastDrawnCard ? { ...player.lastDrawnCard } : null,
    state: buildStateSnapshot(room.gameState, room),
  });
}

function recordDeclare(room, playerIndex, declareMeta) {
  if (!room?.matchHistoryId || !room.gameState) return;
  appendMove(room, 'declare', playerIndex, {
    declaredWon: declareMeta.declaredWon,
    score: declareMeta.score,
    roundSummary: declareMeta.roundSummary || null,
    gameOver: !!room.gameState.gameOver,
    state: buildStateSnapshot(room.gameState, room),
  });
  if (!room.gameState.gameOver) {
    appendMove(room, 'deal', null, {
      label: 'New round deal',
      state: buildStateSnapshot(room.gameState, room),
    });
  }
}

function recordElimination(room, playerIndex, reason) {
  if (!room?.matchHistoryId || !room.gameState) return;
  appendMove(room, 'eliminate', playerIndex, {
    reason,
    username: room.gameState.players[playerIndex]?.username,
    state: buildStateSnapshot(room.gameState, room),
  });
}

function recordDisconnect(room, playerIndex, isGuest) {
  if (!room?.matchHistoryId) return;
  appendMove(room, 'disconnect', playerIndex, {
    isGuest: !!isGuest,
    username: room.gameState?.players?.[playerIndex]?.username,
    state: room.gameState ? buildStateSnapshot(room.gameState, room) : null,
  });
}

function recordPollStart(room, targetIndex) {
  if (!room?.matchHistoryId) return;
  appendMove(room, 'poll_start', targetIndex, {
    targetUsername: room.gameState?.players?.[targetIndex]?.username,
    state: room.gameState ? buildStateSnapshot(room.gameState, room) : null,
  });
}

function recordBotsOnlyEnd(room) {
  if (!room?.matchHistoryId || !room.gameState) return;
  appendMove(room, 'bots_only_end', null, {
    message: 'All human players eliminated; match ended with bots remaining.',
    winner: room.gameState.winner,
    state: buildStateSnapshot(room.gameState, room),
  });
  finalizeMatch(room, 'bots_only');
}

async function finalizeMatch(room, endReason) {
  if (!room?.matchHistoryId || !room.gameState || room.matchHistoryFinalized) return;
  try {
    const pool = getPool();
    const gs = room.gameState;
    const winnerSeat = typeof gs.winner === 'number' ? gs.winner : null;

    console.log('[matchHistory] finalizeMatch start', {
      matchId: room.matchHistoryId,
      winnerSeat,
      gameOver: !!gs.gameOver,
      endReason,
    });

    const ranked = gs.players
      .map((p, idx) => ({
        idx,
        score: p.score ?? 0,
        eliminated: !!p.eliminated,
        eliminatedOrder: typeof p.eliminatedOrder === 'number' ? p.eliminatedOrder : 999,
      }))
      .sort((a, b) => {
        if (a.eliminated !== b.eliminated) return a.eliminated ? 1 : -1;
        if (a.eliminated && b.eliminated) return b.eliminatedOrder - a.eliminatedOrder;
        return a.score - b.score;
      });

    let placement = 1;
    for (const entry of ranked) {
      await pool.query(
        'UPDATE match_participants SET final_score = ?, placement = ? WHERE match_id = ? AND seat_index = ?',
        [gs.players[entry.idx].score ?? 0, placement, room.matchHistoryId, entry.idx]
      );
      placement += 1;
    }

    await appendMove(room, 'game_end', winnerSeat, {
      endReason: endReason || 'normal',
      winner: winnerSeat,
      state: buildStateSnapshot(gs, room),
    });

    await pool.query(
      'UPDATE matches SET ended_at = NOW(), winner_seat = ?, end_reason = ? WHERE id = ?',
      [winnerSeat, endReason || 'normal', room.matchHistoryId]
    );

    room.matchHistoryFinalized = true;
    console.log('[matchHistory] finalizeMatch success', { matchId: room.matchHistoryId });
  } catch (err) {
    console.error('[matchHistory] finalizeMatch failed', {
      matchId: room?.matchHistoryId,
      error: err.message,
      endReason,
    });
  }
}

async function listMatchesForUser(userId, { limit = 50, offset = 0 } = {}) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT m.id, m.room_id, m.mode, m.player_count, m.started_at, m.ended_at,
            m.winner_seat, m.end_reason, mp.seat_index AS my_seat, mp.placement AS my_placement,
            mp.final_score AS my_score
     FROM matches m
     JOIN match_participants mp ON mp.match_id = m.id AND mp.user_id = ?
     WHERE m.mode != 'play_along'
     ORDER BY m.started_at DESC
     LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );

  if (rows.length === 0) return [];

  const matchIds = rows.map((r) => r.id);
  const [participants] = await pool.query(
    `SELECT match_id, seat_index, username, is_bot, placement, final_score
     FROM match_participants WHERE match_id IN (?)
     ORDER BY match_id, seat_index`,
    [matchIds]
  );

  const byMatch = new Map();
  for (const p of participants) {
    if (!byMatch.has(p.match_id)) byMatch.set(p.match_id, []);
    byMatch.get(p.match_id).push(p);
  }

  return rows.map((row) => ({
    id: row.id,
    mode: row.mode,
    playerCount: row.player_count,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    winnerSeat: row.winner_seat,
    endReason: row.end_reason,
    mySeat: row.my_seat,
    myPlacement: row.my_placement,
    myScore: row.my_score,
    participants: (byMatch.get(row.id) || []).map((p) => ({
      seatIndex: p.seat_index,
      username: p.username,
      isBot: !!p.is_bot,
      placement: p.placement,
      finalScore: p.final_score,
    })),
  }));
}

async function getMatchDetailForUser(matchId, userId) {
  const pool = getPool();
  const [access] = await pool.query(
    'SELECT 1 FROM match_participants WHERE match_id = ? AND user_id = ? LIMIT 1',
    [matchId, userId]
  );
  if (!access.length) return null;

  const [matchRows] = await pool.query(
    `SELECT id, room_id, mode, player_count, started_at, ended_at, winner_seat, end_reason
     FROM matches WHERE id = ? AND mode != 'play_along'`,
    [matchId]
  );
  if (!matchRows.length) return null;
  const match = matchRows[0];

  const [participants] = await pool.query(
    `SELECT seat_index, username, user_id, is_bot, bot_difficulty, is_guest, final_score, placement
     FROM match_participants WHERE match_id = ? ORDER BY seat_index`,
    [matchId]
  );

  const [moves] = await pool.query(
    `SELECT move_number, event_type, acting_player, payload, created_at
     FROM match_moves WHERE match_id = ? ORDER BY move_number ASC`,
    [matchId]
  );

  return {
    id: match.id,
    roomId: match.room_id,
    mode: match.mode,
    playerCount: match.player_count,
    startedAt: match.started_at,
    endedAt: match.ended_at,
    winnerSeat: match.winner_seat,
    endReason: match.end_reason,
    participants: participants.map((p) => ({
      seatIndex: p.seat_index,
      username: p.username,
      userId: p.user_id,
      isBot: !!p.is_bot,
      botDifficulty: p.bot_difficulty,
      isGuest: !!p.is_guest,
      finalScore: p.final_score,
      placement: p.placement,
    })),
    moves: moves.map((m) => ({
      moveNumber: m.move_number,
      eventType: m.event_type,
      actingPlayer: m.acting_player,
      payload: typeof m.payload === 'string' ? JSON.parse(m.payload) : m.payload,
      createdAt: m.created_at,
    })),
  };
}

async function repairOrphanedMatches() {
  const pool = getPool();
  try {
    const [rows] = await pool.query(`SELECT id FROM matches WHERE ended_at IS NULL`);
    for (const r of rows) {
      const matchId = r.id;
      try {
        const [moves] = await pool.query(
          `SELECT payload FROM match_moves WHERE match_id = ? AND event_type = 'game_end' ORDER BY move_number DESC LIMIT 1`,
          [matchId]
        );
        if (!moves || moves.length === 0) continue;
        let payload = moves[0].payload;
        if (typeof payload === 'string') {
          try { payload = JSON.parse(payload); } catch (e) { payload = null; }
        }
        if (!payload) continue;
        const winner = (payload.winner !== undefined && payload.winner !== null) ? payload.winner : null;
        const statePlayers = payload.state && Array.isArray(payload.state.players) ? payload.state.players : [];

        if (statePlayers.length) {
          const ranked = statePlayers.map((p, idx) => ({ idx, score: Number(p.score ?? 0) }))
            .sort((a, b) => a.score - b.score);
          let placement = 1;
          for (const entry of ranked) {
            await pool.query(
              'UPDATE match_participants SET final_score = ?, placement = ? WHERE match_id = ? AND seat_index = ?',
              [statePlayers[entry.idx].score ?? 0, placement, matchId, entry.idx]
            );
            placement += 1;
          }
        }

        await pool.query(
          'UPDATE matches SET ended_at = NOW(), winner_seat = ?, end_reason = ? WHERE id = ?',
          [winner, 'repaired', matchId]
        );
        console.log(`[matchHistory] repaired match ${matchId} (winner=${winner})`);
      } catch (innerErr) {
        console.error('[matchHistory] repair match', matchId, innerErr.message);
      }
    }
  } catch (err) {
    console.error('[matchHistory] repairOrphanedMatches:', err.message);
  }
}

module.exports = {
  shouldRecordMatch,
  roomHasRegisteredUser,
  startMatch,
  recordTurn,
  recordDeclare,
  recordElimination,
  recordDisconnect,
  recordPollStart,
  recordBotsOnlyEnd,
  finalizeMatch,
  listMatchesForUser,
  getMatchDetailForUser,
};
