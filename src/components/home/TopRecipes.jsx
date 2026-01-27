import { TrendingUp } from 'lucide-react';
import { usePrincipalState } from '../../store/usePrincipalState';
import { TopRecipeCard } from './TopRecipeCard';

export function TopRecipes({
    recipes = [],
    onRecipeClick,
    onOpenAuth,
    onToggleBookmark,
}) {
    // 조회수 순 정렬 (Top 6)
    const sortedRecipes = [...recipes]
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 6);
    const principal = usePrincipalState((s) => s.principal);
    const isLoggedIn = !!principal;

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
                    <TopRecipeCard
                        key={recipe.recipeId}
                        recipe={recipe}
                        onRecipeClick={onRecipeClick}
                        onOpenAuth={onOpenAuth}
                        isLoggedIn={isLoggedIn}
                        isBookmarked={recipe.bookmarkedByMe}
                        onToggleBookmark={() =>
                            onToggleBookmark(
                                recipe.recipeId,
                                recipe.bookmarkedByMe,
                            )
                        }
                    />
                ))}
            </div>
        </section>
    );
}
