import { useState, useEffect } from 'react';
import { Star, Bookmark, Share2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
    useGetRating,
    useUpsertRating,
    useDeleteRating,
} from '../../apis/generated/rating-controller/rating-controller';
import {
    useExistsByRecipeId,
    useAddBookmark,
    useDeleteBookmark,
    getExistsByRecipeIdQueryKey,
    getGetBookmarkListByUserIdQueryKey,
} from '../../apis/generated/bookmark-controller/bookmark-controller';

export default function RecipeRatingPage({
    recipeId,
    isLoggedIn,
    onOpenAuth,
    onStatsChange,
}) {
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    // Fetch existing rating for the user
    const { data: ratingData } = useGetRating(recipeId, {
        query: {
            enabled: !!isLoggedIn && !!recipeId,
            retry: 0, // 404가 뜰 수 있으므로 재시도 안함
            refetchOnWindowFocus: false, // 알트탭 시 에러 방지
        },
    });

    const rId = Number(recipeId);

    // Sync userRating with fetched data
    useEffect(() => {
        const fetchedRating = ratingData?.data?.data?.rating;
        if (fetchedRating) {
            setUserRating(fetchedRating);
        } else {
            setUserRating(0); // Reset if no rating found or logged out
        }
    }, [ratingData, rId, isLoggedIn]);

    const { mutate: upsertRating } = useUpsertRating();
    const { mutate: deleteRating } = useDeleteRating();

    const handleRatingClick = (rating) => {
        if (!isLoggedIn) {
            onOpenAuth?.();
            return;
        }

        // 1. Delete Rating (Toggle off)
        if (userRating === rating) {
            deleteRating(
                { recipeId: rId },
                {
                    onSuccess: () => {
                        onStatsChange?.(-1, -userRating);
                        setUserRating(0);
                    },
                    onError: (error) => {
                        console.error('Failed to delete rating:', error);
                        alert('별점 삭제에 실패했습니다.');
                    },
                },
            );
        }
        // 2. Upsert Rating (New or Update)
        else {
            upsertRating(
                { data: { recipeId: rId, rating } },
                {
                    onSuccess: () => {
                        if (userRating > 0) {
                            onStatsChange?.(0, rating - userRating);
                        } else {
                            onStatsChange?.(1, rating);
                        }
                        setUserRating(rating);
                    },
                    onError: (error) => {
                        console.error('Failed to update rating:', error);
                        alert('별점 등록에 실패했습니다.');
                    },
                },
            );
        }
    };

    // --- Bookmark Logic ---
    const queryClient = useQueryClient();

    const { data: bookmarkData } = useExistsByRecipeId(rId, {
        query: {
            enabled: !!isLoggedIn && !!rId,
        },
    });

    const isBookmarked = bookmarkData?.data?.data || false;

    const { mutate: addBookmark } = useAddBookmark();
    const { mutate: deleteBookmark } = useDeleteBookmark();

    const handleBookmarkClick = () => {
        if (!isLoggedIn) {
            onOpenAuth?.();
            return;
        }

        if (isBookmarked) {
            deleteBookmark(
                { recipeId: rId },
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries({
                            queryKey: getExistsByRecipeIdQueryKey(rId),
                        });
                        queryClient.invalidateQueries({
                            queryKey: getGetBookmarkListByUserIdQueryKey(),
                        });
                    },
                    onError: (error) => {
                        console.error('Failed to delete bookmark:', error);
                        alert('북마크 취소에 실패했습니다.');
                    },
                },
            );
        } else {
            addBookmark(
                { recipeId: rId },
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries({
                            queryKey: getExistsByRecipeIdQueryKey(rId),
                        });
                        queryClient.invalidateQueries({
                            queryKey: getGetBookmarkListByUserIdQueryKey(),
                        });
                    },
                    onError: (error) => {
                        console.error('Failed to add bookmark:', error);
                        alert('북마크 추가에 실패했습니다.');
                    },
                },
            );
        }
    };

    // --- Share Logic ---
    const handleShareClick = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert('주소가 클립보드에 복사되었습니다.');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('주소 복사에 실패했습니다.');
        }
    };

    return (
        <div className="mb-6 p-4 bg-[#ebe5db] rounded-lg border-2 border-[#d4cbbf] flex justify-between items-center">
            <div>
                <p className="text-sm text-[#3d3226] mb-2">
                    이 레시피를 평가해주세요
                </p>
                <div
                    className="flex items-center gap-2"
                    onMouseLeave={() => setHoverRating(0)}
                >
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => handleRatingClick(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                size={32}
                                fill={
                                    star <= (hoverRating || userRating)
                                        ? '#f59e0b'
                                        : 'none'
                                }
                                className={
                                    star <= (hoverRating || userRating)
                                        ? 'text-[#f59e0b]'
                                        : 'text-[#d4cbbf]'
                                }
                            />
                        </button>
                    ))}
                    {userRating > 0 && (
                        <span className="ml-2 text-[#3d3226]">
                            내 평점: {userRating}점
                        </span>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={handleBookmarkClick}
                    className={`flex items-center justify-center gap-2 w-[140px] py-3 rounded-md border-2 transition-colors ${
                        isBookmarked
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'border-[#d4cbbf] text-[#3d3226] hover:border-[#3d3226]'
                    }`}
                >
                    <Bookmark
                        size={20}
                        fill={isBookmarked ? 'currentColor' : 'none'}
                    />
                    {isBookmarked ? '저장됨' : '저장하기'}
                </button>

                <button
                    onClick={handleShareClick}
                    className="flex items-center justify-center gap-2 w-[140px] py-3 rounded-md border-2 border-[#d4cbbf] text-[#3d3226] hover:border-[#3d3226] transition-colors"
                >
                    <Share2 size={20} />
                    공유하기
                </button>
            </div>
        </div>
    );
}
