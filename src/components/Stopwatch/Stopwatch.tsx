import React, { useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useStopwatch } from '../../hooks/useStopwatch';
import { useSafariDetection } from '../../hooks/useSafariDetection';
import { useSafariClick } from '../../hooks/useSafariClick';
import Button from '../UI/Button';

interface StopwatchProps {
  onRecordTime: (time: number) => Promise<void>;
  taktime: number;
  onTaktimeReached?: (hora: string) => void;
}

const Stopwatch: React.FC<StopwatchProps> = ({ onRecordTime, taktime, onTaktimeReached }) => {
  const { formattedTime, isRunning, start, pause, reset, getCurrentTime } = useStopwatch();
  const { isSafariMobile } = useSafariDetection();
  const prevTimeRef = useRef<number>(0);
  const taktimeReachedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isRunning) {
      taktimeReachedRef.current = false;
      prevTimeRef.current = 0;
      return;
    }
    
    const interval = setInterval(() => {
      const currentTime = getCurrentTime();
      if (!taktimeReachedRef.current && prevTimeRef.current < taktime && currentTime >= taktime) {
        taktimeReachedRef.current = true;
        if (onTaktimeReached) {
          onTaktimeReached(new Date().toLocaleTimeString());
        }
      }
      prevTimeRef.current = currentTime;
    }, 50);
    
    return () => clearInterval(interval);
  }, [isRunning, taktime, getCurrentTime, onTaktimeReached]);

  const handlePieceReadyLogic = useCallback(async () => {
    if (!isRunning) {
      console.log('Piece ready blocked: not running');
      return;
    }

    const currentTime = getCurrentTime();
    
    console.log('Piece ready clicked - time:', currentTime, 'isRunning:', isRunning, 'isSafariMobile:', isSafariMobile);
    
    // Ensure we have a valid time
    if (currentTime <= 0) {
      console.warn('Invalid time detected:', currentTime);
      return;
    }

    // Call the record function
    await onRecordTime(currentTime);
    
    // Reset and restart for next piece
    reset();
    start();
    
    console.log('Piece ready completed successfully');
  }, [isRunning, getCurrentTime, onRecordTime, reset, start, isSafariMobile]);

  // Use the Safari-specific click handler with appropriate delay
  const delay = isSafariMobile ? 400 : 300;
  const handlePieceReady = useSafariClick(handlePieceReadyLogic, delay);

  const handleStartPause = useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  }, [isRunning, start, pause]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center">
        <div className="text-4xl sm:text-6xl font-mono font-bold text-slate-800 mb-6 sm:mb-8 p-2 sm:p-4 bg-slate-50 rounded-lg">
          {formattedTime}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:space-x-4">
          <Button
            variant="primary"
            size="lg"
            onClick={handlePieceReady}
            disabled={!isRunning}
            className="bg-green-600 hover:bg-green-700 focus:ring-green-500 w-full sm:w-auto"
          >
            Pieza Lista
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={handleStartPause}
            className="w-full sm:w-auto"
          >
            {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            {isRunning ? 'Pausar' : 'Iniciar'}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Stopwatch;