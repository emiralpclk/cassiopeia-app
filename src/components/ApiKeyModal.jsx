import { useState } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';

function ApiKeyModal() {
  const { showApiKeyModal, apiKey } = useAppState();
  const dispatch = useAppDispatch();
  const [tempKey, setTempKey] = useState(apiKey || '');

  if (!showApiKeyModal) return null;

  const handleSave = () => {
    const key = tempKey.trim();
    dispatch({ type: 'SET_API_KEY', payload: key });
    if (key) {
      dispatch({ type: 'SHOW_API_KEY_MODAL', payload: false });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">API Ayarları</h2>
        <input 
          type="password" 
          value={tempKey} 
          onChange={(e) => setTempKey(e.target.value)} 
          placeholder="Gemini API Key Girin..." 
          className="modal-input" 
        />
        <p className="modal-desc" style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', textAlign: 'center' }}>
          Yorumların mühürlenmesi için geçerli bir anahtar gereklidir.
        </p>
        <button className="modal-button" onClick={handleSave}>Kaydet</button>
        {apiKey && (
          <button className="modal-link" onClick={() => dispatch({ type: 'SHOW_API_KEY_MODAL', payload: false })}>Kapat</button>
        )}
      </div>
    </div>
  );
}

export default ApiKeyModal;