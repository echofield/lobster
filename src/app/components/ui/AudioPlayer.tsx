import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  src?: string;
  title: string;
  duration: string;
  onPlay?: () => void;
  onPause?: () => void;
  isPlaying?: boolean;
  waveformData?: number[];
}

// Generate mock waveform data
function generateWaveform(length: number = 100): number[] {
  const data: number[] = [];
  for (let i = 0; i < length; i++) {
    // Create a more organic waveform shape
    const base = Math.sin(i * 0.1) * 0.3;
    const variation = Math.sin(i * 0.3) * 0.2;
    const noise = (Math.random() - 0.5) * 0.3;
    data.push(Math.abs(base + variation + noise + 0.5));
  }
  return data;
}

export function AudioPlayer({
  src,
  title,
  duration,
  onPlay,
  onPause,
  isPlaying = false,
  waveformData
}: AudioPlayerProps) {
  const [playing, setPlaying] = useState(isPlaying);
  const [progress, setProgress] = useState(0);
  const [waveform] = useState(() => waveformData || generateWaveform(80));
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setPlaying(isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    if (playing) {
      // Simulate playback progress
      progressInterval.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setPlaying(false);
            onPause?.();
            return 0;
          }
          return p + 0.5;
        });
      }, 100);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [playing, onPause]);

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      onPause?.();
    } else {
      setPlaying(true);
      onPlay?.();
    }
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setProgress(percentage);
  };

  return (
    <div className="bg-[#FAF8F2] border border-[#1A1A1A]/10 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Play Button */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full border border-[#1A1A1A]/30 flex items-center justify-center hover:border-[#A38767] hover:bg-[#A38767]/10 transition-all duration-300"
          >
            {playing ? (
              <Pause className="w-4 h-4 text-[#A38767]" />
            ) : (
              <Play className="w-4 h-4 text-[#1A1A1A]/80 ml-0.5" />
            )}
          </button>

          <div>
            <div className="text-sm text-[#1A1A1A]">{title}</div>
            <div className="text-xs text-[#1A1A1A]/40">{duration}</div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          {playing && (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-[#A38767]"
            />
          )}
          <span className="text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/40">
            {playing ? 'PLAYING' : 'READY'}
          </span>
        </div>
      </div>

      {/* Waveform Visualization */}
      <div
        className="relative h-24 cursor-pointer group"
        onClick={handleWaveformClick}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px bg-[#1A1A1A]/30"
              style={{ top: `${(i + 1) * 20}%` }}
            />
          ))}
        </div>

        {/* Waveform Bars */}
        <div className="absolute inset-0 flex items-center justify-center gap-[2px]">
          {waveform.map((value, i) => {
            const isPlayed = (i / waveform.length) * 100 < progress;
            const isCurrent = Math.abs((i / waveform.length) * 100 - progress) < 2;

            return (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{
                  scaleY: playing && isCurrent ? [value, value * 1.3, value] : value,
                }}
                transition={{
                  duration: 0.3,
                  repeat: playing && isCurrent ? Infinity : 0,
                  repeatType: 'reverse'
                }}
                className={`w-1 rounded-full transition-colors duration-150 ${
                  isPlayed ? 'bg-[#A38767]' : 'bg-[#1A1A1A]/20 group-hover:bg-[#1A1A1A]/30'
                }`}
                style={{
                  height: `${value * 80}%`,
                  minHeight: 4
                }}
              />
            );
          })}
        </div>

        {/* Playhead */}
        <motion.div
          className="absolute top-0 bottom-0 w-px bg-[#A38767]"
          style={{ left: `${progress}%` }}
        />

        {/* Time Labels */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] text-[#1A1A1A]/30">
          <span>0:00</span>
          <span>{duration}</span>
        </div>
      </div>

      {/* Hidden Audio Element */}
      {src && <audio ref={audioRef} src={src} />}
    </div>
  );
}

// Mini player for track lists
export function MiniPlayer({
  title,
  duration,
  isPlaying,
  onToggle,
  index
}: {
  title: string;
  duration: string;
  isPlaying: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onToggle}
      className={`group flex items-center gap-4 p-4 cursor-pointer transition-all duration-300 border-b border-[#1A1A1A]/5 ${
        isPlaying ? 'bg-[#A38767]/10' : 'hover:bg-[#1A1A1A]/5'
      }`}
    >
      {/* Index / Play */}
      <div className="w-8 h-8 flex items-center justify-center">
        {isPlaying ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-[#A38767]"
          />
        ) : (
          <>
            <span className="text-sm text-[#1A1A1A]/30 group-hover:hidden">
              {String(index + 1).padStart(2, '0')}
            </span>
            <Play className="w-3 h-3 text-[#1A1A1A]/60 hidden group-hover:block" />
          </>
        )}
      </div>

      {/* Title */}
      <div className="flex-1">
        <span className={`text-sm ${isPlaying ? 'text-[#A38767]' : 'text-[#1A1A1A]/80'}`}>
          {title}
        </span>
      </div>

      {/* Duration */}
      <span className="text-xs text-[#1A1A1A]/30">{duration}</span>

      {/* Mini waveform preview */}
      <div className="hidden md:flex items-center gap-px w-16 h-4">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className={`w-0.5 rounded-full ${isPlaying ? 'bg-[#A38767]/60' : 'bg-[#1A1A1A]/10'}`}
            style={{ height: `${Math.random() * 100}%`, minHeight: 2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
