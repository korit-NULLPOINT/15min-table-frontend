import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Star } from 'lucide-react';
import { Box } from '@mui/material';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { mainCategory, subCategory } from '../../utils/categoryData';
import { useGetFilteredRecipeList } from '../../apis/generated/recipe-controller/recipe-controller';
import { useDebounce } from '../../hooks/useDebounce';

export function RecipeBoard({ onNavigate, onRecipeClick }) {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const [selectedMainCategoryId, setSelectedMainCategoryId] = useState(0);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(0);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;

    // Filter API Call
    const { data: recipeData, isLoading } = useGetFilteredRecipeList(
        1, // boardId
        {
            mainCategoryId:
                selectedMainCategoryId === 0
                    ? undefined
                    : selectedMainCategoryId,
            subCategoryId:
                selectedSubCategoryId === 0 ? undefined : selectedSubCategoryId,
            keyword: debouncedSearchQuery || undefined,
            page: currentPage - 1, // API is 0-indexed
            size: ITEMS_PER_PAGE,
        },
    );

    const recipes = recipeData?.data?.data?.items || [];
    const totalCount = recipeData?.data?.data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // Reset page on filter change
    const handleFilterChange = (setter, value) => {
        setter(value);
        setCurrentPage(1);
    };

    // Reset page when search query changes (debounced)
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <button
                    onClick={() => onNavigate('/')}
                    className="flex items-center gap-2 mb-6 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
                >
                    <ArrowLeft size={20} />
                    메인으로 돌아가기
                </button>

                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#3d3226] text-[#f5f1eb] px-8 py-6">
                        <h1 className="text-3xl mb-2">레시피 게시판</h1>
                        <p className="text-[#e5dfd5]">
                            다양한 레시피를 검색하고 찾아보세요
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="p-6 border-b-2 border-[#e5dfd5] bg-[#ebe5db]">
                        <div className="relative">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b5d4f]"
                                size={20}
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="레시피 검색..."
                                className="w-full pl-12 pr-4 py-4 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none bg-white text-[#3d3226]"
                            />
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="p-6 border-b-2 border-[#e5dfd5]">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Filter size={18} className="text-[#3d3226]" />
                                <h3 className="text-sm uppercase tracking-wider text-[#6b5d4f]">
                                    메인 카테고리
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(mainCategory).map(
                                    ([id, label]) => (
                                        <button
                                            key={id}
                                            onClick={() => {
                                                const categoryId = Number(id);
                                                handleFilterChange(
                                                    setSelectedMainCategoryId,
                                                    selectedMainCategoryId ===
                                                        categoryId
                                                        ? 0
                                                        : categoryId,
                                                );
                                            }}
                                            className={`px-4 py-2 rounded-md border-2 transition-colors ${
                                                selectedMainCategoryId ===
                                                Number(id)
                                                    ? 'bg-[#3d3226] text-[#f5f1eb] border-[#3d3226]'
                                                    : 'bg-white text-[#3d3226] border-[#d4cbbf] hover:border-[#3d3226]'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Filter size={18} className="text-[#3d3226]" />
                                <h3 className="text-sm uppercase tracking-wider text-[#6b5d4f]">
                                    부 카테고리
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(subCategory).map(
                                    ([id, label]) => (
                                        <button
                                            key={id}
                                            onClick={() => {
                                                const categoryId = Number(id);
                                                handleFilterChange(
                                                    setSelectedSubCategoryId,
                                                    selectedSubCategoryId ===
                                                        categoryId
                                                        ? 0
                                                        : categoryId,
                                                );
                                            }}
                                            className={`px-4 py-2 rounded-md border-2 transition-colors ${
                                                selectedSubCategoryId ===
                                                Number(id)
                                                    ? 'bg-[#3d3226] text-[#f5f1eb] border-[#3d3226]'
                                                    : 'bg-white text-[#3d3226] border-[#d4cbbf] hover:border-[#3d3226]'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recipe List */}
                    <div className="p-6">
                        <div className="mb-4 text-[#6b5d4f]">
                            총{' '}
                            <span className="text-[#3d3226] font-bold">
                                {totalCount}
                            </span>
                            개의 레시피
                        </div>

                        {isLoading ? (
                            <div className="text-center py-20 text-[#6b5d4f]">
                                레시피를 불러오는 중입니다...
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recipes.map((recipe) => (
                                    <div
                                        key={recipe.recipeId}
                                        onClick={() =>
                                            onRecipeClick &&
                                            onRecipeClick(recipe.recipeId)
                                        }
                                        className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 border-[#e5dfd5] hover:border-[#3d3226]"
                                    >
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                aspectRatio: '4 / 3',
                                                overflow: 'hidden',
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <ImageWithFallback
                                                src={
                                                    recipe.thumbnailImgUrl &&
                                                    recipe.thumbnailImgUrl !==
                                                        'string'
                                                        ? recipe.thumbnailImgUrl
                                                        : `https://picsum.photos/seed/${recipe.recipeId}/500`
                                                }
                                                alt={recipe.title}
                                                className="w-full h-full object-contain hover:scale-110 transition-transform duration-300"
                                            />
                                            {!recipe.thumbnailImgUrl && (
                                                <div
                                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold pointer-events-none whitespace-nowrap"
                                                    style={{
                                                        textShadow:
                                                            '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0px 0px 5px rgba(0,0,0,0.8)',
                                                    }}
                                                >
                                                    랜덤이미지 입니다.
                                                </div>
                                            )}
                                        </Box>

                                        <div className="p-4">
                                            <h3 className="text-lg text-[#3d3226] mb-2 line-clamp-1">
                                                {recipe.title}
                                            </h3>
                                            <div className="flex items-center justify-between text-sm text-[#6b5d4f]">
                                                <span>
                                                    by {recipe.username}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Star
                                                        size={14}
                                                        fill="#f59e0b"
                                                        className="text-[#f59e0b]"
                                                    />
                                                    {(
                                                        recipe.avgRating || 0
                                                    ).toFixed(1)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-[#6b5d4f]">
                                                <span>
                                                    👁 {recipe.viewCount || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {totalCount === 0 && !isLoading && (
                            <div className="text-center py-12 text-[#6b5d4f]">
                                검색 결과가 없습니다.
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {!isLoading && totalPages > 0 && (
                        <div className="flex justify-center items-center gap-2 p-6 border-t-2 border-[#e5dfd5] bg-[#ebe5db]">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1),
                                    )
                                }
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-md border-2 border-[#d4cbbf] bg-white text-[#3d3226] hover:border-[#3d3226] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                이전
                            </button>

                            {/* Simple Page Numbers */}
                            <div className="flex items-center gap-1">
                                {(() => {
                                    const maxButtons = 5; // 한 번에 보여줄 버튼 개수
                                    let startPage = Math.max(
                                        1,
                                        currentPage -
                                            Math.floor(maxButtons / 2),
                                    );
                                    let endPage = Math.min(
                                        totalPages,
                                        startPage + maxButtons - 1,
                                    );

                                    // 끝쪽 페이지에 도달했을 때 startPage 조정
                                    if (endPage - startPage + 1 < maxButtons) {
                                        startPage = Math.max(
                                            1,
                                            endPage - maxButtons + 1,
                                        );
                                    }

                                    return Array.from(
                                        { length: endPage - startPage + 1 },
                                        (_, i) => startPage + i,
                                    ).map((pageNum) => (
                                        <button
                                            key={pageNum}
                                            onClick={() =>
                                                setCurrentPage(pageNum)
                                            }
                                            className={`w-10 h-10 rounded-md font-bold transition-colors ${
                                                currentPage === pageNum
                                                    ? 'bg-[#3d3226] text-[#f5f1eb]'
                                                    : 'text-[#3d3226] hover:bg-[#d4cbbf]'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    ));
                                })()}
                            </div>

                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-md border-2 border-[#d4cbbf] bg-white text-[#3d3226] hover:border-[#3d3226] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                다음
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
