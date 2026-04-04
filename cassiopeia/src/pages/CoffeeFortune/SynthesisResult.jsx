import { useEffect, useState, useRef } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { callGemini } from '../../services/gemini';
import { buildTarotSynthesisPrompt } from '../../utils/prompts';
import OracleLoading from '../../components/OracleLoading';
import Typewriter from '../../components/Typewriter';

function SynthesisResult() {
  const { currentFortune, apiKey, user } = useAppState();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const hasRequested = useRef(false);

  useEffect(() => {
    if (Array.isArray(currentFortune?.selectedTarotCards) && currentFortune.selectedTarotCards.length === 3 && !currentFortune.synthesisResult) {
      if (hasRequested.current) return;
      hasRequested.current = true;
      runSynthesis();
    } else if (currentFortune?.synthesisResult) {
      setLoading(false);
      // Mark as animated if we already have the result (e.g. coming back)
      if (!currentFortune.synthesisAnimated) {
        dispatch({ type: 'MARK_SYNTHESIS_ANIMATED' });
      }
    }
    
    return () => {
      hasRequested.current = false;
    };
  }, []);

  // Also mark as animated when we successfully get a new result
  useEffect(() => {
    if (currentFortune?.synthesisResult && !currentFortune?.synthesisAnimated) {
      dispatch({ type: 'MARK_SYNTHESIS_ANIMATED' });
    }
  }, [currentFortune?.synthesisResult]);

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

  // Safety guard if still no result or still loading
  if (!currentFortune?.synthesisResult) {
    return (
      <div className="fortune-step synthesis-step" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <p className="result-text faded" style={{ textAlign: 'center' }}>Sentez sonucu kâhin tarafından hazırlanıyor...</p>
        {loading && <OracleLoading message="Derin ruhlar harmanlanıyor..." />}
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
          <div key={i} className="mini-card stagger-item" style={{ animationDelay: `${i * 0.2}s` }}>
            {card?.img ? (
              <img src={card.img} alt={card?.nameTr || 'Kart'} />
            ) : (
              <span className="material-symbols-outlined">style</span>
            )}
          </div>
        ))}
      </div>

      <div className="synthesis-content">
        {currentFortune?.synthesisResult && (
          <Typewriter 
            key={currentFortune.synthesisResult}
            className="result-text" 
            text={currentFortune.synthesisResult} 
            animate={!currentFortune?.synthesisAnimated}
            speed={30}
          />
        )}
      </div>

      <div className="synthesis-actions">
        <button className="step-button synthesis-back-btn" onClick={() => dispatch({ type: 'GO_BACK_TO_RESULTS' })}>
          <span className="material-symbols-outlined">arrow_back</span>
          Falıma Geri Dön
        </button>
      </div>
    </div>
  );
}

export default SynthesisResult;