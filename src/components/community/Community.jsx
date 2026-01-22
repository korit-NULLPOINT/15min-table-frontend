import { ArrowLeft, MessageSquare, User } from 'lucide-react';

export function Community({ onNavigate, onPostClick }) {
    // Mock community posts
    const posts = [
        {
            id: 1,
            title: '자취 1년차 요리 초보입니다',
            author: '요리초보',
            date: '2026.01.12',
            comments: 15,
        },
        {
            id: 2,
            title: '마트 장보기 꿀팁 공유합니다',
            author: '알뜰자취생',
            date: '2026.01.11',
            comments: 23,
        },
        {
            id: 3,
            title: '혼자 먹기 좋은 식당 추천해주세요',
            author: '혼밥러버',
            date: '2026.01.10',
            comments: 8,
        },
        {
            id: 4,
            title: '냉장고 정리 어떻게 하세요?',
            author: '정리왕',
            date: '2026.01.09',
            comments: 12,
        },
        {
            id: 5,
            title: '자취생 필수 조리도구 추천',
            author: '주방고수',
            date: '2026.01.08',
            comments: 31,
        },
    ];

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-5xl mx-auto px-6 py-12">
                <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center gap-2 mb-6 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
                >
                    <ArrowLeft size={20} />
                    메인으로 돌아가기
                </button>

                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#3d3226] text-[#f5f1eb] px-8 py-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl mb-2">커뮤니티</h1>
                            <p className="text-[#e5dfd5]">
                                자취생들의 소통 공간
                            </p>
                        </div>
                        <button
                            onClick={() => onNavigate('communityWrite')}
                            className="px-6 py-3 bg-[#f5f1eb] text-[#3d3226] rounded-md hover:bg-[#e5dfd5] transition-colors"
                        >
                            글쓰기
                        </button>
                    </div>

                    {/* Posts List */}
                    <div className="divide-y-2 divide-[#e5dfd5]">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                onClick={() =>
                                    onPostClick && onPostClick(post.id)
                                }
                                className="p-6 hover:bg-[#ebe5db] cursor-pointer transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl text-[#3d3226] mb-2">
                                            {post.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-[#6b5d4f]">
                                            <span className="flex items-center gap-1">
                                                <User size={16} />
                                                {post.author}
                                            </span>
                                            <span>{post.date}</span>
                                            <span className="flex items-center gap-1">
                                                <MessageSquare size={16} />
                                                {post.comments}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
