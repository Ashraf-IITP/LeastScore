import { getUserFromRequest, validateName, validateTag, formatUsername, signJWT, setAuthCookie } from '../../../lib/auth';
import { getPool } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const decoded = getUserFromRequest(req);
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

  const { displayName, tag } = req.body || {};
  if (!displayName || !tag || !validateName(displayName) || !validateTag(tag)) {
    return res.status(400).json({ error: 'Username must be 3-20 letters, digits or underscore and tag must be 4 alphanumeric uppercase characters.' });
  }

  const upperTag = tag.toUpperCase();
  const pool = getPool();

  try {
    if (decoded.type === 'guest') {
      const guestSessionId = decoded.guestSessionId;
      if (!guestSessionId) return res.status(401).json({ error: 'Unauthorized' });

      const [existingUser] = await pool.query(
        'SELECT id FROM users WHERE display_name = ? AND tag = ?',
        [displayName, upperTag]
      );
      if (existingUser.length) {
        return res.status(409).json({ error: `${formatUsername(displayName, upperTag)} is already taken.` });
      }

      const [existingGuest] = await pool.query(
        'SELECT id FROM guest_sessions WHERE display_name = ? AND tag = ? AND expires_at > NOW() AND id <> ?',
        [displayName, upperTag, guestSessionId]
      );
      if (existingGuest.length) {
        return res.status(409).json({ error: `${formatUsername(displayName, upperTag)} is currently used by another guest.` });
      }

      const [result] = await pool.query(
        'UPDATE guest_sessions SET display_name = ?, tag = ? WHERE id = ? AND expires_at > NOW()',
        [displayName, upperTag, guestSessionId]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Guest session not found or expired.' });
      }

      const token = signJWT({
        type: 'guest',
        guestSessionId,
        username: formatUsername(displayName, upperTag),
        display_name: displayName,
        tag: upperTag,
      });
      setAuthCookie(res, token);
      return res.json({
        ok: true,
        user: {
          type: 'guest',
          username: formatUsername(displayName, upperTag),
          display_name: displayName,
          tag: upperTag,
          guestSessionId,
        },
      });
    }

    if (decoded.type === 'registered') {
      const userId = decoded.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const [existingUser] = await pool.query(
        'SELECT id FROM users WHERE display_name = ? AND tag = ? AND id <> ?',
        [displayName, upperTag, userId]
      );
      if (existingUser.length) {
        return res.status(409).json({ error: `${formatUsername(displayName, upperTag)} is already taken.` });
      }

      const [existingGuest] = await pool.query(
        'SELECT id FROM guest_sessions WHERE display_name = ? AND tag = ? AND expires_at > NOW()',
        [displayName, upperTag]
      );
      if (existingGuest.length) {
        return res.status(409).json({ error: `${formatUsername(displayName, upperTag)} is currently used by a guest.` });
      }

      const [result] = await pool.query(
        'UPDATE users SET display_name = ?, tag = ? WHERE id = ?',
        [displayName, upperTag, userId]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const token = signJWT({
        type: 'registered',
        userId,
        username: formatUsername(displayName, upperTag),
        display_name: displayName,
        tag: upperTag,
        tokenVersion: decoded.tokenVersion || 0,
      });
      setAuthCookie(res, token);
      return res.json({
        ok: true,
        user: {
          type: 'registered',
          id: userId,
          username: formatUsername(displayName, upperTag),
          display_name: displayName,
          tag: upperTag,
        },
      });
    }

    return res.status(400).json({ error: 'Unsupported user type.' });
  } catch (err) {
    console.error('[/api/auth/settings]', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
