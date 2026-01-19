// src/routers/MainRouter.jsx
import {
    Route,
    RouterProvider,
    Routes,
    useSearchParams,
} from 'react-router-dom';
import AppLegacy from '../AppLegacy';
import BoardsRouter from './BoardsRouter';
import RootLayout from '../layout/RootLayout';
import HomePage from '../pages/home/home-page/HomePage';
import { useState, useEffect } from 'react';
import OAuth2Page from '../pages/auth-page/OAuth2Page';

export default function MainRouter() {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/boards/*" element={<BoardsRouter />} />
                <Route
                    path="/auth/oauth2/*"
                    element={<OAuth2Page />}
                />
            </Route>

            {/* 기존 해시 기반 앱은 홈에서만 유지 */}
            <Route path="/Legacy" element={<AppLegacy />} />
        </Routes>
    );
}
