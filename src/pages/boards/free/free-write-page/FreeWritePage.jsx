import { useNavigate, useParams } from 'react-router-dom';
import { CommunityWrite } from '../../../../components/community/CommunityWrite';

export default function FreeWritePage() {
    const { boardId } = useParams();
    const navigate = useNavigate();

    const onNavigate = (key) => {
        if (key === 'community') navigate(`/boards/${boardId}/free`);
    };

    // CommunityWrite가 등록 완료 시 콜백을 지원하면 여기에 붙이고,
    // 지원 안 하면 내부에서 onNavigate로 목록으로 가게만 맞춰도 됨.
    const onSubmitSuccess = () => {
        navigate(`/boards/${boardId}/free`);
    };

    return (
        <CommunityWrite
            onNavigate={onNavigate}
            onSubmitSuccess={onSubmitSuccess}
        />
    );
}
