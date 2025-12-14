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
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (hasAction, hasCloseIcon, hasIcon)
 * - controller.actions: Complex operations (close)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfSnackbarAdapterControllerGetters,
  computed: LfSnackbarAdapterControllerComputed,
  actions: LfSnackbarAdapterControllerActions,
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
