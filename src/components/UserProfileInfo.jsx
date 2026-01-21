import { useEffect, useMemo, useState } from 'react';
import {
    Upload,
    User as UserIcon,
    Edit,
    Save,
    Mail,
    CheckCircle,
    RotateCcwKey,
    UserX,
    LoaderCircle,
} from 'lucide-react';

import { useSendMail } from '../apis/generated/mail-controller/mail-controller';
import {
    useChangeProfileImg,
    getGetPrincipalQueryKey,
} from '../apis/generated/user-account-controller/user-account-controller';

import { useApiErrorMessage } from '../hooks/useApiErrorMessage';
import { useQueryClient } from '@tanstack/react-query';

import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../apis/utils/config/firebaseConfig'; // ✅ 네 경로 맞게 유지
import { v4 as uuid } from 'uuid';

export default function UserProfileInfo({
    profileData,
    fileInputRef,

    usernameEditRef,
    isUsernameEditing,
    setIsUsernameEditing,
    usernameDraft,
    setUsernameDraft,
    onSaveUsername,
    isSavingUsername,
    usernameError,

    onChangePasswordClick,
    onOpenDeleteConfirm,
    isSaved,

    canEditProfileImg,
    onProfileImgUpdated,
}) {
    const queryClient = useQueryClient();

    // 메일 발송
    const {
        errorMessage: mailError,
        clearError: clearMailError,
        handleApiError: handleMailApiError,
    } = useApiErrorMessage();

    const { mutateAsync: sendMailMutateAsync, isPending: isSendingMail } =
        useSendMail();

    const [mailSent, setMailSent] = useState(false);
    const [cooldownLeft, setCooldownLeft] = useState(0);

    useEffect(() => {
        if (cooldownLeft <= 0) return;
        const t = setInterval(() => {
            setCooldownLeft((prev) => (prev <= 1 ? 0 : prev - 1));
        }, 1000);
        return () => clearInterval(t);
    }, [cooldownLeft]);

    const formatCooldown = (sec) => {
        const m = String(Math.floor(sec / 60)).padStart(2, '0');
        const s = String(sec % 60).padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleSendVerifyMail = async () => {
        if (cooldownLeft > 0 || isSendingMail) return;

        clearMailError();
        setMailSent(false);

        try {
            await sendMailMutateAsync(); // POST /mail/send
            setMailSent(true);
            setCooldownLeft(60);
        } catch (e) {
            await handleMailApiError(e, {
                fallbackMessage:
                    '인증 메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.',
            });
        }
    };

    const isVerifyButtonDisabled = isSendingMail || cooldownLeft > 0;

    /* -----------------------------
     * 2) 프로필 이미지 업로드 (Firebase -> 백 API)
     * ----------------------------- */
    const {
        errorMessage: imgError,
        clearError: clearImgError,
        handleApiError: handleImgApiError,
    } = useApiErrorMessage();

    // ✅ 최신 orval 훅 이름: useChangeProfileImg
    const {
        mutateAsync: changeProfileImgMutateAsync,
        isPending: isChangingProfileImg,
    } = useChangeProfileImg();

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const isUploadDisabled =
        !canEditProfileImg || isUploading || isChangingProfileImg;

    const MAX_MB = 2;
    const ALLOW_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    const handleSelectProfileImage = () => {
        if (isUploadDisabled) return;
        fileInputRef.current?.click();
    };

    const handleProfileImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const resetInput = () => {
            try {
                e.target.value = '';
            } catch {
                // ignore
            }
        };

        if (isUploadDisabled) {
            resetInput();
            return;
        }

        clearImgError();

        // ✅ 타입 제한
        if (!ALLOW_TYPES.includes(file.type)) {
            await handleImgApiError(new Error('INVALID_FILE_TYPE'), {
                fallbackMessage:
                    '지원하지 않는 이미지 형식입니다. JPG/PNG/WEBP만 업로드할 수 있어요.',
            });
            resetInput();
            return;
        }

        // ✅ 용량 제한
        if (file.size > MAX_MB * 1024 * 1024) {
            await handleImgApiError(new Error('FILE_TOO_LARGE'), {
                fallbackMessage: `이미지 용량이 너무 큽니다. ${MAX_MB}MB 이하로 업로드해주세요.`,
            });
            resetInput();
            return;
        }

        // ✅ userId 없으면 업로드 불가
        if (!profileData?.userId) {
            await handleImgApiError(new Error('NO_USER_ID'), {
                fallbackMessage: '사용자 정보가 없어 업로드할 수 없습니다.',
            });
            resetInput();
            return;
        }

        const ok = confirm('프로필 이미지를 변경하시겠습니까?');
        if (!ok) {
            resetInput();
            return;
        }

        try {
            setIsUploading(true);
            setUploadProgress(0);

            const ext =
                file.name.split('.').pop()?.toLowerCase() ||
                (file.type === 'image/png'
                    ? 'png'
                    : file.type === 'image/webp'
                      ? 'webp'
                      : 'jpg');

            const filename = `${uuid()}.${ext}`;
            const imageRef = ref(
                storage,
                `profile-img/${profileData.userId}/${filename}`,
            );

            const uploadTask = uploadBytesResumable(imageRef, file);

            await new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const p = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                                100,
                        );
                        setUploadProgress(p);
                    },
                    reject,
                    resolve,
                );
            });

            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

            // ✅ 최신 DTO 필드명: profileImgUrl
            await changeProfileImgMutateAsync({
                data: {
                    userId: profileData.userId,
                    profileImgUrl: downloadUrl,
                },
            });

            onProfileImgUpdated?.(downloadUrl);
            // ✅ react-query principal 갱신
            queryClient.invalidateQueries({
                queryKey: getGetPrincipalQueryKey(),
            });
        } catch (err) {
            await handleImgApiError(err, {
                fallbackMessage:
                    '프로필 이미지 변경에 실패했습니다. 잠시 후 다시 시도해주세요.',
            });
        } finally {
            setIsUploading(false);
            resetInput();
        }
    };

    /* -----------------------------
     * 3) 닉네임
     * ----------------------------- */
    const isUsernameDisabled = useMemo(() => {
        return (
            isSavingUsername ||
            usernameDraft.trim().length === 0 ||
            usernameDraft.trim() === (profileData.username || '')
        );
    }, [isSavingUsername, usernameDraft, profileData.username]);

    return (
        <div className="p-8">
            <h3 className="text-xl mb-6 text-[#3d3226]">프로필 설정</h3>

            <div className="space-y-6">
                {/* 프로필 이미지 변경 */}
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-[#d4cbbf] overflow-hidden bg-[#ebe5db] flex items-center justify-center">
                            {profileData.profileImgUrl ? (
                                <img
                                    src={profileData.profileImgUrl}
                                    alt="프로필"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <UserIcon
                                    size={48}
                                    className="text-[#6b5d4f]"
                                />
                            )}
                        </div>

                        <button
                            onClick={handleSelectProfileImage}
                            disabled={isUploadDisabled}
                            className={[
                                'absolute bottom-0 right-0 p-2 rounded-full transition-colors flex items-center justify-center',
                                isUploadDisabled
                                    ? 'bg-[#d4cbbf] text-[#6b5d4f] cursor-not-allowed'
                                    : 'bg-[#3d3226] text-[#f5f1eb] hover:bg-[#5d4a36]',
                            ].join(' ')}
                            title={
                                !canEditProfileImg
                                    ? '권한이 없어 변경할 수 없습니다.'
                                    : isUploadDisabled
                                      ? '업로드 중입니다.'
                                      : '프로필 이미지 변경'
                            }
                        >
                            {isUploading || isChangingProfileImg ? (
                                <LoaderCircle
                                    size={20}
                                    className="animate-spin"
                                />
                            ) : (
                                <Upload size={20} />
                            )}
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            className="hidden"
                        />
                    </div>

                    <p className="mt-3 text-sm text-[#6b5d4f]">
                        프로필 이미지를 변경할 수 있어요
                    </p>

                    {(isUploading || isChangingProfileImg) && (
                        <p className="mt-2 text-xs text-[#6b5d4f]">
                            업로드 중... {uploadProgress}%
                        </p>
                    )}

                    {imgError && (
                        <p className="mt-2 text-sm text-red-600">{imgError}</p>
                    )}

                    {!canEditProfileImg && (
                        <p className="mt-2 text-xs text-[#6b5d4f]">
                            현재 계정은 프로필 이미지 변경 권한이 없습니다.
                        </p>
                    )}
                </div>

                {/* 닉네임 */}
                <div>
                    <label className="block text-sm mb-2 text-[#3d3226]">
                        닉네임
                    </label>

                    <div
                        className="flex flex-col md:flex-row md:items-center gap-3"
                        ref={usernameEditRef}
                    >
                        <input
                            type="text"
                            value={usernameDraft}
                            onChange={(e) => setUsernameDraft(e.target.value)}
                            readOnly={!isUsernameEditing}
                            className={[
                                'flex-1 h-12 px-4 border-2 rounded-md focus:outline-none',
                                isUsernameEditing
                                    ? 'border-[#3d3226] bg-white focus:border-[#3d3226]'
                                    : 'border-[#d4cbbf] bg-[#ebe5db] text-[#3d3226] cursor-default',
                            ].join(' ')}
                            placeholder="닉네임을 입력하세요"
                        />

                        {!isUsernameEditing ? (
                            <button
                                onClick={() => setIsUsernameEditing(true)}
                                className="h-12 px-5 border-2 border-[#3d3226] text-[#3d3226] rounded-md hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                <Edit size={18} />
                                수정
                            </button>
                        ) : (
                            <button
                                onClick={onSaveUsername}
                                disabled={isUsernameDisabled}
                                className={[
                                    'h-12 px-5 rounded-md transition-colors flex items-center justify-center gap-2 whitespace-nowrap',
                                    isUsernameDisabled
                                        ? 'bg-[#d4cbbf] text-[#6b5d4f] cursor-not-allowed'
                                        : 'bg-[#3d3226] text-[#f5f1eb] hover:bg-[#5d4a36]',
                                ].join(' ')}
                            >
                                <Save size={18} />
                                {isSavingUsername ? '저장 중' : '저장'}
                            </button>
                        )}
                    </div>

                    <p className="mt-2 text-xs text-[#6b5d4f]">
                        닉네임은 다른 사용자에게 표시돼요
                    </p>

                    {usernameError && (
                        <p className="mt-2 text-sm text-red-600">
                            {usernameError}
                        </p>
                    )}
                </div>

                {/* 이메일 + 인증 */}
                <div>
                    <label className="block text-sm mb-2 text-[#3d3226]">
                        이메일
                    </label>

                    <div className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md bg-[#ebe5db] text-[#3d3226] flex items-center justify-between gap-3">
                        <span className="truncate">
                            {profileData.email || '이메일 정보 없음'}
                        </span>

                        <span
                            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                                profileData.verifiedUser
                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                    : 'bg-orange-100 text-orange-700 border border-orange-200'
                            }`}
                        >
                            {profileData.verifiedUser ? (
                                <>
                                    <CheckCircle size={14} />
                                    인증됨
                                </>
                            ) : (
                                <>
                                    <Mail size={14} />
                                    미인증
                                </>
                            )}
                        </span>
                    </div>

                    {!profileData.verifiedUser && profileData.email && (
                        <div className="mt-3 flex items-center justify-between gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border-2 border-emerald-200">
                            <div className="flex items-start gap-3">
                                <Mail
                                    size={20}
                                    className="text-emerald-600 mt-0.5"
                                />
                                <div>
                                    <p className="text-sm text-[#3d3226] font-medium">
                                        이메일 인증이 필요합니다
                                    </p>
                                    <p className="text-xs text-[#6b5d4f]">
                                        인증 메일을 보내드릴게요. 메일함에서
                                        링크를 눌러 완료하세요.
                                    </p>

                                    {mailSent && cooldownLeft > 0 && (
                                        <p className="mt-2 text-xs text-emerald-700">
                                            ✅ 인증 메일을 발송했어요. 메일함을
                                            확인해주세요.
                                            <span className="ml-2 text-[#6b5d4f]">
                                                ({formatCooldown(cooldownLeft)}{' '}
                                                후 재발송 가능)
                                            </span>
                                        </p>
                                    )}

                                    {mailError && (
                                        <p className="mt-2 text-xs text-red-600">
                                            {mailError}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleSendVerifyMail}
                                disabled={isVerifyButtonDisabled}
                                className={[
                                    'px-4 py-2 rounded-md transition-colors text-sm shadow-md whitespace-nowrap flex items-center gap-2',
                                    isVerifyButtonDisabled
                                        ? 'bg-[#d4cbbf] text-[#6b5d4f] cursor-not-allowed'
                                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700',
                                ].join(' ')}
                            >
                                {isSendingMail ? (
                                    <>
                                        <LoaderCircle
                                            size={16}
                                            className="animate-spin"
                                        />
                                        발송 중...
                                    </>
                                ) : cooldownLeft > 0 ? (
                                    `재발송 (${formatCooldown(cooldownLeft)})`
                                ) : (
                                    '이메일 인증'
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {isSaved && (
                    <div className="bg-green-100 border-2 border-green-500 text-green-700 px-4 py-3 rounded-md">
                        저장되었습니다! ✓
                    </div>
                )}
            </div>

            <div className="my-10 border-t-2 border-[#e5dfd5]" />

            <h3 className="text-xl mb-6 text-[#3d3226]">계정 설정</h3>

            <div className="space-y-3">
                <button
                    onClick={onChangePasswordClick}
                    className="w-full py-3 border-2 border-[#3d3226] text-[#3d3226] rounded-md hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors flex items-center justify-center gap-2"
                >
                    <RotateCcwKey size={20} />
                    비밀번호 변경
                </button>

                <button
                    onClick={onOpenDeleteConfirm}
                    className="w-full py-3 border-2 border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                    <UserX size={20} />
                    회원 탈퇴
                </button>
            </div>
        </div>
    );
}
