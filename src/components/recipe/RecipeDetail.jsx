import {
    ArrowLeft,
    User as UserIcon,
    Star,
    Sparkles,
    MapPin,
} from 'lucide-react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Chip,
    Stack,
    Grid,
    Divider,
    IconButton,
    Avatar,
    Modal,
} from '@mui/material';
import { useState, useRef, useMemo, useEffect } from 'react';

import { ImageWithFallback } from '../figma/ImageWithFallback';
import RecipeComment from './RecipeComment';
import RecipeRatingBookmark from './RecipeRatingBookmark';
import { formatDate } from '../../utils/formatDate';
import KakaoMap from '../KakaoMap';

function safeJsonArray(value, fallback = []) {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return fallback;
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch {
        return fallback;
    }
}

export function RecipeDetail({
    recipeDetail,
    onNavigate,
    isLoggedIn,
    onOpenAuth,
    currentUsername,
    onAuthorClick,
    comments,
}) {
    if (!recipeDetail) return null;
    const [totalRatings, setTotalRatings] = useState(0);
    const [ratingSum, setRatingSum] = useState(0);

    useEffect(() => {
        if (recipeDetail) {
            const count = Number(recipeDetail.ratingCount) || 0;
            const avg = Number(recipeDetail.avgRating) || 0;
            setTotalRatings(count);
            setRatingSum(count * avg);
        }
    }, [recipeDetail]);

    const averageRating =
        totalRatings > 0 ? (ratingSum / totalRatings).toFixed(1) : '0.0';

    const handleStatsChange = (deltaTotal, deltaSum) => {
        setTotalRatings((prev) => prev + deltaTotal);
        setRatingSum((prev) => prev + deltaSum);
    };

    const mapRef = useRef(null);

    const handleAIStoreMap = () => {
        if (
            mapRef.current &&
            typeof mapRef.current.handleAIStoreMap === 'function'
        ) {
            mapRef.current.handleAIStoreMap();
            return;
        }
        alert(
            '지도 기능을 불러오지 못했습니다. (AiStoreMapPage ref 확인 필요)',
        );
    };

    // --- ingredient modal ---
    const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);

    const ingredientsArr = useMemo(() => {
        return safeJsonArray(recipeDetail.ingredients, []);
    }, [recipeDetail.ingredients]);

    const ingredientImgSrc = useMemo(() => {
        if (recipeDetail?.ingredientImgUrl)
            return recipeDetail.ingredientImgUrl;

        const str =
            typeof recipeDetail?.ingredients === 'string'
                ? recipeDetail.ingredients
                : JSON.stringify(recipeDetail?.ingredients ?? 'default');

        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }
        return `https://picsum.photos/seed/${Math.abs(hash)}/500`;
    }, [recipeDetail?.ingredientImgUrl, recipeDetail?.ingredients]);

    const hashtags = useMemo(() => {
        const tags = recipeDetail.hashtags || [
            '15분요리',
            '간단레시피',
            '자취생필수',
            '초간단',
        ];
        return tags
            .map((tag) => {
                if (typeof tag === 'string') return tag;
                if (tag.name) return tag.name;
                if (typeof tag.hashtag === 'string') return tag.hashtag;
                if (tag.hashtag?.name) return tag.hashtag.name;
                return '';
            })
            .filter(Boolean);
    }, [recipeDetail.hashtags]);

    const handleBack = () => {
        if (typeof onNavigate === 'function') {
            onNavigate('home');
            return;
        }
    };

    return (
        <Box sx={{ py: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Container maxWidth="lg">
                {/* Back Button */}
                <Button
                    startIcon={<ArrowLeft size={20} />}
                    onClick={handleBack}
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
                    목록으로 돌아가기
                </Button>

                {/* Recipe Header Card */}
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 2,
                        border: '2px solid #e5dfd5',
                        overflow: 'hidden',
                        mb: 4,
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            // width: '100%',
                            // maxHeight: '600px', // Limit height on large screens
                            aspectRatio: { xs: '4/3', md: '16/9' },
                            overflow: 'hidden',
                            bgcolor: '#fff',
                        }}
                    >
                        <ImageWithFallback
                            src={
                                recipeDetail.thumbnailImgUrl ||
                                `https://picsum.photos/seed/${recipeDetail.recipeId}/800/600/`
                            }
                            alt={recipeDetail.title}
                            className="w-full h-full object-contain"
                        />
                    </Box>

                    <Box sx={{ p: 4 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                mb: 2,
                            }}
                        >
                            <Box sx={{ width: '100%' }}>
                                <Typography
                                    variant="h3"
                                    component="h1"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#3d3226',
                                        mb: 2,
                                    }}
                                >
                                    {recipeDetail.title}
                                </Typography>

                                {/* Meta Info */}
                                <Stack
                                    direction="row"
                                    flexWrap="wrap"
                                    alignItems="center"
                                    spacing={3}
                                    sx={{ color: '#6b5d4f' }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <Avatar
                                            src={recipeDetail.profileImgUrl}
                                            alt={recipeDetail.username}
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                border: '1px solid #d4cbbf',
                                            }}
                                        >
                                            <UserIcon
                                                size={20}
                                                color="#6b5d4f"
                                            />
                                        </Avatar>
                                        <Typography
                                            fontWeight="medium"
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                },
                                            }}
                                            onClick={() => {
                                                if (!recipeDetail.userId)
                                                    return;
                                                onAuthorClick?.(
                                                    recipeDetail.userId,
                                                    recipeDetail.username,
                                                );
                                            }}
                                        >
                                            {recipeDetail.username || 'Unknown'}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                        }}
                                    >
                                        <Star
                                            size={18}
                                            fill="#f59e0b"
                                            color="#f59e0b"
                                        />
                                        <Typography
                                            fontWeight="bold"
                                            sx={{ color: '#3d3226' }}
                                        >
                                            {averageRating}
                                        </Typography>
                                        <Typography variant="body2">
                                            ({totalRatings}명)
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <Typography variant="body2">
                                            조회수 {recipeDetail.viewCount}
                                        </Typography>
                                        <Box
                                            sx={{
                                                width: 4,
                                                height: 4,
                                                bgcolor: '#d4cbbf',
                                                borderRadius: '50%',
                                            }}
                                        />
                                        <Typography variant="body2">
                                            {recipeDetail.updateDt &&
                                            recipeDetail.updateDt !==
                                                recipeDetail.createDt
                                                ? `${formatDate(recipeDetail.updateDt)} (수정됨)`
                                                : formatDate(
                                                      recipeDetail.createDt,
                                                  )}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <RecipeRatingBookmark
                                recipeId={recipeDetail.recipeId}
                                isLoggedIn={isLoggedIn}
                                onOpenAuth={onOpenAuth}
                                onStatsChange={handleStatsChange}
                            />
                        </Box>

                        <Typography
                            variant="h6"
                            sx={{
                                color: '#6b5d4f',
                                lineHeight: 1.6,
                                fontWeight: 'normal',
                            }}
                        >
                            {recipeDetail?.intro}
                        </Typography>
                    </Box>
                </Paper>

                {/* Ingredients Section */}
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 2,
                        border: '2px solid #e5dfd5',
                        overflow: 'hidden',
                        p: 4,
                        mb: 4,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3,
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{ color: '#3d3226', fontWeight: 'bold' }}
                        >
                            재료
                        </Typography>
                        <Button
                            onClick={handleAIStoreMap}
                            startIcon={<Sparkles size={16} />}
                            sx={{
                                background:
                                    'linear-gradient(to right, #10b981, #0d9488)',
                                color: 'white',
                                px: 2,
                                py: 1,
                                borderRadius: 1,
                                boxShadow: 2,
                                fontWeight: 'bold',
                                '&:hover': {
                                    background:
                                        'linear-gradient(to right, #059669, #0f766e)',
                                },
                            }}
                        >
                            내 근처 재료 찾기
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column-reverse', md: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'center', md: 'flex-start' },
                            gap: 4,
                        }}
                    >
                        <Box sx={{ flex: 1, width: '100%' }}>
                            <Stack spacing={2}>
                                {ingredientsArr.map((ingredient, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            color: '#6b5d4f',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                bgcolor: '#3d3226',
                                                borderRadius: '50%',
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Typography variant="h6">
                                            {ingredient}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <Box
                                onClick={() => setIsIngredientModalOpen(true)}
                                sx={{
                                    width: { xs: 200, sm: 200 },
                                    height: { xs: 200, sm: 200 },
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    border: '2px solid #d4cbbf',
                                    cursor: 'pointer',
                                    boxShadow: 3,
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'scale(1.05)' },
                                    mb: 1,
                                }}
                            >
                                <ImageWithFallback
                                    src={ingredientImgSrc}
                                    alt="Ingredients"
                                    className="w-full h-full object-cover"
                                />
                            </Box>
                            <Typography
                                variant="caption"
                                sx={{ color: '#6b5d4f' }}
                            >
                                클릭하면 그림이 확대됩니다.
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <KakaoMap ref={mapRef} ingredients={ingredientsArr} />
                    </Box>
                </Paper>

                {/* Steps Section */}
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 2,
                        border: '2px solid #e5dfd5',
                        overflow: 'hidden',
                        p: 4,
                        mb: 4,
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{ color: '#3d3226', fontWeight: 'bold', mb: 3 }}
                    >
                        조리 방법
                    </Typography>
                    <Stack spacing={4}>
                        {(recipeDetail.steps || '')
                            .split('\n')
                            .filter(Boolean)
                            .map((step, index) => (
                                <Box
                                    key={index}
                                    sx={{ display: 'flex', gap: 2 }}
                                >
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            bgcolor: '#3d3226',
                                            color: '#f5f1eb',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {index + 1}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: '#6b5d4f',
                                            lineHeight: 1.6,
                                            pt: 0.5,
                                        }}
                                    >
                                        {step}
                                    </Typography>
                                </Box>
                            ))}
                    </Stack>
                </Paper>

                {/* Hashtags Section */}
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 2,
                        border: '2px solid #e5dfd5',
                        overflow: 'hidden',
                        p: 4,
                        mb: 4,
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{ color: '#3d3226', fontWeight: 'bold', mb: 3 }}
                    >
                        해시태그
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                        {hashtags.map((tag) => (
                            <Chip
                                key={tag}
                                label={`#${tag}`}
                                sx={{
                                    bgcolor: '#ebe5db',
                                    color: '#3d3226',
                                    fontWeight: 'medium',
                                    border: '2px solid #d4cbbf',
                                    fontSize: '1rem',
                                    py: 2.5,
                                    px: 1,
                                    '&:hover': {
                                        borderColor: '#3d3226',
                                    },
                                }}
                            />
                        ))}
                    </Box>
                </Paper>

                {/* Comments Section */}
                <RecipeComment
                    comments={comments ?? []}
                    isLoggedIn={isLoggedIn}
                    onOpenAuth={onOpenAuth}
                    currentUsername={currentUsername}
                    onNavigate={onNavigate}
                    recipeDetail={recipeDetail}
                />

                {/* Ingredient Image Modal */}
                <Modal
                    open={isIngredientModalOpen}
                    onClose={() => setIsIngredientModalOpen(false)}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(0,0,0,0.8)',
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            maxWidth: '80vw',
                            maxHeight: '80vh',
                            outline: 'none',
                        }}
                    >
                        <IconButton
                            onClick={() => setIsIngredientModalOpen(false)}
                            sx={{
                                position: 'absolute',
                                top: -50,
                                right: 0,
                                color: 'white',
                            }}
                        >
                            <Typography variant="h4">&times;</Typography>
                        </IconButton>
                        <img
                            src={ingredientImgSrc}
                            alt="Ingredients Large"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                borderRadius: 8,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </Box>
                </Modal>
            </Container>
        </Box>
    );
}
