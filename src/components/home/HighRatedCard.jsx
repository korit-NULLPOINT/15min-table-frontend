import { Star, Bookmark } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function HighRatedCard({
    recipe,
    onRecipeClick,
    isBookmarked,
    onToggleBookmark,
}) {
    const handleBookmarkClick = (e) => {
        e.stopPropagation();
        onToggleBookmark(recipe.recipeId);
    };

    return (
        <div
            onClick={() => onRecipeClick?.(recipe.recipeId)}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer border-2 border-[#e5dfd5] hover:border-[#3d3226] h-full group"
        >
            <div className="relative aspect-square overflow-hidden">
                <button
                    onClick={handleBookmarkClick}
                    className={`absolute top-2 right-2 z-10 flex items-center justify-center gap-2 w-8 h-8 rounded-full border-2 transition-transform duration-200 scale-90 opacity-75 hover:scale-100 hover:opacity-100 ${
                        isBookmarked
                            ? 'bg-yellow-100 border-yellow-500 text-yellow-500'
                            : 'bg-white/80 border-stone-400 text-stone-400 hover:border-stone-500 hover:text-stone-500 '
                    }`}
                >
                    <Bookmark
                        size={20}
                        fill={isBookmarked ? 'currentColor' : 'none'}
                    />
                </button>
                <ImageWithFallback
                    src={
                        recipe.thumbnailImgUrl ||
                        `https://picsum.photos/seed/${recipe.recipeId}/800/600/`
                    }
                    alt={recipe.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
            </div>

            <div className="p-4">
                <h4 className="text-lg mb-2 text-[#3d3226]">{recipe.title}</h4>
                <p className="text-sm text-[#6b5d4f] mb-3 line-clamp-2">
                    {recipe.intro || '간단하고 맛있는 레시피를 확인해보세요.'}
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
                            {(recipe.avgRating || 0).toFixed(1)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
