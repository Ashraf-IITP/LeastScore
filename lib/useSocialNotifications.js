import { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import GlobalSocialOverlays from '../components/GlobalSocialOverlays';

export function useSocialNotifications({ onNavigateHome } = {}) {
    const [userType, setUserType] = useState('');
    const [authToken, setAuthToken] = useState('');
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [incomingInvite, setIncomingInvite] = useState(null);
    const [friendRequests, setFriendRequests] = useState({ incoming: [], outgoing: [] });
    const [socialToast, setSocialToast] = useState('');
    const socialToastTimerRef = useRef(null);
    const socketRef = useRef(null);
    const onNavigateHomeRef = useRef(onNavigateHome);

    useEffect(() => {
        onNavigateHomeRef.current = onNavigateHome;
    }, [onNavigateHome]);

    const showSocialToast = useCallback((message) => {
        if (!message) return;
        setSocialToast(message);
        if (socialToastTimerRef.current) clearTimeout(socialToastTimerRef.current);
        socialToastTimerRef.current = setTimeout(() => setSocialToast(''), 5000);
    }, []);

    const refreshFriendData = useCallback(async () => {
        if (userType !== 'registered') return;
        try {
            const requestsRes = await fetch('/api/friends/requests', { credentials: 'include' });
            if (requestsRes.ok) {
                const j = await requestsRes.json();
                setFriendRequests(j.requests || { incoming: [], outgoing: [] });
            }
        } catch (e) {
            console.error('Unable to refresh friend requests', e);
        }
    }, [userType]);

    useEffect(() => {
        fetch('/api/auth/me', { credentials: 'include' })
            .then(r => r.json())
            .then(data => {
                if (data.user) {
                    setUserType(data.user.type || '');
                    const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
                    setAuthToken(match ? decodeURIComponent(match[1]) : '');
                }
                setCheckingAuth(false);
            })
            .catch(() => setCheckingAuth(false));
    }, []);

    useEffect(() => {
        if (checkingAuth || userType !== 'registered') return;

        refreshFriendData();

        const socket = io({
            auth: authToken ? { token: authToken } : {},
            withCredentials: true,
            transports: ['polling', 'websocket'],
            extraHeaders: { 'ngrok-skip-browser-warning': 'true' },
        });
        socketRef.current = socket;

        socket.on('friendDataChanged', refreshFriendData);
        socket.on('partyInviteReceived', (invite) => setIncomingInvite(invite));
        socket.on('partyInviteRevoked', () => setIncomingInvite(null));
        socket.on('partyMemberJoined', ({ username }) => {
            showSocialToast(`${username} joined your party`);
        });
        socket.on('friendRequestAccepted', ({ username }) => {
            showSocialToast(`Friend request accepted by ${username}`);
        });
        socket.on('info', (msg) => showSocialToast(msg));
        socket.on('returnHome', ({ expandParty } = {}) => {
            setIncomingInvite(null);
            if (onNavigateHomeRef.current) {
                onNavigateHomeRef.current({ expandParty: expandParty !== false });
            }
        });

        return () => {
            socket.close();
            socketRef.current = null;
        };
    }, [checkingAuth, userType, authToken, refreshFriendData, showSocialToast]);

    useEffect(() => {
        return () => {
            if (socialToastTimerRef.current) clearTimeout(socialToastTimerRef.current);
        };
    }, []);

    const respondFriendRequest = async (requestId, action) => {
        try {
            const res = await fetch('/api/friends/respond', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, action }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Unable to respond to request');
            setFriendRequests(prev => ({
                incoming: prev.incoming.filter(request => request.requestId !== requestId),
                outgoing: prev.outgoing,
            }));
            if (action === 'accept') showSocialToast(data.message);
            refreshFriendData();
        } catch (error) {
            showSocialToast(error.message || 'Unable to respond to request');
        }
    };

    const incomingFriendRequest = friendRequests.incoming[0] || null;

    const acceptPartyInvite = () => {
        if (socketRef.current && incomingInvite) {
            socketRef.current.emit('acceptPartyInvite', incomingInvite.creator || incomingInvite.from);
            if (onNavigateHomeRef.current) onNavigateHomeRef.current({ expandParty: true });
        }
    };

    const overlay = userType === 'registered' ? (
        <GlobalSocialOverlays
            incomingInvite={incomingInvite}
            incomingFriendRequest={incomingFriendRequest}
            pendingFriendRequestCount={friendRequests.incoming.length}
            socialToast={socialToast}
            onAcceptParty={acceptPartyInvite}
            onRejectParty={() => setIncomingInvite(null)}
            onAcceptFriend={() => incomingFriendRequest && respondFriendRequest(incomingFriendRequest.requestId, 'accept')}
            onDeclineFriend={() => incomingFriendRequest && respondFriendRequest(incomingFriendRequest.requestId, 'reject')}
        />
    ) : null;

    return { overlay, checkingAuth, userType };
}
