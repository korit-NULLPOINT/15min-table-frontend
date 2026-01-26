import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';

import { usePrincipalState } from '../../store/usePrincipalState';
import { useNotificationStore } from '../../store/useNotificationStore';

import {
    getNotifications,
    getUnreadCount,
    markAllAsRead,
    markAsRead,
} from '../../apis/generated/notification-controller/notification-controller';

import { useApiErrorMessage } from '../../hooks/useApiErrorMessage';
import { NotificationList } from './NotificationList';
import { useNotificationRealtime } from '../../hooks/useNotificationRealtime';

export function NotificationCenter({ onNotificationClick }) {
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [tab, setTab] = useState('UNREAD'); // ✅ 'UNREAD' | 'READ'

    const rootRef = useRef(null);
    const listRef = useRef(null);

    const initUserIdRef = useRef(null);

    const principal = usePrincipalState((s) => s.principal);
    const isLoggedIn = !!principal;

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
            // ignore
        }
    }, [setBadgeUnreadCount]);

    useNotificationRealtime({
        enabled: isLoggedIn, // ✅ 로그인 상태에서만 연결
        activeTab: tab, // ✅ 'UNREAD' | 'READ'
        ingest, // ✅ UNREAD 탭일 때만 리스트 반영(훅 내부 정책)
        refreshUnreadCount, // ✅ 뱃지 보정 + 폴링
        pollMs: 15000,
    });

    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            if (!isLoggedIn) {
                setOpen(false);
                setExpanded(false);
                setTab('UNREAD');
                initUserIdRef.current = null;
                reset();
                clearError();
                return;
            }

            const userId = principal?.userId;
            if (userId == null) return;

            if (initUserIdRef.current === userId) return;
            initUserIdRef.current = userId;

            setTab('UNREAD');
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

    useEffect(() => {
        if (open && expanded) loadMore();
    }, [open, expanded, loadMore]);

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
                className={[
                    'relative',
                    'cursor-pointer',
                    'p-2 -m-2',
                    'rounded-full',
                    'transition-all duration-150',
                    'hover:bg-[#ebe5db]',
                    'active:scale-95',
                    'focus:outline-none focus:ring-2 focus:ring-[#3d3226]/30',
                ].join(' ')}
                aria-label="알림"
            >
                <Bell size={25} className="text-[#3d3226]" />
                {badgeUnreadCount > 0 && (
                    <div className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
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

                            {/* Tabs */}
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

                        {/* Mark all (UNREAD only) */}
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

                    <NotificationList
                        tab={tab}
                        visible={visible}
                        itemsLength={items.length}
                        expanded={expanded}
                        canExpand={canExpand}
                        hasNext={hasNext}
                        loadingMore={loadingMore}
                        errorMessage={errorMessage}
                        onClearError={clearError}
                        listRef={listRef}
                        onScroll={handleScroll}
                        onItemClick={handleItemClick}
                        onMarkAsRead={handleMarkAsRead}
                        onToggleExpanded={() => setExpanded((v) => !v)}
                    />
                </div>
            )}
        </div>
    );
}
