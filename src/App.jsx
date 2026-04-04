import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import AppContent from './AppContent';
import './index.css';

export default function App() {
  const basename = import.meta.env.DEV ? "/" : "/cassiopeia2-app";
  
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