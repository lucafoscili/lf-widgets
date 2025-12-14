import {
  LfCarouselAdapter,
  LfCarouselAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Creates computed values for the carousel adapter.
 * Pure functions that derive values from current state.
 *
 * @param getAdapter - Function to get the current adapter instance
 * @returns Computed controller surface
 */
export const createComputed = (
  getAdapter: () => LfCarouselAdapter,
): LfCarouselAdapterControllerComputed => {
  return {
    hasNext: () => {
      const { get } = getAdapter().controller;
      return get.totalSlides() > 0;
    },
    hasPrev: () => {
      const { get } = getAdapter().controller;
      return get.totalSlides() > 0;
    },
    hasSlides: () => {
      const { get } = getAdapter().controller;
      return get.totalSlides() > 0;
    },
  };
};
