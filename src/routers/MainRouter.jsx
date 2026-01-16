// src/routers/MainRouter.jsx
import { Route, Routes, useSearchParams } from "react-router-dom";
import AppLegacy from "../AppLegacy";
import BoardsRouter from "./BoardsRouter";
import RootLayout from "../layout/RootLayout";
import HomePage from "../pages/home/home-page/HomePage";
import { useState, useEffect } from "react";

export default function MainRouter() {
    const [socialData, setSocialData] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        console.log(Object.fromEntries(searchParams));
        const provider = searchParams.get('provider');
        const providerUserId = searchParams.get('providerUserId');
        const email = searchParams.get('email');
        console.log("provider / providerUserId / email : ", provider, providerUserId, email);
        if (provider && providerUserId) {
            setSocialData({ provider, providerUserId, email });
        }
    }, [searchParams]);
    
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/boards/*" element={<BoardsRouter />} />
            </Route>

            {/* 기존 해시 기반 앱은 홈에서만 유지 */}
            <Route path="/Legacy" element={<AppLegacy />} />
        </Routes>
    );
}
