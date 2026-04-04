import React, { useEffect } from 'react';

const SymbolsOverlay = ({ data, isAnimated, onClose }) => {
  // Prevent body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!data || typeof data !== 'object') {
    return (
      <div className="symbols-overlay-backdrop fade-in" onClick={onClose}>
        <div className="symbols-overlay-content" onClick={(e) => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <div style={{ textAlign: 'center' }}>
            <span className="material-symbols-outlined star-glow pulsing-dots" style={{ fontSize: '48px', color: 'var(--accent)' }}>auto_awesome</span>
            <h3 style={{ color: 'var(--text-primary)', marginTop: '20px', fontFamily: 'Outfit' }}>Kâhin Sembolleri Okuyor...</h3>
          </div>
        </div>
      </div>
    );
  }

  const totalSymbols = (data?.semboller?.length || 0);
  const delay = isAnimated ? 0 : 1.5; // Increased to 1.5s reveal
  const staggerClass = isAnimated ? '' : 'mystical-reveal';

  const MYSTICAL_COLORS = [
    { bg: 'rgba(255, 215, 0, 0.15)', text: '#FFD700', border: 'rgba(255, 215, 0, 0.3)' }, // Altın
    { bg: 'rgba(224, 17, 95, 0.15)', text: '#E0115F', border: 'rgba(224, 17, 95, 0.3)' }, // Yakut
    { bg: 'rgba(80, 200, 120, 0.15)', text: '#50C878', border: 'rgba(80, 200, 120, 0.3)' }, // Zümrüt
    { bg: 'rgba(153, 102, 204, 0.15)', text: '#9966CC', border: 'rgba(153, 102, 204, 0.3)' }, // Ametist
    { bg: 'rgba(15, 82, 186, 0.15)', text: '#0F52BA', border: 'rgba(15, 82, 186, 0.3)' }, // Safir
    { bg: 'rgba(255, 127, 80, 0.15)', text: '#FF7F50', border: 'rgba(255, 127, 80, 0.3)' }  // Mercan
  ];

  return (
    <div className="symbols-overlay-backdrop fade-in" onClick={onClose}>
      <div className="symbols-overlay-content" onClick={(e) => e.stopPropagation()}>
        <div className="overlay-header">
          <button className="overlay-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
            Geri Dön
          </button>
          <h2 className="overlay-title">Sembol Odası</h2>
          <p className="overlay-subtitle">Fincandaki gizli işaretlerin derin anlamları</p>
        </div>

        <div className="symbols-list-expanded">
          {Array.isArray(data?.semboller) && data.semboller.map((s, i) => (
            <div 
              key={i} 
              className={`symbol-item-expanded ${staggerClass}`}
              style={{ animationDelay: `${i * 1.5}s` }}
            >
              <div className="symbol-header">
                <span 
                  className="symbol-badge"
                  style={{ 
                    backgroundColor: MYSTICAL_COLORS[i % MYSTICAL_COLORS.length].bg,
                    color: MYSTICAL_COLORS[i % MYSTICAL_COLORS.length].text,
                    border: `1px solid ${MYSTICAL_COLORS[i % MYSTICAL_COLORS.length].border}`,
                    textShadow: '0 0 10px rgba(0,0,0,0.5)',
                    fontWeight: 'bold'
                  }}
                >
                  {s?.sembol || 'Belirsiz'}
                </span>
                <span className="symbol-location">{s?.konum || ''}</span>
              </div>
              <p className="symbol-meaning">{s?.anlam || ''}</p>
            </div>
          ))}

          {Array.isArray(data?.iliskiler) && data.iliskiler.length > 0 && (
            <div className="symbol-relations-expanded">
              <h4 className="relations-title stagger-item" style={{ animationDelay: `${totalSymbols * delay}s` }}>
                Sembol İlişkileri
              </h4>
              {data.iliskiler.map((r, i) => (
                <div 
                  key={i} 
                  className={`relation-item-expanded ${staggerClass}`}
                  style={{ animationDelay: `${(totalSymbols + i + 1) * delay}s` }}
                >
                  <span className="relation-symbols">
                    {Array.isArray(r?.semboller) ? r.semboller.join(' + ') : ''}:
                  </span>
                  {' '}
                  <span className="relation-meaning">{r?.anlam || ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymbolsOverlay;
