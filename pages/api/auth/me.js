// pages/api/auth/me.js — Return current user from JWT cookie
import {
  getUserFromRequest,
  buildDisplayName,
  isRegisteredProfileComplete,
  getMissingProfileFields,
} from '../../../lib/auth';
import { getPool } from '../../../lib/db';

async function getUserColumns(pool) {
  const [columns] = await pool.query('SHOW COLUMNS FROM users');
  return new Set(columns.map((column) => column.Field));
}

function userSelectList(columns) {
  const firstName = columns.has('first_name')
    ? 'first_name'
    : columns.has('display_name')
      ? 'display_name AS first_name'
      : 'NULL AS first_name';
  const lastName = columns.has('last_name') ? 'last_name' : 'NULL AS last_name';

  let nickname = 'NULL AS nickname';
  if (columns.has('nickname')) {
    nickname = 'nickname';
  } else if (columns.has('display_name') && columns.has('tag')) {
    nickname = "CONCAT(display_name, '#', tag) AS nickname";
  } else if (columns.has('display_name')) {
    nickname = 'display_name AS nickname';
  }

  const email = columns.has('email') ? 'email' : 'NULL AS email';
  const authProvider = columns.has('auth_provider') ? 'auth_provider' : "'local' AS auth_provider";
  const tokenVersion = columns.has('token_version') ? 'token_version' : '0 AS token_version';
  const mustResetPassword = columns.has('must_reset_password')
    ? 'must_reset_password'
    : '0 AS must_reset_password';
  const countryId = columns.has('country_id') ? 'country_id' : 'NULL AS country_id';
  const dob = columns.has('dob') ? 'dob' : 'NULL AS dob';
  const gender = columns.has('gender') ? 'gender' : 'NULL AS gender';

  return `id, ${firstName}, ${lastName}, ${nickname}, ${email}, ${authProvider}, ${tokenVersion}, ${mustResetPassword}, ${countryId}, ${dob}, ${gender}`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const decoded = getUserFromRequest(req);
  if (!decoded) return res.status(401).json({ user: null });

  try {
    if (decoded.type === 'guest') {
      // Verify guest session still exists in DB
      const pool = getPool();
      const [rows] = await pool.query(
        'SELECT id, nickname, expires_at FROM guest_sessions WHERE id = ? AND expires_at > NOW()',
        [decoded.guestSessionId]
      );
      if (!rows.length) return res.status(401).json({ user: null });
      const g = rows[0];
      return res.json({
        user: {
          type:     'guest',
          nickname: g.nickname,
          guestSessionId: g.id,
        },
      });
    }

    // Registered user — verify token_version matches DB
    const pool = getPool();
    const userColumns = await getUserColumns(pool);
    const selectUser = userSelectList(userColumns);
    const [rows] = await pool.query(
      `SELECT ${selectUser} FROM users WHERE id = ?`,
      [decoded.userId]
    );
    if (!rows.length || rows[0].token_version !== decoded.tokenVersion) {
      return res.status(401).json({ user: null });
    }
    const u = rows[0];
      return res.json({
        user: {
          type:              'registered',
          id:                u.id,
          userId:            u.id,
          displayName:       buildDisplayName(u.first_name, u.last_name, u.nickname),
          first_name:        u.first_name,
          last_name:         u.last_name,
          nickname:          u.nickname,
          email:             u.email,
          auth_provider:     u.auth_provider,
          mustResetPassword: !!u.must_reset_password,
          country_id:         u.country_id,
          dob:                u.dob,
          gender:             u.gender,
          profileComplete:    isRegisteredProfileComplete(u),
          missingProfileFields: getMissingProfileFields(u),
        },
      });
  } catch (err) {
    console.error('[/api/auth/me]', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
