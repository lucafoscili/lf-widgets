import {
  LfBadgeAdapter,
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
 * "Adapter as Core" Architecture:
 * - Adapter OWNS any runtime state (not the WC)
 * - State would be stored in closure variables (badge is stateless)
 * - `controller.get.*` reads from closure state (or base getters)
 * - `controller.set.*` writes to closure state AND calls `onStateChange()`
 * - `onStateChange` signals WC to increment its single `@State _renderTick`
 * - WC becomes a thin shell: lifecycle + HTML attribute interface + single render trigger
 *
 * Note: Badge is a stateless (display-only) component, so there are no closure
 * variables. The pattern is still applied for consistency and future-proofing.
 *
 * Benefits:
 * - Predictable renders (explicit via onStateChange)
 * - Testable (adapter can be tested without DOM)
 * - Portable (adapter works with any renderer)
 * - Batch-friendly (actions can make multiple changes before calling onStateChange once)
 *
 * @param baseGetters - Base getters from createBaseGetters utility
 * @param onStateChange - Callback to trigger WC re-render (increments _renderTick)
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Complete adapter (without dispatcher - added by WC)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter Factory
export const createAdapter = (
  baseGetters: LfBadgeAdapterControllerGetters,
  onStateChange: () => void,
  getAdapter: () => LfBadgeAdapter,
): Omit<LfBadgeAdapter, "dispatcher"> => {
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL STATE (would replace @State in WC if badge had runtime state)
  // Badge is stateless - no closure variables needed
  // ═══════════════════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE GETTERS - Read from closure (or base getters for stateless components)
  // ═══════════════════════════════════════════════════════════════════════════
  const getters: LfBadgeAdapterControllerGetters = {
    ...baseGetters,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE SETTERS - Write to closure + trigger render
  // Badge is stateless, but we keep the structure for pattern consistency
  // ═══════════════════════════════════════════════════════════════════════════
  const setters: LfBadgeAdapterControllerSetters = {
    // Example for future state (currently empty):
    // someState: (val) => {
    //   _someState = val;
    //   onStateChange();
    // },
  };

  // Suppress unused variable warning - kept for pattern consistency
  void onStateChange;

  return {
    controller: {
      get: getters,
      set: setters,
      computed: createComputed(getAdapter),
      actions: createActions(getAdapter),
    },
    elements: {
      jsx: createJsx(),
      refs: createRefs(),
    },
    handlers: createHandlers(),
  };
};
//#endregion

//#region Controller
export const createComputed = (getAdapter: () => LfBadgeAdapter) => {
  return prepBadgeComputed(getAdapter);
};

export const createActions = (getAdapter: () => LfBadgeAdapter) => {
  return prepBadgeActions(getAdapter);
};
//#endregion

//#region Elements
export const createJsx = (): LfBadgeAdapterJsx => {
  return prepBadgeJsx();
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
