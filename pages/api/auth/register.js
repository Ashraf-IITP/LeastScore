// pages/api/auth/register.js — Register a new local user (email + profile + password)
import { getPool } from '../../../lib/db';
import {
  hashPassword, signJWT, setAuthCookie,
  validateName, validateEmail, buildRegisteredJWTPayload, getUserFromRequest,
} from '../../../lib/auth';
import { clearGuestUpgradeIntent } from '../../../lib/guestUpgradeIntent';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, firstName, lastName, nickname, password, guestSessionId, countryId, dob, gender } = req.body || {};

  if (!email || !firstName || !nickname || !password || !countryId || !dob || !gender) {
    return res.status(400).json({ error: 'Email, first name, nickname, country, DOB, gender, and password are required.' });
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (!validateEmail(normalizedEmail)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }
  if (!validateName(firstName) || !validateName(nickname)) {
    return res.status(400).json({ error: 'Names must be 3–20 characters: letters, numbers, spaces, underscores only.' });
  }
  if (lastName && !validateName(lastName)) {
    return res.status(400).json({ error: 'Last name must be 3–20 characters: letters, numbers, spaces, underscores only.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    const pool = getPool();

    const [existingUser] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [normalizedEmail]
    );
    if (existingUser.length) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Verify OTP session
    const [otpRows] = await pool.query(
      'SELECT id FROM otp_sessions WHERE email = ? AND verified = 1 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [normalizedEmail]
    );
    if (!otpRows.length) {
      return res.status(400).json({ error: 'Email verification required. Please verify your email first.' });
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

    const passwordHash = await hashPassword(password);
    const [result] = await pool.query(
      `INSERT INTO users (first_name, last_name, nickname, email, auth_provider, password_hash, country_id, dob, gender)
       VALUES (?, ?, ?, ?, 'local', ?, ?, ?, ?)`,
      [
        firstName,
        lastName || null,
        nickname,
        normalizedEmail,
        passwordHash,
        countryId ? parseInt(countryId, 10) : null,
        dob || null,
        gender || null,
      ]
    );
    const userId = result.insertId;

    if (guestSessionId) {
      await pool.query('DELETE FROM guest_sessions WHERE id = ?', [guestSessionId]);
      clearGuestUpgradeIntent(guestSessionId);
    }

    const jwtPayload = buildRegisteredJWTPayload({
      id: userId,
      token_version: 0,
      first_name: firstName,
      last_name: lastName || null,
      nickname,
      email: normalizedEmail,
    });
    const token = signJWT(jwtPayload);
    setAuthCookie(res, token);
    return res.status(201).json({
      ok: true,
      token,
      user: {
        id: userId,
        email: normalizedEmail,
        first_name: firstName,
        last_name: lastName || null,
        nickname,
        displayName: jwtPayload.displayName,
      },
    });
  } catch (err) {
    console.error('[/api/auth/register]', err);
    if (err?.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
}
