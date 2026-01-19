import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthModal } from '../../components/AuthModal';

function OAuth2Page({ socialData: initialSocialData }) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('signin'); // 'signin' (merge) or 'signup'

    // Derive socialData from props or URL params
    const socialData = React.useMemo(() => {
        if (initialSocialData) return initialSocialData;
        
        const provider = searchParams.get('provider');
        const providerUserId = searchParams.get('providerUserId');
        const email = searchParams.get('email');
        
        if (provider && providerUserId) {
            return { provider, providerUserId, email };
        }
        return null;
    }, [initialSocialData, searchParams]);

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        if (accessToken) {
            localStorage.setItem('AccessToken', accessToken);
            window.location.href = '/';
        }
    }, [searchParams]);

    if (!socialData) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    const handleLinkAccount = () => {
        setAuthMode('signin');
        setIsAuthModalOpen(true);
    };

    const handleSignup = () => {
        setAuthMode('signup');
        setIsAuthModalOpen(true);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f1eb] p-4">
             <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 border-2 border-[#3d3226] text-center">
                <h1 className="text-2xl font-serif text-[#3d3226] mb-6">
                    SNS 계정 연동
                </h1>
                <p className="text-[#6b5d4f] mb-8">
                    반갑습니다! <br />
                    <span className="font-bold text-[#3d3226]">{socialData.email || '사용자'}</span>님, <br/>
                    <span className="capitalize font-bold text-[#3d3226]">{socialData.provider}</span> 계정으로 인증되었습니다.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={handleLinkAccount}
                        className="w-full py-4 px-6 bg-[#3d3226] text-[#f5f1eb] rounded-md hover:bg-[#5d4a36] transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <span>기존 계정과 연동하기</span>
                    </button>
                    
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#d4cbbf]"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-[#6b5d4f]">또는</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSignup}
                        className="w-full py-4 px-6 bg-white border-2 border-[#3d3226] text-[#3d3226] rounded-md hover:bg-[#f5f1eb] transition-colors font-medium"
                    >
                        새로운 계정으로 시작하기
                    </button>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                mode={authMode}
                onModeChange={setAuthMode}
                onAuthSuccess={() => navigate('/')} 
                socialData={socialData}
            />
        </div>
    );
}

export default OAuth2Page;
