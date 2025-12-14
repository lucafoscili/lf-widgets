import {
  LfDrawerAdapter,
  LfDrawerAdapterControllerActions,
  LfDrawerAdapterControllerComputed,
  LfDrawerAdapterControllerGetters,
  LfDrawerAdapterHandlers,
  LfDrawerAdapterJsx,
  LfDrawerAdapterRefs,
} from "@lf-widgets/foundations";
import { prepDrawerJsx } from "./elements.drawer";
import { prepDrawerHandlers } from "./handlers.drawer";

/**
 * Creates the canonical adapter for lf-drawer.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + component state
 * - controller.computed: Derived predicates (isOpen, isResponsive, isSlide, isDock, isModal)
 * - controller.actions: Complex operations (open, close, toggle, trapFocus, focusFirstElement)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks (keyboard, backdropClick)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfDrawerAdapterControllerGetters,
  computed: LfDrawerAdapterControllerComputed,
  actions: LfDrawerAdapterControllerActions,
  getAdapter: () => LfDrawerAdapter,
): Omit<LfDrawerAdapter, "dispatcher"> => {
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
  getAdapter: () => LfDrawerAdapter,
): LfDrawerAdapterJsx => {
  return prepDrawerJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfDrawerAdapter,
): LfDrawerAdapterHandlers => {
  return prepDrawerHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_DRAWER_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfDrawerAdapterRefs => {
  return {
    drawer: null,
    content: null,
  };
};
//#endregion
