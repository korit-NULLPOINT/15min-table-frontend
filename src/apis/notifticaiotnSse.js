import { useNotificationStore } from '../store/useNotificationStore';

let es = null;

export function connectNotificationSse({
    // 같은 오리진이면 baseUrl 필요 없음(권장)
    url = '/notifications/subscribe', // ✅ 너 백 SSE 엔드포인트로 맞춰
    withCredentials = true, // 쿠키 포함
} = {}) {
    if (es) return es;

    // ✅ 여기서 "쿠키를 직접 읽어서 확인"은 HttpOnly면 불가.
    // 대신 RootLayout에서 principal 있을 때만 이 함수를 호출하는 구조로 가자.

    useNotificationStore.getState().setSseConnected(true);

    // 대부분 브라우저에서 withCredentials 옵션 지원(비표준이지만 흔히 동작)
    es = new EventSource(url, { withCredentials });

    es.onopen = () => {
        useNotificationStore.getState().setSseConnected(true);
    };

    es.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            // 서버 payload가 notification DTO라고 가정
            useNotificationStore.getState().ingest(data);
        } catch {
            // JSON 아니면 무시
        }
    };

    es.onerror = () => {
        // ❗ 인증 실패(401/403)도 여기로 떨어질 수 있음.
        // 브라우저가 자동 재연결 시도할 수도 있어서, 필요하면 “재연결 정책”을 추가하면 됨.
        useNotificationStore.getState().setSseConnected(false);
    };

    return es;
}

export function disconnectNotificationSse() {
    if (!es) return;
    try {
        es.close();
    } finally {
        es = null;
        useNotificationStore.getState().setSseConnected(false);
    }
}
