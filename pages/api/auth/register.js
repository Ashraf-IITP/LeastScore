// pages/api/auth/register.js — Register a new local user (phone + OTP + username + password)
import { getPool } from '../../../lib/db';
import {
  hashPassword, signJWT, setAuthCookie,
  validateName, validateTag, formatUsername, getUserFromRequest,
} from '../../../lib/auth';
import { clearGuestUpgradeIntent } from '../../../lib/guestUpgradeIntent';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { phone, displayName, tag, password, guestSessionId } = req.body || {};

  // ── Validate inputs ───────────────────────────────────────
  if (!phone || !displayName || !tag || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (!validateName(displayName)) {
    return res.status(400).json({ error: 'Name must be 3–20 characters: letters, numbers, underscores only.' });
  }
  const upperTag = tag.toUpperCase();
  if (!validateTag(upperTag)) {
    return res.status(400).json({ error: 'ID must be exactly 4 uppercase alphanumeric characters.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    const pool = getPool();

    // ── Check OTP was verified for this phone ─────────────────
    const [otpRows] = await pool.query(
      `SELECT id FROM otp_sessions
       WHERE phone = ? AND verified = 1 AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [phone]
    );
    if (!otpRows.length) {
      return res.status(400).json({ error: 'Phone not verified. Please complete OTP verification first.' });
    }

    // ── Check username uniqueness (users + guest_sessions) ────
    const [existingUser] = await pool.query(
      'SELECT id FROM users WHERE display_name = ? AND tag = ?',
      [displayName, upperTag]
    );
    if (existingUser.length) {
      return res.status(409).json({ error: `Username ${formatUsername(displayName, upperTag)} is already taken.` });
    }
    const [existingGuest] = await pool.query(
      'SELECT id FROM guest_sessions WHERE display_name = ? AND tag = ? AND expires_at > NOW() AND (? IS NULL OR id <> ?)',
      [displayName, upperTag, guestSessionId || null, guestSessionId || null]
    );
    if (existingGuest.length) {
      return res.status(409).json({ error: `Username ${formatUsername(displayName, upperTag)} is currently in use by a guest.` });
    }

    // If upgrading from guest, validate ownership via current guest auth session.
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

    // ── Create user ───────────────────────────────────────────
    const passwordHash = await hashPassword(password);
    const [result] = await pool.query(
      `INSERT INTO users (display_name, tag, auth_provider, phone, password_hash)
       VALUES (?, ?, 'local', ?, ?)`,
      [displayName, upperTag, phone, passwordHash]
    );
    const userId = result.insertId;

    // ── Clean up used OTP ─────────────────────────────────────
    await pool.query('DELETE FROM otp_sessions WHERE phone = ?', [phone]);

    // ── If this was a guest upgrade, remove old guest identity ─
    if (guestSessionId) {
      await pool.query('DELETE FROM guest_sessions WHERE id = ?', [guestSessionId]);
      clearGuestUpgradeIntent(guestSessionId);
    }

    // ── Issue JWT ─────────────────────────────────────────────
    const token = signJWT({
      userId, tokenVersion: 0,
      username: formatUsername(displayName, upperTag),
      display_name: displayName, tag: upperTag,
      type: 'registered',
    });
    setAuthCookie(res, token);
    return res.status(201).json({
      ok: true,
      user: { username: formatUsername(displayName, upperTag), display_name: displayName, tag: upperTag },
    });
  } catch (err) {
    console.error('[/api/auth/register]', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
}
