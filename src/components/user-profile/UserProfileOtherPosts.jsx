import { useEffect, useMemo, useState } from 'react';
import { Eye, Star, Bookmark } from 'lucide-react';
import { useApiErrorMessage } from '../../hooks/useApiErrorMessage';

import { useGetRecipeListByUserId } from '../../apis/generated/user-recipe-controller/user-recipe-controller';
import { useGetPostListByUserIdByCursor } from '../../apis/generated/user-post-controller/user-post-controller';

export default function UserProfileOtherPosts({
    userId,
    displayName,
    onRecipeClick,
    onCommunityPostClick,
    onToggleBookmark,
    isLoggedIn,
    onOpenAuth,
}) {
    const [postType, setPostType] = useState('recipe'); // recipe | community

    /** -------------------------
     * 레시피 목록
     * ------------------------- */
    const {
        errorMessage: recipeError,
        clearError: clearRecipeError,
        handleApiError: handleRecipeApiError,
    } = useApiErrorMessage();

    useEffect(() => {
        clearRecipeError();
    }, [userId, postType]); // eslint-disable-line react-hooks/exhaustive-deps

    const recipesQuery = useGetRecipeListByUserId(
        userId,
        undefined, // ✅ page/size 안 보냄
        {
            query: {
                enabled: Number.isFinite(userId) && postType === 'recipe',
                refetchOnWindowFocus: false,
            },
        },
    );

    const recipePage = recipesQuery?.data?.data?.data;
    const recipeItems = recipePage?.items ?? [];
    const recipeTotal = recipePage?.totalCount ?? 0;

    useEffect(() => {
        if (!recipesQuery.isError) return;
        handleRecipeApiError(recipesQuery.error, {
            fallbackMessage: '레시피 목록을 불러오지 못했습니다.',
        });
    }, [recipesQuery.isError, recipesQuery.error, handleRecipeApiError]);

    /** -------------------------
     * 커뮤니티 목록(유저별, cursor)
     * ------------------------- */
    const {
        errorMessage: communityError,
        clearError: clearCommunityError,
        handleApiError: handleCommunityApiError,
    } = useApiErrorMessage();

    useEffect(() => {
        clearCommunityError();
    }, [userId, postType]); // eslint-disable-line react-hooks/exhaustive-deps

    // ✅ params는 일단 undefined로 시작(필드명 모를 때 안전)
    // 필요하면 { cursor: null, size: 20 } 같은 형태로 확장
    const communityQuery = useGetPostListByUserIdByCursor(userId, undefined, {
        query: {
            enabled: Number.isFinite(userId) && postType === 'community',
            refetchOnWindowFocus: false,
        },
    });

    const communityPage = communityQuery?.data?.data?.data;
    const communityItems = communityPage?.items ?? [];
    const communityTotal = communityPage?.totalCount ?? 0;

    useEffect(() => {
        if (!communityQuery.isError) return;
        handleCommunityApiError(communityQuery.error, {
            fallbackMessage: '커뮤니티 글 목록을 불러오지 못했습니다.',
        });
    }, [communityQuery.isError, communityQuery.error, handleCommunityApiError]);

    /** -------------------------
     * 공통
     * ------------------------- */
    const headerTitle = useMemo(() => {
        return `${displayName}님이 작성한 게시글`;
    }, [displayName]);

    const handleBookmarkClick = (e, recipeId, bookmarkedByMe) => {
        e.stopPropagation();

        if (!isLoggedIn) {
            if (onOpenAuth) onOpenAuth();
            else alert('로그인이 필요합니다.');
            return;
        }

        onToggleBookmark?.(recipeId, bookmarkedByMe);
    };

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
                        레시피 ({recipeTotal})
                    </button>

                    <button
                        onClick={() => {
                            clearCommunityError();
                            setPostType('community');
                        }}
                        className={`px-4 py-2 rounded-md transition-colors ${
                            postType === 'community'
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                        }`}
                    >
                        커뮤니티 ({communityTotal})
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
                                {recipeItems.map((post) => {
                                    const bookmarkedByMe =
                                        !!post.bookmarkedByMe;

                                    const thumbSrc =
                                        post.thumbnailImgUrl?.trim();

                                    return (
                                        <div
                                            key={post.recipeId}
                                            onClick={() =>
                                                onRecipeClick?.(post.recipeId)
                                            }
                                            className="group relative cursor-pointer bg-white rounded-lg overflow-hidden border-2 border-[#e5dfd5] hover:border-[#3d3226] transition-colors"
                                        >
                                            {/* Bookmark */}
                                            <button
                                                onClick={(e) =>
                                                    handleBookmarkClick(
                                                        e,
                                                        post.recipeId,
                                                        bookmarkedByMe,
                                                    )
                                                }
                                                className={`absolute top-2 right-2 z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-transform duration-200 scale-90 opacity-75 hover:scale-100 hover:opacity-100 ${
                                                    bookmarkedByMe
                                                        ? 'bg-yellow-100 border-yellow-500 text-yellow-500'
                                                        : 'bg-white/80 border-stone-400 text-stone-400 hover:border-stone-500 hover:text-stone-500'
                                                }`}
                                                title={
                                                    bookmarkedByMe
                                                        ? '북마크 해제'
                                                        : '북마크'
                                                }
                                            >
                                                <Bookmark
                                                    size={20}
                                                    fill={
                                                        bookmarkedByMe
                                                            ? 'currentColor'
                                                            : 'none'
                                                    }
                                                />
                                            </button>

                                            {/* ✅ src="" 방지 */}
                                            {thumbSrc ? (
                                                <img
                                                    src={thumbSrc}
                                                    alt={post.title}
                                                    className="w-full aspect-video object-cover bg-[#ebe5db] group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full aspect-video bg-[#ebe5db] flex items-center justify-center text-[#6b5d4f]">
                                                    썸네일 없음
                                                </div>
                                            )}

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
                                    );
                                })}
                            </div>
                        )}
                </>
            )}

            {/* 커뮤니티 탭 */}
            {postType === 'community' && (
                <>
                    {communityQuery.isLoading && (
                        <div className="p-10 text-center text-[#6b5d4f]">
                            로딩 중...
                        </div>
                    )}

                    {communityError && (
                        <div className="p-10 text-center text-red-600">
                            {communityError}
                        </div>
                    )}

                    {!communityQuery.isLoading &&
                        !communityError &&
                        communityItems.length === 0 && (
                            <div className="p-10 text-center border-2 border-dashed border-[#d4cbbf] rounded-lg text-[#6b5d4f]">
                                작성한 커뮤니티 글이 아직 없어요.
                            </div>
                        )}

                    {!communityQuery.isLoading &&
                        !communityError &&
                        communityItems.length > 0 && (
                            <div className="flex flex-col gap-3">
                                {communityItems.map((post) => (
                                    <div
                                        key={post.postId}
                                        onClick={() =>
                                            onCommunityPostClick?.(post.postId)
                                        }
                                        className="cursor-pointer bg-white rounded-lg border-2 border-[#e5dfd5] hover:border-[#3d3226] transition-colors p-4"
                                    >
                                        <h4 className="text-lg text-[#3d3226] mb-1 line-clamp-2">
                                            {post.title}
                                        </h4>

                                        <div className="text-sm text-[#6b5d4f] flex gap-3">
                                            <span>{post.createDt ?? ''}</span>
                                            <span>
                                                조회 {post.viewCount ?? 0}
                                            </span>
                                            <span>
                                                댓글 {post.commentCount ?? 0}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                </>
            )}
        </>
    );
}
