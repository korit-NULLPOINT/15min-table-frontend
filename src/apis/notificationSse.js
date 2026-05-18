import { EventSourcePolyfill } from 'event-source-polyfill';

let es = null;
let reconnectTimer = null;

export function connectNotificationSse({
    url = '/notifications/subscribe',
    token, // ✅ AccessToken 받음
    onOpen,
    onMessage,
    onError,
    onConnected,
    onHeartbeat,
} = {}) {
    if (es && es.readyState !== EventSource.CLOSED) return es;

    es = new EventSourcePolyfill(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        heartbeatTimeout: 3600000,
    });

    es.onopen = (e) => onOpen?.(e);

    es.addEventListener('connected', (e) => onConnected?.(e));
    es.addEventListener('heartbeat', (e) => onHeartbeat?.(e));
    es.addEventListener('notification', (e) => onMessage?.(e));

    es.onmessage = (e) => onMessage?.(e);

    es.onerror = (e) => {
        onError?.(e);

        try {
            es?.close();
        } catch {
            // ignore
        }
        es = null;

        if (!reconnectTimer) {
            reconnectTimer = setTimeout(() => {
                reconnectTimer = null;
                connectNotificationSse({
                    url,
                    token,
                    onOpen,
                    onMessage,
                    onError,
                    onConnected,
                    onHeartbeat,
                });
            }, 2000);
        }
    };

    return es;
}

export function disconnectNotificationSse() {
    if (!es) return;
    es.close();
    es = null;
}
