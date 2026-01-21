import { create } from 'zustand';
import { mockNotifications } from '../utils/recipeData';

// --- utils ---
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

function calcUnread(items) {
    return items.reduce((acc, n) => acc + (n.isRead ? 0 : 1), 0);
}

function sortByIdDesc(items) {
    return [...items].sort(
        (a, b) => (b.raw?.notificationId ?? 0) - (a.raw?.notificationId ?? 0),
    );
}

function computeCursorFromItems(items) {
    // 마지막(가장 작은 id) 기준으로 다음 cursor
    const last = items[items.length - 1];
    return last?.raw?.notificationId ?? null;
}

export const useNotificationStore = create((set, get) => ({
    // --- state ---
    initializedUserId: null,
    items: [],
    unreadCount: 0,

    // paging
    cursor: null, // 다음 페이지 기준(notification_id < cursor)
    hasNext: true,
    loadingMore: false,

    // --- actions ---
    reset: () =>
        set({
            initializedUserId: null,
            items: [],
            unreadCount: 0,
            cursor: null,
            hasNext: true,
            loadingMore: false,
        }),

    setLoadingMore: (v) => set({ loadingMore: !!v }),

    setPaging: ({ cursor, hasNext } = {}) =>
        set((s) => ({
            cursor: cursor ?? s.cursor,
            hasNext: typeof hasNext === 'boolean' ? hasNext : s.hasNext,
        })),

    setAll: ({ userId, rawList, uiList }) => {
        const items = uiList
            ? sortByIdDesc(uiList)
            : sortByIdDesc((rawList ?? []).map(toUINotification));

        set({
            initializedUserId: userId ?? null,
            items,
            unreadCount: calcUnread(items),
            cursor: computeCursorFromItems(items),
        });
    },

    appendMany: (rawList) => {
        const uiList = (rawList ?? []).map(toUINotification);

        set((s) => {
            // 중복 제거(기존 id 있으면 skip)
            const existing = new Set(s.items.map((x) => x.id));
            const merged = [
                ...s.items,
                ...uiList.filter((x) => !existing.has(x.id)),
            ];

            const sorted = sortByIdDesc(merged);
            return {
                items: sorted,
                unreadCount: calcUnread(sorted),
                cursor: computeCursorFromItems(sorted),
            };
        });
    },

    ingest: (payload) => {
        const ui = payload && payload.raw ? payload : toUINotification(payload);

        set((s) => {
            const idx = s.items.findIndex((n) => n.id === ui.id);
            let nextItems;

            if (idx >= 0) {
                nextItems = [...s.items];
                nextItems[idx] = { ...nextItems[idx], ...ui };
                nextItems = sortByIdDesc(nextItems);
            } else {
                nextItems = sortByIdDesc([ui, ...s.items]);
            }

            return {
                items: nextItems,
                unreadCount: calcUnread(nextItems),
                cursor: computeCursorFromItems(nextItems),
            };
        });
    },

    markAsReadLocal: (id) => {
        set((s) => {
            const next = s.items.map((n) =>
                n.id === id ? { ...n, isRead: true } : n,
            );
            return { items: next, unreadCount: calcUnread(next) };
        });
    },

    markAllAsReadLocal: () => {
        set((s) => {
            const next = s.items.map((n) => ({ ...n, isRead: true }));
            return { items: next, unreadCount: 0 };
        });
    },

    // --- dev/mock ---
    initMockForUser: (userId = 0, size = 5) => {
        const { initializedUserId } = get();
        if (initializedUserId === userId) return;

        const sortedRaw = [...(mockNotifications ?? [])].sort(
            (a, b) => (b.notificationId ?? 0) - (a.notificationId ?? 0),
        );
        const first = sortedRaw.slice(0, size);

        const ui = sortByIdDesc(first.map(toUINotification));

        set({
            initializedUserId: userId,
            items: ui,
            unreadCount: calcUnread(ui),
            cursor: computeCursorFromItems(ui),
            hasNext: first.length === size, // 단순 판단
            loadingMore: false,
        });
    },
}));
