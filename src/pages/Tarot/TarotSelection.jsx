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
          return prev + 0.5; // ~4 saniye sürecek (20ms * 200 adım)
        });
      }, 20);
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
            transform: isHolding ? undefined : 'scale(1)', 
            transition: 'all 0.2s', 
            boxShadow: isHolding ? undefined : 'none',
            border: `1px solid ${isHolding ? 'var(--accent)' : 'var(--border)'}`,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none'
          }}
        >
          <span className="material-symbols-outlined" style={{ 
            fontSize: '40px', 
            color: isHolding ? 'var(--accent)' : 'var(--text-muted)', 
            transition: 'color 0.2s',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}>fingerprint</span>
        </div>
      </div>

      {/* Bottom Shuffling Deck */}
      <div className="tarot-shuffling-deck" style={{ marginTop: '40px', marginBottom: '40px' }}>
        {/* Left Card */}
        <div className={`tarot-card-modern ${isHolding ? 'ritual-card-fast-1' : ''}`} style={{
          position: 'absolute',
          width: '80px', height: '130px',
          transform: isHolding ? undefined : 'rotate(-12deg) translateX(-35px)',
          transition: 'transform 0.4s ease'
        }}>
          <div className="tarot-card-shimmer"></div>
        </div>
        
        {/* Center Card */}
        <div className={`tarot-card-modern ${isHolding ? 'ritual-card-fast-2' : ''}`} style={{
          position: 'absolute',
          width: '80px', height: '130px',
          transform: isHolding ? undefined : 'rotate(0deg)',
          zIndex: 2,
          transition: 'transform 0.4s ease',
        }}>
          <div className="tarot-card-shimmer"></div>
        </div>

        {/* Right Card */}
        <div className={`tarot-card-modern ${isHolding ? 'ritual-card-fast-3' : ''}`} style={{
          position: 'absolute',
          width: '80px', height: '130px',
          transform: isHolding ? undefined : 'rotate(12deg) translateX(35px)',
          transition: 'transform 0.4s ease'
        }}>
          <div className="tarot-card-shimmer"></div>
        </div>
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
          const selectedIndex = selectedCards.findIndex(c => c.id === card.id);
          const isSelected = selectedIndex !== -1;
          const xMove = selectedIndex === 0 ? -120 : selectedIndex === 2 ? 120 : 0;
          const angle = (index - 10.5) * 6; // Fan out 22 cards tighter

          return (
            <div 
              key={card.id}
              className="tarot-card-modern"
              onClick={() => handleCardSelect(card)}
              style={{
                position: 'absolute',
                width: '60px', 
                height: '95px',
                cursor: isSelected ? 'default' : 'pointer',
                transformOrigin: '50% 280px', 
                transform: `translateX(calc(-50% + ${isSelected ? xMove : 0}px)) rotate(${isSelected ? 0 : angle}deg) ${isSelected ? 'translateY(400px) scale(0)' : ''}`, 
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isSelected ? 0 : 1,
                zIndex: 22 - index,
                left: '50%',
                top: '20px',
              }}
            >
              <div className="tarot-card-shimmer"></div>
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
              <div className={card ? "" : "tarot-card-modern"} style={{
                width: '100px',
                height: '160px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: card ? '0 8px 24px rgba(0,0,0,0.3)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                border: card ? '1px solid var(--accent)' : '1px solid var(--border)',
              }}>
                {!card && <div className="tarot-card-shimmer"></div>}
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
