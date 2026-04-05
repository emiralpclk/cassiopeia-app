import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import AppContent from './AppContent';
import tarotBack from './assets/tarot_back_mockup.png';
import './index.css';

export default function App() {
  const basename = import.meta.env.BASE_URL;
  
  useEffect(() => {
    document.documentElement.style.setProperty('--tarot-back-mockup', `url(${tarotBack})`);
  }, []);

  return (
    <BrowserRouter basename={basename}>
      <AppProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </AppProvider>
    </BrowserRouter>
  );
}