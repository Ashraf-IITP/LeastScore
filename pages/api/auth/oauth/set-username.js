// pages/api/auth/oauth/set-username.js — Set profile for brand-new OAuth users
import { getPool } from '../../../../lib/db';
import {
  verifyJWT, signJWT, setAuthCookie, validateName, getUserFromRequest, buildRegisteredJWTPayload,
} from '../../../../lib/auth';
import { clearGuestUpgradeIntent } from '../../../../lib/guestUpgradeIntent';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { tempToken, firstName, lastName, nickname, guestSessionId, countryId, dob, gender } = req.body || {};
  if (!tempToken || !firstName || !nickname || !countryId || !dob) {
    return res.status(400).json({ error: 'First Name, Nickname, Country, and DOB are required.' });
  }

  const decoded = verifyJWT(tempToken);
  if (!decoded || !decoded.provider || !decoded.providerId) {
    return res.status(401).json({ error: 'Session expired. Please log in with your social account again.' });
  }
  if (!decoded.email) {
    return res.status(400).json({ error: 'Email is required from your social account.' });
  }

  if (!validateName(firstName) || !validateName(nickname)) {
    return res.status(400).json({ error: 'Name must be 3–20 characters: letters, numbers, spaces, underscores only.' });
  }
  if (lastName && !validateName(lastName)) {
    return res.status(400).json({ error: 'Last name must be 3–20 characters: letters, numbers, spaces, underscores only.' });
  }

  const normalizedEmail = decoded.email.trim().toLowerCase();

  try {
    const pool = getPool();

    const [existingEmail] = await pool.query('SELECT id FROM users WHERE LOWER(email) = ?', [normalizedEmail]);
    if (existingEmail.length) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    if (guestSessionId) {
      const currentUser = getUserFromRequest(req);
      if (
        !currentUser ||
        currentUser.type !== 'guest' ||
        Number(currentUser.guestSessionId) !== Number(guestSessionId)
      ) {
        return res.status(400).json({ error: 'Invalid guest upgrade session. Please retry from your guest account.' });
      }
      const [guestRows] = await pool.query('SELECT id FROM guest_sessions WHERE id = ?', [guestSessionId]);
      if (!guestRows.length) {
        return res.status(400).json({ error: 'Guest session expired. Please create a guest account again.' });
      }
    }

    const [result] = await pool.query(
      `INSERT INTO users (first_name, last_name, nickname, auth_provider, provider_id, email, country_id, dob, gender)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName || null,
        nickname,
        decoded.provider,
        decoded.providerId,
        normalizedEmail,
        countryId ? parseInt(countryId, 10) : null,
        dob || null,
        gender || null,
      ]
    );

    const user = {
      id: result.insertId,
      token_version: 0,
      first_name: firstName,
      last_name: lastName || null,
      nickname,
      email: normalizedEmail,
    };
    const token = signJWT(buildRegisteredJWTPayload(user));
    setAuthCookie(res, token);

    if (guestSessionId) {
      await pool.query('DELETE FROM guest_sessions WHERE id = ?', [guestSessionId]);
      clearGuestUpgradeIntent(guestSessionId);
    }

    return res.status(201).json({
      ok: true,
      token,
      user: {
        id: user.id,
        first_name: firstName,
        last_name: lastName || null,
        nickname,
        email: normalizedEmail,
        displayName: buildRegisteredJWTPayload(user).displayName,
      },
    });
  } catch (err) {
    console.error('[/api/auth/oauth/set-username]', err);
    if (err?.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    return res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
}
