// MaterialNode - Sound specimen node around the circle

import { motion } from 'motion/react';
import { COLORS, GEOMETRY, TIMING } from '@/app/lib/instrument/constants';

interface MaterialNodeProps {
  id: string;
  label: string;
  keyLabel: string;
  x: number;
  y: number;
  loaded: boolean;
  loading: boolean;
  isActive: boolean;
  isHovered: boolean;
  waveformData: number[] | null;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export function MaterialNode({
  id,
  label,
  keyLabel,
  x,
  y,
  loaded,
  loading,
  isActive,
  isHovered,
  waveformData,
  onClick,
  onHover,
}: MaterialNodeProps) {
  const size = GEOMETRY.nodeRadius * 2;

  return (
    <motion.button
      className="absolute"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: isActive ? GEOMETRY.nodeActiveScale : 1,
      }}
      transition={{ duration: 0.2 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Outer glow on active */}
      {isActive && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 1.5,
            height: size * 1.5,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, ${COLORS.violetGlow} 0%, transparent 70%)`,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: [0.6, 0] }}
          transition={{ duration: TIMING.nodeGlow / 1000 }}
        />
      )}

      {/* Node container */}
      <div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: size,
          height: size,
          background: loaded
            ? isActive
              ? `linear-gradient(135deg, ${COLORS.violet} 0%, ${COLORS.violetDeep} 100%)`
              : `linear-gradient(135deg, ${COLORS.paper} 0%, ${COLORS.paperDark} 100%)`
            : COLORS.paper,
          border: `1px solid ${
            isActive
              ? COLORS.violet
              : isHovered
              ? `${COLORS.violet}60`
              : `${COLORS.ink}15`
          }`,
          boxShadow: isActive
            ? `0 0 20px ${COLORS.violetGlow}, inset 0 1px 0 rgba(255,255,255,0.3)`
            : isHovered
            ? `0 4px 12px rgba(0,0,0,0.08)`
            : `0 2px 8px rgba(0,0,0,0.04)`,
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      >
        {loading ? (
          // Loading spinner
          <motion.div
            className="w-4 h-4 rounded-full border-2"
            style={{
              borderColor: `${COLORS.violet}30`,
              borderTopColor: COLORS.violet,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : loaded ? (
          // Micro waveform
          <div className="flex items-center gap-px h-4">
            {(waveformData || Array(8).fill(0.5)).slice(0, 8).map((v, i) => (
              <motion.div
                key={i}
                className="w-0.5 rounded-full"
                style={{
                  height: `${Math.max(20, (v as number) * 100)}%`,
                  background: isActive ? 'white' : COLORS.violet,
                  opacity: isActive ? 1 : 0.5,
                }}
                animate={
                  isActive
                    ? {
                        scaleY: [1, 1.3, 0.8, 1.2, 1],
                      }
                    : isHovered
                    ? {
                        scaleY: [1, 1.1, 1],
                      }
                    : {}
                }
                transition={{
                  duration: isActive ? 0.2 : 1.5,
                  repeat: isHovered && !isActive ? Infinity : 0,
                  delay: i * 0.03,
                }}
              />
            ))}
          </div>
        ) : (
          // Empty state - subtle plus
          <div
            className="w-4 h-4 flex items-center justify-center"
            style={{ color: `${COLORS.ink}30` }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
        )}
      </div>

      {/* Key binding badge */}
      <div
        className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-medium"
        style={{
          background: COLORS.paper,
          border: `1px solid ${COLORS.ink}15`,
          color: `${COLORS.ink}50`,
        }}
      >
        {keyLabel}
      </div>

      {/* Label below */}
      <motion.p
        className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[8px] tracking-[0.1em] uppercase whitespace-nowrap"
        style={{
          color: isActive ? COLORS.violet : `${COLORS.ink}40`,
        }}
        animate={{
          opacity: isHovered || loaded ? 1 : 0.5,
        }}
      >
        {label}
      </motion.p>
    </motion.button>
  );
}
