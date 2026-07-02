// lib/apiFetch.js
// Drop-in replacement for fetch() that automatically attaches the stored JWT
// as an Authorization: Bearer header.  Falls back to nothing when no token is
// present (cookie-based web clients continue to work transparently).

import { getToken } from './tokenStorage';

/**
 * @param {string} url  - Relative or absolute API path (e.g. '/api/user/me')
 * @param {RequestInit} options - Standard fetch options
 */
export async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const base = process.env.NEXT_PUBLIC_API_URL || '';
  return fetch(`${base}${url}`, { ...options, headers });
}
