import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AuthModal } from '../../../components/layout/AuthModal';
import { usePrincipalState } from '../../../store/usePrincipalState';

import { AdminLayout } from '../../../components/admin/AdminLayout';
import { AdminDashboard } from '../../../components/admin/AdminDashboard';
import { UserManagement } from '../../../components/admin/UserManagement';
import { RecipeManagement } from '../../../components/admin/RecipeManagement';
import { CommunityManagement } from '../../../components/admin/CommunityManagement';

function isAdminUser(principal) {
    const roles = principal?.userRoles ?? [];
    return roles.some((ur) => {
        const roleId = Number(ur?.roleId);
        const roleName = ur?.role?.roleName;
        return (
            roleId === 1 || roleName === 'ROLE_ADMIN' || roleName === 'ADMIN'
        );
    });
}

export default function AdminPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const { principal, isLoggedIn, fetchUser, logout } = usePrincipalState();

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('signin');

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const isAdmin = useMemo(() => isAdminUser(principal), [principal]);

    const currentPage = useMemo(() => {
        const path = location.pathname; // e.g. /admin/users
        const seg = path.replace('/admin', '').split('/').filter(Boolean)[0];
        return seg ?? 'dashboard';
    }, [location.pathname]);

    useEffect(() => {
        const allowed = ['dashboard', 'users', 'recipes', 'community'];
        if (!allowed.includes(currentPage)) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [currentPage, navigate]);

    const openAuthModal = (mode = 'signin') => {
        const normalized = mode === 'login' ? 'signin' : mode;
        setAuthMode(normalized);
        setIsAuthModalOpen(true);
    };

    const handleAuthSuccess = async () => {
        await fetchUser();
        setIsAuthModalOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    const handleNavigate = (key) => {
        if (key === 'dashboard') navigate('/admin/dashboard');
        if (key === 'users') navigate('/admin/users');
        if (key === 'recipes') navigate('/admin/recipes');
        if (key === 'community') navigate('/admin/community');
    };

    if (!isLoggedIn) {
        return (
            <>
                <div className="min-h-screen bg-[#f5f1eb] flex items-center justify-center px-6">
                    <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] p-8 max-w-md w-full">
                        <h1 className="text-2xl text-[#3d3226] font-serif mb-3">
                            관리자 페이지
                        </h1>
                        <p className="text-[#6b5d4f] mb-6">
                            관리자 계정으로 로그인해야 접근할 수 있습니다.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => openAuthModal('signin')}
                                className="flex-1 px-4 py-3 bg-[#3d3226] text-[#f5f1eb] rounded-md hover:bg-[#2d251c] transition-colors"
                            >
                                로그인
                            </button>
                            <button
                                onClick={() => navigate('/', { replace: true })}
                                className="flex-1 px-4 py-3 border-2 border-[#3d3226] text-[#3d3226] rounded-md hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors"
                            >
                                홈으로
                            </button>
                        </div>
                    </div>
                </div>

                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                    mode={authMode}
                    onAuthSuccess={handleAuthSuccess}
                    onModeChange={setAuthMode}
                />
            </>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-[#f5f1eb] flex items-center justify-center px-6">
                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] p-8 max-w-md w-full">
                    <h1 className="text-2xl text-[#3d3226] font-serif mb-3">
                        접근 권한 없음
                    </h1>
                    <p className="text-[#6b5d4f] mb-6">
                        관리자 권한이 없는 계정입니다.
                    </p>
                    <button
                        onClick={() => navigate('/', { replace: true })}
                        className="w-full px-4 py-3 border-2 border-[#3d3226] text-[#3d3226] rounded-md hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors"
                    >
                        홈으로
                    </button>
                </div>
            </div>
        );
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'users':
                return <UserManagement />;
            case 'recipes':
                return <RecipeManagement />;
            case 'community':
                return <CommunityManagement />;
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <AdminLayout
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            adminName={principal?.username || '관리자'}
            onGoHome={() => navigate('/')}
        >
            {renderPage()}
        </AdminLayout>
    );
}
