const UPGRADE_INTENT_TTL_MS = 30 * 60 * 1000; // 30 minutes
const guestUpgradeIntents = new Map(); // guestSessionId -> expiresAtMs

function markGuestUpgradeIntent(guestSessionId) {
  if (!guestSessionId) return;
  guestUpgradeIntents.set(Number(guestSessionId), Date.now() + UPGRADE_INTENT_TTL_MS);
}

function hasGuestUpgradeIntent(guestSessionId) {
  if (!guestSessionId) return false;
  const key = Number(guestSessionId);
  const expiresAt = guestUpgradeIntents.get(key);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    guestUpgradeIntents.delete(key);
    return false;
  }
  return true;
}

function clearGuestUpgradeIntent(guestSessionId) {
  if (!guestSessionId) return;
  guestUpgradeIntents.delete(Number(guestSessionId));
}

module.exports = {
  markGuestUpgradeIntent,
  hasGuestUpgradeIntent,
  clearGuestUpgradeIntent,
};

