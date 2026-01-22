import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Bell,
    User,
    PenSquare,
    CheckCircle2,
    ChevronDown,
    CheckCheck,
} from 'lucide-react';

import { usePrincipalState } from '../../store/usePrincipalState';
import { useNotificationStore } from '../../store/useNotificationStore';
import { mockNotifications } from '../../utils/recipeData';

// mock paging
function selectMockPage(cursor, size) {
    const s = Math.max(1, Math.min(20, size ?? 5));

    const sorted = [...(mockNotifications ?? [])].sort(
        (a, b) => (b.notificationId ?? 0) - (a.notificationId ?? 0),
    );

    const filtered =
        cursor == null
            ? sorted
            : sorted.filter((n) => (n.notificationId ?? 0) < cursor);

    return filtered.slice(0, s);
}

export function NotificationCenter({ onNotificationClick }) {
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const rootRef = useRef(null);
    const listRef = useRef(null);

    const isLoggedIn = usePrincipalState((s) => s.isLoggedIn);
    const principal = usePrincipalState((s) => s.principal);

    const initializedUserId = useNotificationStore((s) => s.initializedUserId);
    const items = useNotificationStore((s) => s.items);
    const unreadCount = useNotificationStore((s) => s.unreadCount);

    const hasNext = useNotificationStore((s) => s.hasNext);
    const loadingMore = useNotificationStore((s) => s.loadingMore);
    const cursor = useNotificationStore((s) => s.cursor);

    const reset = useNotificationStore((s) => s.reset);
    const ingest = useNotificationStore((s) => s.ingest);
    const markAsReadLocal = useNotificationStore((s) => s.markAsReadLocal);
    const markAllAsReadLocal = useNotificationStore(
        (s) => s.markAllAsReadLocal,
    );

    const setAll = useNotificationStore((s) => s.setAll);
    const appendMany = useNotificationStore((s) => s.appendMany);
    const setPaging = useNotificationStore((s) => s.setPaging);
    const setLoadingMore = useNotificationStore((s) => s.setLoadingMore);

    const visible = expanded ? items : items.slice(0, 5);
    const canExpand = items.length > 5 || hasNext;

    // ✅ 최초 5개 세팅
    useEffect(() => {
        if (!isLoggedIn) {
            setOpen(false);
            setExpanded(false);
            reset();
            return;
        }

        if (
            principal?.userId != null &&
            initializedUserId !== principal.userId
        ) {
            const first = selectMockPage(null, 5);
            setAll({ userId: principal.userId, rawList: first }); // 여기서 cursor 갱신되게 store가 되어 있어야 함!
            setPaging({ hasNext: first.length === 5 });
        }
    }, [
        isLoggedIn,
        principal?.userId,
        initializedUserId,
        setAll,
        setPaging,
        reset,
    ]);

    // 바깥 클릭 닫기
    useEffect(() => {
        if (!open) return;
        const fn = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target))
                setOpen(false);
        };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, [open]);

    // ✅ 핵심: “더보기(expanded)” 들어갈 때 1회 강제 로드
    const loadMore = useCallback(() => {
        if (!hasNext || loadingMore) return;

        const size = 5;
        setLoadingMore(true);

        // mock
        setTimeout(() => {
            const next = selectMockPage(cursor, size);
            appendMany(next); // 여기서 cursor 갱신되게 store가 되어 있어야 함!
            setPaging({ hasNext: next.length === size });
            setLoadingMore(false);
        }, 180);
    }, [hasNext, loadingMore, cursor, appendMany, setPaging, setLoadingMore]);

    useEffect(() => {
        if (open && expanded) {
            // expanded 켜자마자 한 번 채우기
            loadMore();
        }
    }, [open, expanded, loadMore]);

    // 무한 스크롤: 스크롤 가능한 상태에서만 동작
    const handleScroll = useCallback(() => {
        if (!expanded) return;
        if (!hasNext || loadingMore) return;

        const el = listRef.current;
        if (!el) return;

        const threshold = 120;
        const nearBottom =
            el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
        if (!nearBottom) return;

        loadMore();
    }, [expanded, hasNext, loadingMore, loadMore]);

    const handleItemClick = (notification) => {
        markAsReadLocal(notification.id);
        setOpen(false);
        onNotificationClick?.(notification);
    };

    const handleToggleRead = (notificationId, e) => {
        e.stopPropagation();
        const target = items.find((n) => n.id === notificationId);
        if (!target) return;

        ingest({ ...target, isRead: !target.isRead, raw: target.raw });
    };

    if (!isLoggedIn) return null;

    return (
        <div className="relative" ref={rootRef}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="relative"
                aria-label="알림"
            >
                <Bell
                    size={20}
                    className="text-[#3d3226] hover:text-[#5d4a36] transition-colors"
                />
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadCount}
                    </div>
                )}
            </button>

            {open && (
                <div className="fixed top-16 right-6 bg-[#f5f1eb] border-2 border-[#3d3226] rounded-lg shadow-lg z-50 w-96 max-h-[80vh] flex flex-col">
                    <div className="p-4 border-b-2 border-[#d4cbbf] flex items-center justify-between">
                        <h3 className="text-xl font-serif text-[#3d3226]">
                            알림
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsReadLocal}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md text-xs font-medium shadow-sm"
                            >
                                <CheckCheck size={14} />
                                <span>모두 읽기</span>
                            </button>
                        )}
                    </div>

                    <div
                        ref={listRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto p-4"
                    >
                        <div className="space-y-2">
                            {visible.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`rounded-md transition-all border-2 ${
                                        notification.isRead
                                            ? 'bg-white border-[#e5dfd5]'
                                            : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
                                    }`}
                                >
                                    <div className="flex items-start gap-3 py-3 px-4 relative">
                                        <button
                                            onClick={(e) =>
                                                handleToggleRead(
                                                    notification.id,
                                                    e,
                                                )
                                            }
                                            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                                                notification.isRead
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-600'
                                                    : 'bg-white border-[#d4cbbf]'
                                            }`}
                                        >
                                            {notification.isRead && (
                                                <CheckCircle2
                                                    size={14}
                                                    className="text-white"
                                                />
                                            )}
                                        </button>

                                        <div
                                            onClick={() =>
                                                handleItemClick(notification)
                                            }
                                            className="flex items-start gap-3 flex-1 cursor-pointer"
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                    notification.isRead
                                                        ? 'bg-[#d4cbbf]'
                                                        : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                                                }`}
                                            >
                                                {notification.type ===
                                                'follow' ? (
                                                    <User
                                                        size={20}
                                                        className={
                                                            notification.isRead
                                                                ? 'text-[#3d3226]'
                                                                : 'text-white'
                                                        }
                                                    />
                                                ) : (
                                                    <PenSquare
                                                        size={20}
                                                        className={
                                                            notification.isRead
                                                                ? 'text-[#3d3226]'
                                                                : 'text-white'
                                                        }
                                                    />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={`text-sm font-medium line-clamp-2 ${notification.isRead ? 'text-[#6b5d4f]' : 'text-[#3d3226]'}`}
                                                >
                                                    {notification.type ===
                                                    'follow'
                                                        ? `${notification.userName}님이 당신을 팔로우했습니다.`
                                                        : `${notification.userName}님이 "${notification.postTitle}"를 작성했습니다.`}
                                                </p>
                                                <p className="text-xs text-[#6b5d4f] mt-1">
                                                    {notification.timestamp}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {expanded && loadingMore && (
                                <div className="text-center text-xs text-[#6b5d4f] py-3">
                                    불러오는 중...
                                </div>
                            )}
                            {expanded && !hasNext && items.length > 0 && (
                                <div className="text-center text-xs text-[#6b5d4f] py-3">
                                    더 이상 알림이 없습니다.
                                </div>
                            )}
                            {items.length === 0 && (
                                <div className="text-center text-sm text-[#6b5d4f] py-10">
                                    아직 알림이 없습니다.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 border-t-2 border-[#d4cbbf] bg-[#f5f1eb]">
                        {canExpand && (
                            <button
                                onClick={() => setExpanded((v) => !v)}
                                className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md text-sm font-medium flex items-center justify-center gap-2 shadow-md"
                            >
                                <span>{expanded ? '닫기' : '더보기'}</span>
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
                                />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
