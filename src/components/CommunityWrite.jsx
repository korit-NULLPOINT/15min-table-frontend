import { useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';

export function CommunityWrite({ onNavigate }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [hashtags, setHashtags] = useState([]);
    const [newHashtag, setNewHashtag] = useState('');

    const addHashtag = () => {
        if (newHashtag.trim() && !hashtags.includes(newHashtag.trim())) {
            setHashtags([...hashtags, newHashtag.trim()]);
            setNewHashtag('');
        }
    };

    const removeHashtag = (tag) => {
        setHashtags(hashtags.filter(t => t !== tag));
    };

    const handleSubmit = () => {
        // TODO: Implement post submission
        console.log({ title, content, hashtags });
        alert('게시글이 등록되었습니다!');
        onNavigate('community');
    };

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => onNavigate('community')}
                    className="flex items-center gap-2 mb-6 text-[#3d3226] hover:text-[#5d4a36] transition-colors"
                >
                    <ArrowLeft size={20} />
                    돌아가기
                </button>

                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#3d3226] text-[#f5f1eb] px-8 py-6">
                        <h1 className="text-3xl mb-2">커뮤니티 글쓰기</h1>
                        <p className="text-[#e5dfd5]">자유롭게 이야기를 나눠보세요</p>
                    </div>

                    {/* Form */}
                    <div className="p-8 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226]">제목</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none"
                                placeholder="제목을 입력하세요"
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226]">내용</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none resize-none"
                                rows={12}
                                placeholder="내용을 입력하세요..."
                            />
                        </div>

                        {/* Hashtags */}
                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226]">해시태그</label>

                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newHashtag}
                                    onChange={(e) => setNewHashtag(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
                                    className="flex-1 px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none"
                                    placeholder="해시태그 입력 (# 없이)"
                                />
                                <button
                                    onClick={addHashtag}
                                    className="px-6 py-3 bg-[#3d3226] text-[#f5f1eb] rounded-md hover:bg-[#5d4a36] transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {hashtags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="flex items-center gap-2 px-3 py-2 bg-[#ebe5db] text-[#3d3226] rounded-full border border-[#d4cbbf]"
                                    >
                                        #{tag}
                                        <button
                                            onClick={() => removeHashtag(tag)}
                                            className="hover:text-red-600 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full py-4 bg-[#3d3226] text-[#f5f1eb] rounded-md hover:bg-[#5d4a36] transition-colors font-medium text-lg"
                        >
                            게시글 등록하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
