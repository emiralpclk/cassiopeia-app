import { Routes, Route } from 'react-router-dom';
import { useAppState } from './context/AppContext';
import BottomNav from './components/BottomNav';
import ApiKeyModal from './components/ApiKeyModal';
import OnboardingFlow from './components/OnboardingFlow';
import OracleLoading from './components/OracleLoading';
import WelcomeScreen from './components/WelcomeScreen';
import HomePage from './pages/HomePage';
import FortunesPage from './pages/FortunesPage';
import CoffeeFortunePage from './pages/CoffeeFortunePage';
import TarotPage from './pages/Tarot/TarotPage';
import HistoryPage from './pages/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage';
import DiscoverPage from './pages/DiscoverPage';
import ProfilePage from './pages/ProfilePage';

export default function AppContent() {
  const { showOnboarding, showApiKeyModal, showWelcome, error, isHydrating, isTestMode } = useAppState();

  if (showWelcome || isHydrating) {
    return <WelcomeScreen />;
  }

  if (error && !showApiKeyModal && !showOnboarding) {
    const errorMsg = typeof error === 'string' ? error : (error?.message || 'Bilinmeyen bir sistem hatası oluştu.');
    return (
      <div className="critical-error" style={{ padding: '40px', textAlign: 'center', background: 'var(--bg)', color: 'var(--text-primary)', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sistem Hatası</h2>
        <p style={{ margin: '20px 0', color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: '1.6' }}>{errorMsg}</p>
        <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', background: 'var(--accent-gradient)', border: 'none', borderRadius: '12px', color: 'var(--bg)', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s' }}>Yeniden Dene</button>
      </div>
    );
  }

  const showMainContent = !showApiKeyModal && !showOnboarding;

  return (
    <div className="app-shell">
      <ApiKeyModal />
      {showOnboarding && (!showApiKeyModal || isTestMode) && <OnboardingFlow />}

      {showMainContent && (
        <>
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/fallar" element={<FortunesPage />} />
              <Route path="/fallar/kahve" element={<CoffeeFortunePage />} />
              <Route path="/fallar/tarot" element={<TarotPage />} />
              <Route path="/gecmis" element={<HistoryPage />} />
              <Route path="/gecmis/:index" element={<HistoryDetailPage />} />
              <Route path="/kesfet" element={<DiscoverPage />} />
              <Route path="/profil" element={<ProfilePage />} />
            </Routes>
          </main>
          <BottomNav />
        </>
      )}
    </div>
  );
}
