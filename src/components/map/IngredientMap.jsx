import { useEffect, useRef } from "react";

const CATEGORIES = [
    { code: "CS2", label: "편의점" },
    { code: "MT1", label: "대형마트" },
    { code: "PM9", label: "슈퍼마켓" },
];
const NON_FOOD_KEYWORDS = [
    "휴대폰",
    "대리점",
    "통신",
    "SKT",
    "KT",
    "LG",
    "U+",
    "유플러스",
    "전자",
    "가전",
    "수리",
    "안경",
    "금은방",
    "귀금속",
    "의류",
    "옷",
    "신발",
    "잡화",
    "문구",
    "꽃집",
];

const MARKET_ITEM_KEYWORDS = [
    "정육",
    "고기",
    "축산",
    "수산",
    "생선",
    "건어물",
    "야채",
    "채소",
    "과일",
    "청과",
    "식자재",
    "반찬",
    "쌀",
    "곡물",
    "두부",
    "계란",
];

const MARKET_EXCLUDE_KEYWORDS = [
    "주차",
    "화장실",
    "고객",
    "관리",
    "사무",
    "센터",
    "음식",
    "식당",
    "국밥",
    "칼국수",
    "분식",
    "포차",
    "주점",
    "카페",
    "커피",
];

// 허용 카테고리 그룹 (카카오 제공)
const ALLOWED_GROUPS = ["MT1", "PM9", "CS2"];

// 이름에 포함되면 제외할 키워드
const EXCLUDE_NAME_KEYWORDS = [
    "카페",
    "커피",
    "식당",
    "음식",
    "분식",
    "주점",
    "호프",
    "포차",
    "술",
];

export default function IngredientMap({
    address,
    onPlacesChange,
    selectedPlaceId,
    onOriginChange,
}) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    // 두 좌표 거리(m) 계산 (Haversine)
    const getDistanceMeter = (lat1, lng1, lat2, lng2) => {
        const R = 6371000; // 지구 반지름(m)
        const toRad = (v) => (v * Math.PI) / 180;

        const dLat = toRad(lat2 - lat1);
        const dLng = toRad(lng2 - lng1);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLng / 2) ** 2;

        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const markersRef = useRef([]); // 지도 마커 정리용
    const markerMapRef = useRef(new Map()); // placeKey → record
    const placesMapRef = useRef(new Map()); // 리스트용 데이터

    const infoWindowRef = useRef(null);
    const originMarkerRef = useRef(null);
    const activeMarkerRef = useRef(null);
    const originRef = useRef(null);
    const infoOverlayRef = useRef(null);

    const isPharmacy = (place) =>
        place.category_name?.includes("약국") ||
        place.place_name?.includes("약국");

    const getPlaceKey = (place) => place.id || `${place.x},${place.y}`;

    const clearMarkers = () => {
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];
        markerMapRef.current.clear();
        placesMapRef.current.clear();

        infoWindowRef.current?.close();
        activeMarkerRef.current = null;

        onPlacesChange?.([]);
    };
    //출발지 마커

    const setOriginMarker = (lat, lng) => {
        originMarkerRef.current?.setMap(null);

        originMarkerRef.current = new window.kakao.maps.Marker({
            map: mapInstanceRef.current,
            position: new window.kakao.maps.LatLng(lat, lng),
        });
        const overlay = new window.kakao.maps.CustomOverlay({
            position: new window.kakao.maps.LatLng(lat, lng),
            yAnchor: 1.3,
            zIndex: 100, // 마커보다 항상 위
            content: `
        <div style="
            background:#3d3226;
            color:#fff;
            padding:6px 10px;
            border-radius:8px;
            font-size:12px;
            white-space:nowrap;
            box-shadow:0 2px 6px rgba(0,0,0,0.25);
        ">
            📍 출발지
        </div>
        `,
        });

        overlay.setMap(mapInstanceRef.current);
    };

    /* =====================
        인포윈도우 열기 (공용)
    ====================== */

    const openInfoFor = (record) => {
        const { marker, place, label } = record;

        // 같은 마커 다시 클릭 → 닫기
        if (activeMarkerRef.current === marker) {
            infoOverlayRef.current?.setMap(null);
            activeMarkerRef.current = null;
            return;
        }

        infoOverlayRef.current?.setMap(null);

        //  1. 지도 중심을 해당 마커로 이동 (원래 체감 복구)
        mapInstanceRef.current.panTo(marker.getPosition());

        //  2. 마커 "바로 위"에 뜨도록 yAnchor 조정
        const overlay = new window.kakao.maps.CustomOverlay({
            position: marker.getPosition(),
            yAnchor: 1.15, // ⭐ 이 값이 핵심 (1.1~1.25 사이가 제일 자연스러움)
            zIndex: 9999,
            content: `
            <div style="
                background:#fff;
                border-radius:10px;
                padding:10px;
                min-width:220px;
                box-shadow:0 4px 12px rgba(0,0,0,0.25);
                font-size:13px;
            ">
                <strong>${place.place_name}</strong><br/>
                <span>${label}</span><br/>
                <div style="font-size:12px;color:#666;margin-top:4px;">
                ${place.road_address_name || place.address_name || ""}
                </div>
                <button
                id="route-btn"
                style="
                    margin-top:8px;
                    width:100%;
                    padding:8px;
                    background:#3d3226;
                    color:#fff;
                    border:none;
                    border-radius:6px;
                    cursor:pointer;
                    font-size:12px;
                ">
                카카오맵 길찾기
                </button>
            </div>
            `,
        });

        overlay.setMap(mapInstanceRef.current);
        infoOverlayRef.current = overlay;
        activeMarkerRef.current = marker;

        setTimeout(() => {
            const btn = document.getElementById("route-btn");
            if (!btn || !originRef.current) return;

            btn.onclick = () => {
                const o = originRef.current;
                window.open(
                    `https://map.kakao.com/link/from/${encodeURIComponent(o.name)},${o.lat},${o.lng}/to/${encodeURIComponent(place.place_name)},${place.y},${place.x}`,
                    "_blank",
                );
            };
        }, 0);
    };
    const calcRecipeFitScore = (place, label) => {
        const name = place.place_name || "";

        // 🚫 음식점이 아닌 업종 (휴대폰 / 통신 / 의류 등) 즉시 탈락
        if (NON_FOOD_KEYWORDS.some((w) => name.includes(w))) {
            return 0;
        }

        let score = 0;

        // ❌ 카페/식당/주점 즉시 탈락
        if (name.match(/카페|커피|식당|분식|주점|술/)) {
            return 0;
        }

        // ❌ 시장 잡것 (주차장/관리소/화장실 등)
        if (
            label === "시장" &&
            MARKET_EXCLUDE_KEYWORDS.some((w) => name.includes(w))
        ) {
            return 0;
        }

        // 기본 점수
        if (label === "대형마트") score += 3;
        if (label === "시장") score += 2;
        if (label === "슈퍼마켓") score += 2;
        if (label === "편의점") score += 1;

        // 시장 + 재료 전문 키워드
        if (
            label === "시장" &&
            MARKET_ITEM_KEYWORDS.some((w) => name.includes(w))
        ) {
            score += 2;
        }

        // 공통 가산
        if (name.match(/정육|식자재|야채|청과|수산|마트/)) {
            score += 1;
        }

        return Math.max(score, 0);
    };

    /* =====================
        마커 추가
    ====================== */
    const addMarker = (place, label) => {
        const placeKey = getPlaceKey(place);
        const btnId = `kakao-route-btn-${placeKey}`;

        if (markerMapRef.current.has(placeKey)) return;

        const marker = new window.kakao.maps.Marker({
            map: mapInstanceRef.current,
            position: new window.kakao.maps.LatLng(place.y, place.x),
        });
        const record = { marker, place, label, btnId };
        markerMapRef.current.set(placeKey, record);
        markersRef.current.push(marker);

        // 거리/도보시간 계산 (여기서 확실히 정의)
        const origin = originRef.current;
        const distance = origin
            ? Math.round(
                  getDistanceMeter(
                      origin.lat,
                      origin.lng,
                      Number(place.y),
                      Number(place.x),
                  ),
              )
            : null;

        const walkTime =
            distance != null ? Math.max(1, Math.ceil(distance / 67)) : null; // 67m/분

        // 리스트용 데이터
        const fitScore = calcRecipeFitScore(place, label);

        const item = {
            id: placeKey,
            name: place.place_name,
            label,
            address: place.road_address_name || place.address_name || "",
            x: place.x,
            y: place.y,
            distance,
            walkTime,
            fitScore, // ⭐ 이 줄 추가
        };

        placesMapRef.current.set(placeKey, item);
        onPlacesChange?.(Array.from(placesMapRef.current.values()));

        window.kakao.maps.event.addListener(marker, "click", () => {
            openInfoFor(record);
        });
    };

    /* =====================
        주변 검색
    ====================== */

    const includesAny = (text = "", keywords = []) =>
        keywords.some((k) => text.includes(k));

    const searchNearbyStores = (center) => {
        const ps = new window.kakao.maps.services.Places();

        // 1) 편의점/대형마트/슈퍼마켓 (카테고리 검색)
        CATEGORIES.forEach((category) => {
            ps.categorySearch(
                category.code,
                (data, status) => {
                    if (status !== window.kakao.maps.services.Status.OK) return;

                    data.filter((p) => !isPharmacy(p))
                        .filter((p) =>
                            ALLOWED_GROUPS.includes(p.category_group_code),
                        )
                        .filter(
                            (p) =>
                                !includesAny(p.place_name, NON_FOOD_KEYWORDS),
                        ) // ⭐ 여기
                        .filter(
                            (p) =>
                                !includesAny(
                                    p.place_name,
                                    EXCLUDE_NAME_KEYWORDS,
                                ),
                        )
                        .forEach((p) => addMarker(p, category.label));
                },
                { location: center, radius: 1000 },
            );
        });

        // 2) 시장 (키워드 검색)
        ps.keywordSearch(
            "시장",
            (data, status) => {
                if (status !== window.kakao.maps.services.Status.OK) return;

                data.filter((p) => !isPharmacy(p))
                    .filter(
                        (p) =>
                            p.place_name.includes("시장") ||
                            p.category_name?.includes("시장"),
                    )
                    .filter(
                        (p) => !includesAny(p.place_name, NON_FOOD_KEYWORDS),
                    )
                    .filter(
                        (p) =>
                            !p.place_name.match(
                                /부대찌개|식당|국밥|분식|포차|주점/,
                            ),
                    )

                    .filter(
                        (p) =>
                            !includesAny(p.place_name, MARKET_EXCLUDE_KEYWORDS),
                    )
                    .filter(
                        (p) =>
                            !includesAny(p.place_name, EXCLUDE_NAME_KEYWORDS),
                    )
                    .forEach((p) => addMarker(p, "시장"));
            },
            { location: center, radius: 1500 },
        );
    };

    /* =====================
        지도 초기화
    ====================== */

    const initMap = () => {
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, (result, status) => {
            if (status !== window.kakao.maps.services.Status.OK) return;

            const lat = Number(result[0].y);
            const lng = Number(result[0].x);

            originRef.current = { name: address, lat, lng };
            onOriginChange?.({
                name: address,
                lat,
                lng,
            });
            const center = new window.kakao.maps.LatLng(lat, lng);

            if (!mapInstanceRef.current) {
                mapInstanceRef.current = new window.kakao.maps.Map(
                    mapRef.current,
                    {
                        center,
                        level: 4,
                    },
                );
            } else {
                mapInstanceRef.current.setCenter(center);
            }

            setOriginMarker(lat, lng);
            clearMarkers();
            searchNearbyStores(center);
        });
    };

    /* =====================
        Effects
    ====================== */

    useEffect(() => {
        if (!window.kakao || !window.kakao.maps) return;
        if (!address) return;
        initMap();
    }, [address]);

    useEffect(() => {
        if (!selectedPlaceId) return;
        const record = markerMapRef.current.get(selectedPlaceId);
        if (!record) return;
        openInfoFor(record);
    }, [selectedPlaceId]);

    return (
        <div
            ref={mapRef}
            style={{ width: "100%", height: "360px", borderRadius: "12px" }}
        />
    );
}
