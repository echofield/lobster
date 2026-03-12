// MaterialNode - Sound specimen node around the circle

import { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import { COLORS, GEOMETRY, TIMING, INERTIA } from '@/app/lib/instrument/constants';

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
  pitch?: number; // Per-node pitch offset
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
  pitch = 0,
  onClick,
  onHover,
}: MaterialNodeProps) {
  const size = GEOMETRY.nodeRadius * 2;

  // Tactile press state
  const [isPressed, setIsPressed] = useState(false);
  const [showAfterglow, setShowAfterglow] = useState(false);
  const [showCrystallization, setShowCrystallization] = useState(false);
  const [wasLoaded, setWasLoaded] = useState(loaded);

  // Spring-animated scale for press effect
  const rawScale = useMotionValue(1);
  const smoothScale = useSpring(rawScale, INERTIA.snappy);

  // Trigger crystallization animation when sample loads
  useEffect(() => {
    if (loaded && !wasLoaded) {
      setShowCrystallization(true);
      const timeout = setTimeout(() => setShowCrystallization(false), 800);
      return () => clearTimeout(timeout);
    }
    setWasLoaded(loaded);
  }, [loaded, wasLoaded]);

  // Trigger afterglow when node becomes active
  useEffect(() => {
    if (isActive) {
      setShowAfterglow(true);
      const timeout = setTimeout(() => setShowAfterglow(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [isActive]);

  // Handle press
  const handlePointerDown = () => {
    setIsPressed(true);
    rawScale.set(0.95);
  };

  const handlePointerUp = () => {
    setIsPressed(false);
    rawScale.set(1.02);
    setTimeout(() => rawScale.set(1), 100);
  };

  return (
    <motion.button
      className="absolute"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        scale: smoothScale,
      }}
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        if (isPressed) handlePointerUp();
        onHover(false);
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: isActive ? GEOMETRY.nodeActiveScale : 1,
      }}
      transition={{ duration: 0.2 }}
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

      {/* Afterglow effect - lingers after trigger */}
      {showAfterglow && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size * 1.3,
            height: size * 1.3,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            border: `1px solid ${COLORS.violet}`,
          }}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      )}

      {/* Crystallization animation - plays when sample loads */}
      {showCrystallization && (
        <>
          {/* Expanding crystal rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute pointer-events-none"
              style={{
                width: size,
                height: size,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                border: `1px solid ${COLORS.violet}`,
                borderRadius: i === 0 ? '50%' : i === 1 ? '30%' : '10%',
              }}
              initial={{ scale: 0.5, opacity: 0.8, rotate: 0 }}
              animate={{ scale: 1.8, opacity: 0, rotate: 45 * (i + 1) }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
            />
          ))}
          {/* Inner flash */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: size * 0.8,
              height: size * 0.8,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, ${COLORS.violet} 0%, transparent 70%)`,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </>
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
          // Empty state - show material name
          <span
            className="text-[7px] tracking-[0.05em] uppercase font-medium text-center leading-tight px-1"
            style={{ color: `${COLORS.ink}40` }}
          >
            {label.length > 6 ? label.slice(0, 6) : label}
          </span>
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
      <motion.div
        className="absolute top-full mt-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5"
        animate={{
          opacity: isHovered || loaded ? 1 : 0.5,
        }}
      >
        <p
          className="text-[8px] tracking-[0.1em] uppercase whitespace-nowrap"
          style={{
            color: isActive ? COLORS.violet : `${COLORS.ink}40`,
          }}
        >
          {label}
        </p>
        {/* Pitch indicator */}
        {loaded && pitch !== 0 && (
          <span
            className="text-[7px] tracking-wider"
            style={{
              color: pitch > 0 ? COLORS.violet : `${COLORS.ink}50`,
            }}
          >
            {pitch > 0 ? `+${pitch}` : pitch}
          </span>
        )}
      </motion.div>
    </motion.button>
  );
}
