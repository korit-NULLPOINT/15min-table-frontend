import { useEffect, useState } from 'react';
import { ArrowLeft, MessageSquare, User, LoaderCircle } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useGetBoardList } from '../../apis/generated/board-controller/board-controller';
import { getPostList } from '../../apis/generated/post-controller/post-controller';
import {
    Box,
    Pagination,
    Typography,
    Paper,
    Button,
    List,
    ListItem,
    ListItemButton,
    Divider,
    Container,
} from '@mui/material';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { formatDate } from '../../apis/utils/formatDate';

export function Community({ onNavigate, onPostClick }) {
    const [freeBoardId, setFreeBoardId] = useState(null);
    const { ref, inView } = useInView(); // Added useInView hook
    // 5.2 items roughly. Assumes each item is ~100px or so. 600px height.
    const SIZE = 10;

    // 1. 게시판 목록 조회
    const { data: boardListData, isLoading: isBoardLoading } = useGetBoardList({
        query: {
            refetchOnWindowFocus: false,
        },
    });

    console.log(boardListData?.data?.data);

    // 2. 자유게시판 ID 찾기
    useEffect(() => {
        if (boardListData?.data?.data) {
            const boards = boardListData.data.data;
            // 'FREE' 타입이나 '자유게시판' 이름을 가진 보드 찾기
            const freeBoard = boards.find(
                (b) =>
                    b.boardType?.boardTypeName === 'FREE' ||
                    b.boardType?.boardTypeNameKor === '자유게시판' ||
                    b.title.includes('자유'),
            );
            if (freeBoard) {
                console.log(freeBoard);
                setFreeBoardId(freeBoard.boardId);
            }
        }
    }, [boardListData]);

    // 3. Infinite Query for Posts
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isPostLoading,
    } = useInfiniteQuery({
        queryKey: ['posts', freeBoardId],
        queryFn: ({ pageParam }) =>
            // pageParam is cursor
            getPostList(freeBoardId, {
                size: SIZE,
                cursor: pageParam || undefined,
            }),
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
            const responseData = lastPage?.data?.data;
            if (!responseData) return undefined;
            return responseData.hasNext ? responseData.nextCursor : undefined;
        },
        enabled: !!freeBoardId,
    });

    // Fetch next page when inView
    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    if (isBoardLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <LoaderCircle
                    className="animate-spin text-[#3d3226]"
                    size={48}
                />
            </div>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#f5f1eb',
                pt: 8,
                px: 3,
                pb: 3,
            }}
        >
            <Container maxWidth="md" disableGutters>
                <Box sx={{ mb: 3, pt: 6 }}>
                    <Button
                        startIcon={<ArrowLeft />}
                        onClick={() => {
                            if (onNavigate) {
                                onNavigate('home');
                            }
                        }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 2,
                            py: 1,
                            border: '2px solid #3d3226',
                            color: '#3d3226',
                            borderRadius: '0.375rem',
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: '#3d3226',
                                color: '#f5f1eb',
                            },
                        }}
                    >
                        메인으로 돌아가기
                    </Button>
                </Box>
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 2,
                        border: '2px solid #e5dfd5',
                        overflow: 'hidden',
                        height: 725, // Fixed height for scrolling (approx 5.2 items)
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            bgcolor: '#3d3226',
                            color: '#f5f1eb',
                            px: 4,
                            py: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexShrink: 0, // Don't shrink header
                        }}
                    >
                        <Box>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{ mb: 1, fontFamily: 'serif' }}
                            >
                                자유게시판
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: 'rgba(229, 223, 213, 0.8)' }}
                            >
                                자유롭게 이야기를 나누는 공간입니다.
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            onClick={() => onNavigate('communityWrite')}
                            sx={{
                                bgcolor: '#f5f1eb',
                                color: '#3d3226',
                                fontWeight: 'bold',
                                '&:hover': {
                                    bgcolor: '#e5dfd5',
                                },
                                px: 3,
                                py: 1.5,
                            }}
                        >
                            글쓰기
                        </Button>
                    </Box>

                    {/* Posts List Container with Scroll */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: '#f1f1f1',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#d4cbbf',
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                background: '#3d3226',
                            },
                        }}
                    >
                        {isPostLoading ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    py: 10,
                                }}
                            >
                                <LoaderCircle
                                    className="animate-spin text-[#3d3226]"
                                    size={32}
                                />
                            </Box>
                        ) : (data?.pages?.[0]?.data?.data?.items?.length ??
                              0) === 0 ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    py: 10,
                                    color: '#9c9489',
                                }}
                            >
                                <MessageSquare
                                    size={48}
                                    style={{
                                        marginBottom: '1rem',
                                        opacity: 0.2,
                                    }}
                                />
                                <Typography>
                                    작성된 게시글이 없습니다.
                                </Typography>
                            </Box>
                        ) : (
                            <List disablePadding sx={{ width: '100%' }}>
                                {data?.pages.map((group, i) => (
                                    <Box key={i}>
                                        {group?.data?.data?.items?.map(
                                            (post, index) => (
                                                <Box key={post.postId}>
                                                    <ListItem
                                                        disablePadding
                                                        alignItems="flex-start"
                                                        sx={{
                                                            '&:hover': {
                                                                bgcolor:
                                                                    '#ebe5db',
                                                            },
                                                        }}
                                                    >
                                                        <ListItemButton
                                                            onClick={() =>
                                                                onPostClick &&
                                                                onPostClick(
                                                                    post.postId,
                                                                )
                                                            }
                                                            sx={{ p: 3 }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        'flex',
                                                                    width: '100%',
                                                                    alignItems:
                                                                        'flex-start',
                                                                    gap: 2,
                                                                }}
                                                            >
                                                                {/* 썸네일 */}
                                                                {post.thumbnailImgUrl && (
                                                                    <Box
                                                                        sx={{
                                                                            width: 64,
                                                                            height: 64,
                                                                            borderRadius: 1,
                                                                            overflow:
                                                                                'hidden',
                                                                            flexShrink: 0,
                                                                            border: '1px solid #e5dfd5',
                                                                        }}
                                                                    >
                                                                        <ImageWithFallback
                                                                            src={
                                                                                post.thumbnailImgUrl
                                                                            }
                                                                            alt="thumbnail"
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </Box>
                                                                )}
                                                                {/* 텍스트 내용 */}
                                                                <Box
                                                                    sx={{
                                                                        flex: 1,
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="h6"
                                                                        sx={{
                                                                            color: '#3d3226',
                                                                            fontWeight: 500,
                                                                            mb: 1,
                                                                            display:
                                                                                '-webkit-box',
                                                                            WebkitLineClamp: 1,
                                                                            WebkitBoxOrient:
                                                                                'vertical',
                                                                            overflow:
                                                                                'hidden',
                                                                            '&:hover':
                                                                                {
                                                                                    color: '#d97706',
                                                                                },
                                                                        }}
                                                                    >
                                                                        {
                                                                            post.title
                                                                        }
                                                                    </Typography>

                                                                    <Box
                                                                        sx={{
                                                                            display:
                                                                                'flex',
                                                                            alignItems:
                                                                                'center',
                                                                            gap: 2,
                                                                            color: '#9c9489',
                                                                        }}
                                                                    >
                                                                        <Box
                                                                            sx={{
                                                                                display:
                                                                                    'flex',
                                                                                alignItems:
                                                                                    'center',
                                                                                gap: 0.5,
                                                                            }}
                                                                        >
                                                                            <User
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                            <Typography variant="caption">
                                                                                {
                                                                                    post.username
                                                                                }
                                                                            </Typography>
                                                                        </Box>
                                                                        <Typography variant="caption">
                                                                            {formatDate(
                                                                                post.createDt,
                                                                            )}
                                                                        </Typography>
                                                                        <Box
                                                                            sx={{
                                                                                display:
                                                                                    'flex',
                                                                                alignItems:
                                                                                    'center',
                                                                                gap: 0.5,
                                                                            }}
                                                                        >
                                                                            <MessageSquare
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                            <Typography variant="caption">
                                                                                {
                                                                                    post.commentCount
                                                                                }
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                        </ListItemButton>
                                                    </ListItem>
                                                    <Divider
                                                        sx={{
                                                            borderColor:
                                                                '#e5dfd5',
                                                        }}
                                                    />
                                                </Box>
                                            ),
                                        )}
                                    </Box>
                                ))}

                                {/* Sentinel for Infinite Scroll */}
                                <div
                                    ref={ref}
                                    className="h-4 flex items-center justify-center p-4"
                                >
                                    {isFetchingNextPage && (
                                        <LoaderCircle
                                            className="animate-spin text-[#3d3226]"
                                            size={24}
                                        />
                                    )}
                                </div>
                            </List>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
