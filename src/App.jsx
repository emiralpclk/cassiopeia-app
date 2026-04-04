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