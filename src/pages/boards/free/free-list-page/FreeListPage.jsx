import { useNavigate, useParams } from 'react-router-dom';
import { Community } from '../../../../components/Community';

export default function FreeListPage() {
    const { boardId } = useParams();
    const navigate = useNavigate();

    const onNavigate = (key) => {
        if (key === 'home') navigate('/'); // 또는 원하는 메인 경로로
        if (key === 'communityWrite') navigate(`/boards/${boardId}/free/write`);
    };

    const onPostClick = (freeId) => {
        navigate(`/boards/${boardId}/free/${freeId}`);
    };

    return <Community onNavigate={onNavigate} onPostClick={onPostClick} />;
}
