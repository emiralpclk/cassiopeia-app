import { useState } from 'react';
import { useAppDispatch } from '../context/AppContext';
import { ZODIAC_SIGNS, AGE_RANGES, RELATIONSHIP_STATUSES } from '../utils/constants';

function OnboardingFlow() {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(1);
  const [zodiac, setZodiac] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');

  const handleComplete = () => {
    dispatch({
      type: 'SET_USER',
      payload: { zodiac, ageRange, relationshipStatus, onboarded: true },
    });
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-container">
        <div className="onboarding-progress">
          <div className={`progress-dot ${step >= 1 ? 'active' : ''}`}></div>
          <div className={`progress-dot ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-dot ${step >= 3 ? 'active' : ''}`}></div>
        </div>

        {step === 1 && (
          <div className="onboarding-step">
            <h2 className="onboarding-title">Burcunu Seç ✨</h2>
            <p className="onboarding-subtitle">Cassiopeia seni daha iyi tanısın</p>
            <div className="zodiac-grid">
              {ZODIAC_SIGNS.map((z) => (
                <button
                  key={z.id}
                  className={`zodiac-card ${zodiac === z.id ? 'selected' : ''}`}
                  onClick={() => { setZodiac(z.id); setTimeout(() => setStep(2), 300); }}
                >
                  <span className="zodiac-emoji">{z.emoji}</span>
                  <span className="zodiac-name">{z.name}</span>
                  <span className="zodiac-date">{z.date}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step">
            <h2 className="onboarding-title">Yaş Aralığın? 🕯️</h2>
            <p className="onboarding-subtitle">Enerjin hangi evrede?</p>
            <div className="age-grid">
              {AGE_RANGES.map((opt) => (
                <button
                  key={opt.id}
                  className={`age-card ${ageRange === opt.id ? 'selected' : ''}`}
                  onClick={() => { setAgeRange(opt.id); setTimeout(() => setStep(3), 300); }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button className="modal-link" onClick={() => setStep(1)}>Geri Dön</button>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-step">
            <h2 className="onboarding-title">İlişki Durumun? 💕</h2>
            <p className="onboarding-subtitle">Kalbinin ritmi nasıl?</p>
            <div className="relationship-grid">
              {RELATIONSHIP_STATUSES.map((opt) => (
                <button
                  key={opt.id}
                  className={`relationship-card ${relationshipStatus === opt.id ? 'selected' : ''}`}
                  onClick={() => setRelationshipStatus(opt.id)}
                >
                  <span className="relationship-emoji">{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
            <button
              className="onboarding-next"
              disabled={!relationshipStatus}
              onClick={handleComplete}
            >
              Cassiopeia'ya Katıl
            </button>
            <div style={{marginTop: '16px'}}>
              <button className="modal-link" onClick={() => setStep(2)}>Geri Dön</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OnboardingFlow;