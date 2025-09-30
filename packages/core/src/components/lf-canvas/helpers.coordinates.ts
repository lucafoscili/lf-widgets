import {
  LfCanvasAdapter,
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

  //#region Normalize points for image
  normalizePointsForImage(
    adapter: LfCanvasAdapter,
    points: LfCanvasPoints = [],
  ) {
    if (!points.length) {
      return points;
    }

    const { controller, elements } = adapter;
    const { get } = controller;
    const { refs } = elements;
    const { board, image } = refs;

    if (!board || !image) {
      return points.map((point) => ({ ...point }));
    }

    const boardRect = board.getBoundingClientRect();
    const boardWidth = boardRect.width || 1;
    const boardHeight = boardRect.height || 1;

    const clamp = (value: number) => Math.max(0, Math.min(1, value));

    const metrics = get.imageMetrics();
    if (metrics && metrics.width > 0 && metrics.height > 0) {
      const { offsetX, offsetY, width, height } = metrics;

      return points.map(({ x, y }) => {
        const pxX = x * boardWidth;
        const pxY = y * boardHeight;

        return {
          x: clamp((pxX - offsetX) / width),
          y: clamp((pxY - offsetY) / height),
        };
      });
    }

    const rect = image.getBoundingClientRect();
    const offsetX = rect.left - boardRect.left;
    const offsetY = rect.top - boardRect.top;
    const effectiveWidth = rect.width || boardWidth;
    const effectiveHeight = rect.height || boardHeight;

    return points.map(({ x, y }) => {
      const pxX = x * boardWidth;
      const pxY = y * boardHeight;

      return {
        x: clamp((pxX - offsetX) / effectiveWidth),
        y: clamp((pxY - offsetY) / effectiveHeight),
      };
    });
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

  //#region Update image metrics
  updateImageMetrics: async (adapter: LfCanvasAdapter) => {
    const { controller, elements } = adapter;
    const { get, set } = controller;
    const { refs } = elements;
    const { board, image } = refs;

    const id = get.imageMetricsRequestId() + 1;
    set.imageMetricsRequestId(id);

    if (!board || !image) {
      if (id === get.imageMetricsRequestId()) {
        set.imageMetrics(null);
      }
      return;
    }

    const element = await image.getImage();
    if (!element) {
      return;
    }
    const rect = element.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();

    let width = rect.width;
    let height = rect.height;
    let offsetX = rect.left - boardRect.left;
    let offsetY = rect.top - boardRect.top;

    if (element instanceof HTMLImageElement) {
      const { naturalHeight, naturalWidth } = element;

      if (naturalWidth > 0 && naturalHeight > 0 && width > 0 && height > 0) {
        const scale = Math.min(width / naturalWidth, height / naturalHeight);
        const drawnWidth = naturalWidth * scale;
        const drawnHeight = naturalHeight * scale;

        offsetX += (width - drawnWidth) / 2;
        offsetY += (height - drawnHeight) / 2;
        width = drawnWidth;
        height = drawnHeight;
      }
    }

    const metrics = {
      height,
      offsetX,
      offsetY,
      width,
    };

    if (id === get.imageMetricsRequestId()) {
      set.imageMetrics(metrics);
    }
  },
  //#endregion
};
