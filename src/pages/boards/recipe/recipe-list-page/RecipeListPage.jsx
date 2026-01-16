// src/pages/boards/recipe/recipe-list-page/RecipeListPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../../../../components/Header";
import { AuthModal } from "../../../../components/AuthModal";
import { RecipeBoard } from "../../../../components/RecipeBoard";

export default function RecipeListPage() {
    const { boardId } = useParams();
    const navigate = useNavigate();

    // ✅ AppLegacy에서 하던 “최소 로그인 상태”만 여기서도 재사용
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState("login");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userNickname, setUserNickname] = useState("");

    useEffect(() => {
        const savedNickname = localStorage.getItem("userNickname");
        const savedLoginState = localStorage.getItem("isLoggedIn");
        if (savedNickname) setUserNickname(savedNickname);
        if (savedLoginState === "true") setIsLoggedIn(true);
    }, []);

    const openAuthModal = (mode) => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    const handleAuthSuccess = (nickname) => {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        if (nickname) {
            setUserNickname(nickname);
            localStorage.setItem("userNickname", nickname);
        }
    };

    // ✅ onNavigate는 일단 홈으로 보내는 최소 구현(필요하면 나중에 확장)
    const onNavigate = (pageKey) => {
        if (pageKey === "home") navigate("/");
        if (pageKey === "board") navigate(`/boards/${boardId}/recipe`);
        // 추후 profile/community 등 라우팅 붙이면 여기서 매핑 확장
    };

    const onRecipeClick = (recipeId) => {
        navigate(`/boards/${boardId}/recipe/${recipeId}`);
        console.log("recipe click:", recipeId);
    };

    return (
        <div className="min-h-screen bg-[#f5f1eb]">
            <Header
                onOpenAuth={openAuthModal}
                onNavigate={onNavigate}
                isLoggedIn={isLoggedIn}
                userNickname={userNickname}
            />

            <RecipeBoard
                onNavigate={onNavigate}
                onRecipeClick={onRecipeClick}
                isLoggedIn={isLoggedIn}
                onOpenAuth={() => openAuthModal("login")}
            />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                mode={authMode}
                onAuthSuccess={handleAuthSuccess}
                onModeChange={setAuthMode}
            />
        </div>
    );
}
