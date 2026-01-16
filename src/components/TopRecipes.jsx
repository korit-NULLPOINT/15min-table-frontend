import { Eye, Clock, Star, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const topRecipes = [
    {
        id: 1,
        title: "초간단 김치볶음밥",
        author: "요리초보",
        views: "15.2K",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1626803774007-f92c2c32cbe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmb29kJTIwcmVjaXBlfGVufDF8fHx8MTc2Nzc2MjY5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rank: 1,
    },
    {
        id: 2,
        title: "크림 파스타 레시피",
        author: "파스타마스터",
        views: "12.8K",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1587740907856-997a958a68ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNvb2tpbmd8ZW58MXx8fHwxNzY3NjkzODg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rank: 2,
    },
    {
        id: 3,
        title: "5분만에 완성 덮밥",
        author: "자취왕",
        views: "10.5K",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1763844668895-6931b4e09458?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW1wbGUlMjBtZWFsfGVufDF8fHx8MTc2Nzc2MjY5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rank: 3,
    },
    {
        id: 4,
        title: "건강한 샐러드 볼",
        author: "건강요리",
        views: "9.2K",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1515516969-d4008cc6241a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lbWFkZSUyMGZvb2R8ZW58MXx8fHwxNzY3NzYyNjkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rank: 4,
    },
    {
        id: 5,
        title: "아침 토스트 모음",
        author: "브런치러버",
        views: "8.7K",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1689020353604-8041221e1273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjB0b2FzdHxlbnwxfHx8fDE3Njc3MDM4ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rank: 5,
    },
    {
        id: 6,
        title: "한그릇 비빔밥",
        author: "집밥요정",
        views: "7.9K",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1628521061262-19b5cdb7eee5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwYm93bHxlbnwxfHx8fDE3Njc3NDA1ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rank: 6,
    },
];

export function TopRecipes({ onRecipeClick }) {
    return (
        <section className="px-6 py-8 max-w-7xl mx-auto bg-[#ebe5db] rounded-lg my-8">
            <h3 className="text-3xl mb-6 text-[#3d3226] flex items-center gap-3">
                <div className="w-10 h-10 bg-[#3d3226] rounded-full flex items-center justify-center">
                    <TrendingUp
                        size={24}
                        className="text-[#f5f1eb]"
                        strokeWidth={2.5}
                    />
                </div>
                인기 레시피
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
                {topRecipes.map((recipe) => (
                    <div
                        key={recipe.id}
                        onClick={() =>
                            onRecipeClick && onRecipeClick(recipe.id)
                        }
                        className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 border-[#e5dfd5] hover:border-[#3d3226]">
                        <div className="relative aspect-video overflow-hidden">
                            <ImageWithFallback
                                src={recipe.image}
                                alt={recipe.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                <div className="flex items-center gap-3 text-white text-sm">
                                    <span className="flex items-center gap-1">
                                        <Eye size={16} />
                                        {recipe.views}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Star size={16} fill="currentColor" />
                                        {recipe.rating}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="text-xl mb-2 text-[#3d3226] group-hover:text-[#5d4a36] transition-colors">
                                {recipe.title}
                            </h4>
                            <p className="text-sm text-[#6b5d4f]">
                                by {recipe.author}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
