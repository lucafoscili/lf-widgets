import {
  LfCarouselAdapter,
  LfCarouselAdapterControllerActions,
  LfCarouselAdapterControllerComputed,
  LfCarouselAdapterControllerGetters,
  LfCarouselAdapterControllerSetters,
  LfCarouselAdapterHandlers,
  LfCarouselAdapterJsx,
  LfCarouselAdapterRefs,
} from "@lf-widgets/foundations";
import { createActions } from "./actions.carousel";
import { createComputed } from "./computed.carousel";
import { prepSideButtonsJsx } from "./elements.side-buttons";
import { prepSideButtonHandlers } from "./handlers.side-buttons";

/**
 * Creates the canonical adapter for lf-carousel.
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
  getters: LfCarouselAdapterControllerGetters,
  setters: LfCarouselAdapterControllerSetters,
  computed: LfCarouselAdapterControllerComputed,
  actions: LfCarouselAdapterControllerActions,
  getAdapter: () => LfCarouselAdapter,
): Omit<LfCarouselAdapter, "dispatcher"> => {
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
  getAdapter: () => LfCarouselAdapter,
): LfCarouselAdapterJsx => {
  return prepSideButtonsJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfCarouselAdapter,
): LfCarouselAdapterHandlers => {
  return prepSideButtonHandlers(getAdapter);
};
//#endregion

//#region Refs
export const createRefs = (): LfCarouselAdapterRefs => {
  return { back: null, forward: null };
};
//#endregion

//#region Re-exports for convenience
export { createActions, createComputed };
//#endregion
