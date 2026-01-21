import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePrincipalState } from '../../../../store/usePrincipalState';
import { AuthModal } from '../../../../components/AuthModal';
import { RecipeDetail } from '../../../../components/RecipeDetail';
import { useGetRecipeDetail } from '../../../../apis/generated/recipe-controller/recipe-controller';
import { useGetCommentListByRecipeId } from '../../../../apis/generated/comment-controller/comment-controller';

export default function RecipeDetailPage() {
    const { boardId, recipeId } = useParams();
    const navigate = useNavigate();
    const rId = Number(recipeId);
    const bId = Number(boardId);

    // Auth State
    const { user, isLoggedIn } = usePrincipalState();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // query: { refetchOnWindowFocus: false }를 추가하여 페이지가 다시 로드될 때마다 API 호출을 방지
    const recipeDetail = useGetRecipeDetail(bId, rId, {
        query: { refetchOnWindowFocus: false },
    })?.data?.data?.data;

    const comments = useGetCommentListByRecipeId(rId)?.data?.data?.data;

    if (!recipeDetail) {
        return (
            <div className="pt-20 max-w-4xl mx-auto px-6">
                <h2 className="text-xl font-semibold text-[#3d3226]">
                    레시피를 찾을 수 없어요.
                </h2>
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
                onOpenAuth={() => setIsAuthModalOpen(true)}
                currentUsername={user?.username}
                onAuthorClick={(authorUserId, authorName) => {
                    navigate(`/users/${authorUserId}`, {
                        state: { username: authorName },
                    });
                }}
            />
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
}
