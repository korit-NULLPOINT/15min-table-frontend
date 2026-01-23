import { useNavigate, useParams } from 'react-router-dom';
import { RecipeBoard } from '../../../../components/recipe/RecipeBoard';

export default function RecipeListPage() {
    const navigate = useNavigate();
    const { boardId } = useParams();

    const handleRecipeClick = (recipeId) => {
        navigate(`/boards/${boardId}/recipe/${recipeId}`);
    };

    return (
        <RecipeBoard
            onNavigate={navigate}
            onRecipeClick={handleRecipeClick}
            isLoggedIn={false}
        />
    );
}
