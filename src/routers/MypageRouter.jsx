import { Route, Routes, useNavigate } from 'react-router-dom';

import FollowListPage from '../pages/me/follow-list-page/FollowListPage';
import MyProfilePage from '../pages/me/my-profile-page/MyprofilePage';
import { usePrincipalState } from '../store/usePrincipalState';
import { useEffect } from 'react';

function isAdmin(principal) {
    const roles = principal?.userRoles ?? [];
    return roles.some((ur) => Number(ur?.roleId) === 1);
}

export default function MyPageRouter() {
    const navigate = useNavigate();
    const principal = usePrincipalState((s) => s.principal);
    const isLoggedIn = usePrincipalState((s) => s.isLoggedIn);

    useEffect(() => {
        if (!isLoggedIn) return;
        if (isAdmin(principal)) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [isLoggedIn, principal, navigate]);

    if (isLoggedIn && isAdmin(principal)) return null;

    return (
        <Routes>
            <Route path="" element={<MyProfilePage />} />
            <Route
                path="followers"
                element={<FollowListPage type="followers" />}
            />
            <Route
                path="following"
                element={<FollowListPage type="following" />}
            />
        </Routes>
    );
}
