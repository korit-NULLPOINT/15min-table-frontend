import { ArrowLeft, Clock, User as UserIcon, Star, Share2, Trash2, Bookmark, MapPin, Sparkles, X, Search, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function RecipeDetail({ recipe, onNavigate, isLoggedIn, onOpenAuth, currentUserNickname, onAuthorClick }) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(24); // 총 평가 수
    const [ratingSum, setRatingSum] = useState(recipe.rating * 24); // 총 별점 합계
    const [showStoreMap, setShowStoreMap] = useState(false);
    const [showZipcodeModal, setShowZipcodeModal] = useState(false);
    const [userZipcode, setUserZipcode] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [showEmailWarning, setShowEmailWarning] = useState(false);
    const [comments, setComments] = useState([
        {
            id: 1,
            author: '요리왕김치',
            authorImage: '',
            content: '정말 맛있어 보이네요! 저도 만들어봐야겠어요 👍',
            createdAt: '5분 전',
            isMine: false,
        },
        {
            id: 2,
            author: '자취생24',
            authorImage: '',
            content: '간단하고 좋아요. 재료도 집에 다 있어서 바로 만들 수 있겠네요!',
            createdAt: '1시간 전',
            isMine: false,
        },
    ]);
    const [newComment, setNewComment] = useState('');

    const handleFavoriteClick = () => {
        if (!isLoggedIn) {
            if (onOpenAuth) onOpenAuth();
            return;
        }
        setIsFavorited(!isFavorited);
        // TODO: Save to localStorage or backend
    };

    const handleRatingClick = (rating) => {
        if (!isLoggedIn) {
            if (onOpenAuth) onOpenAuth();
            return;
        }

        // 같은 별점을 다시 클릭하면 별점 제거 (0으로 리셋)
        if (userRating === rating) {
            setRatingSum(prev => prev - userRating);
            setTotalRatings(prev => prev - 1);
            setUserRating(0);
            return;
        }

        // 이전 별점이 있으면 제거하고 새로운 별점 추가
        if (userRating > 0) {
            setRatingSum(prev => prev - userRating + rating);
        } else {
            setRatingSum(prev => prev + rating);
            setTotalRatings(prev => prev + 1);
        }

        setUserRating(rating);
        // TODO: Save to localStorage or backend
    };

    const averageRating = totalRatings > 0 ? (ratingSum / totalRatings).toFixed(1) : '0.0';

    const mockHashtags = recipe.hashtags || ['15분요리', '간단레시피', '자취생필수', '초간단'];

    const handleCommentSubmit = () => {
        if (!isLoggedIn) {
            if (onOpenAuth) onOpenAuth();
            return;
        }

        // Check email verification
        const userProfile = localStorage.getItem('userProfile');
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

        if (newComment.trim() === '') return;
        const newCommentObj = {
            id: comments.length + 1,
            author: currentUserNickname || '익명',
            authorImage: '',
            content: newComment,
            createdAt: '방금 전',
            isMine: true,
        };
        setComments([...comments, newCommentObj]);
        setNewComment('');
    };

    const handleGoToProfile = () => {
        setShowEmailWarning(false);
        onNavigate('profile');
    };

    const handleCommentDelete = (commentId) => {
        setComments(comments.filter(comment => comment.id !== commentId));
    };

    const handleAIStoreMap = () => {
        // 주소가 없으면 모달을 띄움
        if (!userAddress) {
            setShowZipcodeModal(true);
        } else {
            setShowStoreMap(!showStoreMap);
        }
    };

    const handleZipcodeModalOpen = () => {
        setShowZipcodeModal(true);
    };

    const handleZipcodeModalClose = () => {
        setShowZipcodeModal(false);
    };

    const handleDaumPostcode = () => {
        if (window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: function (data) {
                    // 선택한 주소 정보를 처리
                    const fullAddress = data.address; // 전체 주소
                    const zonecode = data.zonecode; // 우편번호

                    setUserZipcode(zonecode);
                    setUserAddress(fullAddress);
                    setShowZipcodeModal(false);
                    setShowStoreMap(true);
                }
            }).open();
        } else {
            alert('우편번호 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
        }
    };

    const handleZipcodeSubmit = () => {
        if (!userZipcode) {
            alert('우편번호를 입력해주세요.');
            return;
        }
        // 우편번호를 기반으로 주소 생성 (예시)
        setUserAddress(`우편번호 ${userZipcode} 지역`);
        handleZipcodeModalClose();
        setShowStoreMap(true);
    };

    // Load Daum Postcode API
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    // Handle Kakao Map directions
    const handleKakaoMapDirections = (destination) => {
        // Kakao Map Directions URL
        // 카카오맵 길찾기는 URL 스킴으로 연결됩니다
        const encodedDestination = encodeURIComponent(destination);
        const encodedOrigin = encodeURIComponent(userAddress);

        // 카카오맵 앱/웹으로 길찾기 열기
        const kakaoMapUrl = `https://map.kakao.com/link/to/${encodedDestination},${destination}`;

        // 새 창으로 카카오맵 길찾기 열기
        window.open(kakaoMapUrl, '_blank');
    };

    // Mock 주변 매장 데이터
    const nearbyStores = [
        { id: 1, name: '이마트 강남점', type: '대형마트', distance: '350m', address: '서울 강남구 강남대로', rating: 4.5 },
        { id: 2, name: '동네슈퍼 편의점', type: '슈퍼마켓', distance: '120m', address: '서울 강남구 논현동', rating: 4.2 },
        { id: 3, name: '중앙시장', type: '전통시장', distance: '480m', address: '서울 강남구 역삼동', rating: 4.7 },
        { id: 4, name: 'GS25 논현점', type: '편의점', distance: '200m', address: '서울 강남구 논현동', rating: 4.0 },
        { id: 5, name: '롯데마트 서초점', type: '대형마트', distance: '520m', address: '서울 서초구 서초대로', rating: 4.6 },
    ];

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-20">
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Back Button */}
                <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center gap-2 mb-6 px-4 py-2 border-2 border-[#3d3226] text-[#3d3226] hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors rounded-md"
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
                                <span
                                    className="cursor-pointer hover:underline"
                                    onClick={() => onAuthorClick && onAuthorClick(recipe.author)}
                                >
                                    {recipe.author}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={18} />
                                <span>{recipe.cookTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star size={18} fill="#f59e0b" className="text-[#f59e0b]" />
                                <span className="font-bold text-[#3d3226]">{averageRating}</span>
                                <span className="text-sm text-[#6b5d4f]">({totalRatings}명)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>조회수 {recipe.views}</span>
                            </div>
                        </div>

                        {/* Rating Section */}
                        <div className="mb-6 p-4 bg-[#ebe5db] rounded-lg border-2 border-[#d4cbbf]">
                            <p className="text-sm text-[#3d3226] mb-2">이 레시피를 평가해주세요</p>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => handleRatingClick(star)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star
                                            size={32}
                                            fill={star <= userRating ? '#f59e0b' : 'none'}
                                            className={star <= userRating ? 'text-[#f59e0b]' : 'text-[#d4cbbf]'}
                                        />
                                    </button>
                                ))}
                                {userRating > 0 && (
                                    <span className="ml-2 text-[#3d3226]">내 평점: {userRating}점</span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={handleFavoriteClick}
                                className={`flex items-center gap-2 px-6 py-3 rounded-md border-2 transition-colors ${isFavorited
                                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                                    : 'border-[#d4cbbf] text-[#3d3226] hover:border-[#3d3226]'
                                    }`}
                            >
                                <Bookmark size={20} fill={isFavorited ? 'currentColor' : 'none'} />
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
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md hover:from-emerald-600 hover:to-teal-700 transition-colors text-sm shadow-md"
                        >
                            <Sparkles size={16} />
                            내 근처 재료 찾기
                        </button>
                    </div>

                    <ul className="space-y-3 mb-6">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="flex items-start gap-3 text-[#6b5d4f]">
                                <span className="w-2 h-2 bg-[#3d3226] rounded-full mt-2 flex-shrink-0" />
                                <span className="text-lg">{ingredient}</span>
                            </li>
                        ))}
                    </ul>

                    {/* AI Store Map */}
                    {showStoreMap && (
                        <div className="mt-6 pt-6 border-t-2 border-[#d4cbbf]">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin size={20} className="text-[#3d3226]" />
                                <h3 className="text-xl text-[#3d3226]">내 근처 재료 구입 가능 매장</h3>
                            </div>
                            <p className="text-sm text-[#6b5d4f] mb-4">현재 위치 기준으로 가까운 순서로 표시됩니다</p>

                            <div className="space-y-3">
                                {nearbyStores.map((store) => (
                                    <div
                                        key={store.id}
                                        className="p-4 bg-[#ebe5db] rounded-lg border-2 border-[#d4cbbf] hover:border-[#3d3226] transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-[#3d3226]">{store.name}</h4>
                                                    <span className="px-2 py-1 bg-white text-xs text-[#6b5d4f] rounded-full border border-[#d4cbbf]">
                                                        {store.type}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-[#6b5d4f] mb-2">{store.address}</p>
                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="flex items-center gap-1 text-[#3d3226]">
                                                        <MapPin size={14} />
                                                        <span className="font-medium">{store.distance}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Star size={14} fill="#f59e0b" className="text-[#f59e0b]" />
                                                        <span className="text-[#3d3226]">{store.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleKakaoMapDirections(store.address)}
                                                className="px-4 py-2 bg-[#3d3226] text-[#f5f1eb] rounded-md hover:bg-[#5d4a36] transition-colors text-sm"
                                            >
                                                길찾기
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                <p className="text-sm text-blue-800">
                                    💡 <strong>Tip:</strong> 매장을 클릭하면 해당 매장의 상세 정보와 위치를 확인할 수 있습니다.
                                </p>
                            </div>
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

                {/* Comments */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-[#e5dfd5] p-8 mt-8">
                    <h2 className="text-2xl mb-4 text-[#3d3226]">댓글</h2>
                    <div className="space-y-4">
                        {comments.map(comment => (
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
                                        <span className="font-bold text-[#3d3226]">{comment.author}</span>
                                        <span className="text-sm text-[#6b5d4f]">{comment.createdAt}</span>
                                        {comment.isMine && (
                                            <button
                                                onClick={() => handleCommentDelete(comment.id)}
                                                className="ml-2 text-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-lg text-[#6b5d4f] leading-relaxed">{comment.content}</p>
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
                            className="mt-4 px-6 py-3 bg-[#3d3226] text-[#f5f1eb] rounded-md hover:bg-[#5c4c40] transition-colors"
                        >
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
                                className="hover:bg-[#5d4a36] p-1 rounded transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-[#3d3226] mb-6">
                                내 근처 재료 판매 매장을 찾기 위해 주소를 검색해주세요.
                            </p>

                            <div className="space-y-4">
                                {/* Daum Postcode Button */}
                                <button
                                    onClick={handleDaumPostcode}
                                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md hover:from-emerald-600 hover:to-teal-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                                >
                                    <Search size={20} />
                                    주소 검색
                                </button>
                            </div>

                            {userAddress && (
                                <div className="mt-4 p-4 bg-[#ebe5db] rounded-lg border-2 border-[#d4cbbf]">
                                    <p className="text-sm text-[#6b5d4f] mb-1">선택된 주소:</p>
                                    <p className="text-[#3d3226] font-medium">{userAddress}</p>
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
                            <h3 className="text-xl font-bold">이메일 인증 필요</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <Mail size={24} className="text-emerald-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[#3d3226] mb-2">
                                        댓글 작성을 위해서는 이메일 인증이 필요합니다.
                                    </p>
                                    <p className="text-sm text-[#6b5d4f]">
                                        프로필 페이지에서 이메일 인증을 완료해주세요.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowEmailWarning(false)}
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
    );
}
