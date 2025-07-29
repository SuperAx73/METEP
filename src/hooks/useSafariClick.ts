import { useCallback, useRef } from 'react';

export const useSafariClick = (callback: () => void, delay: number = 300) => {
  const lastClickTimeRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);

  const handleClick = useCallback(async () => {
    const now = Date.now();
    
    // Prevent rapid successive clicks (debounce)
    if (now - lastClickTimeRef.current < delay) {
      console.log('Click blocked: too rapid clicks');
      return;
    }
    
    // Prevent multiple rapid clicks
    if (isProcessingRef.current) {
      console.log('Click blocked: already processing');
      return;
    }

    try {
      isProcessingRef.current = true;
      lastClickTimeRef.current = now;
      
      console.log('Click processed successfully');
      await callback();
      
    } catch (error) {
      console.error('Error in click handler:', error);
    } finally {
      // Delay to prevent rapid successive clicks
      setTimeout(() => {
        isProcessingRef.current = false;
      }, delay);
    }
  }, [callback, delay]);

  return handleClick;
}; 