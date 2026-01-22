// src/components/user-profile/DeleteAccount.jsx
export default function DeleteAccount({ onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            {/* 배경 클릭 닫기 (원치 않으면 제거 가능) */}
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full border-2 border-[#e5dfd5]">
                <div className="bg-[#3d3226] text-[#f5f1eb] px-6 py-4 rounded-t-lg">
                    <h3 className="text-xl">회원 탈퇴</h3>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-[#3d3226] mb-4">
                            정말로 회원 탈퇴를 진행하시겠습니까?
                        </p>
                        <p className="text-sm text-red-600">
                            ⚠️ 모든 프로필 정보와 데이터가 삭제되며, 이 작업은
                            되돌릴 수 없습니다.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 border-2 border-[#3d3226] text-[#3d3226] rounded-md hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            탈퇴하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
