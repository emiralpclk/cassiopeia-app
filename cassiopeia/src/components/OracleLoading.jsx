import { useState, useEffect } from 'react';

const MESSAGES = [
  'Telveler fısıldamaya başladı...',
  'Yıldızlar senin enerjinle buluşuyor...',
  'Semboller derinlerde şekilleniyor...',
  'Cassiopeia ruhunun haritasını okuyor...',
  'Geçmişin izleri gün yüzüne çıkıyor...',
  'Geleceğin kapıları aralanıyor, az kaldı...'
];

const OracleLoading = ({ message }) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); 
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % MESSAGES.length);
        setFade(true); 
      }, 500); 
    }, 3500); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-oracle">
      <div className="cosmic-dust-container">
        <div className="cosmic-core"></div>
        <div className="dust-orbit orbit-1">
          <div className="dust-particle p1"></div>
          <div className="dust-particle p2"></div>
        </div>
        <div className="dust-orbit orbit-2">
          <div className="dust-particle p3"></div>
          <div className="dust-particle p4"></div>
        </div>
        <div className="dust-orbit orbit-3">
          <div className="dust-particle p5"></div>
        </div>
        <div className="dust-glow"></div>
      </div>
      <p className="loading-text" style={{ 
        opacity: fade ? 1 : 0, 
        transition: 'opacity 0.5s ease',
        textAlign: 'center',
        marginTop: '20px'
      }}>
        {message || MESSAGES[index]}
      </p>
    </div>
  );
};

export default OracleLoading;