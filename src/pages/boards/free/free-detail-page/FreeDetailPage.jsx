import { useNavigate, useParams } from 'react-router-dom';
import { CommunityDetail } from '../../../../components/community/CommunityDetail';

export default function FreeDetailPage() {
    const { boardId, freeId } = useParams();
    const navigate = useNavigate();

    const onNavigate = (key) => {
        if (key === 'community') navigate(`/board/${boardId}/free`);
    };

    return (
        <>
            <CommunityDetail
                postId={freeId}
                boardId={boardId}
                onNavigate={onNavigate}
            />
        </>
    );
}
