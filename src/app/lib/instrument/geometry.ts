// Lobster Instrument - Geometry Utilities

import { NodePosition } from './types';
import { GEOMETRY, NODE_ANGLES } from './constants';

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Calculate position on a circle given angle and radius
 */
export function getCirclePoint(
  centerX: number,
  centerY: number,
  radius: number,
  angleDegrees: number
): { x: number; y: number } {
  const rad = degToRad(angleDegrees);
  return {
    x: centerX + radius * Math.cos(rad),
    y: centerY + radius * Math.sin(rad),
  };
}

/**
 * Get positions for all 8 material nodes around the circle
 */
export function getNodePositions(
  centerX: number,
  centerY: number,
  radius: number = GEOMETRY.nodeOrbitRadius
): NodePosition[] {
  return NODE_ANGLES.map((angle) => {
    const point = getCirclePoint(centerX, centerY, radius, angle);
    return {
      x: point.x,
      y: point.y,
      angle,
    };
  });
}

/**
 * Generate SVG arc path for effect controls
 */
export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = getCirclePoint(cx, cy, radius, startAngle);
  const end = getCirclePoint(cx, cy, radius, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

/**
 * Generate sequencer step positions around orbit
 */
export function getSequencerPositions(
  centerX: number,
  centerY: number,
  radius: number,
  stepCount: number
): { x: number; y: number; angle: number }[] {
  const positions: { x: number; y: number; angle: number }[] = [];
  const stepAngle = 360 / stepCount;

  for (let i = 0; i < stepCount; i++) {
    const angle = -90 + i * stepAngle; // Start from top
    const point = getCirclePoint(centerX, centerY, radius, angle);
    positions.push({ x: point.x, y: point.y, angle });
  }

  return positions;
}

/**
 * Calculate distance between two points
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Check if a point is within a circular area
 */
export function isPointInCircle(
  px: number,
  py: number,
  cx: number,
  cy: number,
  radius: number
): boolean {
  return distance(px, py, cx, cy) <= radius;
}

/**
 * Calculate angle from center to a point (in degrees)
 */
export function angleFromCenter(
  px: number,
  py: number,
  cx: number,
  cy: number
): number {
  return radToDeg(Math.atan2(py - cy, px - cx));
}

/**
 * Normalize angle to 0-360 range
 */
export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/**
 * Check if an angle falls within an arc range
 */
export function isAngleInArc(
  angle: number,
  startAngle: number,
  endAngle: number
): boolean {
  const normalizedAngle = normalizeAngle(angle);
  const normalizedStart = normalizeAngle(startAngle);
  const normalizedEnd = normalizeAngle(endAngle);

  if (normalizedStart <= normalizedEnd) {
    return normalizedAngle >= normalizedStart && normalizedAngle <= normalizedEnd;
  } else {
    return normalizedAngle >= normalizedStart || normalizedAngle <= normalizedEnd;
  }
}
