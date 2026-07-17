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
async function getUserColumns(pool) {
  const [columns] = await pool.query('SHOW COLUMNS FROM users');
  return new Set(columns.map((column) => column.Field));
}

function userSelectList(columns) {
  const firstName = columns.has('first_name')
    ? 'first_name'
    : columns.has('display_name')
      ? 'display_name AS first_name'
      : 'NULL AS first_name';
  const lastName = columns.has('last_name') ? 'last_name' : 'NULL AS last_name';

  let nickname = 'NULL AS nickname';
  if (columns.has('nickname')) {
    nickname = 'nickname';
  } else if (columns.has('display_name') && columns.has('tag')) {
    nickname = "CONCAT(display_name, '#', tag) AS nickname";
  } else if (columns.has('display_name')) {
    nickname = 'display_name AS nickname';
  }

  const email = columns.has('email') ? 'email' : 'NULL AS email';
  const tokenVersion = columns.has('token_version') ? 'token_version' : '0 AS token_version';
  return `id, ${firstName}, ${lastName}, ${nickname}, ${email}, ${tokenVersion}`;
}

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
    const userColumns = await getUserColumns(pool);
    const selectUser = userSelectList(userColumns);

    // Check if user already exists
    const [rows] = userColumns.has('auth_provider') && userColumns.has('provider_id')
      ? await pool.query(
        `SELECT ${selectUser} FROM users WHERE auth_provider = ? AND provider_id = ?`,
        [provider, profile.providerId]
      )
      : [[]];

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
    if (profile.email && userColumns.has('email')) {
      const normalizedEmail = profile.email.trim().toLowerCase();
      const [emailRows] = await pool.query(
        `SELECT ${selectUser} FROM users WHERE email = ?`,
        [normalizedEmail]
      );
      if (emailRows.length) {
        const u = emailRows[0];
        // Backfill OAuth identity so future logins hit the fast path
        if (userColumns.has('auth_provider') && userColumns.has('provider_id')) {
          await pool.query(
            'UPDATE users SET auth_provider = ?, provider_id = ? WHERE id = ?',
            [provider, profile.providerId, u.id]
          );
        }
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
    console.error(`[/api/auth/oauth/callback/${provider}]`, err.response?.data || err);
    
    // Extract detailed error message from axios if available
    let errorDetail = err.message;
    if (err.response && err.response.data) {
        if (typeof err.response.data === 'object') {
            errorDetail = err.response.data.error_description || err.response.data.error || JSON.stringify(err.response.data);
        } else {
            errorDetail = String(err.response.data);
        }
    }
    
    return redirectError(`OAuth login failed. Detail: ${errorDetail}`);
  }
}
