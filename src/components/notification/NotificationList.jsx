import { ChevronDown } from 'lucide-react';
import { NotificationItem } from './NotificationItem';

export function NotificationList({
    tab,
    visible,
    itemsLength,

    expanded,
    canExpand,
    hasNext,
    loadingMore,

    errorMessage,
    onClearError,

    listRef,
    onScroll,

    onItemClick,
    onMarkAsRead,

    onToggleExpanded,
}) {
    return (
        <>
            {errorMessage && (
                <div className="px-4 pt-3">
                    <div className="border-2 border-red-200 bg-red-50 text-red-700 rounded-md px-3 py-2 text-sm flex items-center justify-between gap-2">
                        <span className="line-clamp-2">{errorMessage}</span>
                        <button
                            onClick={onClearError}
                            className="text-xs px-2 py-1 rounded bg-white border border-red-200 hover:bg-red-100"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}

            <div
                ref={listRef}
                onScroll={onScroll}
                className="flex-1 overflow-y-auto p-4"
            >
                <div className="space-y-2">
                    {visible.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            tab={tab}
                            onItemClick={onItemClick}
                            onMarkAsRead={onMarkAsRead}
                        />
                    ))}

                    {expanded && loadingMore && (
                        <div className="text-center text-xs text-[#6b5d4f] py-3">
                            불러오는 중...
                        </div>
                    )}

                    {expanded && !hasNext && itemsLength > 0 && (
                        <div className="text-center text-xs text-[#6b5d4f] py-3">
                            더 이상 알림이 없습니다.
                        </div>
                    )}

                    {itemsLength === 0 && (
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
                        onClick={onToggleExpanded}
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
        </>
    );
}
