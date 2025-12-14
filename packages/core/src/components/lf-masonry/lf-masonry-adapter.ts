import {
  LfMasonryAdapter,
  LfMasonryAdapterControllerActions,
  LfMasonryAdapterControllerComputed,
  LfMasonryAdapterControllerGetters,
  LfMasonryAdapterControllerSetters,
  LfMasonryAdapterHandlers,
  LfMasonryAdapterJsx,
  LfMasonryAdapterRefs,
} from "@lf-widgets/foundations";
import { prepControls } from "./elements.controls";
import { controlsHandlers } from "./handlers.controls";

/**
 * Creates the canonical adapter for lf-masonry.
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
  getters: LfMasonryAdapterControllerGetters,
  setters: LfMasonryAdapterControllerSetters,
  computed: LfMasonryAdapterControllerComputed,
  actions: LfMasonryAdapterControllerActions,
  getAdapter: () => LfMasonryAdapter,
): Omit<LfMasonryAdapter, "dispatcher"> => {
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
  getAdapter: () => LfMasonryAdapter,
): LfMasonryAdapterJsx => {
  return prepControls(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfMasonryAdapter,
): LfMasonryAdapterHandlers => {
  return controlsHandlers(getAdapter);
};
//#endregion

//#region Refs
export const createRefs = (): LfMasonryAdapterRefs => {
  return {
    addColumn: null,
    removeColumn: null,
    changeView: null,
    shapes: new Map<string, HTMLElement>(),
  };
};
//#endregion
