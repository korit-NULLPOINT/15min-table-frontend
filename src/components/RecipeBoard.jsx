import { useState } from "react";
import { ArrowLeft, Search, Filter, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function RecipeBoard({ onNavigate, onRecipeClick }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMainCategory, setSelectedMainCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    const mainCategories = [
        "고기류",
        "해산물",
        "계란",
        "밥 / 면",
        "김치 / 발효식품",
        "두부 / 콩류",
        "가공식품",
        "냉동식품",
        "채소",
        "간편식 / 즉석식품",
        "기타",
    ];
    const subCategories = [
        "5분 요리",
        "전자레인지",
        "재료 3개 이하",
        "불 없이 요리",
        "혼밥 / 한 그릇",
        "기타",
    ];

    // Mock recipe data
    const recipes = [
        {
            id: 1,
            title: "초간단 김치볶음밥",
            author: "요리초보",
            rating: 4.8,
            views: "15.2K",
            image: "https://images.unsplash.com/photo-1626803774007-f92c2c32cbe7?w=400",
            mainCategory: "밥 / 면",
            subCategory: "5분 요리",
        },
        {
            id: 2,
            title: "크림 파스타 레시피",
            author: "파스타마스터",
            rating: 4.7,
            views: "12.8K",
            image: "https://images.unsplash.com/photo-1587740907856-997a958a68ac?w=400",
            mainCategory: "밥 / 면",
            subCategory: "혼밥 / 한 그릇",
        },
        {
            id: 3,
            title: "5분만에 완성 덮밥",
            author: "자취왕",
            rating: 4.9,
            views: "10.5K",
            image: "https://images.unsplash.com/photo-1763844668895-6931b4e09458?w=400",
            mainCategory: "밥 / 면",
            subCategory: "5분 요리",
        },
        {
            id: 4,
            title: "건강한 샐러드 볼",
            author: "건강요리",
            rating: 4.6,
            views: "9.2K",
            image: "https://images.unsplash.com/photo-1515516969-d4008cc6241a?w=400",
            mainCategory: "채소",
            subCategory: "불 없이 요리",
        },
        {
            id: 5,
            title: "아침 토스트 모음",
            author: "브런치러버",
            rating: 4.5,
            views: "8.7K",
            image: "https://images.unsplash.com/photo-1689020353604-8041221e1273?w=400",
            mainCategory: "가공식품",
            subCategory: "5분 요리",
        },
        {
            id: 6,
            title: "한그릇 비빔밥",
            author: "집밥요정",
            rating: 4.7,
            views: "7.9K",
            image: "https://images.unsplash.com/photo-1628521061262-19b5cdb7eee5?w=400",
            mainCategory: "밥 / 면",
            subCategory: "혼밥 / 한 그릇",
        },
        {
            id: 7,
            title: "라면 업그레이드",
            author: "라면장인",
            rating: 4.8,
            views: "13.5K",
            image: "https://images.unsplash.com/photo-1627900440398-5db32dba8db1?w=400",
            mainCategory: "밥 / 면",
            subCategory: "전자레인지",
        },
        {
            id: 8,
            title: "뚝배기 된장찌개",
            author: "집밥요리사",
            rating: 5.0,
            views: "11.2K",
            image: "https://images.unsplash.com/photo-1560684352-8497838a2229?w=400",
            mainCategory: "두부 / 콩류",
            subCategory: "혼밥 / 한 그릇",
        },
    ];

    const filteredRecipes = recipes.filter((recipe) => {
        const matchesSearch = recipe.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesMainCategory =
            selectedMainCategory === "" ||
            recipe.mainCategory === selectedMainCategory;
        const matchesSubCategory =
            selectedSubCategory === "" ||
            recipe.subCategory === selectedSubCategory;
        return matchesSearch && matchesMainCategory && matchesSubCategory;
    });

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <button
                    onClick={() => onNavigate("home")}
                    className="flex items-center gap-2 mb-6 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md">
                    <ArrowLeft size={20} />
                    메인으로 돌아가기
                </button>

                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#3d3226] text-[#f5f1eb] px-8 py-6">
                        <h1 className="text-3xl mb-2">레시피 게시판</h1>
                        <p className="text-[#e5dfd5]">
                            다양한 레시피를 검색하고 찾아보세요
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="p-6 border-b-2 border-[#e5dfd5] bg-[#ebe5db]">
                        <div className="relative">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b5d4f]"
                                size={20}
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="레시피 검색..."
                                className="w-full pl-12 pr-4 py-4 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none bg-white text-[#3d3226]"
                            />
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="p-6 border-b-2 border-[#e5dfd5]">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Filter size={18} className="text-[#3d3226]" />
                                <h3 className="text-sm uppercase tracking-wider text-[#6b5d4f]">
                                    메인 카테고리
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {mainCategories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => {
                                            // 같은 카테고리를 다시 클릭하면 선택 취소
                                            if (
                                                selectedMainCategory ===
                                                category
                                            ) {
                                                setSelectedMainCategory("");
                                            } else {
                                                setSelectedMainCategory(
                                                    category
                                                );
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-md border-2 transition-colors ${
                                            selectedMainCategory === category
                                                ? "bg-[#3d3226] text-[#f5f1eb] border-[#3d3226]"
                                                : "bg-white text-[#3d3226] border-[#d4cbbf] hover:border-[#3d3226]"
                                        }`}>
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Filter size={18} className="text-[#3d3226]" />
                                <h3 className="text-sm uppercase tracking-wider text-[#6b5d4f]">
                                    부 카테고리
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {subCategories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => {
                                            // 같은 카테고리를 다시 클릭하면 선택 취소
                                            if (
                                                selectedSubCategory === category
                                            ) {
                                                setSelectedSubCategory("");
                                            } else {
                                                setSelectedSubCategory(
                                                    category
                                                );
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-md border-2 transition-colors ${
                                            selectedSubCategory === category
                                                ? "bg-[#3d3226] text-[#f5f1eb] border-[#3d3226]"
                                                : "bg-white text-[#3d3226] border-[#d4cbbf] hover:border-[#3d3226]"
                                        }`}>
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recipe List */}
                    <div className="p-6">
                        <div className="mb-4 text-[#6b5d4f]">
                            총{" "}
                            <span className="text-[#3d3226] font-bold">
                                {filteredRecipes.length}
                            </span>
                            개의 레시피
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRecipes.map((recipe) => (
                                <div
                                    key={recipe.id}
                                    onClick={() =>
                                        onRecipeClick &&
                                        onRecipeClick(recipe.id)
                                    }
                                    className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 border-[#e5dfd5] hover:border-[#3d3226]">
                                    <div className="relative aspect-video overflow-hidden">
                                        <ImageWithFallback
                                            src={recipe.image}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-lg text-[#3d3226] mb-2">
                                            {recipe.title}
                                        </h3>
                                        <div className="flex items-center justify-between text-sm text-[#6b5d4f]">
                                            <span>by {recipe.author}</span>
                                            <span className="flex items-center gap-1">
                                                <Star
                                                    size={14}
                                                    fill="#f59e0b"
                                                    className="text-[#f59e0b]"
                                                />
                                                {recipe.rating}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-[#6b5d4f]">
                                            <span>👁 {recipe.views}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredRecipes.length === 0 && (
                            <div className="text-center py-12 text-[#6b5d4f]">
                                검색 결과가 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
