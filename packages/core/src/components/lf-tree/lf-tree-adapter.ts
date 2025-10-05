import {
  LfTreeAdapter,
  LfTreeAdapterControllerGetters,
  LfTreeAdapterControllerSetters,
  LfTreeAdapterInitializerGetters,
  LfTreeAdapterInitializerSetters,
  LfTreeAdapterRefs,
} from "@lf-widgets/foundations";
import { createJsx } from "./elements.tree";
import { createHandlers } from "./handlers.tree";

//#region Adapter
export const createAdapter = (
  getters: LfTreeAdapterInitializerGetters,
  setters: LfTreeAdapterInitializerSetters,
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapter => ({
  controller: {
    get: createGetters(getters),
    set: createSetters(setters),
  },
  elements: { jsx: createJsx(getAdapter), refs: createRefs() },
  handlers: createHandlers(getAdapter),
});
//#endregion

//#region Controller
export const createGetters = (
  getters: LfTreeAdapterInitializerGetters,
): LfTreeAdapterControllerGetters => {
  return getters;
};
export const createSetters = (
  setters: LfTreeAdapterInitializerSetters,
): LfTreeAdapterControllerSetters => {
  return setters;
};
//#endregion

//#region Refs
export const createRefs = (): LfTreeAdapterRefs => ({
  rippleSurfaces: {},
  filterField: null,
});
//#endregion
