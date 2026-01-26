let es = null;
let reconnectTimer = null;

export function connectNotificationSse({
    url = '/notifications/subscribe',
    onOpen,
    onMessage,
    onError,
    onConnected,
    onHeartbeat,
} = {}) {
    if (es && es.readyState !== EventSource.CLOSED) return es;

    es = new EventSource(url);

    es.onopen = (e) => onOpen?.(e);

    // ✅ named events (백에서 name("notification") 보내는 거 수신)
    es.addEventListener('connected', (e) => onConnected?.(e));
    es.addEventListener('heartbeat', (e) => onHeartbeat?.(e));
    es.addEventListener('notification', (e) => onMessage?.(e));

    // 혹시 백에서 name 없이 보내는 이벤트 대비(보험)
    es.onmessage = (e) => onMessage?.(e);

    es.onerror = (e) => {
        onError?.(e);

        // ✅ 에러 시 연결을 명확히 끊고, 재시도 가능 상태로 만든다
        try {
            es?.close();
        } catch {
            // ignore
        }
        es = null;

        // ✅ 간단 재연결(과격한 loop 방지로 1~3초 정도)
        if (!reconnectTimer) {
            reconnectTimer = setTimeout(() => {
                reconnectTimer = null;
                connectNotificationSse({
                    url,
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
