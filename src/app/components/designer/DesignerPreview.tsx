// DesignerPreview - Live instrument preview with dynamic geometry

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { useDesigner } from '@/app/context/DesignerContext';
import { generateNodePositions, getOptimalNodeSize } from '@/app/lib/designer/geometry';
import { COLORS, GEOMETRY } from '@/app/lib/instrument/constants';
import { KEY_MAPS } from '@/app/lib/designer/types';

export function DesignerPreview() {
  const { state, setSelectedNode } = useDesigner();
  const { pack, selectedNodeIndex, previewMode } = state;

  const containerSize = 400;
  const centerX = containerSize / 2;
  const centerY = containerSize / 2;

  // Calculate node positions based on current geometry
  const nodePositions = useMemo(
    () => generateNodePositions(centerX, centerY, pack.geometry.nodeCount),
    [centerX, centerY, pack.geometry.nodeCount]
  );

  const nodeSize = getOptimalNodeSize(pack.geometry.nodeCount);
  const keyLabels = KEY_MAPS[pack.geometry.nodeCount];

  return (
    <div
      className="relative"
      style={{
        width: containerSize,
        height: containerSize,
      }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${COLORS.paper} 0%, ${COLORS.paperDark} 100%)`,
          boxShadow: `inset 0 0 60px ${pack.colors.glow}`,
        }}
      />

      {/* Outer boundary */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <circle
          cx={centerX}
          cy={centerY}
          r={containerSize / 2 - 3}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth="0.5"
          strokeOpacity={0.1}
        />

        {/* Inner orbit ring */}
        <circle
          cx={centerX}
          cy={centerY}
          r={nodePositions[0] ? Math.sqrt(Math.pow(nodePositions[0].x - centerX, 2) + Math.pow(nodePositions[0].y - centerY, 2)) : 100}
          fill="none"
          stroke={pack.colors.primary}
          strokeWidth="0.5"
          strokeOpacity={0.15}
          strokeDasharray="4 4"
        />

        {/* Sequencer orbit hint */}
        <circle
          cx={centerX}
          cy={centerY}
          r={containerSize / 2 - 30}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth="0.5"
          strokeOpacity={0.05}
        />
      </svg>

      {/* Sample Nodes */}
      {pack.samples.map((sample, index) => {
        const pos = nodePositions[index];
        if (!pos) return null;

        const isSelected = selectedNodeIndex === index;
        const isLoaded = sample.loaded;

        return (
          <motion.div
            key={sample.id}
            className="absolute cursor-pointer"
            style={{
              left: pos.x - nodeSize,
              top: pos.y - nodeSize,
              width: nodeSize * 2,
              height: nodeSize * 2,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (previewMode === 'edit') {
                setSelectedNode(isSelected ? null : index);
              }
            }}
          >
            {/* Node circle */}
            <div
              className="w-full h-full rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: isLoaded
                  ? `radial-gradient(circle, ${pack.colors.accent} 0%, ${pack.colors.primary} 100%)`
                  : COLORS.paper,
                border: `1.5px solid ${isSelected ? pack.colors.primary : isLoaded ? pack.colors.accent : COLORS.greyMedium}`,
                boxShadow: isSelected
                  ? `0 0 20px ${pack.colors.glow}`
                  : isLoaded
                    ? `0 0 10px ${pack.colors.glow}`
                    : 'none',
              }}
            >
              {/* Waveform preview */}
              {sample.waveformData && (
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="-1 -1 2 2"
                  style={{ opacity: 0.4 }}
                >
                  {sample.waveformData.slice(0, 16).map((v, i) => {
                    const angle = (i / 16) * Math.PI * 2 - Math.PI / 2;
                    const r = 0.3 + v * 0.5;
                    return (
                      <circle
                        key={i}
                        cx={Math.cos(angle) * r}
                        cy={Math.sin(angle) * r}
                        r={0.04}
                        fill={pack.colors.primary}
                      />
                    );
                  })}
                </svg>
              )}

              {/* Label */}
              <span
                className="text-[8px] font-medium tracking-wider uppercase z-10"
                style={{
                  color: isLoaded ? COLORS.paper : COLORS.ink,
                  opacity: isLoaded ? 0.9 : 0.4,
                }}
              >
                {sample.label.slice(0, 4)}
              </span>
            </div>

            {/* Key label */}
            <div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[7px] tracking-wider uppercase"
              style={{ color: COLORS.ink, opacity: 0.3 }}
            >
              {keyLabels[index]}
            </div>

            {/* Selection indicator */}
            {isSelected && (
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1.4, opacity: [0, 0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ border: `1px solid ${pack.colors.primary}` }}
              />
            )}
          </motion.div>
        );
      })}

      {/* Center Core */}
      <div
        className="absolute rounded-full flex flex-col items-center justify-center"
        style={{
          left: centerX - GEOMETRY.coreRadius,
          top: centerY - GEOMETRY.coreRadius,
          width: GEOMETRY.coreRadius * 2,
          height: GEOMETRY.coreRadius * 2,
          background: COLORS.paper,
          border: `1px solid ${pack.colors.primary}`,
          boxShadow: `0 0 30px ${pack.colors.glow}`,
        }}
      >
        <span
          className="text-[9px] font-medium tracking-wider uppercase"
          style={{ color: pack.colors.primary }}
        >
          {pack.title.slice(0, 8)}
        </span>
        <span
          className="text-[6px] tracking-wider uppercase mt-0.5"
          style={{ color: COLORS.ink, opacity: 0.3 }}
        >
          {pack.geometry.nodeCount} nodes
        </span>
      </div>

      {/* Mode indicator */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[8px] tracking-[0.2em] uppercase"
        style={{ color: COLORS.ink, opacity: 0.2 }}
      >
        {previewMode === 'edit' ? 'Editing' : 'Playing'}
      </div>

      {/* Step count indicator */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 text-[8px] tracking-[0.2em] uppercase"
        style={{ color: COLORS.ink, opacity: 0.2 }}
      >
        {pack.sequencerConfig.stepCount} steps · {pack.sequencerConfig.defaultBPM} bpm
      </div>
    </div>
  );
}
