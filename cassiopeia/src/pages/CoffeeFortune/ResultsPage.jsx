import { useState, useEffect, useRef } from 'react';
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
import SymbolsOverlay from '../../components/SymbolsOverlay';

import Typewriter from '../../components/Typewriter';

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
  const [showSymbolsOverlay, setShowSymbolsOverlay] = useState(false);
  const [detailsRevealStep, setDetailsRevealStep] = useState('idle');

  const abortControllerRef = useRef(null);
  const [revealStep, setRevealStep] = useState('symbols');

  // Pulsing Dots Component for cinematic bridge
  const PulsingDots = () => (
    <span className="pulsing-dots">
      <span></span>
      <span></span>
      <span></span>
    </span>
  );

  // Safe side effect for initial reveal
  useEffect(() => {
    // If already animated in total state, just be in typing step
    if (currentFortune?.coffeeAnimated) {
      setRevealStep('typing');
      return;
    }

    if (currentFortune?.tabData?.symbols && !currentFortune?.coffeeAnimated && !currentFortune?.symbolsAnimated && revealStep === 'symbols') {
      setShowSymbolsOverlay(true);
    }

    // Safety: If unmounted while on typing step, mark as animated to avoid re-play
    return () => {
      if (revealStep === 'typing' && !currentFortune?.coffeeAnimated) {
        dispatch({ type: 'MARK_COFFEE_ANIMATED' });
      }
    };
  }, [currentFortune?.tabData?.symbols, currentFortune?.coffeeAnimated, currentFortune?.symbolsAnimated, revealStep]); 

  // Mark details as animated when visiting details tab
  useEffect(() => {
    if (activeTab === 'details' && currentFortune?.tabData?.details) {
      dispatch({ type: 'MARK_DETAILS_ANIMATED' });
    }
  }, [activeTab, currentFortune?.tabData?.details]);



  // Mark coffee as animated ONLY when typewriter finishes
  const handleTypewriterFinish = () => {
    if (!currentFortune?.coffeeAnimated) {
      dispatch({ type: 'MARK_COFFEE_ANIMATED' });
    }
  };

  // Safe side effect for initial reveal
  useEffect(() => {
    if (currentFortune?.tabData?.symbols && !currentFortune?.coffeeAnimated && !currentFortune?.symbolsAnimated && revealStep === 'symbols') {
      setShowSymbolsOverlay(true);
    }
  }, [currentFortune?.tabData?.symbols, currentFortune?.coffeeAnimated, currentFortune?.symbolsAnimated, revealStep]); 

  // Auto-load or direct setup on mount
  useEffect(() => {
    if (activeTab === 'overview' && !currentFortune?.tabData?.symbols) {
      handleTabChange('overview');
    }

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  // Update animated flags when switching to tarot tab
  useEffect(() => {
    if (activeTab === 'tarot' && currentFortune?.synthesisResult) {
       dispatch({ type: 'MARK_SYNTHESIS_ANIMATED' });
    }
  }, [activeTab, currentFortune?.synthesisResult]);

  const TABS = [
    { id: 'overview', label: 'Genel Bakış', icon: '☕' },
    { id: 'details', label: 'Detaylı Analiz', icon: '🔍' },
    { id: 'tarot', label: 'Tarot Sentezi', icon: '🃏' },
  ];

  const handleTabChange = async (tabId) => {
    // Safety: If switching away from overview while typing, mark it as animated
    if (activeTab === 'overview' && revealStep === 'typing' && !currentFortune?.coffeeAnimated) {
      dispatch({ type: 'MARK_COFFEE_ANIMATED' });
    }

    setActiveTab(tabId);
    
    // Cinematic Reveal for Details Tab
    if (tabId === 'details') {
      if (currentFortune?.detailsAnimated) {
        setDetailsRevealStep('ready');
      } else {
        setDetailsRevealStep('shuffling');
        const needsLoading = !currentFortune?.tabData?.details;
        if (!needsLoading) {
          setTimeout(() => {
            setDetailsRevealStep('ready');
          }, 10000);
        }
      }
    }
    
    // Auto-load symbols for overview or combined details for details tab
    const needsLoading = (tabId === 'overview' && !currentFortune?.tabData?.symbols) || 
                         (tabId === 'details' && !currentFortune?.tabData?.details);
                         
    if (tabId === 'tarot') return; // Tarot specific logic is handled in render
    if (!apiKey || !needsLoading || tabLoading[tabId]) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

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
          signal,
        });
        dispatch({ type: 'SET_TAB_DATA', payload: { symbols: result } });
      } else {
        result = await callGemini(apiKey, buildCombinedDetailsPrompt(intent, zodiac, relationship), {
          images: currentFortune?.images,
          jsonMode: true,
          signal,
        });
        dispatch({ type: 'SET_TAB_DATA', payload: { details: result } });
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Yorum yükleme hatası:', err);
    }

    setTabLoading((prev) => ({ ...prev, [tabId]: false }));

    // AFTER LOAD: Start the 10s cinematic bridge timer if we just loaded details
    if (tabId === 'details') {
      setTimeout(() => {
        setDetailsRevealStep('ready');
      }, 10000);
    }
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
    // BUG FIX: Eğer sonuç yoksa ama bu sayfadaysak (muhtemelen session restore), 
    // eksik veriye göre doğru adıma geri gönderiyoruz.
    if (currentFortune?.images?.length > 0) {
      dispatch({ type: 'SET_COFFEE_STEP', payload: 'analyzing' });
    } else {
      dispatch({ type: 'SET_COFFEE_STEP', payload: 'intent' });
    }
    return <OracleLoading message="Kader yolu yeniden çiziliyor..." />;
  }

  const renderSymbolsSummary = (data) => {
    if (!data || !data.semboller) return null;
    const preview = data.semboller.slice(0, 5);
    const MYSTICAL_COLORS = [
      { bg: 'rgba(255, 215, 0, 0.15)', text: '#FFD700', border: 'rgba(255, 215, 0, 0.3)' }, // Altın
      { bg: 'rgba(224, 17, 95, 0.15)', text: '#E0115F', border: 'rgba(224, 17, 95, 0.3)' }, // Yakut
      { bg: 'rgba(80, 200, 120, 0.15)', text: '#50C878', border: 'rgba(80, 200, 120, 0.3)' }, // Zümrüt
      { bg: 'rgba(153, 102, 204, 0.15)', text: '#9966CC', border: 'rgba(153, 102, 204, 0.3)' }, // Ametist
      { bg: 'rgba(15, 82, 186, 0.15)', text: '#0F52BA', border: 'rgba(15, 82, 186, 0.3)' }, // Safir
      { bg: 'rgba(255, 127, 80, 0.15)', text: '#FF7F50', border: 'rgba(255, 127, 80, 0.3)' }  // Mercan
    ];
    
    return (
      <div 
        className="symbols-summary-card stagger-item" 
        onClick={() => setShowSymbolsOverlay(true)}
        style={{ animationDelay: '0.2s' }}
      >
        <div className="summary-left">
          <span className="material-symbols-outlined star-glow">flare</span>
          <div className="summary-text">
            <strong>Gördüğüm Semboller</strong>
            <p>{data.semboller.length} sembol ve derin ilişkiler analiz edildi.</p>
          </div>
        </div>
        <div className="summary-preview">
          {preview.map((s, i) => (
             <span 
               key={i} 
               className="preview-chip"
               style={{ 
                backgroundColor: MYSTICAL_COLORS[i % MYSTICAL_COLORS.length].bg,
                color: MYSTICAL_COLORS[i % MYSTICAL_COLORS.length].text,
                border: `1px solid ${MYSTICAL_COLORS[i % MYSTICAL_COLORS.length].border}`,
                fontWeight: 'bold'
              }}
             >
               {s.sembol}
             </span>
          ))}
          <span className="material-symbols-outlined arrow-icon">chevron_right</span>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (activeTab === 'overview') {
      const symbolsData = currentFortune?.tabData?.symbols;
      
      return (
        <div className="overview-tab-content">
          {tabLoading.overview ? (
            <div className="mini-loader">Semboller okunuyor...</div>
          ) : (
            renderSymbolsSummary(symbolsData)
          )}
          
          <div 
            className="synergy-card stagger-item interactive" 
            onClick={() => setActiveTab('details')}
            style={{ animationDelay: '0.6s', cursor: 'pointer' }}
          >
            <span className="material-symbols-outlined star-glow">nights_stay</span>
            <div className="synergy-text">
              <strong>Derinlere Dal</strong>
              <p>Sadece bir fincan değil, bir yolculuk. Hayatının dönüm noktalarını detaylarda keşfetmek ve Tarot'un bilgeliğiyle kaderini mühürlemek için derinlere dal.</p>
            </div>
          </div>
          
          <div className="divider"></div>
          
          {revealStep === 'typing' && (
            <div className="scrollable-interpretation stagger-item" style={{ animationDelay: '0.2s' }}>
              <Typewriter 
                className="result-text" 
                key={currentFortune?.coffeeResult?.general}
                text={currentFortune?.coffeeResult?.general || 'Yorum bulunamadı.'} 
                animate={!currentFortune?.coffeeAnimated}
                speed={35}
                initialDelay={currentFortune?.coffeeAnimated ? 0 : 200}
                onFinish={handleTypewriterFinish}
              />
            </div>
          )}

          <div className="divider"></div>
        </div>
      );
    }

    if (activeTab === 'details') {
      if (tabLoading.details) {
        return <OracleLoading message="Derin detaylara iniliyor..." />;
      }
      
      if (detailsRevealStep === 'shuffling') {
        return (
          <div className="stagger-item shamanic-bridge">
            <span className="material-symbols-outlined bridge-icon">insights</span>
            <p className="oracle-ritual-text">
              Kâhin kaderinin ayrıntılarına iniyor
              <PulsingDots />
            </p>
          </div>
        );
      }

      const d = currentFortune?.tabData?.details;
      if (!d) return <p className="result-text faded" style={{ textAlign: 'center' }}>Detayları yüklemek için bekleyin...</p>;

      const isAnimated = currentFortune?.detailsAnimated;
      
      return (
        <div className="details-vertical-list">
          <div className="detail-card stagger-item" style={{ animationDelay: isAnimated ? '0s' : '0s' }}>
            <h3>⏪ Geçmiş</h3>
            <p>{d.past}</p>
          </div>
          <div className="detail-card stagger-item" style={{ animationDelay: isAnimated ? '0s' : '2.5s' }}>
            <h3>⏩ Gelecek</h3>
            <p>{d.future}</p>
          </div>
          <div className="detail-card stagger-item" style={{ animationDelay: isAnimated ? '0s' : '5s' }}>
            <h3>💕 Aşk</h3>
            <p>{d.love || 'Aşk hayatınızda derin bir sessizlik ve gözlem süreci hakim.'}</p>
          </div>
          <div className="detail-card stagger-item" style={{ animationDelay: isAnimated ? '0s' : '7.5s' }}>
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

          {syn && (
            <Typewriter 
              key={syn}
              className="result-text" 
              text={syn} 
              animate={!currentFortune?.synthesisAnimated}
            />
          )}
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

      <div className="qa-section premium-locked stagger-item" style={{ animationDelay: '1.2s' }}>
        <div className="locked-overlay">
          <div className="premium-badge-alt">
            <span className="material-symbols-outlined">lock_person</span>
            <span>Premium: Kâhine Soru Sor</span>
          </div>
          <p className="locked-hint">Bu özellik sadece Cassiopeia Premium üyeleri içindir.</p>
        </div>
        <h4 className="qa-title">Soru Sor</h4>
        {qaMessages.map((msg, i) => (
          <div key={i} className={`qa-message ${msg.role}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {qaLoading && <p className="qa-loading">Cassiopeia düşünüyor...</p>}
        <form onSubmit={(e) => e.preventDefault()} className="qa-form">
          <input
            type="text"
            placeholder="Fala dair bir sorun var mı?"
            className="qa-input"
            disabled
          />
          <button type="submit" className="qa-send" disabled>
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>

      <button className="synthesis-cta stagger-item" style={{ animationDelay: '1.4s' }} onClick={() => handleTabChange('tarot')}>
        <span className="material-symbols-outlined">flare</span>
        <div>
          <strong>Sentez: Büyük Resmi Gör</strong>
          <p>{currentFortune?.synthesisResult ? 'Sentez sonucunu incele' : '3 Tarot kartı çekerek falını derinleştir'}</p>
        </div>
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>

      <button className="finish-fortune-btn stagger-item" style={{ animationDelay: '1.6s' }} onClick={() => { 
        dispatch({ type: 'SAVE_TO_HISTORY' }); 
        dispatch({ type: 'RESET_FORTUNE' }); 
        navigate('/fallar');
      }}>
        <span className="material-symbols-outlined">done_all</span>
        Falı Kaydet ve Bitir
      </button>

      <ImageModal src={zoomedImage} onClose={() => setZoomedImage(null)} />
      
      {showSymbolsOverlay && (
        <SymbolsOverlay 
          data={currentFortune?.tabData?.symbols} 
          isAnimated={currentFortune?.symbolsAnimated}
          onClose={() => {
            setShowSymbolsOverlay(false);
            if (!currentFortune?.symbolsAnimated) {
              dispatch({ type: 'MARK_SYMBOLS_ANIMATED' });
            }
            // Start typing exactly when the user closes the overlay
            if (revealStep === 'symbols' || revealStep === 'shuffling') {
              setRevealStep('typing');
            }
          }} 
        />
      )}
    </div>
  );
}

export default ResultsPage;