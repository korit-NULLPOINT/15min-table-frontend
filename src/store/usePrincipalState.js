import { create } from 'zustand';
import { getPrincipal } from '../apis/generated/user-account-controller/user-account-controller';

export const usePrincipalState = create((set, get) => ({
    isLoggedIn: false,
    principal: null,
    loading: true,
    login: (userData) => set({ isLoggedIn: true, principal: userData }),
    logout: () => {
        localStorage.removeItem('AccessToken');
        set({ isLoggedIn: false, principal: null });
    },
    fetchUser: async () => {
        const token = localStorage.getItem('AccessToken');
        if (!token) {
            set({ isLoggedIn: false, principal: null, loading: false });
            return;
        }

        try {
            set({ loading: true });
            const response = await getPrincipal();
            if (response.data) {
                set({ isLoggedIn: true, principal: response.data, loading: false });
            } else {
                set({ isLoggedIn: false, principal: null, loading: false });
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            localStorage.removeItem('AccessToken');
            set({ isLoggedIn: false, principal: null, loading: false });
        }
    },
}));
