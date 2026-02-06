import { useNavigate, useParams } from 'react-router-dom';
import { CommunityEdit } from '../../../../components/community/CommunityEdit';
import { Box, Container, Button } from '@mui/material';
import { ArrowLeft } from 'lucide-react';

export default function FreeEditPage() {
    const { boardId, freeId } = useParams();
    const navigate = useNavigate();

    const onNavigate = (key, postId) => {
        if (key === 'community' || key === 'list') {
            navigate(`/b/${boardId}/free`);
        }
        if (key === 'detail') {
            navigate(`/b/${boardId}/free/${postId || freeId}`);
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
                    <CommunityEdit
                        postId={freeId}
                        boardId={boardId}
                        onNavigate={onNavigate}
                    />
                </Box>
            </Container>
        </Box>
    );
}
