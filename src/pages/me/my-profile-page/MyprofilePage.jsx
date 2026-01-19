// src/pages/me/my-profile-page/MyProfilePage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../../../components/UserProfile';

const RECIPE_BOARD_ID = 1;
const COMMUNITY_BOARD_ID = 2;

export default function MyProfilePage() {
    const navigate = useNavigate();


    
    useEffect(() => {
        const token = localStorage.getItem('AccessToken');
        if (!token) navigate('/');
    }, [navigate]);

    const onNavigate = (key) => {
        if (key === 'home') navigate('/');
        if (key === 'profile') navigate('/me');
    };

    // ✅ 마이페이지 내부 이동은 콜백으로만
    const onFollowersClick = () => navigate('/me/followers');
    const onFollowingClick = () => navigate('/me/following');

    const onRecipeClick = (recipeId) => {
        navigate(`/boards/${RECIPE_BOARD_ID}/recipe/${recipeId}`);
    };

    // ✅ 내가 쓴 커뮤니티/댓글 -> 커뮤니티 상세
    // const onCommunityPostClick = (postId) => {
    //     navigate(`/boards/${COMMUNITY_BOARD_ID}/free/${postId}`);
    //   };

    // (선택) 수정 라우트도 붙일 거면
    const onEditRecipe = (recipeId) => {
        navigate(`/boards/${RECIPE_BOARD_ID}/recipe/${recipeId}/edit`);
    };

    //   const onEditCommunityPost = (postId) => {
    //     navigate(`/boards/${COMMUNITY_BOARD_ID}/free/${postId}/edit`);
    //   };

    // ✅ 비밀번호 변경
    const onChangePasswordClick = () => navigate('/me/change/password');

    // ✅ 로그아웃도 마이페이지 버튼이 있으면 연결
    const onLogout = () => {
        localStorage.removeItem('AccessToken');
        navigate('/');
    };

    return (
        <UserProfile
            onNavigate={onNavigate}
            onFollowersClick={onFollowersClick}
            onFollowingClick={onFollowingClick}
            onRecipeClick={onRecipeClick}
            // onCommunityPostClick={onCommunityPostClick}
            onEditRecipe={onEditRecipe}
            // onEditCommunityPost={onEditCommunityPost}
            onChangePasswordClick={onChangePasswordClick}
            onLogout={onLogout}
        />
    );
}
