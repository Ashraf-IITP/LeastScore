export function getBGM() {
    if (typeof window === 'undefined') return null;
    if (!window.__bgm) {
        window.__bgm = new Audio('/sound/home page song.mp3');
        window.__bgm.loop = true;
    }
    return window.__bgm;
}

export function playBGM() {
    const bgm = getBGM();
    if (bgm) bgm.play().catch(() => {});
}

export function stopBGM() {
    const bgm = getBGM();
    if (bgm) {
        bgm.pause();
        bgm.currentTime = 0;
    }
}

export function setBGMVolume(vol) {
    const bgm = getBGM();
    if (bgm) {
        bgm.volume = vol;
    }
}
