export function getBGM() {
    if (typeof window === 'undefined') return null;
    if (!window.__bgm) {
        window.__bgm = new Audio('/sound/home page song.mp3');
        window.__bgm.loop = true;
        window.__bgmShouldPlay = false;

        const handlePause = () => {
            if (window.__bgm) window.__bgm.pause();
        };

        const handleResume = () => {
            if (window.__bgm && window.__bgmShouldPlay) {
                window.__bgm.play().catch(() => {});
            }
        };

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                handlePause();
            } else {
                handleResume();
            }
        });

        if (window.Capacitor && window.Capacitor.isNativePlatform()) {
            import('@capacitor/app').then(({ App }) => {
                App.addListener('appStateChange', ({ isActive }) => {
                    if (!isActive) {
                        handlePause();
                    } else {
                        handleResume();
                    }
                });
            }).catch(() => {});
        }
    }
    return window.__bgm;
}

export function playBGM() {
    const bgm = getBGM();
    if (bgm) {
        window.__bgmShouldPlay = true;
        const isHidden = document.hidden;
        if (!isHidden) {
            bgm.play().catch(() => {});
        }
    }
}

export function stopBGM() {
    const bgm = getBGM();
    if (bgm) {
        window.__bgmShouldPlay = false;
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
