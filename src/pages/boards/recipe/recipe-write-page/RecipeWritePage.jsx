import { useNavigate, useParams } from 'react-router-dom';
import { RecipeWrite } from '../../../../components/recipe/RecipeWrite';

export default function RecipeWritePage() {
    const { boardId } = useParams();
    const navigate = useNavigate();

    // 기존 RecipeWrite가 onNavigate를 받는 구조였으니 최소로 매핑
    const onNavigate = (pageKey) => {
        if (pageKey === 'board') navigate(`/boards/${boardId}/recipe`);
        if (pageKey === 'home') navigate(`/`);
        if (pageKey === 'profile') navigate(`/me`);
    };

    return <RecipeWrite onNavigate={onNavigate} />;
}
