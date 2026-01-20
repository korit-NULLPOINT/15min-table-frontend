import { create } from 'zustand';
import { mockNotifications } from '../utils/recipeData';

// --- utils (UI 표시용 포맷) ---
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

// DB/서버 형태 -> Header에서 쓰기 좋은 UI 모델
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

function sortByCreateDtDesc(items) {
    return [...items].sort(
        (a, b) =>
            new Date(b.raw?.createDt).getTime() -
            new Date(a.raw?.createDt).getTime(),
    );
}

export const useNotificationStore = create((set, get) => ({
    // --- state ---
    initializedUserId: null, // ✅ 유저 바뀌면 reset/init 가능
    items: [],
    unreadCount: 0,

    dropdownOpen: false, // (선택) 헤더에서 열림 상태를 전역으로 두고 싶다면 유지
    sseConnected: false, // SSE 연결 상태 표시용(선택)

    // --- actions (core) ---
    reset: () =>
        set({
            initializedUserId: null,
            items: [],
            unreadCount: 0,
            dropdownOpen: false,
            sseConnected: false,
        }),

    setDropdownOpen: (open) => set({ dropdownOpen: !!open }),
    setSseConnected: (connected) => set({ sseConnected: !!connected }),

    /**
     * ✅ 초기 데이터 세팅용 (나중에 API fetch 결과를 여기로 넣으면 됨)
     * @param {Object} param0
     * @param {number} param0.userId
     * @param {Array} param0.rawList  // 서버에서 받은 notification dto 배열(또는 이미 UI 모델이면 uiList 사용)
     * @param {Array} param0.uiList   // UI 모델 배열을 직접 넣고 싶으면 사용
     */
    setAll: ({ userId, rawList, uiList }) => {
        const items = uiList
            ? sortByCreateDtDesc(uiList)
            : sortByCreateDtDesc((rawList ?? []).map(toUINotification));

        set({
            initializedUserId: userId ?? null,
            items,
            unreadCount: calcUnread(items),
        });
    },

    /**
     * ✅ SSE/실시간으로 들어온 알림 1건 반영
     * - raw dto를 받으면 자동 변환
     * - 이미 ui 모델이면 그대로
     */
    ingest: (payload) => {
        const ui =
            payload && payload.raw
                ? payload // 이미 UI 모델
                : toUINotification(payload); // raw dto

        set((s) => {
            // 중복 방지(같은 id가 이미 있으면 갱신)
            const existsIdx = s.items.findIndex((n) => n.id === ui.id);
            let nextItems;

            if (existsIdx >= 0) {
                nextItems = [...s.items];
                nextItems[existsIdx] = {
                    ...nextItems[existsIdx],
                    ...ui,
                };
                nextItems = sortByCreateDtDesc(nextItems);
            } else {
                nextItems = [ui, ...s.items];
            }

            // unreadCount 갱신: 새로 추가된 게 unread면 +1
            // (중복 갱신일 경우는 안전하게 재계산)
            const unreadCount =
                existsIdx >= 0
                    ? calcUnread(nextItems)
                    : s.unreadCount + (ui.isRead ? 0 : 1);

            return { items: nextItems, unreadCount };
        });
    },

    /**
     * ✅ 로컬 읽음 처리(나중에 API 성공 후 호출)
     */
    markAsReadLocal: (id) => {
        set((s) => {
            let decreased = 0;
            const nextItems = s.items.map((n) => {
                if (n.id !== id) return n;
                if (!n.isRead) decreased = 1;
                return { ...n, isRead: true };
            });

            return {
                items: nextItems,
                unreadCount: Math.max(0, s.unreadCount - decreased),
            };
        });
    },

    /**
     * ✅ 로컬 전체 읽음 처리(나중에 API 성공 후 호출)
     */
    markAllAsReadLocal: () => {
        set((s) => ({
            items: s.items.map((n) => ({ ...n, isRead: true })),
            unreadCount: 0,
        }));
    },

    // --- dev/mock (선택) ---
    /**
     * 아직 API fetch 안 붙일 때, 화면 작업용 mock init
     * userId를 넘겨서 유저 변경 시에도 재초기화 가능하게
     */
    initMockForUser: (userId = 0) => {
        const { initializedUserId } = get();

        if (initializedUserId === userId) return;

        const items = sortByCreateDtDesc(
            (mockNotifications ?? []).map(toUINotification),
        );

        set({
            initializedUserId: userId,
            items,
            unreadCount: calcUnread(items),
        });
    },
}));
