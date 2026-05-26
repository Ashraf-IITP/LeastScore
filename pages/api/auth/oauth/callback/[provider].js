// pages/api/auth/oauth/callback/[provider].js — Handle OAuth callback
import axios from 'axios';
import { getPool } from '../../../../../lib/db';
import { signJWT, signTempJWT, setAuthCookie, formatUsername } from '../../../../../lib/auth';

// ── Token exchange helpers ────────────────────────────────────
async function exchangeGoogle(code, redirectUri) {
  const { data } = await axios.post('https://oauth2.googleapis.com/token', {
    code, client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: redirectUri, grant_type: 'authorization_code',
  });
  const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${data.access_token}` },
  });
  return { providerId: profile.sub, email: profile.email, name: profile.name };
}



async function exchangeFacebook(code, redirectUri) {
  const { data } = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
    params: {
      code, client_id: process.env.FACEBOOK_CLIENT_ID,
      client_secret: process.env.FACEBOOK_CLIENT_SECRET, redirect_uri: redirectUri,
    },
  });
  const { data: profile } = await axios.get('https://graph.facebook.com/me', {
    params: { fields: 'id,name,email', access_token: data.access_token },
  });
  return { providerId: profile.id, email: profile.email, name: profile.name };
}



// ── Main handler ──────────────────────────────────────────────
export default async function handler(req, res) {
  const { provider, code, state, error } = req.query;
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const redirectUri = `${base}/api/auth/oauth/callback/${provider}`;

  if (error) return res.redirect(`/login?error=${encodeURIComponent('OAuth login was cancelled or denied.')}`);
  if (!code) return res.redirect(`/login?error=${encodeURIComponent('No code received from provider.')}`);

  // CSRF state check
  const cookieHeader = req.headers.cookie || '';
  const savedState   = (cookieHeader.match(/oauth_state=([^;]+)/) || [])[1];
  if (!savedState || savedState !== state) {
    return res.redirect(`/login?error=${encodeURIComponent('Security check failed. Please try again.')}`);
  }

  // Optional guest-upgrade context (set before OAuth redirect).
  let upgradeGuest = null;
  const upgradeMatch = cookieHeader.match(/(?:^|;\s*)upgrade_guest=([^;]+)/);
  if (upgradeMatch) {
    try {
      upgradeGuest = JSON.parse(decodeURIComponent(upgradeMatch[1]));
    } catch {
      upgradeGuest = null;
    }
  }
  res.setHeader('Set-Cookie', 'upgrade_guest=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');

  try {
    let profile;
    if      (provider === 'google')    profile = await exchangeGoogle(code, redirectUri);
    else if (provider === 'facebook')  profile = await exchangeFacebook(code, redirectUri);
    else return res.redirect(`/login?error=${encodeURIComponent('Unknown provider.')}`);

    const pool = getPool();

    // Check if user already exists
    const [rows] = await pool.query(
      'SELECT id, display_name, tag, token_version FROM users WHERE auth_provider = ? AND provider_id = ?',
      [provider, profile.providerId]
    );

    if (rows.length) {
      // Existing user — log them in
      const u = rows[0];
      const token = signJWT({
        userId: u.id, tokenVersion: u.token_version,
        username: formatUsername(u.display_name, u.tag),
        display_name: u.display_name, tag: u.tag, type: 'registered',
      });
      setAuthCookie(res, token);
      return res.redirect('/');
    }

    // New social user — ask them to pick a username
    const tempToken = signTempJWT({ provider, providerId: profile.providerId, email: profile.email, suggestedName: profile.name });
    const query = new URLSearchParams({
      step: 'choose-username',
      provider,
      tempToken,
      suggestedName: profile.name || ''
    });
    if (upgradeGuest?.guestSessionId) query.set('guestSessionId', String(upgradeGuest.guestSessionId));
    if (upgradeGuest?.guestName) query.set('guestName', upgradeGuest.guestName);
    if (upgradeGuest?.guestTag) query.set('guestTag', String(upgradeGuest.guestTag).toUpperCase());
    return res.redirect(`/login?${query.toString()}`);
  } catch (err) {
    console.error(`[/api/auth/oauth/callback/${provider}]`, err);
    return res.redirect(`/login?error=${encodeURIComponent('OAuth login failed. Please try again.')}`);
  }
}
