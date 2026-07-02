// lib/auth.js — JWT signing/verification + bcrypt helpers
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_CHANGE_IN_PRODUCTION';
const JWT_EXPIRY = '30d';

// ── Password helpers ──────────────────────────────────────────
async function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
}

async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

// ── JWT helpers ───────────────────────────────────────────────
function signJWT(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

function verifyJWT(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Short-lived token used during OAuth username-pick step (5 min)
function signTempJWT(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '5m' });
}

// ── Cookie helpers ────────────────────────────────────────────
function setAuthCookie(res, token) {
  const maxAge = 30 * 24 * 60 * 60; // 30 days in seconds
  res.setHeader(
    'Set-Cookie',
    `auth_token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax`
  );
}

function clearAuthCookie(res) {
  res.setHeader(
    'Set-Cookie',
    'auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
  );
}

// ── Extract user from request ─────────────────────────────────
// Returns the raw JWT string from Authorization: Bearer or auth_token cookie.
function getTokenFromRequest(req) {
  // 1. Prefer Authorization: Bearer <token> (mobile / Capacitor clients)
  const authHeader = req.headers.authorization || '';
  const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  if (bearerMatch) return bearerMatch[1];

  // 2. Fall back to HttpOnly cookie (web clients)
  const cookieHeader = req.headers.cookie || '';
  const cookieMatch = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]+)/);
  if (cookieMatch) return decodeURIComponent(cookieMatch[1]);

  return null;
}

function getUserFromRequest(req) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyJWT(token);
}

// ── Profile validation ────────────────────────────────────────
// name: 3-20 chars, letters/digits/spaces/underscores
const NAME_REGEX = /^[A-Za-z0-9_ ]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName(name) {
  return NAME_REGEX.test(name);
}

function validateEmail(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim());
}

function buildDisplayName(firstName, lastName, nickname) {
  const full = `${firstName || ''} ${lastName || ''}`.trim();
  if (nickname && full) return `${nickname} (${full})`;
  return nickname || full || 'Player';
}

function buildRegisteredJWTPayload(user) {
  const firstName = user.first_name ?? user.firstName;
  const lastName = user.last_name ?? user.lastName;
  const nickname = user.nickname;
  const email = user.email ? user.email.trim().toLowerCase() : null;
  return {
    userId: user.id ?? user.userId,
    tokenVersion: user.token_version ?? user.tokenVersion ?? 0,
    type: 'registered',
    email,
    first_name: firstName,
    last_name: lastName,
    nickname,
    displayName: buildDisplayName(firstName, lastName, nickname),
  };
}

module.exports = {
  hashPassword,
  verifyPassword,
  signJWT,
  signTempJWT,
  verifyJWT,
  setAuthCookie,
  clearAuthCookie,
  getTokenFromRequest,
  getUserFromRequest,
  validateName,
  validateEmail,
  buildDisplayName,
  buildRegisteredJWTPayload,
};
