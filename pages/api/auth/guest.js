// pages/api/auth/guest.js — Create a temporary guest with a random username
import { getPool } from '../../../lib/db';
import { signJWT, setAuthCookie } from '../../../lib/auth';

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

const MAX_GUEST_NAME_ATTEMPTS = 50;

function randomGuestIdentity() {
  const baseName = GUEST_NAMES[Math.floor(Math.random() * GUEST_NAMES.length)];
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${baseName}${suffix}`.slice(0, 20);
}

async function createUniqueGuestSession(pool) {
  for (let attempt = 0; attempt < MAX_GUEST_NAME_ATTEMPTS; attempt += 1) {
    const nickname = randomGuestIdentity();

    try {
      const [result] = await pool.query(
        `INSERT INTO guest_sessions (nickname, expires_at)
         VALUES (?, DATE_ADD(NOW(), INTERVAL 7 DAY))`,
        [nickname]
      );
      return { guestSessionId: result.insertId, nickname };
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
    const { guestSessionId, nickname } = await createUniqueGuestSession(pool);

    const token = signJWT({
      type:           'guest',
      guestSessionId,
      nickname,
    });
    setAuthCookie(res, token);
    return res.status(201).json({
      ok: true,
      token,                                          // mobile clients store this via saveToken()
      user: { type: 'guest', nickname, guestSessionId },
    });
  } catch (err) {
    console.error('[/api/auth/guest]', err);
    return res.status(500).json({ error: 'Could not create guest session. Please try again.' });
  }
}
