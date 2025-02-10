import {
  LfCarouselAdapter,
  LfCarouselAdapterControllerGetters,
  LfCarouselAdapterControllerSetters,
  LfCarouselAdapterHandlers,
  LfCarouselAdapterInitializerGetters,
  LfCarouselAdapterInitializerSetters,
  LfCarouselAdapterJsx,
  LfCarouselAdapterRefs,
} from "@lf-widgets/foundations";
import { prepSideButtonsJsx } from "./elements.side-buttons";
import { prepSideButtonHandlers } from "./handlers.side-buttons";
import { autoplay } from "./helpers.utils";

export const createAdapter = (
  getters: LfCarouselAdapterInitializerGetters,
  setters: LfCarouselAdapterInitializerSetters,
  getAdapter: () => LfCarouselAdapter,
): LfCarouselAdapter => {
  return {
    controller: {
      get: createGetters(getters),
      set: createSetters(setters, getAdapter),
    },
    elements: {
      jsx: createJsx(getAdapter),
      refs: createRefs(),
    },
    handlers: createHandlers(getAdapter),
  };
};

//#region Controller
export const createGetters = (
  getters: LfCarouselAdapterInitializerGetters,
): LfCarouselAdapterControllerGetters => {
  return getters;
};
export const createSetters = (
  setters: LfCarouselAdapterInitializerSetters,
  getAdapter: () => LfCarouselAdapter,
): LfCarouselAdapterControllerSetters => {
  const { start, stop } = autoplay;

  return {
    ...setters,
    autoplay: {
      start: () => start(getAdapter()),
      stop: () => stop(getAdapter()),
    },
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfCarouselAdapter,
): LfCarouselAdapterJsx => {
  return prepSideButtonsJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfCarouselAdapter,
): LfCarouselAdapterHandlers => {
  return prepSideButtonHandlers(getAdapter);
};
//#endregion

//#region Refs
export const createRefs = (): LfCarouselAdapterRefs => {
  return { back: null, forward: null };
};
//#endregion
