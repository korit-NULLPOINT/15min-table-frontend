import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { MapPin, Star, X, Search } from 'lucide-react';

const AiStoreMapPage = forwardRef((props, ref) => {
    const [showStoreMap, setShowStoreMap] = useState(false);
    const [showZipcodeModal, setShowZipcodeModal] = useState(false);
    const [userZipcode, setUserZipcode] = useState('');
    const [userAddress, setUserAddress] = useState('');

    useImperativeHandle(ref, () => ({
        handleAIStoreMap: () => {
            // 주소가 없으면 모달을 띄움
            if (!userAddress) {
                setShowZipcodeModal(true);
            } else {
                setShowStoreMap(!showStoreMap);
            }
        },
    }));

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
                },
            }).open();
        } else {
            alert(
                '우편번호 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.',
            );
        }
    };

    // Load Daum Postcode API
    useEffect(() => {
        const script = document.createElement('script');
        script.src =
            '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
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
        // const encodedOrigin = encodeURIComponent(userAddress);

        // 카카오맵 앱/웹으로 길찾기 열기
        const kakaoMapUrl = `https://map.kakao.com/link/to/${encodedDestination},${destination}`;

        // 새 창으로 카카오맵 길찾기 열기
        window.open(kakaoMapUrl, '_blank');
    };

    // Mock 주변 매장 데이터
    const nearbyStores = [
        {
            id: 1,
            name: '이마트 강남점',
            type: '대형마트',
            distance: '350m',
            address: '서울 강남구 강남대로',
            rating: 4.5,
        },
        {
            id: 2,
            name: '동네슈퍼 편의점',
            type: '슈퍼마켓',
            distance: '120m',
            address: '서울 강남구 논현동',
            rating: 4.2,
        },
        {
            id: 3,
            name: '중앙시장',
            type: '전통시장',
            distance: '480m',
            address: '서울 강남구 역삼동',
            rating: 4.7,
        },
        {
            id: 4,
            name: 'GS25 논현점',
            type: '편의점',
            distance: '200m',
            address: '서울 강남구 논현동',
            rating: 4.0,
        },
        {
            id: 5,
            name: '롯데마트 서초점',
            type: '대형마트',
            distance: '520m',
            address: '서울 서초구 서초대로',
            rating: 4.6,
        },
    ];

    return (
        <>
            {/* AI Store Map */}
            {showStoreMap && (
                <div className="mt-6 pt-6 border-t-2 border-[#d4cbbf]">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin size={20} className="text-[#3d3226]" />
                        <h3 className="text-xl text-[#3d3226]">
                            내 근처 재료 구입 가능 매장
                        </h3>
                    </div>
                    <p className="text-sm text-[#6b5d4f] mb-4">
                        현재 위치 기준으로 가까운 순서로 표시됩니다
                    </p>

                    <div className="space-y-3">
                        {nearbyStores.map((store) => (
                            <div
                                key={store.id}
                                className="p-4 bg-[#ebe5db] rounded-lg border-2 border-[#d4cbbf] hover:border-[#3d3226] transition-colors cursor-pointer"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-[#3d3226]">
                                                {store.name}
                                            </h4>
                                            <span className="px-2 py-1 bg-white text-xs text-[#6b5d4f] rounded-full border border-[#d4cbbf]">
                                                {store.type}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#6b5d4f] mb-2">
                                            {store.address}
                                        </p>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="flex items-center gap-1 text-[#3d3226]">
                                                <MapPin size={14} />
                                                <span className="font-medium">
                                                    {store.distance}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star
                                                    size={14}
                                                    fill="#f59e0b"
                                                    className="text-[#f59e0b]"
                                                />
                                                <span className="text-[#3d3226]">
                                                    {store.rating}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleKakaoMapDirections(
                                                store.address,
                                            )
                                        }
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
                            💡 <strong>Tip:</strong> 매장을 클릭하면 해당 매장의
                            상세 정보와 위치를 확인할 수 있습니다.
                        </p>
                    </div>
                </div>
            )}

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
                                내 근처 재료 판매 매장을 찾기 위해 주소를
                                검색해주세요.
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
        </>
    );
});

export default AiStoreMapPage;
