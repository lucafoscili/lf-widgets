import {
  LfSpinnerAdapter,
  LfSpinnerAdapterControllerActions,
  LfSpinnerAdapterControllerComputed,
  LfSpinnerAdapterControllerGetters,
  LfSpinnerAdapterHandlers,
  LfSpinnerAdapterJsx,
} from "@lf-widgets/foundations";
import { createRefs, prepSpinnerJsx } from "./elements.spinner";

/**
 * Creates the canonical adapter for lf-spinner.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (isBarVariant, showFader, getConfig, etc.)
 * - controller.actions: Complex operations (startProgressBar, scheduleFader, etc.)
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
  // Spinner component has no event handlers
  return {};
};
//#endregion
