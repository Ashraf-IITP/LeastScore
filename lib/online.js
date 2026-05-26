// lib/online.js — Track online registered users across socket connections

const globalOnlineUsersKey = Symbol.for('leastscore.onlineUsers');
const onlineUsers = globalThis[globalOnlineUsersKey] || new Map();
if (!globalThis[globalOnlineUsersKey]) {
  globalThis[globalOnlineUsersKey] = onlineUsers;
}

function normalizeUserId(userId) {
  return String(userId);
}

function addOnline(userId, socketId) {
  const key = normalizeUserId(userId);
  if (!onlineUsers.has(key)) {
    onlineUsers.set(key, new Set());
  }
  onlineUsers.get(key).add(socketId);
}

function removeOnline(userId, socketId) {
  const key = normalizeUserId(userId);
  if (!onlineUsers.has(key)) return;
  const sockets = onlineUsers.get(key);
  sockets.delete(socketId);
  if (sockets.size === 0) {
    onlineUsers.delete(key);
  }
}

function isOnline(userId) {
  const key = normalizeUserId(userId);
  return onlineUsers.has(key) && onlineUsers.get(key).size > 0;
}

function getSocketIds(userId) {
  return onlineUsers.get(normalizeUserId(userId)) || new Set();
}

module.exports = {
  onlineUsers,
  addOnline,
  removeOnline,
  isOnline,
  getSocketIds,
};
