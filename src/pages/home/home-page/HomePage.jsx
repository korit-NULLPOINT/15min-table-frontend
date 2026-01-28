import { useNavigate, useOutletContext } from 'react-router-dom';
import { useGetRecipeList } from '../../../apis/generated/recipe-controller/recipe-controller';
import { TopRecipes } from '../../../components/home/TopRecipes';
import { HighRatedSlider } from '../../../components/home/HighRatedSlider';

import {
    useAddBookmark,
    useDeleteBookmark,
} from '../../../apis/generated/bookmark-controller/bookmark-controller';
import { getGetRecipeListQueryKey } from '../../../apis/generated/recipe-controller/recipe-controller';
import { useQueryClient } from '@tanstack/react-query';
import { usePrincipalState } from '../../../store/usePrincipalState';

export default function HomePage() {
    const navigate = useNavigate();
    const { openAuthModal } = useOutletContext();
    const boardId = 1;
    const queryClient = useQueryClient();
    const principal = usePrincipalState((s) => s.principal);
    const isLoggedIn = !!principal;

    const { mutate: addBookmark } = useAddBookmark();
    const { mutate: deleteBookmark } = useDeleteBookmark();

    const handleToggleBookmark = (recipeId, currentBookmarked) => {
        if (!isLoggedIn) {
            openAuthModal?.();
            return;
        }

        const options = {
            onSuccess: () => {
                // Invalidate the list so it updates
                queryClient.invalidateQueries({
                    queryKey: getGetRecipeListQueryKey(boardId),
                });
            },
            onError: (error) => {
                const status = error.response?.status;
                if (status === 400) {
                    // 400 에러(이미 북마크됨 등) 발생 시에도 목록 갱신하여 상태 동기화
                    console.warn('Bookmark state mismatch (400), syncing...');
                    queryClient.invalidateQueries({
                        queryKey: getGetRecipeListQueryKey(boardId),
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

    // Use original getRecipeList but with default pagination to avoid 500 or NPE in backend
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
                onToggleBookmark={handleToggleBookmark}
            />
            <HighRatedSlider
                recipes={recipes}
                onRecipeClick={handleRecipeClick}
                onOpenAuth={openAuthModal}
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
