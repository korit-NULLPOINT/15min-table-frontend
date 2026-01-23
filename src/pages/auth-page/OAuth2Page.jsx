// src/pages/auth-page/OAuth2Page.jsx
import { useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePrincipalState } from '../../store/usePrincipalState';
import { LoaderCircle } from 'lucide-react';
import { OAuth2Modal } from '../../components/layout/OAuth2Modal';

export default function OAuth2Page() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { fetchUser } = usePrincipalState();

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

    useEffect(() => {
        if (!accessToken) return;

        localStorage.setItem('AccessToken', accessToken);
        fetchUser().finally(() => {
            // 토큰이 URL에 남지 않게 replace 추천
            navigate('/', { replace: true });
        });
    }, [accessToken, fetchUser, navigate]);

    // ✅ accessToken 처리 중 화면
    if (accessToken) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f1eb]">
                <p className="text-[#6b5d4f] text-lg font-medium animate-pulse">
                    로그인 처리중...
                </p>
                <LoaderCircle className="w-12 h-12 text-[#3d3226] animate-spin mb-4" />
            </div>
        );
    }

    // ✅ 소셜 정보 자체가 없으면 그냥 홈으로 보내는 게 UX 더 좋음
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
