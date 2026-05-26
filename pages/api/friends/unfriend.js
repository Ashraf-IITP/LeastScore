import { getPool } from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';
import { unfriend } from '../../../lib/friends';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = getUserFromRequest(req);
  if (!user || user.type !== 'registered') {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { friendUsername } = req.body;
    if (!friendUsername) {
      return res.status(400).json({ error: 'friendUsername is required' });
    }

    const pool = getPool();
    const friend = await unfriend(pool, user.userId, friendUsername);

    if (global.io) {
      const { getSocketIds } = require('../../../lib/online');
      const sockets = getSocketIds(friend.id);
      if (sockets) {
        for (const sid of sockets) global.io.to(sid).emit('friendDataChanged');
      }
    }

    return res.status(200).json({ message: `Unfriended ${friendUsername}` });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Unable to unfriend' });
  }
}
