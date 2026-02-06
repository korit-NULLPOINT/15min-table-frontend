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
    Fade,
    Slide,
} from '@mui/material';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useQueryClient } from '@tanstack/react-query';
import { usePrincipalState } from '../../store/usePrincipalState';
import {
    addRecipeComment,
    addPostComment,
    deleteComment,
    getGetRecipeCommentListByTargetQueryKey,
    getGetPostCommentListByTargetQueryKey,
} from '../../apis/generated/comment-controller/comment-controller';
import { formatDate } from '../../utils/formatDate';
import { shake } from '../../styles/animations';

/**
 * 통합 Comment 컴포넌트
 * Recipe와 Community(Post) 댓글 기능을 하나로 통합
 *
 * @param {'RECIPE' | 'POST'} targetType - 댓글 대상 타입
 * @param {number} targetId - recipeId 또는 postId
 * @param {Array} comments - 댓글 목록
 * @param {Function} onOpenAuth - 비로그인 시 모달 열기
 * @param {Function} onNavigate - 네비게이션 함수 (프로필 이동 등)
 * @param {string} containerBgColor - 컨테이너 배경색 (기본: #ffffff)
 * @param {number} elevation - Paper elevation (기본: 3)
 * @param {boolean} showBorder - border/borderRadius 표시 여부 (기본: true)
 */
export default function Comment({
    targetType,
    targetId,
    comments = [],
    onOpenAuth,
    onNavigate,
    containerBgColor = '#ffffff',
    elevation = 3,
    showBorder = true,
}) {
    const [newComment, setNewComment] = useState('');
    const [showEmptyWarning, setShowEmptyWarning] = useState(false);
    const [showAuthAlert, setShowAuthAlert] = useState(false);
    const [shakingCommentId, setShakingCommentId] = useState(null);
    const textareaRef = useRef(null);

    const { principal } = usePrincipalState();
    const isLoggedIn = !!principal;
    const queryClient = useQueryClient();

    // Empty warning 자동 숨김
    useEffect(() => {
        if (!showEmptyWarning) return;
        const timer = setTimeout(() => setShowEmptyWarning(false), 2000);
        return () => clearTimeout(timer);
    }, [showEmptyWarning]);

    // Auth alert 자동 숨김 + 프로필 이동
    useEffect(() => {
        if (!showAuthAlert) return;
        const timer = setTimeout(() => {
            setShowAuthAlert(false);
            onNavigate?.('profile');
        }, 2000);
        return () => clearTimeout(timer);
    }, [showAuthAlert, onNavigate]);

    // API 함수 선택
    const addCommentApi =
        targetType === 'RECIPE' ? addRecipeComment : addPostComment;
    const getQueryKey =
        targetType === 'RECIPE'
            ? getGetRecipeCommentListByTargetQueryKey
            : getGetPostCommentListByTargetQueryKey;

    // 댓글 작성
    const handleCommentSubmit = async () => {
        if (!isLoggedIn || !principal) {
            alert('로그인이 필요합니다.');
            onOpenAuth?.();
            return;
        }

        // 권한 검증 (roleId 1 또는 2)
        const hasValidRole =
            principal.userRoles?.filter(
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
            await addCommentApi(targetId, { content: newComment });
            setNewComment('');
            await queryClient.invalidateQueries({
                queryKey: getQueryKey(targetId),
            });
        } catch (error) {
            console.error('Failed to add comment:', error);
            alert('댓글 등록 중 오류가 발생했습니다.');
        }
    };

    // 댓글 삭제
    const handleCommentDelete = async (commentId) => {
        // shake 애니메이션
        setShakingCommentId(commentId);
        await new Promise((resolve) => setTimeout(resolve, 400));
        setShakingCommentId(null);

        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            await deleteComment(commentId);
            await queryClient.invalidateQueries({
                queryKey: getQueryKey(targetId),
            });
        } catch (error) {
            console.error('Failed to delete comment:', error);
            alert('댓글 삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <Paper
            elevation={elevation}
            sx={{
                p: 4,
                mt: 2,
                bgcolor: containerBgColor,
                border: showBorder ? '2px solid #e5dfd5' : 'none',
                borderRadius: showBorder ? 2 : 0,
            }}
        >
            <Typography
                variant="h5"
                sx={{ mb: 2, color: '#3d3226', fontWeight: 'bold' }}
            >
                댓글 {comments.length > 0 && `(${comments.length})`}
            </Typography>

            {/* 댓글 목록 */}
            <Stack spacing={3} sx={{ mb: 4 }}>
                {comments.length === 0 ? (
                    <Box
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            color: 'text.secondary',
                        }}
                    >
                        작성된 댓글이 없습니다.
                    </Box>
                ) : (
                    comments.map((comment) => {
                        const isMine = principal?.userId === comment.userId;
                        const commentId = comment.commentId || comment.id;
                        const isShaking = shakingCommentId === commentId;

                        return (
                            <Box
                                key={commentId}
                                sx={{ display: 'flex', gap: 2 }}
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
                                                        commentId,
                                                    )
                                                }
                                                size="small"
                                                sx={{
                                                    color: '#ef4444',
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
                    })
                )}
            </Stack>

            {/* 댓글 입력 영역 */}
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

                {/* 빈 댓글 경고 */}
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

                    {/* 미인증 계정 Alert */}
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
