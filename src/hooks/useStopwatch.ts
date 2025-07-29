import { useState, useEffect, useRef, useCallback } from 'react';
import { StopwatchState } from '../types';

export const useStopwatch = () => {
  const [state, setState] = useState<StopwatchState>({
    time: 0,
    isRunning: false,
    startTime: 0
  });
  
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const updateTime = useCallback(() => {
    if (!state.isRunning) return;

    const now = Date.now();
    const deltaTime = now - lastUpdateRef.current;
    
    // Only update if enough time has passed (at least 10ms)
    if (deltaTime >= 10) {
      setState(prev => ({
        ...prev,
        time: now - prev.startTime
      }));
      lastUpdateRef.current = now;
    }

    animationFrameRef.current = requestAnimationFrame(updateTime);
  }, [state.isRunning, state.startTime]);

  useEffect(() => {
    if (state.isRunning) {
      lastUpdateRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(updateTime);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isRunning, updateTime]);

  const start = useCallback(() => {
    const now = Date.now();
    setState(prev => ({
      ...prev,
      isRunning: true,
      startTime: now - prev.time
    }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: false
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      time: 0,
      isRunning: false,
      startTime: 0
    });
  }, []);

  const formatTime = useCallback((timeMs: number): string => {
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((timeMs % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }, []);

  const getCurrentTime = useCallback((): number => {
    return state.time / 1000; // Return in seconds
  }, [state.time]);

  return {
    time: state.time,
    isRunning: state.isRunning,
    formattedTime: formatTime(state.time),
    start,
    pause,
    reset,
    getCurrentTime
  };
};