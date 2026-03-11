// Lobster Instrument - Type Definitions

export interface MaterialSample {
  id: string;
  label: string;
  file?: string;
  loaded: boolean;
  loading: boolean;
  waveformData: number[] | null;
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
