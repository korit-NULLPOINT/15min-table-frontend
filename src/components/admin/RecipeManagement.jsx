import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getAdminRecipeList } from '../../apis/generated/manage-controller/manage-controller';
import { useRemoveRecipe } from '../../apis/generated/recipe-controller/recipe-controller';
import { usePrincipalState } from '../../store/usePrincipalState';
import { useDebounce } from '../../hooks/useDebounce';

// MUI Imports
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    CircularProgress,
    Avatar,
    TableSortLabel,
} from '@mui/material';
import {
    Search as SearchIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';

export function RecipeManagement() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { principal } = usePrincipalState();
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Sorting State
    const [sortConfig, setSortConfig] = useState({
        key: 'createDt',
        direction: 'desc',
    });

    // Check Admin Access
    useEffect(() => {
        const isAdmin = principal?.userRoles?.some((r) => r.role?.roleId === 1);
        if (principal && !isAdmin) {
            alert('관리자 권한이 필요합니다.');
            navigate('/');
        }
    }, [principal, navigate]);

    // Constant for Page Size
    const PAGE_SIZE = 10;

    // Infinite Query
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error,
    } = useInfiniteQuery({
        queryKey: ['adminRecipeList', debouncedSearchQuery, sortConfig],
        queryFn: async ({ pageParam }) => {
            const params = {
                keyword: debouncedSearchQuery || undefined,
                size: PAGE_SIZE,
                sortKey: sortConfig.key,
                sortBy: sortConfig.direction,
                ...pageParam,
            };
            const response = await getAdminRecipeList(params);
            return response.data;
        },
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            const items = lastPage?.data || [];
            // If items returned is less than PAGE_SIZE, we reached the end
            if (items.length === 0 || items.length < PAGE_SIZE) {
                return undefined;
            }
            const lastItem = items[items.length - 1];
            return {
                cursorId: lastItem.recipeId,
                cursorCreateDt: lastItem.createDt,
                cursorViewCount: lastItem.viewCount,
            };
        },
    });

    // Intersection Observer
    const observerRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage();
                }
            },
            { threshold: 0.5 },
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Flatten data
    const recipes = useMemo(() => {
        return data?.pages.flatMap((page) => page?.data || []) || [];
    }, [data]);

    // Delete Mutation
    const { mutate: deleteRecipe } = useRemoveRecipe();

    // Confirming State for "Round Slot Modal"
    const [confirmingId, setConfirmingId] = useState(null);
    const [isCooldown, setIsCooldown] = useState(false);

    // Click Outside Listener
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (confirmingId && !event.target.closest('.delete-confirm-box')) {
                setConfirmingId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [confirmingId]);

    const handleClickTrash = (recipeId) => {
        if (confirmingId === recipeId) {
            // Second click: Execute Delete
            handleExecuteDelete(recipeId);
        } else {
            // First click: Show confirm UI
            setConfirmingId(recipeId);

            // Start Cooldown (Prevent immediate second click)
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 5000);
        }
    };

    const handleExecuteDelete = (recipeId) => {
        deleteRecipe(
            { boardId: 1, recipeId },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ['adminRecipeList'],
                    });
                    setConfirmingId(null);
                    alert('삭제되었습니다.');
                },
                onError: (err) => {
                    console.error('Delete failed', err);
                    alert('삭제에 실패했습니다. (게시판 ID 불일치 가능성)');
                },
            },
        );
    };

    const handleSort = (key) => {
        setSortConfig((prev) => {
            const isAsc = prev.key === key && prev.direction === 'asc';
            return {
                key,
                direction: isAsc ? 'desc' : 'asc',
            };
        });
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1440, margin: '0 auto' }}>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontFamily: 'serif',
                        color: '#3d3226',
                        mb: 1,
                        fontWeight: 'bold',
                    }}
                >
                    레시피 관리
                </Typography>
                <Typography variant="body1" sx={{ color: '#6b5d4f' }}>
                    레시피 조회 및 삭제 관리
                </Typography>
            </Box>

            {/* 검색 */}
            <Box sx={{ mb: 4, maxWidth: 480 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="제목 또는 작성자로 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#6b5d4f' }} />
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: '12px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#d4cbbf',
                                borderWidth: 2,
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3d3226',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3d3226',
                            },
                        },
                    }}
                />
            </Box>

            {/* 레시피 테이블 */}
            <Paper
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '12px',
                    border: '2px solid #d4cbbf',
                    boxShadow: 'none',
                }}
            >
                <TableContainer
                    sx={{
                        maxHeight: 600,
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#d4cbbf',
                            borderRadius: '4px',
                        },
                    }}
                >
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
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
                                            '&.MuiTableSortLabel-root': {
                                                color: '#f5f1eb',
                                            },
                                            '&.MuiTableSortLabel-root:hover': {
                                                color: '#d4cbbf',
                                            },
                                            '&.Mui-active': {
                                                color: '#f5f1eb',
                                            },
                                            '& .MuiTableSortLabel-icon': {
                                                color: '#f5f1eb !important',
                                                opacity: 0.5, // Always show with low opacity
                                            },
                                            '&.Mui-active .MuiTableSortLabel-icon':
                                                {
                                                    opacity: 1, // Full opacity when active
                                                },
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
                                            '&.MuiTableSortLabel-root': {
                                                color: '#f5f1eb',
                                            },
                                            '&.MuiTableSortLabel-root:hover': {
                                                color: '#d4cbbf',
                                            },
                                            '&.Mui-active': {
                                                color: '#f5f1eb',
                                            },
                                            '& .MuiTableSortLabel-icon': {
                                                color: '#f5f1eb !important',
                                                opacity: 0.5,
                                            },
                                            '&.Mui-active .MuiTableSortLabel-icon':
                                                {
                                                    opacity: 1,
                                                },
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
                                    답글수
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
                        </TableHead>
                        <TableBody>
                            {status === 'pending' ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        align="center"
                                        sx={{ py: 4 }}
                                    >
                                        <CircularProgress
                                            sx={{ color: '#3d3226' }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ) : status === 'error' ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        align="center"
                                        sx={{ py: 4, color: 'error.main' }}
                                    >
                                        에러가 발생했습니다: {error.message}
                                    </TableCell>
                                </TableRow>
                            ) : recipes.length > 0 ? (
                                recipes.map((recipe) => (
                                    <TableRow
                                        key={recipe.recipeId}
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
                                                onClick={() => {
                                                    navigate(
                                                        `/boards/1/recipe/${recipe.recipeId}`,
                                                    );
                                                }}
                                                title={recipe.title}
                                                sx={{
                                                    color: '#3d3226',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {recipe.title}
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
                                                    alt={recipe.username}
                                                    src={recipe.profileImgUrl}
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                    }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    noWrap
                                                >
                                                    {recipe.username}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ color: '#6b5d4f' }}
                                        >
                                            {new Date(
                                                recipe.createDt,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ color: '#6b5d4f' }}
                                        >
                                            {recipe.viewCount.toLocaleString()}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ color: '#6b5d4f' }}
                                        >
                                            {recipe.commentCount.toLocaleString()}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    display: 'inline-block',
                                                    width: 40,
                                                    height: 40,
                                                }}
                                            >
                                                <Box
                                                    className="delete-confirm-box"
                                                    sx={{
                                                        position: 'absolute',
                                                        right: 0,
                                                        top: '50%',
                                                        transform:
                                                            'translateY(-50%)',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'flex-end',
                                                        backgroundColor:
                                                            confirmingId ===
                                                            recipe.recipeId
                                                                ? '#ffebee'
                                                                : 'transparent',
                                                        borderRadius: '24px',
                                                        border:
                                                            confirmingId ===
                                                            recipe.recipeId
                                                                ? '1px solid #ef9a9a'
                                                                : '1px solid transparent',
                                                        transition:
                                                            'all 0.4s ease',
                                                        overflow: 'hidden',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth:
                                                            confirmingId ===
                                                            recipe.recipeId
                                                                ? '200px'
                                                                : '40px',
                                                        width:
                                                            confirmingId ===
                                                            recipe.recipeId
                                                                ? '200px'
                                                                : '40px',
                                                        padding:
                                                            confirmingId ===
                                                            recipe.recipeId
                                                                ? '0 4px 0 12px'
                                                                : '0',
                                                        zIndex:
                                                            confirmingId ===
                                                            recipe.recipeId
                                                                ? 10
                                                                : 1,
                                                        boxShadow:
                                                            confirmingId ===
                                                            recipe.recipeId
                                                                ? '0 2px 8px rgba(0,0,0,0.1)'
                                                                : 'none',
                                                    }}
                                                >
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: '#d32f2f',
                                                            opacity:
                                                                confirmingId ===
                                                                recipe.recipeId
                                                                    ? 1
                                                                    : 0,
                                                            transition:
                                                                'opacity 0.3s ease 0.1s',
                                                            mr: 1,
                                                            fontWeight: 'bold',
                                                            display:
                                                                confirmingId ===
                                                                recipe.recipeId
                                                                    ? 'block'
                                                                    : 'none',
                                                        }}
                                                    >
                                                        정말 삭제하시겠습니까?
                                                    </Typography>
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleClickTrash(
                                                                recipe.recipeId,
                                                            );
                                                        }}
                                                        className={
                                                            confirmingId ===
                                                            recipe.recipeId
                                                                ? 'animate-shake'
                                                                : ''
                                                        }
                                                        sx={{
                                                            color: '#d32f2f',
                                                            border:
                                                                confirmingId ===
                                                                recipe.recipeId
                                                                    ? 'none'
                                                                    : '1px solid #ef9a9a',
                                                            bgcolor:
                                                                confirmingId ===
                                                                recipe.recipeId
                                                                    ? 'transparent'
                                                                    : '#ffebee',
                                                            '&:hover': {
                                                                bgcolor:
                                                                    '#ffcdd2',
                                                            },
                                                            p: 1,
                                                            minWidth: '34px',
                                                        }}
                                                        size="small"
                                                        title={
                                                            confirmingId ===
                                                            recipe.recipeId
                                                                ? '삭제 확인'
                                                                : '삭제'
                                                        }
                                                        disabled={
                                                            isCooldown &&
                                                            confirmingId ===
                                                                recipe.recipeId
                                                        }
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        align="center"
                                        sx={{ py: 8, color: '#6b5d4f' }}
                                    >
                                        데이터가 없습니다.
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Sentinel Row (Always rendered at bottom of body) */}
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    padding="none"
                                    sx={{ borderBottom: 'none' }}
                                >
                                    <Box
                                        ref={observerRef}
                                        sx={{
                                            height: 40,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {isFetchingNextPage && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                더 불러오는 중...
                                            </Typography>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
