export const SOUND_SETTINGS_KEY = 'ls-sound-settings';

export const DEFAULT_SOUND_SETTINGS = {
  homeVolume: 60,
  clickVolume: 80,
  gameVolume: 80,
};

export function loadSoundSettings() {
  if (typeof window === 'undefined') return DEFAULT_SOUND_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SOUND_SETTINGS_KEY);
    if (!raw) return DEFAULT_SOUND_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      homeVolume: typeof parsed.homeVolume === 'number' ? parsed.homeVolume : DEFAULT_SOUND_SETTINGS.homeVolume,
      clickVolume: typeof parsed.clickVolume === 'number' ? parsed.clickVolume : DEFAULT_SOUND_SETTINGS.clickVolume,
      gameVolume: typeof parsed.gameVolume === 'number' ? parsed.gameVolume : DEFAULT_SOUND_SETTINGS.gameVolume,
    };
  } catch {
    return DEFAULT_SOUND_SETTINGS;
  }
}

export function saveSoundSettings(settings) {
  if (typeof window === 'undefined') return;
  const payload = {
    homeVolume: typeof settings.homeVolume === 'number' ? settings.homeVolume : DEFAULT_SOUND_SETTINGS.homeVolume,
    clickVolume: typeof settings.clickVolume === 'number' ? settings.clickVolume : DEFAULT_SOUND_SETTINGS.clickVolume,
    gameVolume: typeof settings.gameVolume === 'number' ? settings.gameVolume : DEFAULT_SOUND_SETTINGS.gameVolume,
  };
  window.localStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify(payload));
}

export function getVolumeForCategory(settings, category) {
  const level = category === 'home'
    ? settings.homeVolume
    : category === 'click'
      ? settings.clickVolume
      : settings.gameVolume;
  return Math.min(1, Math.max(0, (typeof level === 'number' ? level : 0) / 100));
}
