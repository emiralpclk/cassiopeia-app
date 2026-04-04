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
    switch (currentFortune.coffeeStep) {
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
  const currentIndex = steps.indexOf(currentFortune.coffeeStep);

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