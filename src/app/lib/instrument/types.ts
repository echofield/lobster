// Lobster Instrument - Type Definitions

export interface MaterialSample {
  id: string;
  label: string;
  file?: string;
  loaded: boolean;
  loading: boolean;
  waveformData: number[] | null;
  pitch?: number; // Per-node pitch offset in semitones
}

export interface InstrumentPack {
  id: string;
  title: string;
  subtitle: string;
  samples: MaterialSample[];
  colors: {
    primary: string;
    accent: string;
    glow: string;
  };
}

export interface EffectState {
  filter: { freq: number; resonance: number };
  delay: { time: number; feedback: number; mix: number };
  reverb: { size: number; mix: number };
  master: { volume: number };
}

export interface SequencerState {
  steps: boolean[][];  // [nodeIndex][stepIndex]
  currentStep: number;
  isPlaying: boolean;
  tempo: number;
  stepCount: number;
}

export interface InstrumentState {
  initialized: boolean;
  activeNodeId: string | null;
  hoveredNodeId: string | null;
  hoveredEffect: string | null;
  effects: EffectState;
  sequencer: SequencerState;
  meterLevel: number;
  waveformData: Float32Array;
}

export interface NodePosition {
  x: number;
  y: number;
  angle: number;
}

export type EffectType = 'filter' | 'delay' | 'reverb' | 'master';

// Pitch state for global transpose and per-node variations
export interface PitchState {
  global: number; // -12 to +12 semitones
  nodePitches: number[]; // Per-node pitch offsets
  detectedKey: string | null; // e.g., "D minor"
}

// Inertia configuration for spring physics
export interface InertiaConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

// Field monitor data for the right panel visualization
export interface FieldMonitorData {
  fft: Float32Array;
  bpm: number;
  pitch: number;
  activity: number;
  zones: {
    dispersion: number; // Low freq activity (20Hz-200Hz)
    interference: number; // Mid freq activity (200Hz-2kHz)
    resonance: number; // High freq activity (2kHz+)
  };
}

// Aura state for outer glow indicator
export interface AuraState {
  intensity: number; // 0-1
  expansion: number; // 0-1 (percentage of max expansion)
}
