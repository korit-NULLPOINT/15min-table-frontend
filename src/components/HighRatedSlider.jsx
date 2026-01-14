import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const highRatedRecipes = [
    {
        id: 1,
        title: '얼큰한 김치찌개',
        author: '김치러버',
        rating: 5.0,
        reviews: 342,
        image: 'https://images.unsplash.com/photo-1626803774007-f92c2c32cbe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmb29kJTIwcmVjaXBlfGVufDF8fHx8MTc2Nzc2MjY5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '자취생 필수 메뉴! 간단하고 맛있는 김치찌개',
    },
    {
        id: 2,
        title: '로제 파스타',
        author: '파스타킹',
        rating: 4.9,
        reviews: 287,
        image: 'https://images.unsplash.com/photo-1587740907856-997a958a68ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNvb2tpbmd8ZW58MXx8fHwxNzY3NjkzODg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '레스토랑 맛을 집에서! 초간단 로제 파스타',
    },
    {
        id: 3,
        title: '참치 마요 덮밥',
        author: '덮밥마스터',
        rating: 4.9,
        reviews: 421,
        image: 'https://images.unsplash.com/photo-1628521061262-19b5cdb7eee5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwYm93bHxlbnwxfHx8fDE3Njc3NDA1ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '5분이면 충분! 간편하고 맛있는 한끼',
    },
    {
        id: 4,
        title: '라면 업그레이드',
        author: '라면장인',
        rating: 4.8,
        reviews: 563,
        image: 'https://images.unsplash.com/photo-1627900440398-5db32dba8db1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub29kbGVzJTIwcmFtZW58ZW58MXx8fHwxNzY3NzYyNjk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '평범한 라면을 특별하게 만드는 비법',
    },
    {
        id: 5,
        title: '뚝배기 된장찌개',
        author: '집밥요리사',
        rating: 5.0,
        reviews: 298,
        image: 'https://images.unsplash.com/photo-1560684352-8497838a2229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3VwJTIwc3Rld3xlbnwxfHx8fDE3Njc3NjI2OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '엄마 손맛 그대로! 따뜻한 된장찌개',
    },
    {
        id: 6,
        title: '에그 토스트',
        author: '아침요리',
        rating: 4.9,
        reviews: 412,
        image: 'https://images.unsplash.com/photo-1689020353604-8041221e1273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjB0b2FzdHxlbnwxfHx8fDE3Njc3MDM4ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '든든한 아침을 위한 에그 토스트',
    },
];

export function HighRatedSlider({ onRecipeClick, isLoggedIn, onOpenAuth }) {
    const scrollContainerRef = useRef(null);
    const [favorites, setFavorites] = useState(new Set());

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const newScrollLeft = scrollContainerRef.current.scrollLeft +
                (direction === 'right' ? scrollAmount : -scrollAmount);

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const handleFavoriteClick = (e, recipeId) => {
        e.stopPropagation();

        if (!isLoggedIn) {
            onOpenAuth?.();
            return;
        }

        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(recipeId)) {
                newFavorites.delete(recipeId);
            } else {
                newFavorites.add(recipeId);
            }
            return newFavorites;
        });
    };

    return (
        <section className="px-6 py-12 max-w-7xl mx-auto bg-[#ebe5db] rounded-lg my-12">
            <h3 className="text-3xl mb-6 text-[#3d3226]">⭐ 별점 높은 레시피</h3>
            <div className="relative">
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
                                onClick={() => onRecipeClick?.(recipe.id)}
                                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer border-2 border-[#e5dfd5] hover:border-[#3d3226] h-full"
                            >
                                <div className="relative aspect-square overflow-hidden">
                                    <ImageWithFallback
                                        src={recipe.image}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                    <button
                                        onClick={(e) => handleFavoriteClick(e, recipe.id)}
                                        className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                                    >
                                        <Star
                                            size={20}
                                            className={favorites.has(recipe.id) ? 'text-yellow-500' : 'text-gray-400'}
                                            fill={favorites.has(recipe.id) ? 'currentColor' : 'none'}
                                        />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <h4 className="text-lg mb-2 text-[#3d3226]">{recipe.title}</h4>
                                    <p className="text-sm text-[#6b5d4f] mb-3 line-clamp-2">
                                        {recipe.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-[#6b5d4f]">by {recipe.author}</span>
                                        <div className="flex items-center gap-1">
                                            <Star size={16} fill="#f59e0b" className="text-[#f59e0b]" />
                                            <span className="text-sm font-bold text-[#3d3226]">{recipe.rating}</span>
                                            <span className="text-xs text-[#6b5d4f]">({recipe.reviews})</span>
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
