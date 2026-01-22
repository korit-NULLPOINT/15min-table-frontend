import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePrincipalState } from '../../../../store/usePrincipalState';
import { AuthModal } from '../../../../components/layout/AuthModal';
import { RecipeDetail } from '../../../../components/RecipeDetail';
import { useGetRecipeDetail } from '../../../../apis/generated/recipe-controller/recipe-controller';
import { useGetCommentListByRecipeId } from '../../../../apis/generated/comment-controller/comment-controller';

export default function RecipeDetailPage() {
    const { boardId, recipeId } = useParams();
    const navigate = useNavigate();

    const rId = Number(recipeId);
    const bId = Number(boardId);

    // ✅ 너 프로젝트에서 쓰던 방식(안전)
    const principal = usePrincipalState((s) => s.principal);
    const isLoggedIn = !!principal;

    // ✅ AuthModal 열기/모드
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('signin'); // or 'signup'

    // ✅ 레시피 상세
    const recipeQuery = useGetRecipeDetail(bId, rId, {
        query: {
            refetchOnWindowFocus: false,
            enabled: Number.isFinite(bId) && Number.isFinite(rId),
        },
    });
    const recipeDetail = recipeQuery?.data?.data?.data;

    // ✅ 댓글
    const commentQuery = useGetCommentListByRecipeId(rId, {
        query: { enabled: Number.isFinite(rId) },
    });
    const comments = commentQuery?.data?.data?.data ?? [];

    // ✅ 로딩/에러/없음 방어 (RecipeDetail 내부 방어가 없어도 안전)
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
                    onClick={() => navigate(`/boards/${boardId}/recipe`)}
                >
                    목록으로
                </button>
            </div>
        );
    }

    return (
        <>
            <RecipeDetail
                recipeDetail={recipeDetail}
                comments={comments}
                onNavigate={() => navigate(`/boards/${boardId}/recipe`)}
                isLoggedIn={isLoggedIn}
                onOpenAuth={() => {
                    setAuthMode('signin');
                    setIsAuthModalOpen(true);
                }}
                currentUsername={principal?.username ?? ''}
                onAuthorClick={(authorUserId, authorName) => {
                    if (!authorUserId) return;
                    navigate(`/users/${authorUserId}`, {
                        state: { username: authorName },
                    });
                }}
            />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                mode={authMode}
                onModeChange={setAuthMode}
                onAuthSuccess={() => setIsAuthModalOpen(false)}
            />
        </>
    );
}
