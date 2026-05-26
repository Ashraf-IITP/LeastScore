import { getPool } from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';
import { getFriendsByUserId } from '../../../lib/friends';
import { isOnline } from '../../../lib/online';

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
    const friends = await getFriendsByUserId(pool, user.userId);
    const formatted = friends.map(friend => ({
      username: `${friend.display_name}#${friend.tag}`,
      displayName: friend.display_name,
      tag: friend.tag,
      online: isOnline(friend.id),
      userId: friend.id,
    }));

    return res.status(200).json({ friends: formatted });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to load friends' });
  }
}
