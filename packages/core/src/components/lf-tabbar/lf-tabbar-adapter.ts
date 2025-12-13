import {
  LfTabbarAdapter,
  LfTabbarAdapterControllerActions,
  LfTabbarAdapterControllerComputed,
  LfTabbarAdapterControllerGetters,
  LfTabbarAdapterHandlers,
  LfTabbarAdapterJsx,
  LfTabbarAdapterRefs,
} from "@lf-widgets/foundations";
import { prepTabbarElements } from "./elements.tabbar";
import { prepTabbarHandlers } from "./handlers.tabbar";

/**
 * Creates the canonical adapter for lf-tabbar.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (isSelected, hasNodes)
 * - controller.actions: Complex operations (select, scroll)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfTabbarAdapterControllerGetters,
  computed: LfTabbarAdapterControllerComputed,
  actions: LfTabbarAdapterControllerActions,
  getAdapter: () => LfTabbarAdapter,
): Omit<LfTabbarAdapter, "dispatcher"> => {
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
  getAdapter: () => LfTabbarAdapter,
): LfTabbarAdapterJsx => {
  return prepTabbarElements(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfTabbarAdapter,
): LfTabbarAdapterHandlers => {
  return prepTabbarHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_TABBAR_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfTabbarAdapterRefs => {
  return {
    scrollContainer: null,
    tabs: new Map(),
  };
};
//#endregion
