// src/apis/custom-instance.ts
import Axios, { type AxiosRequestConfig } from "axios";

// 1) Axios 인스턴스
export const AXIOS_INSTANCE = Axios.create({
    baseURL: "",
});

// 2) 토큰 주입
AXIOS_INSTANCE.interceptors.request.use((config) => {
    const token = localStorage.getItem("AccessToken");
    if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
});

// orval react-query client가 넘기는 options는 RequestInit(=fetch 옵션) 기반이 많아서
// 여기서 axios 옵션으로 변환해준다.
type OrvalRequestOptions = RequestInit & { data?: any };

/**
 * ✅ 핵심: 제네릭 함수로 선언
 */
export const customInstance = async <T>(
    url: string,
    options: OrvalRequestOptions = {},
): Promise<T> => {
    // abort signal 지원
    const signal = options.signal;

    // axios cancel token(하위호환)
    const source = Axios.CancelToken.source();
    if (signal) {
        if (signal.aborted) source.cancel("Query was cancelled");
        else
            signal.addEventListener("abort", () =>
                source.cancel("Query was cancelled"),
            );
    }

    // headers 변환
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
        method: (options.method ?? "GET") as any,
        headers,
        data: (options as any).body ?? (options as any).data,
        cancelToken: source.token,
    };

    const res = await AXIOS_INSTANCE(axiosConfig);

    // orval이 생성한 응답 타입이 { data, status: 200, headers } 같은 형태라서
    // 여기서 그 형태로 맞춰서 반환
    return {
        data: res.data,
        status: res.status as any, // ✅ 리터럴(200) 타입 충돌 방지
        headers: new Headers(res.headers as any),
    } as any as T;
};
