import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { ZODIAC_SIGNS, TAROT_DECK } from '../utils/constants';
import { callGemini } from '../services/gemini';
import { buildCombinedDailyPrompt } from '../utils/prompts';
import ImageModal from '../components/ImageModal';

export default function HomePage() {
  const { user, apiKey } = useAppState();
  const navigate = useNavigate();
  const [dailyCard, setDailyCard] = useState(null);
  const [dailyCardReading, setDailyCardReading] = useState('');
  const [horoscope, setHoroscope] = useState('');
  const [dailyEnergy, setDailyEnergy] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [loading, setLoading] = useState(() => {
    // Immediate check to prevent flicker
    try {
      const u = JSON.parse(localStorage.getItem('cassiopeia_user_profile'));
      if (!u) return true;
      const today = new Date().toDateString();
      const s = `${today}_${u.zodiac}`;
      return !(localStorage.getItem(`daily_card_reading_${s}`) && 
               localStorage.getItem(`daily_horoscope_${s}`));
    } catch { return true; }
  });

  const userZodiac = user ? ZODIAC_SIGNS.find(z => z.id === user.zodiac) : null;

  useEffect(() => {
    if (!user || !userZodiac) return;
    
    const controller = new AbortController();

    const today = new Date().toDateString();
    const seedString = `${today}_${user.zodiac}`;
    const seed = seedString.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

    // 1. Generate/Retrieve Daily Card (Deterministic)
    const cardIndex = seed % TAROT_DECK.length;
    const card = TAROT_DECK[cardIndex];
    setDailyCard(card);

    // 2. Generate/Retrieve Daily Energy (Cached for 24h)
    const colors = ['Mavi', 'Kırmızı', 'Yeşil', 'Mor', 'Sarı', 'Turuncu', 'Pembe', 'Turkuaz', 'Gümüş', 'Beyaz'];
    const cachedEnergy = localStorage.getItem(`daily_energy_${seedString}`);
    
    if (cachedEnergy) {
      const parsed = JSON.parse(cachedEnergy);
      // Legacy color check: If old color persists in cache, regenerate with new palette
      if (!colors.includes(parsed.color)) {
        const energyColor = colors[seed % colors.length];
        const luckyNumber = ((seed * 7) % 99) + 1;
        const newEnergy = { color: energyColor, number: luckyNumber };
        setDailyEnergy(newEnergy);
        localStorage.setItem(`daily_energy_${seedString}`, JSON.stringify(newEnergy));
      } else {
        setDailyEnergy(parsed);
      }
    } else {
      const energyColor = colors[seed % colors.length];
      
      // Weighted Numerology: 60% chance for 1-9, 40% for 10-99
      const roll = (seed * 13) % 100;
      let luckyNumber;
      if (roll < 60) {
        luckyNumber = ((seed * 7) % 9) + 1; // 1-9
      } else {
        luckyNumber = ((seed * 7) % 90) + 10; // 10-99
      }
      
      const newEnergy = { color: energyColor, number: luckyNumber };
      setDailyEnergy(newEnergy);
      localStorage.setItem(`daily_energy_${seedString}`, JSON.stringify(newEnergy));
    }

    // 3. Fetch mystical content with caching
    if (apiKey) {
      const cachedCard = localStorage.getItem(`daily_card_reading_${seedString}`);
      const cachedHoroscope = localStorage.getItem(`daily_horoscope_${seedString}`);

      if (cachedCard && cachedHoroscope) {
        setDailyCardReading(cachedCard);
        setHoroscope(cachedHoroscope);
        setLoading(false);
      } else {
        loadDailyContent(card, userZodiac, seedString, controller.signal);
      }
    } else {
      setLoading(false);
    }

    return () => controller.abort();
  }, [apiKey, user, userZodiac]);

  async function loadDailyContent(card, zodiac, todayString, signal) {
    if (!apiKey || !zodiac || !card) return;
    setLoading(true);
    try {
      // Combined call for Horoscope and Tarot (Saves 50% cost!)
      const prompt = buildCombinedDailyPrompt(zodiac?.name || '', card?.nameTr || '', card?.meaning || '');
      const result = await callGemini(apiKey, prompt, { jsonMode: true, signal });
      
      const { horoscope: h, tarot_reading: t } = result;
      
      setDailyCardReading(t);
      setHoroscope(h);
      
      // Save both to localStorage using consistent keys
      localStorage.setItem(`daily_card_reading_${todayString}`, t);
      localStorage.setItem(`daily_horoscope_${todayString}`, h);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('İçerik yüklenirken hata oluştu:', err);
      const msg = 'Bağlantı hatası veya API sorunu.';
      if (!dailyCardReading) setDailyCardReading(msg);
      if (!horoscope) setHoroscope(msg);
    }
    setLoading(false);
  }

  // Safety Guard: If user profile is not ready, show clean loading
  if (!user || !userZodiac) {
    return (
      <div className="page home-page">
        <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.7 }}>
          <p>Cassiopeia yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page home-page">
      {/* Header */}
      <div className="home-header">
        <div className="home-greeting">
          <span className="greeting-emoji">{userZodiac?.emoji || '☪️'}</span>
          <div>
            <p className="greeting-text">Merhaba</p>
            <h1 className="greeting-zodiac">{userZodiac?.name || 'Gezgin'}</h1>
          </div>
        </div>
        <div className="home-date">
          {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
        </div>
      </div>

      {/* Quick Action */}
      <button className="quick-action-btn" onClick={() => navigate('/fallar/kahve')}>
        <span className="material-symbols-outlined">coffee</span>
        <span>Fal Baktır</span>
        <span className="material-symbols-outlined arrow">arrow_forward</span>
      </button>

      {/* Daily Card */}
      <div className="home-card daily-card-section">
        <div className="card-header">
          <span className="material-symbols-outlined">style</span>
          <h3>Günün Kartı</h3>
        </div>
        {dailyCard ? (
          <div className="daily-card-content">
            <div className="daily-card-image" onClick={() => setZoomedImage(dailyCard?.img)}>
              <img src={dailyCard?.img} alt={dailyCard?.nameTr} />
            </div>
            <div className="daily-card-info">
              <h4 className="daily-card-name">{dailyCard?.nameTr}</h4>
              <p className="daily-card-meaning">{dailyCard?.meaning}</p>
              {loading ? (
                <p className="daily-card-reading shimmer">Yükleniyor...</p>
              ) : (
                <p className="daily-card-reading">{dailyCardReading || 'Yorum hazır değil.'}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="shimmer">Kart seçiliyor...</p>
        )}
      </div>

      {/* Daily Horoscope */}
      <div className="home-card horoscope-section">
        <div className="card-header">
          <span className="zodiac-mini-emoji">{userZodiac?.emoji}</span>
          <h3>Günlük Burç Yorumun</h3>
        </div>
        {loading ? (
          <p className="horoscope-text shimmer">Yükleniyor...</p>
        ) : (
          <p className="horoscope-text">{horoscope || 'Yorum hazır değil.'}</p>
        )}
      </div>

      {/* Daily Energy */}
      {dailyEnergy && (
        <div className="home-card energy-section" style={{ 
          borderBottom: '2px solid var(--energy-color)',
          '--energy-color': {
            'Mavi': '#007AFF',
            'Kırmızı': '#FF3B30',
            'Yeşil': '#34C759',
            'Mor': '#AF52DE',
            'Sarı': '#FFCC00',
            'Turuncu': '#FF9500',
            'Pembe': '#FF2D55',
            'Turkuaz': '#5AC8FA',
            'Gümüş': '#8E8E93',
            'Beyaz': '#FFFFFF'
          }[dailyEnergy?.color || 'Mavi'] || '#007AFF'
        }}>
          <div className="card-header">
            <span className="material-symbols-outlined" style={{ color: 'var(--energy-color)' }}>bolt</span>
            <h3>Günün Enerjisi</h3>
          </div>
          <div className="energy-row">
            <div className="energy-item">
              <span className="energy-label">Renk</span>
              <span className="energy-value" style={{ 
                color: 'var(--energy-color)',
                textShadow: '0 0 15px var(--energy-color)'
              }}>{dailyEnergy?.color}</span>
            </div>
            <div className="energy-divider"></div>
            <div className="energy-item">
              <span className="energy-label">Şanslı Sayı</span>
              <span className="energy-value" style={{ 
                color: 'var(--energy-color)',
                textShadow: '0 0 15px var(--energy-color)'
              }}>{dailyEnergy?.number}</span>
            </div>
          </div>
        </div>
      )}

      <ImageModal src={zoomedImage} onClose={() => setZoomedImage(null)} />
    </div>
  );
}