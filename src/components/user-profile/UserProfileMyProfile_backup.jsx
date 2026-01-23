import { Users, User as UserIcon, LoaderCircle } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function UserProfileMyProfile({
    principal,
    isProfileImageLoading,
    imgRef,
    onImageLoad,
    onFollowersClick,
    onFollowingClick,
}) {
    return (
        <div className="p-8">
            {/* Profile Image and Nickname */}
            <div className="flex flex-col items-center justify-center mb-8">
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
        </div>
    );
}
