import {
  LfPlaceholderAdapter,
  LfPlaceholderAdapterControllerActions,
  LfPlaceholderAdapterControllerComputed,
  LfPlaceholderAdapterControllerGetters,
  LfPlaceholderAdapterHandlers,
  LfPlaceholderAdapterJsx,
  LfPlaceholderAdapterRefs,
} from "@lf-widgets/foundations";
import { prepPlaceholderJsx } from "./elements.placeholder";
import { prepPlaceholderHandlers } from "./handlers.placeholder";

/**
 * Creates the canonical adapter for lf-placeholder.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (shouldRender)
 * - controller.actions: Complex operations (triggerLoad)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfPlaceholderAdapterControllerGetters,
  computed: LfPlaceholderAdapterControllerComputed,
  actions: LfPlaceholderAdapterControllerActions,
  getAdapter: () => LfPlaceholderAdapter,
): Omit<LfPlaceholderAdapter, "dispatcher"> => {
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
  getAdapter: () => LfPlaceholderAdapter,
): LfPlaceholderAdapterJsx => {
  return prepPlaceholderJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfPlaceholderAdapter,
): LfPlaceholderAdapterHandlers => {
  return prepPlaceholderHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_PLACEHOLDER_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfPlaceholderAdapterRefs => {
  return {
    placeholder: null,
    wrapper: null,
    component: null,
  };
};
//#endregion
