import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { AuthModal } from "../pages/auth-page/AuthModal";

export default function RootLayout() {
    const navigate = useNavigate();

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState("signin");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userNickname, setUserNickname] = useState("");

    useEffect(() => {
        const savedNickname = localStorage.getItem("userNickname");
        const savedLoginState = localStorage.getItem("isLoggedIn");
        if (savedNickname) setUserNickname(savedNickname);
        if (savedLoginState === "true") setIsLoggedIn(true);
    }, []);

    const openAuthModal = (mode = "signin") => {
        const normalized = mode === "login" ? "signin" : mode;
        setAuthMode(normalized);
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

    const handleNavigate = (pageKey) => {
        if (pageKey === "home") navigate("/");
        if (pageKey === "board") navigate("/boards/1/recipe");
        if (pageKey === "community") navigate("/boards/2/free");
        if (pageKey === "profile") navigate("/me"); // 추후
        if (pageKey === "write") navigate("/boards/1/recipe/write"); // (선택) 헤더에 글쓰기 버튼 있으면
    };

    return (
        <div className="min-h-screen bg-[#f5f1eb]">
            <Header
                onOpenAuth={openAuthModal}
                onNavigate={handleNavigate}
                isLoggedIn={isLoggedIn}
                username={userNickname} // ✅ (중요) userNickname -> username으로 내려주기
                onRandomRecipe={() => {}}
                onNotificationClick={() => {}}
            />

            <Outlet />

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
