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
function getUserFromRequest(req) {
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]+)/);
  if (!match) return null;
  return verifyJWT(decodeURIComponent(match[1]));
}

// ── Username validation ───────────────────────────────────────
// name: 3-20 chars, letters/digits/underscores
const NAME_REGEX = /^[A-Za-z0-9_]{3,20}$/;
// tag:  exactly 4 uppercase alphanumeric chars
const TAG_REGEX  = /^[A-Z0-9]{4}$/;

function validateName(name) {
  return NAME_REGEX.test(name);
}

function validateTag(tag) {
  return TAG_REGEX.test(tag ? tag.toUpperCase() : '');
}

function formatUsername(name, tag) {
  return `${name}#${tag.toUpperCase()}`;
}

function parseUsername(input) {
  if (!input || typeof input !== 'string') return null;
  const parts = input.trim().split('#');
  if (parts.length !== 2) return null;
  const [name, tag] = parts;
  if (!validateName(name) || !validateTag(tag)) return null;
  return { name, tag: tag.toUpperCase() };
}

module.exports = {
  hashPassword,
  verifyPassword,
  signJWT,
  signTempJWT,
  verifyJWT,
  setAuthCookie,
  clearAuthCookie,
  getUserFromRequest,
  validateName,
  validateTag,
  formatUsername,
  parseUsername,
};
