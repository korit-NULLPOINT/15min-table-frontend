import React, { useState } from 'react'
import { changePassword } from '../../../apis/generated/user-account-controller/user-account-controller';
import { usePrincipalState } from '../../../store/usePrincipalState';
import { Navigate } from 'react-router-dom';

function ChangePasswordPage() {

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const { principal } = usePrincipalState();

    const handleSubmit = async (e) => {
        // e.preventDefault(); // Form 태그가 아니므로 필요 없음, 하지만 관습적으로 남겨두거나 삭제 가능. 여기서는 삭제 상태 유지.
        setError('');

        if (!principal) {
            alert('로그인 정보를 찾을 수 없습니다.');
            return;
        }

        if (oldPassword.trim().length === 0 || newPassword.trim().length === 0 || newPasswordConfirm.trim().length === 0) {
            setError('모든 항목을 입력해주세요.');
            return;
        }

        if (newPassword !== newPasswordConfirm) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!confirm('비밀번호를 변경하시겠습니까?')) {
            return;
        }

        try {
            // 비밀번호 변경 로직
            const response = await changePassword({
                userId: principal?.userId,
                password: oldPassword,
                newPassword,
            });

            if (response.status === 200 || response.status === 'success') {
                alert(response.message || '비밀번호가 변경되었습니다.');
                Navigate('/login');
            }
            // 입력 필드 초기화
            setOldPassword('');
            setNewPassword('');
            setNewPasswordConfirm('');
        } catch (error) {
            console.error("Change Password Error:", error);
            console.error("Error Response Data:", error.response?.data);
            const errorData = error.response?.data;
            if (errorData) {
                alert(errorData.message || '비밀번호 변경에 실패했습니다.');
            } else {
                alert('비밀번호 변경 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h2 className="text-2xl font-bold mb-6">비밀번호 변경</h2>
            <div className="flex flex-col gap-2">
                <label className="block text-sm mb-2 text-[#3d3226]">
                    이전 비밀번호
                </label>
                <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none bg-white"
                    placeholder="••••••••"
                    required
                />
                <label className="block text-sm mb-2 text-[#3d3226]">
                    새 비밀번호
                </label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError('');
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-md focus:border-[#3d3226] focus:outline-none bg-white ${
                    error
                        ? 'border-red-500'
                        : 'border-[#d4cbbf]'
                }`}
                    placeholder="••••••••"
                    required
                />
                <label className="block text-sm mb-2 text-[#3d3226]">
                    새 비밀번호 확인
                </label>
                <input
                    type="password"
                    value={newPasswordConfirm}
                    onChange={(e) => {
                        setNewPasswordConfirm(e.target.value);
                        setError('');
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-md focus:border-[#3d3226] focus:outline-none bg-white ${
                        error
                            ? 'border-red-500'
                            : 'border-[#d4cbbf]'
                    }`}
                    placeholder="••••••••"
                    required
                />
            {error && (
                <p className="text-red-500 text-sm mt-1">
                    {error}
                </p>
            )}
        </div>
        <button onClick={handleSubmit} className="bg-[#3d3226] text-[#f5f1eb] px-4 py-2 rounded-md hover:bg-[#f5f1eb] hover:text-[#3d3226] transition-colors">변경하기</button>
    </div>
  )
}

export default ChangePasswordPage