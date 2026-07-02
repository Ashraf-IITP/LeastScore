// lib/oauthDeepLink.js
// Handles the custom deep-link scheme: cc.altius.leastscore://oauth?...
// Called from pages/login.js (mobile only) via registerOAuthDeepLinkHandler().
//
// Supported deep-link payloads:
//   ?token=<JWT>&provider=<p>          → existing / linked user login
//   ?step=complete-profile&provider=<p>&tempToken=<t>&firstName=<f>&lastName=<l>
//                                      → new social user needs profile completion
//   ?error=<msg>                       → OAuth error

import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { saveToken } from './tokenStorage';

/**
 * Register a one-time Capacitor `appUrlOpen` listener that processes
 * cc.altius.leastscore://oauth deep links produced by the server OAuth callback.
 *
 * @param {() => void}                          onSuccess       - Called after token is saved (redirect to home)
 * @param {(errorMsg: string) => void}           onError         - Called with a human-readable error string
 * @param {(profile: object) => void}            onNeedsProfile  - Called when new user must complete profile
 *   profile = { provider, tempToken, firstName, lastName }
 */
export function registerOAuthDeepLinkHandler(onSuccess, onError, onNeedsProfile) {
  App.addListener('appUrlOpen', async ({ url }) => {
    // Only handle our own scheme
    if (!url.startsWith('cc.altius.leastscore://oauth')) return;

    // Close the in-app browser that was opened by CapacitorBrowser
    try {
      await Browser.close();
    } catch (_) {
      // Ignore if browser was already closed
    }

    const queryString = url.split('?')[1] || '';
    const params = new URLSearchParams(queryString);

    const token    = params.get('token');
    const error    = params.get('error');
    const step     = params.get('step');

    // ── Case 1: Successful login ────────────────────────────────
    if (token) {
      saveToken(token);
      onSuccess();
      return;
    }

    // ── Case 2: New user — needs profile completion ─────────────
    if (step === 'complete-profile') {
      const provider   = params.get('provider') || '';
      const tempToken  = params.get('tempToken') || '';
      const firstName  = decodeURIComponent(params.get('firstName') || '');
      const lastName   = decodeURIComponent(params.get('lastName') || '');

      if (typeof onNeedsProfile === 'function') {
        onNeedsProfile({ provider, tempToken, firstName, lastName });
      }
      return;
    }

    // ── Case 3: OAuth error ─────────────────────────────────────
    if (error) {
      onError(decodeURIComponent(error));
      return;
    }

    // Unknown payload — surface a generic error
    onError('OAuth login failed. Please try again.');
  });
}
