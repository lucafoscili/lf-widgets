import { LfCanvasBoxing, LfCanvasOrientation } from "@lf-widgets/foundations";

/**
 * Determine the canvas orientation from its width and height.
 *
 * @param w - The width of the canvas (in pixels or units).
 * @param h - The height of the canvas (in pixels or units).
 * @returns Returns "landscape" when width is greater than height, "portrait" when width is less than height,
 *          or null when width and height are equal (square).
 */
const _calcOrientation = (w: number, h: number): LfCanvasOrientation => {
  if (w > h) {
    return "landscape";
  } else if (w < h) {
    return "portrait";
  } else {
    return null;
  }
};

//#region calcBoxing
/**
 * Determines the boxing type (letterbox or pillarbox) based on the aspect ratios
 * of the container and the image.
 *
 * Letterboxing occurs when the image aspect ratio is wider than the container,
 * resulting in horizontal bars (top/bottom).
 * Pillarboxing occurs when the image aspect ratio is taller than the container,
 * resulting in vertical bars (left/right).
 *
 * @param containerWidth - The width of the container element
 * @param containerHeight - The height of the container element
 * @param imageWidth - The natural width of the image
 * @param imageHeight - The natural height of the image
 * @returns "letterbox", "pillarbox", or null if no boxing is needed
 */
export const calcBoxing = (
  containerWidth: number,
  containerHeight: number,
  imageWidth: number,
  imageHeight: number,
): LfCanvasBoxing => {
  if (
    !containerWidth ||
    !containerHeight ||
    !imageWidth ||
    !imageHeight ||
    containerWidth <= 0 ||
    containerHeight <= 0 ||
    imageWidth <= 0 ||
    imageHeight <= 0
  ) {
    return null;
  }

  const imgAspect = imageWidth / imageHeight;
  const containerAspect = containerWidth / containerHeight;

  if (imgAspect > containerAspect) {
    return "letterbox";
  } else if (imgAspect < containerAspect) {
    return "pillarbox";
  }

  return null;
};
//#endregion

//#region calcOrientation
/**
 * Determine the canvas orientation for a given image-like DOM element.
 *
 * The function attempts to derive numeric width and height from the provided element and then
 * delegates to an internal helper `_calcOrientation(width, height)` to produce an LfCanvasOrientation.
 *
 * Behavior:
 * - If `image` is an HTMLImageElement, `naturalWidth` / `naturalHeight` are used.
 * - If `image` is an SVGElement, the function first tries `getBBox()` (wrapped in a try/catch because
 *   some SVGs may throw), and if that yields no valid dimensions it falls back to the `width` and
 *   `height` attributes on the SVG element.
 * - For any other element-like object, the function attempts to read `naturalWidth` / `naturalHeight`
 *   or `width` / `height` properties.
 *
 * The first valid positive numeric width and height found are passed to `_calcOrientation`. If no
 * usable dimensions can be determined (or if `image` is `null`), the function returns `null`.
 *
 * Notes:
 * - This function is synchronous and has no side effects.
 * - It is tolerant to missing or zero dimensions and explicitly handles the case where `getBBox`
 *   may throw for certain SVG content.
 *
 * @param image - The element to inspect (may be `HTMLImageElement`, `SVGElement`, other element-like objects,
 *                or `null`).
 * @returns The computed LfCanvasOrientation, or `null` if the orientation cannot be determined.
 */
export const calcOrientation = (image: Element | null): LfCanvasOrientation => {
  if (image) {
    if (image instanceof HTMLImageElement) {
      const { naturalWidth, naturalHeight } = image;
      return _calcOrientation(naturalWidth, naturalHeight);
    } else if (image instanceof SVGElement) {
      const svgGraphics = image as SVGGraphicsElement;
      let w = 0;
      let h = 0;

      try {
        const bbox =
          typeof svgGraphics.getBBox === "function"
            ? svgGraphics.getBBox()
            : null;
        if (bbox && bbox.width && bbox.height) {
          w = bbox.width;
          h = bbox.height;
        }
      } catch {
        // getBBox can throw for certain SVGs, fall back to attributes
      }

      if (w === 0 || h === 0) {
        const attrW = (image as SVGElement).getAttribute("width");
        const attrH = (image as SVGElement).getAttribute("height");
        w = w || parseFloat(attrW ?? "0");
        h = h || parseFloat(attrH ?? "0");
      }

      if (w > 0 && h > 0) {
        return _calcOrientation(w, h);
      }
    } else {
      // fallback for other element-like objects
      const elementWithDimensions = image as any;
      const nw =
        elementWithDimensions.naturalWidth ?? elementWithDimensions.width ?? 0;
      const nh =
        elementWithDimensions.naturalHeight ??
        elementWithDimensions.height ??
        0;
      if (nw > 0 && nh > 0) {
        return _calcOrientation(nw, nh);
      }
    }
  }

  return null;
};
//#endregion
