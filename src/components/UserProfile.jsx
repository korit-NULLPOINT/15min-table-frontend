/** @jsxImportSource @emotion/react */
// import * as s from "./styles";


import { useState, useEffect, useRef } from 'react';
import { Save, Edit, ArrowLeft, Upload, User as UserIcon, FileText, MessageSquare, Star } from 'lucide-react';

export function UserProfile({ onNavigate, onRecipeClick, userNickname }) {
    const [profileData, setProfileData] = useState({
        gender: '',
        age: '',
        weight: '',
        allergies: '',
        profileImage: '',
    });

    const [savedProfile, setSavedProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('info');
    const fileInputRef = useRef(null);

    // Load saved profile data from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('userProfile');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setProfileData(parsedData);
            setSavedProfile(parsedData);
            setIsEditing(false);
        }
    }, []);

    const handleChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result;
                setProfileData(prev => ({ ...prev, profileImage: imageData }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setSavedProfile(profileData);
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        setIsEditing(false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    // Mock data for posts, comments, and favorites
    const myPosts = [
        { id: 1, title: '초간단 김치볶음밥', date: '2026.01.10', thumbnail: 'https://images.unsplash.com/photo-1626803774007-f92c2c32cbe7?w=400' },
        { id: 2, title: '크림 파스타 레시피', date: '2026.01.08', thumbnail: 'https://images.unsplash.com/photo-1587740907856-997a958a68ac?w=400' },
    ];

    const myComments = [
        { id: 1, postTitle: '초간단 김치볶음밥', comment: '정말 맛있어 보이네요! 저도 만들어봐야겠어요', date: '2026.01.11', postId: 1 },
        { id: 2, postTitle: '로제 파스타', comment: '생크림 대신 우유 사용해도 되나요?', date: '2026.01.09', postId: 2 },
    ];

    const myFavorites = [
        { id: 3, title: '5분만에 완성 덮밥', thumbnail: 'https://images.unsplash.com/photo-1763844668895-6931b4e09458?w=400' },
        { id: 4, title: '라면 업그레이드', thumbnail: 'https://images.unsplash.com/photo-1627900440398-5db32dba8db1?w=400' },
    ];

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center gap-2 mb-6 text-[#3d3226] hover:text-[#5d4a36] transition-colors"
                >
                    <ArrowLeft size={20} />
                    메인으로 돌아가기
                </button>

                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#3d3226] text-[#f5f1eb] px-8 py-6">
                        <h1 className="text-3xl mb-2">내 프로필</h1>
                        <p className="text-[#e5dfd5]">건강한 식생활을 위한 정보를 입력해주세요</p>
                    </div>

                    {/* Tabs */}
                    <div className="border-b-2 border-[#e5dfd5] bg-[#ebe5db]">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${activeTab === 'info'
                                    ? 'bg-white text-[#3d3226] border-b-4 border-[#3d3226]'
                                    : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                                    }`}
                            >
                                <UserIcon size={20} />
                                프로필 정보
                            </button>
                            <button
                                onClick={() => setActiveTab('posts')}
                                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${activeTab === 'posts'
                                    ? 'bg-white text-[#3d3226] border-b-4 border-[#3d3226]'
                                    : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                                    }`}
                            >
                                <FileText size={20} />
                                내 게시글
                            </button>
                            <button
                                onClick={() => setActiveTab('comments')}
                                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${activeTab === 'comments'
                                    ? 'bg-white text-[#3d3226] border-b-4 border-[#3d3226]'
                                    : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                                    }`}
                            >
                                <MessageSquare size={20} />
                                내 댓글
                            </button>
                            <button
                                onClick={() => setActiveTab('favorites')}
                                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${activeTab === 'favorites'
                                    ? 'bg-white text-[#3d3226] border-b-4 border-[#3d3226]'
                                    : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                                    }`}
                            >
                                <Star size={20} />
                                찜한 게시물
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
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
                                                    {profileData.profileImage ? (
                                                        <img
                                                            src={profileData.profileImage}
                                                            alt="프로필"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <UserIcon size={48} className="text-[#6b5d4f]" />
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
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
                                            <p className="mt-4 text-sm text-[#6b5d4f]">프로필 이미지를 업로드하세요</p>
                                        </div>

                                        {/* Nickname Display */}
                                        <div>
                                            <label className="block text-sm mb-2 text-[#3d3226]">닉네임</label>
                                            <div className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md bg-[#ebe5db] text-[#3d3226]">
                                                {userNickname || '닉네임 없음'}
                                            </div>
                                        </div>

                                        {/* Gender */}
                                        <div>
                                            <label className="block text-sm mb-2 text-[#3d3226]">성별</label>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleChange('gender', '남성')}
                                                    className={`flex-1 px-6 py-3 rounded-md border-2 transition-colors ${profileData.gender === '남성'
                                                        ? 'bg-[#3d3226] text-[#f5f1eb] border-[#3d3226]'
                                                        : 'bg-white text-[#3d3226] border-[#d4cbbf] hover:border-[#3d3226]'
                                                        }`}
                                                >
                                                    남성
                                                </button>
                                                <button
                                                    onClick={() => handleChange('gender', '여성')}
                                                    className={`flex-1 px-6 py-3 rounded-md border-2 transition-colors ${profileData.gender === '여성'
                                                        ? 'bg-[#3d3226] text-[#f5f1eb] border-[#3d3226]'
                                                        : 'bg-white text-[#3d3226] border-[#d4cbbf] hover:border-[#3d3226]'
                                                        }`}
                                                >
                                                    여성
                                                </button>
                                                <button
                                                    onClick={() => handleChange('gender', '기타')}
                                                    className={`flex-1 px-6 py-3 rounded-md border-2 transition-colors ${profileData.gender === '기타'
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
                                            <label className="block text-sm mb-2 text-[#3d3226]">나이</label>
                                            <input
                                                type="number"
                                                value={profileData.age}
                                                onChange={(e) => handleChange('age', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none bg-white"
                                                placeholder="예: 25"
                                            />
                                        </div>

                                        {/* Weight */}
                                        <div>
                                            <label className="block text-sm mb-2 text-[#3d3226]">체중 (kg)</label>
                                            <input
                                                type="number"
                                                value={profileData.weight}
                                                onChange={(e) => handleChange('weight', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none bg-white"
                                                placeholder="예: 65"
                                            />
                                        </div>

                                        {/* Allergies */}
                                        <div>
                                            <label className="block text-sm mb-2 text-[#3d3226]">알레르기 / 제한 식품</label>
                                            <textarea
                                                value={profileData.allergies}
                                                onChange={(e) => handleChange('allergies', e.target.value)}
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
                                                프로필이 성공적으로 저장되었습니다! ✓
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Saved Profile Display - Only show when saved and not editing */}
                            {savedProfile && !isEditing && (
                                <div className="p-8">
                                    {/* Profile Image and Nickname */}
                                    <div className="flex flex-col items-center mb-8">
                                        <div className="w-32 h-32 rounded-full border-4 border-[#d4cbbf] overflow-hidden bg-[#ebe5db] flex items-center justify-center">
                                            {savedProfile.profileImage ? (
                                                <img
                                                    src={savedProfile.profileImage}
                                                    alt="프로필"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <UserIcon size={48} className="text-[#6b5d4f]" />
                                            )}
                                        </div>
                                        <h2 className="text-2xl text-[#3d3226] mt-4">{userNickname || '닉네임 없음'}</h2>
                                    </div>

                                    <h3 className="text-xl mb-6 text-[#3d3226]">저장된 프로필 정보</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#ebe5db] p-5 rounded-md border-2 border-[#d4cbbf]">
                                            <p className="text-sm text-[#6b5d4f] mb-2">성별</p>
                                            <p className="text-lg text-[#3d3226]">{savedProfile.gender || '-'}</p>
                                        </div>
                                        <div className="bg-[#ebe5db] p-5 rounded-md border-2 border-[#d4cbbf]">
                                            <p className="text-sm text-[#6b5d4f] mb-2">나이</p>
                                            <p className="text-lg text-[#3d3226]">{savedProfile.age ? `${savedProfile.age}세` : '-'}</p>
                                        </div>
                                        <div className="bg-[#ebe5db] p-5 rounded-md border-2 border-[#d4cbbf]">
                                            <p className="text-sm text-[#6b5d4f] mb-2">체중</p>
                                            <p className="text-lg text-[#3d3226]">{savedProfile.weight ? `${savedProfile.weight}kg` : '-'}</p>
                                        </div>
                                        <div className="bg-[#ebe5db] p-5 rounded-md border-2 border-[#d4cbbf] col-span-2">
                                            <p className="text-sm text-[#6b5d4f] mb-2">알레르기 정보</p>
                                            <p className="text-lg text-[#3d3226]">{savedProfile.allergies || '-'}</p>
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

                    {/* My Posts Tab */}
                    {activeTab === 'posts' && (
                        <div className="p-8">
                            <h3 className="text-xl mb-6 text-[#3d3226]">내가 작성한 게시글</h3>
                            <div className="space-y-4">
                                {myPosts.length > 0 ? (
                                    myPosts.map((post) => (
                                        <div
                                            key={post.id}
                                            onClick={() => {
                                                onRecipeClick?.(post.id);
                                            }}
                                            className="flex gap-4 p-4 bg-[#ebe5db] rounded-lg border-2 border-[#d4cbbf] hover:border-[#3d3226] cursor-pointer transition-colors"
                                        >
                                            <img
                                                src={post.thumbnail}
                                                alt={post.title}
                                                className="w-24 h-24 rounded-md object-cover"
                                            />
                                            <div className="flex-1">
                                                <h4 className="text-lg text-[#3d3226] mb-2">{post.title}</h4>
                                                <p className="text-sm text-[#6b5d4f]">{post.date}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-[#6b5d4f] py-8">작성한 게시글이 없습니다.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* My Comments Tab */}
                    {activeTab === 'comments' && (
                        <div className="p-8">
                            <h3 className="text-xl mb-6 text-[#3d3226]">내가 작성한 댓글</h3>
                            <div className="space-y-4">
                                {myComments.length > 0 ? (
                                    myComments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            onClick={() => {
                                                onRecipeClick?.(comment.postId);
                                            }}
                                            className="p-4 bg-[#ebe5db] rounded-lg border-2 border-[#d4cbbf] hover:border-[#3d3226] cursor-pointer transition-colors"
                                        >
                                            <p className="text-sm text-[#6b5d4f] mb-2">
                                                게시글: <span className="text-[#3d3226] font-medium">{comment.postTitle}</span>
                                            </p>
                                            <p className="text-[#3d3226] mb-2">{comment.comment}</p>
                                            <p className="text-xs text-[#6b5d4f]">{comment.date}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-[#6b5d4f] py-8">작성한 댓글이 없습니다.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* My Favorites Tab */}
                    {activeTab === 'favorites' && (
                        <div className="p-8">
                            <h3 className="text-xl mb-6 text-[#3d3226]">찜한 게시물</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {myFavorites.length > 0 ? (
                                    myFavorites.map((favorite) => (
                                        <div
                                            key={favorite.id}
                                            onClick={() => {
                                                onRecipeClick?.(favorite.id);
                                            }}
                                            className="cursor-pointer bg-white rounded-lg overflow-hidden border-2 border-[#e5dfd5] hover:border-[#3d3226] transition-colors"
                                        >
                                            <img
                                                src={favorite.thumbnail}
                                                alt={favorite.title}
                                                className="w-full aspect-video object-cover"
                                            />
                                            <div className="p-4">
                                                <h4 className="text-lg text-[#3d3226]">{favorite.title}</h4>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="col-span-2 text-center text-[#6b5d4f] py-8">찜한 게시물이 없습니다.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}