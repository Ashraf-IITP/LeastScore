/** Normalize pathname for static-export / Capacitor (strip .html, trailing slash). */
export function getAppPath() {
  if (typeof window === 'undefined') return '/';
  let path = window.location.pathname || '/';
  if (path.endsWith('.html')) path = path.slice(0, -5) || '/';
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path;
}

/** Settings sub-flow targets that must use replace to avoid duplicate history entries. */
export function getNativeBackTarget(path = getAppPath()) {
  if (path === '/change-name' || path === '/change-password') return '/settings';
  if (path === '/settings') return '/';
  return null;
}

export function navigateBackToSettings(router) {
  router.replace('/settings');
}

export function navigateBackFromSettings(router) {
  router.replace('/');
}

/** @returns {boolean} true when navigation was handled */
export function handleNativeBack(router) {
  const target = getNativeBackTarget();
  if (!target) return false;
  router.replace(target);
  return true;
}
