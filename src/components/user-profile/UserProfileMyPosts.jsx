import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrincipalState } from '../../store/usePrincipalState';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { formatDate } from '../../utils/formatDate';
import { PenIcon, Trash2Icon, FileText, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { removeRecipe } from '../../apis/generated/recipe-controller/recipe-controller';
import {
    deleteComment,
    getGetMyCommentListQueryKey,
} from '../../apis/generated/comment-controller/comment-controller';
import { getGetMyRecipeListQueryKey } from '../../apis/generated/user-recipe-controller/user-recipe-controller';
import { targetData } from '../../utils/targetData';
import { getMyPostListByCursor } from '../../apis/generated/user-post-controller/user-post-controller';
import { deletePost } from '../../apis/generated/post-controller/post-controller';

export default function UserProfileMyPosts({
    onRecipeClick,
    onCommunityPostClick,
    myCommentList,
    myPostList,
}) {
    const principal = usePrincipalState((s) => s.principal);
    const [myProfilePostType, setMyProfilePostType] = useState('recipe');
    const [shakingIcon, setShakingIcon] = useState({ id: null, type: null });
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // 커뮤니티 게시글 무한 스크롤 상태
    const [myCommunityPosts, setMyCommunityPosts] = useState([]);
    const [communityNextCursor, setCommunityNextCursor] = useState(null);
    const [communityHasNext, setCommunityHasNext] = useState(true);
    const [communityLoading, setCommunityLoading] = useState(false);
    const [communityInitialLoaded, setCommunityInitialLoaded] = useState(false);

    // 커뮤니티 게시글 데이터 fetch 함수
    const fetchCommunityPosts = useCallback(
        async (cursor = null) => {
            if (communityLoading) return;

            setCommunityLoading(true);
            try {
                const response = await getMyPostListByCursor({
                    size: 10,
                    cursor: cursor || undefined,
                });

                const data = response?.data?.data;
                if (data) {
                    setMyCommunityPosts((prev) =>
                        cursor ? [...prev, ...data.items] : data.items,
                    );
                    setCommunityHasNext(data.hasNext);
                    setCommunityNextCursor(data.nextCursor);
                }
            } catch (error) {
                console.error('Failed to fetch community posts:', error);
            } finally {
                setCommunityLoading(false);
            }
        },
        [communityLoading],
    );

    // 커뮤니티 탭 선택 시 초기 데이터 로드
    useEffect(() => {
        if (myProfilePostType === 'community' && !communityInitialLoaded) {
            fetchCommunityPosts();
            setCommunityInitialLoaded(true);
        }
    }, [myProfilePostType, communityInitialLoaded, fetchCommunityPosts]);

    // 더보기 핸들러
    const handleLoadMoreCommunity = () => {
        if (communityHasNext && !communityLoading) {
            fetchCommunityPosts(communityNextCursor);
        }
    };

    // 커뮤니티 게시글 수정 핸들러
    const handleCommunityEditClick = (postId) => {
        navigate(`/b/2/free/${postId}/edit`);
    };

    // 커뮤니티 게시글 삭제 핸들러
    const handleCommunityDeleteClick = async (postId) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await deletePost(1, postId); // boardId = 1 (커뮤니티 게시판)
                // 삭제 후 목록에서 제거
                setMyCommunityPosts((prev) =>
                    prev.filter((post) => post.postId !== postId),
                );
            } catch (error) {
                console.error('Failed to delete community post:', error);
                toast.error('삭제 중 오류가 발생했습니다.');
            }
        }
    };

    const handleIconClick = (e, id, type, action) => {
        e.stopPropagation();
        setShakingIcon({ id, type });
        setTimeout(() => {
            setShakingIcon({ id: null, type: null });
            action?.();
        }, 400);
    };

    const handleEditClick = (recipeId) => {
        navigate(`/b/1/recipe/${recipeId}/edit`);
    };

    const handleDeleteClick = async (recipeId) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await removeRecipe(1, recipeId);
                await queryClient.invalidateQueries({
                    queryKey: getGetMyRecipeListQueryKey(),
                });
            } catch (error) {
                console.error('Failed to delete recipe:', error);
                toast.error('삭제 중 오류가 발생했습니다.');
            }
        }
    };

    const handleCommentDeleteClick = async (commentId) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await deleteComment(commentId);
                await queryClient.invalidateQueries({
                    queryKey: getGetMyCommentListQueryKey(),
                });
            } catch (error) {
                console.error('Failed to delete comment:', error);
                toast.error('삭제 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="px-8 py-4">
            <div className="bg-white sticky h-12 flex items-center mb-4 gap-2">
                <div className="w-8 h-8 flex items-center justify-center">
                    <FileText size={20} />
                </div>
                <div className="flex-1 flex items-center justify-between">
                    <h3 className="text-xl text-[#3d3226]">
                        내가 작성한 게시글
                    </h3>

                    <div className="flex gap-2 bg-[#ebe5db] p-1 rounded-md border-2 border-[#d4cbbf]">
                        <button
                            onClick={() => setMyProfilePostType('recipe')}
                            className={`w-24 px-4 py-2 rounded-md transition-colors text-sm ${
                                myProfilePostType === 'recipe'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                    : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                            }`}
                        >
                            레시피
                        </button>
                        <button
                            onClick={() => setMyProfilePostType('comments')}
                            className={`w-24 px-4 py-2 rounded-md transition-colors text-sm ${
                                myProfilePostType === 'comments'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                    : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                            }`}
                        >
                            댓글
                        </button>
                        <button
                            onClick={() => setMyProfilePostType('community')}
                            className={`w-24 px-4 py-2 rounded-md transition-colors text-sm ${
                                myProfilePostType === 'community'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                    : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                            }`}
                        >
                            커뮤니티
                        </button>
                    </div>
                </div>
            </div>

            <div className="pb-4 bg-white">
                {myProfilePostType === 'recipe' && (
                    <div className="grid grid-cols-2 gap-4">
                        {myPostList.map((post) => (
                            <div
                                key={post.recipeId}
                                className="cursor-pointer bg-white rounded-lg overflow-hidden border-2 border-[#e5dfd5] hover:border-[#3d3226] transition-colors"
                                onClick={() => onRecipeClick?.(post.recipeId)}
                            >
                                <ImageWithFallback
                                    src={
                                        post.thumbnailImgUrl ||
                                        `https://picsum.photos/seed/${post.recipeId}/500`
                                    }
                                    alt={post.title}
                                    className="w-full aspect-video object-cover"
                                />
                                <div className="p-4">
                                    <h4 className="text-lg text-[#3d3226] mb-4 font-medium line-clamp-2">
                                        {post.title}
                                    </h4>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-[#6b5d4f]">
                                            {formatDate(post.createDt)}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) =>
                                                    handleIconClick(
                                                        e,
                                                        post.recipeId,
                                                        'edit',
                                                        () =>
                                                            handleEditClick(
                                                                post.recipeId,
                                                            ),
                                                    )
                                                }
                                                className={`p-1 hover:bg-gray-100 rounded-full transition-transform duration-200 hover:scale-110 ${
                                                    shakingIcon.id ===
                                                        post.recipeId &&
                                                    shakingIcon.type === 'edit'
                                                        ? 'animate-shake'
                                                        : ''
                                                }`}
                                            >
                                                <PenIcon
                                                    size={18}
                                                    className="text-green-600"
                                                />
                                            </button>
                                            <button
                                                onClick={(e) =>
                                                    handleIconClick(
                                                        e,
                                                        post.recipeId,
                                                        'delete',
                                                        () =>
                                                            handleDeleteClick(
                                                                post.recipeId,
                                                            ),
                                                    )
                                                }
                                                className={`p-1 hover:bg-gray-100 rounded-full transition-transform duration-200 hover:scale-110 ${
                                                    shakingIcon.id ===
                                                        post.recipeId &&
                                                    shakingIcon.type ===
                                                        'delete'
                                                        ? 'animate-shake'
                                                        : ''
                                                }`}
                                            >
                                                <Trash2Icon
                                                    size={18}
                                                    className="text-red-500"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {myProfilePostType === 'community' && (
                    <div className="space-y-4">
                        {communityLoading && myCommunityPosts.length === 0 ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2
                                    className="animate-spin text-[#6b5d4f]"
                                    size={32}
                                />
                            </div>
                        ) : myCommunityPosts.length === 0 ? (
                            <p className="text-center text-[#6b5d4f] py-8">
                                작성한 커뮤니티 게시글이 없습니다.
                            </p>
                        ) : (
                            <>
                                {myCommunityPosts.map((post) => (
                                    <div
                                        key={post.postId}
                                        onClick={() =>
                                            onCommunityPostClick?.(post.postId)
                                        }
                                        className="cursor-pointer p-6 bg-white rounded-lg border-2 border-[#e5dfd5] hover:border-[#3d3226] transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="text-lg text-[#3d3226] mb-2">
                                                    {post.title}
                                                </h4>
                                                <div className="flex items-center gap-4 text-sm text-[#6b5d4f]">
                                                    <span>
                                                        {formatDate(
                                                            post.createDt,
                                                        )}
                                                    </span>
                                                    <span>
                                                        조회 {post.viewCount}
                                                    </span>
                                                    <span>
                                                        댓글 {post.commentCount}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) =>
                                                        handleIconClick(
                                                            e,
                                                            post.postId,
                                                            'community-edit',
                                                            () =>
                                                                handleCommunityEditClick(
                                                                    post.postId,
                                                                ),
                                                        )
                                                    }
                                                    className={`p-1 hover:bg-gray-100 rounded-full transition-transform duration-200 hover:scale-110 ${
                                                        shakingIcon.id ===
                                                            post.postId &&
                                                        shakingIcon.type ===
                                                            'community-edit'
                                                            ? 'animate-shake'
                                                            : ''
                                                    }`}
                                                >
                                                    <PenIcon
                                                        size={18}
                                                        className="text-green-600"
                                                    />
                                                </button>
                                                <button
                                                    onClick={(e) =>
                                                        handleIconClick(
                                                            e,
                                                            post.postId,
                                                            'community-delete',
                                                            () =>
                                                                handleCommunityDeleteClick(
                                                                    post.postId,
                                                                ),
                                                        )
                                                    }
                                                    className={`p-1 hover:bg-gray-100 rounded-full transition-transform duration-200 hover:scale-110 ${
                                                        shakingIcon.id ===
                                                            post.postId &&
                                                        shakingIcon.type ===
                                                            'community-delete'
                                                            ? 'animate-shake'
                                                            : ''
                                                    }`}
                                                >
                                                    <Trash2Icon
                                                        size={18}
                                                        className="text-red-500"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {communityHasNext && (
                                    <button
                                        onClick={handleLoadMoreCommunity}
                                        disabled={communityLoading}
                                        className="w-full py-3 bg-[#f5f1eb] hover:bg-[#ebe5db] text-[#3d3226] rounded-lg border-2 border-[#d4cbbf] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {communityLoading ? (
                                            <>
                                                <Loader2
                                                    className="animate-spin"
                                                    size={18}
                                                />
                                                로딩 중...
                                            </>
                                        ) : (
                                            '더보기'
                                        )}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}

                {myProfilePostType === 'comments' && (
                    <div className="space-y-4">
                        {myCommentList?.length > 0 ? (
                            myCommentList.map((comment) => (
                                <div
                                    key={comment.commentId}
                                    className="relative p-4 bg-[#ebe5db] rounded-lg border-2 border-[#d4cbbf] hover:border-[#3d3226] transition-colors"
                                >
                                    <div
                                        onClick={() => {
                                            if (
                                                comment.targetType ===
                                                targetData[1]
                                            )
                                                onRecipeClick?.(
                                                    comment.targetId,
                                                );
                                            if (
                                                comment.targetType ===
                                                targetData[2]
                                            )
                                                onCommunityPostClick?.(
                                                    comment.targetId,
                                                );
                                        }}
                                        className="cursor-pointer pr-10"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                    comment.targetType ===
                                                    targetData[1]
                                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                                                        : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                                                }`}
                                            >
                                                {comment.targetType ===
                                                targetData[1]
                                                    ? '📋 레시피'
                                                    : '💬 커뮤니티'}
                                            </span>
                                            <span className="text-sm text-[#6b5d4f]">
                                                제목 : {comment?.title}
                                            </span>
                                        </div>
                                        <p className="text-[#3d3226] mb-2">
                                            {comment?.content}
                                        </p>
                                        <p className="text-xs text-[#6b5d4f]">
                                            {comment?.date}
                                        </p>
                                    </div>

                                    <button
                                        onClick={(e) =>
                                            handleIconClick(
                                                e,
                                                comment.commentId,
                                                'delete',
                                                () =>
                                                    handleCommentDeleteClick(
                                                        comment.commentId,
                                                    ),
                                            )
                                        }
                                        className={`absolute top-2 right-2 p-1 hover:cursor-pointer hover:bg-gray-100 rounded-full transition-transform duration-200 hover:scale-110 ${
                                            shakingIcon.id ===
                                                comment.commentId &&
                                            shakingIcon.type === 'delete'
                                                ? 'animate-shake'
                                                : ''
                                        }`}
                                        title="댓글 삭제"
                                    >
                                        <Trash2Icon
                                            size={24}
                                            className="text-red-500"
                                        />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-[#6b5d4f] py-8">
                                작성한 댓글이 없습니다.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
