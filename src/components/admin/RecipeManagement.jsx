import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getAdminRecipeList } from '../../apis/generated/manage-controller/manage-controller';
import { useRemoveRecipe } from '../../apis/generated/recipe-controller/recipe-controller';
import { usePrincipalState } from '../../store/usePrincipalState';
import { useDebounce } from '../../hooks/useDebounce';
import { AdminManagementLayout } from './common/AdminManagementLayout';
import { ActionConfirmButton } from './common/ActionConfirmButton';

// MUI Imports
import {
    Box,
    Typography,
    TableRow,
    TableCell,
    Avatar,
    TableSortLabel,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

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
        isLoading,
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

    // Confirming State
    const [confirmingId, setConfirmingId] = useState(null);

    // Click Outside Listener for closing active confirm modal
    // Note: DeleteConfirmButton uses 'delete-confirm-box' class to detect outside clicks
    // but the layout might need global click listener if we want to close it when clicking elsewhere deeply
    // The previous implementation had this in RecipeManagement.
    // Let's keep a simple listener here if needed, or rely on Button's logic?
    // Actually, the previous implementation handled it in parent. Let's keep it here.
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

    const handleExecuteDelete = (recipeId) => {
        deleteRecipe(
            { boardId: 1, recipeId },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ['adminRecipeList'],
                    });
                    setConfirmingId(null);
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
                        '&.Mui-active .MuiTableSortLabel-icon': {
                            opacity: 1,
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
                        '&.Mui-active .MuiTableSortLabel-icon': {
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
    );

    const tableBody = recipes.map((recipe) => (
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
                        navigate(`/board/1/recipe/${recipe.recipeId}`);
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
                    <Typography variant="body2" noWrap>
                        {recipe.username}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell align="center" sx={{ color: '#6b5d4f' }}>
                {new Date(recipe.createDt).toLocaleDateString()}
            </TableCell>
            <TableCell align="center" sx={{ color: '#6b5d4f' }}>
                {recipe.viewCount.toLocaleString()}
            </TableCell>
            <TableCell align="center" sx={{ color: '#6b5d4f' }}>
                {recipe.commentCount.toLocaleString()}
            </TableCell>
            <TableCell align="center">
                <ActionConfirmButton
                    id={recipe.recipeId}
                    onConfirm={handleExecuteDelete}
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
            title="레시피 관리"
            description="레시피 조회 및 삭제 관리"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPlaceholder="제목 또는 작성자로 검색"
            tableHead={tableHead}
            tableBody={tableBody}
            isLoading={status === 'pending'}
            error={error}
            isEmpty={recipes.length === 0}
            observerRef={observerRef}
            isFetchingNextPage={isFetchingNextPage}
        />
    );
}
