// pages/api/auth/otp/send.js — Generate OTP and send via Twilio WhatsApp
import { getPool } from '../../../../lib/db';

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { phone } = req.body || {};
  if (!phone || !/^\+[1-9]\d{6,14}$/.test(phone)) {
    return res.status(400).json({ error: 'Provide a valid phone number in E.164 format (e.g. +919876543210).' });
  }

  try {
    const pool = getPool();
    const otp  = generateOTP();

    // Delete any previous OTP for this phone, then insert fresh one (10-min TTL)
    await pool.query('DELETE FROM otp_sessions WHERE phone = ?', [phone]);
    await pool.query(
      'INSERT INTO otp_sessions (phone, otp_code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))',
      [phone, otp]
    );

    // ── Send via Twilio WhatsApp ──────────────────────────────
    const sid   = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from  = process.env.TWILIO_WHATSAPP_FROM;

    if (!sid || !token || !from) {
      // Twilio not configured — log OTP to server console (dev mode only)
      console.warn(`[DEV] WhatsApp OTP for ${phone}: ${otp}`);
      return res.json({ ok: true, dev: true, message: 'Twilio not configured. OTP logged to server console.' });
    }

    const twilio = require('twilio')(sid, token);
    await twilio.messages.create({
      from,
      to:   `whatsapp:${phone}`,
      body: `Your LeastScore verification code is: *${otp}*\nValid for 10 minutes. Do not share this with anyone.`,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('[/api/auth/otp/send]', err);
    return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
}
