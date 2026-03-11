// CircularInstrument - Main orchestration component
// Composes all instrument layers into the circular sampler

import { useState, useRef, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { InstrumentCore } from './InstrumentCore';
import { MaterialNode } from './MaterialNode';
import { FlowVisualizer } from './FlowVisualizer';
import { SignalRing } from './SignalRing';
import { SequencerOrbit } from './SequencerOrbit';
import { InstrumentHUD } from './InstrumentHUD';
import { useInstrumentEngine } from '@/app/hooks/useInstrumentEngine';
import { useKeyboardTriggers } from '@/app/hooks/useKeyboardTriggers';
import { useSequencer } from '@/app/hooks/useSequencer';
import { getNodePositions } from '@/app/lib/instrument/geometry';
import { GEOMETRY, COLORS } from '@/app/lib/instrument/constants';
import { keyLabels } from '@/app/data/instrument/sediment-flow';
import type { InstrumentPack, EffectType } from '@/app/lib/instrument/types';

interface CircularInstrumentProps {
  pack: InstrumentPack;
}

export function CircularInstrument({ pack }: CircularInstrumentProps) {
  // Instrument dimensions
  const containerSize = 600;
  const centerX = containerSize / 2;
  const centerY = containerSize / 2;

  // State
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredEffect, setHoveredEffect] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(null);

  // Engine hook
  const {
    initialized,
    samples,
    effects,
    meterLevel,
    waveformData,
    activeNodeId,
    initAudio,
    triggerSample,
    loadSample,
    stopAll,
    updateEffect,
  } = useInstrumentEngine(pack.samples);

  // Sequencer hook
  const { sequencer, toggleStep, togglePlay, setTempo } = useSequencer({
    onTrigger: triggerSample,
  });

  // Keyboard hook
  useKeyboardTriggers({
    onTrigger: async (index) => {
      await initAudio();
      triggerSample(index);
    },
    onStop: stopAll,
    onToggleSequencer: togglePlay,
  });

  // Node positions
  const nodePositions = useMemo(
    () => getNodePositions(centerX, centerY, GEOMETRY.nodeOrbitRadius),
    [centerX, centerY]
  );

  // Handle node click
  const handleNodeClick = useCallback(
    async (index: number) => {
      await initAudio();
      const sample = samples[index];

      if (sample.loaded) {
        triggerSample(index);
      } else {
        setSelectedNodeIndex(index);
        fileInputRef.current?.click();
      }
    },
    [initAudio, samples, triggerSample]
  );

  // Handle file upload
  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || selectedNodeIndex === null) return;

      await loadSample(selectedNodeIndex, file);
      setSelectedNodeIndex(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [selectedNodeIndex, loadSample]
  );

  // Handle core click (play/stop)
  const handleCoreClick = useCallback(async () => {
    await initAudio();
    if (sequencer.isPlaying) {
      stopAll();
    }
    togglePlay();
  }, [initAudio, sequencer.isPlaying, stopAll, togglePlay]);

  // Handle effect change
  const handleEffectChange = useCallback(
    (effect: EffectType, key: string, value: number) => {
      updateEffect(effect, key as any, value);
    },
    [updateEffect]
  );

  // Get active node label
  const activeNodeLabel = activeNodeId
    ? samples[parseInt(activeNodeId)]?.label || null
    : null;

  return (
    <div
      className="relative"
      style={{
        width: containerSize,
        height: containerSize,
      }}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Background - subtle grain texture */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${COLORS.paper} 0%, ${COLORS.paperDark} 100%)`,
          boxShadow: `
            inset 0 0 100px rgba(139, 92, 246, 0.03),
            0 0 80px rgba(0, 0, 0, 0.04)
          `,
        }}
      />

      {/* Outer boundary circle */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      >
        <circle
          cx={centerX}
          cy={centerY}
          r={containerSize / 2 - 4}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth="0.5"
          strokeOpacity={0.1}
        />
        {/* Corner registration marks */}
        {[0, 90, 180, 270].map((angle) => {
          const r = containerSize / 2 - 4;
          const x = centerX + r * Math.cos((angle * Math.PI) / 180);
          const y = centerY + r * Math.sin((angle * Math.PI) / 180);
          return (
            <g key={angle}>
              <line
                x1={x - 4}
                y1={y}
                x2={x + 4}
                y2={y}
                stroke={COLORS.ink}
                strokeWidth="0.5"
                strokeOpacity={0.15}
              />
              <line
                x1={x}
                y1={y - 4}
                x2={x}
                y2={y + 4}
                stroke={COLORS.ink}
                strokeWidth="0.5"
                strokeOpacity={0.15}
              />
            </g>
          );
        })}
      </svg>

      {/* Flow Visualizer Layer */}
      <FlowVisualizer
        centerX={centerX}
        centerY={centerY}
        radius={GEOMETRY.nodeOrbitRadius}
        waveformData={waveformData}
        meterLevel={meterLevel}
        activeNodeId={activeNodeId}
        nodePositions={nodePositions}
      />

      {/* Sequencer Orbit Layer */}
      <SequencerOrbit
        centerX={centerX}
        centerY={centerY}
        sequencer={sequencer}
        onToggleStep={toggleStep}
        onTogglePlay={togglePlay}
      />

      {/* Signal Ring Layer */}
      <SignalRing
        centerX={centerX}
        centerY={centerY}
        effects={effects}
        hoveredEffect={hoveredEffect}
        onEffectHover={setHoveredEffect}
        onEffectChange={handleEffectChange}
      />

      {/* Material Nodes */}
      {samples.map((sample, index) => (
        <MaterialNode
          key={sample.id}
          id={sample.id}
          label={sample.label}
          keyLabel={keyLabels[index]}
          x={nodePositions[index].x}
          y={nodePositions[index].y}
          loaded={sample.loaded}
          loading={sample.loading}
          isActive={activeNodeId === sample.id}
          isHovered={hoveredNodeId === sample.id}
          waveformData={sample.waveformData}
          onClick={() => handleNodeClick(index)}
          onHover={(hovered) =>
            setHoveredNodeId(hovered ? sample.id : null)
          }
        />
      ))}

      {/* Instrument Core */}
      <InstrumentCore
        title={pack.title}
        subtitle={pack.subtitle}
        isActive={activeNodeId !== null}
        isPlaying={sequencer.isPlaying}
        onClick={handleCoreClick}
      />

      {/* HUD Overlay */}
      <InstrumentHUD
        activeNodeLabel={activeNodeLabel}
        loadedCount={samples.filter((s) => s.loaded).length}
        totalCount={samples.length}
        isPlaying={sequencer.isPlaying}
        initialized={initialized}
      />
    </div>
  );
}
