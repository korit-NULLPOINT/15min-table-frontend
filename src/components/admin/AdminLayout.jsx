import { useState } from 'react';
import {
    Menu,
    X,
    LayoutDashboard,
    Users,
    BookOpen,
    MessageSquare,
    LogOut,
} from 'lucide-react';

export function AdminLayout({
    children,
    currentPage,
    onNavigate,
    onLogout,
    adminName,
    onGoHome,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
        { id: 'users', label: '사용자 관리', icon: Users },
        { id: 'recipes', label: '레시피 관리', icon: BookOpen },
        { id: 'community', label: '커뮤니티 관리', icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-[#f5f1eb]">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-[#3d3226] border-b-2 border-[#2d251c] z-40 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-[#4d4236] rounded-md transition-colors lg:hidden"
                    >
                        {sidebarOpen ? (
                            <X className="text-[#f5f1eb]" />
                        ) : (
                            <Menu className="text-[#f5f1eb]" />
                        )}
                    </button>
                    <h1 className="text-xl font-serif text-[#f5f1eb]">
                        십오분:식탁 관리자
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={onGoHome}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ')
                                onGoHome?.();
                        }}
                        className="flex items-center gap-2 cursor-pointer select-none rounded-md px-2 py-1 hover:bg-[#4d4236] transition-colors"
                        title="홈으로 이동"
                    >
                        <div className="w-8 h-8 bg-[#6b5d4f] rounded-full flex items-center justify-center">
                            <span className="text-[#f5f1eb] text-sm">관</span>
                        </div>
                        <span className="text-[#f5f1eb] hidden sm:block">
                            {adminName || '관리자'}
                        </span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-[#4d4236] hover:bg-[#5d5246] text-[#f5f1eb] rounded-md transition-colors"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:block">로그아웃</span>
                    </button>
                </div>
            </header>

            {/* Sidebar */}
            <aside
                className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r-2 border-[#d4cbbf] z-30 transition-transform duration-300 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}
            >
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onNavigate(item.id);
                                    if (window.innerWidth < 1024)
                                        setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                                    isActive
                                        ? 'bg-[#3d3226] text-[#f5f1eb]'
                                        : 'text-[#3d3226] hover:bg-[#f5f1eb]'
                                }`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main
                className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : ''}`}
            >
                <div className="p-3">{children}</div>
            </main>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
