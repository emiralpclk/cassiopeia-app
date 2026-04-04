
# File: cassiopeia/eslint.config.js
```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])

```

# File: cassiopeia/index.html
```html
<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#0a0a0f" />
    <meta name="description" content="Cassiopeia — Türk kahvesi falı, tarot ve ruhsal danışmanlık" />
    <title>Cassiopeia</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

# File: cassiopeia/package.json
```json
{
  "name": "cassiopeia_temp",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.13.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.4",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^9.39.4",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "vite": "^8.0.1"
  }
}

```

# File: cassiopeia/src/App.jsx
```javascript
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import AppContent from './AppContent';
import './index.css';

export default function App() {
  return (
    <BrowserRouter basename="/cassiopeia-app">
      <AppProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </AppProvider>
    </BrowserRouter>
  );
}
```

# File: cassiopeia/src/AppContent.jsx
```javascript
import { Routes, Route } from 'react-router-dom';
import { useAppState } from './context/AppContext';
import BottomNav from './components/BottomNav';
import ApiKeyModal from './components/ApiKeyModal';
import OnboardingFlow from './components/OnboardingFlow';
import HomePage from './pages/HomePage';
import FortunesPage from './pages/FortunesPage';
import CoffeeFortunePage from './pages/CoffeeFortunePage';
import TarotPage from './pages/Tarot/TarotPage';
import HistoryPage from './pages/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage';
import DiscoverPage from './pages/DiscoverPage';
import ProfilePage from './pages/ProfilePage';

export default function AppContent() {
  const { showOnboarding, showApiKeyModal, error } = useAppState();

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

  return (
    <div className="app-shell">
      <ApiKeyModal />
      {showOnboarding && !showApiKeyModal && <OnboardingFlow />}

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
    </div>
  );
}

```

# File: cassiopeia/src/components/ApiKeyModal.jsx
```javascript
import { useState } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';

function ApiKeyModal() {
  const { showApiKeyModal, apiKey } = useAppState();
  const dispatch = useAppDispatch();
  const [tempKey, setTempKey] = useState(apiKey || '');
  if (!showApiKeyModal) return null;
  const handleSave = () => { dispatch({ type: 'SET_API_KEY', payload: tempKey.trim() }); };
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">API Ayarları</h2>
        <input type="password" value={tempKey} onChange={(e) => setTempKey(e.target.value)} placeholder="OLLAMA veya API Key" className="modal-input" />
        <button className="modal-button" onClick={handleSave}>Kaydet</button>
        <button className="modal-link" onClick={() => dispatch({ type: 'SHOW_API_KEY_MODAL', payload: false })}>Kapat</button>
      </div>
    </div>
  );
}
export default ApiKeyModal;
```

# File: cassiopeia/src/components/BottomNav.jsx
```javascript
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', icon: 'home', label: 'Ana Sayfa' },
  { path: '/fallar', icon: 'flare', label: 'Fallar' },
  { path: '/gecmis', icon: 'history', label: 'Geçmiş' },
  { path: '/kesfet', icon: 'explore', label: 'Keşfet' },
  { path: '/profil', icon: 'person', label: 'Profil' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
```

# File: cassiopeia/src/components/ErrorBoundary.jsx
```javascript
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Kozmik Hata Yakalandı:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="critical-error" style={{ 
          padding: '40px', 
          textAlign: 'center', 
          background: 'var(--bg)', 
          color: 'var(--text-primary)', 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <h2 style={{ 
            fontSize: '2rem', 
            marginBottom: '16px', 
            background: 'var(--accent-gradient)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>Kozmik Hata</h2>
          <p style={{ 
            margin: '20px 0', 
            color: 'var(--text-secondary)', 
            maxWidth: '400px', 
            lineHeight: '1.6' 
          }}>
            Bağlantıda bir kopukluk veya sistemde sinsi bir sızıntı var. Verilerini korumak için sistemi sarsılmaz bi' şekilde beklemeye aldık.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => window.location.reload()} 
              style={{ 
                padding: '12px 24px', 
                background: 'var(--accent-gradient)', 
                border: 'none', 
                borderRadius: '12px', 
                color: 'var(--bg)', 
                fontWeight: 'bold', 
                cursor: 'pointer' 
              }}
            >
              Yeniden Dene
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

```

# File: cassiopeia/src/components/ImageModal.jsx
```javascript
import { useEffect } from 'react';

export default function ImageModal({ src, onClose }) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!src) return null;

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt="Zoomed" className="zoomed-image" />
        <button className="modal-close-btn" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  );
}

```

# File: cassiopeia/src/components/OnboardingFlow.jsx
```javascript
import { useState } from 'react';
import { useAppDispatch } from '../context/AppContext';
import { ZODIAC_SIGNS, AGE_RANGES, RELATIONSHIP_STATUSES } from '../utils/constants';

function OnboardingFlow() {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(1);
  const [zodiac, setZodiac] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');

  const handleComplete = () => {
    dispatch({
      type: 'SET_USER',
      payload: { zodiac, ageRange, relationshipStatus, onboarded: true },
    });
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-container">
        <div className="onboarding-progress">
          <div className={`progress-dot ${step >= 1 ? 'active' : ''}`}></div>
          <div className={`progress-dot ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-dot ${step >= 3 ? 'active' : ''}`}></div>
        </div>

        {step === 1 && (
          <div className="onboarding-step">
            <h2 className="onboarding-title">Burcunu Seç ✨</h2>
            <p className="onboarding-subtitle">Cassiopeia seni daha iyi tanısın</p>
            <div className="zodiac-grid">
              {ZODIAC_SIGNS.map((z) => (
                <button
                  key={z.id}
                  className={`zodiac-card ${zodiac === z.id ? 'selected' : ''}`}
                  onClick={() => { setZodiac(z.id); setTimeout(() => setStep(2), 300); }}
                >
                  <span className="zodiac-emoji">{z.emoji}</span>
                  <span className="zodiac-name">{z.name}</span>
                  <span className="zodiac-date">{z.date}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step">
            <h2 className="onboarding-title">Yaş Aralığın? 🕯️</h2>
            <p className="onboarding-subtitle">Enerjin hangi evrede?</p>
            <div className="age-grid">
              {AGE_RANGES.map((opt) => (
                <button
                  key={opt.id}
                  className={`age-card ${ageRange === opt.id ? 'selected' : ''}`}
                  onClick={() => { setAgeRange(opt.id); setTimeout(() => setStep(3), 300); }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button className="modal-link" onClick={() => setStep(1)}>Geri Dön</button>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-step">
            <h2 className="onboarding-title">İlişki Durumun? 💕</h2>
            <p className="onboarding-subtitle">Kalbinin ritmi nasıl?</p>
            <div className="relationship-grid">
              {RELATIONSHIP_STATUSES.map((opt) => (
                <button
                  key={opt.id}
                  className={`relationship-card ${relationshipStatus === opt.id ? 'selected' : ''}`}
                  onClick={() => setRelationshipStatus(opt.id)}
                >
                  <span className="relationship-emoji">{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
            <button
              className="onboarding-next"
              disabled={!relationshipStatus}
              onClick={handleComplete}
            >
              Cassiopeia'ya Katıl
            </button>
            <div style={{marginTop: '16px'}}>
              <button className="modal-link" onClick={() => setStep(2)}>Geri Dön</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OnboardingFlow;
```

# File: cassiopeia/src/components/OracleLoading.jsx
```javascript
import { useState, useEffect } from 'react';

const MESSAGES = [
  'Telveler fısıldamaya başladı...',
  'Yıldızlar senin enerjinle buluşuyor...',
  'Semboller derinlerde şekilleniyor...',
  'Cassiopeia ruhunun haritasını okuyor...',
  'Geçmişin izleri gün yüzüne çıkıyor...',
  'Geleceğin kapıları aralanıyor, az kaldı...'
];

const OracleLoading = ({ message }) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); 
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % MESSAGES.length);
        setFade(true); 
      }, 500); 
    }, 3500); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-oracle">
      <div className="loading-orb">
        <div className="orb-ring ring-1"></div>
        <div className="orb-ring ring-2"></div>
        <div className="orb-ring ring-3"></div>
        <div className="orb-core">
          <span className="material-symbols-outlined">flare</span>
        </div>
      </div>
      <p className="loading-text" style={{ 
        opacity: fade ? 1 : 0, 
        transition: 'opacity 0.5s ease',
        textAlign: 'center',
        marginTop: '20px'
      }}>
        {message || MESSAGES[index]}
      </p>
    </div>
  );
};

export default OracleLoading;
```

# File: cassiopeia/src/components/TabBar.jsx
```javascript
import { useState } from 'react';

export default function TabBar({ tabs, activeTab, onTabChange }) {
  return (
    <div className="tab-bar">
      <div className="tab-bar-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

# File: cassiopeia/src/context/AppContext.jsx
```javascript
import { createContext, useContext, useReducer, useEffect } from 'react';
import { getApiKey, getUserProfile, getHistory, setApiKey as saveApiKey, setUserProfile, addToHistory as saveToHistory, saveCurrentFortune, getCurrentFortune, clearCurrentFortune } from '../services/storage';

const AppContext = createContext(null);
const AppDispatchContext = createContext(null);

const initialState = {
  apiKey: '',
  user: null, 
  currentFortune: {
    step: 'intent',
    intent: '',
    images: [], 
    coffeeResult: null,
    tabData: {}, // Detailed results cache
    selectedTarotCards: [],
    tarotIntent: '',
    ritualProgress: 0,
    synthesisResult: null,
  },
  history: [],
  showApiKeyModal: false,
  showOnboarding: false, // Will be set to true in mount effect if user is null
  isLoading: false,
  error: null,
};

function appReducer(state, action) {
  if (!state) return initialState;

  switch (action.type) {
    case 'RESTORE_FORTUNE':
      if (!action.payload) return state;
      return { 
        ...state, 
        currentFortune: { 
          ...initialState.currentFortune, 
          ...action.payload,
          // Ensure we don't restore stuck loading states
          step: action.payload.step || 'intent' 
        } 
      };

    case 'SET_API_KEY':
      saveApiKey(action.payload);
      return { ...state, apiKey: action.payload, showApiKeyModal: false };

    case 'SET_USER':
      setUserProfile(action.payload);
      return { ...state, user: action.payload, showOnboarding: false };

    case 'TOGGLE_API_KEY_MODAL':
      return { ...state, showApiKeyModal: !state.showApiKeyModal };

    case 'SHOW_API_KEY_MODAL':
      return { ...state, showApiKeyModal: action.payload };

    case 'SHOW_ONBOARDING':
      return { ...state, showOnboarding: action.payload };

    case 'SET_INTENT':
      return { 
        ...state, 
        currentFortune: { 
          ...state.currentFortune, 
          intent: action.payload, 
          step: 'upload' 
        } 
      };

    case 'SET_IMAGES':
      return { 
        ...state, 
        currentFortune: { 
          ...state.currentFortune, 
          images: action.payload, 
          step: 'analyzing' 
        } 
      };

    case 'SET_COFFEE_RESULT':
      return { 
        ...state, 
        currentFortune: { 
          ...state.currentFortune, 
          coffeeResult: action.payload, 
          step: 'results' 
        }, 
        isLoading: false 
      };

    case 'SET_TAROT_INTENT':
      return { 
        ...state, 
        currentFortune: { 
          ...state.currentFortune, 
          tarotIntent: action.payload, 
          step: 'ritual' 
        } 
      };

    case 'SET_TAROT_STEP':
      return { 
        ...state, 
        currentFortune: { ...state.currentFortune, step: action.payload } 
      };

    case 'SET_TAROT_RITUAL_PROGRESS':
      return { 
        ...state, 
        currentFortune: { ...state.currentFortune, ritualProgress: action.payload } 
      };

    case 'SET_TAROT_CARDS':
      return { 
        ...state, 
        currentFortune: { 
          ...state.currentFortune, 
          selectedTarotCards: action.payload, 
          step: 'results' 
        } 
      };

    case 'SET_TAB_DATA':
      return { 
        ...state, 
        currentFortune: { 
          ...state.currentFortune, 
          tabData: { ...state.currentFortune.tabData, ...action.payload } 
        } 
      };

    case 'GO_TO_BRIDGE':
      return { 
        ...state, 
        currentFortune: { ...state.currentFortune, step: 'bridge' } 
      };

    case 'GO_BACK_TO_RESULTS':
      return { 
        ...state, 
        currentFortune: { ...state.currentFortune, step: 'results' } 
      };

    case 'SET_TAROT_SYNTHESIS_CARDS':
      return { 
        ...state, 
        currentFortune: { 
          ...state.currentFortune, 
          selectedTarotCards: action.payload, 
          step: 'synthesis' 
        } 
      };

    case 'SET_SYNTHESIS_RESULT':
      return { 
        ...state, 
        currentFortune: { ...state.currentFortune, synthesisResult: action.payload }, 
        isLoading: false 
      };

    case 'RESET_FORTUNE':
      clearCurrentFortune();
      return { 
        ...state, 
        currentFortune: { ...initialState.currentFortune }, 
        isLoading: false, 
        error: null 
      };

    case 'SET_HISTORY':
      return { ...state, history: action.payload || [] };

    case 'SET_LOADING':
      return { ...state, isLoading: !!action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'SAVE_TO_HISTORY':
      const historyEntry = {
        type: 'coffee',
        intent: state.currentFortune.intent,
        images: state.currentFortune.images,
        coffeeResult: state.currentFortune.coffeeResult,
        tarotCards: state.currentFortune.selectedTarotCards,
        synthesisResult: state.currentFortune.synthesisResult,
        date: new Date().toISOString()
      };
      saveToHistory(historyEntry);
      return { ...state, history: getHistory() };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    try {
      const apiKey = getApiKey();
      const user = getUserProfile();
      const history = getHistory();
      const savedFortune = getCurrentFortune();
      
      if (apiKey) dispatch({ type: 'SET_API_KEY', payload: apiKey });
      if (user) dispatch({ type: 'SET_USER', payload: user });
      if (history && history.length) dispatch({ type: 'SET_HISTORY', payload: history });
      if (savedFortune) dispatch({ type: 'RESTORE_FORTUNE', payload: savedFortune });

      if (!apiKey) dispatch({ type: 'SHOW_API_KEY_MODAL', payload: true });
      if (!user) dispatch({ type: 'SHOW_ONBOARDING', payload: true });
    } catch (err) {
      console.error('Initial load error:', err);
    }
  }, []);

  // Persistence effect
  useEffect(() => {
    if (state && state.currentFortune) {
      const { step, intent } = state.currentFortune;
      if (step !== 'intent' || intent !== '') {
        saveCurrentFortune(state.currentFortune);
      }
    }
  }, [state.currentFortune]);

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    console.error('useAppState must be used within AppProvider');
    return initialState; // Fallback to avoid immediate crash
  }
  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (!context) {
    console.warn('useAppDispatch used outside provider');
    return () => {}; // Fallback no-op
  }
  return context;
}
```

# File: cassiopeia/src/index.css
```css
/* ============================================================
   CASSIOPEIA — Global Styles
   Premium dark theme, mobile-first
   ============================================================ */

/* Reset & Base */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg: #050508;
  --bg-card: #141720; /* Belirgin dark slate/blue */
  --bg-card-hover: #1b1f2c;
  --bg-elevated: #1e2230;
  --bg-input: #0b0c13;
  --border: rgba(255,255,255,0.1);
  --border-focus: rgba(226,232,240,0.3);
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #64748b;
  --accent: #e2e8f0; /* Ethereal Moonstone / Silver */
  --accent-soft: rgba(226,232,240,0.08);
  --accent-glow: rgba(226,232,240,0.2);
  --accent-gradient: linear-gradient(135deg, #cbd5e1 0%, #f8fafc 50%, #e2e8f0 100%);
  --gold: #f59e0b;
  --gold-glow: rgba(245,158,11,0.2);
  --positive: #10b981;
  --negative: #ef4444;
  --warning: #f59e0b;
  --radius: 20px;
  --radius-sm: 12px;
  --radius-xs: 8px;
  --nav-height: 72px;
  --font-body: 'Space Grotesk', -apple-system, sans-serif;
  --font-label: 'Inter', -apple-system, sans-serif;
}

/* Base Styles Update */
html, body {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  background: radial-gradient(circle at center, #0a0e17 0%, #050508 100%);
  color: var(--text-primary);
  overflow: hidden;
  position: relative;
}

body::before {
  content: "";
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3BaseFilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
  z-index: 9999;
}

/* Animations */
@keyframes breathing-aura {
  0% { box-shadow: 0 0 20px var(--accent-glow); transform: scale(1); }
  50% { box-shadow: 0 0 50px var(--accent-glow); transform: scale(1.02); }
  100% { box-shadow: 0 0 20px var(--accent-glow); transform: scale(1); }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 3D Card Flip */
.card-3d-container {
  perspective: 1000px;
  width: 100%;
  height: 150px;
  cursor: pointer;
}

.card-3d-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.card-3d-inner.flipped {
  transform: rotateY(180deg);
}

.card-3d-front, .card-3d-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}

.card-3d-front {
  background: var(--bg-card);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-3d-back {
  background: var(--bg-card);
  transform: rotateY(180deg);
  border: 2px solid var(--accent);
}

.card-3d-back img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Ritual Effects */
.ritual-active {
  animation: breathing-aura 2s infinite ease-in-out;
}

.glow-emerald {
  filter: drop-shadow(0 0 10px var(--accent));
}

#root {
  height: 100%;
}

/* Card Shuffling Animations */
@keyframes shuffle-left {
  0% { transform: rotate(-8deg) translateX(-25px); z-index: 1; }
  25% { transform: rotate(-20deg) translateX(-40px) translateY(-10px); z-index: 3; }
  50% { transform: rotate(10deg) translateX(15px); z-index: 2; }
  75% { transform: rotate(20deg) translateX(40px) translateY(10px); z-index: 1; }
  100% { transform: rotate(-8deg) translateX(-25px); z-index: 1; }
}

@keyframes shuffle-center {
  0% { transform: rotate(0deg) translateY(0); z-index: 2; }
  33% { transform: rotate(15deg) translateX(30px) translateY(-5px); z-index: 1; }
  66% { transform: rotate(-15deg) translateX(-30px) translateY(5px); z-index: 3; }
  100% { transform: rotate(0deg) translateY(0); z-index: 2; }
}

@keyframes shuffle-right {
  0% { transform: rotate(8deg) translateX(25px); z-index: 3; }
  25% { transform: rotate(20deg) translateX(40px) translateY(10px); z-index: 1; }
  50% { transform: rotate(-10deg) translateX(-15px); z-index: 2; }
  75% { transform: rotate(-20deg) translateX(-40px) translateY(-10px); z-index: 3; }
  100% { transform: rotate(8deg) translateX(25px); z-index: 3; }
}

/* ============================================================
   App Shell
   ============================================================ */
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 430px;
  margin: 0 auto;
  position: relative;
  background: var(--bg);
  overflow: hidden;
  box-shadow: 0 0 60px rgba(0,0,0,0.5);
}

.app-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: var(--nav-height);
  scroll-behavior: smooth;
}

.app-main::-webkit-scrollbar { width: 0; }

/* ============================================================
   Bottom Navigation
   ============================================================ */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(10,10,15,0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--border);
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom, 8px);
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  text-decoration: none;
  color: var(--text-muted);
  transition: color 0.2s;
}

.bottom-nav-item .material-symbols-outlined {
  font-size: 24px;
  transition: transform 0.2s;
}

.bottom-nav-item.active {
  color: var(--accent);
}

.bottom-nav-item.active .material-symbols-outlined {
  transform: scale(1.1);
}

.bottom-nav-label {
  font-family: var(--font-label);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

/* ============================================================
   Pages
   ============================================================ */
.page {
  padding: 24px 20px;
  min-height: 100%;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 4px;
}

/* ============================================================
   Home Page
   ============================================================ */
.home-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.home-greeting {
  display: flex;
  align-items: center;
  gap: 14px;
}

.greeting-emoji {
  font-size: 36px;
}

.greeting-text {
  color: var(--text-secondary);
  font-size: 14px;
}

.greeting-zodiac {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.home-date {
  color: var(--text-muted);
  font-size: 12px;
  font-family: var(--font-label);
  text-align: right;
  padding-top: 4px;
}

/* Quick Action */
.quick-action-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: var(--accent-gradient);
  border: none;
  border-radius: var(--radius);
  color: #0a0a0f;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
  transition: transform 0.15s, box-shadow 0.3s;
}

.quick-action-btn:active {
  transform: scale(0.98);
}

.quick-action-btn .arrow {
  margin-left: auto;
}

/* Home Cards */
.home-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  color: var(--text-secondary);
}

.card-header h3 {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.card-header .material-symbols-outlined {
  font-size: 20px;
  color: var(--accent);
}

.zodiac-mini-emoji {
  font-size: 20px;
}

/* Daily Card */
.daily-card-content {
  display: flex;
  gap: 16px;
}

.daily-card-image {
  width: 80px;
  height: 120px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--border);
}

.daily-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.7) brightness(0.9);
}

.daily-card-info {
  flex: 1;
  min-width: 0;
}

.daily-card-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.daily-card-meaning {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.daily-card-reading {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Horoscope */
.horoscope-text {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-secondary);
}

/* Energy */
.energy-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.energy-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.energy-label {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-label);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.energy-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent);
}

.energy-divider {
  width: 1px;
  height: 40px;
  background: var(--border);
}

/* Shimmer Loading */
.shimmer {
  background: linear-gradient(90deg, var(--bg-card) 25%, var(--bg-elevated) 50%, var(--bg-card) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-xs);
  color: transparent !important;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ============================================================
   Fortunes Page
   ============================================================ */
.fortune-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fortune-type-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  text-align: left;
  font-family: var(--font-body);
  color: var(--text-primary);
}

.fortune-type-card:active:not(.locked) {
  transform: scale(0.98);
  background: var(--bg-card-hover);
}

.fortune-type-card.locked {
  opacity: 0.45;
  cursor: default;
}

.fortune-type-emoji {
  font-size: 32px;
  flex-shrink: 0;
}

.fortune-type-info {
  flex: 1;
}

.fortune-type-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 2px;
}

.fortune-type-desc {
  font-size: 12px;
  color: var(--text-muted);
}

.fortune-type-badge {
  font-size: 10px;
  color: var(--text-muted);
  background: rgba(255,255,255,0.05);
  padding: 4px 10px;
  border-radius: 20px;
  font-family: var(--font-label);
  white-space: nowrap;
}

.fortune-arrow {
  color: var(--text-muted);
}

/* ============================================================
   Coffee Fortune Steps
   ============================================================ */
.coffee-page {
  padding-top: 0;
}

.fortune-progress {
  height: 3px;
  background: var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}

.fortune-progress-fill {
  height: 100%;
  background: var(--accent-gradient);
  transition: width 0.5s ease;
  border-radius: 0 2px 2px 0;
}

.fortune-step {
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - var(--nav-height) - 3px);
}

.step-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--accent-glow);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.step-icon .material-symbols-outlined {
  font-size: 28px;
  color: var(--accent);
}

.step-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
}

.step-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
  text-align: center;
  max-width: 300px;
  line-height: 1.5;
  margin-bottom: 32px;
}

.step-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: var(--accent-gradient);
  border: none;
  border-radius: var(--radius);
  color: #0a0a0f;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.2s;
  margin-top: 24px;
}

.step-button:active {
  transform: scale(0.97);
}

.step-button:disabled {
  opacity: 0.4;
  cursor: default;
}

.step-button.secondary {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.step-error {
  color: var(--negative);
  font-size: 13px;
  margin-top: 12px;
}

/* Intent Step */
.intent-form {
  width: 100%;
  max-width: 380px;
}

.intent-input {
  width: 100%;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
  transition: border-color 0.3s;
}

.intent-input:focus {
  border-color: var(--border-focus);
}

.intent-input::placeholder {
  color: var(--text-muted);
}

.intent-counter {
  display: block;
  text-align: right;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 6px;
  font-family: var(--font-label);
}

.intent-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
  justify-content: center;
}

.intent-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 30px;
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.intent-chip:active {
  transform: scale(0.95);
}

.intent-chip.active {
  background: var(--accent-glow);
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: 0 0 15px var(--accent-glow);
}

.intent-emoji {
  font-size: 16px;
}

.intent-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

/* Upload Step */
.upload-zone {
  width: 100%;
  max-width: 320px;
  aspect-ratio: 1;
  border: 2px dashed rgba(140,160,220,0.2);
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: border-color 0.3s, background 0.3s;
}

.upload-zone:active {
  border-color: var(--accent);
  background: var(--accent-glow);
}

.upload-icon {
  font-size: 48px;
  color: var(--text-muted);
}

.upload-text {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary);
}

.upload-hint {
  font-size: 12px;
  color: var(--text-muted);
}

.upload-images-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
  max-width: 380px;
  margin-bottom: 24px;
}

.preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border);
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.preview-remove .material-symbols-outlined {
  font-size: 16px;
}

.upload-add-more {
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  border: 2px dashed var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.upload-add-more:active {
  background: var(--bg-card);
  border-color: var(--accent);
}

.upload-compressing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.upload-preview-container {
  width: 100%;
  max-width: 320px;
  position: relative;
}

.upload-preview {
  width: 100%;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.upload-change {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(10,10,15,0.8);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border);
  border-radius: 20px;
  color: var(--text-secondary);
  font-size: 12px;
  font-family: var(--font-body);
  cursor: pointer;
}

.upload-change .material-symbols-outlined {
  font-size: 14px;
}

/* Analyzing Step */
.analyzing-step {
  justify-content: center;
}

.celestial-scene {
  width: 280px;
  height: 280px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  background: radial-gradient(circle at center, #0c120c 0%, #050705 100%);
  box-shadow: 0 0 40px rgba(112, 138, 110, 0.2);
  margin-bottom: 40px;
}

.crescent-moon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  box-shadow: 12px 12px 0 0 var(--accent);
  transform: rotate(-15deg);
  position: absolute;
  top: 15%;
  left: 15%;
  filter: drop-shadow(0 0 15px var(--accent-glow));
  animation: crescentBreath 4s ease-in-out infinite;
}


.shooting-star-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.shooting-star {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), transparent);
  border-radius: 2px;
  filter: drop-shadow(0 0 5px var(--accent-glow));
  animation: starFlow linear infinite;
}

.shooting-star.with-trail::after {
  content: '';
  position: absolute;
  right: 0;
  width: 120px;
  height: 1px;
  background: linear-gradient(to left, rgba(112, 138, 110, 0.4), transparent);
  transform: translateX(100%);
}

@keyframes crescentBreath {
  0%, 100% { opacity: 0.8; transform: rotate(-15deg) scale(1); }
  50% { opacity: 1; transform: rotate(-15deg) scale(1.05); }
}

@keyframes starFlow {
  from { transform: translateX(350px); }
  to { transform: translateX(-350px); }
}

.shooting-star:nth-child(1) { top: 20%; width: 60px; animation-duration: 8s; animation-delay: 0s; }
.shooting-star:nth-child(2) { top: 50%; width: 80px; animation-duration: 12s; animation-delay: 2s; }
.shooting-star:nth-child(3) { top: 75%; width: 40px; animation-duration: 10s; animation-delay: 1s; }
.shooting-star:nth-child(4) { top: 35%; width: 100px; animation-duration: 15s; animation-delay: 4s; }
.shooting-star:nth-child(5) { top: 60%; width: 50px; animation-duration: 9s; animation-delay: 3s; }

/* Loading Oracle */
.loading-oracle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.loading-orb {
  width: 80px;
  height: 80px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orb-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid;
  animation: orbSpin linear infinite;
}

.ring-1 {
  width: 100%;
  height: 100%;
  border-color: rgba(112, 138, 110, 0.2);
  animation-duration: 3s;
}

.ring-2 {
  width: 75%;
  height: 75%;
  border-color: rgba(170, 158, 100, 0.2);
  animation-duration: 2s;
  animation-direction: reverse;
}

.ring-3 {
  width: 50%;
  height: 50%;
  border-color: rgba(75, 83, 32, 0.2);
  animation-duration: 1.5s;
}

@keyframes orbSpin {
  to { transform: rotate(360deg); }
}

.orb-core {
  color: var(--accent);
  animation: orbPulse 2s ease-in-out infinite;
}

@keyframes orbPulse {
  0%, 100% { opacity: 0.5; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
}

.loading-text {
  color: var(--text-secondary);
  font-size: 14px;
  animation: textPulse 2s ease-in-out infinite;
}

@keyframes textPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* ============================================================
   Results Page
   ============================================================ */
.results-step {
  padding: 0 0 120px 0;
  align-items: stretch;
  min-height: auto;
}

.result-image-strip {
  height: 160px;
  overflow: hidden;
  position: relative;
}

.result-image-strip.multi {
  display: flex;
  overflow-x: auto;
  gap: 2px;
  scroll-snap-type: x mandatory;
}

.strip-image-container {
  flex: 0 0 100%;
  height: 100%;
  scroll-snap-align: start;
}

.strip-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.5) saturate(0.6);
}

.result-image-strip::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to top, var(--bg), transparent);
  pointer-events: none;
  z-index: 1;
}

.result-summary {
  margin: 24px 20px;
  padding: 20px;
  background: var(--accent-glow);
  border-left: 4px solid var(--accent);
  border-radius: 0 var(--radius) var(--radius) 0;
  position: relative;
}

.summary-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 10px;
}

.summary-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
  font-style: italic;
}

/* Tab Bar */
.tab-bar {
  padding: 0 16px;
  margin: -8px 0 0 0;
  position: relative;
  z-index: 2;
}

.tab-bar-inner {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}

.tab-bar-inner::-webkit-scrollbar { display: none; }

.tab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-item.active {
  background: var(--accent-glow);
  border-color: rgba(112, 138, 110, 0.3);
  color: var(--accent);
}

.tab-icon {
  font-size: 14px;
}

/* Result Content */
.result-content {
  padding: 24px 20px;
  min-height: 200px;
}

.result-text {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
  white-space: pre-wrap;
}

.result-text.faded {
  color: var(--text-muted);
  text-align: center;
  padding: 40px 0;
}

/* Symbols List */
.symbols-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.symbol-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
}

.symbol-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.symbol-badge {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.symbol-badge.positive { background: rgba(124,201,160,0.15); color: var(--positive); }
.symbol-badge.negative { background: rgba(220,140,140,0.15); color: var(--negative); }
.symbol-badge.neutral { background: rgba(112, 138, 110, 0.15); color: var(--accent); }

.symbol-location {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-label);
}

.symbol-meaning {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.symbol-relations {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.relations-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.relation-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}

.relation-symbols {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
}

.relation-meaning {
  font-size: 12px;
  color: var(--text-secondary);
}

/* Q&A Section */
.qa-section {
  padding: 20px;
  border-top: 1px solid var(--border);
  margin-top: 12px;
}

.qa-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}

.qa-message {
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  margin-bottom: 8px;
  font-size: 13px;
  line-height: 1.6;
}

.qa-message.user {
  background: rgba(112, 138, 110, 0.1);
  color: var(--accent);
  margin-left: 40px;
  text-align: right;
}

.qa-message.cassiopeia {
  background: var(--bg-card);
  color: var(--text-secondary);
  margin-right: 40px;
}

.qa-loading {
  color: var(--text-muted);
  font-size: 13px;
  animation: textPulse 2s ease-in-out infinite;
  padding: 8px 0;
}

.qa-form {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.qa-input {
  flex: 1;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 10px 16px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 13px;
  outline: none;
}

.qa-input:focus {
  border-color: var(--border-focus);
}

.qa-send {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent-gradient);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #0a0a0f;
  flex-shrink: 0;
}

.qa-send:disabled {
  opacity: 0.3;
}

.qa-send .material-symbols-outlined {
  font-size: 18px;
}

/* Results Refactor Styles */
.overview-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeIn 0.4s ease-out;
}

.mini-loader {
  text-align: center;
  padding: 20px;
  color: var(--text-muted);
  font-size: 13px;
  font-style: italic;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
  margin: 10px 0;
}

.details-vertical-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: slideUp 0.4s ease-out;
}

.detail-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  transition: transform 0.2s;
}

.detail-card h3 {
  font-size: 15px;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-card p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Tarot Tab Styles */
.tarot-cta-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
  background: rgba(112, 138, 110, 0.05);
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  animation: fadeIn 0.5s ease-out;
}

.tarot-cta-icon {
  font-size: 48px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 10px var(--accent-glow));
}

.tarot-cta-container h3 {
  font-size: 18px;
  margin-bottom: 12px;
}

.tarot-cta-container p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 24px;
}

.synthesis-tab-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: slideUp 0.4s ease-out;
}

.synthesis-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--accent-glow);
  color: var(--accent);
  border: 1px solid var(--border-focus);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  align-self: flex-start;
}

.synthesis-restart-mini {
  margin-top: 10px;
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  align-self: center;
}

.synthesis-restart-mini:active {
  background: var(--bg-card);
  border-color: var(--accent);
}

/* Synthesis CTA */
.synthesis-cta {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  margin: 20px;
  background: linear-gradient(135deg, rgba(112, 138, 110, 0.1), rgba(170, 158, 100, 0.1));
  border: 1px solid rgba(112, 138, 110, 0.2);
  border-radius: var(--radius);
  cursor: pointer;
  text-align: left;
  font-family: var(--font-body);
  color: var(--text-primary);
  transition: transform 0.15s, background 0.3s;
}

.synthesis-cta:active {
  transform: scale(0.98);
}

.synthesis-cta strong {
  display: block;
  font-size: 14px;
  margin-bottom: 2px;
}

.synthesis-cta p {
  font-size: 12px;
  color: var(--text-muted);
}

.synthesis-cta .material-symbols-outlined:first-child {
  color: var(--accent);
  font-size: 28px;
}

.synthesis-cta .material-symbols-outlined:last-child {
  margin-left: auto;
  color: var(--text-muted);
}

.finish-fortune-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: calc(100% - 40px);
  padding: 16px;
  margin: 0 20px 40px;
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.finish-fortune-btn:active {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--text-muted);
  color: var(--text-primary);
}

/* ============================================================
   Tarot Bridge
   ============================================================ */
.bridge-step {
  padding-top: 20px;
}

.bridge-header {
  text-align: center;
  margin-bottom: 24px;
}

.bridge-header .material-symbols-outlined {
  font-size: 32px;
  color: var(--accent);
  margin-bottom: 12px;
}

.selected-cards-display {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 32px;
  width: 100%;
}

.selected-card-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.slot-label {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-label);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.slot-card {
  width: 80px;
  height: 120px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s;
}

.slot-card.empty {
  background: var(--bg-card);
}

.slot-card.empty .material-symbols-outlined {
  color: var(--text-muted);
  font-size: 28px;
}

.slot-card.revealed {
  border-color: rgba(140,160,220,0.3);
  box-shadow: 0 0 20px var(--accent-glow);
}

.slot-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slot-card-name {
  font-size: 10px;
  color: var(--text-secondary);
  text-align: center;
  max-width: 80px;
}

.bridge-instruction {
  color: var(--text-secondary);
  font-size: 13px;
  text-align: center;
  margin-bottom: 20px;
}

/* Tarot Spread Grid */
.tarot-spread {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 400px;
  padding: 0 10px;
  margin: 0 auto;
}

.tarot-card-back {
  aspect-ratio: 2/3;
  border-radius: var(--radius-sm);
  cursor: pointer;
  position: relative;
  perspective: 600px;
  border: none;
  background: none;
  padding: 0;
}

.card-back-face,
.card-front-face {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-sm);
  backface-visibility: hidden;
  transition: transform 0.6s;
  overflow: hidden;
}

.card-back-face {
  background: linear-gradient(135deg, #0c120c, #1a241a);
  border: 1px solid rgba(112, 138, 110, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-back-pattern {
  color: rgba(112, 138, 110, 0.2);
  font-size: 24px;
}

.card-front-face {
  transform: rotateY(180deg);
  border: 1px solid rgba(112, 138, 110, 0.3);
}

.card-front-face img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tarot-card-back.flipped .card-back-face {
  transform: rotateY(180deg);
}

.tarot-card-back.flipped .card-front-face {
  transform: rotateY(0deg);
}

.tarot-card-back:disabled {
  opacity: 0.5;
  cursor: default;
}

.tarot-card-back:not(:disabled):active .card-back-face {
  background: linear-gradient(135deg, #1a241a, #2a3a2a);
}

/* ============================================================
   Synthesis Result
   ============================================================ */
.synthesis-header {
  text-align: center;
  margin-bottom: 24px;
}

.synthesis-header .material-symbols-outlined {
  font-size: 32px;
  color: var(--accent);
}

.synthesis-cards {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 28px;
}

.synthesis-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.synthesis-card img {
  width: 70px;
  height: 105px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(112, 138, 110, 0.2);
}

.synthesis-card-label {
  font-size: 10px;
  color: var(--text-muted);
  font-family: var(--font-label);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.synthesis-card-name {
  font-size: 11px;
  color: var(--text-secondary);
}

/* Mini Cards Layout (Unified Results) */
.synthesis-cards-mini {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  margin-bottom: 24px;
  animation: fadeIn 0.6s ease-out;
}

.mini-card {
  width: 50px;
  height: 75px;
  border-radius: var(--radius-xs);
  overflow: hidden;
  border: 1px solid rgba(140, 160, 220, 0.2);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: transform 0.3s;
}

.mini-card:hover {
  transform: translateY(-4px) scale(1.1);
  border-color: var(--accent);
}

.mini-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mini-card .material-symbols-outlined {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  font-size: 20px;
  background: var(--bg-card);
}

/* History Detail Page Styles */
.history-detail-page {
  padding-bottom: 80px;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
}

.history-tabs-container {
  display: flex;
  background: rgba(255,255,255,0.03);
  margin: 16px 20px;
  border-radius: var(--radius-sm);
  padding: 4px;
}

.history-tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 13px;
  font-family: var(--font-body);
  border-radius: var(--radius-xs);
  cursor: pointer;
  transition: all 0.3s;
}

.history-tab-btn.active {
  background: var(--bg-elevated);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  color: var(--text-primary);
}

.history-detail-content {
  padding: 0 20px;
}

.intent-box-mini {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--accent-glow);
  border: 1px solid var(--border-focus);
  border-radius: var(--radius);
  margin-bottom: 24px;
}

.intent-text-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.intent-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
  font-weight: 600;
  font-family: var(--font-label);
}

.intent-box-mini p {
  font-style: italic;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.empty-state-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 20px;
  gap: 12px;
  opacity: 0.8;
}

.empty-state-history .material-symbols-outlined {
  font-size: 40px;
  color: var(--text-muted);
}

.empty-state-history p {
  font-size: 14px;
  line-height: 1.6;
  max-width: 260px;
}

.small-hint {
  font-size: 12px;
  color: var(--accent);
  font-style: italic;
}

.section-header-mini {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 12px;
  font-family: var(--font-label);
}

.symbol-item-mini {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.symbol-name {
  font-weight: 600;
  color: var(--accent);
}

.symbol-meaning {
  font-size: 13px;
  color: var(--text-secondary);
  text-align: right;
  flex: 1;
  padding-left: 12px;
}

.divider-glow {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
  margin: 32px 0;
  opacity: 0.5;
}

.general-reading {
  animation: slideUp 0.6s ease-out;
}

.detail-card-glass {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  margin-bottom: 16px;
  animation: slideUp 0.4s ease-out;
}

.detail-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: var(--accent);
}

.detail-card-header h4 {
  font-size: 15px;
}

.synthesis-text-container {
  padding: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin: 0 4px;
}

.synthesis-text {
  font-size: 14px;
  line-height: 1.9;
  color: var(--text-secondary);
  white-space: pre-wrap;
}

.synthesis-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
  flex-wrap: wrap;
}

.saved-text {
  color: var(--positive);
  font-size: 14px;
  padding: 16px;
}

/* ============================================================
   History Page
   ============================================================ */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
}

.empty-state p {
  color: var(--text-secondary);
  font-size: 14px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.history-item-image {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--border);
}

.history-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
}

.history-placeholder {
  width: 100%;
  height: 100%;
  background: var(--bg-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.history-item-info {
  flex: 1;
  min-width: 0;
}

.history-type {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-label);
}

.history-intent {
  font-size: 13px;
  color: var(--text-primary);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-date {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-label);
  margin-top: 2px;
}

.history-tarot-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--accent-glow);
  border-radius: 12px;
  font-size: 10px;
  color: var(--accent);
  font-family: var(--font-label);
  white-space: nowrap;
}

.history-tarot-badge .material-symbols-outlined {
  font-size: 14px;
}

/* ============================================================
   Discover Page
   ============================================================ */
.discover-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.discover-card {
  padding: 24px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  text-align: center;
  position: relative;
}

.discover-card.locked {
  opacity: 0.4;
}

.discover-icon {
  font-size: 32px;
  color: var(--accent);
  margin-bottom: 12px;
}

.discover-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}

.discover-desc {
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.4;
}

.discover-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 9px;
  color: var(--text-muted);
  background: rgba(255,255,255,0.05);
  padding: 2px 8px;
  border-radius: 10px;
  font-family: var(--font-label);
}

/* ============================================================
   Profile Page
   ============================================================ */
.profile-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 24px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 20px;
}

.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--accent-glow);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-emoji {
  font-size: 28px;
}

.profile-zodiac {
  font-size: 20px;
  font-weight: 700;
}

.profile-details {
  display: flex;
  gap: 8px;
  align-items: center;
  color: var(--text-secondary);
  font-size: 13px;
  margin-top: 2px;
}

.profile-divider {
  color: var(--text-muted);
}

.profile-stats {
  display: flex;
  gap: 0;
  margin-bottom: 24px;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
}

.stat-item:first-child {
  border-radius: var(--radius) 0 0 var(--radius);
  border-right: none;
}

.stat-item:last-child {
  border-radius: 0 var(--radius) var(--radius) 0;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--accent);
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-label);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.profile-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: var(--font-label);
  margin-bottom: 12px;
}

.settings-item {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 8px;
}

.settings-item .material-symbols-outlined:first-child {
  color: var(--text-secondary);
}

.settings-item .material-symbols-outlined:last-child {
  margin-left: auto;
  color: var(--text-muted);
}

.api-key-edit {
  display: flex;
  gap: 8px;
  padding: 0 16px 16px;
}

.settings-input {
  flex: 1;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  padding: 10px 14px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 13px;
  outline: none;
}

.settings-input:focus {
  border-color: var(--border-focus);
}

.settings-save {
  padding: 10px 16px;
  background: var(--accent);
  border: none;
  border-radius: var(--radius-xs);
  color: #0a0a0f;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.profile-footer {
  text-align: center;
  padding: 32px 0;
  color: var(--text-muted);
  font-size: 12px;
}

.profile-footer p {
  margin-bottom: 4px;
}

/* ============================================================
   Modal Overlay
   ============================================================ */
.modal-overlay, .onboarding-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-container {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px 24px;
  width: 100%;
  max-width: 380px;
  text-align: center;
}

.modal-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--accent-glow);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.modal-icon .material-symbols-outlined {
  font-size: 24px;
  color: var(--accent);
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.modal-subtitle {
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 24px;
  line-height: 1.5;
}

.modal-input {
  width: 100%;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 14px;
  outline: none;
  margin-bottom: 12px;
}

.modal-input:focus {
  border-color: var(--border-focus);
}

.modal-link {
  display: block;
  color: var(--accent);
  font-size: 12px;
  margin-bottom: 20px;
  text-decoration: none;
}

.modal-button {
  width: 100%;
  padding: 14px;
  background: var(--accent-gradient);
  border: none;
  border-radius: var(--radius-sm);
  color: #0a0a0f;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.modal-button:disabled {
  opacity: 0.4;
}

/* ============================================================
   Onboarding
   ============================================================ */
.onboarding-container {
  width: 100%;
  max-width: 400px;
  padding: 32px 24px;
}

.onboarding-progress {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  transition: background 0.3s;
}

.progress-dot.active {
  background: var(--accent);
}

.onboarding-step {
  text-align: center;
}

.onboarding-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.onboarding-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 32px;
}

.zodiac-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 24px;
}

.zodiac-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 8px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-body);
  color: var(--text-primary);
}

.zodiac-card.selected {
  border-color: var(--accent);
  background: var(--accent-glow);
}

.zodiac-emoji {
  font-size: 24px;
}

.zodiac-name {
  font-size: 13px;
  font-weight: 500;
}

.zodiac-date {
  font-size: 9px;
  color: var(--text-muted);
  font-family: var(--font-label);
}

.age-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
}

.age-card {
  padding: 18px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  transition: all 0.2s;
}

.age-card.selected {
  border-color: var(--accent);
  background: var(--accent-glow);
}

.relationship-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.relationship-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-primary);
  transition: all 0.2s;
}

.relationship-card.selected {
  border-color: var(--accent);
  background: var(--accent-glow);
}

.relationship-emoji {
  font-size: 20px;
}

.onboarding-next {
  padding: 14px 48px;
  background: var(--accent-gradient);
  border: none;
  border-radius: var(--radius);
  color: #0a0a0f;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.onboarding-next:disabled {
  opacity: 0.3;
}

/* ============================================================
   Error Container
   ============================================================ */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 12px;
  min-height: calc(100vh - var(--nav-height));
}

.error-icon {
  font-size: 48px;
  color: var(--negative);
}

.error-container h3 {
  font-size: 18px;
}

.error-container p {
  color: var(--text-secondary);
  font-size: 14px;
  max-width: 300px;
}

/* ============================================================
   Image Zoom Modal (LightBox)
   ============================================================ */
.image-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  cursor: zoom-out;
  animation: fadeIn 0.3s ease-out;
  pointer-events: auto;
}

.image-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: modalScaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: default;
}

.zoomed-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: var(--radius);
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.6), 0 0 20px var(--accent-glow);
  pointer-events: auto;
}

.modal-close-btn {
  position: absolute;
  top: -50px;
  right: 0;
  background: none;
  border: none;
  color: white;
  opacity: 0.7;
  cursor: pointer;
  transition: opacity 0.2s;
}

.modal-close-btn:hover {
  opacity: 1;
}

@keyframes modalScaleUp {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

# File: cassiopeia/src/main.jsx
```javascript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

# File: cassiopeia/src/pages/CoffeeFortune/AnalyzingStep.jsx
```javascript
import { useEffect } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { callGemini } from '../../services/gemini';
import { buildCoffeeGeneralPrompt } from '../../utils/prompts';
import OracleLoading from '../../components/OracleLoading';

function AnalyzingStep() {
  const { currentFortune, apiKey, user } = useAppState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentFortune.images?.length > 0 && apiKey) {
      runAnalysis();
    }
  }, []);

  async function runAnalysis() {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const zodiacName = user?.zodiac || 'bilinmiyor';
      const ageRange = user?.ageRange || 'bilinmiyor';
      const relationship = user?.relationshipStatus || 'bilinmiyor';

      const prompt = buildCoffeeGeneralPrompt(
        currentFortune.intent,
        zodiacName,
        ageRange,
        relationship
      );

      const generalResult = await callGemini(apiKey, prompt, {
        images: currentFortune.images,
      });

      dispatch({
        type: 'SET_COFFEE_RESULT',
        payload: {
          general: generalResult,
          past: null,
          future: null,
          love: null,
          career: null,
          symbols: null,
        },
      });
    } catch (err) {
      console.error('Analiz hatası:', err);
      const isQuota = err.message?.includes('KOTA_LIMITI');
      dispatch({
        type: 'SET_ERROR',
        payload: isQuota 
          ? 'Gemini şu an çok yoğun. 15 saniye bekleyip tekrar dene abi.'
          : (err.message || 'Analiz sırasında bir hata oluştu'),
      });
    }
  }

  return (
    <div className="fortune-step analyzing-step">
      <div className="celestial-scene">
        <div className="shooting-star-container">
          <div className="shooting-star with-trail"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star with-trail"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star with-trail"></div>
        </div>
        <div className="crescent-moon"></div>
      </div>
      <OracleLoading />
    </div>
  );
}

export default AnalyzingStep;
```

# File: cassiopeia/src/pages/CoffeeFortune/IntentStep.jsx
```javascript
import { useState } from 'react';
import { useAppDispatch } from '../../context/AppContext';

export default function IntentStep() {
  const dispatch = useAppDispatch();
  const [intent, setIntent] = useState('');

  const PREDEFINED_INTENTS = [
    { id: 'general', label: 'Genel', emoji: '✨', text: 'Genel hayatıma, enerjime ve yakın geleceğime dair kapsamlı bir yorum istiyorum.' },
    { id: 'love', label: 'Aşk', emoji: '💕', text: 'Kalp meselelerime, ilişki durumuma ve aşk hayatımdaki gelişmelere odaklan.' },
    { id: 'career', label: 'İş & Kariyer', emoji: '💰', text: 'Kariyer yolculuğum, maddi beklentilerim ve iş hayatımdaki fırsatlara bak.' },
    { id: 'health', label: 'Sağlık', emoji: '🌿', text: 'Bedensel ve ruhsal sağlığım, huzurum ve enerjim hakkında rehberlik et.' },
    { id: 'question', label: 'Bir Sorum Var', emoji: '🤔', text: 'Aklımda spesifik bir soru var, fincanımda bunun cevabını ara.' },
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (intent.trim()) {
      dispatch({ type: 'SET_INTENT', payload: intent.trim() });
    }
  };

  const selectIntent = (item) => {
    setIntent(item.text);
    // Use a small timeout to let the user see the selection before moving forward
    setTimeout(() => {
      dispatch({ type: 'SET_INTENT', payload: item.text });
    }, 400);
  };

  return (
    <div className="fortune-step intent-step">
      <div className="step-icon">
        <span className="material-symbols-outlined">edit_note</span>
      </div>
      <h2 className="step-title">Niyetini Belirle</h2>
      <p className="step-subtitle">
        Aklındaki soruyu yazabilir veya aşağıdaki hazır niyetlerden birini seçebilirsin.
      </p>

      <div className="intent-grid">
        {PREDEFINED_INTENTS.map((item) => (
          <button 
            key={item.id} 
            className={`intent-chip ${intent === item.text ? 'active' : ''}`}
            onClick={() => selectIntent(item)}
          >
            <span className="intent-emoji">{item.emoji}</span>
            <span className="intent-label">{item.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="intent-form">
        <textarea
          className="intent-input"
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          placeholder="Niyetini buraya da detaylandırabilirsin..."
          rows={3}
          maxLength={500}
        />
        <div className="intent-footer">
          <span className="intent-counter">{intent.length}/500</span>
          <button type="submit" className="step-button" disabled={!intent.trim()}>
            Devam
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </form>
    </div>
  );
}
```

# File: cassiopeia/src/pages/CoffeeFortune/ResultsPage.jsx
```javascript
import { useState, useEffect } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { callGemini } from '../../services/gemini';
import {
  buildCombinedDetailsPrompt,
  buildCoffeeSymbolsPrompt,
} from '../../utils/prompts';
import TabBar from '../../components/TabBar';
import OracleLoading from '../../components/OracleLoading';
import ImageModal from '../../components/ImageModal';

function ResultsPage() {
  const { currentFortune, apiKey, user } = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [tabLoading, setTabLoading] = useState({});
  const [question, setQuestion] = useState('');
  const [qaMessages, setQaMessages] = useState([]);
  const [qaLoading, setQaLoading] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  // Auto-load overview (symbols) on mount
  useEffect(() => {
    handleTabChange('overview');
  }, []);

  const TABS = [
    { id: 'overview', label: 'Genel Bakış', icon: '☕' },
    { id: 'details', label: 'Detaylı Analiz', icon: '🔍' },
    { id: 'tarot', label: 'Tarot Sentezi', icon: '🃏' },
  ];

  const handleTabChange = async (tabId) => {
    setActiveTab(tabId);
    
    // Auto-load symbols for overview or combined details for details tab
    const needsLoading = (tabId === 'overview' && !currentFortune?.tabData?.symbols) || 
                         (tabId === 'details' && !currentFortune?.tabData?.details);
                         
    if (tabId === 'tarot') return; // Tarot specific logic is handled in render
    if (!apiKey || !needsLoading || tabLoading[tabId]) return;

    setTabLoading((prev) => ({ ...prev, [tabId]: true }));

    try {
      const zodiac = user?.zodiac || '';
      const relationship = user?.relationshipStatus || '';
      const intent = currentFortune?.intent || '';
      
      let result;
      if (tabId === 'overview') {
        result = await callGemini(apiKey, buildCoffeeSymbolsPrompt(), {
          images: currentFortune?.images,
          jsonMode: true,
        });
        dispatch({ type: 'SET_TAB_DATA', payload: { symbols: result } });
      } else {
        result = await callGemini(apiKey, buildCombinedDetailsPrompt(intent, zodiac, relationship), {
          images: currentFortune?.images,
          jsonMode: true,
        });
        dispatch({ type: 'SET_TAB_DATA', payload: { details: result } });
      }
    } catch (err) {
      console.error('Yorum yükleme hatası:', err);
    }

    setTabLoading((prev) => ({ ...prev, [tabId]: false }));
  };

  const handleQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim() || !apiKey) return;

    const q = question.trim();
    setQuestion('');
    setQaMessages((prev) => [...prev, { role: 'user', text: q }]);
    setQaLoading(true);

    try {
      const prompt = `Sen Cassiopeia'sın. Az önce bu kullanıcının kahve falına baktın. 
Genel yorum: "${currentFortune?.coffeeResult?.general?.substring(0, 300)}"
Kullanıcı soruyor: "${q}"
Kısa ve öz yanıt ver. Türkçe. Markdown kullanma.`;

      const answer = await callGemini(apiKey, prompt, {
        images: currentFortune?.images,
      });
      setQaMessages((prev) => [...prev, { role: 'cassiopeia', text: answer }]);
    } catch {
      setQaMessages((prev) => [...prev, { role: 'cassiopeia', text: 'Yanıt alınamadı.' }]);
    }
    setQaLoading(false);
  };

  if (!currentFortune?.coffeeResult) {
    return <OracleLoading message="Sonuçlar hazırlanıyor..." />;
  }

  const renderSymbols = (data) => {
    if (!data || typeof data !== 'object') return null;
    return (
      <div className="symbols-list">
        {Array.isArray(data?.semboller) && data.semboller.map((s, i) => (
          <div key={i} className="symbol-item">
            <div className="symbol-header">
              <span className={`symbol-badge ${s?.tipi === 'olumlu' ? 'positive' : s?.tipi === 'olumsuz' ? 'negative' : 'neutral'}`}>
                {s?.sembol || 'Belirsiz'}
              </span>
              <span className="symbol-location">{s?.konum || ''}</span>
            </div>
            <p className="symbol-meaning">{s?.anlam || ''}</p>
          </div>
        ))}

        {Array.isArray(data?.iliskiler) && data.iliskiler.length > 0 && (
          <div className="symbol-relations">
            <h4 className="relations-title">Sembol İlişkileri</h4>
            {data.iliskiler.map((r, i) => (
              <div key={i} className="relation-item">
                <span className="relation-symbols">
                  {Array.isArray(r?.semboller) ? r.semboller.join(' + ') : ''}
                </span>
                <span className="relation-meaning">{r?.anlam || ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    if (activeTab === 'overview') {
      const symbolsData = currentFortune?.tabData?.symbols;
      return (
        <div className="overview-container">
          {tabLoading.overview ? (
            <div className="mini-loader">Semboller okunuyor...</div>
          ) : (
            renderSymbols(symbolsData)
          )}
          <div className="divider"></div>
          <p className="result-text">{currentFortune?.coffeeResult?.general || 'Yorum bulunamadı.'}</p>
        </div>
      );
    }

    if (activeTab === 'details') {
      if (tabLoading.details) {
        return <OracleLoading message="Derin detaylara iniliyor..." />;
      }
      const d = currentFortune?.tabData?.details;
      if (!d) return <p className="result-text faded" style={{ textAlign: 'center' }}>Detayları yüklemek için bekleyin...</p>;

      return (
        <div className="details-vertical-list">
          <div className="detail-card">
            <h3>⏪ Geçmiş</h3>
            <p>{d.past}</p>
          </div>
          <div className="detail-card">
            <h3>⏩ Gelecek</h3>
            <p>{d.future}</p>
          </div>
          <div className="detail-card">
            <h3>💕 Aşk</h3>
            <p>{d.love}</p>
          </div>
          <div className="detail-card">
            <h3>💰 Kariyer & Para</h3>
            <p>{d.career}</p>
          </div>
        </div>
      );
    }

    if (activeTab === 'tarot') {
      const syn = currentFortune?.synthesisResult;
      
      if (!syn) {
        return (
          <div className="tarot-cta-container">
            <div className="tarot-cta-icon">🃏</div>
            <h3>Kaderini Mühürle</h3>
            <p>Kahve falındaki mesajları derinleştirmek ve 3 Tarot kartıyla büyük resmi görmek ister misin?</p>
            <button className="step-button" onClick={() => dispatch({ type: 'GO_TO_BRIDGE' })}>
              Falıma Tarot Ekle
            </button>
          </div>
        );
      }

      return (
        <div className="synthesis-tab-content">
          <div className="synthesis-badge">Kahin Sentezi</div>
          
          <div className="synthesis-cards-mini">
            {Array.isArray(currentFortune?.selectedTarotCards) && currentFortune.selectedTarotCards.map((card, i) => (
              <div key={i} className="mini-card" onClick={() => setZoomedImage(card.img)}>
                {card?.img ? (
                  <img src={card.img} alt={card?.nameTr || 'Kart'} />
                ) : (
                  <span className="material-symbols-outlined">style</span>
                )}
              </div>
            ))}
          </div>

          <p className="result-text">{syn}</p>
          <button className="synthesis-restart-mini" onClick={() => dispatch({ type: 'GO_TO_BRIDGE' })}>
            Kartları Tekrar Seç
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fortune-step results-step">
      {currentFortune?.images?.length > 0 && (
        <div className="result-image-strip multi">
          {currentFortune.images.map((img, idx) => (
            <div key={idx} className="strip-image-container" onClick={() => setZoomedImage(img.dataUrl)}>
              <img src={img.dataUrl} alt={`Fincan ${idx + 1}`} />
            </div>
          ))}
        </div>
      )}

      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="result-content">{renderTabContent()}</div>

      <div className="qa-section">
        <h4 className="qa-title">Soru Sor</h4>
        {qaMessages.map((msg, i) => (
          <div key={i} className={`qa-message ${msg.role}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {qaLoading && <p className="qa-loading">Cassiopeia düşünüyor...</p>}
        <form onSubmit={handleQuestion} className="qa-form">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Fala dair bir sorun var mı?"
            className="qa-input"
          />
          <button type="submit" className="qa-send" disabled={!question.trim() || qaLoading}>
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>

      <button className="synthesis-cta" onClick={() => handleTabChange('tarot')}>
        <span className="material-symbols-outlined">flare</span>
        <div>
          <strong>Sentez: Büyük Resmi Gör</strong>
          <p>{currentFortune?.synthesisResult ? 'Sentez sonucunu incele' : '3 Tarot kartı çekerek falını derinleştir'}</p>
        </div>
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>

      <button className="finish-fortune-btn" onClick={() => { dispatch({ type: 'SAVE_TO_HISTORY' }); dispatch({ type: 'RESET_FORTUNE' }); }}>
        <span className="material-symbols-outlined">done_all</span>
        Falı Kaydet ve Bitir
      </button>

      <ImageModal src={zoomedImage} onClose={() => setZoomedImage(null)} />
    </div>
  );
}

export default ResultsPage;
```

# File: cassiopeia/src/pages/CoffeeFortune/SynthesisResult.jsx
```javascript
import { useEffect, useState } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { callGemini } from '../../services/gemini';
import { buildTarotSynthesisPrompt } from '../../utils/prompts';
import OracleLoading from '../../components/OracleLoading';

function SynthesisResult() {
  const { currentFortune, apiKey, user } = useAppState();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Array.isArray(currentFortune?.selectedTarotCards) && currentFortune.selectedTarotCards.length === 3 && !currentFortune.synthesisResult) {
      runSynthesis();
    } else if (currentFortune?.synthesisResult) {
      setLoading(false);
    }
  }, []);

  async function runSynthesis() {
    if (!apiKey) return;
    setLoading(true);
    try {
      const prompt = buildTarotSynthesisPrompt(
        currentFortune?.coffeeResult?.general || '',
        currentFortune?.intent || '',
        user?.zodiac || '',
        user?.ageRange || '',
        user?.relationshipStatus || '',
        currentFortune?.selectedTarotCards?.[0] || null,
        currentFortune?.selectedTarotCards?.[1] || null,
        currentFortune?.selectedTarotCards?.[2] || null
      );

      if (!prompt) throw new Error('Sentez promptu hazırlanamadı.');

      const result = await callGemini(apiKey, prompt);
      dispatch({ type: 'SET_SYNTHESIS_RESULT', payload: result });
    } catch (err) {
      console.error('Sentez hatası:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Sentez oluşturulamadı.' });
    }
    setLoading(false);
  }

  if (loading && !currentFortune?.synthesisResult) {
    return <OracleLoading message="Cassiopeia yıldızları birleştiriyor..." />;
  }

  // Safety guard if still no result
  if (!currentFortune?.synthesisResult) {
    return (
      <div className="fortune-step synthesis-step">
        <p className="result-text faded" style={{ textAlign: 'center' }}>Sentez sonucu şu an hazır değil.</p>
      </div>
    );
  }

  return (
    <div className="fortune-step synthesis-step">
      <div className="synthesis-header">
        <span className="material-symbols-outlined">flare</span>
        <h2 className="step-title">Büyük Resim</h2>
        <p className="step-subtitle">Kahve ve Tarot'un ortak mesajı</p>
      </div>

      <div className="synthesis-cards-mini">
        {Array.isArray(currentFortune?.selectedTarotCards) && currentFortune.selectedTarotCards.map((card, i) => (
          <div key={i} className="mini-card">
            {card?.img ? (
              <img src={card.img} alt={card?.nameTr || 'Kart'} />
            ) : (
              <span className="material-symbols-outlined">style</span>
            )}
          </div>
        ))}
      </div>

      <div className="synthesis-content">
        <p className="result-text">{currentFortune?.synthesisResult || 'Sentez metni yüklenemedi.'}</p>
      </div>

      <div className="synthesis-actions">
        <button className="step-button" onClick={() => dispatch({ type: 'GO_BACK_TO_RESULTS' })}>
          <span className="material-symbols-outlined">arrow_back</span>
          Falıma Geri Dön
        </button>
        <button className="step-button secondary" onClick={() => { dispatch({ type: 'SAVE_TO_HISTORY' }); dispatch({ type: 'RESET_FORTUNE' }); }}>
          Bitir ve Yeni Fal
        </button>
      </div>
    </div>
  );
}

export default SynthesisResult;
```

# File: cassiopeia/src/pages/CoffeeFortune/TarotBridge.jsx
```javascript
import { useState } from 'react';
import { useAppDispatch } from '../../context/AppContext';
import { TAROT_DECK } from '../../utils/constants';

export default function TarotBridge() {
  const dispatch = useAppDispatch();
  const [selectedCards, setSelectedCards] = useState([]);
  const [revealedIndices, setRevealedIndices] = useState([]);
  const [shuffled] = useState(() => {
    const deck = Array.isArray(TAROT_DECK) ? [...TAROT_DECK] : [];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  });

  const labels = ['Gecmis', 'Su An', 'Gelecek'];

  const handleCardClick = (cardIndex) => {
    if (selectedCards.length >= 3 || revealedIndices.includes(cardIndex)) return;
    setRevealedIndices((prev) => [...prev, cardIndex]);
    const card = shuffled?.[cardIndex];
    if (!card) return;
    
    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);
    
    if (newSelected.length === 3) {
      setTimeout(() => {
        dispatch({ type: 'SET_TAROT_CARDS', payload: newSelected });
      }, 1500);
    }
  };

  return (
    <div className="fortune-step bridge-step">
      <div className="bridge-header">
        <span className="material-symbols-outlined">flare</span>
        <h2 className="step-title">Kartlarını Seç</h2>
        <p className="step-subtitle">Fincanındaki enerjileri netlestirmek için 3 kart sec</p>
      </div>

      <div className="selected-cards-display">
        {labels.map((label, i) => (
          <div key={label} className={`selected-card-slot ${selectedCards?.[i] ? 'filled' : ''}`}>
            <span className="slot-label">{label}</span>
            {selectedCards?.[i] ? (
              <div className="slot-card revealed">
                {selectedCards[i]?.img ? (
                  <img src={selectedCards[i].img} alt={selectedCards[i]?.nameTr || 'Kart'} />
                ) : (
                  <span className="material-symbols-outlined">style</span>
                )}
                <span className="slot-card-name">{selectedCards[i]?.nameTr || 'Seçildi'}</span>
              </div>
            ) : (
              <div className="slot-card empty">
                <span className="material-symbols-outlined">help</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedCards.length < 3 && (
        <div className="tarot-spread-container">
          <p className="bridge-instruction">
            {3 - selectedCards.length} kart daha sec ({labels[selectedCards.length]})
          </p>
          <div className="tarot-spread">
            {Array.isArray(shuffled) && shuffled.slice(0, 12).map((card, i) => (
              <button
                key={card?.id || i}
                className={`tarot-card-back ${revealedIndices.includes(i) ? 'flipped' : ''}`}
                onClick={() => handleCardClick(i)}
                disabled={revealedIndices.includes(i)}
              >
                <div className="card-back-face">
                  <div className="card-back-pattern"><span>✦</span></div>
                </div>
                <div className="card-front-face">
                  {card?.img ? (
                    <img src={card.img} alt={card?.nameTr || 'Kart'} />
                  ) : (
                    <span className="material-symbols-outlined">style</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

# File: cassiopeia/src/pages/CoffeeFortune/UploadStep.jsx
```javascript
import { useRef, useState } from 'react';
import { useAppDispatch } from '../../context/AppContext';
import { compressImage } from '../../utils/imageCompressor';

export default function UploadStep() {
  const dispatch = useAppDispatch();
  const fileRef = useRef(null);
  
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [compressing, setCompressing] = useState(false);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Remaining slots
    const remaining = 3 - images.length;
    if (remaining <= 0) {
      setError('Maksimum 3 fotoğraf yükleyebilirsin');
      return;
    }

    const filesToProcess = files.slice(0, remaining);
    setError('');
    setCompressing(true);

    try {
      const results = await Promise.all(
        filesToProcess.map(file => compressImage(file))
      );

      const newImages = results.map(res => ({
        base64: res.base64,
        mimeType: res.mimeType,
        dataUrl: res.dataUrl
      }));

      setImages(prev => [...prev, ...newImages]);
      setCompressing(false);
    } catch (err) {
      setError('Bazı fotoğraflar işlenemedi, tekrar dene');
      setCompressing(false);
    }

    // Reset input for same file selection
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (images.length === 0) return;
    
    dispatch({
      type: 'SET_IMAGES',
      payload: images,
    });
  };

  return (
    <div className="fortune-step upload-step">
      <div className="step-icon">
        <span className="material-symbols-outlined">add_a_photo</span>
      </div>
      <h2 className="step-title">Fincanı Yükle</h2>
      <p className="step-subtitle">
        Fincanın içini 3 farklı açıdan (sağ, sol, orta) çekersen Cassiopeia daha iyi görür. (Maks 3 adet)
      </p>

      <div className="upload-images-grid">
        {images.map((img, idx) => (
          <div key={idx} className="preview-item">
            <img src={img.dataUrl} alt={`Fincan ${idx + 1}`} />
            <button className="preview-remove" onClick={() => removeImage(idx)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        ))}
        {images.length < 3 && !compressing && (
          <div className="upload-add-more" onClick={() => fileRef.current?.click()}>
            <span className="material-symbols-outlined">add</span>
            <span style={{ fontSize: '10px', marginTop: '4px' }}>Foto Ekle</span>
          </div>
        )}
        {compressing && (
          <div className="upload-add-more">
            <span className="material-symbols-outlined spinning">progress_activity</span>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {error && <p className="step-error">{error}</p>}

      {images.length > 0 && (
        <button className="step-button pulse" onClick={handleSubmit}>
          {images.length} Fotoğrafla Analize Başla
          <span className="material-symbols-outlined">flare</span>
        </button>
      )}

      {images.length === 0 && !compressing && (
        <div className="upload-zone" onClick={() => fileRef.current?.click()} style={{ marginTop: '0' }}>
            <>
              <span className="material-symbols-outlined upload-icon">cloud_upload</span>
              <span className="upload-text">İlk Fotoğrafı Seç</span>
              <span className="upload-hint">Yüklemek için dokun</span>
            </>
        </div>
      )}
    </div>
  );
}
```

# File: cassiopeia/src/pages/CoffeeFortunePage.jsx
```javascript
import { useNavigate } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../context/AppContext';
import IntentStep from './CoffeeFortune/IntentStep';
import UploadStep from './CoffeeFortune/UploadStep';
import AnalyzingStep from './CoffeeFortune/AnalyzingStep';
import ResultsPage from './CoffeeFortune/ResultsPage';
import TarotBridge from './CoffeeFortune/TarotBridge';
import SynthesisResult from './CoffeeFortune/SynthesisResult';

export default function CoffeeFortunePage() {
  const { currentFortune, error } = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Hatalı error kontrollerini güvenli hale getiriyoruz:
  const errorText = typeof error === 'string' ? error : (error?.message || '');
  const isApiKeyError = errorText && (errorText.toLowerCase().includes('api key') || errorText.toLowerCase().includes('api_key'));

  const getErrorMessage = (err) => {
    const text = typeof err === 'string' ? err : (err?.message || 'Bilinmeyen bir hata oluştu');
    if (text.toLowerCase().includes('api key')) return 'API anahtarın geçersiz. Profil sayfasından yeni bir anahtar gir.';
    if (text.toLowerCase().includes('timeout') || text.toLowerCase().includes('network')) return 'Bağlantı hatası. İnternet bağlantını kontrol edip tekrar dene.';
    return text;
  };

  if (error) {
    return (
      <div className="page coffee-page">
        <div className="error-container">
          <span className="material-symbols-outlined error-icon">error</span>
          <h3>Bir sorun oluştu</h3>
          <p>{getErrorMessage(error)}</p>
          {isApiKeyError ? (
            <button className="step-button" onClick={() => { dispatch({ type: 'CLEAR_ERROR' }); dispatch({ type: 'RESET_FORTUNE' }); navigate('/profil'); }}>
              API Anahtarını Düzenle
            </button>
          ) : (
            <button className="step-button" onClick={() => { dispatch({ type: 'CLEAR_ERROR' }); dispatch({ type: 'RESET_FORTUNE' }); }}>
              Tekrar Dene
            </button>
          )}
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentFortune.step) {
      case 'intent': return <IntentStep />;
      case 'upload': return <UploadStep />;
      case 'analyzing': return <AnalyzingStep />;
      case 'results': return <ResultsPage />;
      case 'bridge': return <TarotBridge />;
      case 'synthesis': return <SynthesisResult />;
      default: return <IntentStep />;
    }
  };

  // Step progress indicator
  const steps = ['intent', 'upload', 'analyzing', 'results', 'bridge', 'synthesis'];
  const currentIndex = steps.indexOf(currentFortune.step);

  return (
    <div className="page coffee-page">
      {/* Progress bar */}
      <div className="fortune-progress">
        <div
          className="fortune-progress-fill"
          style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      {renderStep()}
    </div>
  );
}
```

# File: cassiopeia/src/pages/DiscoverPage.jsx
```javascript
export default function DiscoverPage() {
  const categories = [
    { title: 'Semboller Ansiklopedisi', icon: 'menu_book', desc: 'Fincandaki sembollerin anlamlarını öğren' },
    { title: 'Tarot Rehberi', icon: 'style', desc: '78 tarot kartının detaylı anlamları' },
    { title: 'Burçlar', icon: 'stars', desc: '12 burç hakkında her şey' },
    { title: 'Fal Okuma Rehberi', icon: 'school', desc: 'Fal nasıl bakılır? Adım adım' },
  ];

  return (
    <div className="page discover-page">
      <div className="page-header">
        <h1 className="page-title">Keşfet</h1>
        <p className="page-subtitle">Öğren ve derinleş</p>
      </div>

      <div className="discover-grid">
        {categories.map((cat) => (
          <div key={cat.title} className="discover-card locked">
            <span className="material-symbols-outlined discover-icon">{cat.icon}</span>
            <h3 className="discover-title">{cat.title}</h3>
            <p className="discover-desc">{cat.desc}</p>
            <span className="discover-badge">Yakında</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

# File: cassiopeia/src/pages/FortunesPage.jsx
```javascript
import { useNavigate } from 'react-router-dom';
import { FORTUNE_TYPES } from '../utils/constants';

export default function FortunesPage() {
  const navigate = useNavigate();

  const handleClick = (type) => {
    if (!type.available) return;
    if (type.id === 'coffee') navigate('/fallar/kahve');
    if (type.id === 'tarot') navigate('/fallar/tarot');
  };

  return (
    <div className="page fortunes-page">
      <div className="page-header">
        <h1 className="page-title">Fallar</h1>
        <p className="page-subtitle">Ne öğrenmek istiyorsun?</p>
      </div>

      <div className="fortune-grid">
        {FORTUNE_TYPES.map((type) => (
          <button
            key={type.id}
            className={`fortune-type-card ${!type.available ? 'locked' : ''}`}
            onClick={() => handleClick(type)}
          >
            <div className="fortune-type-emoji">{type.emoji}</div>
            <div className="fortune-type-info">
              <h3 className="fortune-type-name">{type.name}</h3>
              <p className="fortune-type-desc">{type.description}</p>
            </div>
            {!type.available && (
              <div className="fortune-type-badge">Yakında</div>
            )}
            {type.available && (
              <span className="material-symbols-outlined fortune-arrow">chevron_right</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
```

# File: cassiopeia/src/pages/HistoryDetailPage.jsx
```javascript
import { useParams, useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import { useState } from 'react';
import ImageModal from '../components/ImageModal';

export default function HistoryDetailPage() {
  const { index } = useParams();
  const navigate = useNavigate();
  const { history } = useAppState();
  const [activeTab, setActiveTab] = useState('overview');
  const [zoomedImage, setZoomedImage] = useState(null);

  const fortune = history[parseInt(index)];

  if (!fortune) {
    return (
      <div className="page history-detail-page">
        <div className="error-container">
          <span className="material-symbols-outlined">error</span>
          <h3>Fal bulunamadı</h3>
          <button className="step-button" onClick={() => navigate('/gecmis')}>Geçmişe Dön</button>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'overview', label: 'Genel', icon: '☕' },
    { id: 'details', label: 'Detaylar', icon: '🔍' },
    { id: 'tarot', label: 'Tarot', icon: '🃏' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
    case 'overview':
        // Handle case where coffeeResult might be a string (old format) or object (new format)
        const generalText = typeof fortune.coffeeResult === 'string' 
          ? fortune.coffeeResult 
          : (fortune.coffeeResult?.general || 'Yorum bulunamadı.');

        return (
          <div className="tab-content overview-tab animate-fadeIn">
            <div className="intent-box-mini">
              <span className="material-symbols-outlined">flare</span>
              <div className="intent-text-wrapper">
                <span className="intent-label">Niyetin</span>
                <p>"{fortune.intent || 'Genel Niyet'}"</p>
              </div>
            </div>

            {/* Symbols Section - Only show if it exists (new format) */}
            {fortune.coffeeResult?.symbols && typeof fortune.coffeeResult !== 'string' && (
              <div className="symbols-section">
                <div className="section-header-mini">Semboller</div>
                <div className="symbols-list-vertical">
                  {fortune.coffeeResult.symbols.semboller?.map((s, i) => (
                    <div key={i} className="symbol-item-mini">
                      <span className="symbol-name">{s.ad}</span>
                      <span className="symbol-meaning">{s.anlam}</span>
                    </div>
                  ))}
                </div>
                {fortune.coffeeResult.symbols.iliskiler?.length > 0 && (
                  <div className="symbol-relationships-mini">
                    {fortune.coffeeResult.symbols.iliskiler.map((r, i) => (
                      <div key={i} className="relationship-chip">{r}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="divider-glow"></div>

            {/* General Text */}
            <div className="general-reading">
              <p className="result-text">{generalText}</p>
            </div>
          </div>
        );

      case 'details':
        const details = fortune.coffeeResult?.details;
        if (!details) return (
          <div className="empty-state-history">
            <span className="material-symbols-outlined">info</span>
            <p>Detaylı analiz (Geçmiş, Gelecek, Aşk, Kariyer) bu eski falda bulunmuyor.</p>
            <span className="small-hint">Yeni baktıracağın tüm fallarda bu sekme pırıl pırıl gelecek! 😉</span>
          </div>
        );
        
        return (
          <div className="tab-content details-tab animate-fadeIn">
            <div className="details-vertical-list">
              {[
                { title: 'Geçmişin İzleri', text: details.gecmis, icon: 'history' },
                { title: 'Gelecek Işığı', text: details.gelecek, icon: 'flare' },
                { title: 'Aşk ve Bağlar', text: details.ask, icon: 'favorite' },
                { title: 'Kariyer ve Güç', text: details.kariyer, icon: 'work' },
              ].map((item, i) => (
                <div key={i} className="detail-card-glass">
                  <div className="detail-card-header">
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <h4>{item.title}</h4>
                  </div>
                  <p>{item.text || 'Bu bölüme dair veri bulunamadı.'}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'tarot':
        if (!fortune.synthesisResult) return (
          <div className="empty-state">
            <span className="material-symbols-outlined">style</span>
            <p>Bu falda Tarot sentezi bulunmuyor.</p>
          </div>
        );

        return (
          <div className="tab-content tarot-tab animate-fadeIn">
            <div className="synthesis-badge">Kahin Sentezi</div>
            
            <div className="synthesis-cards-mini">
              {fortune.tarotCards?.map((card, i) => (
                <div key={i} className="mini-card" onClick={() => setZoomedImage(card.img)}>
                  {card?.img ? (
                    <img src={card.img} alt={card?.nameTr} />
                  ) : (
                    <span className="material-symbols-outlined">style</span>
                  )}
                </div>
              ))}
            </div>

            <p className="result-text">{fortune.synthesisResult}</p>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="page history-detail-page">
      <div className="page-header sticky-header">
        <button className="back-btn" onClick={() => navigate('/gecmis')}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="header-info">
          <h1 className="page-title">Fal Detayı</h1>
          <p className="page-subtitle">{new Date(fortune.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</p>
        </div>
      </div>

      {fortune?.images?.length > 0 && (
        <div className="result-image-strip multi" style={{ marginBottom: '0', padding: '0 20px 20px' }}>
          {fortune.images.map((img, idx) => (
            <div key={idx} className="strip-image-container" onClick={() => setZoomedImage(img.dataUrl)}>
              <img src={img.dataUrl} alt={`Fincan ${idx + 1}`} />
            </div>
          ))}
        </div>
      )}

      <div className="history-tabs-container">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`history-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="history-detail-content">
        {renderTabContent()}
      </div>

      <ImageModal src={zoomedImage} onClose={() => setZoomedImage(null)} />
    </div>
  );
}

```

# File: cassiopeia/src/pages/HistoryPage.jsx
```javascript
import { useAppState } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ImageModal from '../components/ImageModal';

export default function HistoryPage() {
  const { history } = useAppState();
  const navigate = useNavigate();
  const [zoomedImage, setZoomedImage] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Tarih belirsiz';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('tr-TR', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return 'Tarih hatalı';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'coffee': return '☕ Kahve Falı';
      case 'tarot': return '🃏 Tarot';
      default: return '🔮 Fal';
    }
  };

  return (
    <div className="page history-page">
      <div className="page-header">
        <h1 className="page-title">Geçmiş</h1>
        <p className="page-subtitle">Önceki falların</p>
      </div>

      {!Array.isArray(history) || history.length === 0 ? (
        <div className="empty-state">
          <span className="material-symbols-outlined empty-icon">history</span>
          <h3>Henüz fal baktırmadın</h3>
          <p>İlk falını baktırdığında burada görünecek</p>
          <button className="step-button" onClick={() => navigate('/fallar')}>
            Fal Baktır
          </button>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item, i) => (
            <div key={item?.id || i} className="history-item" onClick={() => navigate(`/gecmis/${i}`)}>
              <div className="history-item-image" onClick={(e) => {
                const imgUrl = item?.images?.[0]?.dataUrl || item?.imageDataUrl;
                if (imgUrl) {
                  e.stopPropagation();
                  setZoomedImage(imgUrl);
                }
              }}>
                {item?.images?.[0]?.dataUrl || item?.imageDataUrl ? (
                  <img src={item?.images?.[0]?.dataUrl || item?.imageDataUrl} alt="Fincan" />
                ) : (
                  <div className="history-placeholder">
                    <span className="material-symbols-outlined">coffee</span>
                  </div>
                )}
              </div>
              <div className="history-item-info">
                <span className="history-type">{getTypeLabel(item?.type)}</span>
                <p className="history-intent">{item?.intent || 'Genel Niyet'}</p>
                <span className="history-date">{formatDate(item?.date)}</span>
              </div>
              {item?.tarotCards?.length > 0 && (
                <div className="history-tarot-badge">
                  <span className="material-symbols-outlined">flare</span>
                  Sentez
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ImageModal src={zoomedImage} onClose={() => setZoomedImage(null)} />
    </div>
  );
}
```

# File: cassiopeia/src/pages/HomePage.jsx
```javascript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { ZODIAC_SIGNS, TAROT_DECK } from '../utils/constants';
import { callGemini } from '../services/gemini';
import { buildCombinedDailyPrompt } from '../utils/prompts';
import ImageModal from '../components/ImageModal';

export default function HomePage() {
  const { user, apiKey } = useAppState();
  const navigate = useNavigate();
  const [dailyCard, setDailyCard] = useState(null);
  const [dailyCardReading, setDailyCardReading] = useState('');
  const [horoscope, setHoroscope] = useState('');
  const [dailyEnergy, setDailyEnergy] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [loading, setLoading] = useState(() => {
    // Immediate check to prevent flicker
    try {
      const u = JSON.parse(localStorage.getItem('cassiopeia_user_profile'));
      if (!u) return true;
      const today = new Date().toDateString();
      const s = `${today}_${u.zodiac}`;
      return !(localStorage.getItem(`daily_card_reading_${s}`) && 
               localStorage.getItem(`daily_horoscope_${s}`));
    } catch { return true; }
  });

  const userZodiac = user ? ZODIAC_SIGNS.find(z => z.id === user.zodiac) : null;

  useEffect(() => {
    if (!user || !userZodiac) return;

    const today = new Date().toDateString();
    const seedString = `${today}_${user.zodiac}`;
    const seed = seedString.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

    // 1. Generate/Retrieve Daily Card (Deterministic)
    const cardIndex = seed % TAROT_DECK.length;
    const card = TAROT_DECK[cardIndex];
    setDailyCard(card);

    // 2. Generate/Retrieve Daily Energy (Cached for 24h)
    const colors = ['Mavi', 'Kırmızı', 'Yeşil', 'Mor', 'Sarı', 'Turuncu', 'Pembe', 'Turkuaz', 'Gümüş', 'Beyaz'];
    const cachedEnergy = localStorage.getItem(`daily_energy_${seedString}`);
    
    if (cachedEnergy) {
      const parsed = JSON.parse(cachedEnergy);
      // Legacy color check: If old color persists in cache, regenerate with new palette
      if (!colors.includes(parsed.color)) {
        const energyColor = colors[seed % colors.length];
        const luckyNumber = ((seed * 7) % 99) + 1;
        const newEnergy = { color: energyColor, number: luckyNumber };
        setDailyEnergy(newEnergy);
        localStorage.setItem(`daily_energy_${seedString}`, JSON.stringify(newEnergy));
      } else {
        setDailyEnergy(parsed);
      }
    } else {
      const energyColor = colors[seed % colors.length];
      
      // Weighted Numerology: 60% chance for 1-9, 40% for 10-99
      const roll = (seed * 13) % 100;
      let luckyNumber;
      if (roll < 60) {
        luckyNumber = ((seed * 7) % 9) + 1; // 1-9
      } else {
        luckyNumber = ((seed * 7) % 90) + 10; // 10-99
      }
      
      const newEnergy = { color: energyColor, number: luckyNumber };
      setDailyEnergy(newEnergy);
      localStorage.setItem(`daily_energy_${seedString}`, JSON.stringify(newEnergy));
    }

    // 3. Fetch mystical content with caching
    if (apiKey) {
      const cachedCard = localStorage.getItem(`daily_card_reading_${seedString}`);
      const cachedHoroscope = localStorage.getItem(`daily_horoscope_${seedString}`);

      if (cachedCard && cachedHoroscope) {
        setDailyCardReading(cachedCard);
        setHoroscope(cachedHoroscope);
        setLoading(false);
      } else {
        loadDailyContent(card, userZodiac, seedString);
      }
    } else {
      setLoading(false);
    }
  }, [apiKey, user, userZodiac]);

  async function loadDailyContent(card, zodiac, todayString) {
    if (!apiKey || !zodiac || !card) return;
    setLoading(true);
    try {
      // Combined call for Horoscope and Tarot (Saves 50% cost!)
      const prompt = buildCombinedDailyPrompt(zodiac?.name || '', card?.nameTr || '', card?.meaning || '');
      const result = await callGemini(apiKey, prompt, { jsonMode: true });
      
      const { horoscope: h, tarot_reading: t } = result;
      
      setDailyCardReading(t);
      setHoroscope(h);
      
      // Save both to localStorage using consistent keys
      localStorage.setItem(`daily_card_reading_${todayString}`, t);
      localStorage.setItem(`daily_horoscope_${todayString}`, h);
    } catch (err) {
      console.error('İçerik yüklenirken hata oluştu:', err);
      const msg = 'Bağlantı hatası veya API sorunu.';
      if (!dailyCardReading) setDailyCardReading(msg);
      if (!horoscope) setHoroscope(msg);
    }
    setLoading(false);
  }

  // Safety Guard: If user profile is not ready, show clean loading
  if (!user || !userZodiac) {
    return (
      <div className="page home-page">
        <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.7 }}>
          <p>Cassiopeia yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page home-page">
      {/* Header */}
      <div className="home-header">
        <div className="home-greeting">
          <span className="greeting-emoji">{userZodiac?.emoji || '☪️'}</span>
          <div>
            <p className="greeting-text">Merhaba</p>
            <h1 className="greeting-zodiac">{userZodiac?.name || 'Gezgin'}</h1>
          </div>
        </div>
        <div className="home-date">
          {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
        </div>
      </div>

      {/* Quick Action */}
      <button className="quick-action-btn" onClick={() => navigate('/fallar/kahve')}>
        <span className="material-symbols-outlined">coffee</span>
        <span>Fal Baktır</span>
        <span className="material-symbols-outlined arrow">arrow_forward</span>
      </button>

      {/* Daily Card */}
      <div className="home-card daily-card-section">
        <div className="card-header">
          <span className="material-symbols-outlined">style</span>
          <h3>Günün Kartı</h3>
        </div>
        {dailyCard ? (
          <div className="daily-card-content">
            <div className="daily-card-image" onClick={() => setZoomedImage(dailyCard?.img)}>
              <img src={dailyCard?.img} alt={dailyCard?.nameTr} />
            </div>
            <div className="daily-card-info">
              <h4 className="daily-card-name">{dailyCard?.nameTr}</h4>
              <p className="daily-card-meaning">{dailyCard?.meaning}</p>
              {loading ? (
                <p className="daily-card-reading shimmer">Yükleniyor...</p>
              ) : (
                <p className="daily-card-reading">{dailyCardReading || 'Yorum hazır değil.'}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="shimmer">Kart seçiliyor...</p>
        )}
      </div>

      {/* Daily Horoscope */}
      <div className="home-card horoscope-section">
        <div className="card-header">
          <span className="zodiac-mini-emoji">{userZodiac?.emoji}</span>
          <h3>Günlük Burç Yorumun</h3>
        </div>
        {loading ? (
          <p className="horoscope-text shimmer">Yükleniyor...</p>
        ) : (
          <p className="horoscope-text">{horoscope || 'Yorum hazır değil.'}</p>
        )}
      </div>

      {/* Daily Energy */}
      {dailyEnergy && (
        <div className="home-card energy-section" style={{ 
          borderBottom: '2px solid var(--energy-color)',
          '--energy-color': {
            'Mavi': '#007AFF',
            'Kırmızı': '#FF3B30',
            'Yeşil': '#34C759',
            'Mor': '#AF52DE',
            'Sarı': '#FFCC00',
            'Turuncu': '#FF9500',
            'Pembe': '#FF2D55',
            'Turkuaz': '#5AC8FA',
            'Gümüş': '#8E8E93',
            'Beyaz': '#FFFFFF'
          }[dailyEnergy?.color || 'Mavi'] || '#007AFF'
        }}>
          <div className="card-header">
            <span className="material-symbols-outlined" style={{ color: 'var(--energy-color)' }}>bolt</span>
            <h3>Günün Enerjisi</h3>
          </div>
          <div className="energy-row">
            <div className="energy-item">
              <span className="energy-label">Renk</span>
              <span className="energy-value" style={{ 
                color: 'var(--energy-color)',
                textShadow: '0 0 15px var(--energy-color)'
              }}>{dailyEnergy?.color}</span>
            </div>
            <div className="energy-divider"></div>
            <div className="energy-item">
              <span className="energy-label">Şanslı Sayı</span>
              <span className="energy-value" style={{ 
                color: 'var(--energy-color)',
                textShadow: '0 0 15px var(--energy-color)'
              }}>{dailyEnergy?.number}</span>
            </div>
          </div>
        </div>
      )}

      <ImageModal src={zoomedImage} onClose={() => setZoomedImage(null)} />
    </div>
  );
}
```

# File: cassiopeia/src/pages/ProfilePage.jsx
```javascript
import { useState } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { ZODIAC_SIGNS, AGE_RANGES, RELATIONSHIP_STATUSES } from '../utils/constants';

export default function ProfilePage() {
  const { user, apiKey, history } = useAppState();
  const dispatch = useAppDispatch();
  const [showApiInput, setShowApiInput] = useState(false);
  const [newKey, setNewKey] = useState(apiKey || '');

  const userZodiac = user ? ZODIAC_SIGNS.find(z => z.id === user.zodiac) : null;
  const userAge = user ? AGE_RANGES.find(a => a.id === user.ageRange) : null;
  const userRel = user ? RELATIONSHIP_STATUSES.find(r => r.id === user.relationshipStatus) : null;

  const handleSaveKey = () => {
    if (newKey.trim()) {
      dispatch({ type: 'SET_API_KEY', payload: newKey.trim() });
      setShowApiInput(false);
    }
  };

  return (
    <div className="page profile-page">
      <div className="page-header">
        <h1 className="page-title">Profil</h1>
      </div>

      {/* User Info */}
      <div className="profile-card">
        <div className="profile-avatar">
          <span className="profile-emoji">{userZodiac?.emoji || '✨'}</span>
        </div>
        <div className="profile-info">
          <h2 className="profile-zodiac">{userZodiac?.name || 'Bilinmiyor'}</h2>
          <div className="profile-details">
            <span className="profile-detail">{userAge?.label || '-'} yaş</span>
            <span className="profile-divider">•</span>
            <span className="profile-detail">{userRel?.label || '-'}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-number">{history.length}</span>
          <span className="stat-label">Fal</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {history.filter(h => h.tarotCards?.length > 0).length}
          </span>
          <span className="stat-label">Sentez</span>
        </div>
      </div>

      {/* Settings */}
      <div className="profile-section">
        <h3 className="section-title">Ayarlar</h3>

        <button className="settings-item" onClick={() => setShowApiInput(!showApiInput)}>
          <span className="material-symbols-outlined">key</span>
          <span>API Anahtarı</span>
          <span className="material-symbols-outlined">{showApiInput ? 'expand_less' : 'expand_more'}</span>
        </button>

        {showApiInput && (
          <div className="api-key-edit">
            <input
              type="password"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Gemini API anahtarı"
              className="settings-input"
            />
            <button className="settings-save" onClick={handleSaveKey}>Kaydet</button>
          </div>
        )}

        <button className="settings-item" onClick={() => dispatch({ type: 'SHOW_ONBOARDING', payload: true })}>
          <span className="material-symbols-outlined">tune</span>
          <span>Profili Düzenle</span>
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      <div className="profile-footer">
        <p>Cassiopeia v1.0</p>
        <p>Cassiopeia Cosmos • 2026</p>
      </div>
    </div>
  );
}
```

# File: cassiopeia/src/pages/Tarot/TarotPage.jsx
```javascript
import { useState, useEffect } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import TarotSelection from './TarotSelection';
import TarotResult from './TarotResult';
import { TAROT_SLOTS } from '../../utils/constants';

export default function TarotPage() {
  const { currentFortune, user } = useAppState();
  const dispatch = useAppDispatch();
  const [userName, setUserName] = useState(user?.name || '');
  const [intent, setIntent] = useState('');

  // Use global step but handle local UI sub-steps if needed
  const step = currentFortune?.step || 'intent';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const handleStartRitual = () => {
    if (!userName || !intent) return;
    dispatch({ type: 'SET_TAROT_INTENT', payload: { userName, intent } });
  };

  const renderInput = () => (
    <div className="page tarot-input-page fade-in">
      <div className="page-header">
        <h1 className="page-title" style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Zümrüt Kâhini
        </h1>
        <p className="page-subtitle">Sana rehberlik etmesi için niyetini paylaş.</p>
      </div>

      <div className="intent-form" style={{ marginTop: '40px' }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'var(--font-label)', textTransform: 'uppercase' }}>Kimliğin</label>
          <input 
            type="text" 
            className="intent-input" 
            placeholder="İsmin nedir?"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{ height: '56px' }}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'var(--font-label)', textTransform: 'uppercase' }}>Odağın / Niyetin</label>
          <textarea 
            className="intent-input" 
            placeholder="Aklındaki soruyu veya odaklanmak istediğin alanı (Aşk, Kariyer, Gelecek...) buraya yaz."
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            rows="4"
          />
        </div>

        <button 
          className="step-button ritual-active" 
          disabled={!userName || !intent}
          onClick={handleStartRitual}
          style={{ width: '100%', justifyContent: 'center', boxShadow: '0 0 20px var(--accent-glow)' }}
        >
          Kâhine Bağlan
          <span className="material-symbols-outlined">auto_awesome</span>
        </button>
      </div>
    </div>
  );

  if (step === 'intent') return renderInput();
  if (step === 'ritual' || step === 'selection') {
    return <TarotSelection step={step} />;
  }
  if (step === 'results') {
    return <TarotResult />;
  }

  return renderInput(); // Default to input if step is unknown
}

```

# File: cassiopeia/src/pages/Tarot/TarotResult.jsx
```javascript
import { useState, useEffect } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { TAROT_SLOTS } from '../../utils/constants';
import { callGemini } from '../../services/gemini';
import { buildEmeraldOraclePrompt } from '../../utils/prompts';
import OracleLoading from '../../components/OracleLoading';

export default function TarotResult() {
  const { currentFortune, apiKey } = useAppState();
  const dispatch = useAppDispatch();
  const { selectedTarotCards, tarotIntent } = currentFortune || {};
  
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getReading() {
      if (!apiKey || !tarotIntent?.userName || !selectedTarotCards?.length) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const prompt = buildEmeraldOraclePrompt(
          tarotIntent.userName, 
          tarotIntent.intent, 
          selectedTarotCards
        );
        const result = await callGemini(apiKey, prompt, { jsonMode: true });
        setResultData(result);
      } catch (err) {
        console.error("Gemini Tarot Error:", err);
        const userFriendlyError = err.message?.includes('KOTA_LIMITI') 
          ? "Zümrüt Kâhini şu an çok yoğun. Biraz bekleyip tekrar dene." 
          : (err.message || "Kâhin'e ulaşılamıyor. Yıldızlar puslu...");
        setError(userFriendlyError);
      } finally {
        setLoading(false);
      }
    }
    getReading();
  }, [apiKey, selectedTarotCards, tarotIntent]);

  if (error) {
    return (
      <div className="page tarot-results-page fade-in" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--negative)' }}>error</span>
        <p style={{ marginTop: '20px' }}>{error}</p>
        <button onClick={() => window.location.reload()} className="step-button">Yeniden Dene</button>
      </div>
    );
  }

  return (
    <div className="page tarot-results-page fade-in" style={{ paddingBottom: '100px' }}>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1 className="page-title" style={{ fontSize: '24px', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Zümrüt Okuması
        </h1>
        <p className="page-subtitle">{tarotIntent?.userName || 'Yolcu'} için açılan kader yolu.</p>
      </div>

      <div className="results-container" style={{ marginTop: '40px' }}>
        {TAROT_SLOTS.map((slot) => {
          const card = selectedTarotCards.find(c => c.slot === slot.id);

          return (
            <div key={slot.id} style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--accent)', fontSize: '20px' }}>{slot.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)' }}>{slot.nameTr}</span>
                {card && <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>— {card.nameTr}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Card Display */}
                <div style={{ 
                  width: '90px', 
                  height: '145px', 
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid var(--accent-glow)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  position: 'relative'
                }}>
                  {loading ? (
                    <div style={{ width: '100%', height: '100%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--accent)', opacity: 0.5, animation: 'pulse 2s infinite' }}>star</span>
                    </div>
                  ) : (
                    card && <img src={card.img} alt={card.nameTr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="fade-in" />
                  )}
                </div>

                {/* Text Display */}
                <div className="result-text" style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-primary)' }}>
                   {loading ? (
                     <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '12px', opacity: 0.7 }}>
                       <div className="skeleton-line" style={{ width: '100%', height: '12px', background: 'var(--border)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                       <div className="skeleton-line" style={{ width: '90%', height: '12px', background: 'var(--border)', borderRadius: '4px', animation: 'pulse 1.5s infinite 0.2s' }} />
                       <div className="skeleton-line" style={{ width: '60%', height: '12px', background: 'var(--border)', borderRadius: '4px', animation: 'pulse 1.5s infinite 0.4s' }} />
                     </div>
                   ) : (
                     <div className="fade-in" style={{ padding: '4px 0' }}>
                       {resultData?.[slot.id] ? (
                         resultData[slot.id].split('\n').map((paragraph, i) => (
                           paragraph.trim() && <p key={i} style={{ marginBottom: '12px' }}>{paragraph}</p>
                         ))
                       ) : (
                         <p>Kâhin bu konuda sessiz kalmayı tercih etti...</p>
                       )}
                     </div>
                   )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Synthesis Seal */}
      {!loading && resultData?.seal && (
        <div className="emerald-seal fade-in" style={{ 
          marginTop: '60px', 
          padding: '32px', 
          background: 'var(--bg-elevated)', 
          border: '1px solid var(--accent)', 
          borderRadius: '16px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          textAlign: 'center'
        }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.03, pointerEvents: 'none' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '240px', color: 'var(--accent)' }}>dark_mode</span>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--accent)', marginBottom: '16px', position: 'relative', zIndex: 1 }}>flare</span>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--accent)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.15em', position: 'relative', zIndex: 1 }}>Zümrüt Mührü</h3>
          <div style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-primary)', position: 'relative', zIndex: 1 }}>
            {resultData.seal.split('\n').map((para, i) => (
              para.trim() && <p key={i} style={{ marginBottom: '12px' }}>{para}</p>
            ))}
          </div>
        </div>
      )}

      {/* Exit Button */}
      {!loading && (
        <button 
          onClick={() => dispatch({ type: 'RESET_FORTUNE' })}
          className="step-button secondary" 
          style={{ width: '100%', marginTop: '60px' }}
        >
          Masadan Ayrıl
        </button>
      )}
    </div>
  );
}

```

# File: cassiopeia/src/pages/Tarot/TarotSelection.jsx
```javascript
import { useState, useRef, useEffect } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { TAROT_DECK, TAROT_SLOTS } from '../../utils/constants';

export default function TarotSelection({ step }) {
  const { currentFortune } = useAppState();
  const dispatch = useAppDispatch();
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const holdTimer = useRef(null);

  // Ritual Logic: Optimized interval handling
  useEffect(() => {
    if (isHolding) {
      holdTimer.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(holdTimer.current);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
    } else {
      clearInterval(holdTimer.current);
      if (progress < 100) setProgress(0);
    }
    return () => clearInterval(holdTimer.current);
  }, [isHolding]);

  // Handle transition when progress hits 100
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        dispatch({ type: 'SET_TAROT_STEP', payload: 'selection' });
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, dispatch]);

  const handleCardSelect = (card) => {
    if (selectedCards.length >= 3) return;
    if (selectedCards.find(c => c.id === card.id)) return;
    
    const newSelected = [...selectedCards, { ...card, slot: TAROT_SLOTS[selectedCards.length].id }];
    setSelectedCards(newSelected);

    if (newSelected.length === 3) {
      setTimeout(() => {
        dispatch({ type: 'SET_TAROT_CARDS', payload: newSelected });
        dispatch({ type: 'SET_TAROT_STEP', payload: 'results' });
      }, 800);
    }
  };

  const renderRitual = () => (
    <div className="page tarot-ritual-page fade-in" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', paddingTop: '60px' }}>
      <button 
        onClick={() => dispatch({ type: 'RESET_FORTUNE' })}
        style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '14px', zIndex: 100 }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
        Masadan Ayrıl
      </button>

      {/* Top Visual (Safe CSS Design) */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--bg-elevated), var(--bg-card))', border: '1px solid var(--accent)', boxShadow: '0 0 30px var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--accent)' }}>flare</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '26px', marginBottom: '8px', fontWeight: 'bold', letterSpacing: '-0.02em', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Desteni Kar</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '280px', margin: '0 auto', lineHeight: '1.6' }}>
          Ortadaki mühüre basılı tutarak desteni kar ve niyetine odaklan...
        </p>
      </div>

      {/* Center Interaction Button with Ring */}
      <div style={{ position: 'relative', width: '120px', height: '120px', margin: '20px auto 40px' }}>
        {/* Aesthetic Circular Progress */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', transform: 'rotate(-90deg)' }}>
          <circle cx="60" cy="60" r="56" fill="none" stroke="var(--border)" strokeWidth="4" />
          <circle 
            cx="60" cy="60" r="56" 
            fill="none" 
            stroke="var(--accent)" 
            strokeWidth="4" 
            strokeDasharray={`${progress * 3.51}, 1000`} 
            strokeLinecap="round" 
            style={{ transition: 'stroke-dasharray 0.1s linear', filter: 'drop-shadow(0 0 4px var(--accent))' }} 
          />
        </svg>

        {/* Hold Button */}
        <div 
          className={isHolding ? 'ritual-active' : ''}
          onMouseDown={() => setIsHolding(true)}
          onMouseUp={() => setIsHolding(false)}
          onMouseLeave={() => setIsHolding(false)}
          onTouchStart={() => setIsHolding(true)}
          onTouchEnd={() => setIsHolding(false)}
          style={{ 
            position: 'absolute', 
            top: '10px', 
            left: '10px', 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'var(--bg-elevated)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer', 
            transform: isHolding ? 'scale(0.96)' : 'scale(1)', 
            transition: 'all 0.2s', 
            boxShadow: isHolding ? '0 0 20px var(--accent-glow)' : 'none',
            border: `1px solid ${isHolding ? 'var(--accent)' : 'var(--border)'}`
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '40px', color: isHolding ? 'var(--accent)' : 'var(--text-muted)', transition: 'color 0.2s' }}>fingerprint</span>
        </div>
      </div>

      {/* Bottom Shuffling Deck */}
      <div style={{ 
          width: '200px', 
          height: '140px', 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 'auto',
          marginBottom: '20px'
        }}
      >
        {/* Left Card */}
        <div style={{
          position: 'absolute',
          width: '80px', height: '130px',
          border: '1px dashed var(--accent)',
          borderRadius: '10px',
          background: 'var(--bg-elevated)',
          transform: isHolding ? 'none' : 'rotate(-12deg) translateX(-35px)',
          animation: isHolding ? 'shuffle-left 0.8s infinite linear' : 'none',
          boxShadow: isHolding ? '0 0 15px var(--accent-glow)' : 'none',
          transition: 'transform 0.4s ease'
        }}></div>
        
        {/* Center Card */}
        <div style={{
          position: 'absolute',
          width: '80px', height: '130px',
          border: '1px solid var(--text-primary)',
          borderRadius: '10px',
          background: 'var(--bg-card)',
          transform: 'rotate(0deg)',
          animation: isHolding ? 'shuffle-center 1.1s infinite ease-in-out' : 'none',
          zIndex: 2,
          boxShadow: isHolding ? '0 0 20px var(--accent-glow)' : '0 8px 24px rgba(0,0,0,0.5)',
          transition: 'transform 0.4s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--accent)', opacity: isHolding ? 1 : 0.2, transition: 'opacity 0.2s', animation: isHolding ? 'spin 1.5s infinite linear' : 'none' }}>cyclone</span>
        </div>

        {/* Right Card */}
        <div style={{
          position: 'absolute',
          width: '80px', height: '130px',
          border: '1px dashed var(--accent)',
          borderRadius: '10px',
          background: 'var(--bg-elevated)',
          transform: isHolding ? 'none' : 'rotate(12deg) translateX(35px)',
          animation: isHolding ? 'shuffle-right 0.9s infinite linear' : 'none',
          boxShadow: isHolding ? '0 0 15px var(--accent-glow)' : 'none',
          transition: 'transform 0.4s ease'
        }}></div>
      </div>
    </div>
  );

  const renderSelection = () => (
    <div className="page tarot-selection-page fade-in" style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <button 
        onClick={() => dispatch({ type: 'RESET_FORTUNE' })}
        style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '14px', zIndex: 100 }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
        Masadan Ayrıl
      </button>
      <div className="page-header" style={{ textAlign: 'center', flexShrink: 0, padding: '20px 0 10px' }}>
        <h2 style={{ fontSize: '20px' }}>Zümrüt Destesi</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Mührü açmak için sırasıyla 3 kart seç</p>
      </div>

      <div className="card-fan" style={{ 
        position: 'relative', 
        height: '240px', // Reduced height for the fan
        display: 'flex',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {/* Simplified Fan for 3-card spread */}
        {TAROT_DECK.map((card, index) => {
          const isSelected = selectedCards.find(c => c.id === card.id);
          const angle = (index - 10.5) * 6; // Fan out 22 cards tighter

          return (
            <div 
              key={card.id}
              onClick={() => handleCardSelect(card)}
              style={{
                position: 'absolute',
                width: '60px', 
                height: '95px',
                background: 'linear-gradient(135deg, var(--bg-elevated) 0%, rgba(30,40,50,1) 100%)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '6px',
                cursor: isSelected ? 'default' : 'pointer',
                transformOrigin: '50% 280px', 
                transform: `translateX(-50%) rotate(${angle}deg) ${isSelected ? 'translateY(100px) scale(0)' : ''}`, 
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isSelected ? 0 : 1,
                zIndex: 22 - index,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                left: '50%',
                top: '20px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset 0 0 10px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ width: '80%', height: '80%', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ opacity: 0.15, fontSize: '20px' }}>flare</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* BIG BOTTOM SLOTS */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px', 
        marginTop: 'auto',
        paddingBottom: '40px',
        flexGrow: 1,
        alignItems: 'center'
      }}>
        {TAROT_SLOTS.map((slot, idx) => {
          const card = selectedCards[idx];
          return (
            <div key={slot.id} style={{ 
              width: '100px', 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              {/* Card Container */}
              <div style={{
                width: '100px',
                height: '160px',
                border: `1px dashed ${card ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                background: card ? 'transparent' : 'rgba(255,255,255,0.02)',
                boxShadow: card ? '0 8px 24px rgba(0,0,0,0.3)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}>
                {card ? (
                  <img src={card.img} alt={card.nameTr} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} className="fade-in" />
                ) : (
                  <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--text-muted)', opacity: 0.5 }}>{slot.icon}</span>
                )}
              </div>
              
              {/* Card Label */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)' }}>
                  {slot.nameTr}
                </span>
                {card && (
                  <div className="fade-in" style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}>
                    {card.nameTr}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return step === 'ritual' ? renderRitual() : renderSelection();
}

```

# File: cassiopeia/src/services/gemini.js
```javascript
export async function callGemini(apiKey, prompt, options = {}) {
  const { images = [], jsonMode = false } = options;

  if (apiKey.toUpperCase() === 'OLLAMA') {
    const OLLAMA_URL = 'http://localhost:11434/api/generate';
    const hasImages = images && images.length > 0;
    const modelName = hasImages ? 'qwen3-vl:8b' : 'gemma3:12b';
    try {
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelName,
          prompt: prompt,
          stream: false,
          images: hasImages ? images.map(img => img.base64) : undefined
        }),
      });
      // ... rest of Ollama logic ...
      const data = await response.json();
      let text = data.response;
      if (jsonMode) {
        try {
          let cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
          return JSON.parse(cleanText);
        } catch (e) {
          console.error("JSON Format Hatası (Ollama):", text);
          return { semboller: [], iliskiler: [] };
        }
      }
      return text;
    } catch (err) {
      throw new Error('Ollama Bağlantı Hatası: Terminalden CORS ayarını kontrol et.');
    }
  }

  const GEMINI_MODEL = 'gemini-2.5-flash-lite';
  const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
  const url = `${API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const parts = [{ text: prompt }];

  if (images && images.length > 0) {
    images.forEach(img => {
      parts.push({ inline_data: { mime_type: img.mimeType, data: img.base64 } });
    });
  }

  const requestBody = { 
    contents: [{ role: 'user', parts }],
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
    ]
  };

  if (jsonMode) requestBody.generationConfig = { responseMimeType: 'application/json' };
  
  const resp = await fetch(url, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(requestBody) 
  });

  const d = await resp.json();

  if (!resp.ok) {
    console.error("Gemini API Error Data:", d);
    const errorMsg = d.error?.message || 'API Hatası';
    if (errorMsg.toLowerCase().includes('api key')) throw new Error('API ANAHTARI_GECERSIZ');
    if (errorMsg.toLowerCase().includes('quota')) throw new Error('KOTA_LIMITI');
    throw new Error(errorMsg);
  }

  let resultText = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!resultText && d.error) throw new Error(d.error.message || 'Yanıt alınamadı');

  if (jsonMode) {
     try {
       let cleanText = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();
       return JSON.parse(cleanText);
     } catch (e) {
       console.error("JSON Format Hatası. Gemini düz metin döndü:", resultText);
       // Çökmeyi engellemek için boş bir yapı dönüyoruz
       return { semboller: [], iliskiler: [] }; 
     }
  }
  return resultText;
}
```

# File: cassiopeia/src/services/storage.js
```javascript
/**
 * localStorage CRUD operations for Cassiopeia
 */

const KEYS = {
  API_KEY: 'cassiopeia_api_key',
  USER_PROFILE: 'cassiopeia_user_profile',
  HISTORY: 'cassiopeia_history',
  ONBOARDING_DONE: 'cassiopeia_onboarding_done',
  CURRENT_FORTUNE: 'cassiopeia_current_fortune',
};

// API Key
export function getApiKey() {
  try { return localStorage.getItem(KEYS.API_KEY) || ''; } catch { return ''; }
}

export function setApiKey(key) {
  try { localStorage.setItem(KEYS.API_KEY, key); } catch {}
}

// User Profile
export function getUserProfile() {
  try {
    const data = localStorage.getItem(KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function setUserProfile(profile) {
  try { localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile)); } catch {}
}

// History
export function getHistory() {
  try {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function addToHistory(entry) {
  try {
    const history = getHistory();
    history.unshift({
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    });
    // Keep max 50 entries
    if (history.length > 50) history.pop();
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  } catch {}
}

export function getHistoryById(id) {
  return getHistory().find((h) => h.id === id) || null;
}

export function deleteHistoryItem(id) {
  try {
    const history = getHistory().filter((h) => h.id !== id);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  } catch {}
}

// Onboarding
export function isOnboardingDone() {
  try { return localStorage.getItem(KEYS.ONBOARDING_DONE) === 'true'; } catch { return false; }
}

export function setOnboardingDone() {
  try { localStorage.setItem(KEYS.ONBOARDING_DONE, 'true'); } catch {}
}

// Current Fortune (Session Persistence)
export function saveCurrentFortune(fortune) {
  try {
    localStorage.setItem(KEYS.CURRENT_FORTUNE, JSON.stringify(fortune));
  } catch {}
}

export function getCurrentFortune() {
  try {
    const data = localStorage.getItem(KEYS.CURRENT_FORTUNE);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function clearCurrentFortune() {
  try { localStorage.removeItem(KEYS.CURRENT_FORTUNE); } catch {}
}
```

# File: cassiopeia/src/utils/constants.js
```javascript
export const ZODIAC_SIGNS = [
  { id: 'aries', name: 'Koç', emoji: '♈', element: 'Ateş', date: '21 Mar - 19 Nis' },
  { id: 'taurus', name: 'Boğa', emoji: '♉', element: 'Toprak', date: '20 Nis - 20 May' },
  { id: 'gemini', name: 'İkizler', emoji: '♊', element: 'Hava', date: '21 May - 20 Haz' },
  { id: 'cancer', name: 'Yengeç', emoji: '♋', element: 'Su', date: '21 Haz - 22 Tem' },
  { id: 'leo', name: 'Aslan', emoji: '♌', element: 'Ateş', date: '23 Tem - 22 Ağu' },
  { id: 'virgo', name: 'Başak', emoji: '♍', element: 'Toprak', date: '23 Ağu - 22 Eyl' },
  { id: 'libra', name: 'Terazi', emoji: '♎', element: 'Hava', date: '23 Eyl - 22 Eki' },
  { id: 'scorpio', name: 'Akrep', emoji: '♏', element: 'Su', date: '23 Eki - 21 Kas' },
  { id: 'sagittarius', name: 'Yay', emoji: '♐', element: 'Ateş', date: '22 Kas - 21 Ara' },
  { id: 'capricorn', name: 'Oğlak', emoji: '♑', element: 'Toprak', date: '22 Ara - 19 Oca' },
  { id: 'aquarius', name: 'Kova', emoji: '♒', element: 'Hava', date: '20 Oca - 18 Şub' },
  { id: 'pisces', name: 'Balık', emoji: '♓', element: 'Su', date: '19 Şub - 20 Mar' },
];

export const AGE_RANGES = [
  { id: '18-25', label: '18-25' },
  { id: '26-35', label: '26-35' },
  { id: '36-45', label: '36-45' },
  { id: '45+', label: '45+' },
];

export const RELATIONSHIP_STATUSES = [
  { id: 'single', label: 'Bekar', emoji: '💫' },
  { id: 'relationship', label: 'İlişkide', emoji: '💕' },
  { id: 'married', label: 'Evli', emoji: '💍' },
  { id: 'complicated', label: 'Karmaşık', emoji: '🌀' },
];

export const FORTUNE_TYPES = [
  { id: 'coffee', name: 'Kahve Falı', emoji: '☕', description: 'Fincanındaki sembolleri oku', available: true },
  { id: 'tarot', name: 'Tarot', emoji: '🃏', description: 'Kartlardan geleceğe bak', available: true },
  { id: 'dream', name: 'Rüya Yorumu', emoji: '🌙', description: 'Rüyanın anlamını keşfet', available: false, phase: 2 },
  { id: 'numerology', name: 'Numeroloji', emoji: '🔢', description: 'Sayıların sırrını öğren', available: false, phase: 3 },
  { id: 'compatibility', name: 'Burç Uyumu', emoji: '♈', description: 'İki burcun uyumuna bak', available: false, phase: 3 },
  { id: 'palm', name: 'El Falı', emoji: '✋', description: 'Avucundaki çizgileri oku', available: false, phase: 3 },
];

export const TAROT_SLOTS = [
  { id: 'past', nameTr: 'Geçmiş', icon: 'history' },
  { id: 'present', nameTr: 'Şu An', icon: 'visibility' },
  { id: 'future', nameTr: 'Gelecek', icon: 'auto_awesome' },
];

export const TAROT_DECK = [
  { id: 0, name: 'The Fool', nameTr: 'Deli', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar00.jpg', meaning: 'Yeni başlangıçlar, masumiyet, spontanlık, özgür ruh' },
  { id: 1, name: 'The Magician', nameTr: 'Sihirbaz', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar01.jpg', meaning: 'İrade gücü, yaratıcılık, beceri, konsantrasyon' },
  { id: 2, name: 'The High Priestess', nameTr: 'Başrahibe', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar02.jpg', meaning: 'Sezgi, bilinçaltı, gizem, içsel bilgelik' },
  { id: 3, name: 'The Empress', nameTr: 'İmparatoriçe', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar03.jpg', meaning: 'Bereket, annelik, doğa, bolluk, şefkat' },
  { id: 4, name: 'The Emperor', nameTr: 'İmparator', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar04.jpg', meaning: 'Otorite, yapı, kontrol, baba figürü' },
  { id: 5, name: 'The Hierophant', nameTr: 'Aziz', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar05.jpg', meaning: 'Gelenek, maneviyat, rehberlik, education' },
  { id: 6, name: 'The Lovers', nameTr: 'Aşıklar', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar06.jpg', meaning: 'Aşk, uyum, ilişkiler, değerler, seçimler' },
  { id: 7, name: 'The Chariot', nameTr: 'Savaş Arabası', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar07.jpg', meaning: 'İrade, zafer, kararlılık, kontrol' },
  { id: 8, name: 'Strength', nameTr: 'Güç', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar08.jpg', meaning: 'Cesaret, sabır, içsel güç, yumuşak güç' },
  { id: 9, name: 'The Hermit', nameTr: 'Ermiş', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar09.jpg', meaning: 'İçsel arayış, yalnızlık, bilgelik, rehberlik' },
  { id: 10, name: 'Wheel of Fortune', nameTr: 'Kader Çarkı', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar10.jpg', meaning: 'Döngüler, kader, dönüm noktası, şans' },
  { id: 11, name: 'Justice', nameTr: 'Adalet', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar11.jpg', meaning: 'Adalet, denge, dürüstlük, sorumluluk' },
  { id: 12, name: 'The Hanged Man', nameTr: 'Asılan Adam', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar12.jpg', meaning: 'Teslimiyet, farklı bakış açısı, bekleme, fedakarlık' },
  { id: 13, name: 'Death', nameTr: 'Ölüm', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar13.jpg', meaning: 'Dönüşüm, son ve başlangıç, değişim, geçiş' },
  { id: 14, name: 'Temperance', nameTr: 'Denge', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar14.jpg', meaning: 'Denge, ılımlılık, sabır, uyum, iyileşme' },
  { id: 15, name: 'The Devil', nameTr: 'Şeytan', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar15.jpg', meaning: 'Bağımlılık, tutku, maddecilik, gölge benlik' },
  { id: 16, name: 'The Tower', nameTr: 'Kule', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar16.jpg', meaning: 'Yıkım, ani değişim, uyanış, kurtuluş' },
  { id: 17, name: 'The Star', nameTr: 'Yıldız', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar17.jpg', meaning: 'Umut, ilham, huzur, iyileşme, inanç' },
  { id: 18, name: 'The Moon', nameTr: 'Ay', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar18.jpg', meaning: 'Yanılsama, korku, bilinçaltı, sezgi, belirsizlik' },
  { id: 19, name: 'The Sun', nameTr: 'Güneş', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar19.jpg', meaning: 'Başarı, neşe, canlılık, aydınlanma, mutluluk' },
  { id: 20, name: 'Judgement', nameTr: 'Mahkeme', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar20.jpg', meaning: 'Yargılama, yenilenme, uyanış, af, çağrı' },
  { id: 21, name: 'The World', nameTr: 'Dünya', img: 'https://www.sacred-texts.com/tarot/pkt/img/ar21.jpg', meaning: 'Tamamlanma, bütünlük, başarı, kutlama, yolculuk' },
];
```

# File: cassiopeia/src/utils/imageCompressor.js
```javascript
/**
 * Canvas-based image compressor for coffee cup photos.
 * Reduces 10MB+ photos to ~200-400KB before sending to Gemini API.
 */
export function compressImage(file, maxWidth = 800, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Scale down if wider than maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG base64
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64 = dataUrl.split(',')[1];

        resolve({
          base64,
          mimeType: 'image/jpeg',
          dataUrl,
          originalSize: file.size,
          compressedSize: Math.round(base64.length * 0.75), // approximate byte size
        });
      };
      img.onerror = () => reject(new Error('Fotoğraf yüklenemedi'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Dosya okunamadı'));
    reader.readAsDataURL(file);
  });
}
```

# File: cassiopeia/src/utils/prompts.js
```javascript
// ============================================================
// CASSIOPEIA — 7 Katmanlı Fal Motoru Prompt Sistemi
// ============================================================

const CASSIOPEIA_PERSONA = `Sen Cassiopeia'sın — deneyimli, bilge, sıcak ama ciddi bir Türk kahvesi falcısı ve ruhsal danışman.

KİMLİĞİN:
- Ne çok mistik ne çok gündelik — arada bir ton
- Sembolleri sıralamak yerine YORUMLARSIN
- "Sana bir at bir de kuş gördüm" DEMEZSİN
- Bunun yerine enerjileri, akışları ve bağlantıları anlatırsın
- Samimi, güven veren, edebi ama anlaşılır Türkçe
- Kötü haberleri yumuşatarak ama DÜRÜSTÇE söyle
- Kullanıcıya "sen" diye hitap et
- ÇOK ÖNEMLİ: Yazıları her zaman kısa, öz ve vurucu tut. Uzun paragraflardan kaçın. Detaylı ama sıkmadan anlat.`;

const LAYER_1_PHYSICAL = `
KATMAN 1 — FİZİKSEL OKUMA (Telvenin Topoğrafyası):

Telve Yoğunluğu:
- Kalın, koyu, çamur gibi bölgeler → "karmik bagaj", çözülememiş ağır enerji, bastırılmış duygular
- İnce, açık bölgeler → akış, ferahlama, hızlı gerçekleşecek olaylar

Gözyaşı Damlaları:
- Duvardan aşağı süzülen telve çizgileri → "enerji boşalımı", arınma
- Fincan ağlıyorsa kişinin içinde tuttuğu bir duygu patlamaya hazır

Negatif Alan (Boşlukların Dili):
- Büyük beyaz boşluklar → aydınlanma, zihinsel berraklık, blokajın kalkması
- Beyaz alanları "ferahlık kapısı" olarak yorumla
- Sadece telvenin olduğu yere değil, OLMADIĞI yere de bak

Genel İzlenim:
- Fincana baktığında önce genel enerjiyi oku
- Yoğun mu ferah mı, kalabalık mı boş mu, ağır mı hafif mi?
- Bu ilk izlenimle başla`;

const LAYER_2_SYMBOLS = `
KATMAN 2 — SEMBOL TESPİTİ (50+ Sembol Sözlüğü):

İNSAN & VARLIK:
Kuş → haber (yönüne göre iyi/kötü) | Yılan → kıskançlık, gizli düşman
Köpek → sadık dost | Kedi → ihanet | At → yolculuk, hareket
Balık → maddi kazanç, bereket | Fare → kayıp, hırsızlık
Tilki → kurnazlık, aldatma | Aslan → güç, himaye
Tavşan → korku, çekingenlik | Kelebek → dönüşüm, yeni dönem
Örümcek → tuzak, komplo | Kuş yuvası → aile haberi

NESNE:
Yüzük → evlilik, bağlayıcı anlaşma | Anahtar → çözüm, kapı açılacak
Makas → kopuş, kesinti | Mum → umut, bekleme
Şemsiye → koruma | Taç → otorite, yükselme
Zincir → bağımlılık, esaret | Kılıç → gerçeğini savunma, toksik bağları kesme
Çan → önemli haber | Ayna → öz yüzleşme

DOĞA:
Ağaç → sağlık, uzun ömür (dallar yukarıysa olumlu)
Çiçek → mutluluk, güzel haberler | Dağ → engel (ama aşılacak)
Deniz/Dalga → duygusal çalkantı | Bulut → belirsizlik
Güneş → başarı, aydınlanma | Ay → kadın figürü, sezgi
Yıldız → şans, umut

YAPI:
Kapı → fırsat | Pencere → yeni bakış açısı
Köprü → geçiş dönemi | Merdiven → yükseliş
Yol/çizgi → değişim, seyahat | Ev → güvenlik, aile

ŞEKİL:
Kalp → aşk, duygusal yoğunluk | Göz → nazar, kıskançlık
Daire → döngü, tekrar | Üçgen → uyarı
Kare → güvenlik, stabilite | Çapraz → kavşak, seçim zamanı
Harf → isim baş harfi, önemli kişi | Kanat → özgürlük`;

const LAYER_3_RELATIONSHIPS = `
KATMAN 3 — SEMBOL İLİŞKİLERİ & ÇELİŞKİ ÇÖZÜMÜ:

Yan yana olan semboller birbirleriyle KONUŞUR:
- Kalp + Makas → bir aşk bağı kopma noktasında
- Kuş + Ev → eve bir haber geliyor
- Yılan + Göz → kıskanan birinin nazarı üstünde
- Balık + Fare → kazanç var ama dikkat etmezsen kayıp da var
- Anahtar + Kapı → büyük bir fırsat kapısı açılıyor
- Zincir + Kelebek → bağımlılıktan kurtulup dönüşüm başlıyor
- Dağ + Yol → engel var ama yol açık, geçeceksin
- Ay + Yılan → bir kadından gelen kıskançlık/tehlike

ÇELİŞKİ YÖNETİMİ:
- Çelişen semboller gördüğünde atlatma, AÇIKLA
- "Fincanda hem bereket hem kayıp var. Bu, gelen kazancın dikkat gerektirdiğini söylüyor."
- Çelişki = gerçek hayatın karmaşıklığı, bunu kucakla`;

const LAYER_4_ENERGY = `
KATMAN 4 — ENERJİ OKUMA:

FİNCAN ANATOMİSİ:
- Kulp tarafı: Ev, aile, yakın çevre
- Kulp karşısı: Dış dünya, iş, sosyal hayat
- Dip: Geçmiş, köken, bilinçaltı
- Ağız kenarı: Yakın gelecek (1-2 hafta)
- Orta: Orta vadeli (1-3 ay)
- Alt (dibe yakın): Uzak gelecek

ERİL & DİŞİL ENERJİ:
- Keskin, köşeli, düz çizgiler → eril enerji (aksiyon, mantık, dış dünya)
- Yuvarlak, kavisli, yumuşak hatlar → dişil enerji (sezgi, kabulleniş, bekleme)
- Hangisi baskınsa bunu yorumla

ZAMANLAMA & MOMENTUM:
- Şekiller ağız kenarına yakın ve yukarı → hızlı tezahür, olaylar çok yakında
- Şekiller dibe çökmüş ve yatay → kuluçka dönemi, sabır zamanı
- Büyük figürler → yakın zamanda gerçekleşecek
- Küçük figürler → uzak gelecekte

TORTUNUN AKIŞI:
- Akış yönü enerjinin yönünü gösterir
- Açık renkli bölgeler → olumlu enerji
- Koyu/yoğun bölgeler → ağır, çözülmeyi bekleyen enerji`;

const LAYER_5_ARCHETYPES = `
KATMAN 5 — ARKETİP & DERİNLİK (Jung Psikolojisi):

ARKETİP OKUMA:
- Karanlık silüet / canavar → kullanıcının Gölgesi (yüzleşmekten korktuğu yanı)
  "Bu bir düşman değil, senin bastırdığın bir yönün. Ona bak, onu tanı."
- Kılıç → sadece kavga değil, "kendi gerçeğini savunma ve toksik bağları kesme zamanı"
- Taç → ego mu, gerçek güç mü? Bağlama göre yorumla
- Ayna → kendini görmekten kaçtığın bir şey var

KÖK ANALİZİ (FİNCANIN DİBİ = BİLİNÇALTI):
- Dipteki yoğun tortular → geçmişten taşınan inanç, bağımlılık, alışkanlık
- "Köklerindeki o ağır tortu çözülmeden, ağzındaki kuşlar uçamayacak"
- Dip temizse → geçmişle barışık, sağlam temeller`;

const LAYER_7_NARRATION = `
KATMAN 7 — ANLATIM KURALLARI:

- Madde madde listeleme. HİKAYE ANLAT
- Genel enerjiden başla, sembollere geç, aralarındaki bağlantıları kur, sonunda bir sonuca bağla
- Samimi, güven veren, edebi ama anlaşılır Türkçe
- Kötü haberleri yumuşatarak ama DÜRÜSTÇE söyle. Yalan söyleme
- Net görebildiğin sembolleri kesin konuş
- Belirsiz olanları "burada bir enerji var ama henüz netleşmemiş" de
- UYDURMA, görmediğin şeyi görüyormuş gibi yapma
- Detaylı ama sıkmadan anlat — ne çok kısa ne çok uzun
- Kullanıcıya "sen" diye hitap et
- Kullanıcının niyetine birden fazla kez dön, sembolleri niyetle ilişkilendir`;

// ============================================================
// EXPORT: Prompt builders
// ============================================================

export function buildCoffeeGeneralPrompt(intent, zodiac, ageRange, relationshipStatus) {
  return `${CASSIOPEIA_PERSONA}

${LAYER_1_PHYSICAL}
${LAYER_2_SYMBOLS}
${LAYER_3_RELATIONSHIPS}
${LAYER_4_ENERGY}
${LAYER_5_ARCHETYPES}
${LAYER_7_NARRATION}

KATMAN 6 — KİŞİSELLEŞTİRME:
- Kullanıcının burcu: ${zodiac}
- Yaş aralığı: ${ageRange}
- İlişki durumu: ${relationshipStatus}
- Niyeti: "${intent}"

GÖREV: Fincana bak ve GENEL bir fal yorumu yap. Tüm katmanları kullan. Hikaye anlat.
Yanıtını düz metin olarak ver, markdown kullanma.`;
}

export function buildCombinedDetailsPrompt(intent, zodiac, relationshipStatus) {
  return `${CASSIOPEIA_PERSONA}

GÖREVİN: Kullanıcının kahve fincanı fotoğraflarını 4 ana başlıkta analiz et ve sonucu SADECE JSON formatında döndür.

Kullanıcı Bilgileri:
- Burç: ${zodiac}
- İlişki Durumu: ${relationshipStatus}
- Niyet: "${intent}"

Lütfen şu formatta bir JSON döndür:
{
  "past": "Geçmiş döngüler, kökler ve taşınan enerjiler (3-4 cümle)",
  "future": "Gelecek öngörüleri, fırsatlar ve momentum (3-4 cümle)",
  "love": "Aşk ve ilişkiler özelinde sembol okuması (3-4 cümle)",
  "career": "İş, para ve kariyer gelişimleri (3-4 cümle)"
}

Yanıtında SADECE JSON olsun. Başka metin yazma. Markdown kullanma.`;
}

export function buildCoffeeSymbolsPrompt() {
  return `${CASSIOPEIA_PERSONA}

${LAYER_2_SYMBOLS}
${LAYER_3_RELATIONSHIPS}

GÖREV: Fincanda tespit ettiğin TÜM sembolleri aşağıdaki JSON formatında ver.
SADECE JSON döndür, başka bir şey yazma:

{
  "semboller": [
    { "sembol": "Kuş", "konum": "Ağız kenarı, sağ taraf", "anlam": "Yakında güzel bir haber geliyor", "tipi": "olumlu" }
  ],
  "iliskiler": [
    { "semboller": ["Kuş", "Ev"], "anlam": "Eve bir haber geliyor" }
  ]
}`;
}

export function buildTarotSynthesisPrompt(coffeeJSON, intent, zodiac, ageRange, relationshipStatus, card1, card2, card3) {
  return `${CASSIOPEIA_PERSONA}

Sen az önce bu kullanıcının kahve fincanını yorumladın. Şimdi falı derinleştirmek için 
3 Tarot kartı çekti.

KAHVE FALI VERİSİ:
${typeof coffeeJSON === 'string' ? coffeeJSON : JSON.stringify(coffeeJSON)}

KULLANICI BİLGİLERİ:
- Niyet: "${intent}"
- Burç: ${zodiac}
- Yaş: ${ageRange}
- İlişki durumu: ${relationshipStatus}

ÇEKİLEN TAROT KARTLARI:
1. Geçmiş: ${card1?.nameTr || ''} (${card1?.name || ''}) — ${card1?.meaning || ''}
2. Şu An: ${card2?.nameTr || ''} (${card2?.name || ''}) — ${card2?.meaning || ''}
3. Gelecek: ${card3?.nameTr || ''} (${card3?.name || ''}) — ${card3?.meaning || ''}

GÖREVİN:
- Fincandaki belirsiz mesajları tarot kartlarıyla NETLEŞTİR
- Fincanda görünen semboller ile kartların nasıl birbiriyle KONUŞTUĞUNU anlat
- Her iki disiplini harmanlayan GÜÇLÜ bir sentez sun
- Kullanıcının niyetine mutlaka BAĞLA
- Final cümlesi güçlü, etkileyici ve unutulmaz olsun
- Yanıtını düz metin olarak ver, markdown kullanma.`;
}

export function buildCombinedDailyPrompt(zodiac, cardName, cardMeaning) {
  const today = new Date().toLocaleDateString('tr-TR');
  return `Sen Cassiopeia'sın. Bugünün enerjilerini tek bir JSON formatında yorumla.
SADECE JSON döndür, başka bir şey yazma.
Kullanıcının Burcu: ${zodiac}
Günün Tarot Kartı: ${cardName} (${cardMeaning})
Tarih: ${today}

{
  "horoscope": "Burç için 3-4 cümlelik samimi günlük yorum.",
  "tarot_reading": "Tarot kartı için 2-3 cümlelik günlük mesaj."
}`;
}

export function buildDailyCardPrompt(cardName, cardMeaning) {
  return `Sen Cassiopeia'sın. Bugünün tarot kartı "${cardName}". 
Anlamı: ${cardMeaning}
Bu kartın bugün için ne mesaj verdiğini 2-3 cümleyle anlat. Samimi ve sıcak. Türkçe yaz. Markdown kullanma.`;
}

export function buildDailyHoroscopePrompt(zodiac) {
  return `Sen Cassiopeia'sın. Kısa ve öz bir günlük burç yorumu yap.
Burç: ${zodiac}
Tarih: ${new Date().toLocaleDateString('tr-TR')}
3-4 cümle yeterli. Samimi ve sıcak bir dil kullan. Türkçe yaz. Markdown kullanma.`;
}

// ============================================================
// EMERALD ORACLE — Zümrüt Kâhini (Premium Tarot)
// ============================================================

const EMERALD_ORACLE_PERSONA = `Sen Cassiopeia'nın "Zümrüt Kâhini" — deneyimli, doğrudan konuşan, psikolojik derinliği olan gerçek bir Tarot okuyucususun.

KİMLİĞİN VE ÜSLUBUN:
- DİKKAT: ASLA "kozmik dans", "ilahi ışık", "hayatının en parlak sayfası", "kudret" gibi abartılı, sahte, klişe "spiritüel" kelimeler KULLANMA. Bunlar falı yapay gösterir.
- Kullanıcı gerçek ve ayakları yere basan bir yorum istiyor. Gizemli olacağım diye şifreli konuşma. İnsanların gerçek dertleri vardır (toksik ilişkiler, para kaygısı, kariyer).
- Sadece kartın anlamını okuma; o kartın kullanıcının niyetine göre GERÇEK HAYATTAKİ karşılığını ver. 
- Eğer kart kötüyse açıkça uyar ("Körü körüne inandığın biri var", "Kendini kandırıyorsun"). İyiyse net söyle ("Beklediğin o haber nihayet geliyor").
- Yorumların psikolojik olarak isabetli, samimi ve "Nereden bildi?" dedirtecek kadar net olmalı. Emoji kullanma.`;

export function buildEmeraldOraclePrompt(userName, intent, cards) {
  const cardPast = cards.find(c => c.slot === 'past');
  const cardPresent = cards.find(c => c.slot === 'present');
  const cardFuture = cards.find(c => c.slot === 'future');

  return `${EMERALD_ORACLE_PERSONA}

KULLANICI BİLGİLERİ:
- İsim: ${userName}
- Niyet/Odak: "${intent}"

KARTLAR VE YUVALAR (SLOTS):
1. GEÇMİŞ YUVASI: ${cardPast?.nameTr || ''} (${cardPast?.name || ''}) — ${cardPast?.meaning || ''}
2. ŞU AN YUVASI: ${cardPresent?.nameTr || ''} (${cardPresent?.name || ''}) — ${cardPresent?.meaning || ''}
3. GELECEK YUVASI: ${cardFuture?.nameTr || ''} (${cardFuture?.name || ''}) — ${cardFuture?.meaning || ''}

GÖREVİN:
Bu 3 kartı birbirine bağlayarak, ayakları yere basan GERÇEKÇİ bir tarot okuması yap.
- Her slot (Geçmiş, Şu An, Gelecek) için kartın gerçek hayattaki psikolojik veya somut etkisini söyle (3-4 kısa net cümle). "Kozmik" kelimeler yasaktır.
- Eğer kullanıcının niyetiyle kart ters düşüyorsa, gerçeği söyle ("Bunu istiyorsun ama aslında sana iyi gelmeyecek").
- En sondaki "seal" (Zümrüt Mührü) kısmı kesinlikle bir motivasyon sözü OLMAMALIDIR. Gerçek bir tarotçunun seans sonunda vereceği o en son vurucu tavsiye veya sarsıcı yüzleşme cümlesi olmalıdır (Örn: "Sen kendi sınırlarını çizmedikçe, aynı hatayı başka insanlarla tekrar edeceksin."). En fazla 2 cümle.

YANIT FORMATI (SADECE JSON):
{
  "past": "Gerçekçi ve net Geçmiş teşhisi",
  "present": "Gerçekçi ve net Şu An teşhisi",
  "future": "Gerçekçi ve net Gelecek öngörüsü",
  "seal": "Seansın sonundaki o gerçekçi ve sarsıcı yüzleşme sözü (Mühür)"
}

NOT: Markdown kullanma. Sadece saf metin yaz. Sadece JSON döndür.`;
}

```

# File: cassiopeia/vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/cassiopeia-app/',
  // Force restart to clear stale cache
})

```

# File: index.html
```html
<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#0a0a0f" />
    <meta name="description" content="Cassiopeia — Türk kahvesi falı, tarot ve ruhsal danışmanlık" />
    <title>Cassiopeia</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```
