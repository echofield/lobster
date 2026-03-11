// SequencerOrbit - Circular step sequencer

import { motion } from 'motion/react';
import { COLORS, GEOMETRY } from '@/app/lib/instrument/constants';
import { getSequencerPositions } from '@/app/lib/instrument/geometry';
import type { SequencerState } from '@/app/lib/instrument/types';

interface SequencerOrbitProps {
  centerX: number;
  centerY: number;
  sequencer: SequencerState;
  onToggleStep: (nodeIndex: number, stepIndex: number) => void;
  onTogglePlay: () => void;
}

export function SequencerOrbit({
  centerX,
  centerY,
  sequencer,
  onToggleStep,
  onTogglePlay,
}: SequencerOrbitProps) {
  const radius = GEOMETRY.sequencerOrbitRadius;
  const stepPositions = getSequencerPositions(
    centerX,
    centerY,
    radius,
    sequencer.stepCount
  );

  // Check if any node has this step active
  const getStepState = (stepIndex: number): 'empty' | 'active' | 'current' => {
    if (sequencer.isPlaying && sequencer.currentStep === stepIndex) {
      return 'current';
    }
    const hasActiveNode = sequencer.steps.some(
      (nodeSteps) => nodeSteps[stepIndex]
    );
    return hasActiveNode ? 'active' : 'empty';
  };

  return (
    <svg
      className="absolute inset-0"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Orbit path - very subtle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={COLORS.ink}
        strokeWidth="0.5"
        strokeOpacity={0.05}
        strokeDasharray="2 6"
      />

      {/* Step dots */}
      {stepPositions.map((pos, stepIndex) => {
        const state = getStepState(stepIndex);
        const isCurrent = state === 'current';
        const isActive = state === 'active';

        return (
          <g key={stepIndex}>
            {/* Current step glow */}
            {isCurrent && (
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={GEOMETRY.sequencerDotRadius * 3}
                fill={COLORS.violet}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: [0.4, 0],
                  scale: [0.5, 1.5],
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                }}
              />
            )}

            {/* Step dot */}
            <motion.circle
              cx={pos.x}
              cy={pos.y}
              r={GEOMETRY.sequencerDotRadius}
              fill={
                isCurrent
                  ? COLORS.violet
                  : isActive
                  ? COLORS.violet
                  : COLORS.paper
              }
              stroke={
                isCurrent || isActive
                  ? COLORS.violet
                  : `${COLORS.ink}20`
              }
              strokeWidth="1"
              className="cursor-pointer"
              style={{
                boxShadow: isCurrent
                  ? `0 0 8px ${COLORS.violetGlow}`
                  : 'none',
              }}
              animate={{
                scale: isCurrent ? 1.3 : 1,
                fillOpacity: isCurrent ? 1 : isActive ? 0.6 : 1,
              }}
              transition={{ duration: 0.1 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => {
                // Toggle first node for this step (simplified)
                onToggleStep(0, stepIndex);
              }}
            />

            {/* Step number - very subtle */}
            <text
              x={pos.x}
              y={pos.y + GEOMETRY.sequencerDotRadius + 10}
              textAnchor="middle"
              className="text-[6px] tracking-wider pointer-events-none"
              fill={COLORS.ink}
              fillOpacity={0.15}
            >
              {stepIndex + 1}
            </text>
          </g>
        );
      })}

      {/* Playhead indicator - rotating line when playing */}
      {sequencer.isPlaying && (
        <motion.line
          x1={centerX}
          y1={centerY}
          x2={stepPositions[sequencer.currentStep]?.x || centerX}
          y2={stepPositions[sequencer.currentStep]?.y || centerY - radius}
          stroke={COLORS.violet}
          strokeWidth="1"
          strokeOpacity={0.3}
          strokeLinecap="round"
        />
      )}

      {/* Play/Stop control in corner */}
      <g
        className="cursor-pointer"
        onClick={onTogglePlay}
        transform={`translate(${centerX + radius - 20}, ${centerY + radius - 20})`}
      >
        <circle
          r="12"
          fill={COLORS.paper}
          stroke={sequencer.isPlaying ? COLORS.violet : `${COLORS.ink}20`}
          strokeWidth="1"
        />
        {sequencer.isPlaying ? (
          // Pause icon
          <g fill={COLORS.violet}>
            <rect x="-4" y="-5" width="3" height="10" rx="0.5" />
            <rect x="1" y="-5" width="3" height="10" rx="0.5" />
          </g>
        ) : (
          // Play icon
          <path
            d="M-3,-5 L5,0 L-3,5 Z"
            fill={`${COLORS.ink}40`}
          />
        )}
      </g>

      {/* Tempo indicator */}
      <text
        x={centerX - radius + 20}
        y={centerY + radius - 15}
        className="text-[8px] tracking-wider"
        fill={COLORS.ink}
        fillOpacity={0.3}
      >
        {sequencer.tempo} BPM
      </text>
    </svg>
  );
}
