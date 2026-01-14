/** @jsxImportSource @emotion/react */
import { Menu, PenSquare, SquarePen, User, X } from "lucide-react";
// import * as s from "../pages/Header/styles";
import { useState } from 'react';

export function Header({ onOpenAuth, onNavigate, isLoggedIn = false, userNickname }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const mainCategories = [
        '고기류',
        '해산물',
        '계란',
        '밥 / 면',
        '김치 / 발효식품',
        '두부 / 콩류',
        '가공식품',
        '냉동식품',
        '채소',
        '간편식 / 즉석식품',
    ];

    const subCategories = [
        '5분 요리',
        '전자레인지',
        '재료 3개 이하',
        '불 없이 요리',
        '혼밥 / 한 그릇',
    ];

    return (
        <header className="fixed top-0 left-0 right-0 bg-[#f5f1eb] border-b-2 border-[#3d3226] z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Left: Menu & Logo */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 hover:bg-[#e5dfd5] rounded-lg transition-colors"
                        aria-label="메뉴"
                    >
                        {isMenuOpen ? <X size={24} className="text-[#3d3226]" /> : <Menu size={24} className="text-[#3d3226]" />}
                    </button>

                    <button
                        onClick={() => onNavigate?.('home')}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <div className="w-10 h-10 bg-[#3d3226] rounded-full flex items-center justify-center">
                            <span className="text-[#f5f1eb] text-sm">15</span>
                        </div>
                        <span className="text-2xl font-serif text-[#3d3226]">십오분:식탁</span>
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
                                {userNickname || '내 프로필'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => onOpenAuth('login')}
                                className="px-5 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
                            >
                                로그인
                            </button>
                            <button
                                onClick={() => onOpenAuth('signup')}
                                className="px-5 py-2 bg-[#3d3226] text-[#f5f1eb] hover:bg-[#5d4a36] transition-colors rounded-md"
                            >
                                회원가입
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Category Menu */}
            {isMenuOpen && (
                <div className="bg-[#ebe5db] border-t-2 border-[#3d3226]">
                    <nav className="max-w-7xl mx-auto px-6 py-6">
                        {/* Main Categories */}
                        <div className="mb-6">
                            <h3 className="text-sm uppercase tracking-wider text-[#6b5d4f] mb-4">메인 카테고리</h3>
                            <ul className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                <li>
                                    <button
                                        onClick={() => onNavigate?.('community')}
                                        className="w-full text-left px-4 py-3 bg-[#5d4a36] text-[#f5f1eb] hover:bg-[#3d3226] transition-colors rounded-md border border-[#3d3226]"
                                    >
                                        💬 커뮤니티
                                    </button>
                                </li>
                                {mainCategories.map((category) => (
                                    <li key={category}>
                                        <button className="w-full text-left px-4 py-3 bg-[#f5f1eb] hover:bg-[#3d3226] hover:text-[#f5f1eb] text-[#3d3226] transition-colors rounded-md border border-[#d4cbbf]">
                                            {category}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Sub Categories */}
                        <div>
                            <h3 className="text-sm uppercase tracking-wider text-[#6b5d4f] mb-4">부 카테고리</h3>
                            <ul className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {subCategories.map((category) => (
                                    <li key={category}>
                                        <button className="w-full text-left px-4 py-3 bg-[#f5f1eb] hover:bg-[#3d3226] hover:text-[#f5f1eb] text-[#3d3226] transition-colors rounded-md border border-[#d4cbbf]">
                                            {category}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Header