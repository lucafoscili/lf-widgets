import { LfCarouselAdapter } from "@lf-widgets/foundations";

/**
 * Object containing methods to control carousel autoplay functionality.
 * @namespace
 * @property {Function} start - Initiates the autoplay if conditions are met.
 * @property {Function} stop - Stops the current autoplay interval.
 *
 * @example
 * ```typescript
 * // Start autoplay
 * autoplay.start(carouselAdapter);
 *
 * // Stop autoplay
 * autoplay.stop(carouselAdapter);
 * ```
 */
export const autoplay = {
  //#region Start
  start: (adapter: LfCarouselAdapter) => {
    const { controller } = adapter;
    const { get, set } = controller;
    const { compInstance } = get;
    const { lfAutoPlay, lfInterval } = compInstance;

    const shouldStart = lfAutoPlay && lfInterval > 0;

    if (shouldStart) {
      set.interval(
        setInterval(() => {
          set.index.next();
        }, lfInterval),
      );
    }
  },
  //#endregion

  //#region Stop
  stop: (adapter: LfCarouselAdapter) => {
    const { controller } = adapter;
    const { get, set } = controller;
    const { interval } = get;

    if (interval()) {
      clearInterval(interval());
      set.interval(null);
    }
  },
  //#endregion
};

/**
 * Navigation helper functions for carousel component.
 * @namespace navigation
 */
/**
 * Calculates the index of the next slide in the carousel.
 * @function calcNextIdx
 * @param {number} current - The current slide index
 * @param {number} totalSlides - The total number of slides
 * @returns {number} The index of the next slide (wraps around to 0 when reaching the end)
 */
/**
 * Calculates the index of the previous slide in the carousel.
 * @function calcPreviousIdx
 * @param {number} current - The current slide index
 * @param {number} totalSlides - The total number of slides
 * @returns {number} The index of the previous slide (wraps around to last slide when reaching 0)
 */
export const navigation = {
  //#region Next
  calcNextIdx: (current: number, totalSlides: number) => {
    return (current + 1) % totalSlides;
  },
  //#endregion

  //#region Previous
  calcPreviousIdx: (current: number, totalSlides: number) => {
    return (current - 1 + totalSlides) % totalSlides;
  },
  //#endregion
};
