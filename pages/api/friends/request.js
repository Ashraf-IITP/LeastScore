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
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    const pool = getPool();
    const recipient = await sendFriendRequest(pool, user.userId, email.trim());
    
    if (global.io) {
      const { getSocketIds } = require('../../../lib/online');
      const sockets = getSocketIds(recipient.id);
      if (sockets) {
        for (const sid of sockets) global.io.to(sid).emit('friendDataChanged');
      }
    }

    return res.status(200).json({ message: `Friend request sent to ${recipient.nickname} (${recipient.first_name} ${recipient.last_name})` });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Unable to send friend request' });
  }
}
