import { useNavigate, useParams } from 'react-router-dom';
import { CommunityList } from '../../../../components/community/CommunityList';
import { Box, Container, Button } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import EditIcon from '@mui/icons-material/Edit';

export default function FreeListPage() {
    const { boardId } = useParams();
    const navigate = useNavigate();

    const handlePostClick = (postId) => {
        navigate(`/board/${boardId}/free/${postId}`);
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
                        onClick={() => navigate('/')}
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
                        메인으로 돌아가기
                    </Button>

                    <Button
                        startIcon={<EditIcon fontSize="small" />}
                        onClick={() => navigate(`/board/${boardId}/free/write`)}
                        sx={{
                            width: '120px',
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
                            justifyContent: 'space-evenly',
                        }}
                    >
                        글쓰기
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
                    <CommunityList onPostClick={handlePostClick} />
                </Box>
            </Container>
        </Box>
    );
}
