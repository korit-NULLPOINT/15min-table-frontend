import { X } from 'lucide-react';
import { useState } from 'react';

export function AuthModal({ isOpen, onClose, mode, onAuthSuccess, onModeChange }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [nickname, setNickname] = useState('');
    const [passwordError, setPasswordError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (mode === 'signup' && password !== passwordConfirm) {
            setPasswordError('비밀번호가 일치하지 않습니다.');
            return;
        }

        setPasswordError('');

        if (mode === 'signup') {
            // 회원가입 - 사용자 정보를 localStorage에 저장
            const userData = {
                email,
                password,
                nickname
            };
            localStorage.setItem('user_' + email, JSON.stringify(userData));

            // 회원가입 완료 후 로그인 모드로 전환
            alert('회원가입이 완료되었습니다! 로그인해주세요.');
            if (onModeChange) onModeChange('login');
            // 입력 필드 초기화
            setEmail('');
            setPassword('');
            setPasswordConfirm('');
            setNickname('');
        } else {
            // 로그인 - localStorage에서 사용자 정보 확인
            const savedUserData = localStorage.getItem('user_' + email);

            if (savedUserData) {
                const userData = JSON.parse(savedUserData);
                if (userData.password === password) {
                    // 로그인 성공
                    console.log('Login successful:', { email, nickname: userData.nickname });
                    if (onAuthSuccess) onAuthSuccess(userData.nickname);
                    onClose();
                } else {
                    alert('비밀번호가 일치하지 않습니다.');
                }
            } else {
                alert('등록되지 않은 이메일입니다.');
            }
        }
    };

    const handleSocialLogin = (provider) => {
        // TODO: Implement social login
        console.log(`${provider} login clicked`);
    };

    const switchMode = () => {
        const newMode = mode === 'login' ? 'signup' : 'login';
        if (onModeChange) onModeChange(newMode);
        setPasswordError('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            <div className="relative bg-[#f5f1eb] rounded-lg shadow-2xl max-w-md w-full mx-4 border-2 border-[#3d3226]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-[#e5dfd5] rounded-full transition-colors"
                >
                    <X size={24} className="text-[#3d3226]" />
                </button>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-serif text-[#3d3226] mb-2">
                            {mode === 'login' ? '로그인' : '회원가입'}
                        </h2>
                        <p className="text-[#6b5d4f]">
                            {mode === 'login'
                                ? '십오분:식탁에 오신 것을 환영합니다'
                                : '새로운 레시피를 공유해보세요'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-sm mb-2 text-[#3d3226]">닉네임</label>
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none bg-white"
                                    placeholder="닉네임을 입력하세요"
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226]">이메일</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none bg-white"
                                placeholder="email@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2 text-[#3d3226]">비밀번호</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-[#d4cbbf] rounded-md focus:border-[#3d3226] focus:outline-none bg-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {mode === 'signup' && (
                            <div>
                                <label className="block text-sm mb-2 text-[#3d3226]">비밀번호 확인</label>
                                <input
                                    type="password"
                                    value={passwordConfirm}
                                    onChange={(e) => {
                                        setPasswordConfirm(e.target.value);
                                        setPasswordError('');
                                    }}
                                    className={`w-full px-4 py-3 border-2 rounded-md focus:border-[#3d3226] focus:outline-none bg-white ${passwordError ? 'border-red-500' : 'border-[#d4cbbf]'
                                        }`}
                                    placeholder="••••••••"
                                    required
                                />
                                {passwordError && (
                                    <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 bg-[#3d3226] text-[#f5f1eb] rounded-md hover:bg-[#5d4a36] transition-colors font-medium"
                        >
                            {mode === 'login' ? '로그인' : '가입하기'}
                        </button>
                    </form>

                    {/* Social Login Buttons - Only for Signup */}
                    {mode === 'signup' && (
                        <div className="mt-6 space-y-3">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[#d4cbbf]"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-[#f5f1eb] text-[#6b5d4f]">또는</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleSocialLogin('google')}
                                className="w-full py-3 px-4 bg-white border-2 border-[#d4cbbf] rounded-md hover:border-[#3d3226] transition-colors flex items-center justify-center gap-3"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20">
                                    <path fill="#4285F4" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" />
                                    <path fill="#34A853" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z" />
                                    <path fill="#FBBC05" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z" />
                                    <path fill="#EA4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z" />
                                </svg>
                                <span className="text-[#3d3226]">Google로 계속하기</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSocialLogin('naver')}
                                className="w-full py-3 px-4 bg-[#03C75A] border-2 border-[#d4cbbf] rounded-md hover:border-[#3d3226] transition-colors flex items-center justify-center gap-3"
                            >
                                <span className="text-white font-bold text-lg">N</span>
                                <span className="text-white">네이버로 계속하기</span>
                            </button>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-sm text-[#6b5d4f]">
                            {mode === 'login' ? '계정이 없으신가요? ' : '이미 계정이 있으신가요? '}
                            <button
                                className="text-[#3d3226] underline hover:text-[#5d4a36]"
                                onClick={switchMode}
                            >
                                {mode === 'login' ? '회원가입' : '로그인'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
