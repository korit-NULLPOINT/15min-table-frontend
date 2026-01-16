import { useNavigate, useParams } from "react-router-dom";
import { RecipeEdit } from "../../../../components/RecipeEdit";

export default function RecipeEditPage() {
    const { boardId, recipeId } = useParams();
    const navigate = useNavigate();

    const onNavigate = (pageKey) => {
        if (pageKey === "board") navigate(`/boards/${boardId}/recipe`);
        if (pageKey === "home") navigate(`/`);
        if (pageKey === "recipe")
            navigate(`/boards/${boardId}/recipe/${recipeId}`);
    };

    return <RecipeEdit onNavigate={onNavigate} recipeId={Number(recipeId)} />;
}
