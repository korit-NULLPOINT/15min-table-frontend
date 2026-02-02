import { useNavigate, useParams } from 'react-router-dom';
import { CommunityEdit } from '../../../../components/community/CommunityEdit';

export default function FreeEditPage() {
    const { boardId, freeId } = useParams();
    const navigate = useNavigate();

    const onNavigate = (key) => {
        if (key === 'community') navigate(`/board/${boardId}/free`);
        if (key === 'detail') navigate(`/board/${boardId}/free/${freeId}`);
    };

    return <CommunityEdit postId={freeId} onNavigate={onNavigate} />;
}
