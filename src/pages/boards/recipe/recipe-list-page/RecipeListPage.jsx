import { useNavigate, useParams } from "react-router-dom";
import { RecipeBoard } from "../../../../components/RecipeBoard";

export default function RecipeListPage() {
    const navigate = useNavigate();
    const { boardId } = useParams();

    const handleRecipeClick = (recipeId) => {
        navigate(`/boards/${boardId}/recipe/${recipeId}`);
    };

    return (
        <RecipeBoard
            onRecipeClick={handleRecipeClick}
            isLoggedIn={false}
            onOpenAuth={() => {}}
        />
    );
}
