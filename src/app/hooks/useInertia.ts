// useInertia - Spring physics for boutique hardware feel
// The "500 Euro trick" - makes controls feel like premium hardware

import { useRef, useCallback, useEffect } from 'react';
import {
  useMotionValue,
  useSpring,
  MotionValue,
  SpringOptions,
} from 'motion/react';

export interface InertiaConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export const INERTIA_PRESETS = {
  default: { stiffness: 300, damping: 25, mass: 0.5 },
  heavy: { stiffness: 200, damping: 30, mass: 0.8 },
  snappy: { stiffness: 400, damping: 20, mass: 0.3 },
} as const;

interface UseInertiaOptions {
  initialValue?: number;
  min?: number;
  max?: number;
  config?: InertiaConfig;
  onChange?: (value: number) => void;
}

interface UseInertiaReturn {
  value: MotionValue<number>;
  smoothValue: MotionValue<number>;
  isDragging: boolean;
  set: (newValue: number) => void;
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
  };
}

export function useInertia({
  initialValue = 0,
  min = 0,
  max = 1,
  config = INERTIA_PRESETS.default,
  onChange,
}: UseInertiaOptions = {}): UseInertiaReturn {
  const raw = useMotionValue(initialValue);
  const smooth = useSpring(raw, config as SpringOptions);

  const isDraggingRef = useRef(false);
  const startValueRef = useRef(0);
  const startPosRef = useRef({ x: 0, y: 0 });

  // Track dragging state for external use
  const isDragging = isDraggingRef.current;

  // Sync smooth value changes to callback
  useEffect(() => {
    if (!onChange) return;

    const unsubscribe = smooth.on('change', (latest) => {
      if (onChange) {
        onChange(latest);
      }
    });

    return unsubscribe;
  }, [smooth, onChange]);

  const set = useCallback(
    (newValue: number) => {
      const clamped = Math.max(min, Math.min(max, newValue));
      raw.set(clamped);
    },
    [raw, min, max]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      isDraggingRef.current = true;
      startValueRef.current = raw.get();
      startPosRef.current = { x: e.clientX, y: e.clientY };
    },
    [raw]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = -(e.clientY - startPosRef.current.y); // Invert Y for natural feel

      // Use horizontal for linear, could be configured
      const sensitivity = (max - min) / 200; // 200px drag = full range
      const newValue = startValueRef.current + deltaX * sensitivity;

      set(newValue);
    },
    [max, min, set]
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    isDraggingRef.current = false;
  }, []);

  return {
    value: raw,
    smoothValue: smooth,
    isDragging,
    set,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
  };
}

// Radial inertia for arc-based controls
interface UseRadialInertiaOptions {
  centerX: number;
  centerY: number;
  startAngle: number; // degrees
  endAngle: number; // degrees
  initialValue?: number; // 0-1 normalized
  config?: InertiaConfig;
  onChange?: (value: number) => void;
}

interface UseRadialInertiaReturn {
  value: MotionValue<number>;
  smoothValue: MotionValue<number>;
  isDragging: boolean;
  set: (newValue: number) => void;
  getAngle: () => number;
  handlers: {
    onPointerDown: (e: React.PointerEvent, svgElement: SVGSVGElement | null) => void;
    onPointerMove: (e: React.PointerEvent, svgElement: SVGSVGElement | null) => void;
    onPointerUp: (e: React.PointerEvent) => void;
  };
}

export function useRadialInertia({
  centerX,
  centerY,
  startAngle,
  endAngle,
  initialValue = 0,
  config = INERTIA_PRESETS.default,
  onChange,
}: UseRadialInertiaOptions): UseRadialInertiaReturn {
  const raw = useMotionValue(initialValue);
  const smooth = useSpring(raw, config as SpringOptions);

  const isDraggingRef = useRef(false);

  // Sync smooth value changes to callback
  useEffect(() => {
    if (!onChange) return;

    const unsubscribe = smooth.on('change', (latest) => {
      if (onChange) {
        onChange(latest);
      }
    });

    return unsubscribe;
  }, [smooth, onChange]);

  const set = useCallback(
    (newValue: number) => {
      const clamped = Math.max(0, Math.min(1, newValue));
      raw.set(clamped);
    },
    [raw]
  );

  const getAngle = useCallback(() => {
    const normalizedValue = smooth.get();
    return startAngle + (endAngle - startAngle) * normalizedValue;
  }, [smooth, startAngle, endAngle]);

  const calculateValueFromPoint = useCallback(
    (clientX: number, clientY: number, svgElement: SVGSVGElement | null) => {
      if (!svgElement) return raw.get();

      const rect = svgElement.getBoundingClientRect();
      const x = clientX - rect.left - centerX;
      const y = clientY - rect.top - centerY;

      let angle = Math.atan2(y, x) * (180 / Math.PI);

      // Normalize angle to arc range
      let normalizedAngle = angle;
      if (normalizedAngle < startAngle - 10) {
        normalizedAngle += 360;
      }

      const arcRange = endAngle - startAngle;
      const ratio = (normalizedAngle - startAngle) / arcRange;

      return Math.max(0, Math.min(1, ratio));
    },
    [centerX, centerY, startAngle, endAngle, raw]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent, svgElement: SVGSVGElement | null) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      isDraggingRef.current = true;

      const newValue = calculateValueFromPoint(e.clientX, e.clientY, svgElement);
      set(newValue);
    },
    [calculateValueFromPoint, set]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent, svgElement: SVGSVGElement | null) => {
      if (!isDraggingRef.current) return;

      const newValue = calculateValueFromPoint(e.clientX, e.clientY, svgElement);
      set(newValue);
    },
    [calculateValueFromPoint, set]
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    isDraggingRef.current = false;
  }, []);

  return {
    value: raw,
    smoothValue: smooth,
    isDragging: isDraggingRef.current,
    set,
    getAngle,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
  };
}
