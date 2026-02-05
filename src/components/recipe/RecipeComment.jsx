import { useState, useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import {
    Alert,
    Box,
    Paper,
    Typography,
    Stack,
    TextField,
    Button,
    IconButton,
    Avatar,
    Fade,
    Slide,
} from '@mui/material';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useQueryClient } from '@tanstack/react-query';
import { usePrincipalState } from '../../store/usePrincipalState';
import {
    addRecipeComment,
    deleteComment,
    getGetRecipeCommentListByTargetQueryKey,
} from '../../apis/generated/comment-controller/comment-controller';
import { formatDate } from '../../apis/utils/formatDate';
import { shake } from '../../styles/animations';

export default function RecipeComment({
    comments,
    onOpenAuth,
    onNavigate,
    recipeDetail,
}) {
    const [newComment, setNewComment] = useState('');
    const [showEmptyWarning, setShowEmptyWarning] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        let timer;
        if (showEmptyWarning) {
            timer = setTimeout(() => {
                setShowEmptyWarning(false);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [showEmptyWarning]);

    const [showAuthAlert, setShowAuthAlert] = useState(false);

    useEffect(() => {
        let timer;
        if (showAuthAlert) {
            timer = setTimeout(() => {
                setShowAuthAlert(false);
                onNavigate('profile');
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [showAuthAlert, onNavigate]);

    const { principal } = usePrincipalState();
    const isLoggedIn = !!principal;
    const queryClient = useQueryClient();

    const handleCommentSubmit = async () => {
        if (!isLoggedIn || !principal) {
            alert('잘못된 접근 입니다.');
            if (onOpenAuth) onOpenAuth();
            return;
        }

        const hasValidRole =
            principal.userRoles.filter(
                (role) => role.roleId === 1 || role.roleId === 2,
            ).length > 0;

        if (!hasValidRole) {
            setShowAuthAlert(true);
            return;
        }

        if (newComment.trim() === '') {
            setShowEmptyWarning(true);
            textareaRef.current?.focus();
            return;
        }

        try {
            await addRecipeComment(recipeDetail.recipeId, {
                content: newComment,
            });
            setNewComment('');
            await queryClient.invalidateQueries({
                queryKey: getGetRecipeCommentListByTargetQueryKey(
                    recipeDetail.recipeId,
                ),
            });
        } catch (error) {
            console.error('Failed to add comment:', error);
            alert('댓글 등록 중 오류가 발생했습니다.');
        }
    };

    const [shakingCommentId, setShakingCommentId] = useState(null);

    const handleCommentDelete = async (commentId) => {
        setShakingCommentId(commentId);
        await new Promise((resolve) => setTimeout(resolve, 400));
        setShakingCommentId(null);

        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await deleteComment(commentId);
            await queryClient.invalidateQueries({
                queryKey: getGetRecipeCommentListByTargetQueryKey(
                    recipeDetail.recipeId,
                ),
            });
        } catch (error) {
            console.error('Failed to delete comment:', error);
            alert('댓글 삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                mt: 4,
                bgcolor: '#ffffff',
                border: '2px solid #e5dfd5',
                borderRadius: 2,
            }}
        >
            <Typography
                variant="h5"
                sx={{ mb: 2, color: '#3d3226', fontWeight: 'bold' }}
            >
                댓글
            </Typography>

            <Stack spacing={3} sx={{ mb: 4 }}>
                {comments &&
                    comments.map((comment) => {
                        const isMine = principal?.userId === comment.userId;
                        const isShaking =
                            shakingCommentId ===
                            (comment.commentId || comment.id);

                        return (
                            <Box
                                key={comment.commentId || comment.id}
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                }}
                            >
                                {/* Avatar */}
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        bgcolor: '#3d3226',
                                    }}
                                >
                                    <ImageWithFallback
                                        src={
                                            comment.profileImgUrl ||
                                            `https://picsum.photos/seed/${comment.userId}/200`
                                        }
                                        alt={String(comment.userId)}
                                        className="w-full h-full object-cover"
                                    />
                                </Box>

                                {/* Content */}
                                <Box sx={{ flex: 1 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            mb: 0.5,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#3d3226',
                                                    lineHeight: 1.2,
                                                }}
                                            >
                                                {comment.username}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: '#9c9489' }}
                                            >
                                                {formatDate(comment.createDt)}
                                            </Typography>
                                        </Box>

                                        {isMine && (
                                            <IconButton
                                                onClick={() =>
                                                    handleCommentDelete(
                                                        comment.commentId ||
                                                            comment.id,
                                                    )
                                                }
                                                size="small"
                                                sx={{
                                                    color: isShaking
                                                        ? '#ef4444'
                                                        : '#ef4444',
                                                    '&:hover': {
                                                        bgcolor:
                                                            'rgba(239, 68, 68, 0.1)',
                                                        color: '#b91c1c',
                                                    },
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        animation: isShaking
                                                            ? `${shake} 0.4s ease-in-out`
                                                            : 'none',
                                                    }}
                                                >
                                                    <Trash2 size={18} />
                                                </Box>
                                            </IconButton>
                                        )}
                                    </Box>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: '#6b5d4f',
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {comment.content}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
            </Stack>

            {/* Input Area */}
            <Box sx={{ position: 'relative', mt: 2 }}>
                <TextField
                    inputRef={textareaRef}
                    value={newComment}
                    onChange={(e) => {
                        setNewComment(e.target.value);
                        if (showEmptyWarning) setShowEmptyWarning(false);
                    }}
                    placeholder="댓글을 입력하세요..."
                    multiline
                    minRows={3}
                    fullWidth
                    variant="outlined"
                    sx={{
                        bgcolor: '#ffffff',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#d4cbbf',
                                borderWidth: 2,
                            },
                            '&:hover fieldset': { borderColor: '#3d3226' },
                            '&.Mui-focused fieldset': {
                                borderColor: '#3d3226',
                            },
                        },
                    }}
                />

                {/* Empty Warning Tooltip (Custom) */}
                <Fade in={showEmptyWarning} mountOnEnter unmountOnExit>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'rgba(61, 50, 38, 0.9)',
                            color: '#f5f1eb',
                            px: 3,
                            py: 1.5,
                            borderRadius: 4,
                            boxShadow: 4,
                            zIndex: 10,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            pointerEvents: 'none',
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>✍️</span>
                        <Typography variant="body2" fontWeight="bold">
                            댓글 내용을 입력해주세요.
                        </Typography>
                    </Box>
                </Fade>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 2,
                    }}
                >
                    <Button
                        onClick={handleCommentSubmit}
                        variant="contained"
                        sx={{
                            bgcolor: '#3d3226',
                            color: '#f5f1eb',
                            py: 1.5,
                            px: 3,
                            fontWeight: 'bold',
                            '&:hover': { bgcolor: '#5c4c40' },
                        }}
                    >
                        댓글 작성
                    </Button>

                    <Slide
                        direction="up"
                        in={showAuthAlert}
                        mountOnEnter
                        unmountOnExit
                    >
                        <Alert
                            severity="warning"
                            variant="filled"
                            sx={{
                                bgcolor: '#d97706',
                                borderRadius: 2,
                                color: '#fff',
                                '& .MuiAlert-icon': { color: '#fff' },
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <Typography variant="body2" fontWeight="bold">
                                    미인증 계정입니다.
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'rgba(255,255,255,0.8)' }}
                                >
                                    2초 후 프로필 이동...
                                </Typography>
                            </Box>
                        </Alert>
                    </Slide>
                </Box>
            </Box>
        </Paper>
    );
}
