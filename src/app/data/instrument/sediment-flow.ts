// Lobster Instrument - Sediment Flow Pack

import type { InstrumentPack, MaterialSample } from '@/app/lib/instrument/types';

const createSample = (id: string, label: string): MaterialSample => ({
  id,
  label,
  loaded: false,
  loading: false,
  waveformData: null,
});

export const sedimentFlowPack: InstrumentPack = {
  id: 'sediment-flow',
  title: 'Sediment Flow',
  subtitle: 'Mineral Textures',
  samples: [
    createSample('0', 'Quartz'),
    createSample('1', 'Dust'),
    createSample('2', 'Basalt'),
    createSample('3', 'Crystal'),
    createSample('4', 'Ash'),
    createSample('5', 'Sand'),
    createSample('6', 'Granite'),
    createSample('7', 'Clay'),
  ],
  colors: {
    primary: '#8B5CF6',
    accent: '#C4B5FD',
    glow: 'rgba(139, 92, 246, 0.4)',
  },
};

// Material descriptions for tooltips/info
export const materialDescriptions: Record<string, string> = {
  Quartz: 'Crystalline resonance',
  Dust: 'Suspended particles',
  Basalt: 'Volcanic depth',
  Crystal: 'Prismatic clarity',
  Ash: 'Aftermath texture',
  Sand: 'Granular flow',
  Granite: 'Dense foundation',
  Clay: 'Malleable form',
};

// Key mappings display
export const keyLabels = ['1', '2', '3', '4', 'Q', 'W', 'E', 'R'];
