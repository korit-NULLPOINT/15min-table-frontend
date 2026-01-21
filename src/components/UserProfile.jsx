import { useState, useEffect, useRef } from 'react';
import {
    ArrowLeft,
    User as UserIcon,
    MessageSquare,
    Bookmark,
    Users,
    Mail,
    CheckCircle,
} from 'lucide-react';

import { usePrincipalState } from '../store/usePrincipalState';
import {
    currentUserComments,
    currentUserCommunityPosts,
    currentUserFavorites,
    currentUserRecipePosts,
} from '../utils/recipeData';

import { useApiErrorMessage } from '../hooks/useApiErrorMessage';
import {
    useChangeUsername,
    getGetPrincipalQueryKey,
} from '../apis/generated/user-account-controller/user-account-controller';
import { useQueryClient } from '@tanstack/react-query';

import UserProfileMyProfile from './UserProfileMyProfile';
import UserProfileInfo from './UserProfileInfo';
import UserProfileMyComments from './UserProfileMyComments';
import UserProfileBookmarks from './UserProfileBookmarks';

export function UserProfile({
    onNavigate,
    onRecipeClick,
    onLogout,
    onFollowersClick,
    onFollowingClick,
    onCommunityPostClick,
    onChangePasswordClick,
}) {
    const principal = usePrincipalState((s) => s.principal);
    const login = usePrincipalState((s) => s.login);
    const handleProfileImgUpdated = (newUrl) => {
        // Info 탭(로컬 state) 즉시 반영
        setProfileData((prev) => ({ ...prev, profileImgUrl: newUrl }));

        // MyProfile 탭(principal) 즉시 반영
        if (principal) {
            login({ ...principal, profileImgUrl: newUrl });
        }
    };

    const [profileData, setProfileData] = useState({
        userId: null,
        profileImgUrl: '',
        email: '',
        verifiedUser: false,
        username: '',
    });

    const [activeTab, setActiveTab] = useState('myProfile');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // MyProfile 탭 게시글 타입
    const [myProfilePostType, setMyProfilePostType] = useState('recipe');

    // 이미지 로딩
    const [isProfileImageLoading, setIsProfileImageLoading] = useState(true);
    const imgRef = useRef(null);

    // 프로필 이미지 업로드
    const fileInputRef = useRef(null);

    // 닉네임 편집 토글
    const [isUsernameEditing, setIsUsernameEditing] = useState(false);
    const [usernameDraft, setUsernameDraft] = useState('');
    const usernameEditRef = useRef(null);

    // 저장 완료 메시지
    const [isSaved, setIsSaved] = useState(false);

    const isRole3 = principal?.userRoles?.some(
        (ur) => ur?.roleId === 3 || ur?.role?.roleId === 3,
    );

    const canEditProfileImg = !!principal && !isRole3;

    // Mock data
    const myPosts = currentUserRecipePosts;
    const myCommunityPosts = currentUserCommunityPosts;
    const myFavorites = currentUserFavorites;
    const [myComments, setMyComments] = useState(currentUserComments);

    const queryClient = useQueryClient();
    const {
        errorMessage: usernameError,
        clearError,
        handleApiError,
    } = useApiErrorMessage();

    const {
        mutateAsync: changeUsernameMutateAsync,
        isPending: isChangingUsername,
    } = useChangeUsername();

    // 바깥 클릭 시 닉네임 편집 취소
    useEffect(() => {
        if (!isUsernameEditing || isChangingUsername) return;

        const handleOutsideClick = (e) => {
            if (!usernameEditRef.current) return;
            if (usernameEditRef.current.contains(e.target)) return;

            setUsernameDraft(profileData.username || '');
            setIsUsernameEditing(false);
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () =>
            document.removeEventListener('mousedown', handleOutsideClick);
    }, [isUsernameEditing, isChangingUsername, profileData.username]);

    // principal 로딩 → local state 동기화
    useEffect(() => {
        if (!principal) return;

        const mappedData = {
            userId: principal.userId ?? null,
            profileImgUrl: principal.profileImgUrl || '',
            email: principal.email || '',
            verifiedUser: principal.verifiedUser || false,
            username: principal.username || '',
        };

        setProfileData(mappedData);
        setUsernameDraft(mappedData.username);
    }, [principal]);

    // 프로필 이미지 로딩 스피너 처리
    useEffect(() => {
        setIsProfileImageLoading(true);
        if (imgRef.current && imgRef.current.complete) {
            setIsProfileImageLoading(false);
        }
    }, [principal?.profileImgUrl]);

    const handleImageLoad = () => setIsProfileImageLoading(false);

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const imageData = reader.result;
            const next = { ...profileData, profileImgUrl: imageData };

            setProfileData(next);
            login(next); // mock 저장(추후 이미지 변경 API 연결 시 교체)
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveUsername = async () => {
        clearError();

        const nextUsername = usernameDraft.trim();
        if (!nextUsername || !principal?.userId) return;

        try {
            await changeUsernameMutateAsync({
                data: { userId: principal.userId, username: nextUsername },
            });

            const nextProfileData = { ...profileData, username: nextUsername };
            setProfileData(nextProfileData);
            login({ ...principal, username: nextUsername });

            setIsUsernameEditing(false);

            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);

            queryClient.invalidateQueries({
                queryKey: getGetPrincipalQueryKey(),
            });
        } catch (e) {
            await handleApiError(e, {
                fallbackMessage:
                    '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            });
        }
    };

    const handleDeleteAccount = () => {
        onLogout?.();
        setShowDeleteConfirm(false);
    };

    const handleDeleteComment = (commentId, e) => {
        e.stopPropagation();
        setMyComments((prev) => prev.filter((c) => c.id !== commentId));
    };

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center gap-2 mb-6 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
                >
                    <ArrowLeft size={20} />
                    메인으로 돌아가기
                </button>

                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#3d3226] text-[#f5f1eb] px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl mb-2">내 프로필</h1>
                                <p className="text-[#e5dfd5]">
                                    건강한 식생활을 위한 정보를 입력해주세요
                                </p>
                            </div>

                            {principal && (
                                <div
                                    className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                                        principal.verifiedUser
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                                            : 'bg-orange-500'
                                    }`}
                                >
                                    {principal.verifiedUser ? (
                                        <>
                                            <CheckCircle size={18} />
                                            <span className="font-medium">
                                                인증된 계정
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Mail size={18} />
                                            <span className="font-medium">
                                                미인증 계정
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b-2 border-[#e5dfd5] bg-[#ebe5db]">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('myProfile')}
                                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
                                    activeTab === 'myProfile'
                                        ? 'bg-white text-[#3d3226] border-b-4 border-[#3d3226]'
                                        : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                                }`}
                            >
                                <Users size={20} />
                                My 프로필
                            </button>

                            <button
                                onClick={() => setActiveTab('info')}
                                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
                                    activeTab === 'info'
                                        ? 'bg-white text-[#3d3226] border-b-4 border-[#3d3226]'
                                        : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                                }`}
                            >
                                <UserIcon size={20} />
                                프로필 정보
                            </button>

                            <button
                                onClick={() => setActiveTab('comments')}
                                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
                                    activeTab === 'comments'
                                        ? 'bg-white text-[#3d3226] border-b-4 border-[#3d3226]'
                                        : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                                }`}
                            >
                                <MessageSquare size={20} />내 댓글
                            </button>

                            <button
                                onClick={() => setActiveTab('favorites')}
                                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
                                    activeTab === 'favorites'
                                        ? 'bg-white text-[#3d3226] border-b-4 border-[#3d3226]'
                                        : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                                }`}
                            >
                                <Bookmark size={20} />
                                저장한 게시물
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'myProfile' && (
                        <UserProfileMyProfile
                            principal={principal}
                            isProfileImageLoading={isProfileImageLoading}
                            imgRef={imgRef}
                            onImageLoad={handleImageLoad}
                            onFollowersClick={onFollowersClick}
                            onFollowingClick={onFollowingClick}
                            myProfilePostType={myProfilePostType}
                            setMyProfilePostType={setMyProfilePostType}
                            myPosts={myPosts}
                            myCommunityPosts={myCommunityPosts}
                            onRecipeClick={onRecipeClick}
                            onCommunityPostClick={onCommunityPostClick}
                        />
                    )}

                    {activeTab === 'info' && (
                        <UserProfileInfo
                            profileData={profileData}
                            fileInputRef={fileInputRef}
                            onImageUpload={handleImageUpload}
                            usernameEditRef={usernameEditRef}
                            isUsernameEditing={isUsernameEditing}
                            setIsUsernameEditing={setIsUsernameEditing}
                            usernameDraft={usernameDraft}
                            setUsernameDraft={setUsernameDraft}
                            onSaveUsername={handleSaveUsername}
                            isSavingUsername={isChangingUsername}
                            usernameError={usernameError}
                            onChangePasswordClick={onChangePasswordClick}
                            onOpenDeleteConfirm={() =>
                                setShowDeleteConfirm(true)
                            }
                            isSaved={isSaved}
                            canEditProfileImg={canEditProfileImg}
                            onProfileImgUpdated={handleProfileImgUpdated}
                        />
                    )}

                    {activeTab === 'comments' && (
                        <UserProfileMyComments
                            myComments={myComments}
                            onDeleteComment={handleDeleteComment}
                            onRecipeClick={onRecipeClick}
                            onCommunityPostClick={onCommunityPostClick}
                        />
                    )}

                    {activeTab === 'favorites' && (
                        <UserProfileBookmarks
                            myFavorites={myFavorites}
                            onRecipeClick={onRecipeClick}
                        />
                    )}
                </div>
            </div>

            {/* Delete Account Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full border-2 border-[#e5dfd5]">
                        <div className="bg-[#3d3226] text-[#f5f1eb] px-6 py-4 rounded-t-lg">
                            <h3 className="text-xl">회원 탈퇴</h3>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <p className="text-[#3d3226] mb-4">
                                    정말로 회원 탈퇴를 진행하시겠습니까?
                                </p>
                                <p className="text-sm text-red-600">
                                    ⚠️ 모든 프로필 정보와 데이터가 삭제되며, 이
                                    작업은 되돌릴 수 없습니다.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-3 border-2 border-[#3d3226] text-[#3d3226] rounded-md hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="flex-1 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                >
                                    탈퇴하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
