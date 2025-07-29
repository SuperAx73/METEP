import { useState, useEffect } from 'react';

export const useSafariDetection = () => {
  const [isSafari, setIsSafari] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const detectSafari = () => {
      try {
        const userAgent = navigator.userAgent;
        
        // More robust Safari detection
        const isSafariBrowser = /Safari/.test(userAgent) && 
                               !/Chrome/.test(userAgent) && 
                               !/Chromium/.test(userAgent) &&
                               !/Edg/.test(userAgent);
        
        // Mobile device detection
        const isMobileDevice = /iPhone|iPad|iPod|Android|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ||
                              (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
        
        setIsSafari(isSafariBrowser);
        setIsMobile(isMobileDevice);
        
        console.log('Browser detection:', {
          userAgent,
          isSafari: isSafariBrowser,
          isMobile: isMobileDevice,
          maxTouchPoints: navigator.maxTouchPoints
        });
      } catch (error) {
        console.warn('Error detecting browser:', error);
        // Fallback to false if detection fails
        setIsSafari(false);
        setIsMobile(false);
      }
    };

    detectSafari();
  }, []);

  return { 
    isSafari, 
    isMobile, 
    isSafariMobile: isSafari && isMobile 
  };
}; 