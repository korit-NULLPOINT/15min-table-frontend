import { useState } from 'react';
import { Search, EyeOff, Trash2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export function CommunityManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock 커뮤니티 게시글 데이터
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: '요리 초보자인데 추천 레시피 있나요?',
      author: '김철수',
      date: '2025-01-28',
      views: 234,
      comments: 12,
      isHidden: false,
    },
    {
      id: 2,
      title: '오늘 만든 김치볶음밥 인증합니다',
      author: '이영희',
      date: '2025-01-27',
      views: 456,
      comments: 23,
      isHidden: false,
    },
    {
      id: 3,
      title: '냉장고 파먹기 도전 중!',
      author: '박민수',
      date: '2025-01-26',
      views: 789,
      comments: 34,
      isHidden: true,
    },
    {
      id: 4,
      title: '자취생 필수 조미료 추천해주세요',
      author: '최지영',
      date: '2025-01-25',
      views: 567,
      comments: 45,
      isHidden: false,
    },
    {
      id: 5,
      title: '계란 요리 100가지 도전기',
      author: '정수연',
      date: '2025-01-24',
      views: 321,
      comments: 18,
      isHidden: false,
    },
    {
      id: 6,
      title: '자취방 주방 정리 팁',
      author: '강동원',
      date: '2025-01-23',
      views: 890,
      comments: 27,
      isHidden: false,
    },
    {
      id: 7,
      title: '1인분 요리 레시피 공유',
      author: '윤서준',
      date: '2025-01-22',
      views: 654,
      comments: 31,
      isHidden: false,
    },
    {
      id: 8,
      title: '편의점 재료로 만드는 요리',
      author: '김철수',
      date: '2025-01-21',
      views: 432,
      comments: 15,
      isHidden: false,
    },
  ]);

  // 검색 필터링
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 페이지네이션
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handleToggleHide = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, isHidden: !post.isHidden } : post
      )
    );
  };

  const handleDelete = (postId) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      setPosts(posts.filter((post) => post.id !== postId));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[#3d3226] mb-2">커뮤니티 관리</h1>
        <p className="text-[#6b5d4f]">커뮤니티 게시글 숨김 및 삭제 관리</p>
      </div>

      {/* 검색 */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b5d4f]" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="제목 또는 작성자로 검색"
            className="w-full pl-10 pr-4 py-3 rounded-md border-2 border-[#d4cbbf] bg-white text-[#3d3226] focus:outline-none focus:border-[#3d3226] transition-colors"
          />
        </div>
      </div>

      {/* 게시글 테이블 */}
      <div className="bg-white rounded-lg border-2 border-[#d4cbbf] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#3d3226] text-[#f5f1eb]">
              <tr>
                <th className="px-6 py-4 text-left">제목</th>
                <th className="px-6 py-4 text-left">작성자</th>
                <th className="px-6 py-4 text-left">작성일</th>
                <th className="px-6 py-4 text-left">조회수</th>
                <th className="px-6 py-4 text-left">댓글</th>
                <th className="px-6 py-4 text-left">상태</th>
                <th className="px-6 py-4 text-center">작업</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post) => (
                <tr key={post.id} className="border-b border-[#e5dfd5] hover:bg-[#f5f1eb] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-[#3d3226] max-w-md truncate">
                      {post.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#6b5d4f]">{post.author}</td>
                  <td className="px-6 py-4 text-[#6b5d4f]">{post.date}</td>
                  <td className="px-6 py-4 text-[#6b5d4f]">{post.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-[#6b5d4f]">{post.comments}</td>
                  <td className="px-6 py-4">
                    {post.isHidden ? (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-300">
                        숨김
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm border border-green-300">
                        공개
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleToggleHide(post.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                          post.isHidden
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-2 border-blue-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-300'
                        }`}
                        title={post.isHidden ? '공개' : '숨김'}
                      >
                        {post.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 border-2 border-red-300 rounded-md transition-colors"
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-[#e5dfd5]">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-[#f5f1eb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="text-[#3d3226]" size={20} />
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    currentPage === index + 1
                      ? 'bg-[#3d3226] text-[#f5f1eb]'
                      : 'hover:bg-[#f5f1eb] text-[#3d3226]'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md hover:bg-[#f5f1eb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="text-[#3d3226]" size={20} />
            </button>
          </div>
        )}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 text-[#6b5d4f]">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
}
