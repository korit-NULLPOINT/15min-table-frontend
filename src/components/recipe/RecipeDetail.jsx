import { ArrowLeft, User as UserIcon, Star, Sparkles } from 'lucide-react';
import { useState, useRef, useMemo } from 'react';

import { ImageWithFallback } from '../figma/ImageWithFallback';
import RecipeComment from './RecipeComment';
import RecipeRatingBookmark from './RecipeRatingBookmark';
import { formatDate } from '../../apis/utils/formatDate';
import KakaoMap from '../KakaoMap';
// import { useGetHashtagsByRecipeId } from '../../apis/generated/recipe-hashtag-controller/recipe-hashtag-controller';

function safeJsonArray(value, fallback = []) {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return fallback;
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch {
        return fallback;
    }
}

export function RecipeDetail({
    recipeDetail,
    onNavigate,
    isLoggedIn,
    onOpenAuth,
    currentUsername,
    onAuthorClick,
    comments,
}) {
    if (!recipeDetail) return null;
    const [totalRatings, setTotalRatings] = useState(
        recipeDetail.ratingCount || 0,
    );
    const [ratingSum, setRatingSum] = useState(
        (recipeDetail.ratingCount || 0) * (recipeDetail.avgRating || 0),
    );

    const averageRating =
        totalRatings > 0 ? (ratingSum / totalRatings).toFixed(1) : '0.0';

    const handleStatsChange = (deltaTotal, deltaSum) => {
        setTotalRatings((prev) => prev + deltaTotal);
        setRatingSum((prev) => prev + deltaSum);
    };

    const mapRef = useRef(null);

    const handleAIStoreMap = () => {
        if (
            mapRef.current &&
            typeof mapRef.current.handleAIStoreMap === 'function'
        ) {
            mapRef.current.handleAIStoreMap();
            return;
        }
        // ref 메서드가 없을 때도 사용자 경험은 유지
        alert(
            '지도 기능을 불러오지 못했습니다. (AiStoreMapPage ref 확인 필요)',
        );
    };

    // --- ingredient modal ---
    const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);

    const ingredientsArr = useMemo(() => {
        return safeJsonArray(recipeDetail.ingredients, []);
    }, [recipeDetail.ingredients]);

    const ingredientImgSrc = useMemo(() => {
        if (recipeDetail?.ingredientImgUrl)
            return recipeDetail.ingredientImgUrl;

        const str =
            typeof recipeDetail?.ingredients === 'string'
                ? recipeDetail.ingredients
                : JSON.stringify(recipeDetail?.ingredients ?? 'default');

        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }
        return `https://picsum.photos/seed/${Math.abs(hash)}/500`;
    }, [recipeDetail?.ingredientImgUrl, recipeDetail?.ingredients]);

    // --- bookmark hooks removed ---

    // const hashtags = useGetHashtagsByRecipeId(recipeDetail.recipeId)?.data?.data
    //     ?.data;
    // console.log(hashtags);

    const hashtags = useMemo(() => {
        const tags = recipeDetail.hashtags || [
            '15분요리',
            '간단레시피',
            '자취생필수',
            '초간단',
        ];
        return tags
            .map((tag) => {
                if (typeof tag === 'string') return tag;
                if (tag.name) return tag.name;
                if (typeof tag.hashtag === 'string') return tag.hashtag;

                
                if (tag.hashtag?.name) return tag.hashtag.name;
                return '';
            })
            .filter(Boolean); // Handle mock/fallback strings
    }, [recipeDetail.hashtags]);
    const handleBack = () => {
        if (typeof onNavigate === 'function') {
            // page에서 onNavigate={() => navigate(...)} 형태면 인자 무시됨
            onNavigate('home');
            return;
        }
    };

    const authorName = recipeDetail.username || recipeDetail.author || '';
    const authorUserId = recipeDetail.userId;

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Back Button */}
                <button
                    onClick={handleBack}
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
                                `https://picsum.photos/seed/${recipeDetail.recipeId}/800`
                            }
                            alt={recipeDetail.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-8">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-full">
                                <h1 className="text-4xl mb-4 text-[#3d3226]">
                                    {recipeDetail.title}
                                </h1>

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-6 text-[#6b5d4f] mt-4">
                                    <div className="flex items-center gap-2">
                                        {recipeDetail.profileImgUrl ? (
                                            <img
                                                src={recipeDetail.profileImgUrl}
                                                alt={authorName}
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
                                                if (!authorUserId) return;
                                                onAuthorClick?.(
                                                    authorUserId,
                                                    authorName,
                                                );
                                            }}
                                        >
                                            {authorName}
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
                                        <span className="w-1 h-1 bg-[#d4cbbf] rounded-full" />
                                        <span>
                                            {recipeDetail.updateDt &&
                                            recipeDetail.updateDt !==
                                                recipeDetail.createDt
                                                ? `${formatDate(
                                                      recipeDetail.updateDt,
                                                  )} (수정됨)`
                                                : formatDate(
                                                      recipeDetail.createDt,
                                                  )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rating Section (컴포넌트 유지) */}
                        <div className="mb-6">
                            <RecipeRatingBookmark
                                recipeId={recipeDetail.recipeId}
                                isLoggedIn={isLoggedIn}
                                onOpenAuth={onOpenAuth}
                                onStatsChange={handleStatsChange}
                            />
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
                        <div className="flex-1">
                            <ul className="space-y-3">
                                {ingredientsArr.map((ingredient, index) => (
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

                        <div className="flex flex-col items-center justify-end gap-2">
                            <img
                                src={ingredientImgSrc}
                                alt="Ingredients"
                                style={{
                                    width: `${Math.max(
                                        120,
                                        ingredientsArr.length * 40,
                                    )}px`,
                                    height: `${Math.max(
                                        120,
                                        ingredientsArr.length * 40,
                                    )}px`,
                                }}
                                className="rounded-full object-cover border-2 border-[#d4cbbf] shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200"
                                onClick={() => setIsIngredientModalOpen(true)}
                            />
                            <p className="text-[#6b5d4f] text-xs">
                                클릭하면 그림이 확대됩니다.
                            </p>
                        </div>
                    </div>
                    <KakaoMap ref={mapRef} ingredients = {ingredientsArr}></KakaoMap>
                </div>

                {/* Steps */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] p-8">
                    <h2 className="text-2xl mb-6 text-[#3d3226]">조리 방법</h2>
                    <div className="space-y-6">
                        {(recipeDetail.steps || '')
                            .split('\n')
                            .filter(Boolean)
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
                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] p-8 mt-8">
                    <h2 className="text-2xl mb-4 text-[#3d3226]">해시태그</h2>
                    <div className="flex flex-wrap gap-3">
                        {hashtags.map((tag) => (
                            <button
                                key={tag}
                                className="px-4 py-2 bg-[#ebe5db] text-[#3d3226] rounded-full border-2 border-[#d4cbbf] hover:border-[#3d3226] transition-colors"
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comments Component (API 댓글 유지) */}
                <RecipeComment
                    comments={comments ?? []}
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
