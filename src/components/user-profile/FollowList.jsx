import { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, User as UserIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { usePrincipalState } from '../../store/usePrincipalState';

import {
    useGetFollowers,
    useGetFollowings,
    useFollow,
    useUnfollow,
    getGetFollowersQueryKey,
    getGetFollowingsQueryKey,
    getGetFollowCountQueryKey,
} from '../../apis/generated/follow-controller/follow-controller';

export function FollowList({ onNavigate, type, onUserClick }) {
    const queryClient = useQueryClient();
    const principal = usePrincipalState((s) => s.principal);
    const myUserId = principal?.userId;

    // ✅ 목록 조회 (둘 다 내 계정 기준 / 파라미터 없음)
    const {
        data: followersResp,
        isLoading: isFollowersLoading,
        isError: isFollowersError,
    } = useGetFollowers({
        query: {
            enabled: !!myUserId && type === 'followers',
        },
    });

    // 팔로워 화면에서도 "내가 팔로우 중인지" 표시하려면,
    // followings도 같이 가져와서 userId set으로 비교하는 방식이 제일 깔끔함 (N+1 없음)
    const {
        data: followingsResp,
        isLoading: isFollowingsLoading,
        isError: isFollowingsError,
    } = useGetFollowings({
        query: {
            enabled:
                !!myUserId && (type === 'following' || type === 'followers'),
        },
    });

    // ✅ 프로젝트 규칙: payload(T) = resp?.data?.data
    const followersPayload = followersResp?.data?.data ?? []; // FollowRespDto[]
    const followingsPayload = followingsResp?.data?.data ?? []; // FollowRespDto[]

    const followingIdSet = useMemo(() => {
        return new Set(followingsPayload.map((u) => u.userId));
    }, [followingsPayload]);

    // ✅ 화면에 뿌릴 users (type에 따라 변환)
    const initialUsers = useMemo(() => {
        const mapUser = (u, isFollowing) => ({
            id: u.userId,
            name: u.username,
            profileImage: u.profileImgUrl,
            isFollowing,
        });

        if (type === 'followers') {
            // 팔로워 목록: 내가 그 유저를 팔로우 중인지 set으로 판단
            return followersPayload
                .filter((u) => !!u?.userId)
                .map((u) => mapUser(u, followingIdSet.has(u.userId)));
        }

        // 팔로잉 목록: 전부 isFollowing=true
        return followingsPayload
            .filter((u) => !!u?.userId)
            .map((u) => mapUser(u, true));
    }, [type, followersPayload, followingsPayload, followingIdSet]);

    const [users, setUsers] = useState(initialUsers);

    // ✅ followers <-> following 이동 or API 재조회 시 state 초기화
    useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    // ✅ 팔로우/언팔로우 뮤테이션
    const { mutateAsync: followMutateAsync } = useFollow();
    const { mutateAsync: unfollowMutateAsync } = useUnfollow();

    // 버튼 중복 클릭 방지용
    const [pendingUserId, setPendingUserId] = useState(null);

    const invalidateFollowCaches = async () => {
        // 목록 + 내 카운트(프로필 상단) 갱신
        await queryClient.invalidateQueries({
            queryKey: getGetFollowersQueryKey(),
        });
        await queryClient.invalidateQueries({
            queryKey: getGetFollowingsQueryKey(),
        });

        if (myUserId) {
            await queryClient.invalidateQueries({
                queryKey: getGetFollowCountQueryKey(myUserId),
            });
        }
    };

    const handleToggleFollow = async (targetUserId) => {
        if (!targetUserId || pendingUserId) return;

        const target = users.find((u) => u.id === targetUserId);
        if (!target) return;

        setPendingUserId(targetUserId);

        try {
            if (target.isFollowing) {
                // ✅ 언팔로우
                await unfollowMutateAsync({ targetUserId });

                if (type === 'following') {
                    // ✅ 요구사항: 팔로잉 목록에서 언팔로우 되면 목록에서 제거
                    setUsers((prev) =>
                        prev.filter((u) => u.id !== targetUserId),
                    );
                } else {
                    // 팔로워 목록에서는 "팔로워" 자체는 그대로니까 버튼 상태만 변경
                    setUsers((prev) =>
                        prev.map((u) =>
                            u.id === targetUserId
                                ? { ...u, isFollowing: false }
                                : u,
                        ),
                    );
                }
            } else {
                // ✅ 팔로우
                await followMutateAsync({ targetUserId });

                // 팔로워 목록에서만 의미 있음 (팔로잉 목록은 원래 다 팔로잉)
                setUsers((prev) =>
                    prev.map((u) =>
                        u.id === targetUserId ? { ...u, isFollowing: true } : u,
                    ),
                );
            }

            await invalidateFollowCaches();
        } catch (e) {
            console.error('Follow toggle failed:', e);
            toast.error('처리 중 오류가 발생했습니다.');
        } finally {
            setPendingUserId(null);
        }
    };

    const isLoading =
        type === 'followers'
            ? isFollowersLoading || isFollowingsLoading
            : isFollowingsLoading;

    const isError =
        type === 'followers'
            ? isFollowersError || isFollowingsError
            : isFollowingsError;

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => onNavigate('profile')}
                    className="flex items-center gap-2 mb-6 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
                >
                    <ArrowLeft size={20} />
                    돌아가기
                </button>

                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] overflow-hidden">
                    <div className="bg-[#3d3226] text-[#f5f1eb] px-8 py-6">
                        <h1 className="text-3xl mb-2">
                            {type === 'followers' ? '팔로워' : '팔로잉'}
                        </h1>
                        <p className="text-[#e5dfd5]">
                            {isLoading ? '불러오는 중...' : `${users.length}명`}
                        </p>
                    </div>

                    <div className="p-8">
                        {isError ? (
                            <p className="text-center text-red-600 py-10">
                                목록을 불러오는데 실패했습니다.
                            </p>
                        ) : isLoading ? (
                            <p className="text-center text-[#6b5d4f] py-10">
                                로딩 중...
                            </p>
                        ) : users.length === 0 ? (
                            <p className="text-center text-[#6b5d4f] py-10">
                                {type === 'followers'
                                    ? '팔로워가 없습니다.'
                                    : '팔로잉한 사용자가 없습니다.'}
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center gap-4 p-4 bg-[#ebe5db] rounded-lg border-2 border-[#d4cbbf] hover:border-[#3d3226] transition-colors"
                                    >
                                        <div
                                            onClick={() =>
                                                onUserClick &&
                                                onUserClick(user.id, user.name)
                                            }
                                            className="flex items-center gap-4 flex-1 cursor-pointer"
                                        >
                                            <div className="w-16 h-16 rounded-full border-2 border-[#d4cbbf] overflow-hidden bg-[#f5f1eb] flex items-center justify-center">
                                                {user.profileImage ? (
                                                    <img
                                                        src={user.profileImage}
                                                        alt={user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <UserIcon
                                                        size={32}
                                                        className="text-[#6b5d4f]"
                                                    />
                                                )}
                                            </div>

                                            <div>
                                                <h3 className="text-lg text-[#3d3226] font-medium">
                                                    {user.name}
                                                </h3>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleToggleFollow(user.id)
                                            }
                                            disabled={pendingUserId === user.id}
                                            className={`px-6 py-2 rounded-md transition-colors ${
                                                user.isFollowing
                                                    ? 'bg-[#3d3226] text-[#f5f1eb] hover:bg-[#5d4a36]'
                                                    : 'border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb]'
                                            } ${pendingUserId === user.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                                        >
                                            {pendingUserId === user.id
                                                ? '처리중...'
                                                : user.isFollowing
                                                  ? '팔로잉'
                                                  : '팔로우'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
