import { create } from 'zustand';
import { getPrincipal } from '../apis/generated/user-account-controller/user-account-controller';
import { disconnectNotificationSse } from '../apis/notificationSse';
import { logout as logoutApi } from '../apis/generated/user-auth-controller/user-auth-controller';

export const usePrincipalState = create((set, get) => ({
    isLoggedIn: false,
    principal: null,
    loading: false,

    login: (userData) => set({ isLoggedIn: true, principal: userData }),

    // ✅ 강제 로그아웃(로컬 정리 전용)
    logoutLocal: () => {
        disconnectNotificationSse();
        localStorage.removeItem('AccessToken');
        set({ isLoggedIn: false, principal: null, loading: false });
    },

    // ✅ 수동 로그아웃(서버 세션/쿠키 정리 + 로컬 정리)
    logout: async () => {
        disconnectNotificationSse();

        try {
            // 서버는 AT 없어도 200 OK(best-effort)라 실패해도 상관 없음
            await logoutApi();
        } catch (e) {
            // best-effort니까 무시
        }

        localStorage.removeItem('AccessToken');
        set({ isLoggedIn: false, principal: null, loading: false });
    },

    fetchUser: async () => {
        const token = localStorage.getItem('AccessToken');
        if (!token) {
            set({ isLoggedIn: false, principal: null, loading: false });
            return null;
        }

        if (get().loading) return get().principal;

        try {
            set({ loading: true });

            const response = await getPrincipal();
            const httpStatus = response?.status;
            const body = response?.data;
            const user = body?.data ?? null;

            if ((httpStatus === 200 || body?.status === 'success') && user) {
                const roles = user.userRoles ?? [];
                const verifiedUser = roles.some((ur) => Number(ur.roleId) === 2);

                set({
                    isLoggedIn: true,
                    principal: {
                        ...user,
                        verifiedUser,
                    },
                    loading: false,
                });

                return user;
            }

            // 인증이 유효하지 않으면 로컬 정리
            disconnectNotificationSse();
            localStorage.removeItem('AccessToken');
            set({ isLoggedIn: false, principal: null, loading: false });
            return null;
        } catch (e) {
            disconnectNotificationSse();
            localStorage.removeItem('AccessToken');
            set({ isLoggedIn: false, principal: null, loading: false });
            return null;
        }
    },
}));
