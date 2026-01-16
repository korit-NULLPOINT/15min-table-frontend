// src/routers/MainRouter.jsx
import { Route, Routes } from "react-router-dom";
import AppLegacy from "../AppLegacy";
import BoardsRouter from "./BoardsRouter";
import RootLayout from "../layout/RootLayout";
import HomePage from "../pages/home/home-page/HomePage";

export default function MainRouter() {
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
