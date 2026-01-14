import { ArrowLeft, Clock, User as UserIcon, Star, Share2 } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function RecipeDetail({ recipe, onNavigate, isLoggedIn, onOpenAuth }) {
    const [isFavorited, setIsFavorited] = useState(false);

    const handleFavoriteClick = () => {
        if (!isLoggedIn) {
            onOpenAuth?.();
            return;
        }
        setIsFavorited(!isFavorited);
        // TODO: Save to localStorage or backend
    };

    const mockHashtags = recipe.hashtags || ['15분요리', '간단레시피', '자취생필수', '초간단'];

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Back Button */}
                <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center gap-2 mb-6 text-[#3d3226] hover:text-[#5d4a36] transition-colors"
                >
                    <ArrowLeft size={20} />
                    목록으로 돌아가기
                </button>

                {/* Recipe Header */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] overflow-hidden mb-8">
                    <div className="relative aspect-video overflow-hidden">
                        <ImageWithFallback
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-8">
                        <h1 className="text-4xl mb-4 text-[#3d3226]">{recipe.title}</h1>

                        {/* Meta Info */}
                        <div className="flex items-center gap-6 mb-6 text-[#6b5d4f]">
                            <div className="flex items-center gap-2">
                                <UserIcon size={18} />
                                <span>{recipe.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={18} />
                                <span>{recipe.cookTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star size={18} fill="#f59e0b" className="text-[#f59e0b]" />
                                <span className="font-bold text-[#3d3226]">{recipe.rating}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>조회수 {recipe.views}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={handleFavoriteClick}
                                className={`flex items-center gap-2 px-6 py-3 rounded-md border-2 transition-colors ${isFavorited
                                    ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                                    : 'border-[#d4cbbf] text-[#3d3226] hover:border-[#3d3226]'
                                    }`}
                            >
                                <Star size={20} fill={isFavorited ? 'currentColor' : 'none'} />
                                찜하기
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 rounded-md border-2 border-[#d4cbbf] text-[#3d3226] hover:border-[#3d3226] transition-colors">
                                <Share2 size={20} />
                                공유하기
                            </button>
                        </div>

                        {/* Description */}
                        <p className="text-lg text-[#6b5d4f] leading-relaxed">
                            {recipe.description}
                        </p>
                    </div>
                </div>

                {/* Ingredients */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] p-8 mb-8">
                    <h2 className="text-2xl mb-6 text-[#3d3226]">재료</h2>
                    <ul className="space-y-3">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="flex items-start gap-3 text-[#6b5d4f]">
                                <span className="w-2 h-2 bg-[#3d3226] rounded-full mt-2 flex-shrink-0" />
                                <span className="text-lg">{ingredient}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Cooking Steps */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] p-8 mb-8">
                    <h2 className="text-2xl mb-6 text-[#3d3226]">조리 방법</h2>
                    <div className="space-y-6">
                        {recipe.steps.map((step, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-[#3d3226] text-[#f5f1eb] rounded-full flex items-center justify-center font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex-1 pt-1">
                                    <p className="text-lg text-[#6b5d4f] leading-relaxed">{step}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hashtags */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] p-8">
                    <h2 className="text-2xl mb-4 text-[#3d3226]">해시태그</h2>
                    <div className="flex flex-wrap gap-3">
                        {mockHashtags.map((tag) => (
                            <button
                                key={tag}
                                className="px-4 py-2 bg-[#ebe5db] text-[#3d3226] rounded-full border-2 border-[#d4cbbf] hover:border-[#3d3226] transition-colors"
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
