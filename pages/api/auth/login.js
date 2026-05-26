// pages/api/auth/login.js — Login with username#tag + password
import { getPool } from '../../../lib/db';
import { verifyPassword, signJWT, setAuthCookie, formatUsername } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // Parse name#TAG
  const hashIndex = username.lastIndexOf('#');
  if (hashIndex === -1) {
    return res.status(400).json({ error: 'Username must be in the format Name#XXXX.' });
  }
  const displayName = username.slice(0, hashIndex);
  const tag         = username.slice(hashIndex + 1).toUpperCase();

  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT id, display_name, tag, password_hash, token_version, auth_provider
       FROM users WHERE display_name = ? AND tag = ?`,
      [displayName, tag]
    );

    if (!rows.length) {
      return res.status(401).json({ error: 'Incorrect username or password.' });
    }
    const user = rows[0];

    if (user.auth_provider !== 'local' || !user.password_hash) {
      return res.status(401).json({
        error: `This account was registered with ${user.auth_provider}. Please use that login method.`,
      });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Incorrect username or password.' });
    }

    const token = signJWT({
      userId:        user.id,
      tokenVersion:  user.token_version,
      username:      formatUsername(user.display_name, user.tag),
      display_name:  user.display_name,
      tag:           user.tag,
      type:          'registered',
    });
    setAuthCookie(res, token);
    return res.json({
      ok: true,
      user: { username: formatUsername(user.display_name, user.tag), display_name: user.display_name, tag: user.tag },
    });
  } catch (err) {
    console.error('[/api/auth/login]', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
}
