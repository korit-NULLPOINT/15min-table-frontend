import { useNavigate, useParams } from 'react-router-dom';
import { CommunityWrite } from '../../../../components/community/CommunityWrite';
import { addPost } from '../../../../apis/generated/post-controller/post-controller';

export default function FreeWritePage() {
    const { boardId } = useParams();
    const navigate = useNavigate();

    const onNavigate = (key) => {
        if (key === 'community') navigate(`/board/${boardId}/free`);
    };

    const handleWriteSubmit = async (data) => {
        try {
            await addPost({ boardId: Number(boardId), data });
            alert('게시글이 등록되었습니다.');
            navigate(`/board/${boardId}/free`);
        } catch (err) {
            console.error(err);
            alert('게시글 등록 실패');
        }
    };

    return (
        <CommunityWrite onNavigate={onNavigate} onSubmit={handleWriteSubmit} />
    );
}
