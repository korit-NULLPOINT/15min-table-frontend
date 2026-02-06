import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { usePrincipalState } from '../../../../store/usePrincipalState';
import { RecipeDetail } from '../../../../components/recipe/RecipeDetail';
import { useGetRecipeDetail } from '../../../../apis/generated/recipe-controller/recipe-controller';
import { useGetRecipeCommentListByTarget } from '../../../../apis/generated/comment-controller/comment-controller';

export default function RecipeDetailPage() {
    const { boardId, recipeId } = useParams();
    const navigate = useNavigate();

    const { openAuthModal } = useOutletContext();

    const rId = Number(recipeId);
    const bId = Number(boardId);

    const principal = usePrincipalState((s) => s.principal);
    const isLoggedIn = !!principal;

    const recipeQuery = useGetRecipeDetail(bId, rId, {
        query: {
            refetchOnWindowFocus: false,
            enabled: Number.isFinite(bId) && Number.isFinite(rId),
        },
    });
    const recipeDetail = recipeQuery?.data?.data?.data;

    const commentQuery = useGetRecipeCommentListByTarget(rId, {
        query: { enabled: Number.isFinite(rId) },
    });

    const comments = commentQuery?.data?.data?.data ?? [];

    if (recipeQuery.isLoading) {
        return <div className="pt-20 max-w-4xl mx-auto px-6">로딩 중...</div>;
    }

    if (recipeQuery.isError) {
        return (
            <div className="pt-20 max-w-4xl mx-auto px-6">
                상세 조회 중 오류가 발생했어요.
            </div>
        );
    }

    if (!recipeDetail) {
        return (
            <div className="pt-20 max-w-4xl mx-auto px-6">
                레시피를 찾을 수 없어요.
                <button
                    className="mt-4 px-4 py-2 rounded bg-[#3d3226] text-[#f5f1eb]"
                    onClick={() =>
                        navigate(`/board/${boardId}/recipe/filtered`)
                    }
                >
                    목록으로
                </button>
            </div>
        );
    }

    return (
        <RecipeDetail
            recipeDetail={recipeDetail}
            comments={comments}
            onNavigate={() => navigate(`/board/${boardId}/recipe/filtered`)}
            isLoggedIn={isLoggedIn}
            onOpenAuth={() => openAuthModal('signin')} // ✅ 전역 모달 열기
            currentUsername={principal?.username ?? ''}
            onAuthorClick={(authorUserId, authorName) => {
                if (!authorUserId) return;
                navigate(`/profile/${authorUserId}`, {
                    state: { username: authorName },
                });
            }}
        />
    );
}
