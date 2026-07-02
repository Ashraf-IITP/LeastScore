import { getUserFromRequest, signJWT, setAuthCookie, buildRegisteredJWTPayload } from '../../../lib/auth';
import { getPool } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const decoded = getUserFromRequest(req);
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

  const pool = getPool();

  try {
    if (decoded.type === 'guest') {
      const { nickname } = req.body || {};
      if (!nickname) return res.status(400).json({ error: 'Nickname is required.' });

      const guestSessionId = decoded.guestSessionId;
      const [existing] = await pool.query(
        'SELECT id FROM guest_sessions WHERE nickname = ? AND id <> ? AND expires_at > NOW()',
        [nickname, guestSessionId]
      );
      if (existing.length) return res.status(409).json({ error: 'Nickname already taken by another guest.' });

      const [result] = await pool.query(
        'UPDATE guest_sessions SET nickname = ? WHERE id = ? AND expires_at > NOW()',
        [nickname, guestSessionId]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Guest session not found or expired.' });

      const token = signJWT({
        type: 'guest',
        guestSessionId,
        nickname,
      });
      setAuthCookie(res, token);
      return res.json({ ok: true, user: { type: 'guest', nickname, guestSessionId } });
    }

    if (decoded.type === 'registered') {
      const { firstName, lastName, nickname } = req.body || {};
      if (!firstName || !nickname) return res.status(400).json({ error: 'First name and nickname are required.' });

      const userId = decoded.userId;

      const [result] = await pool.query(
        'UPDATE users SET first_name = ?, last_name = ?, nickname = ? WHERE id = ?',
        [firstName, lastName || null, nickname, userId]
      );

      if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found.' });

      const [rows] = await pool.query(
        'SELECT id, first_name, last_name, nickname, email, token_version FROM users WHERE id = ?',
        [userId]
      );
      const user = rows[0];
      const token = signJWT({
        ...buildRegisteredJWTPayload(user),
        mustResetPassword: !!decoded.mustResetPassword,
      });
      setAuthCookie(res, token);
      return res.json({ ok: true });
    }

    return res.status(400).json({ error: 'Unsupported user type.' });
  } catch (err) {
    console.error('[/api/auth/settings]', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
