// Hook for keyboard triggers in the instrument

import { useEffect, useCallback } from 'react';
import { KEY_MAP } from '@/app/lib/instrument/constants';

interface UseKeyboardTriggersOptions {
  onTrigger: (nodeIndex: number) => void;
  onStop: () => void;
  onToggleSequencer?: () => void;
  enabled?: boolean;
}

export function useKeyboardTriggers({
  onTrigger,
  onStop,
  onToggleSequencer,
  enabled = true,
}: UseKeyboardTriggersOptions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      const key = e.key.toLowerCase();

      // Check for sample trigger keys
      if (key in KEY_MAP) {
        e.preventDefault();
        onTrigger(KEY_MAP[key]);
        return;
      }

      // Space = stop all
      if (e.code === 'Space') {
        e.preventDefault();
        onStop();
        return;
      }

      // Shift = toggle sequencer
      if (e.key === 'Shift' && onToggleSequencer) {
        e.preventDefault();
        onToggleSequencer();
        return;
      }
    },
    [enabled, onTrigger, onStop, onToggleSequencer]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
