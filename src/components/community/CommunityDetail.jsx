import { useState, useEffect, Fragment } from 'react';
import {
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
import { CommunityHeader } from './CommunityHeader';
import { ScrollIndicatorWrapper } from '../common/ScrollIndicatorWrapper';
import {
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
import { formatDate } from '../../utils/formatDate';

export function CommunityDetail({
    postId,
    boardId,
    onNavigate,
    onIsOwnerFetched,
}) {
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
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Notify parent of ownership
    useEffect(() => {
        if (post && principal && onIsOwnerFetched) {
            onIsOwnerFetched(principal.username === post.username);
        }
    }, [post, principal, onIsOwnerFetched]);

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

    if (isPostLoading) {
        return (
            <Box
                sx={{
                    flex: 1,
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
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">
                    게시글을 찾을 수 없습니다.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: 2,
                border: '2px solid #e5dfd5',
                overflow: 'hidden',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
            }}
        >
            {/* Fixed Header */}
            <CommunityHeader title={post.title}>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        fontSize: '0.875rem',
                        color: 'rgba(245, 241, 235, 0.8)',
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
                        {post.username}
                    </Box>
                    <Box>{post.createDt && formatDate(post.createDt)}</Box>
                    <Box>조회 {post.viewCount || 0}</Box>
                </Box>
            </CommunityHeader>

            {/* Scrollable Content Area */}
            <ScrollIndicatorWrapper sx={{ bgcolor: 'white' }}>
                {/* Post Content Body */}
                <Box sx={{ p: 4, flexGrow: 1 }}>
                    <Typography
                        variant="body1"
                        sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
                    >
                        {post.content}
                    </Typography>
                </Box>

                <Divider
                    sx={{
                        borderBottomWidth: 2,
                        borderColor: '#e5dfd5',
                    }}
                />

                {/* Comments Area Container */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: '#ebe5db',
                    }}
                >
                    {/* Comments Section Header */}
                    <Box
                        sx={{
                            px: 3,
                            py: 2,
                            borderBottom: '1px solid #e5dfd5',
                        }}
                    >
                        <Typography variant="h6" sx={{ color: '#3d3226' }}>
                            댓글 {comments.length}
                        </Typography>
                    </Box>

                    <Box sx={{ flex: 1, bgcolor: 'white' }}>
                        <List disablePadding>
                            {comments.map((comment, index) => (
                                <Fragment key={comment.commentId || index}>
                                    <ListItem
                                        alignItems="flex-start"
                                        sx={{ px: 3, py: 2 }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                src={
                                                    comment.profileImgUrl ||
                                                    `https://picsum.photos/seed/${comment.userId}/200`
                                                }
                                                sx={{ bgcolor: '#d4cbbf' }}
                                            />
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
                                                        {comment.username}
                                                    </Typography>
                                                    <Typography
                                                        component="span"
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {formatDate(
                                                            comment.createDt,
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
                                                comment.username && (
                                                <IconButton
                                                    edge="end"
                                                    onClick={() =>
                                                        handleDeleteComment(
                                                            comment.commentId,
                                                        )
                                                    }
                                                    size="small"
                                                    sx={{
                                                        color: '#d32f2f',
                                                        mt: 1,
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                    </ListItem>
                                    {index < comments.length - 1 && (
                                        <Divider component="li" />
                                    )}
                                </Fragment>
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
                    </Box>

                    {/* Comment Input */}
                    <Box
                        sx={{
                            p: 3,
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
                                    '& fieldset': {
                                        borderColor: '#d4cbbf',
                                    },
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
                </Box>
            </ScrollIndicatorWrapper>
        </Paper>
    );
}
