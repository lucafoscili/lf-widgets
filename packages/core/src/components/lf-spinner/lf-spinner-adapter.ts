import {
  LfSpinnerAdapter,
  LfSpinnerAdapterControllerActions,
  LfSpinnerAdapterControllerComputed,
  LfSpinnerAdapterControllerGetters,
  LfSpinnerAdapterHandlers,
  LfSpinnerAdapterJsx,
  LfSpinnerAdapterRefs,
} from "@lf-widgets/foundations";
import { prepSpinnerJsx } from "./elements.spinner";

/**
 * Creates the canonical adapter for lf-spinner.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (isBarVariant, showFader)
 * - controller.actions: Complex operations (startProgressBar, cancelProgressBar, scheduleFader, clearFaderTimer)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks (empty for spinner)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfSpinnerAdapterControllerGetters,
  computed: LfSpinnerAdapterControllerComputed,
  actions: LfSpinnerAdapterControllerActions,
  getAdapter: () => LfSpinnerAdapter,
): Omit<LfSpinnerAdapter, "dispatcher"> => {
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
    handlers: createHandlers(),
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfSpinnerAdapter,
): LfSpinnerAdapterJsx => {
  return prepSpinnerJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (): LfSpinnerAdapterHandlers => {
  return {};
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_SPINNER_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfSpinnerAdapterRefs => {
  return {
    spinner: null,
    content: null,
    fader: null,
    bar: null,
  };
};
//#endregion
