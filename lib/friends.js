const { parseUsername } = require('./auth');

async function getUserByUsername(pool, username) {
  const parsed = parseUsername(username);
  if (!parsed) return null;
  const [rows] = await pool.query(
    'SELECT id, display_name, tag FROM users WHERE display_name = ? AND tag = ?',
    [parsed.name, parsed.tag]
  );
  return rows[0] || null;
}

async function getFriendsByUserId(pool, userId) {
  const [rows] = await pool.query(
    `SELECT u.id, u.display_name, u.tag
     FROM friends f
     JOIN users u ON f.friend_id = u.id
     WHERE f.user_id = ?`,
    [userId]
  );
  return rows;
}

async function getFriendRequests(pool, userId) {
  const [incoming] = await pool.query(
    `SELECT fr.id, fr.requester_id, u.display_name, u.tag, fr.created_at
     FROM friend_requests fr
     JOIN users u ON fr.requester_id = u.id
     WHERE fr.recipient_id = ? AND fr.status = 'pending'
     ORDER BY fr.created_at DESC`,
    [userId]
  );

  const [outgoing] = await pool.query(
    `SELECT fr.id, fr.recipient_id, u.display_name, u.tag, fr.created_at
     FROM friend_requests fr
     JOIN users u ON fr.recipient_id = u.id
     WHERE fr.requester_id = ? AND fr.status = 'pending'
     ORDER BY fr.created_at DESC`,
    [userId]
  );

  return {
    incoming: incoming.map(r => ({
      requestId: r.id,
      username: `${r.display_name}#${r.tag}`,
      requesterId: r.requester_id,
      createdAt: r.created_at,
    })),
    outgoing: outgoing.map(r => ({
      requestId: r.id,
      username: `${r.display_name}#${r.tag}`,
      recipientId: r.recipient_id,
      createdAt: r.created_at,
    })),
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

async function sendFriendRequest(pool, requesterId, recipientUsername) {
  const recipient = await getUserByUsername(pool, recipientUsername);
  if (!recipient) {
    throw new Error('Cannot send friend request to guest accounts or unknown users.');
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
    `SELECT fr.requester_id, fr.recipient_id, fr.status, u.display_name, u.tag
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
      username: `${request.display_name}#${request.tag}`,
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
      username: `${request.display_name}#${request.tag}`,
      accepted: false,
      requesterId: request.requester_id,
    };
  }

  throw new Error('Invalid response action.');
}

async function unfriend(pool, userId, friendUsername) {
  const friend = await getUserByUsername(pool, friendUsername);
  if (!friend) {
    throw new Error('Friend not found.');
  }

  // Delete both sides of the friendship
  await pool.query(
    'DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
    [userId, friend.id, friend.id, userId]
  );
  
  // Also delete associated accepted friend requests to keep DB clean
  await pool.query(
    'DELETE FROM friend_requests WHERE ((requester_id = ? AND recipient_id = ?) OR (requester_id = ? AND recipient_id = ?)) AND status = "accepted"',
    [userId, friend.id, friend.id, userId]
  );

  return friend;
}

module.exports = {
  getUserByUsername,
  getFriendsByUserId,
  getFriendRequests,
  sendFriendRequest,
  respondFriendRequest,
  unfriend,
};
