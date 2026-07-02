/**
 * apiBase.js
 * Centralises the API base URL so that all fetch/axios calls can be switched
 * between a relative path (web dev server) and a full remote URL (Capacitor APK)
 * simply by setting NEXT_PUBLIC_API_URL in the environment.
 *
 * Usage:
 *   import { apiUrl } from '../lib/apiBase';
 *   const res = await fetch(apiUrl('/api/auth/me'), { credentials: 'include' });
 *
 * Set in .env.local (or Capacitor env):
 *   NEXT_PUBLIC_API_URL=https://your-backend.example.com
 * Leave unset (or empty) to keep relative URLs for local web development.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || '';
export const apiUrl = (path) => `${BASE}${path}`;
