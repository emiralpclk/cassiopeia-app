import { useRef, useState } from 'react';
import { useAppDispatch, useAppState } from '../../context/AppContext';
import { compressImage } from '../../utils/imageCompressor';

export default function UploadStep() {
  const { isTestMode } = useAppState();
  const dispatch = useAppDispatch();
  const fileRef = useRef(null);
  
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [compressing, setCompressing] = useState(false);

  const handleFileSelect = async (e) => {
    // ... existing logic ...
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = 3 - images.length;
    if (remaining <= 0) {
      setError('Maksimum 3 fotoğraf yükleyebilirsin');
      return;
    }

    const filesToProcess = files.slice(0, remaining);
    setError('');
    setCompressing(true);

    try {
      const results = await Promise.all(
        filesToProcess.map(file => compressImage(file))
      );

      const newImages = results.map(res => ({
        base64: res.base64,
        mimeType: res.mimeType,
        dataUrl: res.dataUrl
      }));

      setImages(prev => [...prev, ...newImages]);
      setCompressing(false);
    } catch (err) {
      setError('Bazı fotoğraflar işlenemedi, tekrar dene');
      setCompressing(false);
    }

    if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUseDemo = () => {
    const demoImage = {
      base64: 'demo', 
      mimeType: 'image/jpeg',
      dataUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=200&auto=format&fit=crop'
    };
    dispatch({
      type: 'SET_IMAGES',
      payload: [demoImage],
    });
  };

  const handleSubmit = () => {
    if (images.length === 0) return;
    
    dispatch({
      type: 'SET_IMAGES',
      payload: images,
    });
  };

  return (
    <div className="fortune-step upload-step">
      <div className="step-icon">
        <span className="material-symbols-outlined">add_a_photo</span>
      </div>
      <h2 className="step-title">Fincanı Yükle</h2>
      <p className="step-subtitle">
        Fincanın içini 3 farklı açıdan (sağ, sol, orta) çekersen Cassiopeia daha iyi görür. (Maks 3 adet)
      </p>

      <div className="upload-images-grid">
        {images.map((img, idx) => (
          <div key={idx} className="preview-item">
            <img src={img.dataUrl} alt={`Fincan ${idx + 1}`} />
            <button className="preview-remove" onClick={() => removeImage(idx)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        ))}
        {images.length < 3 && !compressing && (
          <div className="upload-add-more" onClick={() => fileRef.current?.click()}>
            <span className="material-symbols-outlined">add</span>
            <span style={{ fontSize: '10px', marginTop: '4px' }}>Foto Ekle</span>
          </div>
        )}
        {compressing && (
          <div className="upload-add-more">
            <span className="material-symbols-outlined spinning">progress_activity</span>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {error && <p className="step-error">{error}</p>}

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
        {images.length > 0 && (
          <button className="step-button pulse" onClick={handleSubmit}>
            {images.length} Fotoğrafla Analize Başla
            <span className="material-symbols-outlined">flare</span>
          </button>
        )}

        {isTestMode && images.length === 0 && (
          <button className="step-button secondary fade-in" onClick={handleUseDemo}>
            <span className="material-symbols-outlined">auto_awesome</span>
            Demo Fotoğraf Kullan (Hızlı Test)
          </button>
        )}
      </div>

      {images.length === 0 && !compressing && (
        <div className="upload-zone" onClick={() => fileRef.current?.click()} style={{ marginTop: '0' }}>
            <>
              <span className="material-symbols-outlined upload-icon">cloud_upload</span>
              <span className="upload-text">İlk Fotoğrafı Seç</span>
              <span className="upload-hint">Yüklemek için dokun</span>
            </>
        </div>
      )}
    </div>
  );
}