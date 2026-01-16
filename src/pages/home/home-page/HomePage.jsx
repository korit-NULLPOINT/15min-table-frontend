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
            {/* Hero Section */}
            <section className="px-6 py-8 max-w-7xl mx-auto">
                <div className="text-center mb-4">
                    <h2
                        className="text-5xl mb-4 text-[#3d3226] font-serif"
                        style={{ letterSpacing: "0.02em" }}>
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

            <TopRecipes onRecipeClick={handleRecipeClick} />
            <HighRatedSlider onRecipeClick={handleRecipeClick} />

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
