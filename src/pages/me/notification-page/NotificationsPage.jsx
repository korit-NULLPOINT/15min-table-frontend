import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../../store/useNotificationStore';
import { usePrincipalState } from '../../../store/usePrincipalState';

const RECIPE_BOARD_ID = 1;

function timeAgo(isoString) {
    if (!isoString) return '';
    const t = new Date(isoString).getTime();
    const now = Date.now();
    const diffSec = Math.max(0, Math.floor((now - t) / 1000));
    if (diffSec < 60) return `${diffSec}초 전`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}분 전`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}시간 전`;
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay}일 전`;
}

function buildMessage(n) {
    const actor = n.actorUsername ?? '누군가';
    const type = (n.notificationType ?? '').toUpperCase();

    if (type.includes('FOLLOW'))
        return `${actor} 님이 회원님을 팔로우했습니다.`;
    if (type.includes('COMMENT')) return `${actor} 님이 댓글을 남겼습니다.`;
    if (type.includes('RATING') || type.includes('STAR'))
        return `${actor} 님이 평점을 남겼습니다.`;

    return `${actor} - ${n.notificationType ?? '알림'}`;
}

function getTargetPath(n) {
    if (n.recipeId) return `/boards/${RECIPE_BOARD_ID}/recipe/${n.recipeId}`;

    const type = (n.notificationType ?? '').toUpperCase();
    if (type.includes('FOLLOW') && n.actorUserId)
        return `/users/${n.actorUserId}`;

    return null;
}

export default function NotificationsPage() {
    const navigate = useNavigate();
    const { isLoggedIn } = usePrincipalState();

    const items = useNotificationStore((s) => s.items);
    const initWithMock = useNotificationStore((s) => s.initWithMock);
    const markAsReadLocal = useNotificationStore((s) => s.markAsReadLocal);
    const markAllAsReadLocal = useNotificationStore(
        (s) => s.markAllAsReadLocal,
    );

    // 페이지 진입시에도 초기화 보장(헤더가 없는 화면 대비)
    if (isLoggedIn) initWithMock();

    const unreadCount = useMemo(
        () => items.filter((n) => !n._isRead).length,
        [items],
    );

    const onClickItem = (n) => {
        if (!n._isRead) markAsReadLocal(n.notificationId);

        const target = getTargetPath(n);
        if (target) navigate(target);
    };

    if (!isLoggedIn) {
        return (
            <main className="max-w-4xl mx-auto pt-28 px-6">
                <div className="bg-white border border-[#3d3226] rounded-xl p-6">
                    <div className="text-[#3d3226] font-bold text-lg">
                        로그인이 필요합니다.
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-4xl mx-auto pt-28 px-6 pb-16">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-baseline gap-2">
                    <h1 className="text-2xl font-bold text-[#3d3226]">알림</h1>
                    {unreadCount > 0 && (
                        <span className="text-sm text-[#6b5d4a]">
                            미확인 {unreadCount}개
                        </span>
                    )}
                </div>

                <button
                    onClick={markAllAsReadLocal}
                    className="px-3 py-2 rounded-lg border border-[#3d3226] hover:bg-[#e5dfd5] transition-colors"
                >
                    모두 읽음
                </button>
            </div>

            <div className="bg-white border-2 border-[#3d3226] rounded-2xl overflow-hidden">
                {items.length === 0 ? (
                    <div className="p-6 text-[#3d3226]">알림이 없습니다.</div>
                ) : (
                    <ul>
                        {items.map((n) => (
                            <li
                                key={n.notificationId}
                                onClick={() => onClickItem(n)}
                                className={`p-4 border-b border-[#e5dfd5] cursor-pointer hover:bg-[#faf7f2] ${
                                    n._isRead ? 'opacity-70' : ''
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="text-[#3d3226] font-semibold">
                                            {buildMessage(n)}
                                        </div>
                                        <div className="text-sm text-[#6b5d4a] mt-1">
                                            {timeAgo(n.createDt)}
                                        </div>
                                    </div>

                                    {!n._isRead && (
                                        <span className="mt-1 inline-block w-2 h-2 rounded-full bg-red-600" />
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}
