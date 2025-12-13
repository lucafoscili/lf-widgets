import {
  LfBreadcrumbsAdapter,
  LfBreadcrumbsAdapterControllerActions,
  LfBreadcrumbsAdapterControllerComputed,
  LfBreadcrumbsAdapterControllerGetters,
  LfBreadcrumbsAdapterControllerSetters,
  LfBreadcrumbsAdapterHandlers,
  LfBreadcrumbsAdapterJsx,
  LfBreadcrumbsAdapterRefs,
} from "@lf-widgets/foundations";
import { prepBreadcrumbsJsx } from "./elements.breadcrumbs";
import { prepBreadcrumbsHandlers } from "./handlers.breadcrumbs";

/**
 * Creates the canonical adapter for lf-breadcrumbs.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + component state
 * - controller.set: Simple setters (currentNode, expanded)
 * - controller.computed: Derived predicates (isInteractive, isExpanded, isEmpty)
 * - controller.actions: Complex operations (toggleExpand, setCurrentNode)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfBreadcrumbsAdapterControllerGetters,
  setters: LfBreadcrumbsAdapterControllerSetters,
  computed: LfBreadcrumbsAdapterControllerComputed,
  actions: LfBreadcrumbsAdapterControllerActions,
  getAdapter: () => LfBreadcrumbsAdapter,
): Omit<LfBreadcrumbsAdapter, "dispatcher"> => {
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
  setters: LfBreadcrumbsAdapterControllerSetters,
  _getAdapter: () => LfBreadcrumbsAdapter,
): LfBreadcrumbsAdapterControllerSetters => {
  return {
    ...setters,
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfBreadcrumbsAdapter,
): LfBreadcrumbsAdapterJsx => {
  return prepBreadcrumbsJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfBreadcrumbsAdapter,
): LfBreadcrumbsAdapterHandlers => {
  return prepBreadcrumbsHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_BREADCRUMBS_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfBreadcrumbsAdapterRefs => {
  return {
    items: new Map(),
  };
};
//#endregion
