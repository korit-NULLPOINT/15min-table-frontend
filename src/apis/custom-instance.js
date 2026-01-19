// src/apis/custom-instance.js
import Axios from 'axios';

// 1. 기본 Axios 인스턴스 생성
export const AXIOS_INSTANCE = Axios.create({
    baseURL: 'http://localhost:8080',
});

// 2. 요청 인터셉터 (토큰 자동 주입)
AXIOS_INSTANCE.interceptors.request.use((config) => {
    const token = localStorage.getItem('AccessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 3. Orval이 사용할 커스텀 함수
export const customInstance = (url, options) => {
    const source = Axios.CancelToken.source();

    const promise = AXIOS_INSTANCE({
        url,
        ...options,
        data: options?.body,
        cancelToken: source.token,
    }).then(({ data }) => data);

    promise.cancel = () => {
        source.cancel('Query was cancelled');
    };

    return promise;
};
