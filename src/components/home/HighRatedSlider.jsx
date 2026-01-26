import { Star, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { useMemo } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import { usePrincipalState } from '../../store/usePrincipalState';
import { HighRatedCard } from './HighRatedCard';

export function HighRatedSlider({
    recipes = [],
    onRecipeClick,
    onOpenAuth,
    bookmarkedRecipeIds,
    onToggleBookmark,
}) {
    const sortedRecipes = useMemo(() => {
        return [...recipes]
            .sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
            .slice(0, 10);
    }, [recipes]);

    const principal = usePrincipalState((s) => s.principal);
    const isLoggedIn = !!principal;

    if (sortedRecipes.length === 0) return null;

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
                {/* ✅ class로 연결 (ref 필요 없음) */}
                <button
                    type="button"
                    className="highrated-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#3d3226] text-[#f5f1eb] p-2 rounded-full shadow-lg hover:bg-[#5d4a36] transition-colors -translate-x-4"
                    aria-label="이전"
                >
                    <ChevronLeft size={24} />
                </button>

                <Swiper
                    modules={[Navigation, Autoplay]}
                    loop={sortedRecipes.length > 1}
                    spaceBetween={16}
                    slidesPerView={1.15}
                    breakpoints={{
                        640: { slidesPerView: 2.15 },
                        1024: { slidesPerView: 3.15 },
                        1280: { slidesPerView: 4.0 },
                    }}
                    navigation={{
                        prevEl: '.highrated-prev',
                        nextEl: '.highrated-next',
                    }}
                    autoplay={{
                        delay: 2000, // ✅ 3.5초마다 이동
                        disableOnInteraction: false, // ✅ 버튼/드래그 후에도 계속 자동재생
                        pauseOnMouseEnter: true, // ✅ 마우스 올리면 멈춤(선택)
                    }}
                    speed={600} // 전환 애니메이션 속도(선택)
                    className="pb-4"
                >
                    {sortedRecipes.map((recipe) => (
                        <SwiperSlide key={recipe.recipeId}>
                            <HighRatedCard
                                recipe={recipe}
                                onRecipeClick={onRecipeClick}
                                onOpenAuth={onOpenAuth}
                                isLoggedIn={isLoggedIn}
                                isBookmarked={bookmarkedRecipeIds?.has(
                                    recipe.recipeId,
                                )}
                                onToggleBookmark={onToggleBookmark}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button
                    type="button"
                    className="highrated-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#3d3226] text-[#f5f1eb] p-2 rounded-full shadow-lg hover:bg-[#5d4a36] transition-colors translate-x-4"
                    aria-label="다음"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </section>
    );
}
