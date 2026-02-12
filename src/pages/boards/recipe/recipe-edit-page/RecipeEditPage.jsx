import { useParams } from 'react-router-dom';
import { RecipeEdit } from '../../../../components/recipe/RecipeEdit';

export default function RecipeEditPage() {
    const { boardId, recipeId } = useParams();

    return <RecipeEdit recipeId={Number(recipeId)} boardId={Number(boardId)} />;
}
