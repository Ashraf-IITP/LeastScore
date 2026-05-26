// pages/api/auth/oauth/[provider].js — Redirect to OAuth provider
// Supported: google | facebook
export default function handler(req, res) {
  const { provider } = req.query;
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const redirectUri = encodeURIComponent(`${base}/api/auth/oauth/callback/${provider}`);

  // Random state for CSRF protection (stored in a short-lived cookie)
  const state = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const cookies = [`oauth_state=${state}; HttpOnly; Path=/; Max-Age=300; SameSite=Lax`];

  const { upgradeGuestSessionId, upgradeGuestName, upgradeGuestTag } = req.query;
  if (upgradeGuestSessionId) {
    const payload = encodeURIComponent(JSON.stringify({
      guestSessionId: Number(upgradeGuestSessionId),
      guestName: upgradeGuestName ? String(upgradeGuestName) : '',
      guestTag: upgradeGuestTag ? String(upgradeGuestTag).toUpperCase() : ''
    }));
    cookies.push(`upgrade_guest=${payload}; HttpOnly; Path=/; Max-Age=300; SameSite=Lax`);
  } else {
    cookies.push('upgrade_guest=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
  }
  res.setHeader('Set-Cookie', cookies);

  const URLS = {
    google: () => {
      const cid = process.env.GOOGLE_CLIENT_ID;
      if (!cid) return null;
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${cid}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile&state=${state}`;
    },

    facebook: () => {
      const cid = process.env.FACEBOOK_CLIENT_ID;
      if (!cid) return null;
      return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${cid}&redirect_uri=${redirectUri}&scope=email&state=${state}`;
    },

  };

  const buildUrl = URLS[provider];
  if (!buildUrl) return res.status(400).json({ error: `Unknown provider: ${provider}` });

  const url = buildUrl();
  if (!url) {
    // Provider not configured — redirect back to login with an error
    return res.redirect(`/login?error=${encodeURIComponent(`${provider} login is not configured yet. Add credentials to .env.local.`)}`);
  }

  return res.redirect(url);
}
