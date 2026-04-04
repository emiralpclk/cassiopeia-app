import { useState } from 'react';
import { useAppDispatch } from '../../context/AppContext';
import { TAROT_DECK } from '../../utils/constants';

export default function TarotBridge() {
  const dispatch = useAppDispatch();
  const [selectedCards, setSelectedCards] = useState([]);
  const [revealedIndices, setRevealedIndices] = useState([]);
  const [shuffled] = useState(() => {
    const deck = Array.isArray(TAROT_DECK) ? [...TAROT_DECK] : [];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  });

  const labels = ['Gecmis', 'Su An', 'Gelecek'];

  const handleCardClick = (cardIndex) => {
    if (selectedCards.length >= 3 || revealedIndices.includes(cardIndex)) return;
    setRevealedIndices((prev) => [...prev, cardIndex]);
    const card = shuffled?.[cardIndex];
    if (!card) return;
    
    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);
    
    if (newSelected.length === 3) {
      setTimeout(() => {
        dispatch({ type: 'SET_TAROT_SYNTHESIS_CARDS', payload: newSelected });
      }, 1500);
    }
  };

  return (
    <div className="fortune-step bridge-step">
      <div className="bridge-header">
        <span className="material-symbols-outlined">flare</span>
        <h2 className="step-title">Kartlarını Seç</h2>
        <p className="step-subtitle">Fincanındaki enerjileri netlestirmek için 3 kart sec</p>
      </div>

      <div className="selected-cards-display">
        {labels.map((label, i) => (
          <div key={label} className={`selected-card-slot ${selectedCards?.[i] ? 'filled' : ''}`}>
            {selectedCards?.[i] ? (
              <>
                <div className="slot-card revealed">
                  {selectedCards[i]?.img ? (
                    <img src={selectedCards[i].img} alt={selectedCards[i]?.nameTr || 'Kart'} />
                  ) : (
                    <span className="material-symbols-outlined">style</span>
                  )}
                </div>
                <div className="slot-info">
                  <span className="slot-label">{label}</span>
                  <span className="slot-card-name-next">{selectedCards[i]?.nameTr}</span>
                </div>
              </>
            ) : (
              <>
                <div className="slot-card empty">
                  <span className="material-symbols-outlined">help</span>
                </div>
                <div className="slot-info">
                  <span className="slot-label">{label}</span>
                  <span className="slot-card-name-next faded">Bekleniyor</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {selectedCards.length < 3 && (
        <div className="tarot-spread-container">
          <p className="bridge-instruction">
            {3 - selectedCards.length} kart daha sec ({labels[selectedCards.length]})
          </p>
          <div className="tarot-spread">
            {Array.isArray(shuffled) && shuffled.slice(0, 12).map((card, i) => (
              <button
                key={card?.id || i}
                className={`tarot-card-back ${revealedIndices.includes(i) ? 'flipped' : ''}`}
                onClick={() => handleCardClick(i)}
                disabled={revealedIndices.includes(i)}
              >
                <div className="card-back-face">
                  <div className="card-back-pattern"><span>✦</span></div>
                </div>
                <div className="card-front-face">
                  {card?.img ? (
                    <img src={card.img} alt={card?.nameTr || 'Kart'} />
                  ) : (
                    <span className="material-symbols-outlined">style</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}