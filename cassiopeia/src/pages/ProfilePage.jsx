import { useState } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { ZODIAC_SIGNS, AGE_RANGES, RELATIONSHIP_STATUSES } from '../utils/constants';

export default function ProfilePage() {
  const { user, apiKey, history } = useAppState();
  const dispatch = useAppDispatch();
  const [showApiInput, setShowApiInput] = useState(false);
  const [newKey, setNewKey] = useState(apiKey || '');

  const userZodiac = user ? ZODIAC_SIGNS.find(z => z.id === user.zodiac) : null;
  const userAge = user ? AGE_RANGES.find(a => a.id === user.ageRange) : null;
  const userRel = user ? RELATIONSHIP_STATUSES.find(r => r.id === user.relationshipStatus) : null;

  const handleSaveKey = () => {
    if (newKey.trim()) {
      dispatch({ type: 'SET_API_KEY', payload: newKey.trim() });
      setShowApiInput(false);
    }
  };

  return (
    <div className="page profile-page">
      <div className="page-header">
        <h1 className="page-title">Profil</h1>
      </div>

      {/* User Info */}
      <div className="profile-card">
        <div className="profile-avatar">
          <span className="profile-emoji">{userZodiac?.emoji || '✨'}</span>
        </div>
        <div className="profile-info">
          <h2 className="profile-zodiac">{userZodiac?.name || 'Bilinmiyor'}</h2>
          <div className="profile-details">
            <span className="profile-detail">{userAge?.label || '-'} yaş</span>
            <span className="profile-divider">•</span>
            <span className="profile-detail">{userRel?.label || '-'}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-number">{history.length}</span>
          <span className="stat-label">Fal</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {history.filter(h => h.tarotCards?.length > 0).length}
          </span>
          <span className="stat-label">Sentez</span>
        </div>
      </div>

      {/* Settings */}
      <div className="profile-section">
        <h3 className="section-title">Ayarlar</h3>

        <button className="settings-item" onClick={() => setShowApiInput(!showApiInput)}>
          <span className="material-symbols-outlined">key</span>
          <span>API Anahtarı</span>
          <span className="material-symbols-outlined">{showApiInput ? 'expand_less' : 'expand_more'}</span>
        </button>

        {showApiInput && (
          <div className="api-key-edit">
            <input
              type="password"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Gemini API anahtarı"
              className="settings-input"
            />
            <button className="settings-save" onClick={handleSaveKey}>Kaydet</button>
          </div>
        )}

        <button className="settings-item" onClick={() => dispatch({ type: 'SHOW_ONBOARDING', payload: true })}>
          <span className="material-symbols-outlined">tune</span>
          <span>Profili Düzenle</span>
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      <div className="profile-footer">
        <p>Cassiopeia v1.0</p>
        <p>Cassiopeia Cosmos • 2026</p>
      </div>
    </div>
  );
}