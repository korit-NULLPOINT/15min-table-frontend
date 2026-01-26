import { useNavigate, useOutletContext } from 'react-router-dom';
import { useGetRecipeList } from '../../../apis/generated/recipe-controller/recipe-controller';
import { TopRecipes } from '../../../components/home/TopRecipes';
import { HighRatedSlider } from '../../../components/home/HighRatedSlider';

import {
    getGetBookmarkListByUserIdQueryKey,
    useAddBookmark,
    useDeleteBookmark,
    useGetBookmarkListByUserId,
} from '../../../apis/generated/bookmark-controller/bookmark-controller';
import { useQueryClient } from '@tanstack/react-query';
import { usePrincipalState } from '../../../store/usePrincipalState';
import { useMemo } from 'react';

export default function HomePage() {
    const navigate = useNavigate();
    const { openAuthModal } = useOutletContext();
    const boardId = 1;
    const queryClient = useQueryClient();
    const principal = usePrincipalState((s) => s.principal);
    const isLoggedIn = !!principal;

    // --- Bookmark Logic (Lifted Up) ---
    const { data: bookmarkListData } = useGetBookmarkListByUserId({
        query: { enabled: isLoggedIn },
    });
    // Assuming the API returns: data.data.data (in result) -> data.data (in value)
    const myBookmarkList = bookmarkListData?.data?.data || [];

    // Create a Set for O(1) lookup
    const bookmarkedRecipeIds = useMemo(() => {
        return new Set(myBookmarkList.map((b) => b.recipeId));
    }, [myBookmarkList]);

    const { mutate: addBookmark } = useAddBookmark();
    const { mutate: deleteBookmark } = useDeleteBookmark();

    const handleToggleBookmark = (recipeId) => {
        if (!isLoggedIn) {
            openAuthModal?.();
            return;
        }

        const isBookmarked = bookmarkedRecipeIds.has(recipeId);
        const options = {
            onSuccess: () => {
                // Invalidate the list so it updates
                queryClient.invalidateQueries({
                    queryKey: getGetBookmarkListByUserIdQueryKey(),
                });
            },
            onError: (error) => {
                console.error('Failed to toggle bookmark:', error);
                alert('북마크 변경에 실패했습니다.');
            },
        };

        if (isBookmarked) {
            deleteBookmark({ recipeId }, options);
        } else {
            addBookmark({ recipeId }, options);
        }
    };

    // TODO: 페이지네이션 처리가 필요하다면 params 추가 (현재는 전체/기본 조회)
    // boardId는 필수 파라미터입니다.
    const { data: recipeListResponse, isLoading } = useGetRecipeList(boardId);

    // API 응답 구조: data.data.data.items 배열로 가정
    // (Actual response might be nested differently, e.g. .data.data.items if generated code returns AxiosResponse)
    // Based on user provided info: generated code uses customInstance which usually returns promise of data.
    // If we look at other usages: const recipeDetail = recipeQuery?.data?.data?.data;
    // So likely: recipeListResponse.data.data.items

    const recipes = recipeListResponse?.data?.data?.items || [];

    const handleRecipeClick = (recipeId) => {
        navigate(`/boards/${boardId}/recipe/${recipeId}`);
    };

    if (isLoading) {
        return <div className="pt-20 text-center">로딩 중...</div>;
    }

    return (
        <main className="pt-20">
            {/* Hero Section */}
            <section className="px-6 py-8 max-w-7xl mx-auto">
                <div className="text-center mb-4">
                    <h2
                        className="text-5xl mb-4 text-[#3d3226] font-serif"
                        style={{ letterSpacing: '0.02em' }}
                    >
                        15분이면 충분한
                        <br />
                        <span className="text-6xl" style={{ fontWeight: 500 }}>
                            식탁 위의 행복
                        </span>
                    </h2>
                    <p className="text-lg text-[#6b5d4f] mt-4">
                        바쁜 자취생을 위한 간단하고 맛있는 레시피
                    </p>
                </div>
            </section>

            <TopRecipes
                recipes={recipes}
                onRecipeClick={handleRecipeClick}
                onOpenAuth={openAuthModal}
                bookmarkedRecipeIds={bookmarkedRecipeIds}
                onToggleBookmark={handleToggleBookmark}
            />
            <HighRatedSlider
                recipes={recipes}
                onRecipeClick={handleRecipeClick}
                onOpenAuth={openAuthModal}
                bookmarkedRecipeIds={bookmarkedRecipeIds}
                onToggleBookmark={handleToggleBookmark}
            />

            {/* Home only Footer */}
            <footer className="bg-[#3d3226] text-[#f5f1eb] py-8 mt-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm">
                        © 2026 십오분:식탁. 모든 권리 보유.
                    </p>
                </div>
            </footer>
        </main>
    );
}
