import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrincipalState } from '../store/usePrincipalState';
import { useNotificationStore } from '../store/useNotificationStore';
import {
    getNotifications,
    getUnreadCount,
    markAllAsRead,
    markAsRead,
} from '../apis/generated/notification-controller/notification-controller';
import { useApiErrorMessage } from './useApiErrorMessage';
import { useNotificationRealtime } from './useNotificationRealtime';

export function useNotificationLogic() {
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [tab, setTab] = useState('UNREAD'); // 'UNREAD' | 'READ'

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
        enabled: isLoggedIn,
        activeTab: tab,
        ingest,
        refreshUnreadCount,
        pollMs: 15000,
    });

    // Initial data fetch logic
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

    // Refetch on Tab change logic
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

    // Load more when open and expanded
    useEffect(() => {
        if (open && expanded) loadMore();
    }, [open, expanded, loadMore]);

    const handleItemClick = async (notification, onNotificationClick) => {
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

    return {
        state: {
            open,
            expanded,
            tab,
            items: visible,
            itemsLength: items.length,
            canExpand,
            hasNext,
            loadingMore,
            errorMessage,
            badgeUnreadCount,
            loadedUnreadCount,
            isLoggedIn,
        },
        actions: {
            setOpen,
            setExpanded,
            setTab,
            loadMore,
            clearError,
            handleMarkAsRead,
            handleMarkAll,
            handleItemClick,
        },
    };
}
