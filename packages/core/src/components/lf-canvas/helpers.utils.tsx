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

//#region getImageDimensions
/**
 * Extracts the width and height from an image-like DOM element.
 *
 * Behavior:
 * - If `image` is an HTMLImageElement, returns `naturalWidth` and `naturalHeight`.
 * - If `image` is an SVGElement, first tries `getBBox()` (wrapped in a try/catch),
 *   then falls back to the `width` and `height` attributes.
 * - For any other element-like object, attempts to read `naturalWidth`/`naturalHeight`
 *   or `width`/`height` properties.
 *
 * @param image - The element to inspect (may be `HTMLImageElement`, `SVGElement`,
 *                other element-like objects, or `null`).
 * @returns An object with `width` and `height` properties (0 if dimensions cannot be determined).
 */
export const getImageDimensions = (
  image: Element | null,
): { width: number; height: number } => {
  if (!image) {
    return { width: 0, height: 0 };
  }

  if (image instanceof HTMLImageElement) {
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
  }

  if (image instanceof SVGElement) {
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

    return { width: w, height: h };
  }

  // Fallback for other element-like objects
  const elementWithDimensions = image as any;
  const nw =
    elementWithDimensions.naturalWidth ?? elementWithDimensions.width ?? 0;
  const nh =
    elementWithDimensions.naturalHeight ?? elementWithDimensions.height ?? 0;

  return { width: nw, height: nh };
};
//#endregion

//#region calcOrientation
/**
 * Determine the canvas orientation for a given image-like DOM element.
 *
 * Uses `getImageDimensions()` to extract the width and height, then delegates to
 * `_calcOrientation()` to determine the orientation.
 *
 * @param image - The element to inspect (may be `HTMLImageElement`, `SVGElement`,
 *                other element-like objects, or `null`).
 * @returns The computed LfCanvasOrientation, or `null` if the orientation cannot be determined.
 */
export const calcOrientation = (image: Element | null): LfCanvasOrientation => {
  const { width, height } = getImageDimensions(image);

  if (width > 0 && height > 0) {
    return _calcOrientation(width, height);
  }

  return null;
};
//#endregion
