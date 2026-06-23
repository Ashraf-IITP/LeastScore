// lib/themeSettings.js — Theme persistence (mirrors soundSettings.js pattern)

export const THEME_KEY = 'ls-theme';

// 'system' | 'dark' | 'light'
export const DEFAULT_THEME = 'system';

export function loadTheme() {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const raw = window.localStorage.getItem(THEME_KEY);
    if (raw === 'dark' || raw === 'light' || raw === 'system') return raw;
    return DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function saveTheme(theme) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(THEME_KEY, theme);
}

/** Resolve 'system' to actual 'dark' or 'light' */
export function resolveTheme(preference) {
  if (preference === 'dark' || preference === 'light') return preference;
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return 'dark';
}

/** Apply resolved theme to <html> element */
export function applyTheme(preference) {
  const resolved = resolveTheme(preference);
  document.documentElement.setAttribute('data-theme', resolved);
  return resolved;
}
