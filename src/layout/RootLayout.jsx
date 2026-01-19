import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { AuthModal } from '../components/AuthModal';
import { usePrincipalState } from '../store/usePrincipalState';

export default function RootLayout() {
    const navigate = useNavigate();
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
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleNavigate = (pageKey) => {
        if (pageKey === 'home') navigate('/');
        if (pageKey === 'board') navigate('/boards/1/recipe');
        if (pageKey === 'community') navigate('/boards/2/free');
        if (pageKey === 'profile') navigate('/me'); // 추후
        if (pageKey === 'write') navigate('/boards/1/recipe/write'); // (선택) 헤더에 글쓰기 버튼 있으면
    };

    const username = principal?.username || principal?.nickname || '';

    return (
        <div className="min-h-screen bg-[#f5f1eb]">
            <Header
                onOpenAuth={openAuthModal}
                onNavigate={handleNavigate}
                isLoggedIn={isLoggedIn}
                username={username}
                onRandomRecipe={() => {}}
                onNotificationClick={() => {}}
                onLogout={handleLogout}
            />

            <Outlet />

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
