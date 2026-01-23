import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Upload, Mail, Filter, LoaderCircle, X } from 'lucide-react';

import { usePrincipalState } from '../../store/usePrincipalState';
import { useAddRecipe } from '../../apis/generated/recipe-controller/recipe-controller';
import { mainCategory, subCategory } from '../../utils/categoryData';

import { storage } from '../../apis/utils/config/firebaseConfig';
import { useFirebaseImageUpload } from '../../hooks/useFirebaseImageUpload';
import { useApiErrorMessage } from '../../hooks/useApiErrorMessage';
import { RecipeHashtag } from './RecipeHashtag';
import { useAddRecipeHashtags } from '../../apis/generated/recipe-hashtag-controller/recipe-hashtag-controller';

export function RecipeWrite({ onNavigate }) {
    const [showEmailWarning, setShowEmailWarning] = useState(false);

    const principal = usePrincipalState((s) => s.principal);

    const { mutateAsync: addRecipeMutate, isPending: isAdding } =
        useAddRecipe();
    const { mutateAsync: addHashtagsMutate } = useAddRecipeHashtags();

    const [title, setTitle] = useState('');
    const [selectedMainCategoryId, setSelectedMainCategoryId] = useState('');
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
    const [thumbnailImgUrl, setThumbnailImgUrl] = useState('');
    const [ingredientImgUrl, setIngredientImgUrl] = useState('');

    const thumbnailInputRef = useRef(null);
    const ingredientInputRef = useRef(null);

    const inputRefs = useRef([]);
    const [ingredients, setIngredients] = useState(['']);
    const [intro, setIntro] = useState('');
    const [steps, setSteps] = useState('');

    const [hashtags, setHashtags] = useState([]);

    /* -----------------------------
     * 1) 에러 메시지 훅(레시피 등록)
     * ----------------------------- */
    const {
        errorMessage: submitError,
        clearError: clearSubmitError,
        handleApiError: handleSubmitApiError,
    } = useApiErrorMessage();

    /* -----------------------------
     * 2) Firebase 이미지 업로드 훅(썸네일/재료)
     * ----------------------------- */
    const {
        errorMessage: imgError,
        clearError: clearImgError,
        handleApiError: handleImgApiError,
    } = useApiErrorMessage();

    const {
        upload: uploadImage,
        isUploading,
        progress: uploadProgress,
        resetProgress,
    } = useFirebaseImageUpload(storage, {
        maxMB: 2,
        allowTypes: ['image/jpeg', 'image/png', 'image/webp'],
    });

    const isSubmitDisabled = isAdding || isUploading;

    const handleIngredientChange = (index, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const handleIngredientKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (ingredients[index].trim()) {
                if (index === ingredients.length - 1) {
                    setIngredients([...ingredients, '']);
                } else {
                    inputRefs.current[index + 1]?.focus();
                }
            }
        }
    };

    useEffect(() => {
        if (
            inputRefs.current[ingredients.length - 1] &&
            ingredients.length > 1
        ) {
            inputRefs.current[ingredients.length - 1].focus();
        }
    }, [ingredients.length]);

    const removeIngredient = (index) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter((_, i) => i !== index));
        }
    };

    const checkEmailVerifiedOrWarn = () => {
        if (!principal) return false;

        let minId = Infinity;
        for (const r of principal.userRoles ?? []) {
            if (r.roleId < minId) minId = r.roleId;
        }
        // TEMP_USER >= 3 가정 (너 코드 기준)
        if (minId >= 3) {
            setShowEmailWarning(true);
            return false;
        }
        return true;
    };

    const handleGoToProfile = () => {
        setShowEmailWarning(false);
        onNavigate?.('profile');
    };

    const uploadAndSetImage = async (file, kind) => {
        // kind: 'thumbnail' | 'ingredient'
        clearImgError();
        resetProgress();

        if (!principal?.userId) {
            await handleImgApiError(new Error('NO_USER_ID'), {
                fallbackMessage: '사용자 정보가 없어 업로드할 수 없습니다.',
            });
            return;
        }

        try {
            // ✅ 경로를 구분해두면 관리가 쉬움
            const dir =
                kind === 'thumbnail'
                    ? `recipe-thumbnail/${principal.userId}`
                    : `recipe-ingredients/${principal.userId}`;

            const url = await uploadImage(file, { dir });

            if (kind === 'thumbnail') setThumbnailImgUrl(url);
            else setIngredientImgUrl(url);
        } catch (e) {
            await handleImgApiError(e, {
                fallbackMessage:
                    e?.message ||
                    '이미지 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.',
            });
        }
    };

    const handleThumbnailChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const resetInput = () => {
            try {
                e.target.value = '';
            } catch {}
        };

        if (isSubmitDisabled) {
            resetInput();
            return;
        }

        await uploadAndSetImage(file, 'thumbnail');
        resetInput();
    };

    const handleIngredientImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const resetInput = () => {
            try {
                e.target.value = '';
            } catch {}
        };

        if (isSubmitDisabled) {
            resetInput();
            return;
        }

        await uploadAndSetImage(file, 'ingredient');
        resetInput();
    };

    const handleSubmit = async () => {
        clearSubmitError();

        if (!principal) {
            alert('잘못된 접근 입니다.');
            return;
        }

        if (!checkEmailVerifiedOrWarn()) return;

        const addRecipeData = {
            mainCategoryId: selectedMainCategoryId
                ? Number(selectedMainCategoryId)
                : undefined,
            subCategoryId: selectedSubCategoryId
                ? Number(selectedSubCategoryId)
                : undefined,
            title,
            intro,
            thumbnailImgUrl,
            ingredients: JSON.stringify(ingredients),
            ingredientImgUrl,
            steps, // 지금은 string textarea 기준
            // ✅ 해시태그는 추후 API 있으면 여기서 같이 보내거나 별도 API 호출
        };

        try {
            const result = await addRecipeMutate({
                boardId: 1,
                data: addRecipeData,
            });

            // result가 숫자형 ID라고 가정하거나 객체 안에 ID가 있는지 확인
            // useAddRecipe의 응답 타입에 따라 다르지만, 보통 data.data가 ID인 경우가 많음
            // 혹은 result 자체가 ID일 수 있음. 안전하게 처리.
            const newRecipeId = result?.data?.data || result?.data || result;

            if (hashtags.length > 0 && newRecipeId) {
                await addHashtagsMutate({
                    data: {
                        recipeId: Number(newRecipeId),
                        hashtagNames: hashtags,
                    },
                });
            }

            alert('레시피가 등록되었습니다!');
            onNavigate?.('board');
        } catch (e) {
            await handleSubmitApiError(e, {
                fallbackMessage: '레시피 등록 중 오류가 발생했습니다.',
                map: (msg, status) => {
                    if (status === 401) return '로그인이 필요합니다.';
                    if (status === 403) return '권한이 없습니다.';
                    return msg;
                },
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => onNavigate?.('home')}
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
                        {/* Submit error */}
                        {submitError && (
                            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-md">
                                {submitError}
                            </div>
                        )}

                        {/* Image error */}
                        {imgError && (
                            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-md">
                                {imgError}
                            </div>
                        )}

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
                                                    setSelectedMainCategoryId(
                                                        selectedMainCategoryId ===
                                                            id
                                                            ? ''
                                                            : id,
                                                    );
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
                                                key={id}
                                                onClick={() => {
                                                    setSelectedSubCategoryId(
                                                        selectedSubCategoryId ===
                                                            id
                                                            ? ''
                                                            : id,
                                                    );
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
                            <div className="flex gap-4 items-center">
                                {thumbnailImgUrl && (
                                    <img
                                        src={thumbnailImgUrl}
                                        alt="완성"
                                        className="w-32 h-32 object-cover rounded-md"
                                    />
                                )}

                                <button
                                    disabled={isSubmitDisabled}
                                    onClick={() =>
                                        thumbnailInputRef.current?.click()
                                    }
                                    className="flex items-center gap-2 px-6 py-3 border-2 border-[#d4cbbf] rounded-md hover:border-[#3d3226] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isUploading ? (
                                        <LoaderCircle
                                            size={20}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Upload size={20} />
                                    )}
                                    {thumbnailImgUrl
                                        ? '사진 변경'
                                        : '사진 업로드'}
                                </button>

                                <input
                                    ref={thumbnailInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="hidden"
                                />

                                {isUploading && (
                                    <span className="text-xs text-[#6b5d4f]">
                                        업로드 중... {uploadProgress}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Ingredients Image */}
                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226]">
                                재료 전체 사진
                            </label>
                            <div className="flex gap-4 items-center">
                                {ingredientImgUrl && (
                                    <img
                                        src={ingredientImgUrl}
                                        alt="재료"
                                        className="w-32 h-32 object-cover rounded-md"
                                    />
                                )}

                                <button
                                    disabled={isSubmitDisabled}
                                    onClick={() =>
                                        ingredientInputRef.current?.click()
                                    }
                                    className="flex items-center gap-2 px-6 py-3 border-2 border-[#d4cbbf] rounded-md hover:border-[#3d3226] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isUploading ? (
                                        <LoaderCircle
                                            size={20}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Upload size={20} />
                                    )}
                                    {ingredientImgUrl
                                        ? '사진 변경'
                                        : '사진 업로드'}
                                </button>

                                <input
                                    ref={ingredientInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleIngredientImageChange}
                                    className="hidden"
                                />

                                {isUploading && (
                                    <span className="text-xs text-[#6b5d4f]">
                                        업로드 중... {uploadProgress}%
                                    </span>
                                )}
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
                                            ref={(el) =>
                                                (inputRefs.current[index] = el)
                                            }
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

                        {/* Intro */}
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
                        <RecipeHashtag
                            hashtags={hashtags}
                            setHashtags={setHashtags}
                        />

                        {/* Submit Button */}
                        <button
                            disabled={isSubmitDisabled}
                            onClick={handleSubmit}
                            className="w-full py-4 bg-[#3d3226] text-[#f5f1eb] rounded-md hover:bg-[#5d4a36] transition-colors font-medium text-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isAdding ? (
                                <>
                                    <LoaderCircle
                                        size={20}
                                        className="animate-spin"
                                    />
                                    등록 중...
                                </>
                            ) : (
                                '레시피 등록하기'
                            )}
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
