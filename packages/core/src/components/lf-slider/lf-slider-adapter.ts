import {
  LfSliderAdapter,
  LfSliderAdapterControllerActions,
  LfSliderAdapterControllerComputed,
  LfSliderAdapterControllerGetters,
  LfSliderAdapterJsx,
  LfSliderAdapterRefs,
} from "@lf-widgets/foundations";
import { prepSliderJsx } from "./elements.slider";
import { prepSliderHandlers } from "./handlers.slider";

/**
 * Creates the canonical adapter for lf-slider.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (isDisabled, valuePercentage, normalizeValue)
 * - controller.actions: Complex operations (setValue, setDisplayValue)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfSliderAdapterControllerGetters,
  computed: LfSliderAdapterControllerComputed,
  actions: LfSliderAdapterControllerActions,
  getAdapter: () => LfSliderAdapter,
): Omit<LfSliderAdapter, "dispatcher"> => {
  return {
    controller: {
      get: getters,
      computed,
      actions,
    },
    elements: {
      jsx: createJsx(getAdapter),
      refs: createRefs(),
    },
    handlers: createHandlers(getAdapter),
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfSliderAdapter,
): LfSliderAdapterJsx => {
  return prepSliderJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (getAdapter: () => LfSliderAdapter) => {
  return prepSliderHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_SLIDER_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfSliderAdapterRefs => {
  return {
    input: null,
    thumb: null,
    track: null,
  };
};
//#endregion
