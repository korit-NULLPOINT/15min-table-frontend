// src/apis/notificationSse.js
let es = null;

export function connectNotificationSse({
    url = '/notifications/subscribe',
    onOpen,
    onMessage,
    onError,
} = {}) {
    if (es && es.readyState !== EventSource.CLOSED) {
        return es;
    }

    es = new EventSource(url);

    es.onopen = (e) => onOpen?.(e);
    es.onmessage = (e) => onMessage?.(e);
    es.onerror = (e) => onError?.(e);

    return es;
}

export function disconnectNotificationSse() {
    if (!es) return;
    es.close();
    es = null;
}
