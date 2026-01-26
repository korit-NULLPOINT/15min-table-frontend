import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrincipalState } from '../../store/usePrincipalState';
import { currentUserCommunityPosts } from '../../utils/recipeData';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { formatDate } from '../../apis/utils/formatDate';
import { Pen, PenIcon, Trash2Icon, Trash2, FileText } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
    removeRecipe,
    useGetRecipeList,
} from '../../apis/generated/recipe-controller/recipe-controller';
import {
    useGetMyCommentList,
    deleteComment,
    getGetMyCommentListQueryKey,
} from '../../apis/generated/comment-controller/comment-controller';
import {
    useGetMyRecipeList,
    getGetMyRecipeListQueryKey,
} from '../../apis/generated/user-recipe-controller/user-recipe-controller';

export default function UserProfileMyPosts({
    onRecipeClick,
    onCommunityPostClick,
    myCommentList,
    myPostList,
    recipeList,
}) {
    const principal = usePrincipalState((s) => s.principal);
    const [myProfilePostType, setMyProfilePostType] = useState('recipe');
    const [shakingIcon, setShakingIcon] = useState({ id: null, type: null });
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handleIconClick = (e, id, type, action) => {
        e.stopPropagation();
        setShakingIcon({ id, type });
        setTimeout(() => {
            setShakingIcon({ id: null, type: null });
            action?.();
        }, 400);
    };

    const handleEditClick = (recipeId) => {
        navigate(`/boards/1/recipe/${recipeId}/edit`);
    };

    const handleDeleteClick = async (recipeId) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await removeRecipe(1, recipeId);
                await queryClient.invalidateQueries({
                    queryKey: getGetMyRecipeListQueryKey(),
                });
                // alert('삭제되었습니다.');
            } catch (error) {
                console.error('Failed to delete recipe:', error);
                alert('삭제 중 오류가 발생했습니다.');
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
                // alert('삭제되었습니다.');
            } catch (error) {
                console.error('Failed to delete comment:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }
    };

    // Fetch recipes for current user
    // console.log(myPostList);
    // console.log(recipeList);

    // console.log(myPostList);
    // console.log(myCommentList);

    // Mock community posts
    const myCommunityPosts = currentUserCommunityPosts;

    return (
        // 1. Remove global px-8 py-6. 2. Sticky header wrapper with background and padding.
        <div>
            <div className="sticky top-0 z-10 bg-white px-8 pt-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center">
                            <FileText size={20} />
                        </div>
                        <h3 className="text-xl text-[#3d3226]">
                            내가 작성한 게시글
                        </h3>
                    </div>

                    <div className="flex gap-2 bg-[#ebe5db] p-1 rounded-md border-2 border-[#d4cbbf]">
                        <button
                            onClick={() => setMyProfilePostType('recipe')}
                            className={`w-24 px-4 py-2 rounded-md transition-colors ${
                                myProfilePostType === 'recipe'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                    : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                            }`}
                        >
                            레시피
                        </button>
                        <button
                            onClick={() => setMyProfilePostType('comments')}
                            className={`w-24 px-4 py-2 rounded-md transition-colors ${
                                myProfilePostType === 'comments'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                    : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                            }`}
                        >
                            댓글
                        </button>
                        <button
                            onClick={() => setMyProfilePostType('community')}
                            className={`w-24 px-4 py-2 rounded-md transition-colors ${
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

            <div className="px-8 pb-4 bg-white">
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
                        {myCommunityPosts.map((post) => (
                            <div
                                key={post.id}
                                onClick={() => onCommunityPostClick?.(post.id)}
                                className="cursor-pointer p-6 bg-white rounded-lg border-2 border-[#e5dfd5] hover:border-[#3d3226] transition-colors"
                            >
                                <h4 className="text-lg text-[#3d3226] mb-2">
                                    {post.title}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-[#6b5d4f]">
                                    <span>{post.date}</span>
                                    <span>조회 {post.views}</span>
                                    <span>댓글 {post.comments}</span>
                                </div>
                            </div>
                        ))}
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
                                                comment.boardId === 1 ||
                                                !comment.boardId
                                            )
                                                onRecipeClick?.(
                                                    comment.recipeId,
                                                );
                                            if (comment.boardId === 2)
                                                onCommunityPostClick?.(
                                                    comment?.postId,
                                                );
                                        }}
                                        className="cursor-pointer pr-10"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                    comment?.boardId === 1 ||
                                                    !comment?.boardId
                                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                                                        : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                                                }`}
                                            >
                                                {comment?.boardId === 1 ||
                                                !comment?.boardId
                                                    ? '📋 레시피'
                                                    : '💬 커뮤니티'}
                                            </span>
                                            <span className="text-sm text-[#6b5d4f]">
                                                게시글 :
                                                {
                                                    recipeList?.find(
                                                        (recipe) =>
                                                            recipe.recipeId ===
                                                            Number(
                                                                comment?.recipeId,
                                                            ),
                                                    )?.title
                                                }
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
