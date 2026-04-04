import { useEffect } from 'react';

export default function ImageModal({ src, onClose }) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!src) return null;

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt="Zoomed" className="zoomed-image" />
        <button className="modal-close-btn" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  );
}
