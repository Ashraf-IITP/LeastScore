import { getPool } from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';
import { getFriendRequests } from '../../../lib/friends';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = getUserFromRequest(req);
  if (!user || user.type !== 'registered') {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const pool = getPool();
    const requests = await getFriendRequests(pool, user.userId);
    return res.status(200).json({ requests });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to load friend requests' });
  }
}
