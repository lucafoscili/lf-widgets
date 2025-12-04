import {
  LfTreeAdapter,
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
    get: getters,
    set: setters,
  },
  elements: { jsx: createJsx(getAdapter), refs: createRefs() },
  handlers: createHandlers(getAdapter),
});
//#endregion

//#region Refs
export const createRefs = (): LfTreeAdapterRefs => ({
  nodeElements: {},
  filterField: null,
});
//#endregion
