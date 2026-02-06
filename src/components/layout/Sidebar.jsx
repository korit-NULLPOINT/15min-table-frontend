import { useState } from 'react';
import { X, Shuffle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetRecipeList } from '../../apis/generated/recipe-controller/recipe-controller';

export function Sidebar({
    isOpen,
    onClose,

    isLoggedIn,
    username,

    onNavigate, // (key) => void  ex) 'board' | 'community' | 'profile'
    // onRandomRecipe, // () => void
    onOpenAuth, // (mode) => void ex) 'signin' | 'signup'
    onLogout, // () => void
}) {
    const navigate = useNavigate();

    const [randomStatus, setRandomStatus] = useState('idle'); // 'idle' | 'picking' | 'result'

    // 1. 훅을 선언하되, 'enabled: false'로 자동 실행을 막습니다. (중요 ⭐)
    // 버튼을 누르기 전에는 서버 요청을 절대 보내지 않습니다.
    const { refetch, isFetching } = useGetRecipeList(
        1, // boardId (레시피 게시판)
        { page: 0, size: 1000 }, // 전체를 다 훑어야 랜덤이 의미가 있으므로 넉넉하게
        {
            query: {
                enabled: false, // 컴포넌트 마운트 시 자동 실행 방지
                staleTime: 1000 * 60 * 5, // 5분 정도는 캐시된 데이터 써도 됨 (반복 클릭 시 빠름)
            },
        },
    );

    const handleRecipeClick = (recipeId) => {
        navigate(`/board/1/recipe/${recipeId}`);
    };

    const handleRandomClick = async () => {
        try {
            // 상태 시작: picking ('고르는 중...')
            setRandomStatus('picking');

            // 1단계: 데이터 가져오기 + 최소 1초 대기
            const pickingDelay = new Promise((resolve) =>
                setTimeout(resolve, 1000),
            );
            const fetchPromise = refetch();

            const [_, result] = await Promise.all([pickingDelay, fetchPromise]);
            const recipes = result?.data?.data?.data?.items || [];

            if (recipes.length > 0) {
                // 2단계: 결과 확인 멘트 + 1초 대기 ('오늘 뭐 먹지?')
                setRandomStatus('result');
                await new Promise((resolve) => setTimeout(resolve, 500));

                const randomIndex = Math.floor(Math.random() * recipes.length);
                const randomRecipeId = recipes[randomIndex].recipeId;

                // console.log(`당첨된 레시피 ID: ${randomRecipeId}`);  // 테스트 코드

                handleRecipeClick(randomRecipeId);
                onClose?.();
            } else {
                toast.error('등록된 레시피가 없습니다 ㅠㅠ');
            }
        } catch (error) {
            console.error('랜덤 레시피 실패:', error);
            toast.error('레시피를 불러오는데 실패했습니다.');
        } finally {
            setRandomStatus('idle');
        }
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-80 bg-[#f5f1eb] border-r-2 border-[#3d3226] z-50 transform transition-transform duration-300 overflow-y-auto ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-6">
                    {/* Close Button */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-serif text-[#3d3226]">
                            메뉴
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-[#e5dfd5] rounded-lg transition-colors"
                        >
                            <X size={24} className="text-[#3d3226]" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-6">
                        <div>
                            <button
                                onClick={() => {
                                    onNavigate?.('board');
                                    onClose?.();
                                }}
                                className="w-full text-left px-4 py-4 bg-[#3d3226] text-[#f5f1eb] hover:bg-[#5d4a36] transition-colors rounded-md text-lg font-medium"
                            >
                                📋 레시피 게시판
                            </button>
                        </div>

                        <div>
                            <button
                                onClick={() => {
                                    onNavigate?.('community');
                                    onClose?.();
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
                            handleRandomClick();
                        }}
                        disabled={randomStatus !== 'idle'}
                        className="mt-12 mb-12 flex flex-col items-center py-8 bg-white/50 rounded-lg border-2 border-[#d4cbbf] w-full hover:bg-white/80 hover:border-[#3d3226] transition-all hover:shadow-lg group"
                    >
                        <div className="relative w-32 h-32 mb-4">
                            <div className="absolute inset-0 border-8 border-[#3d3226] rounded-full group-hover:border-[#5d4a36] transition-colors" />
                            <div className="absolute inset-2 border-4 border-[#d4cbbf] rounded-full" />

                            <div className="absolute inset-0 flex items-center justify-center">
                                <span
                                    className="text-5xl font-bold text-[#3d3226] relative z-10 group-hover:scale-110 transition-transform"
                                    style={{ fontFamily: 'serif' }}
                                >
                                    15
                                </span>
                            </div>

                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1 items-end">
                                <div className="w-1 h-12 bg-[#3d3226] rounded-full" />
                                <div className="w-1 h-12 bg-[#3d3226] rounded-full" />
                                <div className="flex flex-col items-center ml-2">
                                    <div className="w-4 h-6 bg-[#3d3226] rounded-full" />
                                    <div className="w-2 h-7 bg-[#3d3226] rounded-full -mt-1" />
                                </div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-serif text-[#3d3226] mb-1">
                            십오분:식탁
                        </h3>
                        <p className="text-sm text-[#6b5d4f] text-center px-4 mb-2">
                            15분이면 충분한
                            <br />
                            식탁 위의 행복
                        </p>
                        <div className="relative w-full h-8 flex items-center justify-center">
                            {/* Active State (Picking / Result) */}
                            <div
                                className={`absolute transition-opacity duration-500 ease-in-out ${
                                    randomStatus !== 'idle'
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                }`}
                            >
                                <p className="flex items-center gap-2 text-xs text-[#3d3226] font-medium bg-[#f5f1eb] px-3 py-1 rounded-full border border-[#d4cbbf]">
                                    <Shuffle
                                        size={14}
                                        className={
                                            randomStatus === 'picking'
                                                ? 'animate-spin'
                                                : ''
                                        }
                                    />
                                    {randomStatus === 'picking'
                                        ? '고르는 중...'
                                        : '오늘 뭐 먹지?'}
                                </p>
                            </div>

                            {/* Idle State */}
                            <div
                                className={`absolute transition-opacity duration-500 ease-in-out ${
                                    randomStatus === 'idle'
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                }`}
                            >
                                <p className="text-xs text-[#3d3226] font-medium bg-[#f5f1eb] px-3 py-1 rounded-full border border-[#d4cbbf] group-hover:bg-[#3d3226] group-hover:text-[#f5f1eb] transition-colors">
                                    🎲 클릭하면 랜덤 레시피!
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* Bottom Auth Buttons */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-[#f5f1eb] border-t-2 border-[#d4cbbf]">
                        {isLoggedIn ? (
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        onNavigate?.('profile');
                                        onClose?.();
                                    }}
                                    className="w-full px-4 py-3 bg-white border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md font-medium"
                                >
                                    👤 마이페이지
                                    {username ? ` (${username})` : ''}
                                </button>

                                <button
                                    onClick={() => {
                                        onLogout?.();
                                        onClose?.();
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
                                        onOpenAuth?.('signin');
                                        onClose?.();
                                    }}
                                    className="w-full px-4 py-3 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md font-medium"
                                >
                                    로그인
                                </button>
                                <button
                                    onClick={() => {
                                        onOpenAuth?.('signup');
                                        onClose?.();
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
        </>
    );
}
