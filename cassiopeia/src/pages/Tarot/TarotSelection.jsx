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
