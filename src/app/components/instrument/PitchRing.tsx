// PitchRing - Global transpose control as a circular ring
// Positioned between nodes and effects ring

import { useCallback, useRef, useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import { COLORS, GEOMETRY, PITCH, INERTIA } from '@/app/lib/instrument/constants';
import { describeArc } from '@/app/lib/instrument/geometry';

interface PitchRingProps {
  centerX: number;
  centerY: number;
  pitch: number; // -12 to +12
  onPitchChange: (semitones: number) => void;
}

export function PitchRing({
  centerX,
  centerY,
  pitch,
  onPitchChange,
}: PitchRingProps) {
  const radius = GEOMETRY.pitchRingRadius;
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Spring-animated pitch for smooth visual
  const rawPitch = useMotionValue(pitch);
  const smoothPitch = useSpring(rawPitch, INERTIA.default);

  // Sync external pitch changes
  useEffect(() => {
    rawPitch.set(pitch);
  }, [pitch, rawPitch]);

  // Convert pitch to angle (full circle, 0 at top)
  const pitchToAngle = (p: number) => {
    // Map -12 to +12 to -135 to +135 degrees (270 degree arc)
    const normalized = (p - PITCH.min) / (PITCH.max - PITCH.min); // 0 to 1
    return -135 + normalized * 270;
  };

  // Convert angle to pitch
  const angleToPitch = (angle: number) => {
    // Normalize angle to our arc range
    let normalizedAngle = angle;
    if (normalizedAngle < -180) normalizedAngle += 360;
    if (normalizedAngle > 180) normalizedAngle -= 360;

    // Clamp to arc range
    normalizedAngle = Math.max(-135, Math.min(135, normalizedAngle));

    // Convert to pitch
    const normalized = (normalizedAngle + 135) / 270;
    return Math.round(PITCH.min + normalized * (PITCH.max - PITCH.min));
  };

  const handleAngle = pitchToAngle(pitch);

  // Handle drag
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as SVGElement).setPointerCapture(e.pointerId);
      setIsDragging(true);

      // Calculate initial angle from click position
      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left - centerX;
      const y = e.clientY - rect.top - centerY;
      const angle = Math.atan2(y, x) * (180 / Math.PI);
      const newPitch = angleToPitch(angle);
      onPitchChange(newPitch);
    },
    [centerX, centerY, onPitchChange]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;

      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left - centerX;
      const y = e.clientY - rect.top - centerY;
      const angle = Math.atan2(y, x) * (180 / Math.PI);
      const newPitch = angleToPitch(angle);
      onPitchChange(newPitch);
    },
    [isDragging, centerX, centerY, onPitchChange]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as SVGElement).releasePointerCapture(e.pointerId);
    setIsDragging(false);
  }, []);

  // Track arc (background)
  const trackPath = describeArc(centerX, centerY, radius, -135, 135);

  // Value arc (from center to current pitch)
  const valuePath =
    pitch >= 0
      ? describeArc(centerX, centerY, radius, -90, pitchToAngle(pitch))
      : describeArc(centerX, centerY, radius, pitchToAngle(pitch), -90);

  // Handle position
  const handleX = centerX + radius * Math.cos((handleAngle * Math.PI) / 180);
  const handleY = centerY + radius * Math.sin((handleAngle * Math.PI) / 180);

  // Generate tick marks for each semitone
  const ticks = [];
  for (let p = PITCH.min; p <= PITCH.max; p++) {
    const angle = pitchToAngle(p);
    const isZero = p === 0;
    const isMajor = p % 12 === 0 || p === 0;
    const innerR = radius - (isMajor ? 8 : 4);
    const outerR = radius + (isMajor ? 8 : 4);

    const x1 = centerX + innerR * Math.cos((angle * Math.PI) / 180);
    const y1 = centerY + innerR * Math.sin((angle * Math.PI) / 180);
    const x2 = centerX + outerR * Math.cos((angle * Math.PI) / 180);
    const y2 = centerY + outerR * Math.sin((angle * Math.PI) / 180);

    ticks.push(
      <line
        key={p}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isZero ? COLORS.violet : COLORS.ink}
        strokeWidth={isZero ? 1.5 : isMajor ? 1 : 0.5}
        strokeOpacity={isZero ? 0.6 : isMajor ? 0.2 : 0.1}
      />
    );
  }

  // Labels at -12, 0, +12
  const labels = [
    { pitch: -12, label: '-12' },
    { pitch: 0, label: '0' },
    { pitch: 12, label: '+12' },
  ];

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Track arc */}
      <path
        d={trackPath}
        fill="none"
        stroke={COLORS.ink}
        strokeWidth={3}
        strokeOpacity={0.06}
        strokeLinecap="round"
      />

      {/* Tick marks */}
      {ticks}

      {/* Value arc */}
      <motion.path
        d={valuePath}
        fill="none"
        stroke={COLORS.violet}
        strokeWidth={2}
        strokeLinecap="round"
        animate={{
          strokeOpacity: isDragging || isHovered ? 0.7 : 0.4,
        }}
      />

      {/* Labels */}
      {labels.map(({ pitch: p, label }) => {
        const angle = pitchToAngle(p);
        const labelRadius = radius + 20;
        const x = centerX + labelRadius * Math.cos((angle * Math.PI) / 180);
        const y = centerY + labelRadius * Math.sin((angle * Math.PI) / 180);

        return (
          <text
            key={p}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[7px] tracking-wider"
            fill={COLORS.ink}
            fillOpacity={0.25}
          >
            {label}
          </text>
        );
      })}

      {/* Handle */}
      <motion.circle
        cx={handleX}
        cy={handleY}
        r={8}
        fill={COLORS.paper}
        stroke={COLORS.violet}
        strokeWidth={2}
        className="pointer-events-auto cursor-grab"
        style={{
          filter: isDragging || isHovered ? `drop-shadow(0 0 6px ${COLORS.violetGlow})` : 'none',
        }}
        animate={{
          scale: isDragging ? 1.15 : isHovered ? 1.1 : 1,
          strokeOpacity: isDragging || isHovered ? 1 : 0.6,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      {/* Current value display */}
      {(isDragging || isHovered) && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <text
            x={centerX}
            y={centerY - radius - 25}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[10px] font-medium tracking-wider"
            fill={COLORS.violet}
          >
            {pitch > 0 ? `+${pitch}` : pitch} st
          </text>
        </motion.g>
      )}

      {/* Label */}
      <text
        x={centerX}
        y={centerY + radius + 25}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-[7px] tracking-[0.15em] uppercase"
        fill={COLORS.ink}
        fillOpacity={0.2}
      >
        Transpose
      </text>
    </svg>
  );
}
