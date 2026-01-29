import { Users, BookOpen, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../../apis/adminStats';

import AdminLineChart from './AdminLineChart';
import AdminMultiLineChart from './charts/AdminMultiLineChart';

export function AdminDashboard() {
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [range, setRange] = useState('ALL'); // 전체/주/월/년
    const [chartData, setChartData] = useState([]);
    const [statsData, setStatsData] = useState(null);

    const mockData = {
        USER: {
            ALL: [
                { label: '1월', value: 50 },
                { label: '2월', value: 80 },
                { label: '3월', value: 100 },
            ],
            WEEK: [
                { label: '월', value: 5 },
                { label: '화', value: 8 },
                { label: '수', value: 12 },
                { label: '목', value: 9 },
                { label: '금', value: 15 },
                { label: '토', value: 20 },
                { label: '일', value: 18 },
            ],
            MONTH: [
                { label: '1주', value: 20 },
                { label: '2주', value: 30 },
                { label: '3주', value: 40 },
                { label: '4주', value: 50 },
            ],
            YEAR: [
                { label: '2022', value: 300 },
                { label: '2023', value: 500 },
                { label: '2024', value: 800 },
            ],
        },

        RECIPE: {
            ALL: [
                { label: '1월', value: 30 },
                { label: '2월', value: 60 },
                { label: '3월', value: 90 },
            ],
            WEEK: [
                { label: '월', value: 2 },
                { label: '화', value: 4 },
                { label: '수', value: 6 },
                { label: '목', value: 5 },
                { label: '금', value: 7 },
                { label: '토', value: 10 },
                { label: '일', value: 9 },
            ],
            MONTH: [
                { label: '1주', value: 10 },
                { label: '2주', value: 20 },
                { label: '3주', value: 30 },
                { label: '4주', value: 40 },
            ],
            YEAR: [
                { label: '2022', value: 200 },
                { label: '2023', value: 400 },
                { label: '2024', value: 700 },
            ],
        },

        COMMUNITY: {
            ALL: [
                { label: '1월', value: 40 },
                { label: '2월', value: 70 },
                { label: '3월', value: 110 },
            ],
            WEEK: [
                { label: '월', value: 3 },
                { label: '화', value: 6 },
                { label: '수', value: 9 },
                { label: '목', value: 7 },
                { label: '금', value: 11 },
                { label: '토', value: 14 },
                { label: '일', value: 13 },
            ],
            MONTH: [
                { label: '1주', value: 15 },
                { label: '2주', value: 25 },
                { label: '3주', value: 35 },
                { label: '4주', value: 45 },
            ],
            YEAR: [
                { label: '2022', value: 250 },
                { label: '2023', value: 450 },
                { label: '2024', value: 900 },
            ],
        },
    };

    // Mock 데이터
    const stats = [
        {
            title: '전체 사용자 수',
            value: statsData?.totalUsers ?? '-',
            icon: Users,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-200',
            type: 'users',
        },
        {
            title: '전체 레시피 수',
            value: statsData?.totalRecipes ?? '-',
            icon: BookOpen,
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            borderColor: 'border-green-200',
            type: 'recipes',
        },
        {
            title: '커뮤니티 게시글 수',
            value: statsData?.totalCommunityPosts ?? '-',
            icon: MessageSquare,
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            borderColor: 'border-purple-200',
            type: 'community',
        },
    ];
    const handleMetricClick = (nextMetric) => {
        setSelectedMetric((prev) => (prev === nextMetric ? null : nextMetric));
    };

    useEffect(() => {
        if (selectedMetric === null) return;
        const next = mockData?.[selectedMetric]?.[range] || [];
        setChartData(next);
    }, [selectedMetric, range]);

    useEffect(() => {
        fetchDashboardStats().then((res) => {
            setStatsData(res.data.data);
        });
    }, []);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-serif text-[#3d3226] mb-2">
                    대시보드
                </h1>
                <p className="text-[#6b5d4f]">십오분:식탁 관리 현황</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className={`${stat.bgColor} border-2 ${stat.borderColor} rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
                            onClick={() => {
                                if (stat.type === 'users')
                                    handleMetricClick('USER');
                                if (stat.type === 'recipes')
                                    handleMetricClick('RECIPE');
                                if (stat.type === 'community')
                                    handleMetricClick('COMMUNITY');
                            }}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[#6b5d4f] text-sm mb-2">
                                        {stat.title}
                                    </p>
                                    <p
                                        className={`text-3xl ${stat.iconColor} font-serif`}
                                    >
                                        {stat.value}
                                    </p>
                                </div>
                                <div
                                    className={`p-3 ${stat.iconColor} bg-white rounded-lg border-2 ${stat.borderColor}`}
                                >
                                    <Icon size={24} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-8 bg-white border-2 border-[#d4cbbf] rounded-lg p-6">
                <h2 className="text-xl font-serif text-[#3d3226] mb-4">
                    {selectedMetric === null
                        ? '전체 현황'
                        : selectedMetric === 'USER'
                          ? '사용자 수'
                          : selectedMetric === 'RECIPE'
                            ? '레시피 수'
                            : '커뮤니티 게시글 수'}
                </h2>

                {selectedMetric === null ? (
                    <AdminMultiLineChart
                        xLabels={(mockData.USER[range] || []).map(
                            (d) => d.label,
                        )}
                        series={[
                            {
                                data: (mockData.USER[range] || []).map(
                                    (d) => d.value,
                                ),
                                color: '#4F46E5',
                                label: '사용자',
                            },
                            {
                                data: (mockData.RECIPE[range] || []).map(
                                    (d) => d.value,
                                ),
                                color: '#16A34A',
                                label: '레시피',
                            },
                            {
                                data: (mockData.COMMUNITY[range] || []).map(
                                    (d) => d.value,
                                ),
                                color: '#9333EA',
                                label: '커뮤니티',
                            },
                        ]}
                    />
                ) : (
                    <AdminLineChart
                        data={chartData}
                        color={
                            selectedMetric === 'USER'
                                ? '#3B82F6' // 파랑 (사용자)
                                : selectedMetric === 'RECIPE'
                                  ? '#22C55E' // 초록 (레시피)
                                  : '#A855F7' // 보라 (커뮤니티)
                        }
                    />
                )}
            </div>
            <div className="mt-3 flex gap-2">
                {[
                    { key: 'WEEK', label: '일' },
                    { key: 'MONTH', label: '주' },
                    { key: 'ALL', label: '월' },
                    { key: 'YEAR', label: '년' },
                ].map((r) => (
                    <button
                        key={r.key}
                        onClick={() => setRange(r.key)}
                        className={`px-3 py-1 rounded-md border text-sm ${
                            range === r.key
                                ? 'bg-[#3d3226] text-white border-[#3d3226]'
                                : 'bg-white text-[#3d3226] border-[#d4cbbf] hover:bg-[#f3eee6]'
                        }`}
                    >
                        {r.label}
                    </button>
                ))}
            </div>

            {/* 최근 활동 요약 (간단한 버전) */}
            <div className="mt-8 bg-white rounded-lg border-2 border-[#d4cbbf] p-6">
                <h2 className="text-xl font-serif text-[#3d3226] mb-4">
                    최근 활동
                </h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-[#e5dfd5]">
                        <div>
                            <p className="text-[#3d3226]">새로운 회원가입</p>
                            <p className="text-sm text-[#6b5d4f]">
                                홍길동님이 가입했습니다
                            </p>
                        </div>
                        <span className="text-sm text-[#6b5d4f]">5분 전</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#e5dfd5]">
                        <div>
                            <p className="text-[#3d3226]">새로운 레시피 등록</p>
                            <p className="text-sm text-[#6b5d4f]">
                                "김치찌개 레시피" 등록
                            </p>
                        </div>
                        <span className="text-sm text-[#6b5d4f]">10분 전</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-[#3d3226]">커뮤니티 게시글</p>
                            <p className="text-sm text-[#6b5d4f]">
                                "요리 초보자 질문" 게시글 등록
                            </p>
                        </div>
                        <span className="text-sm text-[#6b5d4f]">15분 전</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
