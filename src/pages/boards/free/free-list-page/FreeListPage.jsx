import { useNavigate, useParams } from 'react-router-dom';
import { Community } from '../../../../components/community/Community';

export default function FreeListPage() {
    const { boardId } = useParams();
    const navigate = useNavigate();

    const onNavigate = (key) => {
        if (key === 'home') navigate('/'); // 또는 원하는 메인 경로로
        if (key === 'communityWrite') navigate(`/board/${boardId}/free/write`);
    };

    const onPostClick = (freeId) => {
        navigate(`/board/${boardId}/free/${freeId}`);
    };

    return <Community onNavigate={onNavigate} onPostClick={onPostClick} />;
}
