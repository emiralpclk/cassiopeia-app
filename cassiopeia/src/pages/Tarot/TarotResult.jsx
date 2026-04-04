import { useState, useEffect, useRef } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { TAROT_SLOTS } from '../../utils/constants';
import { callGemini } from '../../services/gemini';
import { buildEmeraldOraclePrompt } from '../../utils/prompts';
import OracleLoading from '../../components/OracleLoading';
import Typewriter from '../../components/Typewriter';

export default function TarotResult() {
  const { currentFortune, apiKey } = useAppState();
  const dispatch = useAppDispatch();
  const { selectedTarotCards, tarotIntent, tarotResult, tarotAnimated } = currentFortune || {};
  
  const [resultData, setResultData] = useState(tarotResult || null);
  const [loading, setLoading] = useState(!tarotResult);
  const [revealStep, setRevealStep] = useState(tarotAnimated ? 'complete' : 'ritual'); // ritual, past, present, future, complete
  const [error, setError] = useState(null);
  const hasRequested = useRef(false);

  useEffect(() => {
    if (!tarotIntent?.userName || !selectedTarotCards?.length) {
      dispatch({ type: 'SET_TAROT_STEP', payload: 'intent' });
      return;
    }

    let isMounted = true;
    
    if (!apiKey || !selectedTarotCards?.length || !tarotIntent) {
      setLoading(false);
      return;
    }

    if (tarotResult) {
      setResultData(tarotResult);
      setLoading(false);
      if (tarotAnimated) setRevealStep('complete');
      else setRevealStep('past');
      return;
    }

    if (hasRequested.current) return;
    hasRequested.current = true;

    const actualIntent = tarotIntent?.intent || '';
    const actualUserName = tarotIntent?.userName || 'Gezgin';

    const getReading = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const prompt = buildEmeraldOraclePrompt(actualUserName, actualIntent, selectedTarotCards);
        const startTime = Date.now();
        const result = await callGemini(apiKey, prompt, { jsonMode: true });
        
        // Mistik Ritüel Süresi (Min 10 saniye ritual)
        const elapsed = Date.now() - startTime;
        if (elapsed < 10000) {
          await new Promise(resolve => setTimeout(resolve, 10000 - elapsed));
        }
        
        if (isMounted) {
          setResultData(result);
          dispatch({ type: 'SET_TAROT_RESULT', payload: result });
          setLoading(false);
          setRevealStep('past');
        }
      } catch (err) {
        console.error("Gemini Tarot Error:", err);
        if (isMounted) setError(err.message || "Kâhin'e ulaşılamıyor.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    getReading();
    return () => { 
      isMounted = false; 
      hasRequested.current = false;
    };
  }, [apiKey, selectedTarotCards, tarotIntent, tarotResult, tarotAnimated]);

  // Safety: If unmounted while results are visible but not marked as animated, mark it
  // This prevents the typewriter from restarting if the user navigates away mid-typing.
  useEffect(() => {
    return () => {
      if (revealStep !== 'ritual' && !tarotAnimated) {
        dispatch({ type: 'MARK_TAROT_ANIMATED' });
      }
    };
  }, [revealStep, tarotAnimated, dispatch]);

  // Handle step transitions
  const handleStepFinish = (step) => {
    if (step === 'past') setRevealStep('present');
    else if (step === 'present') setRevealStep('future');
    else if (step === 'future') {
      setRevealStep('complete');
      dispatch({ type: 'MARK_TAROT_ANIMATED' });
      
      // Auto-save tarot to history when ritual is complete
      dispatch({ 
        type: 'SAVE_TO_HISTORY', 
        payload: { type: 'tarot' } 
      });
    }
  };

  const TarotRitual = () => (
    <div className="tarot-ritual-container fade-in">
      <div className="tarot-shuffling-deck">
        <div className="ritual-card"><i className="material-symbols-outlined">auto_awesome</i></div>
        <div className="ritual-card"><i className="material-symbols-outlined">flare</i></div>
        <div className="ritual-card"><i className="material-symbols-outlined">style</i></div>
      </div>
      <h2 className="emerald-glow-text">Kâhin Büyük Resmi Görüyor...</h2>
      <p className="oracle-ritual-text" style={{ marginTop: '10px' }}>Yorumun mistik bir dille şekilleniyor.</p>
    </div>
  );

  if (error) {
    return (
      <div className="page tarot-results-page fade-in" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--negative)' }}>error</span>
        <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>{error}</p>
        <button onClick={() => window.location.reload()} className="step-button">Yeniden Dene</button>
      </div>
    );
  }

  if (loading || revealStep === 'ritual') {
    return (
      <div className="page tarot-results-page">
        <div className="page-header" style={{ textAlign: 'center' }}>
          <h1 className="page-title emerald-glow-text" style={{ fontSize: '24px' }}>Zümrüt Okuması</h1>
          <p className="page-subtitle">Ritüel Başladı...</p>
        </div>
        <TarotRitual />
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
        {TAROT_SLOTS.map((slot, index) => {
          const card = selectedTarotCards.find(c => c.slot === slot.id);
          const steps = ['past', 'present', 'future'];
          const currentStepIndex = steps.indexOf(revealStep);
          const slotStepIndex = steps.indexOf(slot.id);
          
          const isVisible = revealStep === 'complete' || slotStepIndex <= currentStepIndex;
          const shouldAnimate = !tarotAnimated && revealStep === slot.id;

          if (!isVisible) return null;

          return (
            <div key={slot.id} className="detail-card-row fade-in" style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--accent)', fontSize: '20px' }}>{slot.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)' }}>{slot.nameTr}</span>
                {card && <span className="fade-in" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>— {card.nameTr}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Card Image */}
                <div className={shouldAnimate ? 'mystical-reveal' : 'fade-in'} style={{ 
                  width: '100px', 
                  height: '160px', 
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid var(--accent-glow)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                }}>
                  {card && <img src={card.img} alt={card.nameTr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>

                {/* Interpretation */}
                <div className="result-text" style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-primary)' }}>
                  <Typewriter 
                    key={slot.id}
                    text={resultData?.[slot.id] || resultData?.[slot.nameTr.toLowerCase()] || "Kâhin sessiz..."}
                    animate={shouldAnimate}
                    speed={25}
                    onFinish={() => handleStepFinish(slot.id)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Synthesis Seal */}
      {revealStep === 'complete' && resultData?.seal && (
        <div className="emerald-seal fade-in" style={{ 
          marginTop: '60px', 
          padding: '32px', 
          background: 'rgba(80, 200, 120, 0.05)', 
          border: '1px solid #50C878', 
          borderRadius: '16px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 30px rgba(80, 200, 120, 0.2)',
          textAlign: 'center'
        }}>
          <div className="emerald-seal-aura"></div>
          <span className="material-symbols-outlined star-glow" style={{ fontSize: '32px', color: '#50C878', marginBottom: '16px' }}>flare</span>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#50C878', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Zümrüt Mührü</h3>
          <Typewriter 
            text={resultData?.seal || resultData?.muhur || "Kaderin mühürlendi."}
            animate={!tarotAnimated}
            speed={30}
          />
        </div>
      )}

      {revealStep === 'complete' && (
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
