/**
 * Canvas-based image compressor for coffee cup photos.
 * Reduces 10MB+ photos to ~200-400KB before sending to Gemini API.
 */
export function compressImage(file, maxWidth = 800, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Scale down if wider than maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG base64
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64 = dataUrl.split(',')[1];

        resolve({
          base64,
          mimeType: 'image/jpeg',
          dataUrl,
          originalSize: file.size,
          compressedSize: Math.round(base64.length * 0.75), // approximate byte size
        });
      };
      img.onerror = () => reject(new Error('Fotoğraf yüklenemedi'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Dosya okunamadı'));
    reader.readAsDataURL(file);
  });
}