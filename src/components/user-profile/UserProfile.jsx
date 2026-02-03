import { useState, useEffect, useRef } from 'react';
import {
    ArrowLeft,
    User as UserIcon,
    MessageSquare,
    Bookmark,
    Users,
    Mail,
    CheckCircle,
    FileText,
} from 'lucide-react';

import { usePrincipalState } from '../../store/usePrincipalState';

import { useApiErrorMessage } from '../../hooks/useApiErrorMessage';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';

import {
    useChangeUsername,
    getGetPrincipalQueryKey,
} from '../../apis/generated/user-account-controller/user-account-controller';
import { useQueryClient } from '@tanstack/react-query';

import UserProfileMyProfile from './UserProfileMyProfile';
import UserProfileMyPosts from './UserProfileMyPosts';
import UserProfileBookmarks from './UserProfileBookmarks';
import { useGetRecipeList } from '../../apis/generated/recipe-controller/recipe-controller';
import { useGetBookmarkListByUserId } from '../../apis/generated/bookmark-controller/bookmark-controller';
import { useGetMyRecipeList } from '../../apis/generated/user-recipe-controller/user-recipe-controller';
import { useGetMyCommentList } from '../../apis/generated/comment-controller/comment-controller';

export function UserProfile({
    onNavigate,
    onRecipeClick,
    onLogout,
    onFollowersClick,
    onFollowingClick,
    onCommunityPostClick,
}) {
    const principal = usePrincipalState((s) => s.principal);
    const login = usePrincipalState((s) => s.login);

    const [profileData, setProfileData] = useState({
        userId: null,
        profileImgUrl: '',
        email: '',
        verifiedUser: false,
        username: '',
    });

    const [activeTab, setActiveTab] = useState('myProfile');
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // 이미지 로딩
    const [isProfileImageLoading, setIsProfileImageLoading] = useState(true);
    const imgRef = useRef(null);

    // 프로필 이미지 업로드 (UserProfileInfo에서 input을 제어)
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

    const { data: myRecipeData } = useGetMyRecipeList();
    const myPostList = myRecipeData?.data?.data?.items || [];

    const { data: allRecipeList } = useGetRecipeList(1);
    const recipeList = allRecipeList?.data?.data?.items || [];

    const { data: commentData } = useGetMyCommentList();
    const myCommentList = commentData?.data?.data || [];

    // 북마크 로드
    const bookmarkList = useGetBookmarkListByUserId();
    const myBookmarkList = bookmarkList?.data?.data?.data;
    // console.log(myBookmarkList);

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

    const handleProfileImgUpdated = (newUrl) => {
        // Info 탭(로컬 state) 즉시 반영
        setProfileData((prev) => ({ ...prev, profileImgUrl: newUrl }));

        // MyProfile 탭(principal) 즉시 반영
        if (principal) {
            login({ ...principal, profileImgUrl: newUrl });
        }
    };

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

    return (
        <div className="pt-4">
            <div className="max-w-4xl mx-auto px-6">
                <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center gap-2 mb-4 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
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
                                <UserIcon size={20} />
                                프로필 정보
                            </button>

                            <button
                                onClick={() => setActiveTab('posts')}
                                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
                                    activeTab === 'posts'
                                        ? 'bg-white text-[#3d3226] border-b-4 border-[#3d3226]'
                                        : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                                }`}
                            >
                                <FileText size={20} />내 게시물
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
                    <div className="h-[600px] scrollbar-hide scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full overflow-y-auto">
                        {activeTab === 'myProfile' && (
                            <UserProfileMyProfile
                                profileData={profileData}
                                fileInputRef={fileInputRef}
                                usernameEditRef={usernameEditRef}
                                isUsernameEditing={isUsernameEditing}
                                setIsUsernameEditing={setIsUsernameEditing}
                                usernameDraft={usernameDraft}
                                setUsernameDraft={setUsernameDraft}
                                onSaveUsername={handleSaveUsername}
                                isSavingUsername={isChangingUsername}
                                usernameError={usernameError}
                                onOpenDeleteConfirm={() =>
                                    setShowDeleteConfirm(true)
                                }
                                isSaved={isSaved}
                                canEditProfileImg={canEditProfileImg}
                                onProfileImgUpdated={handleProfileImgUpdated}
                                onLogout={onLogout}
                                onFollowersClick={onFollowersClick}
                                onFollowingClick={onFollowingClick}
                            />
                        )}

                        {activeTab === 'posts' && (
                            <UserProfileMyPosts
                                onRecipeClick={onRecipeClick}
                                onCommunityPostClick={onCommunityPostClick}
                                myPostList={myPostList}
                                // recipeList={recipeList}
                                myCommentList={myCommentList}
                            />
                        )}

                        {activeTab === 'favorites' && (
                            <UserProfileBookmarks
                                myBookmarkList={myBookmarkList}
                                onRecipeClick={onRecipeClick}
                                recipeList={recipeList}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteConfirm && (
                <DeleteAccount
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirm={handleDeleteAccount}
                />
            )}

            {/* Change Password Modal */}
            {isChangePasswordOpen && (
                <ChangePassword
                    onClose={() => setIsChangePasswordOpen(false)}
                />
            )}
        </div>
    );
}
