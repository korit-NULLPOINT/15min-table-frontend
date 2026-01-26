import { User, PenSquare, CheckCircle2, ChevronDown } from 'lucide-react';

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
                                        onMarkAsRead(notification.id, e)
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
                                    onClick={() => onItemClick(notification)}
                                    className="flex items-start gap-3 flex-1 cursor-pointer"
                                >
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            notification.isRead
                                                ? 'bg-[#d4cbbf]'
                                                : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                                        }`}
                                    >
                                        {notification.type === 'follow' ? (
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
                                            {notification.type === 'follow'
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
