import { useEffect } from 'react';
import { MessageSquare, User, LoaderCircle } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { getPostList } from '../../apis/generated/post-controller/post-controller';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemButton,
    Divider,
} from '@mui/material';
import { CommunityHeader } from './CommunityHeader';
import { ScrollIndicatorWrapper } from '../common/ScrollIndicatorWrapper';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { formatDate } from '../../utils/formatDate';

export function CommunityList({ onPostClick }) {
    const FREE_BOARD_ID = 2;
    const SIZE = 10;
    const { ref, inView } = useInView();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isPostLoading,
    } = useInfiniteQuery({
        queryKey: ['posts', FREE_BOARD_ID],
        queryFn: ({ pageParam }) =>
            getPostList(FREE_BOARD_ID, {
                size: SIZE,
                cursor: pageParam || undefined,
            }),
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
            const responseData = lastPage?.data?.data;
            if (!responseData) return undefined;
            return responseData.hasNext ? responseData.nextCursor : undefined;
        },
        enabled: !!FREE_BOARD_ID,
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    if (isPostLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    height: '400px',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <LoaderCircle
                    className="animate-spin text-[#3d3226]"
                    size={48}
                />
            </Box>
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
            {/* Header */}
            <CommunityHeader
                title="자유게시판"
                description="자유롭게 이야기를 나누는 공간입니다."
            />

            {/* Posts List Container with Scroll */}
            <ScrollIndicatorWrapper>
                {(data?.pages?.[0]?.data?.data?.items?.length ?? 0) === 0 ? (
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
                        <Typography>작성된 게시글이 없습니다.</Typography>
                    </Box>
                ) : (
                    <List disablePadding sx={{ width: '100%' }}>
                        {data?.pages.map((group, i) => (
                            <Box key={i}>
                                {group?.data?.data?.items?.map((post) => (
                                    <Box key={post.postId}>
                                        <ListItem
                                            disablePadding
                                            alignItems="flex-start"
                                            sx={{
                                                '&:hover': {
                                                    bgcolor: '#ebe5db',
                                                },
                                            }}
                                        >
                                            <ListItemButton
                                                onClick={() =>
                                                    onPostClick(
                                                        post.postId,
                                                        FREE_BOARD_ID,
                                                    )
                                                }
                                                sx={{ p: 3 }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        width: '100%',
                                                        alignItems:
                                                            'flex-start',
                                                        gap: 2,
                                                    }}
                                                >
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
                                                    <Box sx={{ flex: 1 }}>
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
                                                                '&:hover': {
                                                                    color: '#d97706',
                                                                },
                                                            }}
                                                        >
                                                            {post.title}
                                                        </Typography>

                                                        <Box
                                                            sx={{
                                                                display: 'flex',
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
                                                                    size={14}
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
                                                                    size={14}
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
                                            sx={{ borderColor: '#e5dfd5' }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        ))}

                        <Box
                            ref={ref}
                            sx={{
                                height: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {isFetchingNextPage && (
                                <LoaderCircle
                                    className="animate-spin text-[#3d3226]"
                                    size={24}
                                />
                            )}
                        </Box>
                    </List>
                )}
            </ScrollIndicatorWrapper>
        </Paper>
    );
}
