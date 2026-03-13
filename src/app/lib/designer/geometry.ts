// Designer Geometry - Dynamic node positioning

import type { NodeCount } from './types';

/**
 * Generate evenly-spaced node angles for any count
 * Starts from top (-90 degrees) and goes clockwise
 */
export function generateNodeAngles(nodeCount: NodeCount): number[] {
  const startAngle = -90;
  const step = 360 / nodeCount;

  return Array.from({ length: nodeCount }, (_, i) => {
    const angle = startAngle + i * step;
    return angle >= 360 ? angle - 360 : angle;
  });
}

/**
 * Get optimal orbit radius based on node count
 * Adjusts for visual balance with different densities
 */
export function getOptimalOrbitRadius(nodeCount: NodeCount): number {
  const baseRadius = 140;
  const adjustments: Record<NodeCount, number> = {
    4: baseRadius * 0.85,
    6: baseRadius * 0.92,
    8: baseRadius,
    12: baseRadius * 1.08,
  };
  return adjustments[nodeCount];
}

/**
 * Get optimal node size based on count
 * Smaller nodes when there are more
 */
export function getOptimalNodeSize(nodeCount: NodeCount): number {
  const baseSize = 28;
  const adjustments: Record<NodeCount, number> = {
    4: baseSize * 1.2,
    6: baseSize * 1.1,
    8: baseSize,
    12: baseSize * 0.85,
  };
  return adjustments[nodeCount];
}

/**
 * Get sequencer orbit radius based on step count
 */
export function getSequencerOrbitRadius(stepCount: 4 | 8 | 16): number {
  const baseRadius = 240;
  const adjustments: Record<number, number> = {
    4: baseRadius * 0.9,
    8: baseRadius,
    16: baseRadius * 1.1,
  };
  return adjustments[stepCount];
}

/**
 * Generate positions for nodes around a circle
 */
export function generateNodePositions(
  centerX: number,
  centerY: number,
  nodeCount: NodeCount,
  radius?: number
): Array<{ x: number; y: number; angle: number }> {
  const angles = generateNodeAngles(nodeCount);
  const r = radius ?? getOptimalOrbitRadius(nodeCount);

  return angles.map((angle) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: centerX + r * Math.cos(rad),
      y: centerY + r * Math.sin(rad),
      angle,
    };
  });
}
