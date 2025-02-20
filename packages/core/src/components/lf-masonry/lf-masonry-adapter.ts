import {
  LfMasonryAdapter,
  LfMasonryAdapterGetters,
  LfMasonryAdapterHandlers,
  LfMasonryAdapterInitializerGetters,
  LfMasonryAdapterJsx,
  LfMasonryAdapterRefs,
} from "@lf-widgets/foundations";
import { prepControls } from "./elements.controls";
import { controlsHandlers } from "./handlers.controls";

export const createAdapter = (
  getters: LfMasonryAdapterInitializerGetters,
  getAdapter: () => LfMasonryAdapter,
): LfMasonryAdapter => {
  return {
    controller: {
      get: createGetters(getters),
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
  getters: LfMasonryAdapterInitializerGetters,
): LfMasonryAdapterGetters => {
  return getters;
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfMasonryAdapter,
): LfMasonryAdapterJsx => {
  return prepControls(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfMasonryAdapter,
): LfMasonryAdapterHandlers => {
  return controlsHandlers(getAdapter);
};
//#endregion

//#region Refs
export const createRefs = (): LfMasonryAdapterRefs => {
  return {
    addColumn: null,
    removeColumn: null,
    changeView: null,
  };
};
//#endregion
