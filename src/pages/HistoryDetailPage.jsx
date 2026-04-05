import { useParams, useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import { useState } from 'react';
import ImageModal from '../components/ImageModal';

export default function HistoryDetailPage() {
  const { index } = useParams();
  const navigate = useNavigate();
  const { history } = useAppState();
  const [activeTab, setActiveTab] = useState('overview');
  const [zoomedImage, setZoomedImage] = useState(null);

  const fortune = history[parseInt(index)];

  if (!fortune) {
    return (
      <div className="page history-detail-page">
        <div className="error-container">
          <span className="material-symbols-outlined">error</span>
          <h3>Fal bulunamadı</h3>
          <button className="step-button" onClick={() => navigate('/gecmis')}>Geçmişe Dön</button>
        </div>
      </div>
    );
  }

  // Dynamic Tabs based on fortune type
  const TABS = fortune.type === 'coffee' ? [
    { id: 'overview', label: 'Genel Bakış', icon: '☕' },
    { id: 'details', label: 'Detaylı Analiz', icon: '🔍' },
    { id: 'tarot', label: 'Tarot Sentezi', icon: '🃏' },
  ] : [
    { id: 'tarot', label: 'Tarot Okuması', icon: 'style' }
  ];

  // Default to tarot for standalone tarot
  const effectiveTab = (fortune.type === 'tarot' && activeTab === 'overview') ? 'tarot' : activeTab;

  const renderTabContent = () => {
    switch (effectiveTab) {
      case 'overview':
        const generalText = typeof fortune.coffeeResult === 'string' 
          ? fortune.coffeeResult 
          : (fortune.coffeeResult?.general || 'Yorum bulunamadı.');

        return (
          <div className="tab-content overview-tab animate-fadeIn">
            <div className="intent-box-mini">
              <span className="material-symbols-outlined">flare</span>
              <div className="intent-text-wrapper">
                <span className="intent-label">Niyetin</span>
                <p>"{fortune.intent || 'Genel Niyet'}"</p>
              </div>
            </div>

            {fortune.coffeeResult?.symbols && typeof fortune.coffeeResult !== 'string' && (
              <div className="symbols-section">
                <div className="section-header-mini">Semboller</div>
                <div className="symbols-list-vertical">
                  {fortune.coffeeResult.symbols.semboller?.map((s, i) => (
                    <div key={i} className="symbol-item-mini">
                      <span className="symbol-name">{s.ad}</span>
                      <span className="symbol-meaning">{s.anlam}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="divider-glow"></div>
            <div className="general-reading">
              <p className="result-text">{generalText}</p>
            </div>
          </div>
        );

      case 'details':
        const details = fortune.coffeeResult?.details;
        if (!details) return (
          <div className="empty-state-history">
            <span className="material-symbols-outlined">info</span>
            <p>Detaylı analiz bu eski falda bulunmuyor.</p>
          </div>
        );
        
        return (
          <div className="tab-content details-tab animate-fadeIn">
            <div className="details-vertical-list">
              {[
                { title: 'Geçmişin İzleri', text: details.gecmis, icon: 'history' },
                { title: 'Gelecek Işığı', text: details.gelecek, icon: 'flare' },
                { title: 'Aşk ve Bağlar', text: details.ask, icon: 'favorite' },
                { title: 'Kariyer ve Güç', text: details.kariyer, icon: 'work' },
              ].map((item, i) => (
                <div key={i} className="detail-card-glass">
                  <div className="detail-card-header">
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <h4>{item.title}</h4>
                  </div>
                  <p>{item.text || 'Bu bölüme dair veri bulunamadı.'}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'tarot':
        // Handle BOTH synthesis and standalone tarot
        const isStandalone = fortune.type === 'tarot';
        const cardSource = fortune.tarotCards || [];
        
        if (!cardSource.length && !fortune.synthesisResult && !fortune.tarotResult) return (
          <div className="empty-state">
            <span className="material-symbols-outlined">style</span>
            <p>Bu falda Tarot verisi bulunmuyor.</p>
          </div>
        );

        return (
          <div className="tab-content tarot-tab animate-fadeIn">
            <div className="intent-box-mini">
              <span className="material-symbols-outlined">flare</span>
              <div className="intent-text-wrapper">
                <span className="intent-label">{isStandalone ? 'Niyetin' : 'Tarot Niyeti'}</span>
                <p>"{fortune.intent || 'Genel Niyet'}"</p>
              </div>
            </div>

            <div className="synthesis-badge">{isStandalone ? 'Zümrüt Okuması' : 'Kahve Sentezi'}</div>
            
            <div className="synthesis-cards-mini">
              {cardSource.map((card, i) => (
                <div key={i} className={card?.img ? "mini-card" : "mini-card tarot-card-modern"} onClick={() => card?.img && setZoomedImage(card.img)}>
                  {card?.img ? (
                    <img src={card.img} alt={card?.nameTr} />
                  ) : (
                    <div className="tarot-card-shimmer"></div>
                  )}
                  <p className="card-mini-name">{card?.nameTr}</p>
                </div>
              ))}
            </div>

            {isStandalone ? (
              <div className="tarot-history-details">
                {[
                  { id: 'past', label: 'Geçmiş', icon: 'history' },
                  { id: 'present', label: 'Şu An', icon: 'visibility' },
                  { id: 'future', label: 'Gelecek', icon: 'auto_awesome' }
                ].map(slot => (
                  <div key={slot.id} className="history-detail-card">
                    <div className="detail-card-header">
                      <span className="material-symbols-outlined">{slot.icon}</span>
                      <h4>{slot.label}</h4>
                    </div>
                    <p className="result-text">{fortune.tarotResult?.[slot.id] || "Kâhin bu bölüme sessiz kalmış."}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="result-text-container-mini">
                 <p className="result-text">{typeof fortune.synthesisResult === 'string' ? fortune.synthesisResult : 'Yorum detaylandırılıyor...'}</p>
              </div>
            )}

            {isStandalone && fortune.tarotResult?.seal && (
              <div className="emerald-seal-mini" style={{ 
                marginTop: '32px', 
                padding: '24px', 
                background: 'rgba(80, 200, 120, 0.11)', 
                border: '1px solid #50C878', 
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 0 20px rgba(80, 200, 120, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div className="emerald-seal-aura"></div>
                <span className="material-symbols-outlined" style={{ color: '#50C878', marginBottom: '8px' }}>flare</span>
                <h4 style={{ color: '#50C878', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Zümrüt Mührü</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontStyle: 'italic' }}>{fortune.tarotResult.seal}</p>
              </div>
            )}
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="page history-detail-page scroll-container">
      <div className="page-header sticky-header">
        <button className="back-btn" onClick={() => navigate('/gecmis')}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="header-info">
          <h1 className="page-title">{fortune.type === 'coffee' ? 'Kahve Falı' : 'Tarot Okuması'}</h1>
          <p className="page-subtitle">{new Date(fortune.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {fortune.type === 'coffee' && fortune?.images?.length > 0 && (
        <div className="result-image-strip multi" style={{ marginBottom: '0', padding: '0 20px 20px' }}>
          {fortune.images.map((img, idx) => (
            <div key={idx} className="strip-image-container" onClick={() => setZoomedImage(img.dataUrl)}>
              <img src={img.dataUrl} alt={`Fincan ${idx + 1}`} />
            </div>
          ))}
        </div>
      )}

      <div className="history-tabs-container">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`history-tab-btn ${effectiveTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="history-detail-content">
        {renderTabContent()}
      </div>

      <ImageModal src={zoomedImage} onClose={() => setZoomedImage(null)} />
    </div>
  );
}
