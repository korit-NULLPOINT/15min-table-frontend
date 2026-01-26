import { Star, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { useMemo } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

export function HighRatedSlider({ recipes = [], onRecipeClick }) {
    const sortedRecipes = useMemo(() => {
        return [...recipes]
            .sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
            .slice(0, 10);
    }, [recipes]);

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
                            <div
                                onClick={() => onRecipeClick?.(recipe.recipeId)}
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
                                    <p className="text-sm text-[#6b5d4f] mb-3 line-clamp-2">
                                        {recipe.intro ||
                                            '간단하고 맛있는 레시피를 확인해보세요.'}
                                    </p>

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
