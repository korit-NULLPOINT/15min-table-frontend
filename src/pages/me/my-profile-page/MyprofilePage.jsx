import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../../../components/user-profile/UserProfile';

const RECIPE_BOARD_ID = 1;

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

    const onFollowersClick = () => navigate('/me/followers');
    const onFollowingClick = () => navigate('/me/following');

    const onRecipeClick = (recipeId) => {
        navigate(`/boards/${RECIPE_BOARD_ID}/recipe/${recipeId}`);
    };

    const onEditRecipe = (recipeId) => {
        navigate(`/boards/${RECIPE_BOARD_ID}/recipe/${recipeId}/edit`);
    };

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
            onEditRecipe={onEditRecipe}
            onLogout={onLogout}
        />
    );
}
