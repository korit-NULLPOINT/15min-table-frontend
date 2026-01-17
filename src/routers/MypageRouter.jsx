// src/routers/MyPageRouter.jsx
import { Route, Routes } from 'react-router-dom';
import MyProfilePage from '../pages/me/my-profile-page/MyProfilePage';
import FollowListPage from '../pages/me/follow-list-page/FollowListPage';

export default function MyPageRouter() {
    return (
        <Routes>
            <Route path="" element={<MyProfilePage />} />
            <Route path="followers" element={<FollowListPage type="followers" />} />
            <Route path="following" element={<FollowListPage type="following" />} />
        </Routes>
    );
}
