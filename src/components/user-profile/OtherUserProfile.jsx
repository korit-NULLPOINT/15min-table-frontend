// src/components/user-profile/OtherUserProfile.jsx
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Eye, Star, User as UserIcon } from 'lucide-react';
import { usePrincipalState } from '../../store/usePrincipalState';

import { useApiErrorMessage } from '../../hooks/useApiErrorMessage';

import { useGetUserProfile } from '../../apis/generated/user-profile-controller/user-profile-controller';
import { useGetRecipeListByUserId } from '../../apis/generated/user-recipe-controller/user-recipe-controller';
import {
    useFollow,
    useUnfollow,
} from '../../apis/generated/follow-controller/follow-controller';

export function OtherUserProfile({ userId, onNavigate, onRecipeClick }) {
    const principal = usePrincipalState((s) => s.principal);
    const isLoggedIn = !!principal;

    const [postType, setPostType] = useState('recipe'); // recipe | community (추후)
    const [page, setPage] = useState(1);
    const size = 12;

    /** -------------------------
     * 1) 프로필 조회 + 에러 훅
     * ------------------------- */
    const {
        errorMessage: profileError,
        clearError: clearProfileError,
        handleApiError: handleProfileApiError,
    } = useApiErrorMessage();

    const profileQuery = useGetUserProfile(userId, {
        query: {
            enabled: Number.isFinite(userId),
            refetchOnWindowFocus: false,
        },
    });

    const profile = profileQuery?.data?.data?.data;

    useEffect(() => {
        if (!profileQuery.isError) return;
        // ✅ 백 message가 있으면 그대로 표시됨(예: "사용자를 찾을 수 없습니다.")
        handleProfileApiError(profileQuery.error, {
            fallbackMessage: '프로필을 불러오지 못했습니다.',
        });
    }, [profileQuery.isError, profileQuery.error, handleProfileApiError]);

    /** -------------------------
     * 2) 레시피 목록 + 에러 훅
     * ------------------------- */
    const {
        errorMessage: recipeError,
        clearError: clearRecipeError,
        handleApiError: handleRecipeApiError,
    } = useApiErrorMessage();

    const recipesQuery = useGetRecipeListByUserId(
        userId,
        { page, size },
        {
            query: {
                enabled: Number.isFinite(userId) && postType === 'recipe',
                refetchOnWindowFocus: false,
                keepPreviousData: true,
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

    const totalPages = useMemo(() => {
        const t = Math.ceil((totalCount || 0) / size);
        return t <= 0 ? 1 : t;
    }, [totalCount, size]);

    /** -------------------------
     * 3) 팔로우/언팔 + 에러 훅
     * ------------------------- */
    const {
        errorMessage: followError,
        clearError: clearFollowError,
        handleApiError: handleFollowApiError,
    } = useApiErrorMessage();

    const followMut = useFollow();
    const unfollowMut = useUnfollow();
    const isFollowLoading = followMut.isPending || unfollowMut.isPending;

    const onToggleFollow = async () => {
        clearFollowError();

        if (!isLoggedIn) {
            alert('로그인이 필요합니다.');
            // 전역 AuthModal open 연결은 추후 개선점
            return;
        }

        try {
            if (profile?.isFollowing) {
                await unfollowMut.mutateAsync({ targetUserId: userId });
            } else {
                await followMut.mutateAsync({ targetUserId: userId });
            }
            await profileQuery.refetch(); // ✅ count + isFollowing 갱신
        } catch (e) {
            await handleFollowApiError(e, {
                fallbackMessage: '팔로우 처리 중 오류가 발생했습니다.',
            });
        }
    };

    /** -------------------------
     * 렌더링
     * ------------------------- */
    if (profileQuery.isLoading) {
        return <div className="pt-20 max-w-4xl mx-auto px-6">로딩 중...</div>;
    }

    if (profileError || !profile) {
        return (
            <div className="pt-20 max-w-4xl mx-auto px-6">
                <p className="text-red-600">
                    {profileError || '프로필을 불러오지 못했습니다.'}
                </p>
                <button
                    className="mt-3 px-3 py-2 border rounded"
                    onClick={() => onNavigate?.('back')}
                >
                    뒤로가기
                </button>
            </div>
        );
    }

    const displayName = profile?.username?.trim() || `사용자#${userId}`;

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => onNavigate?.('back')}
                    className="flex items-center gap-2 mb-6 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
                >
                    <ArrowLeft size={20} />
                    돌아가기
                </button>

                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] overflow-hidden">
                    <div className="bg-[#3d3226] text-[#f5f1eb] px-8 py-6">
                        <h1 className="text-3xl mb-2">
                            {displayName}님의 프로필
                        </h1>
                        <p className="text-[#e5dfd5]">
                            작성한 게시글을 확인해보세요
                        </p>
                    </div>

                    <div className="p-8">
                        {/* 상단 프로필 */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-32 h-32 rounded-full border-4 border-[#d4cbbf] overflow-hidden bg-[#ebe5db] flex items-center justify-center">
                                {profile.profileImgUrl ? (
                                    <img
                                        src={profile.profileImgUrl}
                                        alt={displayName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <UserIcon
                                        size={48}
                                        className="text-[#6b5d4f]"
                                    />
                                )}
                            </div>

                            <h2 className="text-2xl text-[#3d3226] mt-4">
                                {displayName}
                            </h2>

                            <div className="flex gap-6 mt-4">
                                <div className="flex flex-col items-center gap-1 px-4 py-2">
                                    <span className="text-2xl font-bold text-[#3d3226]">
                                        {profile.followersCount ?? 0}
                                    </span>
                                    <span className="text-sm text-[#6b5d4f]">
                                        팔로워
                                    </span>
                                </div>
                                <div className="w-px bg-[#d4cbbf]" />
                                <div className="flex flex-col items-center gap-1 px-4 py-2">
                                    <span className="text-2xl font-bold text-[#3d3226]">
                                        {profile.followingsCount ?? 0}
                                    </span>
                                    <span className="text-sm text-[#6b5d4f]">
                                        팔로잉
                                    </span>
                                </div>
                            </div>

                            <button
                                disabled={isFollowLoading}
                                onClick={onToggleFollow}
                                className={`mt-6 px-8 py-3 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                                    profile.isFollowing
                                        ? 'bg-[#3d3226] text-[#f5f1eb] hover:bg-[#5d4a36]'
                                        : 'border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb]'
                                }`}
                            >
                                {isFollowLoading
                                    ? '처리중...'
                                    : profile.isFollowing
                                      ? '팔로잉'
                                      : '팔로우'}
                            </button>

                            {followError && (
                                <p className="mt-3 text-sm text-red-600">
                                    {followError}
                                </p>
                            )}
                        </div>

                        {/* 탭 */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl text-[#3d3226]">
                                {displayName}님이 작성한 게시글
                            </h3>

                            <div className="flex gap-2 bg-[#ebe5db] p-1 rounded-md border-2 border-[#d4cbbf]">
                                <button
                                    onClick={() => {
                                        clearRecipeError();
                                        setPostType('recipe');
                                        setPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-md transition-colors ${
                                        postType === 'recipe'
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                            : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                                    }`}
                                >
                                    레시피 게시판
                                </button>
                                <button
                                    onClick={() => {
                                        setPostType('community');
                                        setPage(1);
                                    }}
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
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                {recipeItems.map((post) => (
                                                    <div
                                                        key={post.recipeId}
                                                        onClick={() =>
                                                            onRecipeClick?.(
                                                                post.recipeId,
                                                            )
                                                        }
                                                        className="cursor-pointer bg-white rounded-lg overflow-hidden border-2 border-[#e5dfd5] hover:border-[#3d3226] transition-colors"
                                                    >
                                                        <img
                                                            src={
                                                                post.thumbnailImgUrl ||
                                                                ''
                                                            }
                                                            alt={post.title}
                                                            className="w-full aspect-video object-cover bg-[#ebe5db]"
                                                        />
                                                        <div className="p-4">
                                                            <h4 className="text-lg text-[#3d3226] mb-2 line-clamp-2">
                                                                {post.title}
                                                            </h4>
                                                            <div className="flex items-center gap-3 text-sm text-[#6b5d4f]">
                                                                <span className="flex items-center gap-1">
                                                                    <Star
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                    {Number.isFinite(
                                                                        post.avgRating,
                                                                    )
                                                                        ? (post.avgRating?.toFixed?.(
                                                                              1,
                                                                          ) ??
                                                                          post.avgRating)
                                                                        : '0.0'}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Eye
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                    {post.viewCount ??
                                                                        0}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* 페이징 */}
                                            <div className="flex items-center justify-center gap-3 mt-8">
                                                <button
                                                    disabled={page <= 1}
                                                    onClick={() =>
                                                        setPage((p) =>
                                                            Math.max(1, p - 1),
                                                        )
                                                    }
                                                    className="px-3 py-2 border rounded disabled:opacity-50"
                                                >
                                                    이전
                                                </button>
                                                <span className="text-[#6b5d4f]">
                                                    {page} / {totalPages}
                                                </span>
                                                <button
                                                    disabled={
                                                        page >= totalPages
                                                    }
                                                    onClick={() =>
                                                        setPage((p) =>
                                                            Math.min(
                                                                totalPages,
                                                                p + 1,
                                                            ),
                                                        )
                                                    }
                                                    className="px-3 py-2 border rounded disabled:opacity-50"
                                                >
                                                    다음
                                                </button>
                                            </div>
                                        </>
                                    )}
                            </>
                        )}

                        {/* 커뮤니티 탭(추후) */}
                        {postType === 'community' && (
                            <div className="p-10 text-center border-2 border-dashed border-[#d4cbbf] rounded-lg text-[#6b5d4f]">
                                커뮤니티 게시글 API는 추후 연결 예정입니다.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
