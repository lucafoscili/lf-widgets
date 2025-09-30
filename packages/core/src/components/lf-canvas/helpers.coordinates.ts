import {
  LfCanvasAdapterToolkitCoordinates,
  LfCanvasPoints,
} from "@lf-widgets/foundations";

/**
 * Collection of utility functions for handling canvas coordinates and point simplification
 * @interface LfCanvasAdapterToolkitCoordinates
 *
 * @property {function} get - Converts mouse event coordinates to canvas coordinates
 * @param {MouseEvent} e - The mouse event containing client coordinates
 * @param {DOMRect} rect - The canvas bounding rectangle
 * @returns {{x: number, y: number}} Canvas coordinates clamped to canvas dimensions
 *
 * @property {function} normalize - Converts mouse event coordinates to normalized coordinates (0-1 range)
 * @param {MouseEvent} e - The mouse event containing client coordinates
 * @param {DOMRect} rect - The canvas bounding rectangle
 * @returns {{x: number, y: number}} Normalized coordinates between 0 and 1
 *
 * @property {function} simplify - Reduces the number of points in a path while preserving its shape
 * @param {LfCanvasPoints} points - Array of points to simplify
 * @param {number} tolerance - Distance tolerance for point removal
 * @returns {LfCanvasPoints} Simplified array of points
 */
export const coordinates: LfCanvasAdapterToolkitCoordinates = {
  //#region Get coords
  get: (e, rect) => {
    const { height, left, top, width } = rect;

    let x = e.clientX - left;
    let y = e.clientY - top;

    x = Math.max(0, Math.min(width, x));
    y = Math.max(0, Math.min(height, y));

    return { x, y };
  },
  //#endregion

  //#region Normalize coords
  normalize: (e, rect) => {
    const { height, left, top, width } = rect;

    let x = (e.clientX - left) / width;
    let y = (e.clientY - top) / height;

    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));

    return { x, y };
  },
  //#endregion

  //#region Simplify coords
  simplify: (points, tolerance) => {
    if (points.length <= 2) {
      return points;
    }

    const sqTolerance = tolerance * tolerance;

    function getSqDist(p1: LfCanvasPoints[0], p2: LfCanvasPoints[0]): number {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      return dx * dx + dy * dy;
    }

    function simplifyRecursive(
      start: number,
      end: number,
      sqTolerance: number,
      simplified: LfCanvasPoints,
    ) {
      let maxSqDist = sqTolerance;
      let index = -1;

      for (let i = start + 1; i < end; i++) {
        const sqDist = getSqDist(
          points[i],
          getClosestPoint(points[start], points[end], points[i]),
        );
        if (sqDist > maxSqDist) {
          index = i;
          maxSqDist = sqDist;
        }
      }

      if (maxSqDist > sqTolerance) {
        if (index - start > 1)
          simplifyRecursive(start, index, sqTolerance, simplified);
        simplified.push(points[index]);
        if (end - index > 1)
          simplifyRecursive(index, end, sqTolerance, simplified);
      }
    }

    function getClosestPoint(
      p1: LfCanvasPoints[0],
      p2: LfCanvasPoints[0],
      p: LfCanvasPoints[0],
    ) {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const t = ((p.x - p1.x) * dx + (p.y - p1.y) * dy) / (dx * dx + dy * dy);
      return { x: p1.x + t * dx, y: p1.y + t * dy };
    }

    const simplified = [points[0]];
    simplifyRecursive(0, points.length - 1, sqTolerance, simplified);
    simplified.push(points[points.length - 1]);

    return simplified;
  },
  //#endregion
};
