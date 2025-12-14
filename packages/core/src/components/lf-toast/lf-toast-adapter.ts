import {
  LfToastAdapter,
  LfToastAdapterControllerActions,
  LfToastAdapterControllerComputed,
  LfToastAdapterControllerGetters,
  LfToastAdapterHandlers,
  LfToastAdapterJsx,
  LfToastAdapterRefs,
} from "@lf-widgets/foundations";
import { prepToastJsx } from "./elements.toast";
import { prepToastHandlers } from "./handlers.toast";

/**
 * Creates the canonical adapter for lf-toast.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (hasCloseIcon, hasIcon, hasTimer)
 * - controller.actions: Complex operations (close)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfToastAdapterControllerGetters,
  computed: LfToastAdapterControllerComputed,
  actions: LfToastAdapterControllerActions,
  getAdapter: () => LfToastAdapter,
): Omit<LfToastAdapter, "dispatcher"> => {
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
  getAdapter: () => LfToastAdapter,
): LfToastAdapterJsx => {
  return prepToastJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfToastAdapter,
): LfToastAdapterHandlers => {
  return prepToastHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_TOAST_IDS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfToastAdapterRefs => {
  return {
    toast: null,
    icon: null,
    closeButton: null,
    message: null,
  };
};
//#endregion
