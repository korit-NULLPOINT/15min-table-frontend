import { useState } from 'react';
import { Sparkles, Plus, X, LoaderCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useGenerateHashtags } from '../../apis/generated/ai-controller/ai-controller';

export function RecipeHashtag({
    hashtags,
    setHashtags,
    title,
    intro,
    ingredients,
    steps,
}) {
    const [newHashtag, setNewHashtag] = useState('');
    const [warning, setWarning] = useState('');

    // AI 해시태그 생성 훅
    const { mutateAsync: generateHashtagsMutate, isPending: isGenerating } =
        useGenerateHashtags();

    const generateAIHashtags = async () => {
        if (hashtags.length >= 4) {
            setWarning('해시태그는 4개까지 가능합니다.');
            return;
        }

        // 입력 데이터 유효성 검사 (필수는 아니지만, 너무 없으면 AI가 생성을 못할 수 있음)
        if (
            !title &&
            !intro &&
            (!ingredients || ingredients.length === 0) &&
            !steps
        ) {
            toast.warning(
                '레시피 정보를 입력해야 AI 해시태그를 생성할 수 있습니다.',
            );
            return;
        }

        try {
            const ingredientsStr = Array.isArray(ingredients)
                ? ingredients.join(', ')
                : String(ingredients);

            const result = await generateHashtagsMutate({
                data: {
                    title,
                    intro,
                    ingredients: ingredientsStr,
                    steps,
                    limit: 4, // 최대 4개 요청
                },
            });

            const aiHashtags = (result?.data?.data?.hashtags || []).map(
                (tag) => (tag.startsWith('#') ? tag.slice(1) : tag),
            );

            // 기존 태그 제외하고 추가 가능한 개수만큼만 가져오기
            const availableSlots = 4 - hashtags.length;
            const newTags = aiHashtags
                .filter((tag) => !hashtags.includes(tag))
                .slice(0, availableSlots);

            if (newTags.length === 0) {
                toast.info('추가할 새로운 해시태그가 없습니다.');
            } else {
                setHashtags([...hashtags, ...newTags]);
                toast.success(
                    `${newTags.length}개의 해시태그가 생성되었습니다!`,
                );
            }
            setWarning('');
        } catch (error) {
            console.error('AI 해시태그 생성 실패:', error);
            toast.error(
                'AI 해시태그 생성에 실패했습니다. 잠시 후 다시 시도해주세요.',
            );
        }
    };

    const addHashtag = () => {
        if (hashtags.length >= 4) {
            setWarning('해시태그는 4개까지 가능합니다.');
            return;
        }

        // [설명]
        // ^ : '아닌 것' (Not)을 의미합니다.
        // a-zA-Z0-9 : 영어 대소문자와 숫자
        // 가-힣ㄱ-ㅎㅏ-ㅣ : 한글 (완성형, 자음, 모음)
        // /g : 전체 다 찾기
        const cleanTag = newHashtag.replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');

        // 내용이 있고, 중복이 아닐 때만 추가
        if (cleanTag && !hashtags.includes(cleanTag)) {
            setHashtags([...hashtags, cleanTag]);
            setNewHashtag('');
            setWarning('');
        }
    };

    const removeHashtag = (tag) => {
        setHashtags(hashtags.filter((t) => t !== tag));
        setWarning('');
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-[#3d3226]">해시태그</label>
                <button
                    onClick={generateAIHashtags}
                    disabled={isGenerating || hashtags.length >= 4}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md hover:from-emerald-600 hover:to-teal-700 transition-colors text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                        <Sparkles size={16} />
                    )}
                    {isGenerating ? '생성 중...' : 'AI 해시태그 생성'}
                </button>
            </div>

            <div className="flex flex-col mb-3">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newHashtag}
                        onChange={(e) => {
                            setNewHashtag(e.target.value);
                            setWarning('');
                        }}
                        onKeyDown={(e) =>
                            e.key === 'Enter' &&
                            (e.preventDefault(), addHashtag())
                        }
                        className="flex-1 px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none"
                        placeholder="해시태그 입력 (# 없이)"
                        disabled={isGenerating}
                    />
                    <button
                        onClick={addHashtag}
                        disabled={isGenerating}
                        className="px-6 py-3 bg-[#3d3226] text-[#f5f1eb] rounded-md hover:bg-[#5d4a36] transition-colors disabled:opacity-50"
                    >
                        <Plus size={20} />
                    </button>
                </div>
                {warning && (
                    <p className="text-red-500 text-sm mt-1">{warning}</p>
                )}
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
    );
}
