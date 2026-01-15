import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TopRecipes } from './components/TopRecipes';
import { HighRatedSlider } from './components/HighRatedSlider';
import { AuthModal } from './components/AuthModal';
import { UserProfile } from './components/UserProfile';
import { RecipeDetail } from './components/RecipeDetail';
import { RecipeWrite } from './components/RecipeWrite';
import { RecipeEdit } from './components/RecipeEdit';
import { Community } from './components/Community';
import { CommunityWrite } from './components/CommunityWrite';
import { CommunityDetail } from './components/CommunityDetail';
import { CommunityEdit } from './components/CommunityEdit';
import { RecipeBoard } from './components/RecipeBoard';
import { FollowList } from './components/FollowList';
import { OtherUserProfile } from './components/OtherUserProfile';
import { recipeDetailsMap } from './utils/recipeData';

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNickname, setUserNickname] = useState('');
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [otherUserName, setOtherUserName] = useState('');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.hash.slice(1) || 'home';
      if (path === 'home' || path === 'profile' || path === 'recipe' || path === 'write' || path === 'edit' || path === 'community' || path === 'communityWrite' || path === 'communityDetail' || path === 'communityEdit' || path === 'board' || path === 'followers' || path === 'following' || path === 'otherProfile') {
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserNickname('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userNickname');
    setCurrentPage('home');
    window.history.pushState({}, '', '#home');
  };

  const handleRandomRecipe = () => {
    // Get all available recipe IDs from recipeDetailsMap and localStorage
    const defaultRecipeIds = Object.keys(recipeDetailsMap).map(Number);
    const savedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    const savedRecipeIds = savedRecipes.map((r) => r.id);

    // Combine all recipe IDs
    const allRecipeIds = [...defaultRecipeIds, ...savedRecipeIds];

    if (allRecipeIds.length > 0) {
      // Select a random recipe ID
      const randomIndex = Math.floor(Math.random() * allRecipeIds.length);
      const randomRecipeId = allRecipeIds[randomIndex];

      // Navigate to the random recipe
      handleRecipeClick(randomRecipeId);
    }
  };

  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
    setCurrentPage('communityDetail');
    window.history.pushState({}, '', '#communityDetail');
  };

  const handleEditRecipe = (recipeId) => {
    setEditingRecipeId(recipeId);
    setCurrentPage('edit');
    window.history.pushState({}, '', '#edit');
  };

  const handleFollowersClick = () => {
    setCurrentPage('followers');
    window.history.pushState({}, '', '#followers');
  };

  const handleFollowingClick = () => {
    setCurrentPage('following');
    window.history.pushState({}, '', '#following');
  };

  const handleUserClick = (userId, userName) => {
    setOtherUserName(userName);
    setCurrentPage('otherProfile');
    window.history.pushState({}, '', '#otherProfile');
  };

  const handleAuthorClick = (authorName) => {
    setOtherUserName(authorName);
    setCurrentPage('otherProfile');
    window.history.pushState({}, '', '#otherProfile');
  };

  const handleNotificationClick = (notification) => {
    if (notification.type === 'follow') {
      // 팔로우 알림 - 해당 유저의 프로필로 이동
      handleAuthorClick(notification.userName);
    } else if (notification.type === 'post') {
      // 게시글 등록 알림 - 해당 레시피로 이동
      // Mock: 실제로는 notification.postId를 사용
      handleRecipeClick(1); // 임시로 ID 1번 레시피로 이동
    }
  };

  const handleCommunityPostClick = (postId) => {
    setSelectedPostId(postId);
    setCurrentPage('communityDetail');
    window.history.pushState({}, '', '#communityDetail');
  };

  const handleEditCommunityPost = (postId) => {
    setSelectedPostId(postId);
    setCurrentPage('communityEdit');
    window.history.pushState({}, '', '#communityEdit');
  };

  const selectedRecipe = selectedRecipeId
    ? recipeDetailsMap[selectedRecipeId] ||
    JSON.parse(localStorage.getItem('recipes') || '[]').find((r) => r.id === selectedRecipeId)
    : null;

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      <Header
        onOpenAuth={openAuthModal}
        onNavigate={handleNavigate}
        isLoggedIn={isLoggedIn}
        userNickname={userNickname}
        onRandomRecipe={handleRandomRecipe}
        onNotificationClick={handleNotificationClick}
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
          onLogout={handleLogout}
          onEditRecipe={handleEditRecipe}
          onFollowersClick={handleFollowersClick}
          onFollowingClick={handleFollowingClick}
          onCommunityPostClick={handleCommunityPostClick}
          onEditCommunityPost={handleEditCommunityPost}
        />
      )}

      {currentPage === 'recipe' && selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onNavigate={handleNavigate}
          isLoggedIn={isLoggedIn}
          onOpenAuth={handleOpenAuthForFeature}
          currentUserNickname={userNickname}
          onAuthorClick={handleAuthorClick}
        />
      )}

      {currentPage === 'write' && isLoggedIn && (
        <RecipeWrite onNavigate={handleNavigate} />
      )}

      {currentPage === 'edit' && isLoggedIn && editingRecipeId && (
        <RecipeEdit onNavigate={handleNavigate} recipeId={editingRecipeId} />
      )}

      {currentPage === 'community' && (
        <Community
          onNavigate={handleNavigate}
          onPostClick={handlePostClick}
        />
      )}

      {currentPage === 'communityWrite' && isLoggedIn && (
        <CommunityWrite onNavigate={handleNavigate} />
      )}

      {currentPage === 'communityDetail' && selectedPostId && (
        <CommunityDetail
          postId={selectedPostId}
          onNavigate={handleNavigate}
          userNickname={userNickname}
        />
      )}

      {currentPage === 'communityEdit' && selectedPostId && (
        <CommunityEdit
          postId={selectedPostId}
          onNavigate={handleNavigate}
          userNickname={userNickname}
        />
      )}

      {currentPage === 'board' && (
        <RecipeBoard
          onNavigate={handleNavigate}
          onRecipeClick={handleRecipeClick}
          isLoggedIn={isLoggedIn}
          onOpenAuth={handleOpenAuthForFeature}
        />
      )}

      {currentPage === 'followers' && isLoggedIn && (
        <FollowList
          onNavigate={handleNavigate}
          type="followers"
          onUserClick={handleUserClick}
        />
      )}

      {currentPage === 'following' && isLoggedIn && (
        <FollowList
          onNavigate={handleNavigate}
          type="following"
          onUserClick={handleUserClick}
        />
      )}

      {currentPage === 'otherProfile' && otherUserName && (
        <OtherUserProfile
          userName={otherUserName}
          onNavigate={handleNavigate}
          onRecipeClick={handleRecipeClick}
        />
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
