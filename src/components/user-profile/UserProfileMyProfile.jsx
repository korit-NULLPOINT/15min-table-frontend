import { Users, User as UserIcon, LoaderCircle } from 'lucide-react';

export default function UserProfileMyProfile({
    principal,
    isProfileImageLoading,
    imgRef,
    onImageLoad,
    onFollowersClick,
    onFollowingClick,
    myProfilePostType,
    setMyProfilePostType,
    myPosts,
    myCommunityPosts,
    onRecipeClick,
    onCommunityPostClick,
}) {
    return (
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
                                className={`w-full h-full object-cover transition-opacity duration-300 ${
                                    isProfileImageLoading
                                        ? 'opacity-0'
                                        : 'opacity-100'
                                }`}
                                onLoad={onImageLoad}
                                onError={onImageLoad}
                            />
                        </>
                    ) : (
                        <UserIcon size={48} className="text-[#6b5d4f]" />
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
                        <span className="text-sm text-[#6b5d4f]">팔로워</span>
                    </button>
                    <div className="w-px bg-[#d4cbbf]" />
                    <button
                        onClick={onFollowingClick}
                        className="flex flex-col items-center gap-1 px-4 py-2 hover:bg-[#ebe5db] rounded-md transition-colors"
                    >
                        <span className="text-2xl font-bold text-[#3d3226]">
                            89
                        </span>
                        <span className="text-sm text-[#6b5d4f]">팔로잉</span>
                    </button>
                </div>
            </div>

            {/* User Posts */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl text-[#3d3226]">
                        내가 작성한 게시글
                    </h3>

                    <div className="flex gap-2 bg-[#ebe5db] p-1 rounded-md border-2 border-[#d4cbbf]">
                        <button
                            onClick={() => setMyProfilePostType('recipe')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                myProfilePostType === 'recipe'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                    : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                            }`}
                        >
                            레시피 게시판
                        </button>
                        <button
                            onClick={() => setMyProfilePostType('community')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                myProfilePostType === 'community'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                    : 'text-[#6b5d4f] hover:bg-[#f5f1eb]'
                            }`}
                        >
                            커뮤니티
                        </button>
                    </div>
                </div>

                {myProfilePostType === 'recipe' && (
                    <div className="grid grid-cols-2 gap-4">
                        {myPosts.map((post) => (
                            <div
                                key={post.id}
                                onClick={() => onRecipeClick?.(post.id)}
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

                {myProfilePostType === 'community' && (
                    <div className="space-y-4">
                        {myCommunityPosts.map((post) => (
                            <div
                                key={post.id}
                                onClick={() => onCommunityPostClick?.(post.id)}
                                className="cursor-pointer p-6 bg-white rounded-lg border-2 border-[#e5dfd5] hover:border-[#3d3226] transition-colors"
                            >
                                <h4 className="text-lg text-[#3d3226] mb-2">
                                    {post.title}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-[#6b5d4f]">
                                    <span>{post.date}</span>
                                    <span>조회 {post.views}</span>
                                    <span>댓글 {post.comments}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
