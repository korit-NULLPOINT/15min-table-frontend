import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    TableSortLabel,
    TableRow,
    TableCell,
    Typography,
    Box,
    Avatar,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { AdminManagementLayout } from './common/AdminManagementLayout';
import { ActionConfirmButton } from './common/ActionConfirmButton';
import { getAdminPostList } from '../../apis/generated/manage-controller/manage-controller';
import { useDeletePost } from '../../apis/generated/post-controller/post-controller';
import { formatDate } from '../../utils/formatDate';

export function CommunityManagement() {
    const FREE_BOARD_ID = 2;
    const SIZE = 20;
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { ref, inView } = useInView();

    const [searchQuery, setSearchQuery] = useState('');
    const [confirmingId, setConfirmingId] = useState(null);
    const [sortConfig, setSortConfig] = useState({
        key: 'createDt',
        direction: 'desc',
    });

    // API Hooks
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isPostLoading,
        error,
    } = useInfiniteQuery({
        queryKey: ['admin-posts', searchQuery, sortConfig],
        queryFn: ({ pageParam }) => {
            const { cursorId, cursorCreateDt, cursorViewCount } =
                pageParam || {};
            return getAdminPostList({
                size: SIZE,
                keyword: searchQuery || undefined,
                sortKey: sortConfig.key,
                sortBy: sortConfig.direction,
                cursorId,
                cursorCreateDt,
                cursorViewCount,
            });
        },
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
            const responseData = lastPage?.data?.data;
            if (!responseData || responseData.length < SIZE) return undefined;

            const lastItem = responseData[responseData.length - 1];
            return {
                cursorId: lastItem.postId,
                cursorCreateDt: lastItem.createDt,
                cursorViewCount: lastItem.viewCount,
            };
        },
    });

    const { mutate: deletePost } = useDeletePost({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
                setConfirmingId(null);
            },
            onError: (err) => {
                console.error('Delete failed:', err);
                toast.error('게시글 삭제에 실패했습니다.');
                setConfirmingId(null);
            },
        },
    });

    // Infinite Scroll Effect
    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    // Flatten data for display
    const posts = useMemo(() => {
        return data?.pages.flatMap((page) => page.data?.data || []) || [];
    }, [data]);

    // Since we are using API-side sorting now, we don't need client-side sort logic.
    const sortedPosts = posts;

    const handleSort = (key) => {
        setSortConfig((prev) => {
            const isAsc = prev.key === key && prev.direction === 'asc';
            return {
                key,
                direction: isAsc ? 'desc' : 'asc',
            };
        });
    };

    const handleDelete = (postId) => {
        deletePost({ boardId: FREE_BOARD_ID, postId });
    };

    const tableHead = (
        <TableRow>
            <TableCell
                width="25%"
                align="center"
                sx={{
                    backgroundColor: '#3d3226',
                    color: '#f5f1eb',
                    fontWeight: 'bold',
                    pl: '2.5%',
                }}
            >
                제목
            </TableCell>
            <TableCell
                width="25%"
                align="center"
                sx={{
                    backgroundColor: '#3d3226',
                    color: '#f5f1eb',
                    fontWeight: 'bold',
                }}
            >
                작성자
            </TableCell>
            <TableCell
                width="15%"
                align="center"
                sx={{
                    backgroundColor: '#3d3226',
                    color: '#f5f1eb',
                    fontWeight: 'bold',
                }}
            >
                <TableSortLabel
                    active={sortConfig.key === 'createDt'}
                    direction={
                        sortConfig.key === 'createDt'
                            ? sortConfig.direction
                            : 'asc'
                    }
                    onClick={() => handleSort('createDt')}
                    sx={{
                        '&.MuiTableSortLabel-root': { color: '#f5f1eb' },
                        '&.MuiTableSortLabel-root:hover': { color: '#d4cbbf' },
                        '&.Mui-active': { color: '#f5f1eb' },
                        '& .MuiTableSortLabel-icon': {
                            color: '#f5f1eb !important',
                            opacity: 0.5,
                        },
                        '&.Mui-active .MuiTableSortLabel-icon': { opacity: 1 },
                    }}
                >
                    작성일
                </TableSortLabel>
            </TableCell>
            <TableCell
                width="10%"
                align="center"
                sx={{
                    backgroundColor: '#3d3226',
                    color: '#f5f1eb',
                    fontWeight: 'bold',
                }}
            >
                <TableSortLabel
                    active={sortConfig.key === 'viewCount'}
                    direction={
                        sortConfig.key === 'viewCount'
                            ? sortConfig.direction
                            : 'asc'
                    }
                    onClick={() => handleSort('viewCount')}
                    sx={{
                        '&.MuiTableSortLabel-root': { color: '#f5f1eb' },
                        '&.MuiTableSortLabel-root:hover': { color: '#d4cbbf' },
                        '&.Mui-active': { color: '#f5f1eb' },
                        '& .MuiTableSortLabel-icon': {
                            color: '#f5f1eb !important',
                            opacity: 0.5,
                        },
                        '&.Mui-active .MuiTableSortLabel-icon': { opacity: 1 },
                    }}
                >
                    조회수
                </TableSortLabel>
            </TableCell>
            <TableCell
                width="10%"
                align="center"
                sx={{
                    backgroundColor: '#3d3226',
                    color: '#f5f1eb',
                    fontWeight: 'bold',
                }}
            >
                댓글수
            </TableCell>
            <TableCell
                width="10%"
                align="center"
                sx={{
                    backgroundColor: '#3d3226',
                    color: '#f5f1eb',
                    fontWeight: 'bold',
                    pr: '2.5%',
                }}
            >
                작업
            </TableCell>
        </TableRow>
    );

    const tableBody = sortedPosts.map((post) => (
        <TableRow
            key={post.postId}
            hover
            sx={{
                '&:hover': {
                    backgroundColor: '#f5f1eb',
                },
            }}
        >
            <TableCell width="25%" align="left" sx={{ pl: '2.5%' }}>
                <Typography
                    noWrap
                    title={post.title}
                    onClick={() => {
                        navigate(`/board/${FREE_BOARD_ID}/free/${post.postId}`);
                    }}
                    sx={{
                        color: '#3d3226',
                        cursor: 'pointer',
                        '&:hover': {
                            textDecoration: 'underline',
                        },
                    }}
                >
                    {post.title}
                </Typography>
            </TableCell>
            <TableCell width="25%" align="center" sx={{ color: '#6b5d4f' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                    }}
                >
                    <Avatar
                        src={
                            post.profileImgUrl ||
                            `https://picsum.photos/seed/${post.userId}/200`
                        }
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: '#d4cbbf',
                        }}
                    >
                        {post.username?.[0]}
                    </Avatar>
                    <Typography variant="body2" noWrap>
                        {post.username}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell width="15%" align="center" sx={{ color: '#6b5d4f' }}>
                {formatDate(post.createDt)}
            </TableCell>
            <TableCell width="10%" align="center" sx={{ color: '#6b5d4f' }}>
                {(post.viewCount || 0).toLocaleString()}
            </TableCell>
            <TableCell width="10%" align="center" sx={{ color: '#6b5d4f' }}>
                {(post.commentCount || 0).toLocaleString()}
            </TableCell>
            <TableCell width="10%" align="center" sx={{ pr: '2.5%' }}>
                <ActionConfirmButton
                    id={post.postId}
                    onConfirm={() => handleDelete(post.postId)}
                    confirmingId={confirmingId}
                    setConfirmingId={setConfirmingId}
                    icon={<DeleteIcon fontSize="small" />}
                    title="삭제"
                    message="정말 삭제하시겠습니까?"
                    color="error"
                />
            </TableCell>
        </TableRow>
    ));

    return (
        <AdminManagementLayout
            title="커뮤니티 관리"
            description="커뮤니티 게시글 삭제 관리"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPlaceholder="제목 또는 작성자로 검색"
            tableHead={tableHead}
            tableBody={tableBody}
            isLoading={isPostLoading}
            error={error}
            isEmpty={sortedPosts.length === 0 && !isPostLoading}
            observerRef={ref}
            isFetchingNextPage={isFetchingNextPage}
        />
    );
}
