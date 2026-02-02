import { useState, useMemo, useEffect } from 'react';
import { Menu, User, PenSquare, Mail } from 'lucide-react';
import { Alert, AlertTitle, Box, Slide, Typography } from '@mui/material';
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

    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        let timer;
        if (showAuthModal) {
            timer = setTimeout(() => {
                setShowAuthModal(false);
                onNavigate?.('profile');
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [showAuthModal, onNavigate]);

    const handleWriteClick = () => {
        const minId = Math.min(
            ...(principal?.userRoles?.map((r) => r.roleId) || [Infinity]),
        );
        if (minId >= 3) {
            setShowAuthModal(true);
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
            <header className="fixed top-0 left-0 right-0 bg-[#f5f1eb] border-b-2 border-[#3d3226] z-50">
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

            {/* Unverified Account Alert (Top Right) */}
            <Slide
                direction="left"
                in={showAuthModal}
                mountOnEnter
                unmountOnExit
            >
                <Box
                    sx={{
                        position: 'fixed',
                        top: 80, // Header height approx
                        right: 200, // Roughly under the write button area (Write button is left of profile)
                        zIndex: 9999,
                        width: 'auto',
                        maxWidth: 400,
                        boxShadow: 4,
                        borderRadius: 2,
                    }}
                >
                    <Alert
                        severity="warning"
                        variant="filled"
                        sx={{
                            backgroundColor: '#d97706',
                            color: '#fff',
                            '& .MuiAlert-icon': {
                                color: '#fff',
                            },
                        }}
                    >
                        <AlertTitle fontWeight="bold" sx={{ mb: 1 }}>
                            미인증 계정 알림
                        </AlertTitle>
                        레시피 작성을 위해서는 이메일 인증이 필요합니다.
                        <Typography
                            variant="body2"
                            fontSize={12}
                            sx={{ mt: 1 }}
                        >
                            2초 후 프로필 페이지로 이동합니다...
                        </Typography>
                    </Alert>
                </Box>
            </Slide>
        </>
    );
}
