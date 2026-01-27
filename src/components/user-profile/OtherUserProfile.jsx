// src/components/user-profile/OtherUserProfile.jsx
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, User as UserIcon } from 'lucide-react';
import { usePrincipalState } from '../../store/usePrincipalState';
import { useApiErrorMessage } from '../../hooks/useApiErrorMessage';

import { useGetUserProfile } from '../../apis/generated/user-profile-controller/user-profile-controller';
import {
    useFollow,
    useUnfollow,
} from '../../apis/generated/follow-controller/follow-controller';

import UserProfileOtherPosts from './UserProfileOtherPosts';

export function OtherUserProfile({
    userId,
    onNavigate,
    onRecipeClick,
    onOpenAuth,
    onToggleBookmark,
    onCommunityPostClick, // 추후 확장용
}) {
    const principal = usePrincipalState((s) => s.principal);
    const isLoggedIn = !!principal;

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
        handleProfileApiError(profileQuery.error, {
            fallbackMessage: '프로필을 불러오지 못했습니다.',
        });
    }, [profileQuery.isError, profileQuery.error, handleProfileApiError]);

    /** -------------------------
     * 2) 팔로우/언팔 + 에러 훅
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
            return;
        }

        try {
            if (profile?.isFollowing) {
                await unfollowMut.mutateAsync({ targetUserId: userId });
            } else {
                await followMut.mutateAsync({ targetUserId: userId });
            }
            await profileQuery.refetch(); // count + isFollowing 갱신
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

                        <UserProfileOtherPosts
                            userId={userId}
                            displayName={displayName}
                            onRecipeClick={onRecipeClick}
                            onCommunityPostClick={onCommunityPostClick}
                            isLoggedIn={isLoggedIn}
                            onOpenAuth={onOpenAuth}
                            onToggleBookmark={onToggleBookmark}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
