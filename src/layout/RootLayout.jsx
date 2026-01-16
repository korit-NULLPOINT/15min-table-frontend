// src/layout/RootLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { AuthModal } from "../components/AuthModal";

export default function RootLayout() {
    const navigate = useNavigate();

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

    // Header가 기존에 쓰던 pageKey들을 최소로 라우팅에 매핑
    const handleNavigate = (pageKey) => {
        if (pageKey === "home") navigate("/");
        // board 메뉴는 일단 대표 보드로 보내기 (원하면 마지막 boardId 기억하게 개선 가능)
        if (pageKey === "board") navigate("/boards/1/recipe");
        if (pageKey === "community") navigate("/boards/2/free"); // 나중에 free 라우트 붙이면 동작
        if (pageKey === "profile") navigate("/me"); // 추후 만들면
    };

    return (
        <div className="min-h-screen bg-[#f5f1eb]">
            <Header
                onOpenAuth={openAuthModal}
                onNavigate={handleNavigate}
                isLoggedIn={isLoggedIn}
                userNickname={userNickname}
                // 필요하면 나중에 더 연결
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
