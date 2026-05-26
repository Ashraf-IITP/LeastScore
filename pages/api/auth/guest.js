// pages/api/auth/guest.js — Claim a temporary guest username
import { getPool } from '../../../lib/db';
import { signJWT, setAuthCookie, validateName, validateTag, formatUsername } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { displayName, tag } = req.body || {};

  if (!displayName || !tag) {
    return res.status(400).json({ error: 'Name and ID are required.' });
  }
  if (!validateName(displayName)) {
    return res.status(400).json({ error: 'Name must be 3–20 characters: letters, numbers, underscores only.' });
  }
  const upperTag = tag.toUpperCase();
  if (!validateTag(upperTag)) {
    return res.status(400).json({ error: 'ID must be exactly 4 uppercase alphanumeric characters.' });
  }

  try {
    const pool = getPool();

    // Block if a registered user already has this username
    const [existingUser] = await pool.query(
      'SELECT id FROM users WHERE display_name = ? AND tag = ?',
      [displayName, upperTag]
    );
    if (existingUser.length) {
      return res.status(409).json({ error: `${formatUsername(displayName, upperTag)} is registered. Please choose a different ID.` });
    }

    // Block if an active guest session holds this username
    const [existingGuest] = await pool.query(
      'SELECT id FROM guest_sessions WHERE display_name = ? AND tag = ? AND expires_at > NOW()',
      [displayName, upperTag]
    );
    if (existingGuest.length) {
      return res.status(409).json({ error: `${formatUsername(displayName, upperTag)} is currently in use. Try a different ID.` });
    }

    // Insert guest session — expires far in the future while active;
    // server's disconnect handler will set it to NOW()+60s on disconnect.
    const [result] = await pool.query(
      `INSERT INTO guest_sessions (display_name, tag, expires_at)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))`,
      [displayName, upperTag]
    );
    const guestSessionId = result.insertId;

    const token = signJWT({
      type:           'guest',
      guestSessionId,
      username:       formatUsername(displayName, upperTag),
      display_name:   displayName,
      tag:            upperTag,
    });
    setAuthCookie(res, token);
    return res.status(201).json({
      ok: true,
      user: { type: 'guest', username: formatUsername(displayName, upperTag), guestSessionId },
    });
  } catch (err) {
    console.error('[/api/auth/guest]', err);
    return res.status(500).json({ error: 'Could not create guest session. Please try again.' });
  }
}
