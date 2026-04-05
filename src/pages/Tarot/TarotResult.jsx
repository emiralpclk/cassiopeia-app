import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { TAROT_SLOTS } from '../../utils/constants';
import { callGemini } from '../../services/gemini';
import { buildEmeraldOraclePrompt } from '../../utils/prompts';
import { getMockTarotResult } from '../../services/mockData';
import OracleLoading from '../../components/OracleLoading';
import Typewriter from '../../components/Typewriter';

export default function TarotResult() {
  const { currentFortune, apiKey, isTestMode } = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedTarotCards, tarotIntent, tarotResult, tarotAnimated } = currentFortune || {};
  
  const [resultData, setResultData] = useState(tarotResult || null);
  const [loading, setLoading] = useState(!tarotResult);
  const [revealStep, setRevealStep] = useState(tarotAnimated ? 'complete' : 'ritual'); // ritual, past, present, future, complete
  const [showRitual, setShowRitual] = useState(true);
  const [minWaitDone, setMinWaitDone] = useState(false);
  const [error, setError] = useState(null);
  const hasRequested = useRef(false);

  useEffect(() => {
    if (!tarotIntent?.userName || !selectedTarotCards?.length) {
      dispatch({ type: 'SET_TAROT_STEP', payload: 'intent' });
      return;
    }

    // If we already have a result, just show it
    if (tarotResult) {
      setResultData(tarotResult);
      if (tarotAnimated) {
        setLoading(false);
        setMinWaitDone(true);
        setShowRitual(false);
        setRevealStep('complete');
      }
    }

    // Minimum Ritual Wait Timer
    const ritualTime = isTestMode ? 2000 : 10000;
    const timer = setTimeout(() => {
      setMinWaitDone(true);
    }, ritualTime);

    // Initial Fetch (only if no result)
    if (!tarotResult && !hasRequested.current) {
      hasRequested.current = true;
      const actualIntent = tarotIntent?.intent || '';
      const actualUserName = tarotIntent?.userName || 'Gezgin';

      const fetchResult = async () => {
        try {
          setLoading(true);
          setError(null);
          
          let result;
          if (isTestMode) {
            await new Promise(r => setTimeout(r, 2000));
            result = getMockTarotResult(actualUserName);
          } else {
            const prompt = buildEmeraldOraclePrompt(actualUserName, actualIntent, selectedTarotCards);
            result = await callGemini(apiKey, prompt, { jsonMode: true });
          }

          setResultData(result);
          dispatch({ type: 'SET_TAROT_RESULT', payload: result });
          dispatch({ type: 'SAVE_TO_HISTORY', payload: { type: 'tarot' } });
          setLoading(false);
        } catch (err) {
          console.error("Tarot Logic Error:", err);
          setError(err.message || "Kâhin'e ulaşılamıyor.");
          setLoading(false);
        }
      };
      fetchResult();
    }

    return () => clearTimeout(timer);
  }, [apiKey, isTestMode, tarotResult, tarotAnimated]); // Simplified deps

  // Reveal Logic
  useEffect(() => {
    if (!loading && resultData && minWaitDone && showRitual && !error) {
      setShowRitual(false);
      setRevealStep('past');
    }
  }, [loading, resultData, minWaitDone, showRitual, error]);

  const TarotRitual = () => (
    <div className="tarot-ritual-container fade-in" style={{ padding: '20px', textAlign: 'center' }}>
      <div className="tarot-shuffling-deck">
        <div className="mystic-orb elegant ritual-card-slow-1"></div>
        <div className="mystic-orb elegant ritual-card-slow-2"></div>
        <div className="mystic-orb elegant ritual-card-slow-3"></div>
      </div>
      <h2 className="emerald-glow-text" style={{ fontSize: '24px', marginTop: '40px' }}>Kâhin Büyük Resmi Görüyor...</h2>
      <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '14px', fontStyle: 'italic' }}>
        Zümrüt Mührü ile kaderin mühürlenirken biraz bekle...
      </p>
    </div>
  );

  if (error) {
    return (
      <div className="page tarot-results-page fade-in" style={{ textAlign: 'center', paddingTop: '100px', padding: '40px' }}>
        <div style={{ background: 'rgba(255, 100, 100, 0.05)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255, 100, 100, 0.2)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#FF6B6B' }}>history_edu</span>
          <h2 style={{ color: '#FF6B6B', marginTop: '20px', fontSize: '20px' }}>Mistik Bir Bağlantı Hatası</h2>
          <p style={{ marginTop: '12px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
            {error === 'JSON_PARSING_ERROR' ? "Kâhin mesajını iletti ama mühür netleşmedi. Lütfen tekrar dene." : error}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '32px' }}>
            <button onClick={() => window.location.reload()} className="step-button" style={{ padding: '12px 24px' }}>Tekrar Dene</button>
            <button onClick={() => {
              dispatch({ type: 'RESET_FORTUNE' });
              navigate('/fallar');
            }} className="step-button secondary" style={{ padding: '12px 24px' }}>Kartlara Dön</button>
          </div>
        </div>
      </div>
    );
  }

  // Handle step transitions
  const handleStepFinish = (step) => {
    if (step === 'past') setRevealStep('present');
    else if (step === 'present') setRevealStep('future');
    else if (step === 'future') {
      setRevealStep('complete');
      dispatch({ type: 'MARK_TAROT_ANIMATED' });
    }
  };

  if (showRitual) {
    return (
      <div className="page tarot-results-page" style={{ overflow: 'hidden' }}>
        <div className="page-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="page-title emerald-glow-text" style={{ fontSize: '24px' }}>Zümrüt Okuması</h1>
          <p className="page-subtitle">Ritüel Devam Ediyor...</p>
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
                {card && <span className="fade-in" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)', marginLeft: '8px' }}>— {card.nameTr}</span>}
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
          onClick={() => {
            dispatch({ type: 'RESET_FORTUNE' });
            navigate('/fallar');
          }}
          className="step-button secondary" 
          style={{ width: '100%', marginTop: '60px' }}
        >
          Masadan Ayrıl
        </button>
      )}
    </div>
  );
}
