import { Eye, Star, Bookmark } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function TopRecipeCard({
    recipe,
    onRecipeClick,
    onOpenAuth, // Kept for consistency but likely unused if onToggleBookmark handles auth prompt check, but logic in HomePage checks auth too.
    isLoggedIn, // kept for now
    isBookmarked,
    onToggleBookmark,
}) {
    const handleBookmarkClick = (e) => {
        e.stopPropagation();
        onToggleBookmark(recipe.recipeId);
    };

    return (
        <div
            onClick={() => onRecipeClick && onRecipeClick(recipe.recipeId)}
            className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 border-[#e5dfd5] hover:border-[#3d3226]"
        >
            <div className="relative aspect-video overflow-hidden">
                {/* Bookmark Button Overlay */}
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
                        `https://picsum.photos/seed/${recipe.recipeId}/800`
                    }
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center gap-3 text-white text-sm">
                        <span className="flex items-center gap-1">
                            <Eye size={16} />
                            {recipe.viewCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                            <Star size={16} fill="currentColor" />
                            {(recipe.avgRating || 0).toFixed(1)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <h4 className="text-xl mb-2 text-[#3d3226] group-hover:text-[#5d4a36] transition-colors">
                    {recipe.title}
                </h4>
                <p className="text-sm text-[#6b5d4f]">
                    by {recipe.username || 'Unknown'}
                </p>
            </div>
        </div>
    );
}
