import { useState, useMemo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    useGetUserList,
    useBanUser,
    useRestoreUser,
} from '../../apis/generated/manage-controller/manage-controller';
import { AdminManagementLayout } from './common/AdminManagementLayout';
import { ActionConfirmButton } from './common/ActionConfirmButton';
import { useQueryClient } from '@tanstack/react-query';

// MUI Imports
import { TableRow, TableCell, Typography, Avatar, Chip } from '@mui/material';
import {
    Block as BanIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { formatDate } from '../../utils/formatDate';

export function UserManagement() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');

    // API Query
    const { data: userListResponse, isLoading, error } = useGetUserList();

    const mockUsers = Array.isArray(userListResponse?.data)
        ? userListResponse.data
        : userListResponse?.data?.data || [];

    // Filter Logic
    const filteredUsers = useMemo(() => {
        if (!searchQuery) return mockUsers;
        const lowerQuery = searchQuery.toLowerCase();
        return mockUsers.filter(
            (user) =>
                user.username?.toLowerCase().includes(lowerQuery) ||
                user.email?.toLowerCase().includes(lowerQuery),
        );
    }, [mockUsers, searchQuery]);

    // Client-side Infinite Scroll Logic
    const ITEMS_PER_PAGE = 20;
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    // Intersection Observer
    const { ref: observerRef, inView } = useInView({
        threshold: 0,
        triggerOnce: false,
    });

    useEffect(() => {
        if (inView && visibleCount < filteredUsers.length) {
            setVisibleCount((prev) =>
                Math.min(prev + ITEMS_PER_PAGE, filteredUsers.length),
            );
        }
    }, [inView, filteredUsers.length, visibleCount]);

    // Reset visible count when filter changes
    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE);
    }, [searchQuery]);

    const currentUsers = filteredUsers.slice(0, visibleCount);

    // Mutations
    const { mutate: banUser } = useBanUser();
    const { mutate: restoreUser } = useRestoreUser();

    const [confirmingId, setConfirmingId] = useState(null);

    const handleBan = (userId) => {
        banUser(
            { userId },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ['/admin/manage/user/list'],
                    });
                    setConfirmingId(null);
                },
                onError: (err) => {
                    alert('차단 처리에 실패했습니다.');
                    console.error(err);
                },
            },
        );
    };

    const handleRestore = (userId) => {
        restoreUser(
            { userId },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ['/admin/manage/user/list'],
                    });
                    setConfirmingId(null);
                },
                onError: (err) => {
                    alert('차단 해제에 실패했습니다.');
                    console.error(err);
                },
            },
        );
    };

    const tableHead = (
        <TableRow>
            <TableCell
                sx={{
                    backgroundColor: '#3d3226',
                    color: '#f5f1eb',
                    fontWeight: 'bold',
                }}
            >
                <Typography paddingX={5}>이메일</Typography>
            </TableCell>
            <TableCell
                sx={{
                    backgroundColor: '#3d3226',
                    color: '#f5f1eb',
                    fontWeight: 'bold',
                }}
            >
                <Typography paddingX={5}>프로필</Typography>
            </TableCell>
            <TableCell
                align="center"
                sx={{
                    backgroundColor: '#3d3226',
                    color: '#f5f1eb',
                    fontWeight: 'bold',
                }}
            >
                가입일
            </TableCell>
            <TableCell
                align="center"
                sx={{
                    backgroundColor: '#3d3226',
                    color: '#f5f1eb',
                    fontWeight: 'bold',
                }}
            >
                권한
            </TableCell>
            <TableCell
                align="center"
                sx={{
                    backgroundColor: '#3d3226',
                    color: '#f5f1eb',
                    fontWeight: 'bold',
                }}
            >
                상태
            </TableCell>
            <TableCell
                align="center"
                sx={{
                    backgroundColor: '#3d3226',
                    color: '#f5f1eb',
                    fontWeight: 'bold',
                }}
            >
                작업
            </TableCell>
        </TableRow>
    );

    const tableBody = currentUsers.map((user) => (
        <TableRow
            key={user.userId}
            hover
            sx={{
                '&:hover': {
                    backgroundColor: '#f5f1eb',
                },
            }}
        >
            <TableCell sx={{ color: '#6b5d4f' }}>{user.email}</TableCell>
            <TableCell>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <Avatar
                        alt={user.username}
                        src={user.profileImgUrl}
                        sx={{ width: 40, height: 40 }}
                    />
                    <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{ color: '#3d3226' }}
                    >
                        {user.username}
                    </Typography>
                </div>
            </TableCell>
            <TableCell align="center" sx={{ color: '#6b5d4f' }}>
                {formatDate(user.createDt)}
            </TableCell>
            <TableCell align="center" sx={{ color: '#6b5d4f' }}>
                {(() => {
                    if (!user.userRoles || user.userRoles.length === 0)
                        return '-';
                    const mainRole = [...user.userRoles].sort(
                        (a, b) => a.roleId - b.roleId,
                    )[0];
                    return mainRole.role?.roleNameKor || '-';
                })()}
            </TableCell>
            <TableCell align="center">
                {user.status === 'BANNED' ? (
                    <Chip
                        label="차단됨"
                        color="error"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                    />
                ) : user.status === 'INACTIVE' ? (
                    <Chip
                        label="비활성"
                        color="default"
                        size="small"
                        sx={{ fontWeight: 'bold', color: '#6b5d4f' }}
                    />
                ) : (
                    <Chip
                        label="활성"
                        color="success"
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                    />
                )}
            </TableCell>
            <TableCell align="center">
                {user.status === 'BANNED' ? (
                    <ActionConfirmButton
                        id={user.userId}
                        onConfirm={handleRestore}
                        confirmingId={confirmingId}
                        setConfirmingId={setConfirmingId}
                        icon={<CheckCircleIcon fontSize="small" />}
                        title="차단 해제"
                        message="차단을 해제하시겠습니까?"
                        color="success"
                    />
                ) : user.status === 'ACTIVE' ? (
                    <ActionConfirmButton
                        id={user.userId}
                        onConfirm={handleBan}
                        confirmingId={confirmingId}
                        setConfirmingId={setConfirmingId}
                        icon={<BanIcon fontSize="small" />}
                        title="차단"
                        message="이 사용자를 차단하시겠습니까?"
                        color="error"
                    />
                ) : (
                    <Typography variant="caption" color="text.secondary">
                        -
                    </Typography>
                )}
            </TableCell>
        </TableRow>
    ));

    return (
        <AdminManagementLayout
            title="사용자 관리"
            description="회원 정보 조회 및 차단 관리"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPlaceholder="닉네임, 아이디 또는 이메일로 검색"
            tableHead={tableHead}
            tableBody={tableBody}
            isLoading={isLoading}
            error={error}
            isEmpty={mockUsers.length === 0}
            observerRef={
                visibleCount < filteredUsers.length ? observerRef : null
            }
            isFetchingNextPage={visibleCount < filteredUsers.length}
        />
    );
}
