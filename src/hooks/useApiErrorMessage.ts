import { useCallback, useState } from 'react';

type ErrorFallbacks = {
    fallbackMessage?: string; // 기본 메시지
    map?: (msg: string, status?: number) => string; // 메시지 변환(옵션)
};

async function parseErrorMessage(e: any) {
    // 1) fetch Response를 throw 하는 경우
    if (e instanceof Response) {
        const status = e.status;
        try {
            const ct = e.headers.get('content-type') || '';
            if (ct.includes('application/json')) {
                const body = await e.json();
                const msg =
                    body?.message ??
                    body?.msg ??
                    body?.error ??
                    body?.statusText;
                return { message: msg, status, raw: body };
            }
            const text = await e.text();
            return { message: text, status, raw: text };
        } catch {
            return { message: undefined, status, raw: undefined };
        }
    }

    // 2) { response: Response } 형태
    if (e?.response instanceof Response) {
        return await parseErrorMessage(e.response);
    }

    // 3) axios 스타일 에러
    if (e?.response?.data) {
        const status = e?.response?.status;
        const data = e.response.data;
        const msg = data?.message ?? data?.msg ?? data?.error;
        return { message: msg, status, raw: data };
    }

    // 4) 일반 Error
    if (e?.message) {
        return { message: e.message, status: undefined, raw: e };
    }

    return { message: undefined, status: undefined, raw: e };
}

export function useApiErrorMessage() {
    const [errorMessage, setErrorMessage] = useState('');

    const clearError = useCallback(() => setErrorMessage(''), []);

    /**
     * catch(e)에서 호출
     * - 백 message가 있으면 그걸 사용
     * - 없으면 fallback 사용
     * - 옵션 map으로 메시지/상태별 커스텀도 가능
     */
    const handleApiError = useCallback(
        async (e: any, options?: ErrorFallbacks) => {
            const { message, status } = await parseErrorMessage(e);

            const fallback = options?.fallbackMessage ?? '요청에 실패했습니다.';
            let finalMsg = (message && String(message).trim()) || fallback;

            if (options?.map) {
                finalMsg = options.map(finalMsg, status);
            }

            setErrorMessage(finalMsg);
            return finalMsg;
        },
        [],
    );

    return { errorMessage, setErrorMessage, clearError, handleApiError };
}
