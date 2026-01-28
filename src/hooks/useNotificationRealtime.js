import { useEffect, useRef } from 'react';
import {
    connectNotificationSse,
    disconnectNotificationSse,
} from '../apis/notificationSse';

const DEFAULT_POLL_MS = 15000;

export function useNotificationRealtime({
    enabled, // isLoggedIn
    activeTab, // 'UNREAD' | 'READ'
    ingest, // store: 새 알림을 리스트에 넣는 함수
    refreshUnreadCount, // store: unread count 갱신(서버 호출)
    pollMs = DEFAULT_POLL_MS,
}) {
    const pollIdRef = useRef(null);

    // ✅ 최신값을 ref에 보관
    const tabRef = useRef(activeTab);
    const ingestRef = useRef(ingest);
    const refreshRef = useRef(refreshUnreadCount);

    useEffect(() => {
        tabRef.current = activeTab;
    }, [activeTab]);

    useEffect(() => {
        ingestRef.current = ingest;
    }, [ingest]);

    useEffect(() => {
        refreshRef.current = refreshUnreadCount;
    }, [refreshUnreadCount]);

    useEffect(() => {
        const startPolling = () => {
            if (pollIdRef.current) return;
            pollIdRef.current = setInterval(() => {
                refreshRef.current?.();
            }, pollMs);
        };

        const stopPolling = () => {
            if (!pollIdRef.current) return;
            clearInterval(pollIdRef.current);
            pollIdRef.current = null;
        };

        if (!enabled) {
            stopPolling();
            disconnectNotificationSse();
            return;
        }

        // ✅ 폴링(뱃지 동기화) + SSE 동시 사용
        startPolling();

        const token = localStorage.getItem('AccessToken');

        connectNotificationSse({
            url: '/notifications/subscribe',
            token,
            onMessage: (e) => {
                // named event: 'notification'
                // fallback: 'message'
                const t = e?.type;
                if (t !== 'notification' && t !== 'message') return;

                let payload;
                try {
                    payload = JSON.parse(e.data);
                } catch (err) {
                    console.warn('[SSE] parse failed:', e?.data, err);
                    return;
                }

                refreshRef.current?.();

                // ✅ 현재 탭이 UNREAD일 때만 리스트에 즉시 반영
                if (tabRef.current === 'UNREAD') {
                    ingestRef.current?.(payload);
                }
            },
        });

        return () => {
            stopPolling();
            disconnectNotificationSse();
        };
    }, [enabled, pollMs]);
}
