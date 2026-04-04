import { useState } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';

function ApiKeyModal() {
  const { showApiKeyModal, apiKey } = useAppState();
  const dispatch = useAppDispatch();
  const [tempKey, setTempKey] = useState(apiKey || '');
  if (!showApiKeyModal) return null;
  const handleSave = () => { dispatch({ type: 'SET_API_KEY', payload: tempKey.trim() }); };
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">API Ayarları</h2>
        <input type="password" value={tempKey} onChange={(e) => setTempKey(e.target.value)} placeholder="OLLAMA veya API Key" className="modal-input" />
        <button className="modal-button" onClick={handleSave}>Kaydet</button>
        <button className="modal-link" onClick={() => dispatch({ type: 'SHOW_API_KEY_MODAL', payload: false })}>Kapat</button>
      </div>
    </div>
  );
}
export default ApiKeyModal;