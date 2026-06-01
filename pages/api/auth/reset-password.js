// pages/api/auth/reset-password.js
// Forces password update when user has a temp password. Clears must_reset_password flag.
import { getUserFromRequest, hashPassword, signJWT, setAuthCookie, formatUsername } from '../../../lib/auth';
import { getPool } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const decoded = getUserFromRequest(req);
  if (!decoded || decoded.type !== 'registered') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!decoded.mustResetPassword) {
    return res.status(403).json({ error: 'Password reset not required for this session.' });
  }

  const { newPassword, confirmPassword } = req.body || {};
  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'Both fields are required.' });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    const pool = getPool();

    // Fetch current user to ensure they still exist
    const [rows] = await pool.query(
      `SELECT id, display_name, tag, token_version FROM users WHERE id = ? AND auth_provider = 'local'`,
      [decoded.userId]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found.' });
    const user = rows[0];

    const newHash = await hashPassword(newPassword);

    // Save new hash, clear must_reset_password, bump token_version to invalidate old sessions
    await pool.query(
      `UPDATE users
       SET password_hash = ?, must_reset_password = 0, token_version = token_version + 1
       WHERE id = ?`,
      [newHash, user.id]
    );

    // Re-fetch updated token_version
    const [[updated]] = await pool.query('SELECT token_version FROM users WHERE id = ?', [user.id]);

    // Issue a fresh JWT without mustResetPassword
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
    console.error('[/api/auth/reset-password]', err);
    return res.status(500).json({ error: 'Failed to update password. Please try again.' });
  }
}
