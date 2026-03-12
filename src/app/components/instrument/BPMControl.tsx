// BPMControl - Tempo control with scroll and drag interaction
// The heartbeat of the instrument

import { useCallback, useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import { COLORS, BPM, INERTIA } from '@/app/lib/instrument/constants';

interface BPMControlProps {
  centerX: number;
  centerY: number;
  tempo: number;
  isPlaying: boolean;
  onTempoChange: (bpm: number) => void;
}

export function BPMControl({
  centerX,
  centerY,
  tempo,
  isPlaying,
  onTempoChange,
}: BPMControlProps) {
  const controlRef = useRef<SVGGElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startTempoRef = useRef(tempo);

  // Spring-animated tempo for smooth display
  const rawTempo = useMotionValue(tempo);
  const smoothTempo = useSpring(rawTempo, INERTIA.default);

  // Sync external tempo changes
  useEffect(() => {
    rawTempo.set(tempo);
  }, [tempo, rawTempo]);

  // Handle scroll wheel
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.shiftKey ? 10 : 1;
      const direction = e.deltaY > 0 ? -1 : 1;
      const newTempo = Math.max(BPM.min, Math.min(BPM.max, tempo + direction * delta));
      onTempoChange(newTempo);
    },
    [tempo, onTempoChange]
  );

  // Set up wheel listener
  useEffect(() => {
    const element = controlRef.current;
    if (!element) return;

    element.addEventListener('wheel', handleWheel, { passive: false });
    return () => element.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Handle drag
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as SVGElement).setPointerCapture(e.pointerId);
      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      startTempoRef.current = tempo;
    },
    [tempo]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - startXRef.current;
      // 2px = 1 BPM
      const deltaTempo = Math.round(deltaX / 2);
      const newTempo = Math.max(
        BPM.min,
        Math.min(BPM.max, startTempoRef.current + deltaTempo)
      );
      onTempoChange(newTempo);
    },
    [onTempoChange]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as SVGElement).releasePointerCapture(e.pointerId);
    isDraggingRef.current = false;
  }, []);

  // Position at bottom center
  const y = centerY + 260;

  // Heartbeat animation duration based on tempo
  const beatDuration = 60 / tempo;

  return (
    <g
      ref={controlRef}
      className="cursor-ew-resize"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Background track */}
      <rect
        x={centerX - 50}
        y={y - 12}
        width={100}
        height={24}
        rx={12}
        fill={COLORS.paper}
        stroke={COLORS.ink}
        strokeWidth={0.5}
        strokeOpacity={0.1}
      />

      {/* Heartbeat pulse when playing */}
      {isPlaying && (
        <motion.circle
          cx={centerX - 30}
          cy={y}
          r={3}
          fill={COLORS.violet}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: beatDuration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Static dot when not playing */}
      {!isPlaying && (
        <circle
          cx={centerX - 30}
          cy={y}
          r={3}
          fill={COLORS.ink}
          fillOpacity={0.2}
        />
      )}

      {/* BPM text */}
      <motion.text
        x={centerX + 5}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-[11px] tracking-wider font-medium select-none"
        fill={COLORS.ink}
        fillOpacity={0.6}
      >
        {Math.round(tempo)} BPM
      </motion.text>

      {/* Drag hint arrows */}
      <g opacity={0.2}>
        <path
          d={`M${centerX + 38},${y - 3} l4,3 l-4,3`}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M${centerX - 38},${y - 3} l-4,3 l4,3`}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
}
