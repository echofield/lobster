// SequencerSection - Step count and BPM configuration

import { motion } from 'motion/react';
import { useDesigner } from '@/app/context/DesignerContext';
import { COLORS } from '@/app/lib/instrument/constants';
import type { StepCount } from '@/app/lib/designer/types';

const STEP_OPTIONS: StepCount[] = [4, 8, 16];

export function SequencerSection() {
  const { state, setStepCount, setBPM } = useDesigner();
  const { stepCount, defaultBPM } = state.pack.sequencerConfig;

  return (
    <div className="space-y-5">
      <div className="text-[9px] tracking-[0.2em] uppercase opacity-40">
        Sequencer
      </div>

      {/* Step count */}
      <div className="space-y-2">
        <div
          className="text-[8px] tracking-wider uppercase"
          style={{ color: COLORS.ink, opacity: 0.3 }}
        >
          Steps per cycle
        </div>
        <div className="flex gap-2">
          {STEP_OPTIONS.map((count) => {
            const isActive = stepCount === count;
            return (
              <motion.button
                key={count}
                onClick={() => setStepCount(count)}
                className="flex-1 py-2 rounded-lg text-[11px] font-medium transition-all"
                style={{
                  background: isActive ? COLORS.violet : `${COLORS.ink}05`,
                  color: isActive ? COLORS.paper : COLORS.ink,
                  opacity: isActive ? 1 : 0.4,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {count}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* BPM */}
      <div className="space-y-2">
        <div
          className="text-[8px] tracking-wider uppercase"
          style={{ color: COLORS.ink, opacity: 0.3 }}
        >
          Default BPM
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={60}
            max={200}
            value={defaultBPM}
            onChange={(e) => setBPM(parseInt(e.target.value))}
            className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${COLORS.violet} 0%, ${COLORS.violet} ${((defaultBPM - 60) / 140) * 100}%, ${COLORS.greyLight} ${((defaultBPM - 60) / 140) * 100}%, ${COLORS.greyLight} 100%)`,
            }}
          />
          <input
            type="number"
            min={60}
            max={200}
            value={defaultBPM}
            onChange={(e) => setBPM(parseInt(e.target.value) || 120)}
            className="w-14 px-2 py-1 text-center text-[11px] font-mono rounded"
            style={{
              background: `${COLORS.ink}05`,
              color: COLORS.ink,
              border: 'none',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Visual preview */}
      <div className="flex justify-center gap-1 py-2">
        {Array.from({ length: stepCount }, (_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: i === 0 ? COLORS.violet : `${COLORS.ink}15`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
