import {
  LfCompareAdapter,
  LfCompareAdapterControllerActions,
  LfCompareAdapterControllerComputed,
  LfCompareAdapterControllerGetters,
  LfCompareAdapterControllerSetters,
  LfCompareAdapterHandlers,
  LfCompareAdapterJsx,
  LfCompareAdapterRefs,
} from "@lf-widgets/foundations";
import { prepToolbarJsx } from "./elements.toolbar";
import { prepToolbarHandlers } from "./handlers.toolbar";

/**
 * Creates the canonical adapter for lf-compare.
 *
 * v4.0.0 Architecture:
 * - controller.get: Pure state reads (ALL must be functions `() => T`)
 * - controller.set: Simple single-value assignments
 * - controller.computed: Derived values, predicates (pure functions)
 * - controller.actions: Multi-step operations (toggles, batch changes)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfCompareAdapterControllerGetters,
  setters: LfCompareAdapterControllerSetters,
  computed: LfCompareAdapterControllerComputed,
  actions: LfCompareAdapterControllerActions,
  getAdapter: () => LfCompareAdapter,
): Omit<LfCompareAdapter, "dispatcher"> => {
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
  getAdapter: () => LfCompareAdapter,
): LfCompareAdapterJsx => {
  return prepToolbarJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfCompareAdapter,
): LfCompareAdapterHandlers => {
  return prepToolbarHandlers(getAdapter);
};
//#endregion

//#region Refs
export const createRefs = (): LfCompareAdapterRefs => {
  return {
    changeView: null,
    leftButton: null,
    leftTree: null,
    rightButton: null,
    rightTree: null,
    slider: null,
  };
};
//#endregion
