import { useState, useRef } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';

export function CommunityWrite({ onNavigate }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = () => {
        // TODO: Implement post submission
        console.log({ title, content, image });
        alert('게시글이 등록되었습니다!');
        onNavigate('community');
    };

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => onNavigate('community')}
                    className="flex items-center gap-2 mb-6 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
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

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226]">이미지 업로드</label>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-6 py-3 bg-[#3d3226] text-[#f5f1eb] rounded-md hover:bg-[#5d4a36] transition-colors flex items-center gap-2"
                            >
                                <Upload size={20} />
                                이미지 선택
                            </button>

                            {image && (
                                <div className="relative mt-4">
                                    <img
                                        src={image}
                                        alt="Uploaded"
                                        className="w-full h-64 object-cover rounded-md border-2 border-[#d4cbbf]"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            )}
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
