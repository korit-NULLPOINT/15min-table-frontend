import { Star, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { useRef, useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { highRatedRecipes } from '../../utils/recipeData';

export function HighRatedSlider({ onRecipeClick }) {
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const newScrollLeft =
                scrollContainerRef.current.scrollLeft +
                (direction === 'right' ? scrollAmount : -scrollAmount);

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth',
            });
        }
    };

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
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {highRatedRecipes.map((recipe) => (
                        <div key={recipe.id} className="flex-shrink-0 w-72">
                            <div
                                onClick={() =>
                                    onRecipeClick && onRecipeClick(recipe.id)
                                }
                                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer border-2 border-[#e5dfd5] hover:border-[#3d3226] h-full"
                            >
                                <div className="relative aspect-square overflow-hidden">
                                    <ImageWithFallback
                                        src={recipe.image}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <h4 className="text-lg mb-2 text-[#3d3226]">
                                        {recipe.title}
                                    </h4>
                                    <p className="text-sm text-[#6b5d4f] mb-3 line-clamp-2">
                                        {recipe.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-[#6b5d4f]">
                                            by {recipe.author}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Star
                                                size={16}
                                                fill="#f59e0b"
                                                className="text-[#f59e0b]"
                                            />
                                            <span className="text-sm font-bold text-[#3d3226]">
                                                {recipe.rating}
                                            </span>
                                            <span className="text-xs text-[#6b5d4f]">
                                                ({recipe.reviews})
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
