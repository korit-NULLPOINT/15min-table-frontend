import { useState } from 'react';
import { ArrowLeft, User as UserIcon } from 'lucide-react';
import {
    otherUserCommunityPosts,
    otherUserRecipePosts,
} from '../utils/recipeData';

export function OtherUserProfile({
    userId,
    username, // (선택) 추후 fetch 후 넣어줄 값
    onNavigate,
    onRecipeClick,
    onCommunityPostClick,
}) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [postType, setPostType] = useState('recipe'); // 'recipe' | 'community'

    // ✅ userId만 있어도 화면 안 깨지게
    const displayName = username?.trim() ? username : `사용자#${userId ?? '?'}`;

    // Mock user posts (추후 API로 교체)
    const userRecipePosts = otherUserRecipePosts;
    const userCommunityPosts = otherUserCommunityPosts;

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => onNavigate?.('back')}
                    className="flex items-center gap-2 mb-6 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md">
                    <ArrowLeft size={20} />
                    돌아가기
                </button>

                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#3d3226] text-[#f5f1eb] px-8 py-6">
                        <h1 className="text-3xl mb-2">
                            {displayName}님의 프로필
                        </h1>
                        <p className="text-[#e5dfd5]">
                            작성한 게시글을 확인해보세요
                        </p>
                    </div>

                    {/* Profile Info */}
                    <div className="p-8">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-32 h-32 rounded-full border-4 border-[#d4cbbf] overflow-hidden bg-[#ebe5db] flex items-center justify-center">
                                <UserIcon
                                    size={48}
                                    className="text-[#6b5d4f]"
                                />
                            </div>
                            <h2 className="text-2xl text-[#3d3226] mt-4">
                                {displayName}
                            </h2>

                            {/* Followers / Following (추후 API로 교체) */}
                            <div className="flex gap-6 mt-4">
                                <div className="flex flex-col items-center gap-1 px-4 py-2">
                                    <span className="text-2xl font-bold text-[#3d3226]">
                                        84
                                    </span>
                                    <span className="text-sm text-[#6b5d4f]">
                                        팔로워
                                    </span>
                                </div>
                                <div className="w-px bg-[#d4cbbf]" />
                                <div className="flex flex-col items-center gap-1 px-4 py-2">
                                    <span className="text-2xl font-bold text-[#3d3226]">
                                        52
                                    </span>
                                    <span className="text-sm text-[#6b5d4f]">
                                        팔로잉
                                    </span>
                                </div>
                            </div>

                            {/* Follow Button */}
                            <button
                                onClick={() => setIsFollowing((prev) => !prev)}
                                className={`mt-6 px-8 py-3 rounded-md transition-colors ${
                                    isFollowing
                                        ? 'bg-[#3d3226] text-[#f5f1eb] hover:bg-[#5d4a36]'
                                        : 'border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb]'
                                }`}>
                                {isFollowing ? '팔로잉' : '팔로우'}
                            </button>
                        </div>

                        {/* Posts */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl text-[#3d3226]">
                                    {displayName}님이 작성한 게시글
                                </h3>

                                {/* ✅ MyProfile 스타일 토글 */}
                                <div className="flex gap-2 bg-[#ebe5db] p-1 rounded-md border-2 border-[#d4cbbf]">
                                    <button
                                        onClick={() => setPostType('recipe')}
                                        className={`px-4 py-2 rounded-md transition-colors ${
                                            postType === 'recipe'
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                                : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                                        }`}>
                                        레시피 게시판
                                    </button>
                                    <button
                                        onClick={() => setPostType('community')}
                                        className={`px-4 py-2 rounded-md transition-colors ${
                                            postType === 'community'
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                                : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                                        }`}>
                                        커뮤니티
                                    </button>
                                </div>
                            </div>

                            {/* Recipe Posts */}
                            {postType === 'recipe' && (
                                <div className="grid grid-cols-2 gap-4">
                                    {userRecipePosts.map((post) => (
                                        <div
                                            key={post.id}
                                            onClick={() =>
                                                onRecipeClick?.(post.id)
                                            }
                                            className="cursor-pointer bg-white rounded-lg overflow-hidden border-2 border-[#e5dfd5] hover:border-[#3d3226] transition-colors">
                                            <img
                                                src={post.thumbnail}
                                                alt={post.title}
                                                className="w-full aspect-video object-cover"
                                            />
                                            <div className="p-4">
                                                <h4 className="text-lg text-[#3d3226] mb-2">
                                                    {post.title}
                                                </h4>
                                                <p className="text-sm text-[#6b5d4f]">
                                                    {post.date}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Community Posts */}
                            {postType === 'community' && (
                                <div className="space-y-4">
                                    {userCommunityPosts.map((post) => (
                                        <div
                                            key={post.id}
                                            onClick={() =>
                                                onCommunityPostClick?.(post.id)
                                            }
                                            className="cursor-pointer p-6 bg-white rounded-lg border-2 border-[#e5dfd5] hover:border-[#3d3226] transition-colors">
                                            <h4 className="text-lg text-[#3d3226] mb-2">
                                                {post.title}
                                            </h4>
                                            <div className="flex items-center gap-4 text-sm text-[#6b5d4f]">
                                                <span>{post.date}</span>
                                                <span>조회 {post.views}</span>
                                                <span>
                                                    댓글 {post.comments}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
