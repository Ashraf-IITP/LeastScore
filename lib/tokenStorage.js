// lib/tokenStorage.js
// Thin wrapper around localStorage for persisting the JWT on mobile (Capacitor).
// All calls are guarded so SSR / environments without localStorage never throw.

export function saveToken(token) {
  try { localStorage.setItem('auth_token', token); } catch (e) {}
}

export function getToken() {
  try { return localStorage.getItem('auth_token'); } catch (e) { return null; }
}

export function clearToken() {
  try { localStorage.removeItem('auth_token'); } catch (e) {}
}
