import {
  LfCarouselAdapter,
  LfCarouselAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Calculates the index of the next slide in the carousel.
 * @param current - The current slide index
 * @param totalSlides - The total number of slides
 * @returns The index of the next slide (wraps around to 0 when reaching the end)
 */
const calcNextIndex = (current: number, totalSlides: number): number => {
  return (current + 1) % totalSlides;
};

/**
 * Calculates the index of the previous slide in the carousel.
 * @param current - The current slide index
 * @param totalSlides - The total number of slides
 * @returns The index of the previous slide (wraps around to last slide when reaching 0)
 */
const calcPrevIndex = (current: number, totalSlides: number): number => {
  return (current - 1 + totalSlides) % totalSlides;
};

/**
 * Creates action methods for the carousel adapter.
 * Multi-step operations that may have side effects.
 *
 * @param getAdapter - Function to get the current adapter instance
 * @returns Actions controller surface
 */
export const createActions = (
  getAdapter: () => LfCarouselAdapter,
): LfCarouselAdapterControllerActions => {
  return {
    navigation: {
      next: () => {
        const adapter = getAdapter();
        const { get, set } = adapter.controller;
        const current = get.currentIndex();
        const total = get.totalSlides();

        if (total > 0) {
          const nextIndex = calcNextIndex(current, total);
          set.currentIndex(nextIndex);
        }
      },
      prev: () => {
        const adapter = getAdapter();
        const { get, set } = adapter.controller;
        const current = get.currentIndex();
        const total = get.totalSlides();

        if (total > 0) {
          const prevIndex = calcPrevIndex(current, total);
          set.currentIndex(prevIndex);
        }
      },
      goTo: (index: number) => {
        const adapter = getAdapter();
        const { get, set } = adapter.controller;
        const total = get.totalSlides();

        if (total > 0 && index >= 0 && index < total) {
          set.currentIndex(index);
        }
      },
    },
    autoplay: {
      start: () => {
        const adapter = getAdapter();
        const { get, set, actions } = adapter.controller;
        const instance = get.compInstance();
        const { lfAutoPlay, lfInterval } = instance;

        const shouldStart = lfAutoPlay && lfInterval > 0;

        if (shouldStart) {
          set.interval(
            setInterval(() => {
              actions.navigation.next();
            }, lfInterval),
          );
        }
      },
      stop: () => {
        const adapter = getAdapter();
        const { get, set } = adapter.controller;
        const currentInterval = get.interval();

        if (currentInterval) {
          clearInterval(currentInterval);
          set.interval(null);
        }
      },
    },
  };
};
