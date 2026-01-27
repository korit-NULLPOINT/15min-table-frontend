import { useCallback, useEffect, useRef } from 'react';

import { NotificationList } from './NotificationList';
import { useNotificationLogic } from '../../hooks/useNotificationLogic';
import { NotificationBell } from './NotificationBell';
import { NotificationHeader } from './NotificationHeader';

export function NotificationCenter({ onNotificationClick }) {
    const rootRef = useRef(null);
    const listRef = useRef(null);

    const { state, actions } = useNotificationLogic();

    const {
        open,
        expanded,
        tab,
        items,
        itemsLength,
        canExpand,
        hasNext,
        loadingMore,
        errorMessage,
        badgeUnreadCount,
        loadedUnreadCount,
        isLoggedIn,
    } = state;

    const {
        setOpen,
        setExpanded,
        setTab,
        loadMore,
        clearError,
        handleMarkAsRead,
        handleMarkAll,
        handleItemClick,
    } = actions;

    useEffect(() => {
        if (!open) return;
        const fn = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target))
                setOpen(false);
        };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, [open, setOpen]);

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

    if (!isLoggedIn) return null;

    return (
        <div className="relative" ref={rootRef}>
            <NotificationBell
                onClick={() => {
                    setOpen((v) => !v);
                    clearError();
                }}
                count={badgeUnreadCount}
            />

            {open && (
                <div className="fixed top-16 right-6 bg-[#f5f1eb] border-2 border-[#3d3226] rounded-lg shadow-lg z-[9999] w-96 max-h-[80vh] flex flex-col">
                    <NotificationHeader
                        tab={tab}
                        setTab={setTab}
                        onMarkAll={handleMarkAll}
                        hasUnread={loadedUnreadCount > 0}
                    />

                    <NotificationList
                        tab={tab}
                        visible={items}
                        itemsLength={itemsLength}
                        expanded={expanded}
                        canExpand={canExpand}
                        hasNext={hasNext}
                        loadingMore={loadingMore}
                        errorMessage={errorMessage}
                        onClearError={clearError}
                        listRef={listRef}
                        onScroll={handleScroll}
                        onItemClick={(item) =>
                            handleItemClick(item, onNotificationClick)
                        }
                        onMarkAsRead={handleMarkAsRead}
                        onToggleExpanded={() => setExpanded((v) => !v)}
                    />
                </div>
            )}
        </div>
    );
}
