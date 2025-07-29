import { useState, useEffect } from 'react';

export const useSafariDetection = () => {
  const [isSafari, setIsSafari] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const detectSafari = () => {
      const userAgent = navigator.userAgent;
      const isSafariBrowser = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
      const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(userAgent);
      
      setIsSafari(isSafariBrowser);
      setIsMobile(isMobileDevice);
    };

    detectSafari();
  }, []);

  return { isSafari, isMobile, isSafariMobile: isSafari && isMobile };
}; 