import { useState, useEffect } from 'react';
import { Star, Bookmark, Share2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
    Paper,
    Box,
    Typography,
    Button,
    IconButton,
    Stack,
    Tooltip,
} from '@mui/material';
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

export default function RecipeRatingBookmark({
    recipeId,
    isLoggedIn,
    onOpenAuth,
    onStatsChange,
}) {
    const rId = Number(recipeId);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    // Fetch existing rating for the user
    const { data: ratingData } = useGetRating(rId, {
        query: {
            enabled: !!isLoggedIn && !!rId,
            retry: 0,
            refetchOnWindowFocus: false,
        },
    });

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
        <Paper
            elevation={0}
            sx={{
                mb: 3,
                p: 3,
                bgcolor: '#ebe5db',
                borderRadius: 2,
                border: '2px solid #d4cbbf',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
            }}
        >
            <Box>
                <Typography
                    variant="body2"
                    sx={{ color: '#3d3226', mb: 1, fontWeight: 'medium' }}
                >
                    이 레시피를 평가해주세요
                </Typography>
                <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    onMouseLeave={() => setHoverRating(0)}
                >
                    {[1, 2, 3, 4, 5].map((star) => (
                        <IconButton
                            key={star}
                            onClick={() => handleRatingClick(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            size="small"
                            sx={{
                                color:
                                    star <= (hoverRating || userRating)
                                        ? '#f59e0b'
                                        : '#d4cbbf',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.2)' },
                                p: 0.5,
                            }}
                        >
                            <Star
                                size={32}
                                fill={
                                    star <= (hoverRating || userRating)
                                        ? 'currentColor'
                                        : 'none'
                                }
                            />
                        </IconButton>
                    ))}
                    {userRating > 0 && (
                        <Typography
                            variant="body2"
                            sx={{ ml: 1, color: '#3d3226', fontWeight: 'bold' }}
                        >
                            내 평점: {userRating}점
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                <Button
                    onClick={handleBookmarkClick}
                    startIcon={
                        <Bookmark
                            size={20}
                            fill={isBookmarked ? 'currentColor' : 'none'}
                        />
                    }
                    variant={isBookmarked ? 'contained' : 'outlined'}
                    sx={{
                        width: 140,
                        py: 1.5,
                        borderRadius: 1,
                        fontWeight: 'bold',
                        ...(isBookmarked
                            ? {
                                  bgcolor: '#3d3226',
                                  color: '#f5f1eb',
                                  '&:hover': { bgcolor: '#2a221a' },
                              }
                            : {
                                  color: '#3d3226',
                                  borderColor: '#3d3226',
                                  '&:hover': {
                                      bgcolor: 'rgba(61, 50, 38, 0.05)',
                                      borderColor: '#3d3226',
                                  },
                              }),
                    }}
                >
                    {isBookmarked ? '저장됨' : '저장하기'}
                </Button>

                <Button
                    onClick={handleShareClick}
                    startIcon={<Share2 size={20} />}
                    variant="outlined"
                    sx={{
                        width: 140,
                        py: 1.5,
                        borderRadius: 1,
                        fontWeight: 'bold',
                        color: '#3d3226',
                        borderColor: '#3d3226',
                        '&:hover': {
                            bgcolor: 'rgba(61, 50, 38, 0.05)',
                            borderColor: '#3d3226',
                        },
                    }}
                >
                    공유하기
                </Button>
            </Stack>
        </Paper>
    );
}
