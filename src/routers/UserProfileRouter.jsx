import { Routes, Route } from 'react-router-dom';
import OtherUserProfilePage from '../pages/users/other-user-profile-page/OtherUserProfilePage';
import FollowListPage from '../pages/me/follow-list-page/FollowListPage';

export default function UserProfileRouter() {
    return (
        <Routes>
            {/* /users/:userId */}
            <Route path=":userId" element={<OtherUserProfilePage />} />

            {/* /users/:userId/followers */}
            <Route
                path=":userId/followers"
                element={<FollowListPage type="followers" />}
            />

            {/* /users/:userId/following */}
            <Route
                path=":userId/following"
                element={<FollowListPage type="following" />}
            />
        </Routes>
    );
}
