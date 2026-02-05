import { useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Divider,
    CircularProgress,
} from '@mui/material';
import { CommunityHeader } from './CommunityHeader';
import { ScrollIndicatorWrapper } from '../common/ScrollIndicatorWrapper';
import Comment from '../common/Comment';
import { Person as PersonIcon } from '@mui/icons-material';
import { useGetPostDetail } from '../../apis/generated/post-controller/post-controller';
import { useGetPostCommentListByTarget } from '../../apis/generated/comment-controller/comment-controller';
import { usePrincipalState } from '../../store/usePrincipalState';
import { formatDate } from '../../utils/formatDate';

export function CommunityDetail({ postId, boardId, onIsOwnerFetched }) {
    const principal = usePrincipalState((s) => s.principal);

    // API Hooks
    const { data: postData, isLoading: isPostLoading } = useGetPostDetail(
        Number(boardId),
        Number(postId),
    );

    const { data: commentsData } = useGetPostCommentListByTarget(
        Number(postId),
    );

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
            <ScrollIndicatorWrapper sx={{ bgcolor: '#faf8f5' }}>
                {/* Post Content Body */}
                <Paper
                    elevation={0}
                    sx={{
                        minHeight: '214px',
                        p: 3,
                        mt: 1,
                        bgcolor: '#faf8f5',
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
                    >
                        {post.content}
                    </Typography>
                </Paper>

                {/* Comments Section - 통합 Comment 컴포넌트 사용 */}
                <Box>
                    <Comment
                        targetType="POST"
                        targetId={Number(postId)}
                        comments={comments}
                        containerBgColor="#ebe5db"
                        elevation={0}
                        showBorder={false}
                    />
                </Box>
            </ScrollIndicatorWrapper>
        </Paper>
    );
}
