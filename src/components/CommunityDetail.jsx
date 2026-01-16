import { ArrowLeft, MessageSquare, User, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Mock community posts data
const communityPosts = {
    1: {
        id: 1,
        title: '자취 1년차 요리 초보입니다',
        author: '요리초보',
        date: '2026.01.12',
        content: `안녕하세요! 자취를 시작한 지 1년이 되었는데요, 아직도 요리가 너무 어렵네요 😅

특히 양념 비율을 맞추는 게 제일 어려운 것 같아요. 레시피대로 해도 왜인지 맛이 다르게 나오더라구요.

혹시 요리 초보 분들은 어떻게 연습하셨나요? 
추천하는 요리나 꿀팁 있으면 공유 부탁드립니다!`,
        comments: [
            { id: 1, author: '요리고수', date: '2026.01.12', content: '처음엔 저도 그랬어요! 간단한 요리부터 시작하시는 게 좋아요. 김치볶음밥이나 라면같은 거 먼저 마스터하세요!' },
            { id: 2, author: '자취5년차', date: '2026.01.12', content: '양념 비율은 계량스푼 필수입니다. 대충 넣으면 맛이 달라져요~' },
            { id: 3, author: '파스타킹', date: '2026.01.12', content: '유튜브에서 백종원님 레시피 따라하면 실패 확률이 낮아요!' },
        ],
    },
    2: {
        id: 2,
        title: '마트 장보기 꿀팁 공유합니다',
        author: '알뜰자취생',
        date: '2026.01.11',
        content: `자취하면서 장보기 할 때 절약하는 꿀팁 공유할게요!

1. 주말 저녁 시간대에 가면 할인 많이 해요
2. 마트 앱 쿠폰 꼭 챙기세요
3. 냉동식품은 대용량으로 사서 소분하면 저렴해요
4. 제철 식재료 위주로 구매하면 신선하고 저렴합니다

다들 어떻게 장보기 하시나요?`,
        comments: [
            { id: 1, author: '절약왕', date: '2026.01.11', content: '저는 장보기 전에 냉장고 정리부터 해요. 중복 구매 방지!' },
            { id: 2, author: '쿠폰러버', date: '2026.01.11', content: '마트 앱 할인 쿠폰 진짜 중요하죠! 10% 할인도 쌓이면 큰돈이에요' },
        ],
    },
    3: {
        id: 3,
        title: '혼자 먹기 좋은 식당 추천해주세요',
        author: '혼밥러버',
        date: '2026.01.10',
        content: `요즘 혼자 밥 먹으러 다니는데 눈치 보이지 않는 식당 찾기가 어렵네요.

혼밥하기 좋은 식당이나 메뉴 추천 부탁드립니다!
서울 강남 쪽이면 더 좋구요~`,
        comments: [
            { id: 1, author: '혼밥고수', date: '2026.01.10', content: '라면집이나 국밥집 추천드려요. 혼자 오는 사람 많아서 눈치 안 보여요!' },
            { id: 2, author: '맛집탐방', date: '2026.01.10', content: '강남역 근처 덮밥집들 많아요. 카운터석도 있어서 편해요' },
        ],
    },
    4: {
        id: 4,
        title: '냉장고 정리 어떻게 하세요?',
        author: '정리왕',
        date: '2026.01.09',
        content: `자취하다 보니 냉장고가 금방 지저분해지더라구요.

음식물도 자꾸 상하고... 
다들 냉장고 정리 어떻게 하시나요? 보관 팁 있으면 알려주세요!`,
        comments: [
            { id: 1, author: '깔끔이', date: '2026.01.09', content: '저는 밀폐용기에 날짜 스티커 붙여요. 언제 산 건지 확인하기 좋아요!' },
            { id: 2, author: '정리고수', date: '2026.01.09', content: '채소는 키친타올로 감싸서 보관하면 오래가요~' },
        ],
    },
    5: {
        id: 5,
        title: '자취생 필수 조리도구 추천',
        author: '주방고수',
        date: '2026.01.08',
        content: `자취 시작하시는 분들을 위해 필수 조리도구 정리해봤어요!

필수템:
- 프라이팬 (코팅 좋은 거 하나)
- 냄비 (라면 끓일 수 있는 사이즈)
- 칼, 도마
- 계량스푼
- 국자, 뒤집개

선택템:
- 전자레인지
- 에어프라이어
- 믹서기

이 정도면 웬만한 요리는 다 가능해요!`,
        comments: [
            { id: 1, author: '신입자취생', date: '2026.01.08', content: '감사합니다! 이제 막 자취 시작하는데 딱 필요한 정보네요' },
            { id: 2, author: '요리러버', date: '2026.01.08', content: '에어프라이어는 진짜 필수템이에요! 기름 안 써서 건강에도 좋아요' },
            { id: 3, author: '알뜰왕', date: '2026.01.08', content: '다이소에서 조리도구 사면 저렴해요~' },
        ],
    },
};

export function CommunityDetail({ postId, onNavigate, username }) {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState(communityPosts[postId]?.comments || []);

    const post = communityPosts[postId];

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
                        <p className="text-[#6b5d4f]">게시글을 찾을 수 없습니다.</p>
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
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
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
                                        <User size={16} className="text-[#3d3226]" />
                                    </div>
                                    <div className="flex-1 pr-8">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-[#3d3226]">{comment.author}</span>
                                            <span className="text-sm text-[#6b5d4f]">{comment.date}</span>
                                        </div>
                                        <p className="text-[#3d3226]">{comment.content}</p>
                                    </div>
                                    {username && username === comment.author && (
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
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