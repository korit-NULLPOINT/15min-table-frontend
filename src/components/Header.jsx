import { useState, useRef, useEffect } from 'react';
import {
    Menu,
    X,
    User,
    PenSquare,
    Bell,
    CheckCircle2,
    ChevronDown,
    CheckCheck,
} from 'lucide-react';
import { getPrincipal } from '../apis/generated/user-account-controller/user-account-controller';

export function Header({
    onOpenAuth,
    onNavigate,
    isLoggedIn = false,
    username,
    onRandomRecipe,
    onLogout,
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showAllNotifications, setShowAllNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'follow',
            userName: '요리왕김치',
            userImage: '',
            timestamp: '5분 전',
            isRead: false,
        },
        {
            id: 2,
            type: 'post',
            userName: '자취생24',
            userImage: '',
            postTitle: '초간단 김치볶음밥',
            timestamp: '1시간 전',
            isRead: false,
        },
        {
            id: 3,
            type: 'post',
            userName: '혼밥러버',
            userImage: '',
            postTitle: '5분만에 완성하는 덮밥',
            timestamp: '2시간 전',
            isRead: false,
        },
        {
            id: 4,
            type: 'follow',
            userName: '파스타사랑',
            userImage: '',
            timestamp: '3시간 전',
            isRead: false,
        },
        {
            id: 5,
            type: 'post',
            userName: '라면킹',
            userImage: '',
            postTitle: '라면 맛있게 끓이는 법',
            timestamp: '5시간 전',
            isRead: false,
        },
        {
            id: 6,
            type: 'post',
            userName: '냉장고털이',
            userImage: '',
            postTitle: '냉장고 파먹기 레시피',
            timestamp: '6시간 전',
            isRead: true,
        },
        {
            id: 7,
            type: 'follow',
            userName: '자취요정',
            userImage: '',
            timestamp: '8시간 전',
            isRead: true,
        },
        {
            id: 8,
            type: 'post',
            userName: '간편식덕후',
            userImage: '',
            postTitle: '전자레인지로 5분 요리',
            timestamp: '10시간 전',
            isRead: true,
        },
        {
            id: 9,
            type: 'post',
            userName: '요리초보',
            userImage: '',
            postTitle: '불 없이 요리하기',
            timestamp: '12시간 전',
            isRead: true,
        },
        {
            id: 10,
            type: 'follow',
            userName: '혼자밥먹자',
            userImage: '',
            timestamp: '1일 전',
            isRead: true,
        },
        {
            id: 11,
            type: 'post',
            userName: '김치러버',
            userImage: '',
            postTitle: '김치찌개 황금 레시피',
            timestamp: '1일 전',
            isRead: true,
        },
        {
            id: 12,
            type: 'post',
            userName: '달걀마스터',
            userImage: '',
            postTitle: '달걀 요리 10가지',
            timestamp: '2일 전',
            isRead: true,
        },
    ]);

    const notificationRef = useRef(null);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    useEffect(() => {
        const fetchPrincipal = async () => {
            try {
                const response = await getPrincipal();
                // console.log(response);
                setUserData(response.data);
            } catch (e) {
                console.error('Failed to fetch principal', e);
            }
        };
        fetchPrincipal();

        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationItemClick = (notification) => {
        // Mark as read
        setNotifications(
            notifications.map((n) =>
                n.id === notification.id ? { ...n, isRead: true } : n,
            ),
        );
        setShowNotifications(false);
        onNotificationClick?.(notification);
    };

    const handleToggleNotificationRead = (notificationId, e) => {
        e.stopPropagation();
        setNotifications(
            notifications.map((n) =>
                n.id === notificationId ? { ...n, isRead: !n.isRead } : n,
            ),
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
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

                        <button
                            onClick={() => onNavigate?.('home')}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            {/* Logo: Plate with 15 and utensils */}
                            <div className="relative w-12 h-12 flex items-center justify-center">
                                {/* Outer circle - plate/table */}
                                <div className="absolute w-12 h-12 border-4 border-[#3d3226] rounded-full" />
                                {/* Inner decorative circle */}
                                <div className="absolute w-9 h-9 border-2 border-[#d4cbbf] rounded-full" />

                                {/* "15" text in center */}
                                <span className="text-[#3d3226] font-bold text-sm relative z-10">
                                    15
                                </span>

                                {/* Chopsticks and Spoon at bottom (larger) */}
                                <div className="absolute -bottom-1 flex gap-0.5 items-end">
                                    {/* Chopsticks */}
                                    <div className="w-0.5 h-5 bg-[#3d3226] rounded-full" />
                                    <div className="w-0.5 h-5 bg-[#3d3226] rounded-full" />
                                    {/* Spoon */}
                                    <div className="flex flex-col items-center ml-1">
                                        <div className="w-2 h-2.5 bg-[#3d3226] rounded-full" />
                                        <div className="w-1 h-3 bg-[#3d3226] rounded-full -mt-0.5" />
                                    </div>
                                </div>
                            </div>
                            <span className="text-2xl font-serif text-[#3d3226]">
                                십오분:식탁
                            </span>
                        </button>
                    </div>

                    {/* Right: Auth Buttons or User Profile */}
                    <div className="flex items-center gap-3">
                        {isLoggedIn ? (
                            <>
                                <button
                                    onClick={() => onNavigate?.('write')}
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
                                    {userData?.username || '내 프로필'}
                                </button>
                                <button
                                    onClick={() =>
                                        setShowNotifications(!showNotifications)
                                    }
                                    className="relative"
                                >
                                    <Bell
                                        size={20}
                                        className="text-[#3d3226] hover:text-[#5d4a36] transition-colors"
                                    />
                                    {unreadCount > 0 && (
                                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {unreadCount}
                                        </div>
                                    )}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => onOpenAuth('signin')}
                                    className="px-6 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
                                >
                                    로그인
                                </button>
                                <button
                                    onClick={() => onOpenAuth('signup')}
                                    className="px-6 py-2 bg-[#3d3226] text-[#f5f1eb] hover:bg-[#5d4a36] transition-colors rounded-md"
                                >
                                    회원가입
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-80 bg-[#f5f1eb] border-r-2 border-[#3d3226] z-50 transform transition-transform duration-300 overflow-y-auto ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-6">
                    {/* Close Button */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-serif text-[#3d3226]">
                            메뉴
                        </h2>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-2 hover:bg-[#e5dfd5] rounded-lg transition-colors"
                        >
                            <X size={24} className="text-[#3d3226]" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-6">
                        {/* Recipe Board Link */}
                        <div>
                            <button
                                onClick={() => {
                                    onNavigate?.('board');
                                    setIsSidebarOpen(false);
                                }}
                                className="w-full text-left px-4 py-4 bg-[#3d3226] text-[#f5f1eb] hover:bg-[#5d4a36] transition-colors rounded-md text-lg font-medium"
                            >
                                📋 레시피 게시판
                            </button>
                        </div>

                        {/* Community Link */}
                        <div>
                            <button
                                onClick={() => {
                                    onNavigate?.('community');
                                    setIsSidebarOpen(false);
                                }}
                                className="w-full text-left px-4 py-4 bg-[#5d4a36] text-[#f5f1eb] hover:bg-[#3d3226] transition-colors rounded-md text-lg font-medium"
                            >
                                💬 커뮤니티
                            </button>
                        </div>
                    </nav>

                    {/* Logo Section in Middle */}
                    <button
                        onClick={() => {
                            onRandomRecipe?.();
                            setIsSidebarOpen(false);
                        }}
                        className="mt-12 mb-12 flex flex-col items-center py-8 bg-white/50 rounded-lg border-2 border-[#d4cbbf] w-full hover:bg-white/80 hover:border-[#3d3226] transition-all hover:shadow-lg group"
                    >
                        {/* Large decorative logo */}
                        <div className="relative w-32 h-32 mb-4">
                            {/* Outer decorative circle - vintage plate */}
                            <div className="absolute inset-0 border-8 border-[#3d3226] rounded-full group-hover:border-[#5d4a36] transition-colors" />
                            <div className="absolute inset-2 border-4 border-[#d4cbbf] rounded-full" />

                            {/* "15" in center */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span
                                    className="text-5xl font-bold text-[#3d3226] relative z-10 group-hover:scale-110 transition-transform"
                                    style={{ fontFamily: 'serif' }}
                                >
                                    15
                                </span>
                            </div>

                            {/* Chopsticks and Spoon at bottom (larger) */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1 items-end">
                                {/* Chopsticks */}
                                <div className="w-1 h-12 bg-[#3d3226] rounded-full" />
                                <div className="w-1 h-12 bg-[#3d3226] rounded-full" />
                                {/* Spoon */}
                                <div className="flex flex-col items-center ml-2">
                                    <div className="w-4 h-6 bg-[#3d3226] rounded-full" />
                                    <div className="w-2 h-7 bg-[#3d3226] rounded-full -mt-1" />
                                </div>
                            </div>
                        </div>

                        {/* Text */}
                        <h3 className="text-2xl font-serif text-[#3d3226] mb-1">
                            십오분:식탁
                        </h3>
                        <p className="text-sm text-[#6b5d4f] text-center px-4 mb-2">
                            15분이면 충분한
                            <br />
                            식탁 위의 행복
                        </p>
                        <p className="text-xs text-[#3d3226] font-medium bg-[#f5f1eb] px-3 py-1 rounded-full border border-[#d4cbbf] group-hover:bg-[#3d3226] group-hover:text-[#f5f1eb] transition-colors">
                            🎲 클릭하면 랜덤 레시피!
                        </p>
                    </button>

                    {/* Bottom Auth Buttons */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-[#f5f1eb] border-t-2 border-[#d4cbbf]">
                        {isLoggedIn ? (
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        onNavigate?.('profile');
                                        setIsSidebarOpen(false);
                                    }}
                                    className="w-full px-4 py-3 bg-white border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md font-medium"
                                >
                                    👤 마이페이지
                                </button>

                                <button
                                    onClick={() => {
                                        onLogout?.(); // ✅ 로그아웃 실행
                                        setIsSidebarOpen(false);
                                    }}
                                    className="w-full px-4 py-3 bg-white border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-[#f5f1eb] transition-colors rounded-md font-medium"
                                >
                                    🚪 로그아웃
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        onOpenAuth('signin');
                                        setIsSidebarOpen(false);
                                    }}
                                    className="w-full px-4 py-3 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md font-medium"
                                >
                                    로그인
                                </button>
                                <button
                                    onClick={() => {
                                        onOpenAuth('signup');
                                        setIsSidebarOpen(false);
                                    }}
                                    className="w-full px-4 py-3 bg-[#3d3226] text-[#f5f1eb] hover:bg-[#5d4a36] transition-colors rounded-md font-medium"
                                >
                                    회원가입
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Notifications */}
            {showNotifications && (
                <div
                    className="fixed top-16 right-6 bg-[#f5f1eb] border-2 border-[#3d3226] rounded-lg shadow-lg z-50 w-96 max-h-[80vh] flex flex-col"
                    ref={notificationRef}
                >
                    <div className="p-4 border-b-2 border-[#d4cbbf] flex items-center justify-between">
                        <h3 className="text-xl font-serif text-[#3d3226]">
                            알림
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 transition-colors rounded-md text-xs font-medium shadow-sm"
                            >
                                <CheckCheck size={14} />
                                <span>모두 읽기</span>
                            </button>
                        )}
                    </div>

                    <div
                        className={`flex-1 overflow-y-auto p-4 ${showAllNotifications ? 'max-h-[calc(80vh-200px)]' : ''}`}
                    >
                        <div className="space-y-2">
                            {(showAllNotifications
                                ? notifications
                                : notifications.slice(0, 5)
                            ).map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`rounded-md transition-all border-2 ${
                                        notification.isRead
                                            ? 'bg-white border-[#e5dfd5]'
                                            : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
                                    }`}
                                >
                                    <div className="flex items-start gap-3 py-3 px-4 relative">
                                        {/* Checkbox */}
                                        <button
                                            onClick={(e) =>
                                                handleToggleNotificationRead(
                                                    notification.id,
                                                    e,
                                                )
                                            }
                                            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                                notification.isRead
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-600'
                                                    : 'bg-white border-[#d4cbbf] hover:border-emerald-400'
                                            }`}
                                        >
                                            {notification.isRead && (
                                                <CheckCircle2
                                                    size={14}
                                                    className="text-white"
                                                />
                                            )}
                                        </button>

                                        <div
                                            onClick={() =>
                                                handleNotificationItemClick(
                                                    notification,
                                                )
                                            }
                                            className="flex items-start gap-3 flex-1 cursor-pointer"
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                    notification.isRead
                                                        ? 'bg-[#d4cbbf]'
                                                        : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                                                }`}
                                            >
                                                {notification.type ===
                                                'follow' ? (
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
                                                    {notification.type ===
                                                    'follow'
                                                        ? `${notification.userName}님이 당신을 팔로우했습니다.`
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
                        </div>
                    </div>

                    <div className="p-4 border-t-2 border-[#d4cbbf] bg-[#f5f1eb]">
                        {notifications.length > 5 && (
                            <button
                                onClick={() =>
                                    setShowAllNotifications(
                                        !showAllNotifications,
                                    )
                                }
                                className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 transition-colors rounded-md text-sm font-medium flex items-center justify-center gap-2 shadow-md"
                            >
                                <span>
                                    {showAllNotifications ? '닫기' : '더보기'}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform ${showAllNotifications ? 'rotate-180' : ''}`}
                                />
                            </button>
                        )}

                        {showAllNotifications && notifications.length > 5 && (
                            <div className="mt-2 text-center">
                                <p className="text-xs text-[#6b5d4f]">
                                    전체 {notifications.length}개의 알림
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
