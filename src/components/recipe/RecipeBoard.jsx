import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Star } from 'lucide-react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    InputBase,
    Stack,
    Chip,
    CircularProgress,
} from '@mui/material';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { mainCategory, subCategory } from '../../utils/categoryData';
import { useGetFilteredRecipeList } from '../../apis/generated/recipe-controller/recipe-controller';
import { useDebounce } from '../../hooks/useDebounce';

export function RecipeBoard({ onNavigate, onRecipeClick }) {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const [selectedMainCategoryId, setSelectedMainCategoryId] = useState(0);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(0);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;

    // Filter API Call
    const { data: recipeData, isLoading } = useGetFilteredRecipeList(
        1, // boardId
        {
            mainCategoryId:
                selectedMainCategoryId === 0
                    ? undefined
                    : selectedMainCategoryId,
            subCategoryId:
                selectedSubCategoryId === 0 ? undefined : selectedSubCategoryId,
            keyword: debouncedSearchQuery || undefined,
            page: currentPage - 1, // API is 0-indexed
            size: ITEMS_PER_PAGE,
        },
    );

    const recipes = recipeData?.data?.data?.items || [];
    const totalCount = recipeData?.data?.data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // Reset page on filter change
    const handleFilterChange = (setter, value) => {
        setter(value);
        setCurrentPage(1);
    };

    // Reset page when search query changes (debounced)
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <Box sx={{ py: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Container maxWidth="lg">
                <Button
                    startIcon={<ArrowLeft size={20} />}
                    onClick={() => onNavigate('/')}
                    sx={{
                        mb: 3,
                        px: 2,
                        py: 1,
                        border: '2px solid #3d3226',
                        color: '#3d3226',
                        borderRadius: 1,
                        fontWeight: 'bold',
                        '&:hover': {
                            bgcolor: '#3d3226',
                            color: '#f5f1eb',
                        },
                    }}
                >
                    메인으로 돌아가기
                </Button>

                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 2,
                        border: '2px solid #e5dfd5',
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            bgcolor: '#3d3226',
                            color: '#f5f1eb',
                            px: 4,
                            py: 3,
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{ fontWeight: 'bold', mb: 1 }}
                        >
                            레시피 게시판
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#e5dfd5' }}>
                            다양한 레시피를 검색하고 찾아보세요
                        </Typography>
                    </Box>

                    {/* Search Bar */}
                    <Box
                        sx={{
                            p: 3,
                            borderBottom: '2px solid #e5dfd5',
                            bgcolor: '#ebe5db',
                        }}
                    >
                        <Box sx={{ position: 'relative' }}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: 16,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#6b5d4f',
                                    display: 'flex',
                                }}
                            >
                                <Search size={20} />
                            </Box>
                            <InputBase
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="레시피 검색..."
                                fullWidth
                                sx={{
                                    pl: 6,
                                    pr: 2,
                                    py: 1.5,
                                    border: '2px solid #d4cbbf',
                                    borderRadius: 1,
                                    bgcolor: '#fff',
                                    color: '#3d3226',
                                    '&.Mui-focused': {
                                        border: '2px solid #3d3226',
                                    },
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Category Filters */}
                    <Box sx={{ p: 3, borderBottom: '2px solid #e5dfd5' }}>
                        <Box sx={{ mb: 3 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 1.5,
                                }}
                            >
                                <Filter size={18} color="#3d3226" />
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: '#6b5d4f',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                    }}
                                >
                                    메인 카테고리
                                </Typography>
                            </Box>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {Object.entries(mainCategory).map(
                                    ([id, label]) => (
                                        <Chip
                                            key={id}
                                            label={label}
                                            onClick={() => {
                                                const categoryId = Number(id);
                                                handleFilterChange(
                                                    setSelectedMainCategoryId,
                                                    selectedMainCategoryId ===
                                                        categoryId
                                                        ? 0
                                                        : categoryId,
                                                );
                                            }}
                                            sx={{
                                                bgcolor:
                                                    selectedMainCategoryId ===
                                                    Number(id)
                                                        ? '#3d3226'
                                                        : '#fff',
                                                color:
                                                    selectedMainCategoryId ===
                                                    Number(id)
                                                        ? '#f5f1eb'
                                                        : '#3d3226',
                                                border: '2px solid',
                                                borderColor:
                                                    selectedMainCategoryId ===
                                                    Number(id)
                                                        ? '#3d3226'
                                                        : '#d4cbbf',
                                                borderRadius: 1,
                                                fontWeight: 'medium',
                                                '&:hover': {
                                                    borderColor: '#3d3226',
                                                    bgcolor:
                                                        selectedMainCategoryId ===
                                                        Number(id)
                                                            ? '#3d3226'
                                                            : '#fff',
                                                },
                                            }}
                                        />
                                    ),
                                )}
                            </Stack>
                        </Box>

                        <Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 1.5,
                                }}
                            >
                                <Filter size={18} color="#3d3226" />
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: '#6b5d4f',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                    }}
                                >
                                    부 카테고리
                                </Typography>
                            </Box>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {Object.entries(subCategory).map(
                                    ([id, label]) => (
                                        <Chip
                                            key={id}
                                            label={label}
                                            onClick={() => {
                                                const categoryId = Number(id);
                                                handleFilterChange(
                                                    setSelectedSubCategoryId,
                                                    selectedSubCategoryId ===
                                                        categoryId
                                                        ? 0
                                                        : categoryId,
                                                );
                                            }}
                                            sx={{
                                                bgcolor:
                                                    selectedSubCategoryId ===
                                                    Number(id)
                                                        ? '#3d3226'
                                                        : '#fff',
                                                color:
                                                    selectedSubCategoryId ===
                                                    Number(id)
                                                        ? '#f5f1eb'
                                                        : '#3d3226',
                                                border: '2px solid',
                                                borderColor:
                                                    selectedSubCategoryId ===
                                                    Number(id)
                                                        ? '#3d3226'
                                                        : '#d4cbbf',
                                                borderRadius: 1,
                                                fontWeight: 'medium',
                                                '&:hover': {
                                                    borderColor: '#3d3226',
                                                    bgcolor:
                                                        selectedSubCategoryId ===
                                                        Number(id)
                                                            ? '#3d3226'
                                                            : '#fff',
                                                },
                                            }}
                                        />
                                    ),
                                )}
                            </Stack>
                        </Box>
                    </Box>

                    {/* Recipe List */}
                    <Box sx={{ p: 3 }}>
                        <Typography sx={{ mb: 2, color: '#6b5d4f' }}>
                            총{' '}
                            <Box
                                component="span"
                                sx={{ color: '#3d3226', fontWeight: 'bold' }}
                            >
                                {totalCount}
                            </Box>{' '}
                            개의 레시피
                        </Typography>

                        {isLoading ? (
                            <Box sx={{ textAlign: 'center', py: 10 }}>
                                <CircularProgress sx={{ color: '#3d3226' }} />
                                <Typography sx={{ mt: 2, color: '#6b5d4f' }}>
                                    레시피를 불러오는 중입니다...
                                </Typography>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        sm: '1fr 1fr',
                                        md: '1fr 1fr 1fr',
                                    },
                                    gap: 3,
                                    alignItems: 'start', // or stretch
                                }}
                            >
                                {recipes.map((recipe) => (
                                    <Paper
                                        key={recipe.recipeId}
                                        elevation={2}
                                        onClick={() =>
                                            onRecipeClick &&
                                            onRecipeClick(recipe.recipeId)
                                        }
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            border: '2px solid #e5dfd5',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            height: '100%',
                                            '&:hover': {
                                                boxShadow: 6,
                                                borderColor: '#3d3226',
                                                transform: 'translateY(-4px)',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                width: '100%',
                                                aspectRatio: '4 / 3',
                                                overflow: 'hidden',
                                                bgcolor: '#f5f5f5',
                                            }}
                                        >
                                            <ImageWithFallback
                                                src={
                                                    recipe.thumbnailImgUrl &&
                                                    recipe.thumbnailImgUrl !==
                                                        'string'
                                                        ? recipe.thumbnailImgUrl
                                                        : `https://picsum.photos/seed/${recipe.recipeId}/800/600`
                                                }
                                                alt={recipe.title}
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                            />
                                            {!recipe.thumbnailImgUrl && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform:
                                                            'translate(-50%, -50%)',
                                                        color: '#ffffff',
                                                        fontWeight: 'bold',
                                                        pointerEvents: 'none',
                                                        whiteSpace: 'nowrap',
                                                        backgroundColor:
                                                            'rgba(0, 0, 0, 0.4)',
                                                        px: 2,
                                                        py: 0.5,
                                                        borderRadius: 4,
                                                        textShadow:
                                                            '0 1px 3px rgba(0,0,0,0.8)',
                                                        boxShadow:
                                                            '0 2px 4px rgba(0,0,0,0.2)',
                                                        border: '1px solid rgba(255,255,255,0.2)',
                                                    }}
                                                >
                                                    랜덤 이미지 입니다.
                                                </Box>
                                            )}
                                        </Box>

                                        <Box
                                            sx={{
                                                p: 2,
                                                flexGrow: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: '#3d3226',
                                                        mb: 1,
                                                        overflow: 'hidden',
                                                        textOverflow:
                                                            'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        fontWeight: 'bold',
                                                        fontSize: '1.125rem',
                                                    }}
                                                >
                                                    {recipe.title}
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent:
                                                            'space-between',
                                                        alignItems: 'center',
                                                        mb: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: '#6b5d4f',
                                                        }}
                                                    >
                                                        by {recipe.username}
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            gap: 0.5,
                                                        }}
                                                    >
                                                        <Star
                                                            size={14}
                                                            fill="#f59e0b"
                                                            color="#f59e0b"
                                                        />
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: '#6b5d4f',
                                                            }}
                                                        >
                                                            {(
                                                                recipe.avgRating ||
                                                                0
                                                            ).toFixed(1)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: 1.5,
                                                    alignItems: 'center',
                                                    color: '#6b5d4f',
                                                    mt: 1,
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                    }}
                                                >
                                                    👁 {recipe.viewCount || 0}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        )}

                        {totalCount === 0 && !isLoading && (
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 6,
                                    color: '#6b5d4f',
                                }}
                            >
                                <Typography>검색 결과가 없습니다.</Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Pagination Controls */}
                    {!isLoading && totalPages > 0 && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 1,
                                p: 3,
                                borderTop: '2px solid #e5dfd5',
                                bgcolor: '#ebe5db',
                            }}
                        >
                            <Button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1),
                                    )
                                }
                                disabled={currentPage === 1}
                                sx={{
                                    px: 2,
                                    py: 1,
                                    border: '2px solid #d4cbbf',
                                    bgcolor: 'white',
                                    color: '#3d3226',
                                    '&:hover': { borderColor: '#3d3226' },
                                    '&.Mui-disabled': { opacity: 0.5 },
                                }}
                            >
                                이전
                            </Button>

                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                {(() => {
                                    const maxButtons = 5;
                                    let startPage = Math.max(
                                        1,
                                        currentPage -
                                            Math.floor(maxButtons / 2),
                                    );
                                    let endPage = Math.min(
                                        totalPages,
                                        startPage + maxButtons - 1,
                                    );

                                    if (endPage - startPage + 1 < maxButtons) {
                                        startPage = Math.max(
                                            1,
                                            endPage - maxButtons + 1,
                                        );
                                    }

                                    return Array.from(
                                        { length: endPage - startPage + 1 },
                                        (_, i) => startPage + i,
                                    ).map((pageNum) => (
                                        <Button
                                            key={pageNum}
                                            onClick={() =>
                                                setCurrentPage(pageNum)
                                            }
                                            sx={{
                                                minWidth: 40,
                                                height: 40,
                                                fontWeight: 'bold',
                                                bgcolor:
                                                    currentPage === pageNum
                                                        ? '#3d3226'
                                                        : 'transparent',
                                                color:
                                                    currentPage === pageNum
                                                        ? '#f5f1eb'
                                                        : '#3d3226',
                                                '&:hover': {
                                                    bgcolor:
                                                        currentPage === pageNum
                                                            ? '#3d3226'
                                                            : '#d4cbbf',
                                                },
                                            }}
                                        >
                                            {pageNum}
                                        </Button>
                                    ));
                                })()}
                            </Box>

                            <Button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                sx={{
                                    px: 2,
                                    py: 1,
                                    border: '2px solid #d4cbbf',
                                    bgcolor: 'white',
                                    color: '#3d3226',
                                    '&:hover': { borderColor: '#3d3226' },
                                    '&.Mui-disabled': { opacity: 0.5 },
                                }}
                            >
                                다음
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}
