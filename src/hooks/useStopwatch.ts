import { useState, useEffect, useRef } from 'react';
import { StopwatchState } from '../types';

export const useStopwatch = () => {
  const [state, setState] = useState<StopwatchState>({
    time: 0,
    isRunning: false,
    startTime: 0
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          time: Date.now() - prev.startTime
        }));
      }, 10); // Update every 10ms for centiseconds
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.startTime]);

  const start = () => {
    setState(prev => ({
      ...prev,
      isRunning: true,
      startTime: Date.now() - prev.time
    }));
  };

  const pause = () => {
    setState(prev => ({
      ...prev,
      isRunning: false
    }));
  };

  const reset = () => {
    setState({
      time: 0,
      isRunning: false,
      startTime: 0
    });
  };

  const formatTime = (timeMs: number): string => {
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((timeMs % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const getCurrentTime = (): number => {
    return state.time / 1000; // Return in seconds
  };

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