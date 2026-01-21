import {
    ArrowLeft,
    Clock,
    User as UserIcon,
    Star,
    Share2,
    Bookmark,
    Sparkles,
} from 'lucide-react';
import { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ImageWithFallback } from './figma/ImageWithFallback';
import AiStoreMapPage from '../pages/boards/recipe/recipe-detail-page/AiStoreMapPage';
import RecipeCommentPage from '../pages/boards/recipe/recipe-detail-page/RecipeCommentPage';
import RecipeRatingPage from '../pages/boards/recipe/recipe-detail-page/RecipeRatingPage';
import {
    useExistsByRecipeId,
    useAddBookmark,
    useDeleteBookmark,
} from '../apis/generated/bookmark-controller/bookmark-controller';

export function RecipeDetail({
    recipeDetail,
    onNavigate,
    isLoggedIn,
    onOpenAuth,
    currentUsername,
    onAuthorClick,
    comments,
}) {
    const [totalRatings, setTotalRatings] = useState(
        recipeDetail.ratingCount || 0,
    ); // 총 평가 수
    const [ratingSum, setRatingSum] = useState(
        (recipeDetail.ratingCount || 0) * (recipeDetail.avgRating || 0),
    ); // 총 별점 합계
    // Ref for AI Store Map
    const mapRef = useRef();
    const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);

    // React Query Client for invalidation
    const queryClient = useQueryClient();

    // Bookmark Hooks
    const { data: bookmarkData } = useExistsByRecipeId(recipeDetail.recipeId, {
        query: {
            enabled: !!isLoggedIn && !!recipeDetail.recipeId,
        },
    });

    const isBookmarked = bookmarkData?.data?.data || false;

    const { mutate: addBookmark } = useAddBookmark();
    const { mutate: deleteBookmark } = useDeleteBookmark();

    // Calculate ingredient image source once
    const ingredientImgSrc =
        recipeDetail?.ingredientImgUrl ||
        `https://picsum.photos/seed/${(() => {
            const str = recipeDetail?.ingredients || 'default';
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = (hash << 5) - hash + char;
                hash |= 0;
            }
            return Math.abs(hash);
        })()}/500`; // Increased resolution for modal

    // console.log(recipeDetail);
    // console.log(comments);

    const handleBookmarkClick = () => {
        if (!isLoggedIn) {
            if (onOpenAuth) onOpenAuth();
            return;
        }

        const recipeId = recipeDetail.recipeId;

        if (isBookmarked) {
            deleteBookmark(
                { recipeId },
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries({
                            queryKey: ['/bookmark/' + recipeId],
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
                { recipeId },
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries({
                            queryKey: ['/bookmark/' + recipeId],
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

    const handleShareClick = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert('주소가 클립보드에 복사되었습니다.');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('주소 복사에 실패했습니다.');
        }
    };

    const handleStatsChange = (deltaTotal, deltaSum) => {
        setTotalRatings((prev) => prev + deltaTotal);
        setRatingSum((prev) => prev + deltaSum);
    };

    const averageRating =
        totalRatings > 0 ? (ratingSum / totalRatings).toFixed(1) : '0.0';

    const mockHashtags = recipeDetail.hashtags || [
        '15분요리',
        '간단레시피',
        '자취생필수',
        '초간단',
    ];

    const handleAIStoreMap = () => {
        if (mapRef.current) {
            mapRef.current.handleAIStoreMap();
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMS = now - date;
        const diffMins = Math.floor(diffMS / (1000 * 60));
        const diffHours = Math.floor(diffMS / (1000 * 60 * 60));

        if (diffMins < 60) {
            return `${diffMins}분 전`;
        }
        if (diffHours < 12) {
            return `${diffHours}시간 전`;
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHour = String(hours % 12 || 12).padStart(2, '0');

        return `${year}.${month}.${day} ${formattedHour}:${minutes} (${ampm})`;
    };

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Back Button */}
                <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center gap-2 mb-6 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
                >
                    <ArrowLeft size={20} />
                    목록으로 돌아가기
                </button>

                {/* Recipe Header */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] overflow-hidden mb-8">
                    <div className="relative aspect-video overflow-hidden">
                        <ImageWithFallback
                            src={
                                recipeDetail.thumbnailImgUrl ||
                                `https://picsum.photos/seed/${recipeDetail.recipeId}/500`
                            }
                            alt={recipeDetail.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-8">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h1 className="text-4xl mb-4 text-[#3d3226]">
                                    {recipeDetail.title}
                                </h1>

                                {/* Meta Info */}
                                <div className="flex items-center gap-6 text-[#6b5d4f] mt-4">
                                    <div className="flex items-center gap-2">
                                        {recipeDetail.profileImgUrl ? (
                                            <img
                                                src={recipeDetail.profileImgUrl}
                                                alt={recipeDetail.username}
                                                className="w-10 h-10 rounded-full object-cover border border-[#d4cbbf]"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-[#ebe5db] flex items-center justify-center border border-[#d4cbbf]">
                                                <UserIcon
                                                    size={20}
                                                    className="text-[#6b5d4f]"
                                                />
                                            </div>
                                        )}
                                        <span
                                            className="cursor-pointer hover:underline"
                                            onClick={() => {
                                                const authorId =
                                                    recipeDetail.userId;
                                                if (!authorId) return;
                                                onAuthorClick?.(
                                                    authorId,
                                                    recipeDetail.userId,
                                                );
                                            }}
                                        >
                                            {recipeDetail.username}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star
                                            size={18}
                                            fill="#f59e0b"
                                            className="text-[#f59e0b]"
                                        />
                                        <span className="font-bold text-[#3d3226]">
                                            {averageRating}
                                        </span>
                                        <span className="text-sm text-[#6b5d4f]">
                                            ({totalRatings}명)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>
                                            조회수 {recipeDetail.viewCount}
                                        </span>
                                        <span className="w-1 h-1 bg-[#d4cbbf] rounded-full"></span>
                                        <span>
                                            {recipeDetail.updateDt &&
                                            recipeDetail.updateDt !==
                                                recipeDetail.createDt
                                                ? `${formatDate(recipeDetail.updateDt)} (수정됨)`
                                                : formatDate(
                                                      recipeDetail.createDt,
                                                  )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rating Section */}
                        <div className="mb-6">
                            <RecipeRatingPage
                                recipeId={recipeDetail.recipeId}
                                isLoggedIn={isLoggedIn}
                                onOpenAuth={onOpenAuth}
                                onStatsChange={handleStatsChange}
                            >
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
                                            fill={
                                                isBookmarked
                                                    ? 'currentColor'
                                                    : 'none'
                                            }
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
                            </RecipeRatingPage>
                        </div>

                        {/* Description */}
                        <p className="text-lg text-[#6b5d4f] leading-relaxed">
                            {recipeDetail?.intro}
                        </p>
                    </div>
                </div>

                {/* Ingredients */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl text-[#3d3226]">재료</h2>
                        <button
                            onClick={handleAIStoreMap}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md hover:from-emerald-600 hover:to-teal-700 transition-colors text-sm shadow-md"
                        >
                            <Sparkles size={16} />내 근처 재료 찾기
                        </button>
                    </div>
                    <div className="flex justify-between gap-4">
                        <div className="flex">
                            <div className="w-[20px] flex-shrink-0"></div>
                            <ul className="space-y-3 mb-6">
                                {JSON.parse(
                                    recipeDetail.ingredients || '[]',
                                ).map((ingredient, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-3 text-[#6b5d4f]"
                                    >
                                        <span className="w-2 h-2 bg-[#3d3226] rounded-full flex-shrink-0" />
                                        <span className="text-lg">
                                            {ingredient}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <img
                                src={ingredientImgSrc}
                                alt="Ingredients"
                                style={{
                                    width: `${Math.max(80, JSON.parse(recipeDetail.ingredients || '[]').length * 40)}px`,
                                    height: `${Math.max(80, JSON.parse(recipeDetail.ingredients || '[]').length * 40)}px`,
                                }}
                                className="rounded-full object-cover border-2 border-[#d4cbbf] shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setIsIngredientModalOpen(true)}
                            />
                            <div className="w-10 flex-shrink-0"></div>
                        </div>
                    </div>

                    {/* AI Store Map Component */}
                    <AiStoreMapPage ref={mapRef} />
                </div>

                {/* Steps */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] p-8">
                    <h2 className="text-2xl mb-6 text-[#3d3226]">조리 방법</h2>
                    <div className="space-y-6">
                        {(recipeDetail.steps || '')
                            .split('\n')
                            .map((step, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-[#3d3226] text-[#f5f1eb] rounded-full flex items-center justify-center font-bold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <p className="text-lg text-[#6b5d4f] leading-relaxed">
                                            {step}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Hashtags */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] p-8">
                    <h2 className="text-2xl mb-4 text-[#3d3226]">해시태그</h2>
                    <div className="flex flex-wrap gap-3">
                        {mockHashtags.map((tag) => (
                            <button
                                key={tag}
                                className="px-4 py-2 bg-[#ebe5db] text-[#3d3226] rounded-full border-2 border-[#d4cbbf] hover:border-[#3d3226] transition-colors"
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comments Component */}
                <RecipeCommentPage
                    comments={comments}
                    isLoggedIn={isLoggedIn}
                    onOpenAuth={onOpenAuth}
                    currentUsername={currentUsername}
                    onNavigate={onNavigate}
                    recipeDetail={recipeDetail}
                />
                {/* Ingredient Image Modal */}
                {isIngredientModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                        onClick={() => setIsIngredientModalOpen(false)}
                    >
                        <div className="relative max-w-[80vw] max-h-[80vh]">
                            <button
                                onClick={() => setIsIngredientModalOpen(false)}
                                className="absolute -top-10 right-0 text-white hover:text-gray-300"
                            >
                                <span className="text-2xl">&times;</span>
                            </button>
                            <img
                                src={ingredientImgSrc}
                                alt="Ingredients Large"
                                className="w-full h-full object-contain rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
