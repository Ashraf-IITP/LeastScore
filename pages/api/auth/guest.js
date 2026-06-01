// pages/api/auth/guest.js — Create a temporary guest with a random username
import { getPool } from '../../../lib/db';
import { signJWT, setAuthCookie, formatUsername } from '../../../lib/auth';

const GUEST_NAMES = [
  'CardShark',
  'LowRoller',
  'AceHunter',
  'SuitSeeker',
  'DeckDiver',
  'LuckyDraw',
  'QuietAce',
  'ScoreSaver',
  'TableNinja',
  'WildCard',
  'RoundRunner',
  'HandHero',
];

const TAG_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const MAX_GUEST_NAME_ATTEMPTS = 50;

function randomTag() {
  let tag = '';
  for (let i = 0; i < 4; i += 1) {
    tag += TAG_CHARS[Math.floor(Math.random() * TAG_CHARS.length)];
  }
  return tag;
}

function randomGuestIdentity() {
  const baseName = GUEST_NAMES[Math.floor(Math.random() * GUEST_NAMES.length)];
  const suffix = Math.floor(100 + Math.random() * 900);
  return {
    displayName: `${baseName}${suffix}`.slice(0, 20),
    tag: randomTag(),
  };
}

async function createUniqueGuestSession(pool) {
  for (let attempt = 0; attempt < MAX_GUEST_NAME_ATTEMPTS; attempt += 1) {
    const { displayName, tag } = randomGuestIdentity();

    const [existingUser] = await pool.query(
      'SELECT id FROM users WHERE display_name = ? AND tag = ?',
      [displayName, tag]
    );
    if (existingUser.length) continue;

    try {
      const [result] = await pool.query(
        `INSERT INTO guest_sessions (display_name, tag, expires_at)
         VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))`,
        [displayName, tag]
      );
      return { guestSessionId: result.insertId, displayName, tag };
    } catch (err) {
      if (err?.code === 'ER_DUP_ENTRY') continue;
      throw err;
    }
  }

  throw new Error('Unable to generate a unique guest username.');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const pool = getPool();
    const { guestSessionId, displayName, tag } = await createUniqueGuestSession(pool);

    const token = signJWT({
      type:           'guest',
      guestSessionId,
      username:       formatUsername(displayName, tag),
      display_name:   displayName,
      tag,
    });
    setAuthCookie(res, token);
    return res.status(201).json({
      ok: true,
      user: { type: 'guest', username: formatUsername(displayName, tag), guestSessionId },
    });
  } catch (err) {
    console.error('[/api/auth/guest]', err);
    return res.status(500).json({ error: 'Could not create guest session. Please try again.' });
  }
}
