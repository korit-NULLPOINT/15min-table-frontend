import { useState, useRef } from 'react';
import { ArrowLeft, Upload, Plus, X, Sparkles } from 'lucide-react';

export function RecipeWrite({ onNavigate }) {
    const [title, setTitle] = useState('');
    const [completedImage, setCompletedImage] = useState('');
    const [ingredientsImage, setIngredientsImage] = useState('');
    const [ingredients, setIngredients] = useState(['']);
    const [cookingMethod, setCookingMethod] = useState('');
    const [hashtags, setHashtags] = useState([]);
    const [newHashtag, setNewHashtag] = useState('');

    const completedImageRef = useRef(null);
    const ingredientsImageRef = useRef(null);

    const handleImageUpload = (e, type) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result;
                if (type === 'completed') {
                    setCompletedImage(imageData);
                } else {
                    setIngredientsImage(imageData);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleIngredientChange = (index, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const handleIngredientKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (index === ingredients.length - 1 && ingredients[index].trim()) {
                setIngredients([...ingredients, '']);
            }
        }
    };

    const removeIngredient = (index) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter((_, i) => i !== index));
        }
    };

    const generateAIHashtags = () => {
        // Mock AI hashtag generation
        const aiHashtags = ['15분요리', '간단레시피', '자취생필수', '초간단'];
        setHashtags([...hashtags, ...aiHashtags.filter(tag => !hashtags.includes(tag))]);
    };

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
        // TODO: Implement recipe submission
        console.log({
            title,
            completedImage,
            ingredientsImage,
            ingredients: ingredients.filter(i => i.trim()),
            cookingMethod,
            hashtags,
        });
        alert('레시피가 등록되었습니다!');
        onNavigate('home');
    };

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center gap-2 mb-6 text-[#3d3226] hover:text-[#5d4a36] transition-colors"
                >
                    <ArrowLeft size={20} />
                    돌아가기
                </button>

                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#3d3226] text-[#f5f1eb] px-8 py-6">
                        <h1 className="text-3xl mb-2">레시피 작성하기</h1>
                        <p className="text-[#e5dfd5]">나만의 특별한 레시피를 공유해보세요</p>
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
                                placeholder="예: 초간단 김치볶음밥"
                            />
                        </div>

                        {/* Completed Image */}
                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226]">완성 사진 (썸네일)</label>
                            <div className="flex gap-4">
                                {completedImage && (
                                    <img src={completedImage} alt="완성" className="w-32 h-32 object-cover rounded-md" />
                                )}
                                <button
                                    onClick={() => completedImageRef.current?.click()}
                                    className="flex items-center gap-2 px-6 py-3 border-2 border-[#d4cbbf] rounded-md hover:border-[#3d3226] transition-colors"
                                >
                                    <Upload size={20} />
                                    {completedImage ? '사진 변경' : '사진 업로드'}
                                </button>
                                <input
                                    ref={completedImageRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'completed')}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Ingredients Image */}
                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226]">재료 전체 사진</label>
                            <div className="flex gap-4">
                                {ingredientsImage && (
                                    <img src={ingredientsImage} alt="재료" className="w-32 h-32 object-cover rounded-md" />
                                )}
                                <button
                                    onClick={() => ingredientsImageRef.current?.click()}
                                    className="flex items-center gap-2 px-6 py-3 border-2 border-[#d4cbbf] rounded-md hover:border-[#3d3226] transition-colors"
                                >
                                    <Upload size={20} />
                                    {ingredientsImage ? '사진 변경' : '사진 업로드'}
                                </button>
                                <input
                                    ref={ingredientsImageRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'ingredients')}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226]">재료 (Enter로 항목 추가)</label>
                            <div className="space-y-2">
                                {ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={ingredient}
                                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                                            onKeyDown={(e) => handleIngredientKeyDown(e, index)}
                                            className="flex-1 px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none"
                                            placeholder={`재료 ${index + 1}`}
                                        />
                                        {ingredients.length > 1 && (
                                            <button
                                                onClick={() => removeIngredient(index)}
                                                className="p-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <X size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cooking Method */}
                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226]">조리 방법</label>
                            <textarea
                                value={cookingMethod}
                                onChange={(e) => setCookingMethod(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none resize-none"
                                rows={8}
                                placeholder="조리 방법을 상세히 입력해주세요..."
                            />
                        </div>

                        {/* Hashtags */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm text-[#3d3226]">해시태그</label>
                                <button
                                    onClick={generateAIHashtags}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 transition-colors text-sm"
                                >
                                    <Sparkles size={16} />
                                    AI 해시태그 생성
                                </button>
                            </div>

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
                            레시피 등록하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
