// pages/api/auth/otp/send.js — Generate OTP and send via Email
import { getPool } from '../../../../lib/db';
import { sendMail } from '../../../../lib/mailer';

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body || {};
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const pool = getPool();
    const otp  = generateOTP();

    // Delete any previous OTP for this email, then insert fresh one (10-min TTL)
    await pool.query('DELETE FROM otp_sessions WHERE email = ?', [normalizedEmail]);
    await pool.query(
      'INSERT INTO otp_sessions (email, otp_code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))',
      [normalizedEmail, otp]
    );

    // ── Send via NodeMailer ──────────────────────────────
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    await sendMail({
      to: normalizedEmail,
      subject: 'Your LeastScore verification code',
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;background:#07090F;color:#E2E8F0;padding:40px 0;min-height:100vh">
          <div style="max-width:480px;margin:0 auto;background:#0D1117;border-radius:20px;border:1px solid rgba(255,255,255,0.07);overflow:hidden">
            <div style="background:linear-gradient(135deg,#1a2040 0%,#0D1117 100%);padding:32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.05)">
              <div style="font-size:48px;margin-bottom:12px">🃏</div>
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#F0F4FF;letter-spacing:2px">LEASTSCORE</h1>
              <p style="margin:8px 0 0;color:#8896A7;font-size:13px">Account Verification</p>
            </div>
            <div style="padding:32px">
              <p style="color:#A8B4C2;font-size:15px;margin:0 0 8px">Hello,</p>
              <p style="color:#A8B4C2;font-size:14px;line-height:1.6;margin:0 0 24px">
                Use the following verification code to complete your signup process. This code is valid for 10 minutes.
              </p>
              <div style="background:rgba(255,200,87,0.08);border:1px solid rgba(255,200,87,0.25);border-radius:14px;padding:20px;text-align:center;margin-bottom:24px">
                <p style="margin:0 0 6px;font-size:11px;color:#8896A7;text-transform:uppercase;letter-spacing:0.1em">Verification Code</p>
                <p style="margin:0;font-size:26px;font-weight:700;color:#FFC857;letter-spacing:4px;font-family:monospace">${otp}</p>
              </div>
              <p style="color:#4A5568;font-size:12px;line-height:1.6;margin:0">
                If you didn't request this code, please ignore this email.<br><br>
              </p>
            </div>
          </div>
        </div>
      `,
      text: \`Hello,\n\nYour LeastScore verification code is:\n\n\${otp}\n\nIt is valid for 10 minutes.\n\nIf you didn't request this, please ignore.\`,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('[/api/auth/otp/send]', err);
    return res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
  }
}
