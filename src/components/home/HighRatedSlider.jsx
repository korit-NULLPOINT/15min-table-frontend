import { Star, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
// import { highRatedRecipes } from '../../utils/recipeData';

export function HighRatedSlider({ recipes = [], onRecipeClick }) {
    const scrollContainerRef = useRef(null);

    // 평점 순 정렬 (Top 10)
    const sortedRecipes = [...recipes]
        .sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
        .slice(0, 10);

    // 무한 스크롤을 위해 데이터 3배 뻥튀기 (앞/뒤 버퍼)
    // [Set1 (Buffer), Set2 (Main), Set3 (Buffer)]
    const displayRecipes = [
        ...sortedRecipes,
        ...sortedRecipes,
        ...sortedRecipes,
    ];

    // console.log(displayRecipes);

    const ITEM_WIDTH = 288; // w-72 (18rem * 16px)
    const GAP = 16; // gap-4 (1rem * 16px)
    const UNIT_WIDTH = ITEM_WIDTH + GAP;
    const SET_WIDTH = sortedRecipes.length * UNIT_WIDTH;

    // 초기 스크롤 위치 설정 (중앙 Set 시작점)
    useEffect(() => {
        if (scrollContainerRef.current && sortedRecipes.length > 0) {
            scrollContainerRef.current.scrollLeft = SET_WIDTH;
        }
    }, [sortedRecipes.length, SET_WIDTH]);

    const handleScroll = () => {
        if (!scrollContainerRef.current || sortedRecipes.length === 0) return;

        const { scrollLeft } = scrollContainerRef.current;

        // 경계값 체크 및 순간 이동 (Invisible Jump)
        // Set1의 시작점(0) 근처로 가면 Set2 동등 위치로 +SET_WIDTH
        if (scrollLeft < GAP) {
            scrollContainerRef.current.scrollLeft += SET_WIDTH;
        }
        // Set3의 시작점(2*SET_WIDTH) 근처로 가면 Set2 동등 위치로 -SET_WIDTH
        else if (scrollLeft >= SET_WIDTH * 2) {
            scrollContainerRef.current.scrollLeft -= SET_WIDTH;
        }
    };

    // 버튼 클릭 시의 부드러운 스크롤
    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = UNIT_WIDTH; // 한 아이템 단위로 이동
            const currentScroll = scrollContainerRef.current.scrollLeft;
            const targetScroll =
                direction === 'right'
                    ? currentScroll + scrollAmount
                    : currentScroll - scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: targetScroll,
                behavior: 'smooth',
            });
        }
    };

    if (recipes.length === 0) return null;

    return (
        <section className="px-6 py-8 max-w-7xl mx-auto bg-[#ebe5db] rounded-lg my-16">
            <h3 className="text-3xl mb-6 text-[#3d3226] flex items-center gap-3">
                <div className="w-10 h-10 bg-[#3d3226] rounded-full flex items-center justify-center">
                    <Award
                        size={24}
                        className="text-[#f5f1eb]"
                        strokeWidth={2.5}
                    />
                </div>
                별점 높은 레시피
            </h3>
            <div className="relative py-4">
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#3d3226] text-[#f5f1eb] p-2 rounded-full shadow-lg hover:bg-[#5d4a36] transition-colors -translate-x-4"
                    aria-label="이전"
                >
                    <ChevronLeft size={24} />
                </button>

                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {displayRecipes.map((recipe, index) => (
                        <div
                            key={`${recipe.recipeId}-${index}`}
                            className="flex-shrink-0 w-72"
                        >
                            <div
                                onClick={() =>
                                    onRecipeClick &&
                                    onRecipeClick(recipe.recipeId)
                                }
                                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer border-2 border-[#e5dfd5] hover:border-[#3d3226] h-full"
                            >
                                <div className="relative aspect-square overflow-hidden">
                                    <ImageWithFallback
                                        src={
                                            recipe.thumbnailImgUrl ||
                                            `https://picsum.photos/seed/${recipe.recipeId}/800`
                                        }
                                        alt={recipe.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <h4 className="text-lg mb-2 text-[#3d3226]">
                                        {recipe.title}
                                    </h4>
                                    {/* <p className="text-sm text-[#6b5d4f] mb-3 line-clamp-2">
                                        {recipe.intro ||
                                            '간단하고 맛있는 레시피를 확인해보세요.'}
                                    </p> */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-[#6b5d4f]">
                                            by {recipe.username || 'Unknown'}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Star
                                                size={16}
                                                fill="#f59e0b"
                                                className="text-[#f59e0b]"
                                            />
                                            <span className="text-sm font-bold text-[#3d3226]">
                                                {(
                                                    recipe.avgRating || 0
                                                ).toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#3d3226] text-[#f5f1eb] p-2 rounded-full shadow-lg hover:bg-[#5d4a36] transition-colors translate-x-4"
                    aria-label="다음"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </section>
    );
}
