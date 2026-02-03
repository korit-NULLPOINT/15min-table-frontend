import { useEffect, useState, useMemo } from 'react';
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
import {
    getPostList,
    useDeletePost,
} from '../../apis/generated/post-controller/post-controller';
import { formatDate } from '../../apis/utils/formatDate';

export function CommunityManagement() {
    const FREE_BOARD_ID = 2;
    const SIZE = 20;
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
        queryKey: ['admin-posts', FREE_BOARD_ID, searchQuery],
        queryFn: ({ pageParam }) =>
            getPostList(FREE_BOARD_ID, {
                size: SIZE,
                cursor: pageParam || undefined,
                keyword: searchQuery || undefined,
            }),
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
            const responseData = lastPage?.data?.data;
            if (!responseData) return undefined;
            return responseData.hasNext ? responseData.nextCursor : undefined;
        },
        enabled: !!FREE_BOARD_ID,
    });

    const { mutate: deletePost } = useDeletePost({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
                setConfirmingId(null);
            },
            onError: (err) => {
                console.error('Delete failed:', err);
                alert('게시글 삭제에 실패했습니다.');
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
        return (
            data?.pages.flatMap((page) => page.data?.data?.items || []) || []
        );
    }, [data]);

    // Client-side Sort Logic (since API might not support it for all fields)
    // We sort only the items currently loaded.
    const sortedPosts = useMemo(() => {
        const sorted = [...posts];
        if (sortConfig.key === 'createDt') {
            sorted.sort((a, b) => {
                const dateA = new Date(a.createDt);
                const dateB = new Date(b.createDt);
                return sortConfig.direction === 'asc'
                    ? dateA - dateB
                    : dateB - dateA;
            });
        } else if (sortConfig.key === 'viewCount') {
            sorted.sort((a, b) => {
                return sortConfig.direction === 'asc'
                    ? (a.viewCount || 0) - (b.viewCount || 0)
                    : (b.viewCount || 0) - (a.viewCount || 0);
            });
        }
        return sorted;
    }, [posts, sortConfig]);

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
                sx={{
                    backgroundColor: '#3d3226',
                    color: '#f5f1eb',
                    fontWeight: 'bold',
                }}
            >
                <Typography paddingX={10}>제목</Typography>
            </TableCell>
            <TableCell
                sx={{
                    backgroundColor: '#3d3226',
                    color: '#f5f1eb',
                    fontWeight: 'bold',
                }}
            >
                <Typography paddingX={5}>작성자</Typography>
            </TableCell>
            <TableCell
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
                align="center"
                sx={{
                    backgroundColor: '#3d3226',
                    color: '#f5f1eb',
                    fontWeight: 'bold',
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
            <TableCell sx={{ maxWidth: 300 }}>
                <Typography
                    paddingX={3}
                    noWrap
                    title={post.title}
                    sx={{
                        color: '#3d3226',
                        cursor: 'default',
                    }}
                >
                    {post.title}
                </Typography>
            </TableCell>
            <TableCell sx={{ color: '#6b5d4f' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
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
            <TableCell align="center" sx={{ color: '#6b5d4f' }}>
                {formatDate(post.createDt)}
            </TableCell>
            <TableCell align="center" sx={{ color: '#6b5d4f' }}>
                {(post.viewCount || 0).toLocaleString()}
            </TableCell>
            <TableCell align="center" sx={{ color: '#6b5d4f' }}>
                {(post.commentCount || 0).toLocaleString()}
            </TableCell>
            <TableCell align="center">
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
