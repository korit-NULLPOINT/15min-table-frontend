import { useEffect, useMemo } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { OtherUserProfile } from '../../../components/user-profile/OtherUserProfile';
import { usePrincipalState } from '../../../store/usePrincipalState';

import {
    useAddBookmark,
    useDeleteBookmark,
} from '../../../apis/generated/bookmark-controller/bookmark-controller';
import { useQueryClient } from '@tanstack/react-query';

import { getGetRecipeListByUserIdQueryKey } from '../../../apis/generated/user-recipe-controller/user-recipe-controller';

const RECIPE_BOARD_ID = 1;
const COMMUNITY_BOARD_ID = 2;

export default function OtherUserProfilePage() {
    const { userId } = useParams();
    const navigate = useNavigate();

    // ✅ HomePage처럼 outlet에서 모달 열기
    const { openAuthModal } = useOutletContext();

    const principal = usePrincipalState((s) => s.principal);
    const isLoggedIn = !!principal;

    const queryClient = useQueryClient();
    const { mutate: addBookmark } = useAddBookmark();
    const { mutate: deleteBookmark } = useDeleteBookmark();

    const parsedUserId = useMemo(() => {
        const n = Number(userId);
        return Number.isNaN(n) ? null : n;
    }, [userId]);

    // ✅ 자기 자신이면 /me로 리다이렉트
    useEffect(() => {
        if (!isLoggedIn) return;
        if (!principal?.userId) return;
        if (parsedUserId === null) return;

        if (parsedUserId === principal.userId) {
            navigate('/me', { replace: true });
        }
    }, [isLoggedIn, principal?.userId, parsedUserId, navigate]);

    const onNavigate = (key) => {
        if (key === 'home') navigate('/');
        if (key === 'profile') navigate('/me');
        if (key === 'back') navigate(-1);
    };

    if (parsedUserId === null) {
        return (
            <div className="min-h-screen bg-[#f5f1eb] pt-20">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] p-8">
                        <h1 className="text-2xl text-[#3d3226] font-serif">
                            잘못된 사용자 접근
                        </h1>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-4 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
                        >
                            뒤로가기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const onRecipeClick = (recipeId) => {
        navigate(`/boards/${RECIPE_BOARD_ID}/recipe/${recipeId}`);
    };

    const onCommunityPostClick = (postId) => {
        navigate(`/boards/${COMMUNITY_BOARD_ID}/free/${postId}`);
    };

    // ✅ 북마크 토글 (HomePage 로직 그대로)
    const handleToggleBookmark = (recipeId, currentBookmarked) => {
        if (!isLoggedIn) {
            openAuthModal?.();
            return;
        }

        const options = {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetRecipeListByUserIdQueryKey(parsedUserId),
                });
            },
            onError: (error) => {
                const status = error.response?.status;
                if (status === 400) {
                    console.warn('Bookmark state mismatch (400), syncing...');
                    queryClient.invalidateQueries({
                        queryKey:
                            getGetRecipeListByUserIdQueryKey(parsedUserId),
                    });
                    return;
                }
                console.error('Failed to toggle bookmark:', error);
                alert('북마크 변경에 실패했습니다.');
            },
        };

        if (currentBookmarked) {
            deleteBookmark({ recipeId }, options);
        } else {
            addBookmark({ recipeId }, options);
        }
    };

    if (isLoggedIn && principal?.userId && parsedUserId === principal.userId) {
        return null;
    }

    return (
        <OtherUserProfile
            userId={parsedUserId}
            onNavigate={onNavigate}
            onRecipeClick={onRecipeClick}
            onCommunityPostClick={onCommunityPostClick}
            isLoggedIn={isLoggedIn}
            onOpenAuth={openAuthModal}
            onToggleBookmark={handleToggleBookmark}
        />
    );
}
