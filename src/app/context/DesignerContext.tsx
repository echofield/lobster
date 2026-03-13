// DesignerContext - Central state management for instrument designer

import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type { MaterialSample } from '../lib/instrument/types';
import type {
  DesignerState,
  DesignerInstrumentPack,
  NodeCount,
  StepCount,
  DEFAULT_EFFECT_STATE
} from '../lib/designer/types';
import { saveInstrument, loadInstrument, exportAsJSON, generateId } from '../lib/designer/storage';

// Create empty sample
function createSample(id: string, index: number): MaterialSample {
  return {
    id,
    label: `Sample ${index + 1}`,
    loaded: false,
    loading: false,
    waveformData: null,
  };
}

// Create default instrument pack
function createDefaultPack(): DesignerInstrumentPack {
  return {
    id: '',
    title: 'Untitled',
    subtitle: 'New Instrument',
    samples: Array.from({ length: 8 }, (_, i) => createSample(String(i), i)),
    colors: {
      primary: '#8B5CF6',
      accent: '#C4B5FD',
      glow: 'rgba(139, 92, 246, 0.4)',
    },
    geometry: {
      nodeCount: 8,
    },
    sequencerConfig: {
      stepCount: 8,
      defaultBPM: 120,
    },
    effectDefaults: {
      filter: { freq: 20000, resonance: 1 },
      delay: { time: 0.25, feedback: 0.3, mix: 0 },
      reverb: { size: 2.5, mix: 0 },
      master: { volume: 80 },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Initial state
const initialState: DesignerState = {
  pack: createDefaultPack(),
  isDirty: false,
  activeSection: 'geometry',
  selectedNodeIndex: null,
  previewMode: 'edit',
};

// Action types
type Action =
  | { type: 'SET_NODE_COUNT'; payload: NodeCount }
  | { type: 'SET_STEP_COUNT'; payload: StepCount }
  | { type: 'SET_BPM'; payload: number }
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_SUBTITLE'; payload: string }
  | { type: 'SET_COLOR'; payload: { key: 'primary' | 'accent' | 'glow'; value: string } }
  | { type: 'SET_SAMPLE_LABEL'; payload: { index: number; label: string } }
  | { type: 'SET_SAMPLE_LOADED'; payload: { index: number; waveformData: number[] } }
  | { type: 'CLEAR_SAMPLE'; payload: number }
  | { type: 'SET_EFFECT'; payload: { effect: string; key: string; value: number } }
  | { type: 'SET_ACTIVE_SECTION'; payload: DesignerState['activeSection'] }
  | { type: 'SET_SELECTED_NODE'; payload: number | null }
  | { type: 'SET_PREVIEW_MODE'; payload: 'edit' | 'play' }
  | { type: 'LOAD_PACK'; payload: DesignerInstrumentPack }
  | { type: 'RESET' }
  | { type: 'MARK_SAVED' };

// Reducer
function reducer(state: DesignerState, action: Action): DesignerState {
  switch (action.type) {
    case 'SET_NODE_COUNT': {
      const newCount = action.payload;
      const currentCount = state.pack.geometry.nodeCount;
      let newSamples = [...state.pack.samples];

      if (newCount > currentCount) {
        // Add new empty samples
        for (let i = currentCount; i < newCount; i++) {
          newSamples.push(createSample(String(i), i));
        }
      } else if (newCount < currentCount) {
        // Truncate samples
        newSamples = newSamples.slice(0, newCount);
      }

      return {
        ...state,
        isDirty: true,
        pack: {
          ...state.pack,
          samples: newSamples,
          geometry: { ...state.pack.geometry, nodeCount: newCount },
        },
      };
    }

    case 'SET_STEP_COUNT':
      return {
        ...state,
        isDirty: true,
        pack: {
          ...state.pack,
          sequencerConfig: { ...state.pack.sequencerConfig, stepCount: action.payload },
        },
      };

    case 'SET_BPM':
      return {
        ...state,
        isDirty: true,
        pack: {
          ...state.pack,
          sequencerConfig: { ...state.pack.sequencerConfig, defaultBPM: action.payload },
        },
      };

    case 'SET_TITLE':
      return {
        ...state,
        isDirty: true,
        pack: { ...state.pack, title: action.payload },
      };

    case 'SET_SUBTITLE':
      return {
        ...state,
        isDirty: true,
        pack: { ...state.pack, subtitle: action.payload },
      };

    case 'SET_COLOR':
      return {
        ...state,
        isDirty: true,
        pack: {
          ...state.pack,
          colors: { ...state.pack.colors, [action.payload.key]: action.payload.value },
        },
      };

    case 'SET_SAMPLE_LABEL': {
      const newSamples = [...state.pack.samples];
      newSamples[action.payload.index] = {
        ...newSamples[action.payload.index],
        label: action.payload.label,
      };
      return {
        ...state,
        isDirty: true,
        pack: { ...state.pack, samples: newSamples },
      };
    }

    case 'SET_SAMPLE_LOADED': {
      const newSamples = [...state.pack.samples];
      newSamples[action.payload.index] = {
        ...newSamples[action.payload.index],
        loaded: true,
        loading: false,
        waveformData: action.payload.waveformData,
      };
      return {
        ...state,
        isDirty: true,
        pack: { ...state.pack, samples: newSamples },
      };
    }

    case 'CLEAR_SAMPLE': {
      const newSamples = [...state.pack.samples];
      newSamples[action.payload] = createSample(String(action.payload), action.payload);
      return {
        ...state,
        isDirty: true,
        pack: { ...state.pack, samples: newSamples },
      };
    }

    case 'SET_EFFECT': {
      const { effect, key, value } = action.payload;
      return {
        ...state,
        isDirty: true,
        pack: {
          ...state.pack,
          effectDefaults: {
            ...state.pack.effectDefaults,
            [effect]: {
              ...(state.pack.effectDefaults as any)[effect],
              [key]: value,
            },
          },
        },
      };
    }

    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.payload };

    case 'SET_SELECTED_NODE':
      return { ...state, selectedNodeIndex: action.payload };

    case 'SET_PREVIEW_MODE':
      return { ...state, previewMode: action.payload };

    case 'LOAD_PACK':
      return {
        ...state,
        pack: action.payload,
        isDirty: false,
      };

    case 'RESET':
      return {
        ...initialState,
        pack: createDefaultPack(),
      };

    case 'MARK_SAVED':
      return { ...state, isDirty: false };

    default:
      return state;
  }
}

// Context value type
interface DesignerContextValue {
  state: DesignerState;
  setNodeCount: (count: NodeCount) => void;
  setStepCount: (count: StepCount) => void;
  setBPM: (bpm: number) => void;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
  setColor: (key: 'primary' | 'accent' | 'glow', value: string) => void;
  setSampleLabel: (index: number, label: string) => void;
  setSampleLoaded: (index: number, waveformData: number[]) => void;
  clearSample: (index: number) => void;
  setEffect: (effect: string, key: string, value: number) => void;
  setActiveSection: (section: DesignerState['activeSection']) => void;
  setSelectedNode: (index: number | null) => void;
  setPreviewMode: (mode: 'edit' | 'play') => void;
  save: () => void;
  load: (id: string) => boolean;
  exportJSON: () => void;
  reset: () => void;
}

const DesignerContext = createContext<DesignerContextValue | null>(null);

export function DesignerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setNodeCount = useCallback((count: NodeCount) => {
    dispatch({ type: 'SET_NODE_COUNT', payload: count });
  }, []);

  const setStepCount = useCallback((count: StepCount) => {
    dispatch({ type: 'SET_STEP_COUNT', payload: count });
  }, []);

  const setBPM = useCallback((bpm: number) => {
    dispatch({ type: 'SET_BPM', payload: Math.max(60, Math.min(200, bpm)) });
  }, []);

  const setTitle = useCallback((title: string) => {
    dispatch({ type: 'SET_TITLE', payload: title });
  }, []);

  const setSubtitle = useCallback((subtitle: string) => {
    dispatch({ type: 'SET_SUBTITLE', payload: subtitle });
  }, []);

  const setColor = useCallback((key: 'primary' | 'accent' | 'glow', value: string) => {
    dispatch({ type: 'SET_COLOR', payload: { key, value } });
  }, []);

  const setSampleLabel = useCallback((index: number, label: string) => {
    dispatch({ type: 'SET_SAMPLE_LABEL', payload: { index, label } });
  }, []);

  const setSampleLoaded = useCallback((index: number, waveformData: number[]) => {
    dispatch({ type: 'SET_SAMPLE_LOADED', payload: { index, waveformData } });
  }, []);

  const clearSample = useCallback((index: number) => {
    dispatch({ type: 'CLEAR_SAMPLE', payload: index });
  }, []);

  const setEffect = useCallback((effect: string, key: string, value: number) => {
    dispatch({ type: 'SET_EFFECT', payload: { effect, key, value } });
  }, []);

  const setActiveSection = useCallback((section: DesignerState['activeSection']) => {
    dispatch({ type: 'SET_ACTIVE_SECTION', payload: section });
  }, []);

  const setSelectedNode = useCallback((index: number | null) => {
    dispatch({ type: 'SET_SELECTED_NODE', payload: index });
  }, []);

  const setPreviewMode = useCallback((mode: 'edit' | 'play') => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: mode });
  }, []);

  const save = useCallback(() => {
    const pack = {
      ...state.pack,
      id: state.pack.id || generateId(state.pack.title),
    };
    saveInstrument(pack);
    dispatch({ type: 'LOAD_PACK', payload: pack });
    dispatch({ type: 'MARK_SAVED' });
  }, [state.pack]);

  const load = useCallback((id: string): boolean => {
    const pack = loadInstrument(id);
    if (pack) {
      dispatch({ type: 'LOAD_PACK', payload: pack });
      return true;
    }
    return false;
  }, []);

  const exportJSON = useCallback(() => {
    const pack = {
      ...state.pack,
      id: state.pack.id || generateId(state.pack.title),
    };
    exportAsJSON(pack);
  }, [state.pack]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <DesignerContext.Provider
      value={{
        state,
        setNodeCount,
        setStepCount,
        setBPM,
        setTitle,
        setSubtitle,
        setColor,
        setSampleLabel,
        setSampleLoaded,
        clearSample,
        setEffect,
        setActiveSection,
        setSelectedNode,
        setPreviewMode,
        save,
        load,
        exportJSON,
        reset,
      }}
    >
      {children}
    </DesignerContext.Provider>
  );
}

export function useDesigner() {
  const context = useContext(DesignerContext);
  if (!context) {
    throw new Error('useDesigner must be used within a DesignerProvider');
  }
  return context;
}
