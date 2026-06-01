// pages/api/auth/change-password.js
// Allows a logged-in local user to change their password (verifies current first).
import { getUserFromRequest, verifyPassword, hashPassword, signJWT, setAuthCookie, formatUsername } from '../../../lib/auth';
import { getPool } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const decoded = getUserFromRequest(req);
  if (!decoded || decoded.type !== 'registered') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT id, display_name, tag, password_hash, token_version, auth_provider
       FROM users WHERE id = ? AND auth_provider = 'local'`,
      [decoded.userId]
    );

    if (!rows.length) {
      return res.status(403).json({ error: 'Password change is only available for local accounts.' });
    }
    const user = rows[0];

    const valid = await verifyPassword(currentPassword, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    const newHash = await hashPassword(newPassword);
    await pool.query(
      `UPDATE users SET password_hash = ?, token_version = token_version + 1 WHERE id = ?`,
      [newHash, user.id]
    );

    // Re-fetch updated token_version and issue fresh JWT
    const [[updated]] = await pool.query('SELECT token_version FROM users WHERE id = ?', [user.id]);
    const token = signJWT({
      userId:           user.id,
      tokenVersion:     updated.token_version,
      username:         formatUsername(user.display_name, user.tag),
      display_name:     user.display_name,
      tag:              user.tag,
      type:             'registered',
      mustResetPassword: false,
    });
    setAuthCookie(res, token);

    return res.json({ ok: true });
  } catch (err) {
    console.error('[/api/auth/change-password]', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
