import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

import { changePassword } from '../../../apis/generated/user-account-controller/user-account-controller';
import { usePrincipalState } from '../../../store/usePrincipalState';

function ChangePasswordPage({ onClose }) {
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [error, setError] = useState('');

    const isPasswordMatch =
        newPassword.length > 0 && newPassword === newPasswordConfirm;
    const isPasswordMismatch =
        newPasswordConfirm.length > 0 && newPassword !== newPasswordConfirm;

    // const principal = usePrincipalState((s) => s.principal);
    // const logout = usePrincipalState((s) => s.logout);

    const { principal, logout } = usePrincipalState();

    const handleSubmit = async (e) => {
        e?.preventDefault?.();
        setError('');

        if (!principal?.userId) {
            alert('로그인 정보를 찾을 수 없습니다.');
            return;
        }

        if (
            oldPassword.trim().length === 0 ||
            newPassword.trim().length === 0 ||
            newPasswordConfirm.trim().length === 0
        ) {
            setError('모든 항목을 입력해주세요.');
            return;
        }

        if (newPassword !== newPasswordConfirm) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!window.confirm('비밀번호를 변경하시겠습니까?')) return;

        try {
            /**
             * ✅ orval(customInstance) 응답 형태
             * res = { data: ApiRespDto<null>, status: number, headers: Headers }
             * ApiRespDto = { status: "success" | "error", message: string, data: ... }
             */
            const res = await changePassword({
                userId: principal.userId,
                password: oldPassword,
                newPassword,
            });

            const httpStatus = res?.status;
            const body = res?.data; // ApiRespDto
            const ok = httpStatus === 200 || body?.status === 'success';

            if (ok) {
                alert(body?.message || '비밀번호가 변경되었습니다.');

                // ✅ 비밀번호 변경 후에는 토큰이 무효 처리될 수 있으니 로그아웃 권장
                logout();

                // ✅ 라우팅 이동 (Navigate가 아니라 useNavigate)
                navigate('/', { replace: true }); // 필요하면 "/login"으로 바꿔
                return;
            }

            alert(body?.message || '비밀번호 변경에 실패했습니다.');
        } catch (err) {
            // axios 에러 형태
            const errorData = err?.response?.data;
            alert(
                errorData?.message || '비밀번호 변경 중 오류가 발생했습니다.',
            );

            // 혹시 토큰 만료 등으로 401이면 로그아웃 처리
            if (err?.response?.status === 401) {
                logout();
                navigate('/', { replace: true });
            }
        } finally {
            setOldPassword('');
            setNewPassword('');
            setNewPasswordConfirm('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-[#f5f1eb] rounded-lg shadow-2xl max-w-md w-full mx-4 border-2 border-[#3d3226]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-[#e5dfd5] rounded-full transition-colors"
                >
                    <X size={24} className="text-[#3d3226]" />
                </button>

                <div className="flex flex-col justify-center items-center px-10 py-6">
                    <h2 className="text-2xl font-bold mt-8 mb-8">
                        비밀번호 변경
                    </h2>

                    <div className="flex flex-col gap-1 w-full">
                        <label className="block text-sm mt-2 text-[#3d3226]">
                            이전 비밀번호
                        </label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full px-2 py-2 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none bg-white"
                            placeholder="••••••••"
                            required
                        />

                        <label className="block text-sm mt-2 text-[#3d3226]">
                            새 비밀번호
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                setError('');
                            }}
                            className={`w-full px-2 py-2 border-2 rounded-md focus:border-[#3d3226] focus:outline-none bg-white ${
                                error ? 'border-red-500' : 'border-[#d4cbbf]'
                            }`}
                            placeholder="••••••••"
                            required
                        />

                        <label className="block text-sm mt-2 text-[#3d3226]">
                            새 비밀번호 확인
                        </label>
                        <input
                            type="password"
                            value={newPasswordConfirm}
                            onChange={(e) => {
                                setNewPasswordConfirm(e.target.value);
                                setError('');
                            }}
                            className={`w-full px-2 py-2 border-2 rounded-md focus:outline-none bg-white ${
                                error
                                    ? 'border-red-500'
                                    : isPasswordMatch
                                      ? 'border-green-500 focus:border-green-500'
                                      : isPasswordMismatch
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-[#d4cbbf] focus:border-[#3d3226]'
                            }`}
                            placeholder="••••••••"
                            required
                        />

                        {error && (
                            <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="bg-[#3d3226] text-[#f5f1eb] px-4 py-2 rounded-md hover:bg-[#f5f1eb] hover:text-[#3d3226] transition-colors mt-4 mb-2 w-full"
                    >
                        변경하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordPage;
