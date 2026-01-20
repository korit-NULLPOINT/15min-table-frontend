import { create } from 'zustand';
import { getPrincipal } from '../apis/generated/user-account-controller/user-account-controller';

export const usePrincipalState = create((set, get) => ({
    isLoggedIn: false,
    principal: null,
    loading: false,

    login: (userData) => set({ isLoggedIn: true, principal: userData }),

    logout: () => {
        localStorage.removeItem('AccessToken');
        set({ isLoggedIn: false, principal: null, loading: false });
    },

    fetchUser: async () => {
        const token = localStorage.getItem('AccessToken');
        if (!token) {
            set({ isLoggedIn: false, principal: null, loading: false });
            return null;
        }

        // 중복 호출 방지(선택)
        if (get().loading) return get().principal;

        try {
            set({ loading: true });

            // ✅ orval(customInstance) 응답: { data: ApiRespDto<Principal>, status: number, headers: Headers }
            const response = await getPrincipal();

            const httpStatus = response?.status;
            const body = response?.data; // ApiRespDto
            const user = body?.data ?? null; // 실제 principal

            if ((httpStatus === 200 || body?.status === 'success') && user) {
                set({ isLoggedIn: true, principal: user, loading: false });
                return user;
            }

            // success가 아니거나 user가 없으면 로그아웃 처리
            localStorage.removeItem('AccessToken');
            set({ isLoggedIn: false, principal: null, loading: false });
            return null;
        } catch (error) {
            // 토큰 만료/위조/권한 문제면 정리
            localStorage.removeItem('AccessToken');
            set({ isLoggedIn: false, principal: null, loading: false });
            return null;
        }
    },
}));
