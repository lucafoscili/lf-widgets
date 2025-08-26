import {
  LfTreeAdapter,
  LfTreeAdapterInitializerGetters,
  LfTreeAdapterInitializerSetters,
  LfTreeAdapterRefs,
} from "@lf-widgets/foundations";
import { createGetters, createSetters } from "./controller.tree";
import { createJsx } from "./elements.tree";
import { createHandlers } from "./handlers.tree";

export type { LfTreeAdapter } from "@lf-widgets/foundations";

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

export const createRefs = (): LfTreeAdapterRefs => ({
  rippleSurfaces: {},
  filterField: null,
});
