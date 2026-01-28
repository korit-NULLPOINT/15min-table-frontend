import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { AuthModal } from '../components/layout/AuthModal';
import { usePrincipalState } from '../store/usePrincipalState';
import { useQueryClient } from '@tanstack/react-query';
import { getGetBookmarkListByUserIdQueryKey } from '../apis/generated/bookmark-controller/bookmark-controller';

export default function RootLayout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isLoggedIn, principal, fetchUser, logout } = usePrincipalState();

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('signin');

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const openAuthModal = (mode = 'signin') => {
        const normalized = mode === 'login' ? 'signin' : mode;
        setAuthMode(normalized);
        setIsAuthModalOpen(true);
    };

    const handleAuthSuccess = async () => {
        await fetchUser();
        queryClient.invalidateQueries({
            queryKey: getGetBookmarkListByUserIdQueryKey(),
        });
    };
    const handleLogout = () => {
        logout();
        queryClient.invalidateQueries({
            queryKey: getGetBookmarkListByUserIdQueryKey(),
        });
        navigate('/');
    };

    function isAdmin(principal) {
        const roles = principal?.userRoles ?? [];
        return roles.some((ur) => Number(ur?.roleId) === 1);
    }

    const handleNavigate = (pageKey) => {
        if (pageKey === 'home') navigate('/');
        if (pageKey === 'board') navigate('/boards/1/recipe/filtered');
        if (pageKey === 'community') navigate('/boards/2/free');
        if (pageKey === 'profile') {
            if (isAdmin(principal)) {
                navigate('/admin/dashboard'); // ✅ 관리자면 관리자 대시보드
            } else {
                navigate('/me'); // ✅ 일반 유저면 마이페이지
            }
        }
        if (pageKey === 'write') navigate('/boards/1/recipe/write');
    };

    const username = principal?.username || '';

    const handleNotificationClick = (notification) => {
        const raw = notification?.raw ?? {};
        const notificationType = (
            raw.notificationType ??
            raw.type ??
            ''
        ).toUpperCase();
        const targetType = (raw.targetType ?? '').toUpperCase();
        const targetId = raw.targetId;
        const actorUserId = raw.actorUserId;
        const commentId = raw.commentId;

        // FOLLOW → 해당 유저 프로필로
        if (notificationType === 'FOLLOW') {
            if (actorUserId != null) navigate(`/users/${actorUserId}`);
            return;
        }

        // COMMENT / RECIPE_POST → targetType에 따라 이동
        if (targetType === 'RECIPE' && targetId != null) {
            // commentId를 쿼리/해시로 넘기고 싶으면 여기서 붙여
            // navigate(`/boards/1/recipe/${targetId}?commentId=${commentId ?? ''}`);
            navigate(`/boards/1/recipe/${targetId}`);
            return;
        }

        if (targetType === 'POST' && targetId != null) {
            navigate(`/boards/2/free/${targetId}`);
            return;
        }

        // 예외 fallback
        console.warn('Unknown notification target:', raw);
    };

    return (
        <div className="min-h-screen bg-[#f5f1eb]">
            <Header
                onOpenAuth={openAuthModal}
                onNavigate={handleNavigate}
                isLoggedIn={isLoggedIn}
                username={username}
                onNotificationClick={handleNotificationClick}
                onLogout={handleLogout}
            />
            <Outlet context={{ openAuthModal }} />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                mode={authMode}
                onAuthSuccess={handleAuthSuccess}
                onModeChange={setAuthMode}
            />
        </div>
    );
}
