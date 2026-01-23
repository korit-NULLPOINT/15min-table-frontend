import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
} from 'react';
import { X, Search } from 'lucide-react';

// ✅ TODO: 프로젝트 경로에 맞게 "이 한 줄"만 맞춰줘
import IngredientMap from './map/IngredientMap';
// 예: import IngredientMap from '../components/map/IngredientMap';

const ITEMS_PER_PAGE = 4;

// Tailwind 동적 클래스(bg-${tone}-100 ...)는 purge로 날아갈 수 있어서
// ✅ 안전한 고정 클래스 매핑
const toneClass = {
    gray: { badge: 'bg-gray-100 text-gray-700' },
    emerald: { badge: 'bg-emerald-100 text-emerald-700' },
    green: { badge: 'bg-green-100 text-green-700' },
    amber: { badge: 'bg-amber-100 text-amber-700' },
    orange: { badge: 'bg-orange-100 text-orange-700' },
    red: { badge: 'bg-red-100 text-red-700' },
};

function getDistanceMeta(distance) {
    if (distance == null)
        return { label: '거리 정보 없음', tone: 'gray', move: '' };
    if (distance <= 300)
        return { label: '아주 가까움', tone: 'emerald', move: '도보 추천' };
    if (distance <= 800)
        return { label: '가까움', tone: 'green', move: '도보 / 자전거' };
    if (distance <= 2000)
        return {
            label: '조금 멀어요',
            tone: 'amber',
            move: '자전거 / 대중교통',
        };
    if (distance <= 5000)
        return { label: '멀어요', tone: 'orange', move: '차량 추천' };
    return { label: '많이 멀어요', tone: 'red', move: '차량 필수' };
}

function loadDaumPostcodeAndOpen(onComplete) {
    if (window.daum && window.daum.Postcode) {
        new window.daum.Postcode({ oncomplete: onComplete }).open();
        return;
    }

    const script = document.createElement('script');
    script.src =
        'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;

    script.onload = () =>
        new window.daum.Postcode({ oncomplete: onComplete }).open();
    script.onerror = () => alert('주소 검색 스크립트를 불러오지 못했습니다.');

    document.body.appendChild(script);
}

const KakaoMap = forwardRef(function KakaoMap(
    { ingredients = [] }, // RecipeDetail에서 ingredientsArr 넘겨주기
    ref,
) {
    const [showStoreMap, setShowStoreMap] = useState(false);
    const [showZipcodeModal, setShowZipcodeModal] = useState(false);

    const [userAddress, setUserAddress] = useState('');

    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);
    const [originLocation, setOriginLocation] = useState(null); // { name, lat, lng }

    const [currentPage, setCurrentPage] = useState(1);
    const [autoSelected, setAutoSelected] = useState(false);

    const ingredientsText = useMemo(
        () => (ingredients || []).join(' '),
        [ingredients],
    );

    const preferredLabels = useMemo(() => {
        const labels = new Set();

        if (ingredientsText.match(/고기|삼겹|돼지|소고기|닭|정육|베이컨/)) {
            labels.add('시장');
            labels.add('슈퍼마켓');
        }
        if (
            ingredientsText.match(
                /양파|마늘|파|대파|감자|당근|버섯|배추|상추|오이|토마토|계란/,
            )
        ) {
            labels.add('시장');
            labels.add('슈퍼마켓');
        }
        if (
            ingredientsText.match(
                /라면|컵라면|즉석|햇반|소시지|어묵|김밥|스낵|과자/,
            )
        ) {
            labels.add('편의점');
        }

        return Array.from(labels);
    }, [ingredientsText]);

    // ✅ RecipeDetail 버튼에서 ref로 트리거: "주소 없으면 모달, 있으면 지도 토글"
    useImperativeHandle(ref, () => ({
        handleAIStoreMap() {
            if (!userAddress) {
                setShowZipcodeModal(true);
                return;
            }
            setShowStoreMap((prev) => !prev);
        },
    }));

    // 자동 추천 (가까운 곳 우선, preferredLabels 있으면 우선)
    useEffect(() => {
        if (autoSelected) return;
        if (!nearbyPlaces || nearbyPlaces.length === 0) return;

        const valid = nearbyPlaces.filter(
            (p) => typeof p.distance === 'number',
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

    // 화면 표시용 목록 정렬/필터
    const visiblePlaces = useMemo(() => {
        return (nearbyPlaces || [])
            .filter((p) => p.fitScore > 0)
            .sort((a, b) => {
                const aPref = preferredLabels.includes(a.label) ? 1 : 0;
                const bPref = preferredLabels.includes(b.label) ? 1 : 0;

                if (aPref !== bPref) return bPref - aPref;
                if (b.fitScore !== a.fitScore) return b.fitScore - a.fitScore;
                if (a.distance != null && b.distance != null)
                    return a.distance - b.distance;
                return 0;
            });
    }, [nearbyPlaces, preferredLabels]);

    const totalPages = Math.ceil(visiblePlaces.length / ITEMS_PER_PAGE);
    const pagedPlaces = visiblePlaces.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    const handlePageChange = (page) => setCurrentPage(page);

    const handleZipcodeModalClose = () => setShowZipcodeModal(false);

    const handleDaumPostcode = () => {
        loadDaumPostcodeAndOpen((data) => {
            const fullAddress =
                data.address || data.roadAddress || data.jibunAddress;

            if (!fullAddress) {
                alert('주소를 다시 선택해주세요.');
                return;
            }

            setUserAddress(fullAddress);

            setShowZipcodeModal(false);
            setShowStoreMap(true);

            // 주소 변경 시 상태 초기화
            setSelectedPlaceId(null);
            setCurrentPage(1);
            setAutoSelected(false);
        });
    };

    const handleReselectAddress = () => setShowZipcodeModal(true);

    const handleResearchSameAddress = () => {
        // ✅ 같은 주소라도 IngredientMap이 initMap 다시 돌도록 트릭
        setSelectedPlaceId(null);
        setCurrentPage(1);
        setAutoSelected(false);

        setUserAddress((prev) => prev + ' ');
        setTimeout(() => setUserAddress((prev) => prev.trim()), 0);
    };

    return (
        <>
            {/* ✅ 지도/추천 리스트 영역 */}
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

                    <div className="flex items-center justify-end gap-2 mb-3">
                        <button
                            onClick={handleReselectAddress}
                            className="px-3 py-2 text-sm bg-white border-2 border-[#d4cbbf] rounded-md text-[#3d3226] hover:border-[#3d3226] transition-colors"
                        >
                            주소 다시 선택
                        </button>

                        <button
                            onClick={handleResearchSameAddress}
                            className="px-3 py-2 text-sm bg-[#3d3226] text-[#f5f1eb] border-2 border-[#3d3226] rounded-md hover:bg-[#5c4c40] transition-colors"
                        >
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

                    {nearbyPlaces.length > 0 && (
                        <>
                            <div
                                id="nearby-place-list"
                                className="mt-4 space-y-2"
                            >
                                {pagedPlaces.map((p) => {
                                    const isSelected = selectedPlaceId === p.id;

                                    return (
                                        <div
                                            key={p.id}
                                            onClick={() => {
                                                setAutoSelected(true);
                                                setSelectedPlaceId(p.id);
                                            }}
                                            className={`w-full text-left p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                                                isSelected
                                                    ? 'bg-[#f3efe9] border-[#3d3226]'
                                                    : 'bg-white border-[#d4cbbf] hover:border-[#3d3226]'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <span className="font-bold text-[#3d3226]">
                                                            {p.name}
                                                        </span>

                                                        {p.fitScore >= 3 && (
                                                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500 text-white">
                                                                강력 추천
                                                            </span>
                                                        )}
                                                        {p.fitScore === 2 && (
                                                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                                                                추천
                                                            </span>
                                                        )}
                                                        {p.fitScore === 1 && (
                                                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                                                가능
                                                            </span>
                                                        )}

                                                        <span className="px-2 py-1 text-xs rounded-full border border-[#d4cbbf] bg-[#ebe5db] text-[#3d3226]">
                                                            {p.label}
                                                        </span>

                                                        {preferredLabels.includes(
                                                            p.label,
                                                        ) && (
                                                            <span className="text-xs px-2 py-1 rounded-full border border-emerald-500 text-emerald-600 bg-emerald-50">
                                                                이 레시피에 적합
                                                            </span>
                                                        )}

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();

                                                                if (
                                                                    !userAddress
                                                                ) {
                                                                    alert(
                                                                        '출발지 주소를 먼저 선택해주세요.',
                                                                    );
                                                                    return;
                                                                }
                                                                if (
                                                                    !originLocation
                                                                ) {
                                                                    alert(
                                                                        '출발지 위치 정보를 불러오지 못했습니다.',
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
                                                                    '_blank',
                                                                );
                                                            }}
                                                            className="ml-auto text-xs px-3 py-1 border border-[#d4cbbf] rounded-md hover:border-[#3d3226] transition-colors"
                                                        >
                                                            길찾기
                                                        </button>
                                                    </div>

                                                    {/* ✅ 오타 수정: text-sm */}
                                                    <div className="text-sm text-[#6b5d4f]">
                                                        {p.address ||
                                                            '주소 정보 없음'}
                                                    </div>

                                                    {typeof p.distance ===
                                                        'number' &&
                                                        (() => {
                                                            const meta =
                                                                getDistanceMeta(
                                                                    p.distance,
                                                                );
                                                            const cls =
                                                                toneClass[
                                                                    meta.tone
                                                                ] ??
                                                                toneClass.gray;

                                                            return (
                                                                <div className="mt-1 flex items-center gap-2 text-xs">
                                                                    <span
                                                                        className={`px-2 py-0.5 rounded-full ${cls.badge}`}
                                                                    >
                                                                        {
                                                                            meta.label
                                                                        }
                                                                    </span>
                                                                    <span className="text-[#8b7c6a]">
                                                                        {
                                                                            meta.move
                                                                        }{' '}
                                                                        ·{' '}
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

                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2 mt-4">
                                    {Array.from({ length: totalPages }).map(
                                        (_, idx) => {
                                            const page = idx + 1;
                                            const isActive =
                                                page === currentPage;

                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() =>
                                                        handlePageChange(page)
                                                    }
                                                    className={`w-8 h-8 rounded-md border text-sm transition-colors ${
                                                        isActive
                                                            ? 'bg-[#3d3226] text-[#f5f1eb] border-[#3d3226]'
                                                            : 'bg-white text-[#3d3226] border-[#d4cbbf] hover:border-[#3d3226]'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        },
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* ✅ 우편번호/주소 검색 모달 */}
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

export default KakaoMap;
