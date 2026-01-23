// src/routers/MainRouter.jsx
import { Route, Routes } from 'react-router-dom';
import BoardsRouter from './BoardsRouter';
import RootLayout from '../layout/RootLayout';
import HomePage from '../pages/home/home-page/HomePage';
import MyPageRouter from './MypageRouter';
import OAuth2Page from '../pages/auth-page/OAuth2Page';
import UserProfileRouter from './UserProfileRouter';

export default function MainRouter() {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/boards/*" element={<BoardsRouter />} />
                <Route path="/me/*" element={<MyPageRouter />} />
                <Route path="/users/*" element={<UserProfileRouter />} />
                <Route path="/auth/oauth2/*" element={<OAuth2Page />} />
            </Route>
        </Routes>
    );
}
