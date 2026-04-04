import { useState } from 'react';
import { useAppDispatch } from '../../context/AppContext';

export default function IntentStep() {
  const dispatch = useAppDispatch();
  const [intent, setIntent] = useState('');

  const PREDEFINED_INTENTS = [
    { id: 'general', label: 'Genel', emoji: '✨', text: 'Genel hayatıma, enerjime ve yakın geleceğime dair kapsamlı bir yorum istiyorum.' },
    { id: 'love', label: 'Aşk', emoji: '💕', text: 'Kalp meselelerime, ilişki durumuma ve aşk hayatımdaki gelişmelere odaklan.' },
    { id: 'career', label: 'İş & Kariyer', emoji: '💰', text: 'Kariyer yolculuğum, maddi beklentilerim ve iş hayatımdaki fırsatlara bak.' },
    { id: 'health', label: 'Sağlık', emoji: '🌿', text: 'Bedensel ve ruhsal sağlığım, huzurum ve enerjim hakkında rehberlik et.' },
    { id: 'question', label: 'Bir Sorum Var', emoji: '🤔', text: 'Aklımda spesifik bir soru var, fincanımda bunun cevabını ara.' },
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (intent.trim()) {
      dispatch({ type: 'SET_INTENT', payload: intent.trim() });
    }
  };

  const selectIntent = (item) => {
    setIntent(item.text);
  };

  return (
    <div className="fortune-step intent-step">
      <div className="step-icon">
        <span className="material-symbols-outlined">edit_note</span>
      </div>
      <h2 className="step-title">Niyetini Belirle</h2>
      <p className="step-subtitle">
        Aklındaki soruyu yazabilir veya aşağıdaki hazır niyetlerden birini seçebilirsin.
      </p>

      <div className="intent-grid">
        {PREDEFINED_INTENTS.map((item) => (
          <button 
            key={item.id} 
            className={`intent-chip ${intent === item.text ? 'active' : ''}`}
            onClick={() => selectIntent(item)}
          >
            <span className="intent-emoji">{item.emoji}</span>
            <span className="intent-label">{item.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="intent-form">
        <textarea
          className="intent-input"
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          placeholder="Niyetini buraya da detaylandırabilirsin..."
          rows={3}
          maxLength={500}
        />
        <div className="intent-footer">
          <span className="intent-counter">{intent.length}/500</span>
          <button type="submit" className="step-button" disabled={!intent.trim()}>
            Devam
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </form>
    </div>
  );
}