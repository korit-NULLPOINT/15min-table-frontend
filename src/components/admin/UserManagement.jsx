import { useState } from 'react';
import { Search, Ban, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock 사용자 데이터
  const [users, setUsers] = useState([
    {
      id: 1,
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      nickname: '김철수',
      email: 'kim@example.com',
      joinDate: '2025-01-15',
      isBlocked: false,
    },
    {
      id: 2,
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      nickname: '이영희',
      email: 'lee@example.com',
      joinDate: '2025-01-20',
      isBlocked: false,
    },
    {
      id: 3,
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      nickname: '박민수',
      email: 'park@example.com',
      joinDate: '2025-01-22',
      isBlocked: true,
    },
    {
      id: 4,
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
      nickname: '최지영',
      email: 'choi@example.com',
      joinDate: '2025-01-25',
      isBlocked: false,
    },
    {
      id: 5,
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
      nickname: '정수연',
      email: 'jung@example.com',
      joinDate: '2025-01-26',
      isBlocked: false,
    },
    {
      id: 6,
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
      nickname: '강동원',
      email: 'kang@example.com',
      joinDate: '2025-01-27',
      isBlocked: false,
    },
    {
      id: 7,
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
      nickname: '윤서준',
      email: 'yoon@example.com',
      joinDate: '2025-01-28',
      isBlocked: false,
    },
  ]);

  // 검색 필터링
  const filteredUsers = users.filter(
    (user) =>
      user.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 페이지네이션
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handleToggleBlock = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, isBlocked: !user.isBlocked } : user
      )
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[#3d3226] mb-2">사용자 관리</h1>
        <p className="text-[#6b5d4f]">회원 정보 및 차단 관리</p>
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
            placeholder="닉네임 또는 이메일로 검색"
            className="w-full pl-10 pr-4 py-3 rounded-md border-2 border-[#d4cbbf] bg-white text-[#3d3226] focus:outline-none focus:border-[#3d3226] transition-colors"
          />
        </div>
      </div>

      {/* 사용자 테이블 */}
      <div className="bg-white rounded-lg border-2 border-[#d4cbbf] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#3d3226] text-[#f5f1eb]">
              <tr>
                <th className="px-6 py-4 text-left">프로필</th>
                <th className="px-6 py-4 text-left">닉네임</th>
                <th className="px-6 py-4 text-left">이메일</th>
                <th className="px-6 py-4 text-left">가입일</th>
                <th className="px-6 py-4 text-left">상태</th>
                <th className="px-6 py-4 text-center">작업</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} className="border-b border-[#e5dfd5] hover:bg-[#f5f1eb] transition-colors">
                  <td className="px-6 py-4">
                    <img
                      src={user.profileImage}
                      alt={user.nickname}
                      className="w-10 h-10 rounded-full border-2 border-[#d4cbbf]"
                    />
                  </td>
                  <td className="px-6 py-4 text-[#3d3226]">{user.nickname}</td>
                  <td className="px-6 py-4 text-[#6b5d4f]">{user.email}</td>
                  <td className="px-6 py-4 text-[#6b5d4f]">{user.joinDate}</td>
                  <td className="px-6 py-4">
                    {user.isBlocked ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm border border-red-300">
                        차단됨
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm border border-green-300">
                        활성
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleBlock(user.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors mx-auto ${
                        user.isBlocked
                          ? 'bg-green-50 text-green-700 hover:bg-green-100 border-2 border-green-300'
                          : 'bg-red-50 text-red-700 hover:bg-red-100 border-2 border-red-300'
                      }`}
                    >
                      {user.isBlocked ? (
                        <>
                          <CheckCircle size={16} />
                          <span>차단 해제</span>
                        </>
                      ) : (
                        <>
                          <Ban size={16} />
                          <span>차단</span>
                        </>
                      )}
                    </button>
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

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-[#6b5d4f]">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
}
