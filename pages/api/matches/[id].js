import { getUserFromRequest } from '../../../lib/auth';
import { getMatchDetailForUser } from '../../../lib/matchHistory';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = getUserFromRequest(req);
  if (!user || user.type !== 'registered') {
    return res.status(401).json({ error: 'Registered account required' });
  }

  const matchId = parseInt(req.query.id, 10);
  if (!Number.isFinite(matchId)) {
    return res.status(400).json({ error: 'Invalid match id' });
  }

  try {
    const match = await getMatchDetailForUser(matchId, user.userId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    return res.status(200).json({ match });
  } catch (error) {
    console.error('[/api/matches/[id]]', error);
    return res.status(500).json({ error: 'Unable to load match' });
  }
}
