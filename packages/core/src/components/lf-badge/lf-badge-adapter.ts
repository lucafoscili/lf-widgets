import {
  LfBadgeAdapter,
  LfBadgeAdapterControllerActions,
  LfBadgeAdapterControllerComputed,
  LfBadgeAdapterControllerGetters,
  LfBadgeAdapterControllerSetters,
  LfBadgeAdapterHandlers,
  LfBadgeAdapterJsx,
  LfBadgeAdapterRefs,
} from "@lf-widgets/foundations";
import { prepBadgeActions } from "./actions.badge";
import { prepBadgeComputed } from "./computed.badge";
import { prepBadgeJsx } from "./elements.badge";
import { prepBadgeHandlers } from "./handlers.badge";

/**
 * Creates the canonical adapter for lf-badge.
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
  getters: LfBadgeAdapterControllerGetters,
  setters: LfBadgeAdapterControllerSetters,
  _computed: LfBadgeAdapterControllerComputed,
  _actions: LfBadgeAdapterControllerActions,
  getAdapter: () => LfBadgeAdapter,
): Omit<LfBadgeAdapter, "dispatcher"> => {
  return {
    controller: {
      get: getters,
      set: createSetters(setters, getAdapter),
      computed: createComputed(getAdapter),
      actions: createActions(getAdapter),
    },
    elements: {
      jsx: createJsx(getAdapter),
      refs: createRefs(),
    },
    handlers: createHandlers(),
  };
};
//#endregion

//#region Controller
export const createSetters = (
  setters: LfBadgeAdapterControllerSetters,
  _getAdapter: () => LfBadgeAdapter,
): LfBadgeAdapterControllerSetters => {
  return {
    ...setters,
  };
};

export const createComputed = (
  getAdapter: () => LfBadgeAdapter,
): LfBadgeAdapterControllerComputed => {
  return prepBadgeComputed(getAdapter);
};

export const createActions = (
  getAdapter: () => LfBadgeAdapter,
): LfBadgeAdapterControllerActions => {
  return prepBadgeActions(getAdapter);
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfBadgeAdapter,
): LfBadgeAdapterJsx => {
  return prepBadgeJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (): LfBadgeAdapterHandlers => {
  return prepBadgeHandlers();
};
//#endregion

//#region Refs
export const createRefs = (): LfBadgeAdapterRefs => {
  return {
    badge: null,
  };
};
//#endregion
