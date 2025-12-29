import { Play, Pause, Circle, StopCircle } from 'lucide-react';

interface AnimationControlsProps {
  isAnimating: boolean;
  setIsAnimating: (value: boolean) => void;
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
}

export function AnimationControls({
  isAnimating,
  setIsAnimating,
  isRecording,
  setIsRecording,
}: AnimationControlsProps) {
  const handleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setIsAnimating(true);
    } else {
      setIsRecording(false);
      // Mock: In real implementation, this would save the recording
      alert('Recording saved! In a real implementation, this would export the animation data.');
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl px-6 py-4 shadow-2xl">
      <div className="flex items-center gap-4">
        <div className="text-xs text-gray-400 uppercase tracking-wider">Animation</div>
        
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            isAnimating
              ? 'bg-orange-600 hover:bg-orange-500 text-white'
              : 'bg-green-600 hover:bg-green-500 text-white'
          }`}
        >
          {isAnimating ? (
            <>
              <Pause size={16} />
              <span className="text-sm">Pause</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span className="text-sm">Play</span>
            </>
          )}
        </button>
        
        <div className="w-px h-6 bg-gray-700" />
        
        <button
          onClick={handleRecord}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            isRecording
              ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          {isRecording ? (
            <>
              <StopCircle size={16} />
              <span className="text-sm">Stop Recording</span>
            </>
          ) : (
            <>
              <Circle size={16} />
              <span className="text-sm">Record</span>
            </>
          )}
        </button>
        
        {isRecording && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Recording...
          </div>
        )}
      </div>
    </div>
  );
}
