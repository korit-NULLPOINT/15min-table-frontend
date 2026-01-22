import { useState, useRef, useEffect } from 'react';
import {
    ArrowLeft,
    Upload,
    Plus,
    X,
    Sparkles,
    Mail,
    Filter,
} from 'lucide-react';
import { usePrincipalState } from '../../store/usePrincipalState';
import { useAddRecipe } from '../../apis/generated/recipe-controller/recipe-controller';
import { mainCategory, subCategory } from '../../utils/categoryData';

export function RecipeWrite({ onNavigate }) {
    const [showEmailWarning, setShowEmailWarning] = useState(false);
    const principal = usePrincipalState((s) => s.principal);
    const logout = usePrincipalState((s) => s.logout);

    const { mutateAsync: addRecipeMutate } = useAddRecipe();

    const [title, setTitle] = useState('');
    const [selectedMainCategoryId, setSelectedMainCategoryId] = useState('');
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
    const [thumbnailImgUrl, setThumbnailImgUrl] = useState('');
    const [ingredientImgUrl, setIngredientImgUrl] = useState('');
    const thumbnailImgUrlRef = useRef('');
    const ingredientImgUrlRef = useRef('');
    const [ingredients, setIngredients] = useState(['']);
    const [steps, setSteps] = useState(['']);
    const [intro, setIntro] = useState('');

    const [hashtags, setHashtags] = useState([]);
    const [newHashtag, setNewHashtag] = useState('');

    const handleImageUpload = (e, type) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result;
                if (type === 'completed') {
                    setThumbnailImgUrl(imageData);
                } else {
                    setIngredientImgUrl(imageData);
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
        setHashtags([
            ...hashtags,
            ...aiHashtags.filter((tag) => !hashtags.includes(tag)),
        ]);
    };

    const addHashtag = () => {
        if (newHashtag.trim() && !hashtags.includes(newHashtag.trim())) {
            setHashtags([...hashtags, newHashtag.trim()]);
            setNewHashtag('');
        }
    };

    const removeHashtag = (tag) => {
        setHashtags(hashtags.filter((t) => t !== tag));
    };

    const handleSubmit = async () => {
        // Check email verification

        if (!principal) {
            alert('잘못된 접근 입니다.');
            return;
        }

        let minId = Infinity;
        for (const r of principal.userRoles) {
            if (r.roleId < minId) {
                minId = r.roleId;
            }
        }
        console.log(minId);
        if (minId >= 3) {
            setShowEmailWarning(true);
            return;
        }

        const addRecipeData = {
            mainCategoryId: selectedMainCategoryId,
            subCategoryId: selectedSubCategoryId,
            title,
            intro,
            thumbnailImgUrl,
            ingredients: JSON.stringify(ingredients),
            ingredientImgUrl,
            steps,
        };
        // TODO: Implement recipe submission
        console.log(addRecipeData);
        try {
            await addRecipeMutate({ boardId: 1, data: addRecipeData });
            alert('레시피가 등록되었습니다!');
            onNavigate('/boards/1/recipe/');
        } catch (error) {
            console.error('레시피 등록 실패:', error);
            alert('레시피 등록 중 오류가 발생했습니다.');
        }
    };

    const handleGoToProfile = () => {
        setShowEmailWarning(false);
        onNavigate('profile');
    };

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center gap-2 mb-6 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
                >
                    <ArrowLeft size={20} />
                    돌아가기
                </button>

                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#3d3226] text-[#f5f1eb] px-8 py-6">
                        <h1 className="text-3xl mb-2">레시피 작성하기</h1>
                        <p className="text-[#e5dfd5]">
                            나만의 특별한 레시피를 공유해보세요
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226]">
                                제목
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none"
                                placeholder="예: 초간단 김치볶음밥"
                            />
                        </div>

                        {/* Category Filters */}
                        <div className="p-6 border-b-2 border-[#e5dfd5]">
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Filter
                                        size={18}
                                        className="text-[#3d3226]"
                                    />
                                    <h3 className="text-sm uppercase tracking-wider text-[#6b5d4f]">
                                        메인 카테고리
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(mainCategory).map(
                                        ([id, label]) => (
                                            <button
                                                key={id}
                                                onClick={() => {
                                                    // 같은 카테고리를 다시 클릭하면 선택 취소
                                                    if (
                                                        selectedMainCategoryId ===
                                                        id
                                                    ) {
                                                        setSelectedMainCategoryId(
                                                            '',
                                                        );
                                                    } else {
                                                        setSelectedMainCategoryId(
                                                            id,
                                                        );
                                                    }
                                                }}
                                                className={`px-4 py-2 rounded-md border-2 transition-colors ${
                                                    selectedMainCategoryId ===
                                                    id
                                                        ? 'bg-[#3d3226] text-[#f5f1eb] border-[#3d3226]'
                                                        : 'bg-white text-[#3d3226] border-[#d4cbbf] hover:border-[#3d3226]'
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Filter
                                        size={18}
                                        className="text-[#3d3226]"
                                    />
                                    <h3 className="text-sm uppercase tracking-wider text-[#6b5d4f]">
                                        부 카테고리
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(subCategory).map(
                                        ([id, label]) => (
                                            <button
                                                key={label}
                                                onClick={() => {
                                                    // 같은 카테고리를 다시 클릭하면 선택 취소
                                                    if (
                                                        selectedSubCategoryId ===
                                                        id
                                                    ) {
                                                        setSelectedSubCategoryId(
                                                            '',
                                                        );
                                                    } else {
                                                        setSelectedSubCategoryId(
                                                            id,
                                                        );
                                                    }
                                                }}
                                                className={`px-4 py-2 rounded-md border-2 transition-colors ${
                                                    selectedSubCategoryId === id
                                                        ? 'bg-[#3d3226] text-[#f5f1eb] border-[#3d3226]'
                                                        : 'bg-white text-[#3d3226] border-[#d4cbbf] hover:border-[#3d3226]'
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Completed Image */}
                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226]">
                                완성 사진 (썸네일)
                            </label>
                            <div className="flex gap-4">
                                {thumbnailImgUrl && (
                                    <img
                                        src={thumbnailImgUrl}
                                        alt="완성"
                                        className="w-32 h-32 object-cover rounded-md"
                                    />
                                )}
                                <button
                                    onClick={() =>
                                        thumbnailImgUrlRef.current?.click()
                                    }
                                    className="flex items-center gap-2 px-6 py-3 border-2 border-[#d4cbbf] rounded-md hover:border-[#3d3226] transition-colors"
                                >
                                    <Upload size={20} />
                                    {thumbnailImgUrl
                                        ? '사진 변경'
                                        : '사진 업로드'}
                                </button>
                                <input
                                    ref={thumbnailImgUrlRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleImageUpload(e, 'completed')
                                    }
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Ingredients Image */}
                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226]">
                                재료 전체 사진
                            </label>
                            <div className="flex gap-4">
                                {ingredientImgUrl && (
                                    <img
                                        src={ingredientImgUrl}
                                        alt="재료"
                                        className="w-32 h-32 object-cover rounded-md"
                                    />
                                )}
                                <button
                                    onClick={() =>
                                        ingredientImgUrlRef.current?.click()
                                    }
                                    className="flex items-center gap-2 px-6 py-3 border-2 border-[#d4cbbf] rounded-md hover:border-[#3d3226] transition-colors"
                                >
                                    <Upload size={20} />
                                    {ingredientImgUrl
                                        ? '사진 변경'
                                        : '사진 업로드'}
                                </button>
                                <input
                                    ref={ingredientImgUrlRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleImageUpload(e, 'ingredients')
                                    }
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226]">
                                재료 (Enter로 항목 추가)
                            </label>
                            <div className="space-y-2">
                                {ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={ingredient}
                                            onChange={(e) =>
                                                handleIngredientChange(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            onKeyDown={(e) =>
                                                handleIngredientKeyDown(
                                                    e,
                                                    index,
                                                )
                                            }
                                            className="flex-1 px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none"
                                            placeholder={`재료 ${index + 1}`}
                                        />
                                        {ingredients.length > 1 && (
                                            <button
                                                onClick={() =>
                                                    removeIngredient(index)
                                                }
                                                className="p-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <X size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226]">
                                요리 소개
                            </label>
                            <input
                                type="text"
                                value={intro}
                                onChange={(e) => setIntro(e.target.value)}
                                className="flex-1 px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none w-full"
                                placeholder="요리에 대한 간단한 소개를 입력해주세요."
                            />
                        </div>
                        {/* Cooking Method */}
                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226]">
                                조리 방법
                            </label>
                            <textarea
                                value={steps}
                                onChange={(e) => setSteps(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none resize-none"
                                rows={8}
                                placeholder="조리 방법을 상세히 입력해주세요..."
                            />
                        </div>

                        {/* Hashtags */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm text-[#3d3226]">
                                    해시태그
                                </label>
                                <button
                                    onClick={generateAIHashtags}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md hover:from-emerald-600 hover:to-teal-700 transition-colors text-sm shadow-md"
                                >
                                    <Sparkles size={16} />
                                    AI 해시태그 생성
                                </button>
                            </div>

                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newHashtag}
                                    onChange={(e) =>
                                        setNewHashtag(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' &&
                                        (e.preventDefault(), addHashtag())
                                    }
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

                {/* Email Verification Warning Modal */}
                {showEmailWarning && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full border-2 border-[#e5dfd5]">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-t-lg">
                                <h3 className="text-xl font-bold">
                                    이메일 인증 필요
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <Mail
                                            size={24}
                                            className="text-emerald-600"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[#3d3226] mb-2">
                                            게시글 작성을 위해서는 이메일 인증이
                                            필요합니다.
                                        </p>
                                        <p className="text-sm text-[#6b5d4f]">
                                            프로필 페이지에서 이메일 인증을
                                            완료해주세요.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() =>
                                            setShowEmailWarning(false)
                                        }
                                        className="flex-1 px-4 py-3 border-2 border-[#d4cbbf] text-[#3d3226] rounded-md hover:border-[#3d3226] transition-colors"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={handleGoToProfile}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md hover:from-emerald-600 hover:to-teal-700 transition-colors shadow-md"
                                    >
                                        이메일 인증하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
