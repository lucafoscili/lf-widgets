import {
  LfTreeAdapter,
  LfTreeAdapterControllerActions,
  LfTreeAdapterControllerComputed,
  LfTreeAdapterControllerGetters,
  LfTreeAdapterControllerSetters,
  LfTreeAdapterHandlers,
  LfTreeAdapterJsx,
  LfTreeAdapterRefs,
} from "@lf-widgets/foundations";
import { createJsx } from "./elements.tree";
import { createHandlers } from "./handlers.tree";

/**
 * Creates the canonical adapter for lf-tree.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + tree state
 * - controller.set: Simple setters (filter, expansion, selection)
 * - controller.computed: Derived predicates (isExpanded, isSelected, isHidden, isGrid, etc.)
 * - controller.actions: Complex operations (toggleExpansion, setSelection, clearSelection)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfTreeAdapterControllerGetters,
  setters: LfTreeAdapterControllerSetters,
  computed: LfTreeAdapterControllerComputed,
  actions: LfTreeAdapterControllerActions,
  getAdapter: () => LfTreeAdapter,
): Omit<LfTreeAdapter, "dispatcher"> => {
  return {
    controller: {
      get: getters,
      set: createSetters(setters, getAdapter),
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

//#region Controller
export const createSetters = (
  setters: LfTreeAdapterControllerSetters,
  _getAdapter: () => LfTreeAdapter,
): LfTreeAdapterControllerSetters => {
  return {
    ...setters,
  };
};
//#endregion

//#region Elements
export const createJsxFactory = (
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapterJsx => {
  return createJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlersFactory = (
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapterHandlers => {
  return createHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_TREE_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfTreeAdapterRefs => {
  return {
    nodeElements: {},
    filterField: null,
  };
};
//#endregion
