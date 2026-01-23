import { useEffect, useMemo, useState } from 'react';
import { Eye, Star } from 'lucide-react';
import { useApiErrorMessage } from '../../hooks/useApiErrorMessage';
import { useGetRecipeListByUserId } from '../../apis/generated/user-recipe-controller/user-recipe-controller';

export default function UserProfileOtherPosts({
    userId,
    displayName,
    onRecipeClick,
}) {
    const [postType, setPostType] = useState('recipe'); // recipe | community

    const {
        errorMessage: recipeError,
        clearError: clearRecipeError,
        handleApiError: handleRecipeApiError,
    } = useApiErrorMessage();

    const recipesQuery = useGetRecipeListByUserId(
        userId,
        undefined, // ✅ page/size 안 보냄 => /recipes/user/{userId}
        {
            query: {
                enabled: Number.isFinite(userId) && postType === 'recipe',
                refetchOnWindowFocus: false,
            },
        },
    );

    const recipePage = recipesQuery?.data?.data?.data;
    const recipeItems = recipePage?.items ?? [];
    const totalCount = recipePage?.totalCount ?? 0;

    useEffect(() => {
        if (!recipesQuery.isError) return;
        handleRecipeApiError(recipesQuery.error, {
            fallbackMessage: '레시피 목록을 불러오지 못했습니다.',
        });
    }, [recipesQuery.isError, recipesQuery.error, handleRecipeApiError]);

    const headerTitle = useMemo(() => {
        return `${displayName}님이 작성한 게시글`;
    }, [displayName]);

    return (
        <>
            {/* 탭 */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-[#3d3226]">{headerTitle}</h3>

                <div className="flex gap-2 bg-[#ebe5db] p-1 rounded-md border-2 border-[#d4cbbf]">
                    <button
                        onClick={() => {
                            clearRecipeError();
                            setPostType('recipe');
                        }}
                        className={`px-4 py-2 rounded-md transition-colors ${
                            postType === 'recipe'
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                        }`}
                    >
                        레시피 ({totalCount})
                    </button>

                    <button
                        onClick={() => setPostType('community')}
                        className={`px-4 py-2 rounded-md transition-colors ${
                            postType === 'community'
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                        }`}
                    >
                        커뮤니티
                    </button>
                </div>
            </div>

            {/* 레시피 탭 */}
            {postType === 'recipe' && (
                <>
                    {recipesQuery.isLoading && (
                        <div className="p-10 text-center text-[#6b5d4f]">
                            로딩 중...
                        </div>
                    )}

                    {recipeError && (
                        <div className="p-10 text-center text-red-600">
                            {recipeError}
                        </div>
                    )}

                    {!recipesQuery.isLoading &&
                        !recipeError &&
                        recipeItems.length === 0 && (
                            <div className="p-10 text-center border-2 border-dashed border-[#d4cbbf] rounded-lg text-[#6b5d4f]">
                                작성한 레시피가 아직 없어요.
                            </div>
                        )}

                    {!recipesQuery.isLoading &&
                        !recipeError &&
                        recipeItems.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                                {recipeItems.map((post) => (
                                    <div
                                        key={post.recipeId}
                                        onClick={() =>
                                            onRecipeClick?.(post.recipeId)
                                        }
                                        className="cursor-pointer bg-white rounded-lg overflow-hidden border-2 border-[#e5dfd5] hover:border-[#3d3226] transition-colors"
                                    >
                                        <img
                                            src={post.thumbnailImgUrl || ''}
                                            alt={post.title}
                                            className="w-full aspect-video object-cover bg-[#ebe5db]"
                                        />

                                        <div className="p-4">
                                            <h4 className="text-lg text-[#3d3226] mb-2 line-clamp-2">
                                                {post.title}
                                            </h4>

                                            <div className="flex items-center gap-3 text-sm text-[#6b5d4f]">
                                                <span className="flex items-center gap-1">
                                                    <Star size={16} />
                                                    {Number.isFinite(
                                                        post.avgRating,
                                                    )
                                                        ? post.avgRating.toFixed(
                                                              1,
                                                          )
                                                        : '0.0'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye size={16} />
                                                    {post.viewCount ?? 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                </>
            )}

            {/* 커뮤니티 탭(추후) */}
            {postType === 'community' && (
                <div className="p-10 text-center border-2 border-dashed border-[#d4cbbf] rounded-lg text-[#6b5d4f]">
                    커뮤니티 게시글 API는 추후 연결 예정입니다.
                </div>
            )}
        </>
    );
}
