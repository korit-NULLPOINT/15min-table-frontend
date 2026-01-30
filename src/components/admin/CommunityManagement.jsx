import { useState } from 'react';
import {
    TableSortLabel,
    TableRow,
    TableCell,
    Typography,
    Box,
    Avatar,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { AdminManagementLayout } from './common/AdminManagementLayout';
import { ActionConfirmButton } from './common/ActionConfirmButton';

export function CommunityManagement() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: 'date',
        direction: 'desc',
    });

    // Mock Data
    const [posts, setPosts] = useState([
        {
            id: 1,
            title: '요리 초보자인데 추천 레시피 있나요?',
            author: '김철수',
            date: '2025-01-28',
            views: 234,
            comments: 12,
        },
        {
            id: 2,
            title: '오늘 만든 김치볶음밥 인증합니다',
            author: '이영희',
            date: '2025-01-27',
            views: 456,
            comments: 23,
        },
        {
            id: 3,
            title: '냉장고 파먹기 도전 중!',
            author: '박민수',
            date: '2025-01-26',
            views: 789,
            comments: 34,
        },
        {
            id: 4,
            title: '자취생 필수 조미료 추천해주세요',
            author: '최지영',
            date: '2025-01-25',
            views: 567,
            comments: 45,
        },
        {
            id: 5,
            title: '계란 요리 100가지 도전기',
            author: '정수연',
            date: '2025-01-24',
            views: 321,
            comments: 18,
        },
        {
            id: 6,
            title: '자취방 주방 정리 팁',
            author: '강동원',
            date: '2025-01-23',
            views: 890,
            comments: 27,
        },
        {
            id: 7,
            title: '1인분 요리 레시피 공유',
            author: '윤서준',
            date: '2025-01-22',
            views: 654,
            comments: 31,
        },
        {
            id: 8,
            title: '편의점 재료로 만드는 요리',
            author: '김철수',
            date: '2025-01-21',
            views: 432,
            comments: 15,
        },
    ]);

    const [confirmingId, setConfirmingId] = useState(null);

    // Filter Logic
    const filteredPosts = posts.filter(
        (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Sort Logic
    // Since this is mock data, we implement client-side sorting roughly
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (sortConfig.key === 'date') {
            return sortConfig.direction === 'asc'
                ? new Date(a.date) - new Date(b.date)
                : new Date(b.date) - new Date(a.date);
        } else if (sortConfig.key === 'views') {
            return sortConfig.direction === 'asc'
                ? a.views - b.views
                : b.views - a.views;
        }
        return 0;
    });

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
        setPosts(posts.filter((post) => post.id !== postId));
        setConfirmingId(null);
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
                    active={sortConfig.key === 'date'}
                    direction={
                        sortConfig.key === 'date' ? sortConfig.direction : 'asc'
                    }
                    onClick={() => handleSort('date')}
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
                    active={sortConfig.key === 'views'}
                    direction={
                        sortConfig.key === 'views'
                            ? sortConfig.direction
                            : 'asc'
                    }
                    onClick={() => handleSort('views')}
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
            key={post.id}
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
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: '#d4cbbf',
                        }}
                    >
                        {post.author[0]}
                    </Avatar>
                    <Typography variant="body2" noWrap>
                        {post.author}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell align="center" sx={{ color: '#6b5d4f' }}>
                {post.date}
            </TableCell>
            <TableCell align="center" sx={{ color: '#6b5d4f' }}>
                {post.views.toLocaleString()}
            </TableCell>
            <TableCell align="center" sx={{ color: '#6b5d4f' }}>
                {post.comments.toLocaleString()}
            </TableCell>
            <TableCell align="center">
                <ActionConfirmButton
                    id={post.id}
                    onConfirm={() => handleDelete(post.id)}
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
            isLoading={false}
            error={null}
            isEmpty={sortedPosts.length === 0}
            // Mock data doesn't use infinite scroll
            observerRef={null}
            isFetchingNextPage={false}
        />
    );
}
