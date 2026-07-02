// pages/api/auth/oauth/callback/[provider].js — Handle OAuth callback
import axios from 'axios';
import { getPool } from '../../../../../lib/db';
import { signJWT, signTempJWT, setAuthCookie, buildRegisteredJWTPayload } from '../../../../../lib/auth';

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
  return { providerId: profile.sub, email: profile.email, firstName: profile.given_name, lastName: profile.family_name };
}

async function exchangeFacebook(code, redirectUri) {
  const { data } = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
    params: {
      code, client_id: process.env.FACEBOOK_CLIENT_ID,
      client_secret: process.env.FACEBOOK_CLIENT_SECRET, redirect_uri: redirectUri,
    },
  });
  const { data: profile } = await axios.get('https://graph.facebook.com/me', {
    params: { fields: 'id,first_name,last_name,email', access_token: data.access_token },
  });
  return { providerId: profile.id, email: profile.email, firstName: profile.first_name, lastName: profile.last_name };
}

// ── Main handler ──────────────────────────────────────────────
export default async function handler(req, res) {
  const { provider, code, state, error } = req.query;
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const redirectUri = `${base}/api/auth/oauth/callback/${provider}`;

  // ── Read all cookies up-front ─────────────────────────────
  const cookieHeader = req.headers.cookie || '';

  // Detect Capacitor mobile client via the oauth_mobile cookie (set by initiation route with ?mobile=1)
  const isMobile = /(?:^|;\s*)oauth_mobile=1/.test(cookieHeader);

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

  // Clear all one-time OAuth cookies in a single header
  res.setHeader('Set-Cookie', [
    'oauth_mobile=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax',
    'upgrade_guest=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax',
  ]);

  // Helper: redirect errors to the correct destination (deep-link on mobile, /login on web)
  const redirectError = (msg) => {
    const encoded = encodeURIComponent(msg);
    if (isMobile) return res.redirect(`cc.altius.leastscore://oauth?error=${encoded}`);
    return res.redirect(`/login?error=${encoded}`);
  };

  if (error) return redirectError('OAuth login was cancelled or denied.');
  if (!code) return redirectError('No code received from provider.');

  // CSRF state check
  const savedState = (cookieHeader.match(/oauth_state=([^;]+)/) || [])[1];
  if (!savedState || savedState !== state) {
    return redirectError('Security check failed. Please try again.');
  }

  try {
    let profile;
    if (provider === 'google') profile = await exchangeGoogle(code, redirectUri);
    else if (provider === 'facebook') profile = await exchangeFacebook(code, redirectUri);
    else return res.redirect(`/login?error=${encodeURIComponent('Unknown provider.')}`);

    const pool = getPool();

    // Check if user already exists
    const [rows] = await pool.query(
      'SELECT id, first_name, last_name, nickname, email, token_version FROM users WHERE auth_provider = ? AND provider_id = ?',
      [provider, profile.providerId]
    );

    if (rows.length) {
      // Existing user — log them in
      const u = rows[0];
      const token = signJWT(buildRegisteredJWTPayload(u));
      if (isMobile) {
        // Redirect to custom scheme so Capacitor Browser fires the deep link
        return res.redirect(`cc.altius.leastscore://oauth?token=${encodeURIComponent(token)}&provider=${provider}`);
      }
      setAuthCookie(res, token);
      return res.redirect(`/?token=${encodeURIComponent(token)}`);
    }

    // No provider_id match — fallback: look up by email to link existing account
    if (profile.email) {
      const [emailRows] = await pool.query(
        'SELECT id, first_name, last_name, nickname, email, token_version FROM users WHERE email = ?',
        [profile.email]
      );
      if (emailRows.length) {
        const u = emailRows[0];
        // Backfill OAuth identity so future logins hit the fast path
        await pool.query(
          'UPDATE users SET auth_provider = ?, provider_id = ? WHERE id = ?',
          [provider, profile.providerId, u.id]
        );
        const token = signJWT(buildRegisteredJWTPayload(u));
        if (isMobile) {
          return res.redirect(`cc.altius.leastscore://oauth?token=${encodeURIComponent(token)}&provider=${provider}`);
        }
        setAuthCookie(res, token);
        return res.redirect(`/?token=${encodeURIComponent(token)}`);
      }
    }

    // Truly new social user — ask them to complete profile
    const tempToken = signTempJWT({ provider, providerId: profile.providerId, email: profile.email, firstName: profile.firstName, lastName: profile.lastName });
    const query = new URLSearchParams({
      step: 'complete-profile',
      provider,
      tempToken,
      firstName: profile.firstName || '',
      lastName: profile.lastName || ''
    });
    if (upgradeGuest?.guestSessionId) query.set('guestSessionId', String(upgradeGuest.guestSessionId));
    if (upgradeGuest?.guestName) query.set('guestName', upgradeGuest.guestName);

    if (isMobile) {
      // Deep-link back into the Capacitor app so appUrlOpen fires
      return res.redirect(`cc.altius.leastscore://oauth?${query.toString()}`);
    }
    return res.redirect(`/login?${query.toString()}`);
  } catch (err) {
    console.error(`[/api/auth/oauth/callback/${provider}]`, err);
    return redirectError('OAuth login failed. Please try again.');
  }
}
