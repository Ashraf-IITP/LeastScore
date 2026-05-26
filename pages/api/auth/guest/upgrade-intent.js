import { getUserFromRequest } from '../../../../lib/auth';
import { markGuestUpgradeIntent } from '../../../../lib/guestUpgradeIntent';
import { getPool } from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const user = getUserFromRequest(req);
  if (!user || user.type !== 'guest' || !user.guestSessionId) {
    return res.status(401).json({ error: 'Guest session required.' });
  }

  try {
    markGuestUpgradeIntent(user.guestSessionId);
    // Persist keepalive immediately so DB cleanup event cannot remove it mid-upgrade.
    await getPool().query(
      'UPDATE guest_sessions SET expires_at = DATE_ADD(NOW(), INTERVAL 7 DAY) WHERE id = ?',
      [user.guestSessionId]
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error('[/api/auth/guest/upgrade-intent]', err);
    return res.status(500).json({ error: 'Failed to start guest upgrade.' });
  }
}

