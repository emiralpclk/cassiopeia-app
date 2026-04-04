import { useRef, useState } from 'react';
import { useAppDispatch } from '../../context/AppContext';
import { compressImage } from '../../utils/imageCompressor';

export default function UploadStep() {
  const dispatch = useAppDispatch();
  const fileRef = useRef(null);
  
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [compressing, setCompressing] = useState(false);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Remaining slots
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

    // Reset input for same file selection
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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

      {images.length > 0 && (
        <button className="step-button pulse" onClick={handleSubmit}>
          {images.length} Fotoğrafla Analize Başla
          <span className="material-symbols-outlined">flare</span>
        </button>
      )}

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