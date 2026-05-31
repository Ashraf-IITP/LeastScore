import { getPool } from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';
import { respondFriendRequest } from '../../../lib/friends';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = getUserFromRequest(req);
  if (!user || user.type !== 'registered') {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { requestId, action } = req.body;
    if (!requestId || !['accept', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'requestId and action are required' });
    }

    const pool = getPool();
    const result = await respondFriendRequest(pool, user.userId, requestId, action);

    if (global.io && action === 'accept') {
      const { getSocketIds } = require('../../../lib/online');
      const [accepterRows] = await pool.query(
        'SELECT display_name, tag FROM users WHERE id = ?',
        [user.userId]
      );
      const accepter = accepterRows[0];
      const accepterUsername = accepter ? `${accepter.display_name}#${accepter.tag}` : user.username;

      const requesterSockets = getSocketIds(result.requesterId);
      if (requesterSockets) {
        for (const sid of requesterSockets) {
          global.io.to(sid).emit('friendRequestAccepted', { username: accepterUsername, role: 'requester' });
          global.io.to(sid).emit('friendDataChanged');
        }
      }
    } else if (global.io) {
      const { getSocketIds } = require('../../../lib/online');
      const sockets = getSocketIds(result.requesterId);
      if (sockets) {
        for (const sid of sockets) global.io.to(sid).emit('friendDataChanged');
      }
    }

    return res.status(200).json({ message: action === 'accept' ? `Friend request accepted from ${result.username}` : `Friend request rejected from ${result.username}` });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Unable to respond to friend request' });
  }
}
