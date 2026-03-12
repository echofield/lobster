// InstrumentCore - Center diamond / artifact core
// Displays pack title and acts as master control

import { motion } from 'motion/react';
import { COLORS, TIMING } from '@/app/lib/instrument/constants';

interface InstrumentCoreProps {
  title: string;
  subtitle: string;
  isActive: boolean;
  isPlaying: boolean;
  tempo?: number; // BPM for breathing sync
  onClick: () => void;
}

export function InstrumentCore({
  title,
  subtitle,
  isActive,
  isPlaying,
  tempo = 120,
  onClick,
}: InstrumentCoreProps) {
  // Breathing duration synced to tempo (2 beats)
  const breathDuration = (60 / tempo) * 2;
  return (
    <motion.button
      onClick={onClick}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1,
          opacity: isActive ? [0.3, 0.6, 0.3] : isPlaying ? 0.15 : 0,
        }}
        transition={{
          duration: isActive ? 0.3 : TIMING.corePulse / 1000,
          repeat: isPlaying && !isActive ? Infinity : 0,
        }}
        style={{
          width: 120,
          height: 120,
          background: `radial-gradient(circle, ${COLORS.violetGlow} 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '50%',
        }}
      />

      {/* Core container with breathing animation */}
      <motion.div
        className="relative w-24 h-24 flex items-center justify-center"
        animate={{
          scale: isPlaying ? [1, 1.005, 1] : 1,
        }}
        transition={{
          duration: breathDuration,
          repeat: isPlaying ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        {/* Rotating outer square */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div
            className="absolute inset-0 border rotate-45"
            style={{
              borderColor: isActive
                ? COLORS.violet
                : `${COLORS.ink}20`,
              transition: 'border-color 0.2s',
            }}
          />
        </motion.div>

        {/* Inner diamond */}
        <motion.div
          className="relative w-12 h-12 rotate-45"
          animate={{
            scale: isActive ? [1, 0.9, 1] : 1,
          }}
          transition={{ duration: 0.15 }}
          style={{
            background: isActive
              ? `linear-gradient(135deg, ${COLORS.violet} 0%, ${COLORS.violetDeep} 100%)`
              : `linear-gradient(135deg, ${COLORS.paper} 0%, ${COLORS.paperDark} 100%)`,
            border: `1px solid ${isActive ? COLORS.violet : COLORS.ink}20`,
            boxShadow: isActive
              ? `0 0 30px ${COLORS.violetGlow}`
              : 'none',
            transition: 'all 0.2s',
          }}
        />

        {/* Center dot */}
        <motion.div
          className="absolute w-2 h-2 rounded-full"
          animate={{
            scale: isPlaying ? [1, 1.3, 1] : 1,
            opacity: isPlaying ? [0.6, 1, 0.6] : 0.4,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          style={{
            background: COLORS.violet,
            boxShadow: `0 0 8px ${COLORS.violetGlow}`,
          }}
        />
      </motion.div>

      {/* Title text below */}
      <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
        <motion.p
          className="text-[11px] tracking-[0.25em] uppercase font-medium"
          style={{ color: COLORS.violet }}
          animate={{ opacity: isActive ? 1 : 0.7 }}
        >
          {title}
        </motion.p>
        <p
          className="text-[9px] tracking-[0.15em] uppercase mt-1"
          style={{ color: `${COLORS.ink}40` }}
        >
          {subtitle}
        </p>
      </div>
    </motion.button>
  );
}
