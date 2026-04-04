import { useState, useEffect } from 'react';

export default function Typewriter({ text, speed = 15, className = '', animate = true, initialDelay = 0, onFinish }) {
  const [displayedText, setDisplayedText] = useState(animate ? '' : text);
  const [complete, setComplete] = useState(!animate);

  useEffect(() => {
    if (!animate) {
      setDisplayedText(text);
      setComplete(true);
      return;
    }

    if (complete && displayedText === text) return;

    setDisplayedText(''); 
    setComplete(false);
    if (!text) return;
    
    let i = 0;
    const startTyping = () => {
      const timer = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(timer);
          setComplete(true);
          if (onFinish) onFinish();
        }
      }, speed);
      return timer;
    };

    let timer;
    const delayTimer = setTimeout(() => {
      timer = startTyping();
    }, initialDelay);

    return () => {
      clearTimeout(delayTimer);
      if (timer) clearInterval(timer);
    };
  }, [text, speed, animate, initialDelay]);

  return (
    <div className={`typewriter-container ${className}`}>
      {displayedText}
    </div>
  );
}
