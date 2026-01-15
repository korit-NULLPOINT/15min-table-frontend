import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';

export function CommunityEdit({ postId, onNavigate, userNickname }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    // 기존 게시글 데이터 불러오기
    useEffect(() => {
        // Mock 데이터 (실제로는 localStorage나 서버에서 가져옴)
        const mockPost = {
            id: postId,
            title: '자취생 필수 조리도구 추천',
            content: '자취하면서 꼭 필요한 조리도구들을 추천해드립니다. 가성비 좋은 제품들 위주로 골라봤어요!',
            images: [
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
                'https://images.unsplash.com/photo-1584990347449-39b4aa02cf92?w=800'
            ]
        };

        setTitle(mockPost.title);
        setContent(mockPost.content);
        setImages(mockPost.images);
    }, [postId]);

    const handleImageUpload = (e) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files);
            fileArray.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImages(prev => [...prev, reader.result]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        setIsSaving(true);

        // Mock 저장 (실제로는 localStorage나 서버에 저장)
        setTimeout(() => {
            alert('게시글이 수정되었습니다!');
            setIsSaving(false);
            onNavigate('profile'); // 프로필 페이지로 이동
        }, 500);
    };

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => onNavigate('profile')}
                    className="flex items-center gap-2 mb-6 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
                >
                    <ArrowLeft size={20} />
                    취소하고 돌아가기
                </button>

                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#3d3226] text-[#f5f1eb] px-8 py-6">
                        <h1 className="text-3xl mb-2">커뮤니티 게시글 수정</h1>
                        <p className="text-[#e5dfd5]">제목, 내용, 사진을 수정할 수 있습니다</p>
                    </div>

                    {/* Form */}
                    <div className="p-8 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226] font-medium">
                                제목 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none bg-white text-[#3d3226]"
                                placeholder="게시글 제목을 입력하세요"
                                maxLength={100}
                            />
                            <p className="text-sm text-[#6b5d4f] mt-1">{title.length}/100</p>
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226] font-medium">
                                내용 <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none bg-white resize-none text-[#3d3226]"
                                rows={12}
                                placeholder="내용을 입력하세요"
                            />
                            <p className="text-sm text-[#6b5d4f] mt-1">{content.length}자</p>
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226] font-medium">
                                이미지 (선택사항)
                            </label>

                            {/* Image Upload Button */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full px-4 py-3 border-2 border-dashed border-[#d4cbbf] rounded-md hover:border-[#3d3226] transition-colors bg-[#ebe5db] text-[#3d3226] flex items-center justify-center gap-2"
                            >
                                <Upload size={20} />
                                이미지 추가하기
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                            />

                            {/* Image Preview */}
                            {images.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image}
                                                alt={`이미지 ${index + 1}`}
                                                className="w-full h-48 object-cover rounded-md border-2 border-[#d4cbbf]"
                                            />
                                            <button
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full py-4 bg-[#3d3226] text-[#f5f1eb] rounded-md hover:bg-[#5d4a36] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={20} />
                            {isSaving ? '저장 중...' : '수정 완료'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
