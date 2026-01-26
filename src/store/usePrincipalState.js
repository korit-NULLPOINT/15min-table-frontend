import { create } from 'zustand';
import { getPrincipal } from '../apis/generated/user-account-controller/user-account-controller';
import { disconnectNotificationSse } from '../apis/notificationSse';

export const usePrincipalState = create((set, get) => ({
    isLoggedIn: false,
    principal: null,
    loading: false,

    login: (userData) => set({ isLoggedIn: true, principal: userData }),

    logout: () => {
        disconnectNotificationSse();
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

                const verifiedUser = roles.some(
                    (ur) => Number(ur.roleId) === 2,
                );

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

            localStorage.removeItem('AccessToken');
            set({ isLoggedIn: false, principal: null, loading: false });
            return null;
        } catch (e) {
            localStorage.removeItem('AccessToken');
            set({ isLoggedIn: false, principal: null, loading: false });
            return null;
        }
    },
}));
