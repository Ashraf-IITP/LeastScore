import { loadSoundSettings, getVolumeForCategory } from './soundSettings';

export function playNotificationSound() {
    if (typeof window === 'undefined') return;
    const audio = new Audio('/sound/notification.mp3');
    const settings = loadSoundSettings();
    audio.volume = getVolumeForCategory(settings, 'click');
    audio.play().catch(() => {});
}
