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

    // ✅ 최신값을 ref에 보관 (deps 폭발/무한루프 방지)
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
                refreshUnreadCount?.();
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

        // ✅ 연결 전/실패 대비: 폴링은 항상 켜두고, 연결되면 그대로 둬도 되고(부하 적음),
        // 원하면 onOpen에서 stopPolling()해도 됨.
        startPolling();

        connectNotificationSse({
            url: '/notifications/subscribe',
            onMessage: (e) => {
                // e.type: 'notification' | 'message' 등 (addEventListener로 받으면 type이 들어옴)
                if (e?.type !== 'notification') return;

                let payload;
                try {
                    payload = JSON.parse(e.data);
                } catch (err) {
                    console.warn(
                        '[SSE] notification parse failed:',
                        e.data,
                        err,
                    );
                    return;
                }

                refreshUnreadCount?.();
                if (activeTab === 'UNREAD') ingest?.(payload);
            },
        });

        return () => {
            stopPolling();
            disconnectNotificationSse();
        };
        // enabled, pollMs도 의존성에 넣되, ingest/refreshUnreadCount는 안정적인 함수여야 좋음
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, pollMs]);
}
