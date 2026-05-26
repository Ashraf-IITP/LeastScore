// pages/api/auth/logout.js — Clear the auth cookie
import { clearAuthCookie } from '../../../lib/auth';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  clearAuthCookie(res);
  return res.json({ ok: true });
}
