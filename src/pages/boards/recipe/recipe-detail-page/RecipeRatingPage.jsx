import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import {
    useGetRating,
    useUpsertRating,
    useDeleteRating,
} from '../../../../apis/generated/rating-controller/rating-controller';

export default function RecipeRatingPage({
    recipeId,
    isLoggedIn,
    onOpenAuth,
    onStatsChange,
    children,
}) {
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    // Fetch existing rating for the user
    const { data: ratingData } = useGetRating(recipeId, {
        query: {
            enabled: !!isLoggedIn && !!recipeId,
        },
    });

    const rId = Number(recipeId);

    // Sync userRating with fetched data
    useEffect(() => {
        // console.log('RecipeRatingPage Params:', { recipeId: rId, isLoggedIn });
        // console.log('Rating Data Raw:', ratingData);

        const fetchedRating = ratingData?.data?.data?.rating;
        // console.log('Fetched Rating:', fetchedRating);

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
            if (onOpenAuth) onOpenAuth();
            return;
        }

        // 1. Delete Rating (Toggle off)
        if (userRating === rating) {
            console.log('Deleting rating for recipeId:', rId);
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
            console.log('Upserting rating:', { recipeId: rId, rating });
            upsertRating(
                { data: { recipeId: rId, rating } },
                {
                    onSuccess: () => {
                        // If updating: deltaTotal = 0, deltaSum = new - old
                        // If new: deltaTotal = 1, deltaSum = new
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

    return (
        <div className="mb-6 p-4 bg-[#ebe5db] rounded-lg border-2 border-[#d4cbbf] flex justify-between items-end">
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
            {children}
        </div>
    );
}
