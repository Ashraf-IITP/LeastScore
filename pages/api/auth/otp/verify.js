// pages/api/auth/otp/verify.js — Verify OTP code (marks it as verified)
import { getPool } from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { phone, otp } = req.body || {};
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required.' });
  }

  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT id FROM otp_sessions
       WHERE phone = ? AND otp_code = ? AND expires_at > NOW() AND verified = 0
       ORDER BY created_at DESC LIMIT 1`,
      [phone, String(otp).trim()]
    );

    if (!rows.length) {
      return res.status(400).json({ error: 'Invalid or expired OTP. Please request a new one.' });
    }

    // Mark as verified so it can be consumed by the register endpoint
    await pool.query('UPDATE otp_sessions SET verified = 1 WHERE id = ?', [rows[0].id]);
    return res.json({ ok: true });
  } catch (err) {
    console.error('[/api/auth/otp/verify]', err);
    return res.status(500).json({ error: 'Server error.' });
  }
}
