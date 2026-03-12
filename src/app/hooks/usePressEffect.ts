// usePressEffect - Tactile press/release feedback for nodes
// Creates the physical sensation of touching a boutique hardware button

import { useState, useCallback, useRef } from 'react';
import { useSpring, MotionValue } from 'motion/react';

type PressState = 'idle' | 'pressing' | 'releasing';

interface UsePressEffectOptions {
  pressScale?: number; // Scale when pressed (default: 0.95)
  releaseScale?: number; // Scale on release before settling (default: 1.02)
  afterglowDuration?: number; // Duration of afterglow in ms (default: 300)
  springConfig?: {
    stiffness: number;
    damping: number;
  };
}

interface UsePressEffectReturn {
  pressState: PressState;
  scale: MotionValue<number>;
  glowIntensity: number;
  isPressed: boolean;
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerLeave: (e: React.PointerEvent) => void;
  };
}

export function usePressEffect({
  pressScale = 0.95,
  releaseScale = 1.02,
  afterglowDuration = 300,
  springConfig = { stiffness: 400, damping: 25 },
}: UsePressEffectOptions = {}): UsePressEffectReturn {
  const [pressState, setPressState] = useState<PressState>('idle');
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [isPressed, setIsPressed] = useState(false);

  const scale = useSpring(1, springConfig);
  const releaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const glowTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();

      // Clear any existing timeouts
      if (releaseTimeoutRef.current) {
        clearTimeout(releaseTimeoutRef.current);
      }
      if (glowTimeoutRef.current) {
        clearTimeout(glowTimeoutRef.current);
      }

      setPressState('pressing');
      setIsPressed(true);
      scale.set(pressScale);
      setGlowIntensity(0.8);
    },
    [scale, pressScale]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isPressed) return;

      setPressState('releasing');
      setIsPressed(false);

      // Overshoot on release
      scale.set(releaseScale);
      setGlowIntensity(1);

      // Settle back to normal
      releaseTimeoutRef.current = setTimeout(() => {
        scale.set(1);
        setPressState('idle');
      }, 100);

      // Fade out afterglow
      glowTimeoutRef.current = setTimeout(() => {
        setGlowIntensity(0);
      }, afterglowDuration);
    },
    [scale, releaseScale, afterglowDuration, isPressed]
  );

  const onPointerLeave = useCallback(
    (e: React.PointerEvent) => {
      if (isPressed) {
        // Release if pointer leaves while pressed
        onPointerUp(e);
      }
    },
    [isPressed, onPointerUp]
  );

  return {
    pressState,
    scale,
    glowIntensity,
    isPressed,
    handlers: {
      onPointerDown,
      onPointerUp,
      onPointerLeave,
    },
  };
}

// Simplified version that just returns animation values
export function useTactilePress() {
  const [isPressed, setIsPressed] = useState(false);
  const [showAfterglow, setShowAfterglow] = useState(false);
  const afterglowTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onPress = useCallback(() => {
    setIsPressed(true);
    setShowAfterglow(true);

    if (afterglowTimeoutRef.current) {
      clearTimeout(afterglowTimeoutRef.current);
    }
  }, []);

  const onRelease = useCallback(() => {
    setIsPressed(false);

    // Keep afterglow visible for a bit
    afterglowTimeoutRef.current = setTimeout(() => {
      setShowAfterglow(false);
    }, 300);
  }, []);

  // Return animation config for motion components
  const getAnimationProps = useCallback(() => {
    return {
      animate: {
        scale: isPressed ? 0.95 : 1,
      },
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 25,
      },
    };
  }, [isPressed]);

  return {
    isPressed,
    showAfterglow,
    onPress,
    onRelease,
    getAnimationProps,
    handlers: {
      onPointerDown: onPress,
      onPointerUp: onRelease,
      onPointerLeave: onRelease,
    },
  };
}
