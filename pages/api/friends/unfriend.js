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
    const { friendId } = req.body;
    if (!friendId) {
      return res.status(400).json({ error: 'friendId is required' });
    }

    const pool = getPool();
    await unfriend(pool, user.userId, friendId);

    return res.status(200).json({ message: 'Friend removed.' });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Unable to unfriend user' });
  }
}
