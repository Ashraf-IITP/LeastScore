import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { playNotificationSound } from '../lib/playNotificationSound';

const OVERLAY_CSS = `
  @keyframes lsSocialViewIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .ls-global-social-overlay {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10050;
    width: min(420px, calc(100vw - 32px));
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
    font-family: 'DM Sans', sans-serif;
  }
  .ls-global-social-overlay > * {
    pointer-events: auto;
  }
  .ls-global-social-overlay .ls-friends-notice {
    margin: 0;
    padding: 14px;
    border-radius: 18px;
    border: 1px solid rgba(255, 200, 87, 0.28);
    background: rgba(13, 17, 23, 0.88);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.04) inset;
    animation: lsSocialViewIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .ls-global-social-overlay .ls-friends-notice.party {
    border-color: rgba(255, 200, 87, 0.32);
    background: rgba(13, 17, 23, 0.9);
  }
  .ls-global-social-overlay .ls-friends-notice.friend {
    border-color: rgba(255, 200, 87, 0.28);
    background: rgba(13, 17, 23, 0.9);
  }
  .ls-global-social-overlay .ls-friends-notice-kicker {
    margin: 0 0 5px;
    color: #FFC857;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }
  .ls-global-social-overlay .ls-friends-notice-title {
    margin: 0;
    color: #F0F4FF;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.4;
  }
  .ls-global-social-overlay .ls-friends-notice-name { color: #FFC857; }
  .ls-global-social-overlay .ls-friends-notice-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 12px;
  }
  .ls-global-social-overlay .ls-friends-notice-more {
    margin: 10px 0 0;
    color: #A8B4C2;
    font-size: 12px;
    text-align: center;
  }
  .ls-global-social-overlay .btn-gold,
  .ls-global-social-overlay .btn-secondary {
    border: none;
    border-radius: 14px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.15s, opacity 0.15s;
  }
  .ls-global-social-overlay .btn-gold {
    background: linear-gradient(135deg, #FFD166, #FFC857);
    color: #0D1117;
  }
  .ls-global-social-overlay .btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #F0F4FF;
    border: 1px solid rgba(255, 255, 255, 0.14);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  .ls-global-social-overlay .btn-gold:active,
  .ls-global-social-overlay .btn-secondary:active {
    transform: scale(0.97);
  }
  .ls-global-social-toast {
    padding: 14px 16px;
    border-radius: 18px;
    border: 1px solid rgba(255, 200, 87, 0.35);
    background: rgba(13, 17, 23, 0.92);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    color: #F0F4FF;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45), 0 0 20px rgba(255, 200, 87, 0.08);
    animation: lsSocialViewIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
`;

export default function GlobalSocialOverlays({
    incomingInvite,
    incomingFriendRequest,
    pendingFriendRequestCount,
    socialToast,
    onAcceptParty,
    onRejectParty,
    onAcceptFriend,
    onDeclineFriend,
}) {
    const [mounted, setMounted] = useState(false);
    const prevInviteKey = useRef(null);
    const prevRequestId = useRef(null);
    const prevToast = useRef('');

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const inviteKey = incomingInvite ? `${incomingInvite.from}:${incomingInvite.creator || ''}` : null;
        if (inviteKey && inviteKey !== prevInviteKey.current) {
            playNotificationSound();
        }
        prevInviteKey.current = inviteKey;
    }, [incomingInvite]);

    useEffect(() => {
        const requestId = incomingFriendRequest?.requestId ?? null;
        if (requestId && requestId !== prevRequestId.current) {
            playNotificationSound();
        }
        prevRequestId.current = requestId;
    }, [incomingFriendRequest]);

    useEffect(() => {
        if (socialToast && socialToast !== prevToast.current) {
            playNotificationSound();
        }
        prevToast.current = socialToast;
    }, [socialToast]);

    if (!mounted || (!incomingInvite && !incomingFriendRequest && !socialToast)) {
        return null;
    }

    return createPortal(
        <>
            <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: OVERLAY_CSS }} />
            <div className="ls-global-social-overlay">
                {incomingInvite && (
                    <div className="ls-friends-notice party">
                        <p className="ls-friends-notice-kicker">Party Invite</p>
                        <p className="ls-friends-notice-title">
                            <span className="ls-friends-notice-name">{incomingInvite.from}</span> invited you to join their party.
                        </p>
                        <div className="ls-friends-notice-actions">
                            <button type="button" className="btn-gold" style={{ padding: '10px' }} onClick={onAcceptParty}>Join</button>
                            <button type="button" className="btn-secondary" style={{ padding: '10px' }} onClick={onRejectParty}>Ignore</button>
                        </div>
                    </div>
                )}
                {incomingFriendRequest && (
                    <div className="ls-friends-notice friend">
                        <p className="ls-friends-notice-kicker">Friend Request</p>
                        <p className="ls-friends-notice-title">
                            <span className="ls-friends-notice-name">{incomingFriendRequest.username}</span> wants to be friends.
                        </p>
                        <div className="ls-friends-notice-actions">
                            <button type="button" className="btn-gold" style={{ padding: '10px' }} onClick={onAcceptFriend}>Accept</button>
                            <button type="button" className="btn-secondary" style={{ padding: '10px' }} onClick={onDeclineFriend}>Decline</button>
                        </div>
                        {pendingFriendRequestCount > 1 && (
                            <p className="ls-friends-notice-more">
                                {pendingFriendRequestCount - 1} more pending
                            </p>
                        )}
                    </div>
                )}
                {socialToast && (
                    <div className="ls-global-social-toast">{socialToast}</div>
                )}
            </div>
        </>,
        document.body
    );
}
