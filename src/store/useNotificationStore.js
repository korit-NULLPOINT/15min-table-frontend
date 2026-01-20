import { create } from 'zustand';
import { mockNotifications } from '../utils/recipeData';

// createDt -> "2026.01.19 13:05" 형태
function formatDateTime(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);

    const yyyy = String(d.getFullYear());
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');

    return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
}

// DB 더미 -> Header 드롭다운이 쓰기 쉬운 UI 모델로 변환
function toUINotification(n) {
    const typeUpper = (n.notificationType ?? '').toUpperCase();

    return {
        id: n.notificationId,
        type: typeUpper === 'FOLLOW' ? 'follow' : 'post',
        userName: n.actorUsername ?? '알 수 없음',
        userImage: '',
        postTitle: n.recipeId != null ? `레시피 #${n.recipeId}` : typeUpper,
        isRead: Number(n.isRead) === 1,
        timestamp: formatDateTime(n.createDt),
        raw: n,
    };
}

export const useNotificationStore = create((set, get) => ({
    initialized: false,
    items: [],

    initMockOnce: () => {
        if (get().initialized) return;

        const items = mockNotifications
            .map(toUINotification)
            .sort(
                (a, b) =>
                    new Date(b.raw.createDt).getTime() -
                    new Date(a.raw.createDt).getTime(),
            );

        set({ items, initialized: true });
    },

    reset: () => set({ items: [], initialized: false }),

    unreadCount: () => get().items.filter((n) => !n.isRead).length,

    toggleRead: (id) =>
        set((s) => ({
            items: s.items.map((n) =>
                n.id === id ? { ...n, isRead: !n.isRead } : n,
            ),
        })),

    markAsRead: (id) =>
        set((s) => ({
            items: s.items.map((n) =>
                n.id === id ? { ...n, isRead: true } : n,
            ),
        })),

    markAllAsRead: () =>
        set((s) => ({
            items: s.items.map((n) => ({ ...n, isRead: true })),
        })),
}));
