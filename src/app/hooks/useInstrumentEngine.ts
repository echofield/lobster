// Hook for managing the instrument audio engine

import { useState, useEffect, useRef, useCallback } from 'react';
import { audioEngine } from '@/app/audio/AudioEngine';
import type { EffectState, MaterialSample } from '@/app/lib/instrument/types';
import { DEFAULT_EFFECTS } from '@/app/lib/instrument/constants';

interface UseInstrumentEngineReturn {
  initialized: boolean;
  samples: MaterialSample[];
  effects: EffectState;
  meterLevel: number;
  waveformData: Float32Array;
  fftData: Float32Array;
  globalPitch: number;
  activeNodeId: string | null;
  initAudio: () => Promise<void>;
  triggerSample: (nodeIndex: number) => void;
  loadSample: (nodeIndex: number, file: File) => Promise<void>;
  stopAll: () => void;
  updateEffect: <K extends keyof EffectState>(
    section: K,
    key: keyof EffectState[K],
    value: number
  ) => void;
  setGlobalPitch: (semitones: number) => void;
}

export function useInstrumentEngine(
  initialSamples: MaterialSample[]
): UseInstrumentEngineReturn {
  const [initialized, setInitialized] = useState(false);
  const [samples, setSamples] = useState<MaterialSample[]>(initialSamples);
  const [effects, setEffects] = useState<EffectState>(DEFAULT_EFFECTS);
  const [meterLevel, setMeterLevel] = useState(-60);
  const [waveformData, setWaveformData] = useState<Float32Array>(
    new Float32Array(256)
  );
  const [fftData, setFftData] = useState<Float32Array>(new Float32Array(64));
  const [globalPitch, setGlobalPitchState] = useState(0);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const animationRef = useRef<number>();

  // Initialize audio engine
  const initAudio = useCallback(async () => {
    if (!initialized) {
      await audioEngine.init();
      setInitialized(true);
    }
  }, [initialized]);

  // Sync effects to audio engine
  useEffect(() => {
    if (!initialized) return;

    audioEngine.setFilterFrequency(effects.filter.freq);
    audioEngine.setFilterQ(effects.filter.resonance);
    audioEngine.setDelayTime(effects.delay.time);
    audioEngine.setDelayFeedback(effects.delay.feedback);
    audioEngine.setDelayMix(effects.delay.mix);
    audioEngine.setReverbDecay(effects.reverb.size);
    audioEngine.setReverbMix(effects.reverb.mix);
    audioEngine.setMasterVolume(effects.master.volume / 100);
  }, [initialized, effects]);

  // Visual animation loop
  useEffect(() => {
    if (!initialized) return;

    const updateVisuals = () => {
      const data = audioEngine.getWaveform();
      setWaveformData(data);
      const fft = audioEngine.getFFTData();
      setFftData(fft);
      const level = audioEngine.getMeterLevel();
      setMeterLevel(level);
      animationRef.current = requestAnimationFrame(updateVisuals);
    };

    animationRef.current = requestAnimationFrame(updateVisuals);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initialized]);

  // Set global pitch
  const setGlobalPitch = useCallback(
    (semitones: number) => {
      setGlobalPitchState(semitones);
      if (initialized) {
        audioEngine.setGlobalPitch(semitones);
      }
    },
    [initialized]
  );

  // Trigger a sample
  const triggerSample = useCallback(
    (nodeIndex: number) => {
      const sample = samples[nodeIndex];
      if (!sample?.loaded) return;

      audioEngine.triggerPad(sample.id);
      setActiveNodeId(sample.id);
      setTimeout(() => setActiveNodeId(null), 150);
    },
    [samples]
  );

  // Load a sample
  const loadSample = useCallback(
    async (nodeIndex: number, file: File) => {
      await initAudio();

      setSamples((prev) =>
        prev.map((s, i) => (i === nodeIndex ? { ...s, loading: true } : s))
      );

      try {
        await audioEngine.loadSampleFromFile(String(nodeIndex), file);
        const waveform = audioEngine.getWaveformData(String(nodeIndex));

        setSamples((prev) =>
          prev.map((s, i) =>
            i === nodeIndex
              ? {
                  ...s,
                  loaded: true,
                  loading: false,
                  waveformData: waveform,
                }
              : s
          )
        );
      } catch (err) {
        console.error('Failed to load sample:', err);
        setSamples((prev) =>
          prev.map((s, i) => (i === nodeIndex ? { ...s, loading: false } : s))
        );
      }
    },
    [initAudio]
  );

  // Stop all samples
  const stopAll = useCallback(() => {
    audioEngine.stopAll();
  }, []);

  // Update an effect parameter
  const updateEffect = useCallback(
    <K extends keyof EffectState>(
      section: K,
      key: keyof EffectState[K],
      value: number
    ) => {
      setEffects((prev) => ({
        ...prev,
        [section]: { ...prev[section], [key]: value },
      }));
    },
    []
  );

  return {
    initialized,
    samples,
    effects,
    meterLevel,
    waveformData,
    fftData,
    globalPitch,
    activeNodeId,
    initAudio,
    triggerSample,
    loadSample,
    stopAll,
    updateEffect,
    setGlobalPitch,
  };
}
