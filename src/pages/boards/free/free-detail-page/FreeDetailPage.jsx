import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CommunityDetail } from '../../../../components/community/CommunityDetail';
import { Box, Container, Button } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import EditDocumentIcon from '@mui/icons-material/EditDocument';

export default function FreeDetailPage() {
    const { boardId, freeId } = useParams();
    const navigate = useNavigate();
    const [isOwner, setIsOwner] = useState(false);

    const onNavigate = (target) => {
        if (target === 'community' || target === 'list') {
            navigate(`/b/${boardId}/free`);
        }
    };

    const handleEditClick = () => {
        navigate(`/b/${boardId}/free/${freeId}/edit`);
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

                    {isOwner && (
                        <Button
                            startIcon={<EditDocumentIcon fontSize="small" />}
                            onClick={handleEditClick}
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
                            수정
                        </Button>
                    )}
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <CommunityDetail
                        postId={freeId}
                        boardId={boardId}
                        onNavigate={onNavigate}
                        onIsOwnerFetched={setIsOwner}
                    />
                </Box>
            </Container>
        </Box>
    );
}
