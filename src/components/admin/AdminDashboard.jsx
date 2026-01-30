import { Users, BookOpen, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';

import AdminLineChart from './AdminLineChart';
import AdminMultiLineChart from './charts/AdminMultiLineChart';
import {
    useGetDashboardStats,
    useGetRecentActivities,
    useGetTimeSeries,
} from '../../apis/generated/manage-controller/manage-controller';
import { formatDate } from '../../apis/utils/formatDate';

export function AdminDashboard() {
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [range, setRange] = useState('day');

    const currentBucket = range;

    // Queries for each metric
    const { data: recipesSeries } = useGetTimeSeries({
        metric: 'recipes',
        bucket: currentBucket,
    });
    const { data: usersSeries } = useGetTimeSeries({
        metric: 'users',
        bucket: currentBucket,
    });

    const formatLabel = (dateString, bucket) => {
        const date = new Date(dateString);
        if (bucket === 'day') {
            return `${date.getMonth() + 1}/${date.getDate()}`;
        }
        if (bucket === 'month') {
            return `${date.getFullYear()}.${date.getMonth() + 1}`;
        }
        if (bucket === 'year') {
            return `${date.getFullYear()}`;
        }
        return dateString;
    };

    const transformData = (seriesData, bucket) => {
        if (!seriesData) return [];
        return seriesData.map((item) => ({
            label: formatLabel(item.date, bucket),
            value: item.count,
        }));
    };

    const usersData = transformData(usersSeries?.data?.data, currentBucket);
    const recipesData = transformData(recipesSeries?.data?.data, currentBucket);

    const { data: dashboardStats } = useGetDashboardStats();
    const { data: recentActivities } = useGetRecentActivities({ limit: 3 });

    // API response structure: { data: { totalUsers: ..., ... }, ... }
    const statsData = dashboardStats?.data?.data || null;
    const activitiesData = recentActivities?.data?.data || [];

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

    const getActivityTitle = (activity) => {
        if (activity.type === 'RECIPE' && activity.action === 'CREATED')
            return '새로운 레시피 등록';
        if (activity.type === 'RECIPE' && activity.action === 'UPDATED')
            return '레시피 수정';
        if (activity.type === 'SIGNUP' && activity.action === 'CREATED')
            return '새로운 회원가입';
        return activity.title || '활동 알림';
    };

    const formatActivityMessage = (activity) => {
        if (activity.type === 'RECIPE' && activity.action === 'CREATED') {
            return `${activity.username}님이 "${activity.title}" 레시피를 작성하셨습니다.`;
        }
        if (activity.type === 'RECIPE' && activity.action === 'UPDATED') {
            return `${activity.username}님이 "${activity.title}" 레시피를 수정하셨습니다.`;
        }
        if (activity.type === 'SIGNUP' && activity.action === 'CREATED') {
            return `${activity.username}님이 가입하셨습니다.`;
        }
        // Fallback
        return `${activity.username || '사용자'}님이 ${activity.action} 하셨습니다.`;
    };

    const chartData =
        selectedMetric === 'users'
            ? usersData
            : selectedMetric === 'recipes'
              ? recipesData
              : [];

    return (
        <div onClick={() => setSelectedMetric(null)}>
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
                            onClick={(e) => {
                                e.stopPropagation();
                                if (stat.type === 'community') return;
                                if (selectedMetric === stat.type) {
                                    setSelectedMetric(null);
                                } else {
                                    setSelectedMetric(stat.type);
                                }
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
                        : selectedMetric === 'users'
                          ? '사용자 수'
                          : selectedMetric === 'recipes'
                            ? '레시피 수'
                            : '전체 현황'}
                </h2>

                {selectedMetric === null ? (
                    <AdminMultiLineChart
                        xLabels={usersData.map((d) => d.label)}
                        series={[
                            {
                                data: usersData.map((d) => d.value),
                                color: '#4F46E5',
                                label: '사용자',
                            },
                            {
                                data: recipesData.map((d) => d.value),
                                color: '#16A34A',
                                label: '레시피',
                            },
                        ]}
                    />
                ) : (
                    <AdminLineChart
                        data={chartData}
                        color={
                            selectedMetric === 'users'
                                ? '#3B82F6' // 파랑 (사용자)
                                : selectedMetric === 'recipes'
                                  ? '#22C55E' // 초록 (레시피)
                                  : '#A855F7' // 보라 (커뮤니티)
                        }
                    />
                )}
            </div>
            <div className="mt-3 flex gap-2">
                {[
                    { key: 'day', label: '일' },
                    { key: 'month', label: '월' },
                    { key: 'year', label: '년' },
                ].map((r) => (
                    <button
                        key={r.key}
                        onClick={(e) => {
                            e.stopPropagation();
                            setRange(r.key);
                        }}
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

            {/* 최근 활동 요약 */}
            <div className="mt-8 bg-white rounded-lg border-2 border-[#d4cbbf] p-6">
                <h2 className="text-xl font-serif text-[#3d3226] mb-4">
                    최근 활동
                </h2>
                <div className="space-y-3">
                    {activitiesData.length === 0 ? (
                        <p className="text-[#6b5d4f] text-center py-4">
                            최근 활동이 없습니다.
                        </p>
                    ) : (
                        activitiesData.map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between py-3 border-b border-[#e5dfd5] last:border-0"
                            >
                                <div>
                                    <p className="text-[#3d3226] font-medium">
                                        {getActivityTitle(activity)}
                                    </p>
                                    <p className="text-sm text-[#6b5d4f]">
                                        {formatActivityMessage(activity)}
                                    </p>
                                </div>
                                <span className="text-sm text-[#6b5d4f]">
                                    {formatDate(activity.occurredAt)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
