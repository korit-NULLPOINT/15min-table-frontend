// src/pages/users/other-user-profile-page/OtherUserProfilePage.jsx
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OtherUserProfile } from '../../../components/user-profile/OtherUserProfile';

const RECIPE_BOARD_ID = 1;
const COMMUNITY_BOARD_ID = 2;

export default function OtherUserProfilePage() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const parsedUserId = useMemo(() => {
        const n = Number(userId);
        return Number.isNaN(n) ? null : n;
    }, [userId]);

    const onNavigate = (key) => {
        if (key === 'home') navigate('/');
        if (key === 'profile') navigate('/me');
        if (key === 'back') navigate(-1);
    };

    if (parsedUserId === null) {
        return (
            <div className="min-h-screen bg-[#f5f1eb] pt-20">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] p-8">
                        <h1 className="text-2xl text-[#3d3226] font-serif">
                            잘못된 사용자 접근
                        </h1>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-4 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
                        >
                            뒤로가기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const onRecipeClick = (recipeId) => {
        navigate(`/boards/${RECIPE_BOARD_ID}/recipe/${recipeId}`);
    };

    const onCommunityPostClick = (postId) => {
        navigate(`/boards/${COMMUNITY_BOARD_ID}/free/${postId}`);
    };

    return (
        <OtherUserProfile
            userId={parsedUserId}
            onNavigate={onNavigate}
            onRecipeClick={onRecipeClick}
            onCommunityPostClick={onCommunityPostClick}
            // ✅ 추후: 여기서 userId로 fetch해서 username 넣을 예정
            // username={fetchedUsername}
        />
    );
}
