import { useState, useEffect, useRef } from 'react';
import { Trash2, Mail } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useQueryClient } from '@tanstack/react-query';
import { usePrincipalState } from '../../store/usePrincipalState';
import {
    addRecipeComment,
    deleteComment,
    getGetRecipeCommentListByTargetQueryKey,
} from '../../apis/generated/comment-controller/comment-controller';
import { formatDate } from '../../apis/utils/formatDate';

export default function RecipeComment({
    comments,
    onOpenAuth,
    onNavigate,
    recipeDetail,
}) {
    const [newComment, setNewComment] = useState('');
    const [showEmailWarning, setShowEmailWarning] = useState(false);
    const [showEmptyWarning, setShowEmptyWarning] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        let timer;
        if (showEmptyWarning) {
            timer = setTimeout(() => {
                setShowEmptyWarning(false);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [showEmptyWarning]);

    const { principal } = usePrincipalState();
    const isLoggedIn = !!principal;
    const queryClient = useQueryClient();

    const handleCommentSubmit = async () => {
        if (!isLoggedIn || !principal) {
            alert('잘못된 접근 입니다.');
            if (onOpenAuth) onOpenAuth();
            return;
        }

        // Check email verification (roleId 1 or 2)
        const hasValidRole =
            principal.userRoles.filter(
                (role) => role.roleId === 1 || role.roleId === 2,
            ).length > 0;

        if (!hasValidRole) {
            alert('이메일 인증이 필요합니다.');
            setShowEmailWarning(true);
            return;
        }

        if (newComment.trim() === '') {
            setShowEmptyWarning(true);
            textareaRef.current?.focus();
            return;
        }

        try {
            const response = await addRecipeComment(recipeDetail.recipeId, {
                content: newComment,
            });
            // console.log('Submit comment:', response?.data?.data);
            setNewComment('');
            // alert('댓글이 등록되었습니다.');
            await queryClient.invalidateQueries({
                queryKey: getGetRecipeCommentListByTargetQueryKey(
                    recipeDetail.recipeId,
                ),
            });
        } catch (error) {
            console.error('Failed to add comment:', error);
            alert('댓글 등록 중 오류가 발생했습니다.');
        }
    };

    const handleGoToProfile = () => {
        setShowEmailWarning(false);
        onNavigate('profile');
    };

    const [shakingCommentId, setShakingCommentId] = useState(null);

    const handleCommentDelete = async (commentId) => {
        setShakingCommentId(commentId);

        // Wait for animation (400ms)
        await new Promise((resolve) => setTimeout(resolve, 400));
        setShakingCommentId(null);

        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await deleteComment(commentId);
            await queryClient.invalidateQueries({
                queryKey: getGetRecipeCommentListByTargetQueryKey(
                    recipeDetail.recipeId,
                ),
            });
        } catch (error) {
            console.error('Failed to delete comment:', error);
            alert('댓글 삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <>
            {/* Comments */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] p-8 mt-8">
                <h2 className="text-2xl mb-4 text-[#3d3226]">댓글</h2>
                <div className="space-y-4">
                    {comments &&
                        comments.map((comment) => {
                            const isMine = principal?.userId === comment.userId;
                            return (
                                <div
                                    key={comment.commentId || comment.id}
                                    className="flex items-center gap-4"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#3d3226] text-[#f5f1eb] rounded-full flex items-center justify-center font-bold overflow-hidden">
                                        <ImageWithFallback
                                            src={
                                                comment.profileImgUrl ||
                                                `https://picsum.photos/seed/${comment.userId}/200`
                                            }
                                            alt={String(comment.userId)}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-1">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-[#3d3226]">
                                                    {comment.username}
                                                </span>
                                                <span className="text-xs text-[#9c9489]">
                                                    {formatDate(
                                                        comment.createDt,
                                                    )}
                                                </span>
                                            </div>
                                            {isMine && (
                                                <button
                                                    onClick={() =>
                                                        handleCommentDelete(
                                                            comment.commentId ||
                                                                comment.id,
                                                        )
                                                    }
                                                    className={`hover:text-red-700 transition-colors ${
                                                        shakingCommentId ===
                                                        (comment.commentId ||
                                                            comment.id)
                                                            ? 'text-red-700 animate-shake'
                                                            : 'text-red-500'
                                                    }`}
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-lg text-[#6b5d4f] leading-relaxed">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <div className="mt-6 relative">
                    <textarea
                        ref={textareaRef}
                        value={newComment}
                        onChange={(e) => {
                            setNewComment(e.target.value);
                            if (showEmptyWarning) setShowEmptyWarning(false);
                        }}
                        placeholder="댓글을 입력하세요..."
                        className="w-full p-4 border-2 border-[#d4cbbf] rounded-lg focus:outline-none focus:border-[#3d3226]"
                    />
                    {/* Empty Content Warning Tooltip */}
                    <div
                        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out pointer-events-none ${
                            showEmptyWarning
                                ? 'opacity-100 translate-y-[-50%]'
                                : 'opacity-0 translate-y-[-40%]'
                        }`}
                    >
                        <div className="bg-[#3d3226]/90 text-[#f5f1eb] px-6 py-3 rounded-full shadow-xl flex items-center gap-3 backdrop-blur-sm whitespace-nowrap">
                            <span className="text-xl">✍️</span>
                            <span className="font-medium">
                                댓글 내용을 입력해주세요.
                            </span>
                        </div>
                    </div>

                    <button
                        // onClick={handleCommentSubmit}
                        className="mt-4 px-6 py-3 bg-[#3d3226] text-[#f5f1eb] rounded-md hover:bg-[#5c4c40] transition-colors"
                    >
                        댓글 작성
                    </button>
                </div>
            </div>

            {/* Email Verification Warning Modal */}
            {showEmailWarning && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full border-2 border-[#e5dfd5]">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-t-lg">
                            <h3 className="text-xl font-bold">
                                이메일 인증 필요
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <Mail
                                        size={24}
                                        className="text-emerald-600"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[#3d3226] mb-2">
                                        댓글 작성을 위해서는 이메일 인증이
                                        필요합니다.
                                    </p>
                                    <p className="text-sm text-[#6b5d4f]">
                                        프로필 페이지에서 이메일 인증을
                                        완료해주세요.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowEmailWarning(false)}
                                    className="flex-1 px-4 py-3 border-2 border-[#d4cbbf] text-[#3d3226] rounded-md hover:border-[#3d3226] transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleGoToProfile}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md hover:from-emerald-600 hover:to-teal-700 transition-colors shadow-md"
                                >
                                    이메일 인증하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </>
    );
}
