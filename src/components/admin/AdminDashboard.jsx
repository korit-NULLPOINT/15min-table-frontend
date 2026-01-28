import { Users, BookOpen, MessageSquare } from 'lucide-react';

export function AdminDashboard() {
  // Mock 데이터
  const stats = [
    {
      title: '전체 사용자 수',
      value: '1,234',
      icon: Users,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      title: '전체 레시피 수',
      value: '856',
      icon: BookOpen,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      title: '커뮤니티 게시글 수',
      value: '2,431',
      icon: MessageSquare,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[#3d3226] mb-2">대시보드</h1>
        <p className="text-[#6b5d4f]">십오분:식탁 관리 현황</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} border-2 ${stat.borderColor} rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#6b5d4f] text-sm mb-2">{stat.title}</p>
                  <p className={`text-3xl ${stat.iconColor} font-serif`}>{stat.value}</p>
                </div>
                <div className={`p-3 ${stat.iconColor} bg-white rounded-lg border-2 ${stat.borderColor}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 최근 활동 요약 (간단한 버전) */}
      <div className="mt-8 bg-white rounded-lg border-2 border-[#d4cbbf] p-6">
        <h2 className="text-xl font-serif text-[#3d3226] mb-4">최근 활동</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-[#e5dfd5]">
            <div>
              <p className="text-[#3d3226]">새로운 회원가입</p>
              <p className="text-sm text-[#6b5d4f]">홍길동님이 가입했습니다</p>
            </div>
            <span className="text-sm text-[#6b5d4f]">5분 전</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[#e5dfd5]">
            <div>
              <p className="text-[#3d3226]">새로운 레시피 등록</p>
              <p className="text-sm text-[#6b5d4f]">"김치찌개 레시피" 등록</p>
            </div>
            <span className="text-sm text-[#6b5d4f]">10분 전</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-[#3d3226]">커뮤니티 게시글</p>
              <p className="text-sm text-[#6b5d4f]">"요리 초보자 질문" 게시글 등록</p>
            </div>
            <span className="text-sm text-[#6b5d4f]">15분 전</span>
          </div>
        </div>
      </div>
    </div>
  );
}
