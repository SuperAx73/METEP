import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useStopwatch } from '../../hooks/useStopwatch';
import Button from '../UI/Button';

interface StopwatchProps {
  onRecordTime: (time: number) => void;
}

const Stopwatch: React.FC<StopwatchProps> = ({ onRecordTime }) => {
  const { formattedTime, isRunning, start, pause, reset, getCurrentTime } = useStopwatch();

  const handlePieceReady = () => {
    if (isRunning) {
      const currentTime = getCurrentTime();
      onRecordTime(currentTime);
      reset();
      start(); // Restart for next piece
    }
  };

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
            onClick={isRunning ? pause : start}
            className="w-full sm:w-auto"
          >
            {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            {isRunning ? 'Pausar' : 'Iniciar'}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={reset}
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