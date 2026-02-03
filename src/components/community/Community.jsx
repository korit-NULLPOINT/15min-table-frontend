import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Box, Button, Container } from '@mui/material';
import { CommunityList } from './CommunityList';
import { CommunityDetail } from './CommunityDetail';
import { CommunityWrite } from './CommunityWrite';

export function Community({ onNavigate: onParentNavigate }) {
    const [view, setView] = useState('list'); // 'list', 'detail', 'write'
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [selectedBoardId, setSelectedBoardId] = useState(null);

    const handlePostClick = (postId, boardId) => {
        setSelectedPostId(postId);
        setSelectedBoardId(boardId);
        setView('detail');
    };

    const handleWriteClick = () => {
        setView('write');
    };

    const handleBackToList = () => {
        setView('list');
    };

    const handleNavigate = (targetView) => {
        if (targetView === 'community') {
            setView('list');
        } else {
            // Forward other navigations to parent if needed,
            // but here we manage community internal views.
            setView(targetView);
        }
    };

    const renderView = () => {
        switch (view) {
            case 'detail':
                return (
                    <CommunityDetail
                        postId={selectedPostId}
                        boardId={selectedBoardId}
                        onNavigate={handleNavigate}
                    />
                );
            case 'write':
                return <CommunityWrite onNavigate={handleNavigate} />;
            case 'list':
            default:
                return (
                    <CommunityList
                        onPostClick={handlePostClick}
                        onWriteClick={handleWriteClick}
                    />
                );
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
                <Box sx={{ mb: 2, flexShrink: 0 }}>
                    <Button
                        startIcon={<ArrowLeft />}
                        onClick={() => {
                            if (view === 'list') {
                                if (onParentNavigate) {
                                    onParentNavigate('home');
                                }
                            } else {
                                setView('list');
                            }
                        }}
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
                        {view === 'list'
                            ? '메인으로 돌아가기'
                            : '목록으로 돌아가기'}
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
                    {renderView()}
                </Box>
            </Container>
        </Box>
    );
}
