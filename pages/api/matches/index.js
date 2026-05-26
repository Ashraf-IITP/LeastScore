import { getUserFromRequest } from '../../../lib/auth';
import { listMatchesForUser } from '../../../lib/matchHistory';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = getUserFromRequest(req);
  if (!user || user.type !== 'registered') {
    return res.status(401).json({ error: 'Registered account required' });
  }

  try {
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
    const offset = Math.max(0, parseInt(req.query.offset, 10) || 0);
    const matches = await listMatchesForUser(user.userId, { limit, offset });
    return res.status(200).json({ matches });
  } catch (error) {
    console.error('[/api/matches]', error);
    return res.status(500).json({ error: 'Unable to load match history' });
  }
}
