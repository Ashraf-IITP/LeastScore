import {
  getUserFromRequest,
  signJWT,
  setAuthCookie,
  buildRegisteredJWTPayload,
  validateName,
  isRegisteredProfileComplete,
  getMissingProfileFields,
} from '../../../lib/auth';
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
      const body = req.body || {};
      const { firstName, lastName, nickname, countryId, dob, gender } = body;
      if (!firstName || !nickname) return res.status(400).json({ error: 'First name and nickname are required.' });
      if (!validateName(firstName) || !validateName(nickname)) {
        return res.status(400).json({ error: 'Names must be 3-20 characters: letters, numbers, spaces, underscores only.' });
      }
      if (lastName && !validateName(lastName)) {
        return res.status(400).json({ error: 'Last name must be 3-20 characters: letters, numbers, spaces, underscores only.' });
      }
      if (Object.prototype.hasOwnProperty.call(body, 'countryId') && !countryId) {
        return res.status(400).json({ error: 'Country is required.' });
      }
      if (Object.prototype.hasOwnProperty.call(body, 'dob') && !dob) {
        return res.status(400).json({ error: 'DOB is required.' });
      }
      if (Object.prototype.hasOwnProperty.call(body, 'gender') && !gender) {
        return res.status(400).json({ error: 'Gender is required.' });
      }

      const userId = decoded.userId;
      const updates = ['first_name = ?', 'last_name = ?', 'nickname = ?'];
      const values = [firstName, lastName || null, nickname];

      if (Object.prototype.hasOwnProperty.call(body, 'countryId')) {
        updates.push('country_id = ?');
        values.push(parseInt(countryId, 10));
      }
      if (Object.prototype.hasOwnProperty.call(body, 'dob')) {
        updates.push('dob = ?');
        values.push(dob);
      }
      if (Object.prototype.hasOwnProperty.call(body, 'gender')) {
        updates.push('gender = ?');
        values.push(gender);
      }
      values.push(userId);

      const [result] = await pool.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found.' });

      const [rows] = await pool.query(
        'SELECT id, first_name, last_name, nickname, email, token_version, country_id, dob, gender FROM users WHERE id = ?',
        [userId]
      );
      const user = rows[0];
      const token = signJWT({
        ...buildRegisteredJWTPayload(user),
        mustResetPassword: !!decoded.mustResetPassword,
      });
      setAuthCookie(res, token);
      return res.json({
        ok: true,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          nickname: user.nickname,
          email: user.email,
          country_id: user.country_id,
          dob: user.dob,
          gender: user.gender,
          profileComplete: isRegisteredProfileComplete(user),
          missingProfileFields: getMissingProfileFields(user),
        },
      });
    }

    return res.status(400).json({ error: 'Unsupported user type.' });
  } catch (err) {
    console.error('[/api/auth/settings]', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
