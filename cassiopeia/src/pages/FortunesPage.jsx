import { useNavigate } from 'react-router-dom';
import { FORTUNE_TYPES } from '../utils/constants';

export default function FortunesPage() {
  const navigate = useNavigate();

  const handleClick = (type) => {
    if (!type.available) return;
    if (type.id === 'coffee') navigate('/fallar/kahve');
    if (type.id === 'tarot') navigate('/fallar/tarot');
  };

  return (
    <div className="page fortunes-page">
      <div className="page-header">
        <h1 className="page-title">Fallar</h1>
        <p className="page-subtitle">Ne öğrenmek istiyorsun?</p>
      </div>

      <div className="fortune-grid">
        {FORTUNE_TYPES.map((type) => (
          <button
            key={type.id}
            className={`fortune-type-card ${!type.available ? 'locked' : ''}`}
            onClick={() => handleClick(type)}
          >
            <div className="fortune-type-emoji">{type.emoji}</div>
            <div className="fortune-type-info">
              <h3 className="fortune-type-name">{type.name}</h3>
              <p className="fortune-type-desc">{type.description}</p>
            </div>
            {!type.available && (
              <div className="fortune-type-badge">Yakında</div>
            )}
            {type.available && (
              <span className="material-symbols-outlined fortune-arrow">chevron_right</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}