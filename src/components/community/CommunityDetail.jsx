import { ArrowLeft, MessageSquare, User, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    currentUserCommunityPosts,
    currentUserComments,
} from '../../utils/recipeData';

export function CommunityDetail({ postId, onNavigate, username }) {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState(
        currentUserComments.filter(
            (c) => c.postId === Number(postId) && c.type === 'community',
        ) || [],
    );

    const post = currentUserCommunityPosts[postId];

    if (!post) {
        return (
            <div className="min-h-screen bg-[#f5f1eb] pt-20">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <button
                        onClick={() => onNavigate('community')}
                        className="flex items-center gap-2 mb-6 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
                    >
                        <ArrowLeft size={20} />
                        목록으로 돌아가기
                    </button>
                    <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] p-8 text-center">
                        <p className="text-[#6b5d4f]">
                            게시글을 찾을 수 없습니다.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmitComment = () => {
        if (!newComment.trim()) return;

        const newCommentObj = {
            id: comments.length + 1,
            author: username || '현재사용자', // Use actual logged-in user nickname if provided
            date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
            content: newComment,
        };

        setComments([...comments, newCommentObj]);
        setNewComment('');
    };

    const handleDeleteComment = (commentId) => {
        setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== commentId),
        );
    };

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => onNavigate('community')}
                    className="flex items-center gap-2 mb-6 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
                >
                    <ArrowLeft size={20} />
                    목록으로 돌아가기
                </button>

                {/* Post Content */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] overflow-hidden mb-6">
                    <div className="bg-[#3d3226] text-[#f5f1eb] px-8 py-6">
                        <h1 className="text-3xl mb-3">{post.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-[#e5dfd5]">
                            <span className="flex items-center gap-1">
                                <User size={16} />
                                {post.author}
                            </span>
                            <span>{post.date}</span>
                            <span className="flex items-center gap-1">
                                <MessageSquare size={16} />
                                {comments.length}
                            </span>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="text-[#3d3226] whitespace-pre-wrap leading-relaxed">
                            {post.content}
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] overflow-hidden">
                    <div className="bg-[#ebe5db] px-8 py-4 border-b-2 border-[#e5dfd5]">
                        <h2 className="text-xl text-[#3d3226] flex items-center gap-2">
                            <MessageSquare size={20} />
                            댓글 {comments.length}
                        </h2>
                    </div>

                    {/* Comments List */}
                    <div className="divide-y-2 divide-[#e5dfd5]">
                        {comments.map((comment) => (
                            <div key={comment.id} className="relative p-6">
                                <div className="flex items-start gap-3 mb-2">
                                    <div className="w-8 h-8 bg-[#d4cbbf] rounded-full flex items-center justify-center flex-shrink-0">
                                        <User
                                            size={16}
                                            className="text-[#3d3226]"
                                        />
                                    </div>
                                    <div className="flex-1 pr-8">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-[#3d3226]">
                                                {comment.author}
                                            </span>
                                            <span className="text-sm text-[#6b5d4f]">
                                                {comment.date}
                                            </span>
                                        </div>
                                        <p className="text-[#3d3226]">
                                            {comment.content}
                                        </p>
                                    </div>
                                    {username &&
                                        username === comment.author && (
                                            <button
                                                onClick={() =>
                                                    handleDeleteComment(
                                                        comment.id,
                                                    )
                                                }
                                                className="absolute top-4 right-4 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                                title="댓글 삭제"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comment Input */}
                    <div className="p-6 bg-[#ebe5db] border-t-2 border-[#e5dfd5]">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 입력하세요..."
                            className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:outline-none focus:border-[#3d3226] resize-none bg-white"
                            rows={3}
                        />
                        <div className="flex justify-end mt-3">
                            <button
                                onClick={handleSubmitComment}
                                className="px-6 py-2 bg-[#3d3226] text-[#f5f1eb] rounded-md hover:bg-[#5d4a36] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!newComment.trim()}
                            >
                                댓글 작성
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
