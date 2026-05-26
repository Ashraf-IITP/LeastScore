// pages/api/auth/me.js — Return current user from JWT cookie
import { getUserFromRequest } from '../../../lib/auth';
import { getPool } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const decoded = getUserFromRequest(req);
  if (!decoded) return res.status(401).json({ user: null });

  try {
    if (decoded.type === 'guest') {
      // Verify guest session still exists in DB
      const pool = getPool();
      const [rows] = await pool.query(
        'SELECT id, display_name, tag, expires_at FROM guest_sessions WHERE id = ? AND expires_at > NOW()',
        [decoded.guestSessionId]
      );
      if (!rows.length) return res.status(401).json({ user: null });
      const g = rows[0];
      return res.json({
        user: {
          type:     'guest',
          username: `${g.display_name}#${g.tag}`,
          display_name: g.display_name,
          tag:      g.tag,
          guestSessionId: g.id,
        },
      });
    }

    // Registered user — verify token_version matches DB
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT id, display_name, tag, auth_provider, token_version FROM users WHERE id = ?',
      [decoded.userId]
    );
    if (!rows.length || rows[0].token_version !== decoded.tokenVersion) {
      return res.status(401).json({ user: null });
    }
    const u = rows[0];
    return res.json({
      user: {
        type:         'registered',
        id:           u.id,
        username:     `${u.display_name}#${u.tag}`,
        display_name: u.display_name,
        tag:          u.tag,
        auth_provider: u.auth_provider,
      },
    });
  } catch (err) {
    console.error('[/api/auth/me]', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
