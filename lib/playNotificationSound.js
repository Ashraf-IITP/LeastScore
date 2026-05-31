export function playNotificationSound() {
    if (typeof window === 'undefined') return;
    const audio = new Audio('/sound/notification.mp3');
    audio.play().catch(() => {});
}
