import {
  LfListAdapter,
  LfListAdapterControllerActions,
  LfListAdapterControllerComputed,
  LfListAdapterControllerGetters,
  LfListAdapterControllerSetters,
  LfListAdapterHandlers,
  LfListAdapterJsx,
  LfListAdapterRefs,
} from "@lf-widgets/foundations";
import { prepList } from "./elements.list";
import { prepListHandlers } from "./handlers.list";

/**
 * Creates the canonical adapter for lf-list.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + component state
 * - controller.set: Simple setters (filter, selected, focused)
 * - controller.computed: Derived predicates (isDisabled, isEmpty, isFilteredEmpty)
 * - controller.actions: Complex operations (applyFilter, deleteNode, focusElement, selectNode)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfListAdapterControllerGetters,
  setters: LfListAdapterControllerSetters,
  computed: LfListAdapterControllerComputed,
  actions: LfListAdapterControllerActions,
  getAdapter: () => LfListAdapter,
): Omit<LfListAdapter, "dispatcher"> => {
  return {
    controller: {
      get: getters,
      set: setters,
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
  getAdapter: () => LfListAdapter,
): LfListAdapterJsx => {
  return prepList(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfListAdapter,
): LfListAdapterHandlers => {
  return prepListHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_LIST_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfListAdapterRefs => {
  return {
    deleteIcon: null,
    filter: null,
    icon: null,
    node: null,
    subtitle: null,
    title: null,
  };
};
//#endregion
