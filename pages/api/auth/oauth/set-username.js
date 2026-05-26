// pages/api/auth/oauth/set-username.js — Set username for brand-new OAuth users
import { getPool } from '../../../../lib/db';
import {
  verifyJWT, signJWT, setAuthCookie,
  validateName, validateTag, formatUsername, getUserFromRequest,
} from '../../../../lib/auth';
import { clearGuestUpgradeIntent } from '../../../../lib/guestUpgradeIntent';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { tempToken, displayName, tag, guestSessionId } = req.body || {};
  if (!tempToken || !displayName || !tag) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Verify the short-lived OAuth temp token
  const decoded = verifyJWT(tempToken);
  if (!decoded || !decoded.provider || !decoded.providerId) {
    return res.status(401).json({ error: 'Session expired. Please log in with your social account again.' });
  }

  const upperTag = tag.toUpperCase();
  if (!validateName(displayName)) {
    return res.status(400).json({ error: 'Name must be 3–20 characters: letters, numbers, underscores only.' });
  }
  if (!validateTag(upperTag)) {
    return res.status(400).json({ error: 'ID must be exactly 4 uppercase alphanumeric characters.' });
  }

  try {
    const pool = getPool();

    // Check username uniqueness
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE display_name = ? AND tag = ?',
      [displayName, upperTag]
    );
    if (existing.length) {
      return res.status(409).json({ error: `${formatUsername(displayName, upperTag)} is already taken.` });
    }
    const [existingGuest] = await pool.query(
      'SELECT id FROM guest_sessions WHERE display_name = ? AND tag = ? AND expires_at > NOW() AND (? IS NULL OR id <> ?)',
      [displayName, upperTag, guestSessionId || null, guestSessionId || null]
    );
    if (existingGuest.length) {
      return res.status(409).json({ error: `${formatUsername(displayName, upperTag)} is currently used by a guest.` });
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

    // Create the user
    const [result] = await pool.query(
      `INSERT INTO users (display_name, tag, auth_provider, provider_id, email)
       VALUES (?, ?, ?, ?, ?)`,
      [displayName, upperTag, decoded.provider, decoded.providerId, decoded.email || null]
    );

    const token = signJWT({
      userId: result.insertId, tokenVersion: 0,
      username: formatUsername(displayName, upperTag),
      display_name: displayName, tag: upperTag, type: 'registered',
    });
    setAuthCookie(res, token);

    if (guestSessionId) {
      await pool.query('DELETE FROM guest_sessions WHERE id = ?', [guestSessionId]);
      clearGuestUpgradeIntent(guestSessionId);
    }

    return res.status(201).json({
      ok: true,
      user: { username: formatUsername(displayName, upperTag), display_name: displayName, tag: upperTag },
    });
  } catch (err) {
    console.error('[/api/auth/oauth/set-username]', err);
    return res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
}
