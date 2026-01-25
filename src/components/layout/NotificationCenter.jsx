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

import {
    getNotifications,
    getUnreadCount,
    markAllAsRead,
    markAsRead,
} from '../../apis/generated/notification-controller/notification-controller';

import { useApiErrorMessage } from '../../hooks/useApiErrorMessage';

export function NotificationCenter({ onNotificationClick }) {
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [tab, setTab] = useState('UNREAD'); // ✅ 'UNREAD' | 'READ'

    const rootRef = useRef(null);
    const listRef = useRef(null);

    // ✅ init 충돌 방지용 (store reset과 무관하게 1회만 초기 로드)
    const initUserIdRef = useRef(null);

    const principal = usePrincipalState((s) => s.principal);
    const isLoggedIn = !!principal;

    // store
    // const initializedUserId = useNotificationStore((s) => s.initializedUserId); // ✅ 더 이상 init 트리거로 사용 X
    const items = useNotificationStore((s) => s.items);

    const loadedUnreadCount = useNotificationStore((s) => s.unreadCount);
    const badgeUnreadCount = useNotificationStore((s) => s.badgeUnreadCount);

    const hasNext = useNotificationStore((s) => s.hasNext);
    const loadingMore = useNotificationStore((s) => s.loadingMore);
    const cursor = useNotificationStore((s) => s.cursor);

    const reset = useNotificationStore((s) => s.reset);
    const ingest = useNotificationStore((s) => s.ingest);
    const setAll = useNotificationStore((s) => s.setAll);
    const appendMany = useNotificationStore((s) => s.appendMany);
    const setPaging = useNotificationStore((s) => s.setPaging);
    const setLoadingMore = useNotificationStore((s) => s.setLoadingMore);
    const markAsReadLocal = useNotificationStore((s) => s.markAsReadLocal);
    const markAllAsReadLocal = useNotificationStore(
        (s) => s.markAllAsReadLocal,
    );
    const setBadgeUnreadCount = useNotificationStore(
        (s) => s.setBadgeUnreadCount,
    );

    // error hook
    const { errorMessage, clearError, handleApiError } = useApiErrorMessage();

    const visible = expanded ? items : items.slice(0, 5);
    const canExpand = items.length > 5 || hasNext;

    const size = 5;

    const refreshUnreadCount = useCallback(async () => {
        try {
            const resp = await getUnreadCount();
            const count = resp?.data?.data ?? 0;
            setBadgeUnreadCount(count);
        } catch {
            // 뱃지 실패는 치명적이지 않아서 메시지 생략
        }
    }, [setBadgeUnreadCount]);

    // ✅ 로그인 시 최초 목록 + 뱃지 로드 (기본: UNREAD)
    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            if (!isLoggedIn) {
                setOpen(false);
                setExpanded(false);
                setTab('UNREAD');
                initUserIdRef.current = null; // ✅ 로그아웃 시 초기화
                reset();
                clearError();
                return;
            }

            const userId = principal?.userId;
            if (userId == null) return;

            // ✅ store reset과 무관하게 1회만
            if (initUserIdRef.current === userId) return;
            initUserIdRef.current = userId;

            setTab('UNREAD'); // 기본 탭
            reset();
            clearError();

            try {
                const [listResp, unreadResp] = await Promise.all([
                    getNotifications({ size, mode: 'UNREAD' }),
                    getUnreadCount(),
                ]);

                if (cancelled) return;

                const rawList = listResp?.data?.data ?? [];
                const unread = unreadResp?.data?.data ?? 0;

                setAll({ userId, rawList });
                setPaging({ hasNext: rawList.length === size });
                setBadgeUnreadCount(unread);
            } catch (e) {
                if (cancelled) return;
                await handleApiError(e, {
                    fallbackMessage:
                        '알림 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
                });
                refreshUnreadCount();
            }
        };

        init();
        return () => {
            cancelled = true;
        };
    }, [
        isLoggedIn,
        principal?.userId,
        reset,
        clearError,
        setAll,
        setPaging,
        setBadgeUnreadCount,
        handleApiError,
        refreshUnreadCount,
    ]);

    // ✅ 탭 전환 시: reset + 해당 탭으로 1페이지 재조회 (알림창 열려 있을 때만)
    useEffect(() => {
        let cancelled = false;

        const refetchByTab = async () => {
            if (!open) return;
            if (!isLoggedIn) return;

            const userId = principal?.userId;
            if (userId == null) return;

            setExpanded(false);
            reset();
            clearError();

            try {
                const resp = await getNotifications({ size, mode: tab });
                if (cancelled) return;

                const rawList = resp?.data?.data ?? [];
                setAll({ userId, rawList });
                setPaging({ hasNext: rawList.length === size });

                refreshUnreadCount();
            } catch (e) {
                if (cancelled) return;
                await handleApiError(e, {
                    fallbackMessage:
                        '알림 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
                });
                refreshUnreadCount();
            }
        };

        refetchByTab();
        return () => {
            cancelled = true;
        };
    }, [
        tab,
        open,
        isLoggedIn,
        principal?.userId,
        reset,
        clearError,
        setAll,
        setPaging,
        refreshUnreadCount,
        handleApiError,
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

    const loadMore = useCallback(async () => {
        if (!expanded) return;
        if (!hasNext || loadingMore) return;
        if (!isLoggedIn) return;

        setLoadingMore(true);
        try {
            const resp = await getNotifications({ cursor, size, mode: tab });
            const next = resp?.data?.data ?? [];
            appendMany(next);
            setPaging({ hasNext: next.length === size });
        } catch (e) {
            await handleApiError(e, {
                fallbackMessage:
                    '추가 알림을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
            });
        } finally {
            setLoadingMore(false);
        }
    }, [
        expanded,
        hasNext,
        loadingMore,
        isLoggedIn,
        cursor,
        tab,
        appendMany,
        setPaging,
        setLoadingMore,
        handleApiError,
    ]);

    // expanded 켜질 때 1회 로드
    useEffect(() => {
        if (open && expanded) loadMore();
    }, [open, expanded, loadMore]);

    // 무한 스크롤
    const handleScroll = useCallback(() => {
        if (!expanded) return;
        if (!hasNext || loadingMore) return;

        const el = listRef.current;
        if (!el) return;

        const threshold = 120;
        const nearBottom =
            el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;

        if (nearBottom) loadMore();
    }, [expanded, hasNext, loadingMore, loadMore]);

    const handleItemClick = async (notification) => {
        // ✅ 미읽음 탭에서만 읽음 처리 UI/동작이 의미 있음
        if (tab === 'UNREAD' && !notification?.isRead) {
            markAsReadLocal(notification.id);
            try {
                await markAsRead(notification.id);
                refreshUnreadCount();
            } catch (e) {
                await handleApiError(e, {
                    fallbackMessage:
                        '읽음 처리에 실패했습니다. 잠시 후 다시 시도해주세요.',
                });
                refreshUnreadCount();
                // 최소 롤백
                ingest({
                    ...notification,
                    isRead: false,
                    raw: notification.raw,
                });
            }
        }

        setOpen(false);
        onNotificationClick?.(notification);
    };

    // 체크박스는 "읽음"만 (unread로 되돌리는 API 없음)
    const handleMarkAsRead = async (notificationId, e) => {
        e.stopPropagation();
        if (tab !== 'UNREAD') return;

        const target = items.find((n) => n.id === notificationId);
        if (!target || target.isRead) return;

        markAsReadLocal(notificationId);

        try {
            await markAsRead(notificationId);
            refreshUnreadCount();
        } catch (e2) {
            await handleApiError(e2, {
                fallbackMessage:
                    '읽음 처리에 실패했습니다. 잠시 후 다시 시도해주세요.',
            });
            refreshUnreadCount();
            ingest({ ...target, isRead: false, raw: target.raw });
        }
    };

    const handleMarkAll = async () => {
        if (tab !== 'UNREAD') return;
        if (loadedUnreadCount <= 0 && badgeUnreadCount <= 0) return;

        markAllAsReadLocal();
        setBadgeUnreadCount(0);

        try {
            await markAllAsRead();
            refreshUnreadCount();
        } catch (e) {
            await handleApiError(e, {
                fallbackMessage:
                    '모두 읽기 처리에 실패했습니다. 잠시 후 다시 시도해주세요.',
            });
            refreshUnreadCount();
        }
    };

    if (!isLoggedIn) return null;

    return (
        <div className="relative" ref={rootRef}>
            <button
                onClick={() => {
                    setOpen((v) => !v);
                    clearError();
                }}
                className="relative"
                aria-label="알림"
            >
                <Bell
                    size={20}
                    className="text-[#3d3226] hover:text-[#5d4a36] transition-colors"
                />
                {badgeUnreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {badgeUnreadCount}
                    </div>
                )}
            </button>

            {open && (
                <div className="fixed top-16 right-6 bg-[#f5f1eb] border-2 border-[#3d3226] rounded-lg shadow-lg z-[9999] w-96 max-h-[80vh] flex flex-col">
                    {/* Header + Tabs */}
                    <div className="p-4 border-b-2 border-[#d4cbbf] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <h3 className="text-xl font-serif text-[#3d3226] shrink-0">
                                알림
                            </h3>

                            {/* 탭 */}
                            <div className="flex items-center bg-white border-2 border-[#d4cbbf] rounded-md overflow-hidden shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setTab('UNREAD')}
                                    className={[
                                        'px-3 py-1.5 text-xs font-medium transition-colors',
                                        tab === 'UNREAD'
                                            ? 'bg-[#3d3226] text-[#f5f1eb]'
                                            : 'bg-white text-[#3d3226] hover:bg-[#ebe5db]',
                                    ].join(' ')}
                                >
                                    미읽음
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setTab('READ')}
                                    className={[
                                        'px-3 py-1.5 text-xs font-medium transition-colors border-l-2 border-[#d4cbbf]',
                                        tab === 'READ'
                                            ? 'bg-[#3d3226] text-[#f5f1eb]'
                                            : 'bg-white text-[#3d3226] hover:bg-[#ebe5db]',
                                    ].join(' ')}
                                >
                                    읽음
                                </button>
                            </div>

                            {tab === 'READ' && (
                                <span className="text-[11px] text-[#6b5d4f] shrink-0">
                                    최근 14일
                                </span>
                            )}
                        </div>

                        {/* 모두 읽기 (미읽음 탭에서만) */}
                        {tab === 'UNREAD' && loadedUnreadCount > 0 && (
                            <button
                                onClick={handleMarkAll}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md text-xs font-medium shadow-sm"
                            >
                                <CheckCheck size={14} />
                                <span>모두 읽기</span>
                            </button>
                        )}
                    </div>

                    {errorMessage && (
                        <div className="px-4 pt-3">
                            <div className="border-2 border-red-200 bg-red-50 text-red-700 rounded-md px-3 py-2 text-sm flex items-center justify-between gap-2">
                                <span className="line-clamp-2">
                                    {errorMessage}
                                </span>
                                <button
                                    onClick={clearError}
                                    className="text-xs px-2 py-1 rounded bg-white border border-red-200 hover:bg-red-100"
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    )}

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
                                                handleMarkAsRead(
                                                    notification.id,
                                                    e,
                                                )
                                            }
                                            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                                                notification.isRead
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-600'
                                                    : 'bg-white border-[#d4cbbf]'
                                            } ${
                                                tab === 'READ'
                                                    ? 'opacity-60 cursor-default'
                                                    : ''
                                            }`}
                                            disabled={tab === 'READ'}
                                            title={
                                                tab === 'READ'
                                                    ? '이미 읽은 알림입니다.'
                                                    : '읽음 처리'
                                            }
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
                                                    className={`text-sm font-medium line-clamp-2 ${
                                                        notification.isRead
                                                            ? 'text-[#6b5d4f]'
                                                            : 'text-[#3d3226]'
                                                    }`}
                                                >
                                                    {notification.type ===
                                                    'follow'
                                                        ? `${notification.userName}님이 당신을 팔로우했습니다.`
                                                        : notification.type ===
                                                            'comment'
                                                          ? `${notification.userName}님이 ${notification.postTitle}에 댓글을 남겼습니다.`
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
                                    {tab === 'UNREAD'
                                        ? '미읽음 알림이 없습니다.'
                                        : '읽은 알림이 없습니다.'}
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
                                    className={`transition-transform ${
                                        expanded ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
