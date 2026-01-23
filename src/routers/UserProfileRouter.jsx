import { Routes, Route } from 'react-router-dom';
import OtherUserProfilePage from '../pages/users/other-user-profile-page/OtherUserProfilePage';
import FollowListPage from '../pages/me/follow-list-page/FollowListPage';

export default function UserProfileRouter() {
    return (
        <Routes>
            <Route path=":userId" element={<OtherUserProfilePage />} />
            <Route
                path=":userId/followers"
                element={<FollowListPage type="followers" />}
            />
            <Route
                path=":userId/following"
                element={<FollowListPage type="following" />}
            />
        </Routes>
    );
}
