// Lobster Instrument - Constants

// Color palette aligned with Lobster/ARCHÉ aesthetic
export const COLORS = {
  paper: '#FAF8F2',
  paperDark: '#F5F3ED',
  ink: '#1A1A1A',
  lavender: '#C4B5FD',
  violet: '#8B5CF6',
  violetDeep: '#7C3AED',
  violetGlow: 'rgba(139, 92, 246, 0.4)',
  greyLight: '#E8E5DE',
  greyMedium: '#C8C4BA',
} as const;

// Geometry
export const GEOMETRY = {
  // Circle radii for the instrument layers
  coreRadius: 48,
  nodeOrbitRadius: 140,
  pitchRingRadius: 175, // Between nodes and effects
  effectOrbitRadius: 200,
  sequencerOrbitRadius: 240,

  // Node sizing
  nodeRadius: 28,
  nodeActiveScale: 1.15,

  // Effect arc dimensions
  effectArcWidth: 12,
  effectArcGap: 4,

  // Sequencer
  sequencerDotRadius: 4,
  sequencerSteps: 8,

  // BPM control
  bpmControlSize: 40,

  // Field monitor
  fieldMonitorWidth: 300,

  // Aura
  auraMaxExpansion: 20,
} as const;

// Animation timings (in ms)
export const TIMING = {
  nodeGlow: 150,
  corePulse: 2000,
  rippleDuration: 1500,
  sequencerRotation: 8000,
  effectTransition: 100,
} as const;

// Keyboard mappings
export const KEY_MAP: Record<string, number> = {
  '1': 0,
  '2': 1,
  '3': 2,
  '4': 3,
  'q': 4,
  'w': 5,
  'e': 6,
  'r': 7,
};

// Node positions around the circle (staggered layout)
// Arranged as: 1 at top, then alternating left-right descending
export const NODE_ANGLES = [
  -90,   // 1 - top
  -45,   // 2 - top-right
  -135,  // Q - top-left
  0,     // 3 - right
  180,   // W - left
  45,    // 4 - bottom-right
  135,   // E - bottom-left
  90,    // R - bottom
] as const;

// Effect arc positions (degrees from top, clockwise)
export const EFFECT_ARCS = {
  filter: { start: -60, end: -20 },
  delay: { start: 20, end: 60 },
  reverb: { start: 120, end: 160 },
  master: { start: 200, end: 240 },
} as const;

// Default effect values
export const DEFAULT_EFFECTS = {
  filter: { freq: 20000, resonance: 1 },
  delay: { time: 0.25, feedback: 0.3, mix: 0 },
  reverb: { size: 2.5, mix: 0 },
  master: { volume: 80 },
};

// Default sequencer
export const DEFAULT_SEQUENCER = {
  steps: Array(8).fill(null).map(() => Array(8).fill(false)),
  currentStep: 0,
  isPlaying: false,
  tempo: 120,
  stepCount: 8,
};

// Inertia presets for spring physics (the "500 Euro trick")
export const INERTIA = {
  default: { stiffness: 300, damping: 25, mass: 0.5 },
  heavy: { stiffness: 200, damping: 30, mass: 0.8 },
  snappy: { stiffness: 400, damping: 20, mass: 0.3 },
} as const;

// Pitch constants
export const PITCH = {
  min: -12,
  max: 12,
  // Default node pitches (major scale intervals)
  nodeDefaults: [0, 2, 4, 5, 7, 9, 11, 12],
} as const;

// BPM constraints
export const BPM = {
  min: 60,
  max: 200,
  default: 120,
} as const;
