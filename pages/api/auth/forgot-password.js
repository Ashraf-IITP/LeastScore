// pages/api/auth/forgot-password.js
// Generates a random temp password, emails it, and updates the user's hash.
import { getPool } from '../../../lib/db';
import { hashPassword, buildDisplayName } from '../../../lib/auth';
import { sendMail } from '../../../lib/mailer';

/** Generate a readable random password like "Ax7#mP2k" */
function generateTempPassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
  let pass = '';
  for (let i = 0; i < length; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }
  return pass;
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

    const [rows] = await pool.query(
      `SELECT id, first_name, last_name, nickname, auth_provider
       FROM users WHERE LOWER(email) = ? AND auth_provider = 'local' LIMIT 1`,
      [normalizedEmail]
    );

    if (!rows.length) {
      return res.json({ ok: true });
    }

    const user = rows[0];
    const tempPassword = generateTempPassword();
    const newHash = await hashPassword(tempPassword);

    await pool.query(
      `UPDATE users SET password_hash = ?, token_version = token_version + 1, must_reset_password = 1 WHERE id = ?`,
      [newHash, user.id]
    );

    const displayName = buildDisplayName(user.first_name, user.last_name, user.nickname);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    await sendMail({
      to: normalizedEmail,
      subject: 'Your LeastScore temporary password',
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;background:#07090F;color:#E2E8F0;padding:40px 0;min-height:100vh">
          <div style="max-width:480px;margin:0 auto;background:#0D1117;border-radius:20px;border:1px solid rgba(255,255,255,0.07);overflow:hidden">
            <div style="background:linear-gradient(135deg,#1a2040 0%,#0D1117 100%);padding:32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.05)">
              <div style="font-size:48px;margin-bottom:12px">🃏</div>
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#F0F4FF;letter-spacing:2px">LEASTSCORE</h1>
              <p style="margin:8px 0 0;color:#8896A7;font-size:13px">Password Reset</p>
            </div>
            <div style="padding:32px">
              <p style="color:#A8B4C2;font-size:15px;margin:0 0 8px">Hi <strong style="color:#F0F4FF">${displayName}</strong>,</p>
              <p style="color:#A8B4C2;font-size:14px;line-height:1.6;margin:0 0 24px">
                A temporary password has been generated for your account <strong style="color:#FFC857">${normalizedEmail}</strong>.
                Use it to log in, then change your password from Settings right away.
              </p>
              <div style="background:rgba(255,200,87,0.08);border:1px solid rgba(255,200,87,0.25);border-radius:14px;padding:20px;text-align:center;margin-bottom:24px">
                <p style="margin:0 0 6px;font-size:11px;color:#8896A7;text-transform:uppercase;letter-spacing:0.1em">Temporary Password</p>
                <p style="margin:0;font-size:26px;font-weight:700;color:#FFC857;letter-spacing:4px;font-family:monospace">${tempPassword}</p>
              </div>
              <a href="${baseUrl}/login" style="display:block;background:linear-gradient(135deg,#3A4DFF,#2D3DE6);color:#fff;text-decoration:none;text-align:center;padding:14px;border-radius:12px;font-weight:600;font-size:15px;margin-bottom:24px">
                Log In Now →
              </a>
              <p style="color:#4A5568;font-size:12px;line-height:1.6;margin:0">
                If you didn't request this, your account may be at risk. Please contact support immediately.<br><br>
                This password is valid until you change it. All existing sessions have been logged out.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `Hi ${displayName},\n\nYour temporary LeastScore password for ${normalizedEmail} is:\n\n${tempPassword}\n\nLog in at ${baseUrl}/login then change your password from Settings.\n\nIf you didn't request this, contact support.`,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('[/api/auth/forgot-password]', err);
    return res.status(500).json({ error: 'Failed to send reset email. Please try again.' });
  }
}
