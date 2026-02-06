import { useState } from 'react';
import { Menu, User, PenSquare } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { usePrincipalState } from '../../store/usePrincipalState';
import { Sidebar } from './Sidebar';
import { LogoButton } from './LogoButton';
import { NotificationCenter } from '../notification/NotificationCenter';

export function Header({ onOpenAuth, onNavigate, onNotificationClick }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const principal = usePrincipalState((s) => s.principal);
    const isLoggedIn = !!principal;
    const logout = usePrincipalState((s) => s.logout);

    const handleWriteClick = () => {
        const minId = Math.min(
            ...(principal?.userRoles?.map((r) => r.roleId) || [Infinity]),
        );
        if (minId >= 3) {
            toast.warning('미인증 계정입니다. 이메일 인증을 완료해주세요.');
            setTimeout(() => onNavigate?.('profile'), 2000);
        } else {
            onNavigate?.('write');
        }
    };

    const handleLogout = () => {
        logout();
        setIsSidebarOpen(false);
        navigate('/', { replace: true });
    };

    return (
        <>
            <header className="w-full bg-[#f5f1eb] border-b-2 border-[#3d3226] z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Left: Menu & Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-[#e5dfd5] rounded-lg transition-colors"
                            aria-label="메뉴"
                        >
                            <Menu size={24} className="text-[#3d3226]" />
                        </button>

                        <LogoButton onClick={() => onNavigate?.('home')} />
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                        {isLoggedIn ? (
                            <>
                                <button
                                    onClick={handleWriteClick}
                                    className="flex items-center gap-2 px-5 py-2 bg-[#3d3226] text-[#f5f1eb] hover:bg-[#5d4a36] transition-colors rounded-md"
                                >
                                    <PenSquare size={20} />
                                    글쓰기
                                </button>

                                <button
                                    onClick={() => onNavigate?.('profile')}
                                    className="flex items-center gap-2 px-5 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
                                >
                                    <User size={20} />
                                    {principal?.username || '내 프로필'}
                                </button>

                                <NotificationCenter
                                    onNotificationClick={onNotificationClick}
                                />
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => onOpenAuth?.('signin')}
                                    className="px-6 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
                                >
                                    로그인
                                </button>
                                <button
                                    onClick={() => onOpenAuth?.('signup')}
                                    className="px-6 py-2 bg-[#3d3226] text-[#f5f1eb] hover:bg-[#5d4a36] transition-colors rounded-md"
                                >
                                    회원가입
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isLoggedIn={isLoggedIn}
                username={principal?.username}
                onNavigate={(key) => onNavigate?.(key)}
                onOpenAuth={onOpenAuth}
                onLogout={handleLogout}
            />
        </>
    );
}
