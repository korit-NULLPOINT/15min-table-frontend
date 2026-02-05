import { useNavigate, useParams } from 'react-router-dom';
import { CommunityWrite } from '../../../../components/community/CommunityWrite';
import { addPost } from '../../../../apis/generated/post-controller/post-controller';
import { Box, Container, Button } from '@mui/material';
import { ArrowLeft } from 'lucide-react';

export default function FreeWritePage() {
    const { boardId } = useParams();
    const navigate = useNavigate();

    const onNavigate = (key) => {
        if (key === 'community' || key === 'list') {
            navigate(`/board/${boardId}/free`);
        }
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
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                py: 3,
                px: 3,
            }}
        >
            <Container
                maxWidth="lg"
                disableGutters
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0,
                }}
            >
                <Box
                    sx={{
                        px: 0.5,
                        mb: 2,
                        flexShrink: 0,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        startIcon={<ArrowLeft />}
                        onClick={() => navigate(-1)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 2,
                            py: 1,
                            border: '2px solid #3d3226',
                            color: '#3d3226',
                            borderRadius: '0.375rem',
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: '#3d3226',
                                color: '#f5f1eb',
                            },
                        }}
                    >
                        이전으로 돌아가기
                    </Button>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <CommunityWrite
                        onNavigate={onNavigate}
                        onSubmit={handleWriteSubmit}
                    />
                </Box>
            </Container>
        </Box>
    );
}
