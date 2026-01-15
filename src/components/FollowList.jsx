import { useState } from 'react';
import { ArrowLeft, User as UserIcon } from 'lucide-react';

export function FollowList({ onNavigate, type, onUserClick }) {
    const [users, setUsers] = useState([
        { id: 1, name: '요리왕김치', profileImage: '', isFollowing: true },
        { id: 2, name: '자취생24', profileImage: '', isFollowing: true },
        { id: 3, name: '혼밥러버', profileImage: '', isFollowing: false },
        { id: 4, name: '간편요리', profileImage: '', isFollowing: true },
        { id: 5, name: '레시피마스터', profileImage: '', isFollowing: false },
    ]);

    const handleToggleFollow = (userId) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
        ));
    };

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => onNavigate('profile')}
                    className="flex items-center gap-2 mb-6 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
                >
                    <ArrowLeft size={20} />
                    돌아가기
                </button>

                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#3d3226] text-[#f5f1eb] px-8 py-6">
                        <h1 className="text-3xl mb-2">{type === 'followers' ? '팔로워' : '팔로잉'}</h1>
                        <p className="text-[#e5dfd5]">{users.length}명</p>
                    </div>

                    {/* User List */}
                    <div className="p-8">
                        <div className="space-y-4">
                            {users.map(user => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-4 p-4 bg-[#ebe5db] rounded-lg border-2 border-[#d4cbbf] hover:border-[#3d3226] transition-colors"
                                >
                                    <div
                                        onClick={() => onUserClick && onUserClick(user.id, user.name)}
                                        className="flex items-center gap-4 flex-1 cursor-pointer"
                                    >
                                        <div className="w-16 h-16 rounded-full border-2 border-[#d4cbbf] overflow-hidden bg-[#f5f1eb] flex items-center justify-center">
                                            {user.profileImage ? (
                                                <img
                                                    src={user.profileImage}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <UserIcon size={32} className="text-[#6b5d4f]" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg text-[#3d3226] font-medium">{user.name}</h3>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleToggleFollow(user.id)}
                                        className={`px-6 py-2 rounded-md transition-colors ${user.isFollowing
                                            ? 'bg-[#3d3226] text-[#f5f1eb] hover:bg-[#5d4a36]'
                                            : 'border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb]'
                                            }`}
                                    >
                                        {user.isFollowing ? '팔로잉' : '팔로우'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
