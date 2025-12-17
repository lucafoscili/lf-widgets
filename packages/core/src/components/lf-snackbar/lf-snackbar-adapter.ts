import {
  LfSnackbarAdapter,
  LfSnackbarAdapterControllerActions,
  LfSnackbarAdapterControllerComputed,
  LfSnackbarAdapterControllerGetters,
  LfSnackbarAdapterHandlers,
  LfSnackbarAdapterJsx,
  LfSnackbarAdapterRefs,
} from "@lf-widgets/foundations";
import { prepSnackbarJsx } from "./elements.snackbar";
import { prepSnackbarHandlers } from "./handlers.snackbar";

/**
 * Creates the canonical adapter for lf-snackbar.
 *
 * "Adapter as Core" Architecture:
 * - Adapter OWNS the runtime state (not the WC)
 * - State is stored in closure variables
 * - `controller.get.*` reads from closure state
 * - `onStateChange` signals WC to increment its single `@State _renderTick`
 * - WC becomes a thin shell: lifecycle + HTML attribute interface + single render trigger
 *
 * Benefits:
 * - Predictable renders (explicit via onStateChange)
 * - Testable (adapter can be tested without DOM)
 * - Portable (adapter works with any renderer)
 * - Batch-friendly (actions can make multiple changes before calling onStateChange once)
 *
 * @param getters - Base getters from createBaseGetters utility
 * @param computed - Computed predicates
 * @param actions - Action functions
 * @param onStateChange - Callback to trigger WC re-render (increments _renderTick)
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Complete adapter (without dispatcher - added by WC)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfSnackbarAdapterControllerGetters,
  computed: LfSnackbarAdapterControllerComputed,
  actions: LfSnackbarAdapterControllerActions,
  _onStateChange: () => void,
  getAdapter: () => LfSnackbarAdapter,
): Omit<LfSnackbarAdapter, "dispatcher"> => {
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
  getAdapter: () => LfSnackbarAdapter,
): LfSnackbarAdapterJsx => {
  return prepSnackbarJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfSnackbarAdapter,
): LfSnackbarAdapterHandlers => {
  return prepSnackbarHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_SNACKBAR_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfSnackbarAdapterRefs => {
  return {
    actionButton: null,
    closeButton: null,
    content: null,
    icon: null,
    message: null,
    snackbar: null,
  };
};
//#endregion
