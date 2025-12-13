import {
  LF_CARD_DEFAULTS,
  LfCardAdapter,
  LfCardAdapterControllerActions,
  LfCardAdapterControllerComputed,
  LfCardAdapterControllerGetters,
  LfCardAdapterControllerSetters,
  LfCardAdapterHandlers,
  LfCardAdapterJsx,
  LfCardAdapterRefs,
} from "@lf-widgets/foundations";
import { prepDebug } from "./elements.debug";
import { prepKeywords } from "./elements.keywords";
import { prepMaterial } from "./elements.material";
import { prepUpload } from "./elements.upload";
import { prepWeather } from "./elements.weather";
import { prepDebugHandlers } from "./handlers.debug";
import { prepKeywordsHandlers } from "./handlers.keywords";

/**
 * Creates the canonical adapter for lf-card.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + defaults, shapes
 * - controller.set: Simple setters (currently none)
 * - controller.computed: Derived predicates (hasDataset, hasSlotChildren, shouldRender)
 * - controller.actions: Complex operations (updateShapes, registerRipple, unregisterRipple)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfCardAdapterControllerGetters,
  setters: LfCardAdapterControllerSetters,
  computed: LfCardAdapterControllerComputed,
  actions: LfCardAdapterControllerActions,
  getAdapter: () => LfCardAdapter,
): Omit<LfCardAdapter, "dispatcher"> => {
  return {
    controller: {
      get: createGetters(getters, getAdapter),
      set: setters,
      computed,
      actions,
    },
    elements: {
      jsx: { layouts: createJsx(getAdapter) },
      refs: createRefs(),
    },
    handlers: { layouts: createHandlers(getAdapter) },
  };
};
//#endregion

//#region Controller
export const createGetters = (
  getters: LfCardAdapterControllerGetters,
  getAdapter: () => LfCardAdapter,
): LfCardAdapterControllerGetters => {
  return {
    ...getters,
    defaults: () => LF_CARD_DEFAULTS(getAdapter),
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfCardAdapter,
): LfCardAdapterJsx["layouts"] => {
  return {
    debug: () => prepDebug(getAdapter),
    keywords: () => prepKeywords(getAdapter),
    material: () => prepMaterial(getAdapter),
    upload: () => prepUpload(getAdapter),
    weather: () => prepWeather(getAdapter),
  };
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfCardAdapter,
): LfCardAdapterHandlers["layouts"] => {
  return {
    debug: prepDebugHandlers(getAdapter),
    keywords: prepKeywordsHandlers(getAdapter),
  };
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_CARD_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfCardAdapterRefs => {
  return {
    layouts: {
      debug: { button: null, code: null, toggle: null },
      keywords: { button: null, chip: null },
      material: null,
    },
  };
};
//#endregion
