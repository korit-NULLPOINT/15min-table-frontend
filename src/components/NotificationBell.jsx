import { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../store/useNotificationStore';
import { usePrincipalState } from '../store/usePrincipalState';

export default function NotificationBell() {
    const navigate = useNavigate();
    const { isLoggedIn } = usePrincipalState();

    const initWithMock = useNotificationStore((s) => s.initWithMock);
    const reset = useNotificationStore((s) => s.reset);
    const unreadCount = useNotificationStore((s) => s.getUnreadCount());

    useEffect(() => {
        if (!isLoggedIn) {
            reset();
            return;
        }
        initWithMock();
    }, [isLoggedIn, initWithMock, reset]);

    if (!isLoggedIn) return null;

    return (
        <button
            onClick={() => navigate('/me/notifications')}
            className="relative p-2 hover:bg-[#e5dfd5] rounded-lg transition-colors"
            aria-label="알림"
        >
            <Bell size={22} className="text-[#3d3226]" />
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[11px] flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                </span>
            )}
        </button>
    );
}
