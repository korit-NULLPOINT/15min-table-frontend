import {
    ArrowLeft,
    User as UserIcon,
    Star,
    Share2,
    Trash2,
    Bookmark,
    MapPin,
    Sparkles,
    X,
    Search,
    Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import IngredientMap from "../components/map/IngredientMap";

export function RecipeDetail({
    recipe,
    onNavigate,
    isLoggedIn,
    onOpenAuth,
    currentUsername,
    onAuthorClick,
}) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(24); // 총 평가 수
    const [ratingSum, setRatingSum] = useState(recipe.rating * 24); // 총 별점 합계
    const [showStoreMap, setShowStoreMap] = useState(false);
    const [showZipcodeModal, setShowZipcodeModal] = useState(false);
    const [userZipcode, setUserZipcode] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);
    const [showEmailWarning, setShowEmailWarning] = useState(false);
    const ITEMS_PER_PAGE = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const [autoSelected, setAutoSelected] = useState(false);
    const ingredientsText = (recipe?.ingredients || []).join(" ");
    const [originLocation, setOriginLocation] = useState(null);
    // { name, lat, lng }

    const preferredLabels = (() => {
        const labels = new Set();

        if (ingredientsText.match(/고기|삼겹|돼지|소고기|닭|정육|베이컨/)) {
            labels.add("시장");
            labels.add("슈퍼마켓");
        }

        if (
            ingredientsText.match(
                /양파|마늘|파|대파|감자|당근|버섯|배추|상추|오이|토마토|계란/,
            )
        ) {
            labels.add("시장");
            labels.add("슈퍼마켓");
        }

        if (
            ingredientsText.match(
                /라면|컵라면|즉석|햇반|소시지|어묵|김밥|스낵|과자/,
            )
        ) {
            labels.add("편의점");
        }

        return Array.from(labels);
    })();

    const [comments, setComments] = useState([
        {
            id: 1,
            author: "요리왕김치",
            authorImage: "",
            content: "정말 맛있어 보이네요! 저도 만들어봐야겠어요 👍",
            createdAt: "5분 전",
            isMine: false,
        },
        {
            id: 2,
            author: "자취생24",
            authorImage: "",
            content:
                "간단하고 좋아요. 재료도 집에 다 있어서 바로 만들 수 있겠네요!",
            createdAt: "1시간 전",
            isMine: false,
        },
    ]);
    const [newComment, setNewComment] = useState("");

    const handleFavoriteClick = () => {
        if (!isLoggedIn) {
            if (onOpenAuth) onOpenAuth();
            return;
        }
        setIsFavorited(!isFavorited);
        // TODO: Save to localStorage or backend
    };
    useEffect(() => {
        if (autoSelected) return;
        if (!nearbyPlaces || nearbyPlaces.length === 0) return;

        const valid = nearbyPlaces.filter(
            (p) => typeof p.distance === "number",
        );
        if (valid.length === 0) return;

        const preferred = preferredLabels.length
            ? valid.filter((p) => preferredLabels.includes(p.label))
            : [];

        const pool = preferred.length ? preferred : valid;

        const best = pool.reduce((a, b) => (a.distance < b.distance ? a : b));

        setSelectedPlaceId(best.id);
        setAutoSelected(true);
    }, [nearbyPlaces, autoSelected, preferredLabels]);

    // ✅ 실제로 화면에 보여줄 장소 목록 (핵심)
    const visiblePlaces = nearbyPlaces
        .filter((p) => p.fitScore > 0)
        .sort((a, b) => {
            const aPref = preferredLabels.includes(a.label) ? 1 : 0;
            const bPref = preferredLabels.includes(b.label) ? 1 : 0;

            // 1️⃣ 레시피 적합 우선
            if (aPref !== bPref) return bPref - aPref;

            // 2️⃣ fitScore
            if (b.fitScore !== a.fitScore) return b.fitScore - a.fitScore;

            // 3️⃣ 거리
            if (a.distance != null && b.distance != null)
                return a.distance - b.distance;

            return 0;
        });

    const pagedPlaces = visiblePlaces.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    // 페이지 수 계산도 visiblePlaces 기준으로
    const totalPages = Math.ceil(visiblePlaces.length / ITEMS_PER_PAGE);
    // ADD: 페이지 클릭 시 리스트 상단으로 스크롤
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRatingClick = (rating) => {
        if (!isLoggedIn) {
            if (onOpenAuth) onOpenAuth();
            return;
        }

        // 같은 별점을 다시 클릭하면 별점 제거 (0으로 리셋)
        if (userRating === rating) {
            setRatingSum((prev) => prev - userRating);
            setTotalRatings((prev) => prev - 1);
            setUserRating(0);
            return;
        }

        // 이전 별점이 있으면 제거하고 새로운 별점 추가
        if (userRating > 0) {
            setRatingSum((prev) => prev - userRating + rating);
        } else {
            setRatingSum((prev) => prev + rating);
            setTotalRatings((prev) => prev + 1);
        }

        setUserRating(rating);
        // TODO: Save to localStorage or backend
    };

    const averageRating =
        totalRatings > 0 ? (ratingSum / totalRatings).toFixed(1) : "0.0";

    const mockHashtags = recipe.hashtags || [
        "15분요리",
        "간단레시피",
        "자취생필수",
        "초간단",
    ];

    const handleCommentSubmit = () => {
        if (!isLoggedIn) {
            if (onOpenAuth) onOpenAuth();
            return;
        }

        // Check email verification
        const userProfile = localStorage.getItem("userProfile");
        if (userProfile) {
            const profile = JSON.parse(userProfile);
            if (!profile.emailVerified) {
                setShowEmailWarning(true);
                return;
            }
        } else {
            setShowEmailWarning(true);
            return;
        }

        if (newComment.trim() === "") return;

        const newCommentObj = {
            id: comments.length + 1,
            author: currentUsername || "익명",
            authorImage: "",
            content: newComment,
            createdAt: "방금 전",
            isMine: true,
        };
        setComments([...comments, newCommentObj]);
        setNewComment("");
    };

    const handleGoToProfile = () => {
        setShowEmailWarning(false);
        onNavigate("profile");
    };

    const handleCommentDelete = (commentId) => {
        setComments(comments.filter((comment) => comment.id !== commentId));
    };

    const handleAIStoreMap = () => {
        // 주소가 없으면 모달을 띄움
        if (!userAddress) {
            setShowZipcodeModal(true);
        } else {
            setShowStoreMap(!showStoreMap);
        }
    };

    const handleZipcodeModalClose = () => {
        setShowZipcodeModal(false);
    };

    const loadDaumPostcodeAndOpen = (onComplete) => {
        // 이미 로드돼 있으면 바로 실행
        if (window.daum && window.daum.Postcode) {
            new window.daum.Postcode({ oncomplete: onComplete }).open();
            return;
        }

        // 아직 없으면 동적 로딩
        const script = document.createElement("script");
        script.src =
            "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;

        script.onload = () => {
            new window.daum.Postcode({ oncomplete: onComplete }).open();
        };

        script.onerror = () => {
            alert("주소 검색 스크립트를 불러오지 못했습니다.");
        };

        document.body.appendChild(script);
    };

    const handleDaumPostcode = () => {
        loadDaumPostcodeAndOpen((data) => {
            const fullAddress =
                data.address || data.roadAddress || data.jibunAddress;

            if (!fullAddress) {
                alert("주소를 다시 선택해주세요.");
                return;
            }

            setUserZipcode(data.zonecode || "");
            setUserAddress(fullAddress);

            setShowZipcodeModal(false);
            setShowStoreMap(true);
        });
    };

    const handleZipcodeSubmit = () => {
        if (!userZipcode) {
            alert("우편번호를 입력해주세요.");
            return;
        }
        setUserAddress(`우편번호 ${userZipcode} 지역`);
        setShowZipcodeModal(false);
        setShowStoreMap(true);
    };
    
    const getDistanceMeta = (distance) => {
        if (distance == null) {
            return { label: "거리 정보 없음", tone: "gray", move: "" };
        }

        if (distance <= 300) {
            return { label: "아주 가까움", tone: "emerald", move: "도보 추천" };
        }
        if (distance <= 800) {
            return { label: "가까움", tone: "green", move: "도보 / 자전거" };
        }
        if (distance <= 2000) {
            return {
                label: "조금 멀어요",
                tone: "amber",
                move: "자전거 / 대중교통",
            };
        }
        if (distance <= 5000) {
            return { label: "멀어요", tone: "orange", move: "차량 추천" };
        }
        return { label: "많이 멀어요", tone: "red", move: "차량 필수" };
    };

    // Load Daum Postcode API

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Back Button */}
                <button
                    onClick={() => onNavigate("home")}
                    className="flex items-center gap-2 mb-6 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md">
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
                        <h1 className="text-4xl mb-4 text-[#3d3226]">
                            {recipe.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex items-center gap-6 mb-6 text-[#6b5d4f]">
                            <div className="flex items-center gap-2">
                                <UserIcon size={18} />
                                <span
                                    className="cursor-pointer hover:underline"
                                    onClick={() =>
                                        onAuthorClick &&
                                        onAuthorClick(recipe.author)
                                    }>
                                    {recipe.author}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star
                                    size={18}
                                    fill="#f59e0b"
                                    className="text-[#f59e0b]"
                                />
                                <span className="font-bold text-[#3d3226]">
                                    {averageRating}
                                </span>

                                <span className="text-sm text-[#6b5d4f]">
                                    ({totalRatings}명)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>조회수 {recipe.views}</span>
                            </div>
                        </div>

                        {/* Rating Section */}
                        <div className="mb-6 p-4 bg-[#ebe5db] rounded-lg border-2 border-[#d4cbbf]">
                            <p className="text-sm text-[#3d3226] mb-2">
                                이 레시피를 평가해주세요
                            </p>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => handleRatingClick(star)}
                                        className="transition-transform hover:scale-110">
                                        <Star
                                            size={32}
                                            fill={
                                                star <= userRating
                                                    ? "#f59e0b"
                                                    : "none"
                                            }
                                            className={
                                                star <= userRating
                                                    ? "text-[#f59e0b]"
                                                    : "text-[#d4cbbf]"
                                            }
                                        />
                                    </button>
                                ))}
                                {userRating > 0 && (
                                    <span className="ml-2 text-[#3d3226]">
                                        내 평점: {userRating}점
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={handleFavoriteClick}
                                className={`flex items-center gap-2 px-6 py-3 rounded-md border-2 transition-colors ${
                                    isFavorited
                                        ? "bg-blue-100 border-blue-500 text-blue-700"
                                        : "border-[#d4cbbf] text-[#3d3226] hover:border-[#3d3226]"
                                }`}>
                                <Bookmark
                                    size={20}
                                    fill={isFavorited ? "currentColor" : "none"}
                                />
                                저장하기
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
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl text-[#3d3226]">재료</h2>
                        <button
                            onClick={handleAIStoreMap}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md hover:from-emerald-600 hover:to-teal-700 transition-colors text-sm shadow-md">
                            <Sparkles size={16} />내 근처 재료 찾기
                        </button>
                    </div>

                    <ul className="space-y-3 mb-6">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-3 text-[#6b5d4f]">
                                <span className="w-2 h-2 bg-[#3d3226] rounded-full mt-2 flex-shrink-0" />
                                <span className="text-lg">{ingredient}</span>
                            </li>
                        ))}
                    </ul>
                    {showStoreMap && userAddress && (
                        <div className="mt-6 pt-6 border-t-2 border-[#d4cbbf]">
                            <div className="mb-3 p-4 bg-[#ebe5db] rounded-lg border-2 border-[#d4cbbf]">
                                <p className="text-xs text-[#6b5d4f] mb-1">
                                    선택한 주소
                                </p>
                                <p className="text-[#3d3226] font-medium">
                                    {userAddress}
                                </p>
                            </div>
                            {/* ADD: 주소 다시 선택 / 재검색 버튼 */}
                            <div className="flex items-center justify-end gap-2 mb-3">
                                <button
                                    onClick={() => setShowZipcodeModal(true)}
                                    className="px-3 py-2 text-sm bg-white border-2 border-[#d4cbbf] rounded-md text-[#3d3226] hover:border-[#3d3226] transition-colors">
                                    주소 다시 선택
                                </button>

                                <button
                                    onClick={() => {
                                        // ✅ 현재 주소로 '강제 재검색' 트리거
                                        setSelectedPlaceId(null);
                                        setCurrentPage(1);

                                        // IngredientMap이 address 변경 시 initMap을 다시 돌기 때문에
                                        // address가 동일할 땐 리렌더 트릭을 써야 함:
                                        setUserAddress((prev) => prev + " "); // 공백 추가
                                        setTimeout(() => {
                                            setUserAddress((prev) =>
                                                prev.trim(),
                                            ); // 다시 원복
                                        }, 0);
                                    }}
                                    className="px-3 py-2 text-sm bg-[#3d3226] text-[#f5f1eb] border-2 border-[#3d3226] rounded-md hover:bg-[#5c4c40] transition-colors">
                                    이 주소로 재검색
                                </button>
                            </div>

                            <div className="bg-[#ebe5db] p-3 rounded-xl border-2 border-[#d4cbbf]">
                                <IngredientMap
                                    address={userAddress}
                                    onPlacesChange={setNearbyPlaces}
                                    selectedPlaceId={selectedPlaceId}
                                    onOriginChange={setOriginLocation}
                                />
                            </div>

                            {/* 추천 장소 리스트 */}
                            {nearbyPlaces.length > 0 && (
                                <>
                                    {/* 리스트 */}
                                    <div
                                        id="nearby-place-list"
                                        className="mt-4 space-y-2">
                                        {pagedPlaces.map((p) => {
                                            const isSelected =
                                                selectedPlaceId === p.id;

                                            return (
                                                <div
                                                    key={p.id}
                                                    onClick={() => {
                                                        setAutoSelected(true); //자동 추천 종료
                                                        setSelectedPlaceId(
                                                            p.id,
                                                        ); //쉼표 제거
                                                    }}
                                                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                                                        isSelected
                                                            ? "bg-[#f3efe9] border-[#3d3226]"
                                                            : "bg-white border-[#d4cbbf] hover:border-[#3d3226]"
                                                    }`}>
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-bold text-[#3d3226]">
                                                                    {p.name}
                                                                </span>
                                                                {p.fitScore >=
                                                                    3 && (
                                                                    <span className="ml-2 text-xs px-2 py-1 rounded-full bg-emerald-500 text-white">
                                                                        강력
                                                                        추천
                                                                    </span>
                                                                )}

                                                                {p.fitScore ===
                                                                    2 && (
                                                                    <span className="ml-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                                                                        추천
                                                                    </span>
                                                                )}

                                                                {p.fitScore ===
                                                                    1 && (
                                                                    <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                                                        가능
                                                                    </span>
                                                                )}

                                                                {/* 사용자가 직접 클릭한 경우 */}
                                                                {p.id ===
                                                                    selectedPlaceId &&
                                                                    !autoSelected && (
                                                                        <span className="ml-2 text-xs px-2 py-1 rounded-full bg-[#3d3226] text-white">
                                                                            선택한
                                                                            장소
                                                                        </span>
                                                                    )}

                                                                <span className="px-2 py-1 text-xs rounded-full border border-[#d4cbbf] bg-[#ebe5db] text-[#3d3226]">
                                                                    {p.label}
                                                                </span>

                                                                {preferredLabels.includes(
                                                                    p.label,
                                                                ) && (
                                                                    <span className="ml-2 text-xs px-2 py-1 rounded-full border border-emerald-500 text-emerald-600 bg-emerald-50">
                                                                        이
                                                                        레시피에
                                                                        적합
                                                                    </span>
                                                                )}

                                                                {/* 길찾기 버튼 */}
                                                                <button
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.stopPropagation();

                                                                        if (
                                                                            !userAddress
                                                                        ) {
                                                                            alert(
                                                                                "출발지 주소를 먼저 선택해주세요.",
                                                                            );
                                                                            return;
                                                                        }

                                                                        if (
                                                                            !originLocation
                                                                        ) {
                                                                            alert(
                                                                                "출발지 위치 정보를 불러오지 못했습니다.",
                                                                            );
                                                                            return;
                                                                        }

                                                                        const url = `https://map.kakao.com/link/from/${encodeURIComponent(
                                                                            originLocation.name,
                                                                        )},${originLocation.lat},${originLocation.lng}/to/${encodeURIComponent(
                                                                            p.name,
                                                                        )},${p.y},${p.x}`;

                                                                        window.open(
                                                                            url,
                                                                            "_blank",
                                                                        );
                                                                    }}
                                                                    className="ml-auto text-xs px-3 py-1 border border-[#d4cbbf] rounded-md hover:border-[#3d3226] transition-colors">
                                                                    길찾기
                                                                </button>
                                                            </div>

                                                            <div className="text-sm text-[#6b5d4f]">
                                                                {p.address ||
                                                                    "주소 정보 없음"}
                                                            </div>

                                                            {p.distance &&
                                                                (() => {
                                                                    const meta =
                                                                        getDistanceMeta(
                                                                            p.distance,
                                                                        );

                                                                    return (
                                                                        <div className="mt-1 flex items-center gap-2 text-xs">
                                                                            <span
                                                                                className={`px-2 py-0.5 rounded-full bg-${meta.tone}-100 text-${meta.tone}-700`}>
                                                                                {
                                                                                    meta.label
                                                                                }
                                                                            </span>

                                                                            <span className="text-[#8b7c6a]">
                                                                                {
                                                                                    meta.move
                                                                                }{" "}
                                                                                ·{" "}
                                                                                {
                                                                                    p.distance
                                                                                }

                                                                                m
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })()}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* 페이지네이션 */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center gap-2 mt-4">
                                            {Array.from({
                                                length: totalPages,
                                            }).map((_, idx) => {
                                                const page = idx + 1;
                                                const isActive =
                                                    page === currentPage;

                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() =>
                                                            handlePageChange(
                                                                page,
                                                            )
                                                        }
                                                        className={`w-8 h-8 rounded-md border text-sm transition-colors ${
                                                            isActive
                                                                ? "bg-[#3d3226] text-[#f5f1eb] border-[#3d3226]"
                                                                : "bg-white text-[#3d3226] border-[#d4cbbf] hover:border-[#3d3226]"
                                                        }`}>
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
                {/* Cooking Steps */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] p-8">
                    <h2 className="text-2xl mb-6 text-[#3d3226]">조리 방법</h2>
                    <div className="space-y-6">
                        {recipe.steps.map((step, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-[#3d3226] text-[#f5f1eb] rounded-full flex items-center justify-center font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex-1 pt-1">
                                    <p className="text-lg text-[#6b5d4f] leading-relaxed">
                                        {step}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hashtags */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] p-8 mt-8">
                    <h2 className="text-2xl mb-4 text-[#3d3226]">해시태그</h2>
                    <div className="flex flex-wrap gap-3">
                        {mockHashtags.map((tag) => (
                            <button
                                key={tag}
                                className="px-4 py-2 bg-[#ebe5db] text-[#3d3226] rounded-full border-2 border-[#d4cbbf] hover:border-[#3d3226] transition-colors">
                                #{tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comments */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] p-8 mt-8">
                    <h2 className="text-2xl mb-4 text-[#3d3226]">댓글</h2>
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-[#3d3226] text-[#f5f1eb] rounded-full flex items-center justify-center font-bold">
                                    {comment.authorImage ? (
                                        <ImageWithFallback
                                            src={comment.authorImage}
                                            alt={comment.author}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        comment.author[0]
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[#3d3226]">
                                            {comment.author}
                                        </span>
                                        <span className="text-sm text-[#6b5d4f]">
                                            {comment.createdAt}
                                        </span>
                                        {comment.isMine && (
                                            <button
                                                onClick={() =>
                                                    handleCommentDelete(
                                                        comment.id,
                                                    )
                                                }
                                                className="ml-2 text-red-500">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-lg text-[#6b5d4f] leading-relaxed">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 입력하세요..."
                            className="w-full p-4 border-2 border-[#d4cbbf] rounded-lg focus:outline-none focus:border-[#3d3226]"
                        />
                        <button
                            onClick={handleCommentSubmit}
                            className="mt-4 px-6 py-3 bg-[#3d3226] text-[#f5f1eb] rounded-md hover:bg-[#5c4c40] transition-colors">
                            댓글 작성
                        </button>
                    </div>
                </div>
            </div>

            {/* Zipcode Modal */}
            {showZipcodeModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full border-2 border-[#e5dfd5]">
                        <div className="bg-[#3d3226] text-[#f5f1eb] px-6 py-4 rounded-t-lg flex items-center justify-between">
                            <h3 className="text-xl">우편번호 찾기</h3>
                            <button
                                onClick={handleZipcodeModalClose}
                                className="hover:bg-[#5d4a36] p-1 rounded transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-[#3d3226] mb-6">
                                내 근처 재료 판매 매장을 찾기 위해 주소를
                                검색해주세요.
                            </p>

                            <div className="space-y-4">
                                <button
                                    onClick={handleDaumPostcode}
                                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md hover:from-emerald-600 hover:to-teal-700 transition-colors flex items-center justify-center gap-2 shadow-md">
                                    <Search size={20} />
                                    주소 검색
                                </button>
                            </div>

                            {userAddress && (
                                <div className="mt-4 p-4 bg-[#ebe5db] rounded-lg border-2 border-[#d4cbbf]">
                                    <p className="text-sm text-[#6b5d4f] mb-1">
                                        선택된 주소:
                                    </p>
                                    <p className="text-[#3d3226] font-medium">
                                        {userAddress}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
                                        댓글 작성을 위해서는 이메일 인증이
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
                                    onClick={() => setShowEmailWarning(false)}
                                    className="flex-1 px-4 py-3 border-2 border-[#d4cbbf] text-[#3d3226] rounded-md hover:border-[#3d3226] transition-colors">
                                    취소
                                </button>
                                <button
                                    onClick={handleGoToProfile}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md hover:from-emerald-600 hover:to-teal-700 transition-colors shadow-md">
                                    이메일 인증하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
