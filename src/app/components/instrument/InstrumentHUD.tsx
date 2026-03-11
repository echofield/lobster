// InstrumentHUD - Minimal informational overlay

import { motion } from 'motion/react';
import { COLORS } from '@/app/lib/instrument/constants';

interface InstrumentHUDProps {
  activeNodeLabel: string | null;
  loadedCount: number;
  totalCount: number;
  isPlaying: boolean;
  initialized: boolean;
}

export function InstrumentHUD({
  activeNodeLabel,
  loadedCount,
  totalCount,
  isPlaying,
  initialized,
}: InstrumentHUDProps) {
  return (
    <>
      {/* Top-left: Status indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-3">
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          animate={{
            opacity: initialized ? [0.4, 1, 0.4] : 0.2,
            background: initialized ? COLORS.violet : COLORS.ink,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          style={{
            boxShadow: initialized ? `0 0 6px ${COLORS.violetGlow}` : 'none',
          }}
        />
        <span
          className="text-[8px] tracking-[0.15em] uppercase"
          style={{ color: `${COLORS.ink}40` }}
        >
          {initialized ? 'Active' : 'Standby'}
        </span>
      </div>

      {/* Top-right: Sample count */}
      <div className="absolute top-4 right-4">
        <span
          className="text-[8px] tracking-[0.1em] uppercase"
          style={{ color: `${COLORS.ink}30` }}
        >
          {loadedCount}/{totalCount} Loaded
        </span>
      </div>

      {/* Bottom: Key hints */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span
            className="text-[8px] tracking-[0.1em] uppercase"
            style={{ color: `${COLORS.ink}30` }}
          >
            Keys: 1-4, Q-R
          </span>
          <span style={{ color: `${COLORS.ink}15` }}>|</span>
          <span
            className="text-[8px] tracking-[0.1em] uppercase"
            style={{ color: `${COLORS.ink}30` }}
          >
            Space: Stop
          </span>
        </div>

        {/* Active sample indicator */}
        {activeNodeLabel && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2"
          >
            <motion.div
              className="w-1 h-1 rounded-full"
              style={{ background: COLORS.violet }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.3 }}
            />
            <span
              className="text-[9px] tracking-[0.1em] uppercase font-medium"
              style={{ color: COLORS.violet }}
            >
              {activeNodeLabel}
            </span>
          </motion.div>
        )}

        {/* Sequencer playing indicator */}
        {isPlaying && !activeNodeLabel && (
          <motion.div
            className="flex items-center gap-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-0.5 bg-violet-500 rounded-full"
                  animate={{
                    height: ['4px', '8px', '4px'],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  style={{ background: COLORS.violet }}
                />
              ))}
            </div>
            <span
              className="text-[8px] tracking-[0.1em] uppercase"
              style={{ color: COLORS.violet }}
            >
              Sequencing
            </span>
          </motion.div>
        )}
      </div>
    </>
  );
}
