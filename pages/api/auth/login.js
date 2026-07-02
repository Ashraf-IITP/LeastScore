// pages/api/auth/login.js — Login with email + password
import { getPool } from '../../../lib/db';
import { verifyPassword, signJWT, setAuthCookie, buildRegisteredJWTPayload } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { loginId, password } = req.body || {};
  if (!loginId || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = loginId.trim().toLowerCase();

  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT id, first_name, last_name, nickname, email, password_hash, token_version, auth_provider, must_reset_password
       FROM users WHERE email = ? LIMIT 1`,
      [normalizedEmail]
    );

    if (!rows.length) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }
    const user = rows[0];

    if (user.auth_provider !== 'local' || !user.password_hash) {
      return res.status(401).json({
        error: `This account was registered with ${user.auth_provider}. Please use that login method.`,
      });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    const jwtPayload = {
      ...buildRegisteredJWTPayload(user),
      mustResetPassword: !!user.must_reset_password,
    };
    const token = signJWT(jwtPayload);

    setAuthCookie(res, token);
    return res.json({
      ok: true,
      token,                             // mobile clients store this; web ignores it
      mustResetPassword: !!user.must_reset_password,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        nickname: user.nickname,
        email: user.email,
        displayName: jwtPayload.displayName,
      },
    });
  } catch (err) {
    console.error('[/api/auth/login]', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
}
