import { useState } from 'react';
import { ArrowLeft, User as UserIcon } from 'lucide-react';

export function OtherUserProfile({ username, onNavigate, onRecipeClick }) {
    const [isFollowing, setIsFollowing] = useState(false);

    // Mock user posts
    const userPosts = [
        { id: 1, title: '초간단 김치볶음밥', date: '2026.01.10', thumbnail: 'https://images.unsplash.com/photo-1626803774007-f92c2c32cbe7?w=400' },
        { id: 2, title: '크림 파스타 레시피', date: '2026.01.08', thumbnail: 'https://images.unsplash.com/photo-1587740907856-997a958a68ac?w=400' },
        { id: 3, title: '5분만에 완성 덮밥', date: '2026.01.05', thumbnail: 'https://images.unsplash.com/photo-1763844668895-6931b4e09458?w=400' },
    ];

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center gap-2 mb-6 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
                >
                    <ArrowLeft size={20} />
                    돌아가기
                </button>

                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#3d3226] text-[#f5f1eb] px-8 py-6">
                        <h1 className="text-3xl mb-2">{username}님의 프로필</h1>
                        <p className="text-[#e5dfd5]">작성한 레시피를 확인해보세요</p>
                    </div>

                    {/* Profile Info */}
                    <div className="p-8">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-32 h-32 rounded-full border-4 border-[#d4cbbf] overflow-hidden bg-[#ebe5db] flex items-center justify-center">
                                <UserIcon size={48} className="text-[#6b5d4f]" />
                            </div>
                            <h2 className="text-2xl text-[#3d3226] mt-4">{username}</h2>

                            {/* Followers / Following */}
                            <div className="flex gap-6 mt-4">
                                <div className="flex flex-col items-center gap-1 px-4 py-2">
                                    <span className="text-2xl font-bold text-[#3d3226]">84</span>
                                    <span className="text-sm text-[#6b5d4f]">팔로워</span>
                                </div>
                                <div className="w-px bg-[#d4cbbf]" />
                                <div className="flex flex-col items-center gap-1 px-4 py-2">
                                    <span className="text-2xl font-bold text-[#3d3226]">52</span>
                                    <span className="text-sm text-[#6b5d4f]">팔로잉</span>
                                </div>
                            </div>

                            {/* Follow Button */}
                            <button
                                onClick={() => setIsFollowing(!isFollowing)}
                                className={`mt-6 px-8 py-3 rounded-md transition-colors ${isFollowing
                                    ? 'bg-[#3d3226] text-[#f5f1eb] hover:bg-[#5d4a36]'
                                    : 'border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb]'
                                    }`}
                            >
                                {isFollowing ? '팔로잉' : '팔로우'}
                            </button>
                        </div>

                        {/* User Posts */}
                        <div>
                            <h3 className="text-xl mb-6 text-[#3d3226]">{username}님이 작성한 레시피</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {userPosts.map(post => (
                                    <div
                                        key={post.id}
                                        onClick={() => onRecipeClick && onRecipeClick(post.id)}
                                        className="cursor-pointer bg-white rounded-lg overflow-hidden border-2 border-[#e5dfd5] hover:border-[#3d3226] transition-colors"
                                    >
                                        <img
                                            src={post.thumbnail}
                                            alt={post.title}
                                            className="w-full aspect-video object-cover"
                                        />
                                        <div className="p-4">
                                            <h4 className="text-lg text-[#3d3226] mb-2">{post.title}</h4>
                                            <p className="text-sm text-[#6b5d4f]">{post.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
