import { useNavigate } from "react-router-dom";
import { TopRecipes } from "../../../components/TopRecipes";
import { HighRatedSlider } from "../../../components/HighRatedSlider";

export default function HomePage() {
    const navigate = useNavigate();
    const boardId = 1;

    const handleRecipeClick = (recipeId) => {
        navigate(`/boards/${boardId}/recipe/${recipeId}`);
    };

    return (
        <main className="pt-20">
            <TopRecipes onRecipeClick={handleRecipeClick} />
            <HighRatedSlider onRecipeClick={handleRecipeClick} />
        </main>
    );
}
