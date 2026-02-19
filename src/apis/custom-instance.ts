// src/apis/custom-instance.ts
import Axios, {
    type AxiosRequestConfig,
    type AxiosError,
    type AxiosResponse,
} from 'axios';
import { toast } from 'react-toastify';
import { usePrincipalState } from '../store/usePrincipalState';

/**
 * ✅ 목표
 * - 비로그인(AT 없음) 상태의 401은 "그냥 401"로 두고 refresh/강제로그아웃 금지
 * - 로그인(AT 있음) 상태에서만 401 → refresh 1회 → 원요청 재시도
 * - refresh 실패 시에만 logout(best-effort) + 강제 로그아웃 + 홈 이동
 * - 네트워크 에러(응답 없음)는 세션만료로 오인하지 않고 그대로 throw
 */

// 1) Axios 인스턴스
export const AXIOS_INSTANCE = Axios.create({
    baseURL: '/api',
    withCredentials: true,
});

// ====== util: 강제 로그아웃 + 홈 이동 ======
function forceLogoutAndRedirectHome(message?: string) {
    try {
        usePrincipalState.getState().logoutLocal();
    } catch {
        // ignore
    }

    if (message) alert(message);

    // 라우터 훅을 못 쓰는 파일이라 가장 단순한 방식
    window.location.href = '/';
}

// ====== 토큰 주입 ======
AXIOS_INSTANCE.interceptors.request.use((config) => {
    const token = localStorage.getItem('AccessToken');
    if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
});

// ====== 401 처리(Refresh 1회 + 재시도 / 실패 시 로그아웃) ======

// refresh 동시 호출 1회로 묶기 위한 공유 Promise
let refreshPromise: Promise<string | null> | null = null;

// refresh 호출 함수: 성공하면 새 AT 문자열 반환, 실패면 null
async function refreshAccessToken(): Promise<string | null> {
    try {
        // refresh API는 RT(HttpOnly cookie) 기반
        const res = await AXIOS_INSTANCE.post('/user/auth/refresh');

        // 백에서 { data: "NEW_AT" } 형태라고 가정
        const newAT = (res?.data?.data as string | undefined) ?? undefined;
        if (!newAT) return null;

        localStorage.setItem('AccessToken', newAT);
        return newAT;
    } catch {
        return null;
    }
}

// 응답 인터셉터
AXIOS_INSTANCE.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        // 네트워크 에러 등(응답 자체가 없음)은 여기서 바로 던짐
        if (!error.response) {
            return Promise.reject(error);
        }

        const status = error.response.status;
        const originalConfig =
            (error.config as AxiosRequestConfig & { _retry?: boolean }) ?? {};

        const url = String(originalConfig?.url ?? '');

        // refresh / logout 요청에서 401이 난 경우는 무한루프 방지: 바로 실패 처리
        const isAuthBypassEndpoint =
            url.includes('/user/auth/refresh') ||
            url.includes('/user/auth/logout');

        // ✅ 핵심: 비로그인(AT 없음) 상태면 401이어도 refresh/강제로그아웃 금지
        const hasAT = !!localStorage.getItem('AccessToken');

        if (status === 401 && !isAuthBypassEndpoint && !originalConfig._retry) {
            // 비로그인 상태: 그냥 401 그대로 넘김 (permitAll인데 401 나오면 백을 점검)
            if (!hasAT) {
                return Promise.reject(error);
            }

            originalConfig._retry = true;

            // refresh가 이미 진행 중이면 그 결과를 기다렸다가 재시도
            if (!refreshPromise) {
                refreshPromise = (async () => {
                    const token = await refreshAccessToken();
                    return token;
                })().finally(() => {
                    refreshPromise = null;
                });
            }

            const newAT = await refreshPromise;

            if (newAT) {
                // 원요청 재시도: 헤더를 새 토큰으로 보정
                originalConfig.headers = originalConfig.headers ?? {};
                (originalConfig.headers as any).Authorization =
                    `Bearer ${newAT}`;
                return AXIOS_INSTANCE(originalConfig);
            }

            // refresh 실패 → logout(best-effort) → 강제 로그아웃 + 홈
            try {
                await AXIOS_INSTANCE.post('/user/auth/logout');
            } catch {
                // best-effort니까 무시
            }

            forceLogoutAndRedirectHome(
                '세션이 만료되었습니다. 다시 로그인 해주세요.',
            );
            return Promise.reject(error);
        }

        // ===== 429 처리(Too Many Requests) =====
        if (status === 429) {
            const msg =
                (error.response?.data as any)?.message ??
                '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
            toast.warning(msg);
        }

        return Promise.reject(error);
    },
);

// ===== 429 처리 =====

// ===== orval bridge =====
type OrvalRequestOptions = RequestInit & { data?: any };

export const customInstance = async <T>(
    url: string,
    options: OrvalRequestOptions = {},
): Promise<T> => {
    const signal = options.signal;

    // AbortController(signal) → Axios cancelToken 연결
    const source = Axios.CancelToken.source();
    if (signal) {
        if (signal.aborted) source.cancel('Query was cancelled');
        else
            signal.addEventListener('abort', () =>
                source.cancel('Query was cancelled'),
            );
    }

    // RequestInit headers → plain object
    let headers: any = {};
    if (options.headers instanceof Headers) {
        headers = Object.fromEntries(options.headers.entries());
    } else if (Array.isArray(options.headers)) {
        headers = Object.fromEntries(options.headers);
    } else if (options.headers) {
        headers = options.headers;
    }

    const axiosConfig: AxiosRequestConfig = {
        url,
        method: (options.method ?? 'GET') as any,
        headers,
        data: (options as any).body ?? (options as any).data,
        cancelToken: source.token,
    };

    const res: AxiosResponse = await AXIOS_INSTANCE(axiosConfig);

    return {
        data: res.data,
        status: res.status as any,
        headers: new Headers(res.headers as any),
    } as any as T;
};
