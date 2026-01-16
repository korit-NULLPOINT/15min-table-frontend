import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RecipeDetail } from "../../../../components/RecipeDetail";
import { recipeDetailsMap } from "../../../../utils/recipeData";

export default function RecipeDetailPage() {
  const { boardId, recipeId } = useParams();
  const navigate = useNavigate();

  const recipe = useMemo(() => {
    const id = Number(recipeId);
    const fromMap = recipeDetailsMap?.[id];
    if (fromMap) return fromMap;

    const saved = JSON.parse(localStorage.getItem("recipes") || "[]");
    return saved.find((r) => r.id === id) || null;
  }, [recipeId]);

  if (!recipe) {
    return (
      <div className="pt-20 max-w-4xl mx-auto px-6">
        <h2 className="text-xl font-semibold text-[#3d3226]">레시피를 찾을 수 없어요.</h2>
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
    <RecipeDetail
      recipe={recipe}
      // ✅ 기존 컴포넌트가 onNavigate 등을 요구하면, 일단 최소로만 연결
      onNavigate={() => navigate(`/boards/${boardId}/recipe`)}
      // 아래는 나중에 auth 연동하면서 제대로 연결
      isLoggedIn={false}
      onOpenAuth={() => {}}
      currentUserNickname=""
      onAuthorClick={() => {}}
    />
  );
}
