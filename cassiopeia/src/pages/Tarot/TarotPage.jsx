import { useState, useEffect } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import TarotSelection from './TarotSelection';
import TarotResult from './TarotResult';
import { TAROT_SLOTS } from '../../utils/constants';

export default function TarotPage() {
  const { currentFortune, user } = useAppState();
  const dispatch = useAppDispatch();
  const [userName, setUserName] = useState(user?.name || '');
  const [intent, setIntent] = useState('');

  // Use global tarotStep
  const step = currentFortune?.tarotStep || 'intent';

  useEffect(() => {
    window.scrollTo(0, 0);
    // If we land here but we are already in results, it means it's a restored session.
    // If the user wants a NEW Tarot reading, they should start from intent.
    // But we avoid resetting if they are in the middle of a ritual.
  }, [step]);

  const formatName = (name) => {
    if (!name) return '';
    return name
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleStartRitual = () => {
    if (!userName || !intent) return;
    const formattedName = formatName(userName);
    dispatch({ type: 'SET_TAROT_INTENT', payload: { userName: formattedName, intent } });
  };

  const TAROT_INTENTS = [
    { id: 'general', label: 'Genel Açılım', text: 'Hayatımdaki mevcut enerjiler ve yakın geleceğim hakkında genel bir rehberlik istiyorum.' },
    { id: 'love', label: 'Aşk & İlişki', text: 'İlişki durumum, kalbimdeki sorular ve aşk hayatımın gidişatı hakkında netlik arıyorum.' },
    { id: 'career', label: 'Kariyer & Para', text: 'İş hayatım, finansal durumum ve kariyer kararlarım için yol gösterici bir ışık istiyorum.' },
    { id: 'spiritual', label: 'Ruhsal Rehberlik', text: 'Şu an öğrenmem gereken ders nedir? Ruhsal gelişimim için neye odaklanmalıyım?' }
  ];

  const renderInput = () => (
    <div className="page tarot-input-page fade-in">
      <div className="page-header">
        <h1 className="page-title" style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Zümrüt Kâhini
        </h1>
        <p className="page-subtitle">Sana rehberlik etmesi için niyetini paylaş.</p>
      </div>

      <div className="intent-form" style={{ marginTop: '40px' }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'var(--font-label)', textTransform: 'uppercase' }}>Kimliğin</label>
          <input 
            type="text" 
            className="intent-input" 
            placeholder="İsmin nedir?"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{ height: '56px' }}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', fontFamily: 'var(--font-label)', textTransform: 'uppercase' }}>Hızlı Odaklar</label>
          <div className="intent-grid" style={{ marginBottom: '16px', justifyContent: 'flex-start' }}>
            {TAROT_INTENTS.map((item) => (
              <button 
                key={item.id} 
                className={`intent-chip ${intent === item.text ? 'active' : ''}`}
                onClick={() => setIntent(item.text)}
                style={{ padding: '8px 14px', fontSize: '12px', background: 'transparent' }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <textarea 
            className="intent-input" 
            placeholder="Yukarıdan seçebilir veya aklındaki soruyu buraya yazabilirsin..."
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            rows="4"
          />
        </div>

        <button 
          className="step-button ritual-active" 
          disabled={!userName || !intent}
          onClick={handleStartRitual}
          style={{ width: '100%', justifyContent: 'center', boxShadow: '0 0 20px var(--accent-glow)' }}
        >
          Kâhine Bağlan
          <span className="material-symbols-outlined">auto_awesome</span>
        </button>
      </div>
    </div>
  );

  if (step === 'intent') return renderInput();
  if (step === 'ritual' || step === 'selection') {
    return <TarotSelection step={step} />;
  }
  if (step === 'results') {
    return <TarotResult />;
  }

  return renderInput(); // Default to input if step is unknown
}
