// Hook for managing the step sequencer

import { useState, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import type { SequencerState } from '@/app/lib/instrument/types';
import { DEFAULT_SEQUENCER } from '@/app/lib/instrument/constants';

interface UseSequencerOptions {
  onTrigger: (nodeIndex: number) => void;
  stepCount?: number;
  nodeCount?: number;
}

interface UseSequencerReturn {
  sequencer: SequencerState;
  toggleStep: (nodeIndex: number, stepIndex: number) => void;
  togglePlay: () => void;
  setTempo: (bpm: number) => void;
  clearPattern: () => void;
}

export function useSequencer({
  onTrigger,
  stepCount = 8,
  nodeCount = 8,
}: UseSequencerOptions): UseSequencerReturn {
  const [sequencer, setSequencer] = useState<SequencerState>({
    ...DEFAULT_SEQUENCER,
    stepCount,
    steps: Array(nodeCount)
      .fill(null)
      .map(() => Array(stepCount).fill(false)),
  });

  const sequenceRef = useRef<Tone.Sequence | null>(null);
  const stepsRef = useRef(sequencer.steps);

  // Keep steps ref in sync
  useEffect(() => {
    stepsRef.current = sequencer.steps;
  }, [sequencer.steps]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sequenceRef.current) {
        sequenceRef.current.dispose();
      }
    };
  }, []);

  // Toggle a step
  const toggleStep = useCallback((nodeIndex: number, stepIndex: number) => {
    setSequencer((prev) => {
      const newSteps = prev.steps.map((nodeSteps, ni) =>
        ni === nodeIndex
          ? nodeSteps.map((active, si) =>
              si === stepIndex ? !active : active
            )
          : nodeSteps
      );
      return { ...prev, steps: newSteps };
    });
  }, []);

  // Toggle play/stop
  const togglePlay = useCallback(() => {
    setSequencer((prev) => {
      const newIsPlaying = !prev.isPlaying;

      if (newIsPlaying) {
        // Start sequencer
        Tone.Transport.bpm.value = prev.tempo;

        if (sequenceRef.current) {
          sequenceRef.current.dispose();
        }

        const stepIndices = Array.from({ length: prev.stepCount }, (_, i) => i);

        sequenceRef.current = new Tone.Sequence(
          (time, stepIndex) => {
            // Update current step for visual feedback
            setSequencer((s) => ({ ...s, currentStep: stepIndex }));

            // Trigger active nodes for this step
            stepsRef.current.forEach((nodeSteps, nodeIndex) => {
              if (nodeSteps[stepIndex]) {
                onTrigger(nodeIndex);
              }
            });
          },
          stepIndices,
          '8n'
        );

        sequenceRef.current.start(0);
        Tone.Transport.start();
      } else {
        // Stop sequencer
        if (sequenceRef.current) {
          sequenceRef.current.stop();
        }
        Tone.Transport.stop();
        return { ...prev, isPlaying: false, currentStep: 0 };
      }

      return { ...prev, isPlaying: newIsPlaying };
    });
  }, [onTrigger]);

  // Set tempo
  const setTempo = useCallback((bpm: number) => {
    setSequencer((prev) => {
      Tone.Transport.bpm.value = bpm;
      return { ...prev, tempo: bpm };
    });
  }, []);

  // Clear pattern
  const clearPattern = useCallback(() => {
    setSequencer((prev) => ({
      ...prev,
      steps: prev.steps.map((nodeSteps) => nodeSteps.map(() => false)),
    }));
  }, []);

  return {
    sequencer,
    toggleStep,
    togglePlay,
    setTempo,
    clearPattern,
  };
}
