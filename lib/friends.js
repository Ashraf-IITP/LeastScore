const { buildDisplayName } = require('./auth');

async function getUserByEmail(pool, email) {
  if (!email) return null;
  const [rows] = await pool.query(
    'SELECT id, first_name, last_name, nickname, email FROM users WHERE email = ?',
    [email.trim().toLowerCase()]
  );
  return rows[0] || null;
}

async function getFriendsByUserId(pool, userId) {
  const [rows] = await pool.query(
    `SELECT u.id, u.first_name, u.last_name, u.nickname, u.email
     FROM friends f
     JOIN users u ON f.friend_id = u.id
     WHERE f.user_id = ?`,
    [userId]
  );
  return rows;
}

async function getFriendRequests(pool, userId) {
  const [incoming] = await pool.query(
    `SELECT fr.id, fr.requester_id, u.first_name, u.last_name, u.nickname, u.email, fr.created_at
     FROM friend_requests fr
     JOIN users u ON fr.requester_id = u.id
     WHERE fr.recipient_id = ? AND fr.status = 'pending'
     ORDER BY fr.created_at DESC`,
    [userId]
  );

  const [outgoing] = await pool.query(
    `SELECT fr.id, fr.recipient_id, u.first_name, u.last_name, u.nickname, u.email, fr.created_at
     FROM friend_requests fr
     JOIN users u ON fr.recipient_id = u.id
     WHERE fr.requester_id = ? AND fr.status = 'pending'
     ORDER BY fr.created_at DESC`,
    [userId]
  );

  const formatFriend = (r, idField) => ({
    requestId: r.id,
    userId: r[idField],
    username: buildDisplayName(r.first_name, r.last_name, r.nickname),
    email: r.email,
    createdAt: r.created_at,
  });

  return {
    incoming: incoming.map(r => formatFriend(r, 'requester_id')),
    outgoing: outgoing.map(r => formatFriend(r, 'recipient_id')),
  };
}

async function areAlreadyFriends(pool, userId, friendId) {
  const [rows] = await pool.query(
    'SELECT 1 FROM friends WHERE user_id = ? AND friend_id = ? LIMIT 1',
    [userId, friendId]
  );
  return rows.length > 0;
}

async function hasPendingRequest(pool, requesterId, recipientId) {
  const [rows] = await pool.query(
    `SELECT 1 FROM friend_requests
     WHERE requester_id = ? AND recipient_id = ? AND status = 'pending'`,
    [requesterId, recipientId]
  );
  return rows.length > 0;
}

async function sendFriendRequest(pool, requesterId, recipientEmail) {
  const recipient = await getUserByEmail(pool, recipientEmail);
  if (!recipient) {
    throw new Error('User not found.');
  }
  if (recipient.id === requesterId) {
    throw new Error('You cannot send a friend request to yourself.');
  }
  if (await areAlreadyFriends(pool, requesterId, recipient.id)) {
    throw new Error('You are already friends with this user.');
  }
  if (await hasPendingRequest(pool, requesterId, recipient.id)) {
    throw new Error('A friend request is already pending to this user.');
  }
  if (await hasPendingRequest(pool, recipient.id, requesterId)) {
    throw new Error('This user has already sent you a friend request.');
  }

  await pool.query(
    `INSERT INTO friend_requests (requester_id, recipient_id, status)
     VALUES (?, ?, 'pending')`,
    [requesterId, recipient.id]
  );

  return recipient;
}

async function respondFriendRequest(pool, userId, requestId, action) {
  const [rows] = await pool.query(
    `SELECT fr.requester_id, fr.recipient_id, fr.status, u.first_name, u.last_name, u.nickname
     FROM friend_requests fr
     JOIN users u ON fr.requester_id = u.id
     WHERE fr.id = ? AND fr.recipient_id = ?`,
    [requestId, userId]
  );
  if (!rows.length) {
    throw new Error('Friend request not found.');
  }
  const request = rows[0];
  if (request.status !== 'pending') {
    throw new Error('Friend request has already been handled.');
  }

  const displayName = buildDisplayName(request.first_name, request.last_name, request.nickname);

  if (action === 'accept') {
    await pool.query(
      `UPDATE friend_requests
       SET status = 'accepted', responded_at = NOW()
       WHERE id = ?`,
      [requestId]
    );
    await pool.query(
      `INSERT IGNORE INTO friends (user_id, friend_id) VALUES (?, ?), (?, ?)`,
      [userId, request.requester_id, request.requester_id, userId]
    );
    return {
      username: displayName,
      accepted: true,
      requesterId: request.requester_id,
    };
  }

  if (action === 'reject') {
    await pool.query(
      `UPDATE friend_requests
       SET status = 'rejected', responded_at = NOW()
       WHERE id = ?`,
      [requestId]
    );
    return {
      username: displayName,
      accepted: false,
      requesterId: request.requester_id,
    };
  }

  throw new Error('Invalid response action.');
}

async function unfriend(pool, userId, friendId) {
  const parsedFriendId = Number(friendId);
  if (!Number.isFinite(parsedFriendId)) {
    throw new Error('Invalid friend id.');
  }

  const [rows] = await pool.query(
    'SELECT 1 FROM friends WHERE user_id = ? AND friend_id = ? LIMIT 1',
    [userId, parsedFriendId]
  );
  if (!rows.length) {
    throw new Error('Friend not found.');
  }

  await pool.query(
    'DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
    [userId, parsedFriendId, parsedFriendId, userId]
  );

  await pool.query(
    'DELETE FROM friend_requests WHERE ((requester_id = ? AND recipient_id = ?) OR (requester_id = ? AND recipient_id = ?)) AND status = "accepted"',
    [userId, parsedFriendId, parsedFriendId, userId]
  );

  return { id: parsedFriendId };
}

module.exports = {
  getUserByEmail,
  getFriendsByUserId,
  getFriendRequests,
  sendFriendRequest,
  respondFriendRequest,
  unfriend,
};
