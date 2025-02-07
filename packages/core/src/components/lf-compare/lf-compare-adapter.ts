import {
  LF_COMPARE_DEFAULTS,
  LfCompareAdapter,
  LfCompareAdapterControllerGetters,
  LfCompareAdapterControllerSetters,
  LfCompareAdapterHandlers,
  LfCompareAdapterInitializerGetters,
  LfCompareAdapterInitializerSetters,
  LfCompareAdapterJsx,
  LfCompareAdapterRefs,
} from "@lf-widgets/foundations";
import { prepToolbarJsx } from "./elements.toolbar";
import { prepToolbarHandlers } from "./handlers.toolbar";

export const createAdapter = (
  getters: LfCompareAdapterInitializerGetters,
  setters: LfCompareAdapterInitializerSetters,
  getAdapter: () => LfCompareAdapter,
): LfCompareAdapter => {
  return {
    controller: {
      get: createGetters(getters),
      set: createSetters(setters),
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
  getters: LfCompareAdapterInitializerGetters,
): LfCompareAdapterControllerGetters => {
  return { ...getters, defaults: LF_COMPARE_DEFAULTS() };
};
export const createSetters = (
  setters: LfCompareAdapterInitializerSetters,
): LfCompareAdapterControllerSetters => {
  return setters;
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfCompareAdapter,
): LfCompareAdapterJsx => {
  return prepToolbarJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfCompareAdapter,
): LfCompareAdapterHandlers => {
  return prepToolbarHandlers(getAdapter);
};
//#endregion

//#region Refs
export const createRefs = (): LfCompareAdapterRefs => {
  return {
    changeView: null,
    leftButton: null,
    leftTree: null,
    rightButton: null,
    rightTree: null,
    slider: null,
  };
};
//#endregion
