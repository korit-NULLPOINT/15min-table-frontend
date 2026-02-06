import { useMemo, useState } from 'react';
import { Sparkles, Plus, X } from 'lucide-react';
import { useGenerateHashtags } from '../../apis/generated/ai-controller/ai-controller';

const MAX_HASHTAGS = 4;

const normalizeTag = (raw) => {
    if (!raw) return '';
    return String(raw)
        .replace(/^#+/, '') // 앞의 # 제거
        .replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]/g, '') // 기존 수동 입력과 동일 규칙
        .trim();
};

export function RecipeHashtag({
    hashtags,
    setHashtags,
    title = '',
    intro = '',
    ingredients = [],
    steps = '',
}) {
    const [newHashtag, setNewHashtag] = useState('');
    const [warning, setWarning] = useState('');

    const { mutateAsync: generateHashtagsMutate, isPending } =
        useGenerateHashtags();

    // ingredients(배열) → 자연어 텍스트로 변환해서 AI 요청에 사용
    const ingredientsText = useMemo(() => {
        if (Array.isArray(ingredients)) {
            return ingredients
                .map((v) => (v ?? '').trim())
                .filter(Boolean)
                .join(', ');
        }
        return ingredients ?? '';
    }, [ingredients]);

    const generateAIHashtags = async () => {
        if (hashtags.length >= MAX_HASHTAGS) {
            setWarning('해시태그는 4개까지 가능합니다.');
            return;
        }

        // 백에서도 title/steps 필수 검사하지만 프론트에서 먼저 방지
        if (!title?.trim() || !steps?.trim()) {
            setWarning(
                'AI 해시태그 생성을 위해 제목과 조리 방법을 입력해주세요.',
            );
            return;
        }

        try {
            const req = {
                title,
                intro,
                ingredients: ingredientsText,
                steps,
                limit: MAX_HASHTAGS,
            };

            const res = await generateHashtagsMutate({ data: req });

            // orval 응답 구조: res.data(ApiRespDto<AiHashtagRespDto>) -> data.hashtags
            const aiHashtags = res?.data?.data?.hashtags ?? [];

            // 기존 태그 제외 + 남은 슬롯만큼만 추가
            const availableSlots = MAX_HASHTAGS - hashtags.length;

            const newTags = aiHashtags
                .map(normalizeTag)
                .filter(Boolean)
                .filter((tag) => !hashtags.includes(tag))
                .slice(0, availableSlots);

            if (newTags.length === 0) {
                setWarning(
                    '추천 해시태그가 없어요. 내용을 조금 더 구체적으로 작성해보세요.',
                );
                return;
            }

            setHashtags([...hashtags, ...newTags]);
            setWarning('');
        } catch (e) {
            setWarning(
                'AI 해시태그 생성에 실패했습니다. 잠시 후 다시 시도해주세요.',
            );
        }
    };

    const addHashtag = () => {
        if (hashtags.length >= MAX_HASHTAGS) {
            setWarning('해시태그는 4개까지 가능합니다.');
            return;
        }

        const cleanTag = newHashtag.replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');

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
                    disabled={isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md hover:from-emerald-600 hover:to-teal-700 transition-colors text-sm shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <Sparkles size={16} />
                    {isPending ? '생성 중...' : 'AI 해시태그 생성'}
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
                    />
                    <button
                        onClick={addHashtag}
                        className="px-6 py-3 bg-[#3d3226] text-[#f5f1eb] rounded-md hover:bg-[#5d4a36] transition-colors"
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
