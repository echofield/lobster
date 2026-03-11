// FlowVisualizer - Reactive visual layer inside the circle
// Creates ripple/particle effects responding to sound

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COLORS, GEOMETRY, TIMING } from '@/app/lib/instrument/constants';

interface Ripple {
  id: number;
  x: number;
  y: number;
  startTime: number;
}

interface FlowVisualizerProps {
  centerX: number;
  centerY: number;
  radius: number;
  waveformData: Float32Array;
  meterLevel: number;
  activeNodeId: string | null;
  nodePositions: { x: number; y: number }[];
}

export function FlowVisualizer({
  centerX,
  centerY,
  radius,
  waveformData,
  meterLevel,
  activeNodeId,
  nodePositions,
}: FlowVisualizerProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = useRef(0);

  // Add ripple when node triggers
  useEffect(() => {
    if (activeNodeId !== null) {
      const nodeIndex = parseInt(activeNodeId);
      const nodePos = nodePositions[nodeIndex];

      if (nodePos) {
        const newRipple: Ripple = {
          id: rippleIdRef.current++,
          x: nodePos.x,
          y: nodePos.y,
          startTime: Date.now(),
        };

        setRipples((prev) => [...prev, newRipple]);

        // Remove ripple after animation
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, TIMING.rippleDuration);
      }
    }
  }, [activeNodeId, nodePositions]);

  // Calculate activity level
  const activityLevel = Math.max(0, Math.min(1, (meterLevel + 60) / 60));

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        {/* Gradient for flow lines */}
        <radialGradient id="flowGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.violet} stopOpacity="0.1" />
          <stop offset="100%" stopColor={COLORS.violet} stopOpacity="0" />
        </radialGradient>

        {/* Mask for circular boundary */}
        <clipPath id="circleMask">
          <circle cx={centerX} cy={centerY} r={radius - 20} />
        </clipPath>
      </defs>

      {/* Background concentric circles - ghost grid style */}
      <g opacity={0.05 + activityLevel * 0.1}>
        {[0.3, 0.5, 0.7, 0.9].map((ratio, i) => (
          <circle
            key={i}
            cx={centerX}
            cy={centerY}
            r={radius * ratio}
            fill="none"
            stroke={COLORS.violet}
            strokeWidth="0.5"
          />
        ))}
      </g>

      {/* Cross lines - 8-directional */}
      <g opacity={0.03 + activityLevel * 0.05}>
        {[0, 45, 90, 135].map((angle, i) => (
          <line
            key={i}
            x1={centerX - radius * Math.cos((angle * Math.PI) / 180)}
            y1={centerY - radius * Math.sin((angle * Math.PI) / 180)}
            x2={centerX + radius * Math.cos((angle * Math.PI) / 180)}
            y2={centerY + radius * Math.sin((angle * Math.PI) / 180)}
            stroke={COLORS.violet}
            strokeWidth="0.5"
          />
        ))}
      </g>

      {/* Waveform ring - subtle */}
      <g clipPath="url(#circleMask)">
        <motion.path
          d={generateWaveformPath(
            centerX,
            centerY,
            radius * 0.6,
            waveformData,
            activityLevel
          )}
          fill="none"
          stroke={COLORS.violet}
          strokeWidth="1"
          strokeOpacity={0.1 + activityLevel * 0.2}
          animate={{
            strokeOpacity: [0.1 + activityLevel * 0.2, 0.15 + activityLevel * 0.25, 0.1 + activityLevel * 0.2],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </g>

      {/* Ripples */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.circle
            key={ripple.id}
            cx={ripple.x}
            cy={ripple.y}
            r={10}
            fill="none"
            stroke={COLORS.violet}
            strokeWidth="1"
            initial={{ r: 10, opacity: 0.6 }}
            animate={{
              r: [10, 60, 100],
              opacity: [0.6, 0.3, 0],
              strokeWidth: [1, 0.5, 0.3],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: TIMING.rippleDuration / 1000,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Central breathing circle */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={GEOMETRY.coreRadius + 10}
        fill="none"
        stroke={COLORS.violet}
        strokeWidth="0.5"
        strokeOpacity={0.1}
        animate={{
          r: [GEOMETRY.coreRadius + 10, GEOMETRY.coreRadius + 15, GEOMETRY.coreRadius + 10],
          strokeOpacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </svg>
  );
}

// Generate a circular waveform path
function generateWaveformPath(
  cx: number,
  cy: number,
  baseRadius: number,
  waveformData: Float32Array,
  amplitude: number
): string {
  const points: string[] = [];
  const samples = Math.min(64, waveformData.length);
  const angleStep = (Math.PI * 2) / samples;

  for (let i = 0; i < samples; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const value = waveformData[Math.floor((i / samples) * waveformData.length)] || 0;
    const r = baseRadius + value * 20 * amplitude;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    if (i === 0) {
      points.push(`M ${x} ${y}`);
    } else {
      points.push(`L ${x} ${y}`);
    }
  }

  points.push('Z');
  return points.join(' ');
}
