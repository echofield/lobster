// FieldSignalMonitor - Right panel visualization
// ARCHÉ-style field monitor with three frequency zones

import { useMemo, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { COLORS } from '@/app/lib/instrument/constants';

interface FieldSignalMonitorProps {
  fftData: Float32Array;
  bpm: number;
  pitch: number;
  activity: number; // 0-1 based on meter level
  isPlaying: boolean;
}

export function FieldSignalMonitor({
  fftData,
  bpm,
  pitch,
  activity,
  isPlaying,
}: FieldSignalMonitorProps) {
  const width = 280;
  const height = 500;
  const zoneHeight = height / 3 - 40;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(0);
  const animationRef = useRef<number>();

  // Calculate zone energies from FFT data
  const zones = useMemo(() => {
    if (!fftData || fftData.length === 0) {
      return { dispersion: 0, interference: 0, resonance: 0 };
    }

    // FFT bins: 0-21 (low), 22-42 (mid), 43-63 (high) for 64-bin FFT
    const lowBins = fftData.slice(0, 21);
    const midBins = fftData.slice(21, 43);
    const highBins = fftData.slice(43);

    const average = (arr: Float32Array) => {
      if (arr.length === 0) return 0;
      // FFT values are in dB, normalize to 0-1
      const sum = arr.reduce((a, b) => a + Math.max(0, (b + 100) / 100), 0);
      return Math.min(1, sum / arr.length);
    };

    return {
      dispersion: average(lowBins),
      interference: average(midBins),
      resonance: average(highBins),
    };
  }, [fftData]);

  // Draw organic waveform on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Update phase based on BPM
      phaseRef.current += (bpm / 60) * 0.02;

      // Draw each zone
      const zoneData = [
        { y: 60, energy: zones.resonance, label: 'RESONANCE' },
        { y: 200, energy: zones.interference, label: 'INTERFERENCE' },
        { y: 340, energy: zones.dispersion, label: 'DISPERSION' },
      ];

      zoneData.forEach(({ y, energy }) => {
        const baseY = y + zoneHeight / 2;

        // Draw waveform for this zone
        ctx.beginPath();
        ctx.moveTo(0, baseY);

        for (let x = 0; x < width; x++) {
          // Organic wave using multiple sine components
          const t = x / width;
          const phase = phaseRef.current;

          // Base wave
          let waveY =
            Math.sin(t * Math.PI * 4 + phase) * 15 * energy +
            Math.sin(t * Math.PI * 7 + phase * 1.3) * 8 * energy +
            Math.sin(t * Math.PI * 11 + phase * 0.7) * 4 * energy;

          // Add pitch influence (stretches/compresses wave)
          const pitchFactor = 1 + pitch * 0.02;
          waveY *= pitchFactor;

          // Add activity influence
          waveY *= 0.3 + activity * 0.7;

          ctx.lineTo(x, baseY + waveY);
        }

        // Gradient stroke
        const gradient = ctx.createLinearGradient(0, y, 0, y + zoneHeight);
        gradient.addColorStop(0, `rgba(139, 92, 246, ${0.1 + energy * 0.3})`);
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${0.2 + energy * 0.4})`);
        gradient.addColorStop(1, `rgba(139, 92, 246, ${0.1 + energy * 0.3})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw ghost wave (echo)
        ctx.beginPath();
        ctx.moveTo(0, baseY);

        for (let x = 0; x < width; x++) {
          const t = x / width;
          const phase = phaseRef.current - 0.5;

          let waveY =
            Math.sin(t * Math.PI * 4 + phase) * 12 * energy +
            Math.sin(t * Math.PI * 7 + phase * 1.3) * 6 * energy;

          waveY *= 0.3 + activity * 0.7;

          ctx.lineTo(x, baseY + waveY);
        }

        ctx.strokeStyle = `rgba(139, 92, 246, ${0.05 + energy * 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, zoneHeight, zones, bpm, pitch, activity]);

  return (
    <div
      className="relative"
      style={{
        width,
        height,
        background: `linear-gradient(180deg, ${COLORS.paper} 0%, ${COLORS.paperDark} 100%)`,
      }}
    >
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <span
          className="text-[9px] tracking-[0.2em] uppercase"
          style={{ color: `${COLORS.ink}40` }}
        >
          Field Signal
        </span>
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: COLORS.violet }}
          animate={{
            opacity: isPlaying ? [0.4, 1, 0.4] : 0.2,
          }}
          transition={{
            duration: 60 / bpm,
            repeat: Infinity,
          }}
        />
      </div>

      {/* Zone labels */}
      <div className="absolute top-12 left-4 right-4">
        {['RESONANCE', 'INTERFERENCE', 'DISPERSION'].map((label, i) => (
          <div
            key={label}
            className="absolute left-0"
            style={{ top: i * 140 + 20 }}
          >
            <span
              className="text-[7px] tracking-[0.15em] uppercase"
              style={{ color: `${COLORS.ink}25` }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Canvas for waveforms */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0"
        style={{ opacity: activity > 0.01 ? 1 : 0.3 }}
      />

      {/* Zone dividers */}
      {[1, 2].map((i) => (
        <div
          key={i}
          className="absolute left-4 right-4"
          style={{
            top: 40 + i * (height / 3),
            height: 1,
            background: `linear-gradient(90deg, transparent, ${COLORS.ink}10, transparent)`,
          }}
        />
      ))}

      {/* Energy indicators */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        {[
          { label: 'LOW', value: zones.dispersion },
          { label: 'MID', value: zones.interference },
          { label: 'HIGH', value: zones.resonance },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <motion.div
              className="w-1"
              style={{
                background: COLORS.violet,
                borderRadius: 1,
              }}
              animate={{
                height: 4 + value * 20,
                opacity: 0.3 + value * 0.5,
              }}
              transition={{ duration: 0.1 }}
            />
            <span
              className="text-[6px] tracking-wider"
              style={{ color: `${COLORS.ink}30` }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Pitch indicator */}
      <div className="absolute bottom-4 right-4">
        <span
          className="text-[8px] tracking-wider"
          style={{ color: pitch !== 0 ? COLORS.violet : `${COLORS.ink}30` }}
        >
          {pitch > 0 ? `+${pitch}` : pitch !== 0 ? pitch : '0'} st
        </span>
      </div>

      {/* Border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: `1px solid ${COLORS.ink}08`,
        }}
      />

      {/* Corner marks */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path
          d="M8 0 V8 H0"
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={0.5}
          strokeOpacity={0.1}
        />
        <path
          d={`M${width - 8} 0 V8 H${width}`}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={0.5}
          strokeOpacity={0.1}
        />
        <path
          d={`M8 ${height} V${height - 8} H0`}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={0.5}
          strokeOpacity={0.1}
        />
        <path
          d={`M${width - 8} ${height} V${height - 8} H${width}`}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={0.5}
          strokeOpacity={0.1}
        />
      </svg>
    </div>
  );
}
