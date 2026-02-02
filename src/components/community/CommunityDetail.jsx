import React, { useState } from 'react';
import {
    Container,
    Box,
    Button,
    Typography,
    Paper,
    Divider,
    TextField,
    Avatar,
    IconButton,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { useGetPostDetail } from '../../apis/generated/post-controller/post-controller';
import {
    useGetPostCommentListByTarget,
    useAddPostComment,
    useDeleteComment,
} from '../../apis/generated/comment-controller/comment-controller';
import { usePrincipalState } from '../../store/usePrincipalState';

export function CommunityDetail({ postId, boardId, onNavigate }) {
    const [newComment, setNewComment] = useState('');
    const queryClient = useQueryClient();
    const principal = usePrincipalState((s) => s.principal);

    // API Hooks
    const { data: postData, isLoading: isPostLoading } = useGetPostDetail(
        Number(boardId),
        Number(postId),
    );

    const { data: commentsData, isLoading: isCommentsLoading } =
        useGetPostCommentListByTarget(Number(postId));

    const { mutate: addComment } = useAddPostComment();
    const { mutate: deleteComment } = useDeleteComment();

    const post = postData?.data?.data;
    const comments = commentsData?.data?.data || [];

    // Scroll to top on mount
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Handlers
    const handleSubmitComment = () => {
        if (!newComment.trim()) return;

        addComment(
            { postId: Number(postId), data: { content: newComment } },
            {
                onSuccess: () => {
                    setNewComment('');
                    queryClient.invalidateQueries([
                        `/comment/list/post/${postId}`,
                    ]);
                },
                onError: (err) => {
                    console.error('댓글 작성 실패:', err);
                    alert('댓글 작성에 실패했습니다.');
                },
            },
        );
    };

    const handleDeleteComment = (commentId) => {
        if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

        deleteComment(
            { commentId },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries([
                        `/comment/list/post/${postId}`,
                    ]);
                },
                onError: (err) => {
                    console.error('댓글 삭제 실패:', err);
                    alert('댓글 삭제에 실패했습니다.');
                },
            },
        );
    };

    // Formatter
    const formatDate = (dateString, timeString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        let formatted = d.toLocaleDateString();
        if (timeString) {
            formatted += ` ${timeString}`;
        }
        return formatted;
    };

    if (isPostLoading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CircularProgress sx={{ color: '#3d3226' }} />
            </Box>
        );
    }

    if (!post) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Box sx={{ mb: 3, pt: 6 }}>
                    <Button
                        startIcon={<ArrowLeft />}
                        onClick={() => {
                            if (onNavigate) {
                                onNavigate('community');
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
                        메인으로 돌아가기
                    </Button>
                </Box>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                        게시글을 찾을 수 없습니다.
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f1eb', pt: 14, pb: 8 }}>
            <Container maxWidth="md">
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => onNavigate('community')}
                    sx={{
                        mb: 3,
                        color: '#3d3226',
                        borderColor: '#3d3226',
                        '&:hover': {
                            backgroundColor: 'rgba(61, 50, 38, 0.04)',
                        },
                    }}
                    variant="outlined"
                >
                    목록으로 돌아가기
                </Button>

                {/* Post Content */}
                <Paper
                    elevation={0}
                    sx={{
                        mb: 4,
                        border: '1px solid #e5dfd5',
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: '#3d3226',
                            color: '#f5f1eb',
                            px: 4,
                            py: 3,
                        }}
                    >
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            {post.title}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                fontSize: '0.875rem',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                <PersonIcon fontSize="small" />
                                {post.author}
                            </Box>
                            <Box>
                                {post.createdAt && formatDate(post.createdAt)}
                            </Box>
                            <Box>조회 {post.viewCount || 0}</Box>
                        </Box>
                    </Box>

                    <Box sx={{ p: 4, minHeight: 200 }}>
                        <Typography
                            variant="body1"
                            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
                        >
                            {post.content}
                        </Typography>
                    </Box>
                </Paper>

                {/* Comments Section */}
                <Paper variant="outlined" sx={{ borderColor: '#e5dfd5' }}>
                    <Box
                        sx={{
                            bgcolor: '#ebe5db',
                            px: 3,
                            py: 2,
                            borderBottom: '1px solid #e5dfd5',
                        }}
                    >
                        <Typography variant="h6" sx={{ color: '#3d3226' }}>
                            댓글 {comments.length}
                        </Typography>
                    </Box>

                    <List disablePadding>
                        {comments.map((comment, index) => (
                            <React.Fragment key={comment.commentId || index}>
                                <ListItem
                                    alignItems="flex-start"
                                    sx={{ px: 3, py: 2 }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: '#d4cbbf' }}>
                                            <PersonIcon
                                                sx={{ color: '#3d3226' }}
                                            />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box
                                                component="span"
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Typography
                                                    component="span"
                                                    variant="subtitle2"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        color: '#3d3226',
                                                    }}
                                                >
                                                    {comment.author}
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {formatDate(
                                                        comment.createdAt,
                                                    )}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                sx={{
                                                    display: 'block',
                                                    mt: 0.5,
                                                    color: '#3d3226',
                                                }}
                                            >
                                                {comment.content}
                                            </Typography>
                                        }
                                    />
                                    {principal &&
                                        principal.username ===
                                            comment.author && (
                                            <IconButton
                                                edge="end"
                                                onClick={() =>
                                                    handleDeleteComment(
                                                        comment.commentId,
                                                    )
                                                }
                                                size="small"
                                                sx={{ color: '#d32f2f', mt: 1 }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                </ListItem>
                                {index < comments.length - 1 && (
                                    <Divider component="li" />
                                )}
                            </React.Fragment>
                        ))}
                        {comments.length === 0 && (
                            <Box
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    color: 'text.secondary',
                                }}
                            >
                                작성된 댓글이 없습니다.
                            </Box>
                        )}
                    </List>

                    {/* Comment Input */}
                    <Box
                        sx={{
                            p: 3,
                            bgcolor: '#ebe5db',
                            borderTop: '1px solid #e5dfd5',
                        }}
                    >
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="댓글을 입력하세요..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            sx={{
                                bgcolor: 'white',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#d4cbbf' },
                                    '&:hover fieldset': {
                                        borderColor: '#3d3226',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#3d3226',
                                    },
                                },
                            }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mt: 2,
                            }}
                        >
                            <Button
                                variant="contained"
                                disabled={!newComment.trim()}
                                onClick={handleSubmitComment}
                                sx={{
                                    bgcolor: '#3d3226',
                                    '&:hover': { bgcolor: '#5d4a36' },
                                }}
                            >
                                댓글 작성
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
