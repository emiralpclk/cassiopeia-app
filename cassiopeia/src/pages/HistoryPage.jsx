import { useAppState } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ImageModal from '../components/ImageModal';

export default function HistoryPage() {
  const { history } = useAppState();
  const navigate = useNavigate();
  const [zoomedImage, setZoomedImage] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Tarih belirsiz';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('tr-TR', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return 'Tarih hatalı';
    }
  };

  const coffeeHistory = history.filter(item => item.type === 'coffee');
  const tarotHistory = history.filter(item => item.type === 'tarot');

  const HistoryCard = ({ item, index }) => (
    <div key={item?.id || index} className="history-item stagger-item" onClick={() => navigate(`/gecmis/${index}`)}>
      <div className="history-item-image" onClick={(e) => {
        const imgUrl = item?.images?.[0]?.dataUrl || item?.imageDataUrl;
        if (imgUrl) {
          e.stopPropagation();
          setZoomedImage(imgUrl);
        }
      }}>
        {item?.images?.[0]?.dataUrl || item?.imageDataUrl ? (
          <img src={item?.images?.[0]?.dataUrl || item?.imageDataUrl} alt="Fincan" />
        ) : (
          <div className="history-placeholder">
            <span className="material-symbols-outlined">{item.type === 'coffee' ? 'coffee' : 'style'}</span>
          </div>
        )}
      </div>
      <div className="history-item-info">
        <p className="history-intent">{item?.intent || 'Genel Niyet'}</p>
        <span className="history-date">{formatDate(item?.date)}</span>
      </div>
      {item?.tarotCards?.length > 0 && item.type === 'coffee' && (
        <div className="history-tarot-badge">
          <span className="material-symbols-outlined">flare</span>
          Sentez
        </div>
      )}
    </div>
  );

  return (
    <div className="page history-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Geçmiş</h1>
        <p className="page-subtitle">Önceki falların (Son 5 Kayıt)</p>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <span className="material-symbols-outlined empty-icon">history</span>
          <h3>Henüz fal baktırmadın</h3>
          <p>İlk falını baktırdığında burada görünecek</p>
          <button className="step-button" onClick={() => navigate('/fallar')}>
            Fal Baktır
          </button>
        </div>
      ) : (
        <div className="history-sections-container">
          {/* Coffee Section */}
          <div className="history-section">
            <div className="section-header-premium">
              <span className="material-symbols-outlined">coffee</span>
              <h3>Kahve Falları</h3>
            </div>
            {coffeeHistory.length > 0 ? (
              <div className="history-list">
                {coffeeHistory.map((item, i) => <HistoryCard key={item.id} item={item} index={history.indexOf(item)} />)}
              </div>
            ) : (
              <p className="faded-small">Henüz kahve falı kaydın yok.</p>
            )}
          </div>

          <div className="divider" style={{ margin: '40px 0' }}></div>

          {/* Tarot Section */}
          <div className="history-section">
            <div className="section-header-premium">
              <span className="material-symbols-outlined">style</span>
              <h3>Tarot Okumaları</h3>
            </div>
            {tarotHistory.length > 0 ? (
              <div className="history-list">
                {tarotHistory.map((item, i) => <HistoryCard key={item.id} item={item} index={history.indexOf(item)} />)}
              </div>
            ) : (
              <p className="faded-small">Henüz tarot okuması kaydın yok.</p>
            )}
          </div>
        </div>
      )}

      <ImageModal src={zoomedImage} onClose={() => setZoomedImage(null)} />
    </div>
  );
}