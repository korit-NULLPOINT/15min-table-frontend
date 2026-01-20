import { useState, useEffect, useRef } from 'react';
import {
    Save,
    Edit,
    ArrowLeft,
    Upload,
    User as UserIcon,
    FileText,
    MessageSquare,
    Bookmark,
    LogOut,
    UserX,
    Trash2,
    Users,
    Mail,
    CheckCircle,
    LoaderCircle,
    RotateCcwKey,
} from 'lucide-react';
import { usePrincipalState } from '../store/usePrincipalState';
import {
    currentUserComments,
    currentUserCommunityPosts,
    currentUserFavorites,
    currentUserRecipePosts,
} from '../utils/recipeData';

export function UserProfile({
    onNavigate,
    onRecipeClick,
    onLogout,
    onEditRecipe,
    onFollowersClick,
    onFollowingClick,
    onCommunityPostClick,
    onEditCommunityPost,
    onChangePasswordClick,
}) {
    const principal = usePrincipalState((s) => s.principal);
    const login = usePrincipalState((s) => s.login);

    const [profileData, setProfileData] = useState({
        gender: '',
        age: '',
        weight: '',
        allergies: '',
        profileImgUrl: '',
        email: '',
        verifiedUser: false,
        username: '',
    });

    // const [userData, setUserData] = useState(null); // Removed locally
    const [isEditing, setIsEditing] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('myProfile');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [postType, setPostType] = useState('recipe'); // 레시피 또는 커뮤니티
    const [myProfilePostType, setMyProfilePostType] = useState('recipe'); // My 프로필 내 게시글 타입
    const [isProfileImageLoading, setIsProfileImageLoading] = useState(true);
    const fileInputRef = useRef(null);
    const imgRef = useRef(null);

    useEffect(() => {
        setIsProfileImageLoading(true);
        if (imgRef.current && imgRef.current.complete) {
            setIsProfileImageLoading(false);
        }
    }, [principal?.profileImgUrl]);

    // Mock data for posts, comments, and favorites
    const myPosts = currentUserRecipePosts;
    const myCommunityPosts = currentUserCommunityPosts;
    const myFavorites = currentUserFavorites;

    const [myComments, setMyComments] = useState(currentUserComments);

    const handleChange = (field, value) => {
        setProfileData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result;
                setProfileData((prev) => ({
                    ...prev,
                    profileImgUrl: imageData,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageLoad = () => {
        setIsProfileImageLoading(false);
    };

    const handleSave = () => {
        login(profileData);
        setIsEditing(false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleDeleteAccount = () => {
        // Call logout to return to login screen
        if (onLogout) {
            onLogout();
        }
        setShowDeleteConfirm(false);
    };

    const handleDeleteComment = (commentId, e) => {
        e.stopPropagation();
        setMyComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== commentId),
        );
    };

    // Load saved profile from Store
    useEffect(() => {
        if (principal) {
            const mappedData = {
                gender: principal.gender || '',
                age: principal.age || '',
                weight: principal.weight || '',
                allergies: principal.allergies || '',
                profileImgUrl: principal.profileImgUrl || '',
                email: principal.email || '',
                verifiedUser: principal.verifiedUser || false,
                username: principal.username || '',
            };
            setProfileData(mappedData);
            setIsEditing(false);
        }
    }, [principal]);

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
                        <div className="p-8">
                            {/* Profile Image and Nickname */}
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-32 h-32 rounded-full border-4 border-[#d4cbbf] overflow-hidden bg-[#ebe5db] flex items-center justify-center relative">
                                    {principal?.profileImgUrl ? (
                                        <>
                                            {isProfileImageLoading && (
                                                <LoaderCircle className="w-8 h-8 text-[#6b5d4f] animate-spin absolute z-10" />
                                            )}
                                            <img
                                                ref={imgRef}
                                                key={principal.profileImgUrl}
                                                src={principal.profileImgUrl}
                                                alt="프로필"
                                                className={`w-full h-full object-cover transition-opacity duration-300 ${isProfileImageLoading ? 'opacity-0' : 'opacity-100'}`}
                                                onLoad={handleImageLoad}
                                                onError={handleImageLoad}
                                            />
                                        </>
                                    ) : (
                                        <UserIcon
                                            size={48}
                                            className="text-[#6b5d4f]"
                                        />
                                    )}
                                </div>
                                <h2 className="text-2xl text-[#3d3226] mt-4">
                                    {principal?.username || '닉네임 없음'}
                                </h2>

                                {/* Followers / Following */}
                                <div className="flex gap-6 mt-4">
                                    <button
                                        onClick={onFollowersClick}
                                        className="flex flex-col items-center gap-1 px-4 py-2 hover:bg-[#ebe5db] rounded-md transition-colors"
                                    >
                                        <span className="text-2xl font-bold text-[#3d3226]">
                                            124
                                        </span>
                                        <span className="text-sm text-[#6b5d4f]">
                                            팔로워
                                        </span>
                                    </button>
                                    <div className="w-px bg-[#d4cbbf]" />
                                    <button
                                        onClick={onFollowingClick}
                                        className="flex flex-col items-center gap-1 px-4 py-2 hover:bg-[#ebe5db] rounded-md transition-colors"
                                    >
                                        <span className="text-2xl font-bold text-[#3d3226]">
                                            89
                                        </span>
                                        <span className="text-sm text-[#6b5d4f]">
                                            팔로잉
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* User Posts */}
                            <div>
                                {/* Toggle Buttons */}
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl text-[#3d3226]">
                                        내가 작성한 게시글
                                    </h3>
                                    <div className="flex gap-2 bg-[#ebe5db] p-1 rounded-md border-2 border-[#d4cbbf]">
                                        <button
                                            onClick={() =>
                                                setMyProfilePostType('recipe')
                                            }
                                            className={`px-4 py-2 rounded-md transition-colors ${
                                                myProfilePostType === 'recipe'
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                                    : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                                            }`}
                                        >
                                            레시피 게시판
                                        </button>
                                        <button
                                            onClick={() =>
                                                setMyProfilePostType(
                                                    'community',
                                                )
                                            }
                                            className={`px-4 py-2 rounded-md transition-colors ${
                                                myProfilePostType ===
                                                'community'
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                                    : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                                            }`}
                                        >
                                            커뮤니티
                                        </button>
                                    </div>
                                </div>

                                {/* Recipe Posts */}
                                {myProfilePostType === 'recipe' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {myPosts.map((post) => (
                                            <div
                                                key={post.id}
                                                onClick={() =>
                                                    onRecipeClick &&
                                                    onRecipeClick(post.id)
                                                }
                                                className="cursor-pointer bg-white rounded-lg overflow-hidden border-2 border-[#e5dfd5] hover:border-[#3d3226] transition-colors"
                                            >
                                                <img
                                                    src={post.thumbnail}
                                                    alt={post.title}
                                                    className="w-full aspect-video object-cover"
                                                />
                                                <div className="p-4">
                                                    <h4 className="text-lg text-[#3d3226] mb-2">
                                                        {post.title}
                                                    </h4>
                                                    <p className="text-sm text-[#6b5d4f]">
                                                        {post.date}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Community Posts */}
                                {myProfilePostType === 'community' && (
                                    <div className="space-y-4">
                                        {myCommunityPosts.map((post) => (
                                            <div
                                                key={post.id}
                                                onClick={() =>
                                                    onCommunityPostClick &&
                                                    onCommunityPostClick(
                                                        post.id,
                                                    )
                                                }
                                                className="cursor-pointer p-6 bg-white rounded-lg border-2 border-[#e5dfd5] hover:border-[#3d3226] transition-colors"
                                            >
                                                <h4 className="text-lg text-[#3d3226] mb-2">
                                                    {post.title}
                                                </h4>
                                                <div className="flex items-center gap-4 text-sm text-[#6b5d4f]">
                                                    <span>{post.date}</span>
                                                    <span>
                                                        조회 {post.views}
                                                    </span>
                                                    <span>
                                                        댓글 {post.comments}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Logout and Delete Account Buttons */}
                            <div className="mt-8 space-y-3">
                                <button
                                    onClick={onChangePasswordClick}
                                    className="w-full py-3 border-2 border-[#3d3226] text-[#3d3226] rounded-md hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors flex items-center justify-center gap-2"
                                >
                                    <RotateCcwKey size={20} />
                                    비밀번호 변경
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full py-3 border-2 border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    <UserX size={20} />
                                    회원 탈퇴
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'info' && (
                        <>
                            {/* Form - Only show when editing or no saved profile */}
                            {isEditing && (
                                <div className="p-8">
                                    <div className="space-y-6">
                                        {/* Profile Image */}
                                        <div className="flex flex-col items-center mb-6">
                                            <div className="relative">
                                                <div className="w-32 h-32 rounded-full border-4 border-[#d4cbbf] overflow-hidden bg-[#ebe5db] flex items-center justify-center">
                                                    {profileData.profileImgUrl ? (
                                                        <img
                                                            src={
                                                                profileData.profileImgUrl
                                                            }
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
                                                    onClick={() =>
                                                        fileInputRef.current?.click()
                                                    }
                                                    className="absolute bottom-0 right-0 bg-[#3d3226] text-[#f5f1eb] p-2 rounded-full hover:bg-[#5d4a36] transition-colors"
                                                >
                                                    <Upload size={20} />
                                                </button>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </div>
                                            <p className="mt-4 text-sm text-[#6b5d4f]">
                                                프로필 이미지를 업로드하세요
                                            </p>
                                        </div>

                                        {/* Nickname Display */}
                                        <div>
                                            <label className="block text-sm mb-2 text-[#3d3226]">
                                                닉네임
                                            </label>
                                            <div className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md bg-[#ebe5db] text-[#3d3226]">
                                                {profileData.username ||
                                                    '닉네임 없음'}
                                            </div>
                                        </div>

                                        {/* Gender */}
                                        <div>
                                            <label className="block text-sm mb-2 text-[#3d3226]">
                                                성별
                                            </label>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() =>
                                                        handleChange(
                                                            'gender',
                                                            '남성',
                                                        )
                                                    }
                                                    className={`flex-1 px-6 py-3 rounded-md border-2 transition-colors ${
                                                        profileData.gender ===
                                                        '남성'
                                                            ? 'bg-[#3d3226] text-[#f5f1eb] border-[#3d3226]'
                                                            : 'bg-white text-[#3d3226] border-[#d4cbbf] hover:border-[#3d3226]'
                                                    }`}
                                                >
                                                    남성
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleChange(
                                                            'gender',
                                                            '여성',
                                                        )
                                                    }
                                                    className={`flex-1 px-6 py-3 rounded-md border-2 transition-colors ${
                                                        profileData.gender ===
                                                        '여성'
                                                            ? 'bg-[#3d3226] text-[#f5f1eb] border-[#3d3226]'
                                                            : 'bg-white text-[#3d3226] border-[#d4cbbf] hover:border-[#3d3226]'
                                                    }`}
                                                >
                                                    여성
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleChange(
                                                            'gender',
                                                            '기타',
                                                        )
                                                    }
                                                    className={`flex-1 px-6 py-3 rounded-md border-2 transition-colors ${
                                                        profileData.gender ===
                                                        '기타'
                                                            ? 'bg-[#3d3226] text-[#f5f1eb] border-[#3d3226]'
                                                            : 'bg-white text-[#3d3226] border-[#d4cbbf] hover:border-[#3d3226]'
                                                    }`}
                                                >
                                                    기타
                                                </button>
                                            </div>
                                        </div>

                                        {/* Age */}
                                        <div>
                                            <label className="block text-sm mb-2 text-[#3d3226]">
                                                나이
                                            </label>
                                            <input
                                                type="number"
                                                value={profileData.age}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'age',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none bg-white"
                                                placeholder="예: 25"
                                            />
                                        </div>

                                        {/* Weight and Email */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm mb-2 text-[#3d3226]">
                                                    체중 (kg)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={profileData.weight}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            'weight',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none bg-white"
                                                    placeholder="예: 65"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm mb-2 text-[#3d3226]">
                                                    이메일
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="email"
                                                        value={
                                                            profileData.email
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                'email',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none bg-white pr-12"
                                                        placeholder="email@example.com"
                                                        disabled={
                                                            profileData.verifiedUser
                                                        }
                                                    />
                                                    {profileData.verifiedUser && (
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                            <CheckCircle
                                                                size={20}
                                                                className="text-emerald-500"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Email Verification */}
                                        {profileData.email && (
                                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border-2 border-emerald-200">
                                                {!profileData.verifiedUser ? (
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <Mail
                                                                size={20}
                                                                className="text-emerald-600"
                                                            />
                                                            <div>
                                                                <p className="text-sm text-[#3d3226] font-medium">
                                                                    이메일
                                                                    인증이
                                                                    필요합니다
                                                                </p>
                                                                <p className="text-xs text-[#6b5d4f]">
                                                                    게시글
                                                                    작성을 위해
                                                                    이메일
                                                                    인증을
                                                                    완료해주세요
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                // Mock email verification
                                                                setProfileData(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        verifiedUser: true,
                                                                    }),
                                                                );
                                                                alert(
                                                                    '이메일 인증이 완료되었습니다!',
                                                                );
                                                            }}
                                                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md hover:from-emerald-600 hover:to-teal-700 transition-colors text-sm shadow-md whitespace-nowrap"
                                                        >
                                                            이메일 인증
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        <CheckCircle
                                                            size={20}
                                                            className="text-emerald-600"
                                                        />
                                                        <div>
                                                            <p className="text-sm text-[#3d3226] font-medium">
                                                                ✓ 인증 완료
                                                            </p>
                                                            <p className="text-xs text-[#6b5d4f]">
                                                                이메일 인증이
                                                                완료되었습니다
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Allergies */}
                                        <div>
                                            <label className="block text-sm mb-2 text-[#3d3226]">
                                                알레르기 / 제한 식품
                                            </label>
                                            <textarea
                                                value={profileData.allergies}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'allergies',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none bg-white resize-none"
                                                rows={4}
                                                placeholder="예: 갑각류, 땅콩, 우유 등 알레르기가 있는 식품을 입력해주세요"
                                            />
                                        </div>

                                        {/* Save Button */}
                                        <button
                                            onClick={handleSave}
                                            className="w-full py-4 bg-[#3d3226] text-[#f5f1eb] rounded-md hover:bg-[#5d4a36] transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Save size={20} />
                                            프로필 저장
                                        </button>

                                        {/* Success Message */}
                                        {isSaved && (
                                            <div className="bg-green-100 border-2 border-green-500 text-green-700 px-4 py-3 rounded-md">
                                                프로필이 성공적으로
                                                저장되었습니다! ✓
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Saved Profile Display - Only show when saved and not editing */}
                            {principal && !isEditing && (
                                <div className="p-8">
                                    {/* Profile Image and Nickname */}
                                    <div className="flex flex-col items-center mb-8">
                                        <div className="w-32 h-32 rounded-full border-4 border-[#d4cbbf] overflow-hidden bg-[#ebe5db] flex items-center justify-center">
                                            {principal.profileImgUrl ? (
                                                <img
                                                    src={
                                                        principal.profileImgUrl
                                                    }
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
                                        <h2 className="text-2xl text-[#3d3226] mt-4">
                                            {principal.username ||
                                                '닉네임 없음'}
                                        </h2>
                                    </div>

                                    <h3 className="text-xl mb-6 text-[#3d3226]">
                                        저장된 프로필 정보
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#ebe5db] p-5 rounded-md border-2 border-[#d4cbbf]">
                                            <p className="text-sm text-[#6b5d4f] mb-2">
                                                성별
                                            </p>
                                            <p className="text-lg text-[#3d3226]">
                                                {principal.gender || '-'}
                                            </p>
                                        </div>
                                        <div className="bg-[#ebe5db] p-5 rounded-md border-2 border-[#d4cbbf]">
                                            <p className="text-sm text-[#6b5d4f] mb-2">
                                                나이
                                            </p>
                                            <p className="text-lg text-[#3d3226]">
                                                {principal.age
                                                    ? `${principal.age}세`
                                                    : '-'}
                                            </p>
                                        </div>
                                        <div className="bg-[#ebe5db] p-5 rounded-md border-2 border-[#d4cbbf]">
                                            <p className="text-sm text-[#6b5d4f] mb-2">
                                                체중
                                            </p>
                                            <p className="text-lg text-[#3d3226]">
                                                {principal.weight
                                                    ? `${principal.weight}kg`
                                                    : '-'}
                                            </p>
                                        </div>
                                        <div className="bg-[#ebe5db] p-5 rounded-md border-2 border-[#d4cbbf]">
                                            <p className="text-sm text-[#6b5d4f] mb-2">
                                                이메일
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-lg text-[#3d3226] flex-1 truncate">
                                                    {principal.email || '-'}
                                                </p>
                                                {principal.verifiedUser && (
                                                    <CheckCircle
                                                        size={18}
                                                        className="text-emerald-500 flex-shrink-0"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-[#ebe5db] p-5 rounded-md border-2 border-[#d4cbbf] col-span-2">
                                            <p className="text-sm text-[#6b5d4f] mb-2">
                                                알레르기 정보
                                            </p>
                                            <p className="text-lg text-[#3d3226]">
                                                {principal.allergies || '-'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Edit Button */}
                                    <button
                                        onClick={handleEdit}
                                        className="w-full mt-6 py-4 bg-[#3d3226] text-[#f5f1eb] rounded-md hover:bg-[#5d4a36] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit size={20} />
                                        프로필 수정하기
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* My Comments Tab */}
                    {activeTab === 'comments' && (
                        <div className="p-8">
                            <h3 className="text-xl mb-6 text-[#3d3226]">
                                내가 작성한 댓글
                            </h3>
                            <div className="space-y-4">
                                {myComments.length > 0 ? (
                                    myComments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="relative p-4 bg-[#ebe5db] rounded-lg border-2 border-[#d4cbbf] hover:border-[#3d3226] transition-colors"
                                        >
                                            <div
                                                onClick={() => {
                                                    if (
                                                        comment.type ===
                                                        'recipe'
                                                    ) {
                                                        if (onRecipeClick)
                                                            onRecipeClick(
                                                                comment.postId,
                                                            );
                                                    } else if (
                                                        comment.type ===
                                                        'community'
                                                    ) {
                                                        if (
                                                            onCommunityPostClick
                                                        )
                                                            onCommunityPostClick(
                                                                comment.postId,
                                                            );
                                                    }
                                                }}
                                                className="cursor-pointer pr-10"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                            comment.type ===
                                                            'recipe'
                                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                                                                : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                                                        }`}
                                                    >
                                                        {comment.type ===
                                                        'recipe'
                                                            ? '📋 레시피'
                                                            : '💬 커뮤니티'}
                                                    </span>
                                                    <span className="text-sm text-[#6b5d4f]">
                                                        게시글:{' '}
                                                        <span className="text-[#3d3226] font-medium">
                                                            {comment.postTitle}
                                                        </span>
                                                    </span>
                                                </div>
                                                <p className="text-[#3d3226] mb-2">
                                                    {comment.comment}
                                                </p>
                                                <p className="text-xs text-[#6b5d4f]">
                                                    {comment.date}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) =>
                                                    handleDeleteComment(
                                                        comment.id,
                                                        e,
                                                    )
                                                }
                                                className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors"
                                                title="댓글 삭제"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-[#6b5d4f] py-8">
                                        작성한 댓글이 없습니다.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* My Favorites Tab */}
                    {activeTab === 'favorites' && (
                        <div className="p-8">
                            <h3 className="text-xl mb-6 text-[#3d3226]">
                                저장한 게시물
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {myFavorites.length > 0 ? (
                                    myFavorites.map((favorite) => (
                                        <div
                                            key={favorite.id}
                                            onClick={() => {
                                                if (onRecipeClick)
                                                    onRecipeClick(favorite.id);
                                            }}
                                            className="cursor-pointer bg-white rounded-lg overflow-hidden border-2 border-[#e5dfd5] hover:border-[#3d3226] transition-colors"
                                        >
                                            <img
                                                src={favorite.thumbnail}
                                                alt={favorite.title}
                                                className="w-full aspect-video object-cover"
                                            />
                                            <div className="p-4">
                                                <h4 className="text-lg text-[#3d3226]">
                                                    {favorite.title}
                                                </h4>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="col-span-2 text-center text-[#6b5d4f] py-8">
                                        저장한 게시물이 없습니다.
                                    </p>
                                )}
                            </div>
                        </div>
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
