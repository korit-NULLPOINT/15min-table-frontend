// src/pages/me/follow-list-page/FollowListPage.jsx
import { useNavigate } from 'react-router-dom';
import { FollowList } from '../../../components/user-profile/FollowList';

export default function FollowListPage({ type }) {
    const navigate = useNavigate();

    const onNavigate = (key) => {
        if (key === 'profile') navigate('/me');
        if (key === 'home') navigate('/');
    };

    // FollowList에서 유저 클릭 시 OtherUserProfile로 이동
    // FollowList가 onUserClick(user.id, user.name) 형태로 호출하지만,
    // 여기서는 userId만 받아도 추가 인자는 자동으로 무시됨.
    const onUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    return (
        <FollowList
            type={type}
            onNavigate={onNavigate}
            onUserClick={onUserClick}
        />
    );
}
