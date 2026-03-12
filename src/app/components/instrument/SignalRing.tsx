// SignalRing - Effects as arc segments on outer ring
// Updated with drag-based interaction and spring inertia

import { useRef, useCallback, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import { COLORS, GEOMETRY, EFFECT_ARCS, INERTIA } from '@/app/lib/instrument/constants';
import { describeArc } from '@/app/lib/instrument/geometry';
import type { EffectState, EffectType } from '@/app/lib/instrument/types';

interface SignalRingProps {
  centerX: number;
  centerY: number;
  effects: EffectState;
  hoveredEffect: string | null;
  onEffectHover: (effect: string | null) => void;
  onEffectChange: (
    effect: EffectType,
    key: string,
    value: number
  ) => void;
}

interface EffectArcConfig {
  id: EffectType;
  label: string;
  valueKey: string;
  min: number;
  max: number;
  unit: string;
  getValue: (effects: EffectState) => number;
}

const effectConfigs: EffectArcConfig[] = [
  {
    id: 'filter',
    label: 'Filter',
    valueKey: 'freq',
    min: 20,
    max: 20000,
    unit: 'Hz',
    getValue: (e) => e.filter.freq,
  },
  {
    id: 'delay',
    label: 'Delay',
    valueKey: 'mix',
    min: 0,
    max: 1,
    unit: '%',
    getValue: (e) => e.delay.mix,
  },
  {
    id: 'reverb',
    label: 'Reverb',
    valueKey: 'mix',
    min: 0,
    max: 1,
    unit: '%',
    getValue: (e) => e.reverb.mix,
  },
  {
    id: 'master',
    label: 'Master',
    valueKey: 'volume',
    min: 0,
    max: 100,
    unit: '%',
    getValue: (e) => e.master.volume,
  },
];

export function SignalRing({
  centerX,
  centerY,
  effects,
  hoveredEffect,
  onEffectHover,
  onEffectChange,
}: SignalRingProps) {
  const radius = GEOMETRY.effectOrbitRadius;
  const arcWidth = GEOMETRY.effectArcWidth;
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingEffect, setDraggingEffect] = useState<EffectType | null>(null);

  // Calculate value from pointer position
  const calculateValueFromPointer = useCallback(
    (clientX: number, clientY: number, config: EffectArcConfig) => {
      const svg = svgRef.current;
      if (!svg) return null;

      const rect = svg.getBoundingClientRect();
      const x = clientX - rect.left - centerX;
      const y = clientY - rect.top - centerY;

      let angle = Math.atan2(y, x) * (180 / Math.PI);
      const arcConfig = EFFECT_ARCS[config.id];

      // Normalize angle to arc range
      let normalizedAngle = angle;
      if (normalizedAngle < arcConfig.start - 10) {
        normalizedAngle += 360;
      }

      const arcRange = arcConfig.end - arcConfig.start;
      const clickRatio = Math.max(0, Math.min(1, (normalizedAngle - arcConfig.start) / arcRange));

      return config.min + clickRatio * (config.max - config.min);
    },
    [centerX, centerY]
  );

  // Handle pointer down - start dragging
  const handlePointerDown = useCallback(
    (e: React.PointerEvent, config: EffectArcConfig) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as SVGElement).setPointerCapture(e.pointerId);
      setDraggingEffect(config.id);

      const newValue = calculateValueFromPointer(e.clientX, e.clientY, config);
      if (newValue !== null) {
        onEffectChange(config.id, config.valueKey, newValue);
      }
    },
    [calculateValueFromPointer, onEffectChange]
  );

  // Handle pointer move - update value while dragging
  const handlePointerMove = useCallback(
    (e: React.PointerEvent, config: EffectArcConfig) => {
      if (draggingEffect !== config.id) return;

      const newValue = calculateValueFromPointer(e.clientX, e.clientY, config);
      if (newValue !== null) {
        onEffectChange(config.id, config.valueKey, newValue);
      }
    },
    [draggingEffect, calculateValueFromPointer, onEffectChange]
  );

  // Handle pointer up - stop dragging
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as SVGElement).releasePointerCapture(e.pointerId);
    setDraggingEffect(null);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Base ring - very subtle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={COLORS.ink}
        strokeWidth="0.5"
        strokeOpacity={0.08}
      />

      {/* Effect arcs */}
      {effectConfigs.map((config) => {
        const arcConfig = EFFECT_ARCS[config.id];
        const value = config.getValue(effects);
        const normalizedValue =
          config.max === 1
            ? value
            : config.id === 'filter'
            ? value / config.max
            : value / config.max;
        const isHovered = hoveredEffect === config.id;

        // Background arc (track)
        const trackPath = describeArc(
          centerX,
          centerY,
          radius,
          arcConfig.start,
          arcConfig.end
        );

        // Value arc (filled portion)
        const fillEnd =
          arcConfig.start + (arcConfig.end - arcConfig.start) * normalizedValue;
        const valuePath = describeArc(
          centerX,
          centerY,
          radius,
          arcConfig.start,
          fillEnd
        );

        // Label position
        const labelAngle = (arcConfig.start + arcConfig.end) / 2;
        const labelRadius = radius + 24;
        const labelX =
          centerX + labelRadius * Math.cos((labelAngle * Math.PI) / 180);
        const labelY =
          centerY + labelRadius * Math.sin((labelAngle * Math.PI) / 180);

        // Value display
        const displayValue =
          config.unit === '%'
            ? `${Math.round(normalizedValue * 100)}%`
            : `${Math.round(value)}${config.unit}`;

        return (
          <g key={config.id}>
            {/* Track */}
            <path
              d={trackPath}
              fill="none"
              stroke={COLORS.ink}
              strokeWidth={arcWidth}
              strokeOpacity={0.08}
              strokeLinecap="round"
            />

            {/* Value fill */}
            <motion.path
              d={valuePath}
              fill="none"
              stroke={COLORS.violet}
              strokeWidth={arcWidth - 2}
              strokeLinecap="round"
              animate={{
                strokeOpacity: isHovered ? 0.8 : 0.4,
              }}
              style={{
                filter: isHovered ? `drop-shadow(0 0 4px ${COLORS.violetGlow})` : 'none',
              }}
            />

            {/* Interactive overlay - drag-based with inertia feel */}
            <path
              d={trackPath}
              fill="none"
              stroke="transparent"
              strokeWidth={arcWidth + 16}
              className="pointer-events-auto cursor-grab"
              style={{
                cursor: draggingEffect === config.id ? 'grabbing' : 'grab',
              }}
              onMouseEnter={() => onEffectHover(config.id)}
              onMouseLeave={() => {
                if (draggingEffect !== config.id) {
                  onEffectHover(null);
                }
              }}
              onPointerDown={(e) => handlePointerDown(e, config)}
              onPointerMove={(e) => handlePointerMove(e, config)}
              onPointerUp={handlePointerUp}
              onPointerLeave={(e) => {
                if (draggingEffect === config.id) {
                  handlePointerUp(e);
                }
              }}
            />

            {/* Label */}
            <motion.text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[8px] tracking-wider uppercase pointer-events-none"
              fill={COLORS.ink}
              fillOpacity={isHovered ? 0.7 : 0.3}
            >
              {config.label}
            </motion.text>

            {/* Value tooltip on hover */}
            {isHovered && (
              <motion.g
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <text
                  x={labelX}
                  y={labelY + 12}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[9px] font-medium pointer-events-none"
                  fill={COLORS.violet}
                >
                  {displayValue}
                </text>
              </motion.g>
            )}

            {/* Start/end markers */}
            {[arcConfig.start, arcConfig.end].map((angle, i) => {
              const markerX = centerX + radius * Math.cos((angle * Math.PI) / 180);
              const markerY = centerY + radius * Math.sin((angle * Math.PI) / 180);
              return (
                <circle
                  key={i}
                  cx={markerX}
                  cy={markerY}
                  r={2}
                  fill={COLORS.violet}
                  fillOpacity={isHovered ? 0.6 : 0.2}
                />
              );
            })}
          </g>
        );
      })}

      {/* Connection line through center - signal flow indicator */}
      <motion.line
        x1={centerX - radius - 30}
        y1={centerY}
        x2={centerX + radius + 30}
        y2={centerY}
        stroke={COLORS.violet}
        strokeWidth="0.5"
        strokeOpacity={0.1}
        strokeDasharray="4 4"
        animate={{
          strokeDashoffset: [0, -8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Input/Output labels */}
      <text
        x={centerX - radius - 40}
        y={centerY}
        textAnchor="end"
        dominantBaseline="middle"
        className="text-[7px] tracking-wider uppercase"
        fill={COLORS.ink}
        fillOpacity={0.2}
      >
        IN
      </text>
      <text
        x={centerX + radius + 40}
        y={centerY}
        textAnchor="start"
        dominantBaseline="middle"
        className="text-[7px] tracking-wider uppercase"
        fill={COLORS.ink}
        fillOpacity={0.2}
      >
        OUT
      </text>
    </svg>
  );
}
