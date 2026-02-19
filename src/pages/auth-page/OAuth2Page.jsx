import { useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { usePrincipalState } from '../../store/usePrincipalState';
import { LoaderCircle } from 'lucide-react';
import { OAuth2Modal } from '../../components/layout/OAuth2Modal';
import { useRefresh } from '../../apis/generated/user-auth-controller/user-auth-controller';

export default function OAuth2Page() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { fetchUser } = usePrincipalState();

    const { mutateAsync: refreshMutate } = useRefresh();

    const accessToken = searchParams.get('accessToken');

    const socialData = useMemo(() => {
        const provider = searchParams.get('provider');
        const providerUserId =
            searchParams.get('providerId') ||
            searchParams.get('providerUserId');

        if (!provider || !providerUserId) return null;

        return {
            email: searchParams.get('email'),
            provider,
            name: searchParams.get('name'),
            providerUserId,
        };
    }, [searchParams]);

    // 기존 로그인: accessToken 쿼리가 있으면 그대로 저장 후 이동
    useEffect(() => {
        if (!accessToken) return;

        localStorage.setItem('AccessToken', accessToken);
        fetchUser().finally(() => {
            navigate('/', { replace: true });
        });
    }, [accessToken, fetchUser, navigate]);

    // oAuth2 로그인 /auth/oauth2/signin 으로 왔고 accessToken이 없으면 RT로 refresh 1회 호출
    useEffect(() => {
        const isOauth2Signin = location.pathname === '/auth/oauth2/signin';
        if (!isOauth2Signin) return;
        if (accessToken) return;

        (async () => {
            try {
                const res = await refreshMutate();
                const token = res?.data?.data; // ApiRespDtoString의 data가 AT
                if (token) localStorage.setItem('AccessToken', token);

                await fetchUser();
                navigate('/', { replace: true });
            } catch (e) {
                // RT가 없거나 만료/회전 실패면 홈으로 보내고 로그인 유도
                navigate('/', { replace: true });
            }
        })();
    }, [location.pathname, accessToken, refreshMutate, fetchUser, navigate]);

    // 로딩 화면: accessToken 처리 중이거나, oauth2 signin에서 refresh 처리 중
    if (accessToken || location.pathname === '/auth/oauth2/signin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f1eb]">
                <p className="text-[#6b5d4f] text-lg font-medium animate-pulse">
                    로그인 처리중...
                </p>
                <LoaderCircle className="w-12 h-12 text-[#3d3226] animate-spin mb-4" />
            </div>
        );
    }

    // 소셜 정보 없으면 홈
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
