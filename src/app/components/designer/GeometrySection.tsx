// GeometrySection - Node count selector with visual previews

import { motion } from 'motion/react';
import { useDesigner } from '@/app/context/DesignerContext';
import { COLORS } from '@/app/lib/instrument/constants';
import type { NodeCount } from '@/app/lib/designer/types';

const NODE_OPTIONS: NodeCount[] = [4, 6, 8, 12];

function MiniPreview({ count, isActive }: { count: NodeCount; isActive: boolean }) {
  const size = 48;
  const center = size / 2;
  const radius = 16;

  const angles = Array.from({ length: count }, (_, i) => -90 + (360 / count) * i);

  return (
    <svg width={size} height={size} className="transition-all duration-200">
      {/* Orbit */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={isActive ? COLORS.violet : COLORS.ink}
        strokeWidth="0.5"
        strokeOpacity={isActive ? 0.3 : 0.1}
      />
      {/* Nodes */}
      {angles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = center + radius * Math.cos(rad);
        const y = center + radius * Math.sin(rad);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={3}
            fill={isActive ? COLORS.violet : COLORS.ink}
            opacity={isActive ? 1 : 0.2}
          />
        );
      })}
      {/* Center */}
      <circle
        cx={center}
        cy={center}
        r={4}
        fill={isActive ? COLORS.violet : COLORS.ink}
        opacity={isActive ? 0.6 : 0.1}
      />
    </svg>
  );
}

export function GeometrySection() {
  const { state, setNodeCount } = useDesigner();
  const currentCount = state.pack.geometry.nodeCount;

  return (
    <div className="space-y-4">
      <div className="text-[9px] tracking-[0.2em] uppercase opacity-40">
        Geometry
      </div>

      <div className="grid grid-cols-4 gap-2">
        {NODE_OPTIONS.map((count) => {
          const isActive = currentCount === count;
          return (
            <motion.button
              key={count}
              onClick={() => setNodeCount(count)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all"
              style={{
                background: isActive ? `${COLORS.violet}10` : 'transparent',
                border: `1px solid ${isActive ? COLORS.violet : 'transparent'}`,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MiniPreview count={count} isActive={isActive} />
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? COLORS.violet : COLORS.ink, opacity: isActive ? 1 : 0.4 }}
              >
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>

      {currentCount !== state.pack.samples.length && (
        <div className="text-[8px] text-amber-600 opacity-60">
          Changing geometry will adjust sample slots
        </div>
      )}
    </div>
  );
}
