import { Eye, Clock, Star, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { topRecipes } from '../../utils/recipeData';

export function TopRecipes({ recipes = [], onRecipeClick }) {
    // 조회수 순 정렬 (Top 6)
    const sortedRecipes = [...recipes]
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 6);

    return (
        <section className="px-6 py-8 max-w-7xl mx-auto bg-[#ebe5db] rounded-lg my-8">
            <h3 className="text-3xl mb-6 text-[#3d3226] flex items-center gap-3">
                <div className="w-10 h-10 bg-[#3d3226] rounded-full flex items-center justify-center">
                    <TrendingUp
                        size={24}
                        className="text-[#f5f1eb]"
                        strokeWidth={2.5}
                    />
                </div>
                인기 레시피
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
                {sortedRecipes.map((recipe) => (
                    <div
                        key={recipe.recipeId}
                        onClick={() =>
                            onRecipeClick && onRecipeClick(recipe.recipeId)
                        }
                        className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 border-[#e5dfd5] hover:border-[#3d3226]"
                    >
                        <div className="relative aspect-video overflow-hidden">
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
                ))}
            </div>
        </section>
    );
}
