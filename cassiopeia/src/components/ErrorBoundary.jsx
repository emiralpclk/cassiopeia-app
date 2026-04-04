import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Kozmik Hata Yakalandı:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="critical-error" style={{ 
          padding: '40px', 
          textAlign: 'center', 
          background: 'var(--bg)', 
          color: 'var(--text-primary)', 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <h2 style={{ 
            fontSize: '2rem', 
            marginBottom: '16px', 
            background: 'var(--accent-gradient)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>Kozmik Hata</h2>
          <p style={{ 
            margin: '20px 0', 
            color: 'var(--text-secondary)', 
            maxWidth: '400px', 
            lineHeight: '1.6' 
          }}>
            Bağlantıda bir kopukluk veya sistemde sinsi bir sızıntı var. Verilerini korumak için sistemi sarsılmaz bi' şekilde beklemeye aldık.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => window.location.reload()} 
              style={{ 
                padding: '12px 24px', 
                background: 'var(--accent-gradient)', 
                border: 'none', 
                borderRadius: '12px', 
                color: 'var(--bg)', 
                fontWeight: 'bold', 
                cursor: 'pointer' 
              }}
            >
              Yeniden Dene
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
