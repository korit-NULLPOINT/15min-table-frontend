import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TopRecipes } from './components/TopRecipes';
import { HighRatedSlider } from './components/HighRatedSlider';
import { AuthModal } from './components/AuthModal';
import { UserProfile } from './components/UserProfile';
import { RecipeDetail } from './components/RecipeDetail';
import { RecipeWrite } from './components/RecipeWrite';
import { Community } from './components/Community';
import { CommunityWrite } from './components/CommunityWrite';
import { recipeDetailsMap } from './utils/recipeData';

export default function App() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userNickname, setUserNickname] = useState('');
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);

    // Handle browser back/forward buttons
    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.hash.slice(1) || 'home';
            if (path === 'home' || path === 'profile' || path === 'recipe' || path === 'write' || path === 'community' || path === 'communityWrite') {
                setCurrentPage(path);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Load saved user data on mount
    useEffect(() => {
        const savedNickname = localStorage.getItem('userNickname');
        const savedLoginState = localStorage.getItem('isLoggedIn');

        if (savedNickname) setUserNickname(savedNickname);
        if (savedLoginState === 'true') setIsLoggedIn(true);
    }, []);

    const openAuthModal = (mode) => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    const handleAuthSuccess = (nickname) => {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');

        if (nickname) {
            setUserNickname(nickname);
            localStorage.setItem('userNickname', nickname);
        }
    };

    const handleModeChange = (mode) => {
        setAuthMode(mode);
    };

    const handleNavigate = (page) => {
        setCurrentPage(page);
        setSelectedRecipeId(null);
        window.history.pushState({}, '', `#${page}`);
    };

    const handleRecipeClick = (recipeId) => {
        setSelectedRecipeId(recipeId);
        setCurrentPage('recipe');
        window.history.pushState({}, '', '#recipe');
    };

    const handleOpenAuthForFeature = () => {
        openAuthModal('login');
    };

    const selectedRecipe = selectedRecipeId ? recipeDetailsMap[selectedRecipeId] : null;

    return (
        <div className="min-h-screen bg-[#f5f1eb]">
            <Header
                onOpenAuth={openAuthModal}
                onNavigate={handleNavigate}
                isLoggedIn={isLoggedIn}
                userNickname={userNickname}
            />

            {currentPage === 'home' && (
                <main className="pt-20">
                    {/* Hero Section */}
                    <section className="px-6 py-8 max-w-7xl mx-auto">
                        <div className="text-center mb-4">
                            <h2 className="text-5xl mb-4 text-[#3d3226] font-serif" style={{ letterSpacing: '0.02em' }}>
                                15분이면 충분한
                                <br />
                                <span className="text-6xl" style={{ fontWeight: 500 }}>식탁 위의 행복</span>
                            </h2>
                            <p className="text-lg text-[#6b5d4f] mt-4">바쁜 자취생을 위한 간단하고 맛있는 레시피</p>
                        </div>
                    </section>

                    {/* Top Ranked Recipes */}
                    <TopRecipes
                        onRecipeClick={handleRecipeClick}
                        isLoggedIn={isLoggedIn}
                        onOpenAuth={handleOpenAuthForFeature}
                    />

                    {/* High Rated Recipes Slider */}
                    <HighRatedSlider
                        onRecipeClick={handleRecipeClick}
                        isLoggedIn={isLoggedIn}
                        onOpenAuth={handleOpenAuthForFeature}
                    />
                </main>
            )}

            {currentPage === 'profile' && isLoggedIn && (
                <UserProfile
                    onNavigate={handleNavigate}
                    onRecipeClick={handleRecipeClick}
                    userNickname={userNickname}
                />
            )}

            {currentPage === 'recipe' && selectedRecipe && (
                <RecipeDetail
                    recipe={selectedRecipe}
                    onNavigate={handleNavigate}
                    isLoggedIn={isLoggedIn}
                    onOpenAuth={handleOpenAuthForFeature}
                />
            )}

            {currentPage === 'write' && isLoggedIn && (
                <RecipeWrite onNavigate={handleNavigate} />
            )}

            {currentPage === 'community' && (
                <Community
                    onNavigate={handleNavigate}
                    onPostClick={(postId) => {
                        // TODO: Navigate to community detail
                        console.log('Community post clicked:', postId);
                    }}
                />
            )}

            {currentPage === 'communityWrite' && isLoggedIn && (
                <CommunityWrite onNavigate={handleNavigate} />
            )}

            {currentPage === 'home' && (
                <footer className="bg-[#3d3226] text-[#f5f1eb] py-8 mt-20">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <p className="text-sm">© 2026 십오분:식탁. 모든 권리 보유.</p>
                    </div>
                </footer>
            )}

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                mode={authMode}
                onAuthSuccess={handleAuthSuccess}
                onModeChange={handleModeChange}
            />
        </div>
    );
}
