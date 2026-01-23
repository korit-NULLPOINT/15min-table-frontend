import { useState } from 'react';
import { Sparkles, Plus, X } from 'lucide-react';
// import { useGenerateAIHashtags } from '../../apis/generated/ai-controller/ai-controller';

export function RecipeHashtag({ hashtags, setHashtags }) {
    const [newHashtag, setNewHashtag] = useState('');
    const [warning, setWarning] = useState('');
    // const { mutateAsync: generateAIHashtagsMutate } = useGenerateAIHashtags();

    const generateAIHashtags = () => {
        if (hashtags.length >= 4) {
            setWarning('해시태그는 4개까지 가능합니다.');
            return;
        }

        // Mock AI hashtag generation
        const aiHashtags = /* useGenerateAIHashtags()?.data?.data?.data || */ [
            '15분요리',
            '간단레시피',
            '자취생필수',
            '초간단',
        ];

        // 기존 태그 제외하고 추가 가능한 개수만큼만 가져오기
        const availableSlots = 4 - hashtags.length;
        const newTags = aiHashtags
            .filter((tag) => !hashtags.includes(tag))
            .slice(0, availableSlots);

        setHashtags([...hashtags, ...newTags]);
        setWarning('');
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

    // console.log(hashtags);

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-[#3d3226]">해시태그</label>
                <button
                    onClick={generateAIHashtags}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md hover:from-emerald-600 hover:to-teal-700 transition-colors text-sm shadow-md"
                >
                    <Sparkles size={16} />
                    AI 해시태그 생성
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
