import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { usePrincipalState } from '../../store/usePrincipalState';
import { LoaderCircle } from 'lucide-react';
import { OAuth2Modal } from '../../components/layout/OAuth2Modal';

// ✅ custom axios instance (이름은 너희 파일 export에 맞게 수정)
import { AXIOS_INSTANCE } from '../../apis/custom-instance';

export default function OAuth2Page() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { fetchUser } = usePrincipalState();

    const [isProcessing, setIsProcessing] = useState(false);

    const accessToken = searchParams.get('accessToken');

    const socialData = useMemo(() => {
        const provider = searchParams.get('provider');
        const providerUserId =
            searchParams.get('providerId') ||
            searchParams.get('providerUserId');

        // provider/providerUserId 없으면 연동 UI를 띄울 이유 없음
        if (!provider || !providerUserId) return null;

        return {
            email: searchParams.get('email'),
            provider,
            name: searchParams.get('name'),
            providerUserId,
        };
    }, [searchParams]);

    // ✅ 1) (혹시라도) accessToken 쿼리로 오는 경우: 기존 로직 유지
    useEffect(() => {
        if (!accessToken) return;

        setIsProcessing(true);
        localStorage.setItem('AccessToken', accessToken);

        fetchUser().finally(() => {
            navigate('/', { replace: true });
        });
    }, [accessToken, fetchUser, navigate]);

    // ✅ 2) 핵심: /auth/oauth2/signin 이고 accessToken이 없으면 refresh로 AT 확보
    useEffect(() => {
        const isOauthSigninPage = location.pathname === '/auth/oauth2/signin';
        if (!isOauthSigninPage) return;
        if (accessToken) return; // 위 useEffect가 처리

        setIsProcessing(true);

        (async () => {
            try {
                // RT 쿠키를 기반으로 새 AT 발급
                const res = await AXIOS_INSTANCE.post('/user/auth/refresh');

                // ApiRespDto<String> 기준: res.data.data 가 accessToken
                const newAccess = res?.data?.data;
                if (!newAccess) throw new Error('NO_ACCESS_TOKEN_FROM_REFRESH');

                localStorage.setItem('AccessToken', newAccess);
                await fetchUser();

                navigate('/', { replace: true });
            } catch (e) {
                // refresh 실패(= RT 없거나 만료 등) -> 로그인 실패 처리
                localStorage.removeItem('AccessToken');
                navigate('/', { replace: true });
            } finally {
                setIsProcessing(false);
            }
        })();
    }, [location.pathname, accessToken, fetchUser, navigate]);

    // ✅ 처리 중 화면: accessToken이 있든 /auth/oauth2/signin 이든 동일하게 로딩
    if (
        accessToken ||
        isProcessing ||
        location.pathname === '/auth/oauth2/signin'
    ) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f1eb]">
                <p className="text-[#6b5d4f] text-lg font-medium animate-pulse">
                    로그인 처리중...
                </p>
                <LoaderCircle className="w-12 h-12 text-[#3d3226] animate-spin mb-4" />
            </div>
        );
    }

    // ✅ 소셜 정보 자체가 없으면 그냥 홈으로
    if (!socialData) {
        navigate('/', { replace: true });
        return null;
    }

    return (
        <OAuth2Modal
            socialData={socialData}
            onDone={() => navigate('/', { replace: true })}
        />
    );
}
