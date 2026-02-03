import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Box, Button, Container } from '@mui/material';
import { CommunityList } from './CommunityList';
import { CommunityDetail } from './CommunityDetail';
import { CommunityWrite } from './CommunityWrite';
import { CommunityEdit } from './CommunityEdit';
import EditIcon from '@mui/icons-material/Edit';
import EditDocumentIcon from '@mui/icons-material/EditDocument';

export function Community({ onNavigate: onParentNavigate }) {
    const [view, setView] = useState('list'); // 'list', 'detail', 'write', 'edit'
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [selectedBoardId, setSelectedBoardId] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

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

    const handleNavigate = (targetView, postId, boardId) => {
        if (targetView === 'community' || targetView === 'list') {
            setIsOwner(false);
            setView('list');
        } else if (targetView === 'edit') {
            if (postId) setSelectedPostId(postId);
            if (boardId) setSelectedBoardId(boardId);
            setView('edit');
        } else if (targetView === 'detail') {
            if (postId) setSelectedPostId(postId);
            setView('detail');
        } else {
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
                        onIsOwnerFetched={setIsOwner}
                    />
                );
            case 'write':
                return <CommunityWrite onNavigate={handleNavigate} />;
            case 'edit':
                return (
                    <CommunityEdit
                        postId={selectedPostId}
                        boardId={selectedBoardId}
                        onNavigate={handleNavigate}
                    />
                );
            case 'list':
            default:
                return <CommunityList onPostClick={handlePostClick} />;
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
                        onClick={() => {
                            if (view === 'list') {
                                if (onParentNavigate) {
                                    onParentNavigate('home');
                                }
                            } else {
                                handleNavigate('list');
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

                    {/* Action Button: Write or Edit */}
                    {(view === 'list' || (view === 'detail' && isOwner)) && (
                        <Button
                            startIcon={
                                view === 'list' ? (
                                    <EditIcon fontSize="small" />
                                ) : (
                                    <EditDocumentIcon fontSize="small" />
                                )
                            }
                            onClick={() => {
                                if (view === 'list') {
                                    handleNavigate('write');
                                } else if (view === 'detail') {
                                    handleNavigate(
                                        'edit',
                                        selectedPostId,
                                        selectedBoardId,
                                    );
                                }
                            }}
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
                            {view === 'list' ? '글쓰기' : '수정'}
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
                    {renderView()}
                </Box>
            </Container>
        </Box>
    );
}
