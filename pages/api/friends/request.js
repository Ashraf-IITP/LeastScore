import { getPool } from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';
import { sendFriendRequest } from '../../../lib/friends';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = getUserFromRequest(req);
  if (!user || user.type !== 'registered') {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { username } = req.body;
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Username is required' });
    }

    const pool = getPool();
    const recipient = await sendFriendRequest(pool, user.userId, username.trim());
    
    if (global.io) {
      const { getSocketIds } = require('../../../lib/online');
      const sockets = getSocketIds(recipient.id);
      if (sockets) {
        for (const sid of sockets) global.io.to(sid).emit('friendDataChanged');
      }
    }

    return res.status(200).json({ message: `Friend request sent to ${recipient.display_name}#${recipient.tag}` });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Unable to send friend request' });
  }
}
