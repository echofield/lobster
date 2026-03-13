// Designer Types - Extended instrument configuration

import type { MaterialSample, EffectState } from '../instrument/types';

export type NodeCount = 4 | 6 | 8 | 12;
export type StepCount = 4 | 8 | 16;

export interface GeometryConfig {
  nodeCount: NodeCount;
  orbitRadius?: number;
}

export interface SequencerConfig {
  stepCount: StepCount;
  defaultBPM: number;
}

export interface DesignerInstrumentPack {
  id: string;
  title: string;
  subtitle: string;
  samples: MaterialSample[];
  colors: {
    primary: string;
    accent: string;
    glow: string;
  };
  geometry: GeometryConfig;
  sequencerConfig: SequencerConfig;
  effectDefaults: EffectState;
  createdAt: string;
  updatedAt: string;
}

export interface DesignerState {
  pack: DesignerInstrumentPack;
  isDirty: boolean;
  activeSection: 'geometry' | 'samples' | 'theme' | 'effects' | 'sequencer' | 'identity';
  selectedNodeIndex: number | null;
  previewMode: 'edit' | 'play';
}

export interface ColorPreset {
  id: string;
  name: string;
  primary: string;
  accent: string;
  glow: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'violet',
    name: 'Violet',
    primary: '#8B5CF6',
    accent: '#C4B5FD',
    glow: 'rgba(139, 92, 246, 0.4)',
  },
  {
    id: 'amber',
    name: 'Amber',
    primary: '#F59E0B',
    accent: '#FCD34D',
    glow: 'rgba(245, 158, 11, 0.4)',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    primary: '#10B981',
    accent: '#6EE7B7',
    glow: 'rgba(16, 185, 129, 0.4)',
  },
  {
    id: 'rose',
    name: 'Rose',
    primary: '#F43F5E',
    accent: '#FDA4AF',
    glow: 'rgba(244, 63, 94, 0.4)',
  },
  {
    id: 'slate',
    name: 'Slate',
    primary: '#64748B',
    accent: '#CBD5E1',
    glow: 'rgba(100, 116, 139, 0.4)',
  },
];

export const KEY_MAPS: Record<NodeCount, string[]> = {
  4: ['1', '2', '3', '4'],
  6: ['1', '2', '3', 'Q', 'W', 'E'],
  8: ['1', '2', '3', '4', 'Q', 'W', 'E', 'R'],
  12: ['1', '2', '3', '4', 'Q', 'W', 'E', 'R', 'A', 'S', 'D', 'F'],
};

export const DEFAULT_EFFECT_STATE: EffectState = {
  filter: { freq: 20000, resonance: 1 },
  delay: { time: 0.25, feedback: 0.3, mix: 0 },
  reverb: { size: 2.5, mix: 0 },
  master: { volume: 80 },
};
