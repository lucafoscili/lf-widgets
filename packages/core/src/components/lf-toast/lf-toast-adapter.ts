import {
  LfToastAdapter,
  LfToastAdapterControllerActions,
  LfToastAdapterControllerComputed,
  LfToastAdapterControllerGetters,
  LfToastAdapterHandlers,
  LfToastAdapterJsx,
  LfToastAdapterRefs,
} from "@lf-widgets/foundations";
import { prepToastActions } from "./actions.toast";
import { prepToastComputed } from "./computed.toast";
import { prepToastJsx } from "./elements.toast";
import { prepToastHandlers } from "./handlers.toast";

/**
 * Creates the canonical adapter for lf-toast.
 *
 * "Adapter as Core" Architecture:
 * - Adapter OWNS the runtime state (not the WC)
 * - State is stored in closure variables (if needed)
 * - `controller.get.*` reads from closure state or base getters
 * - `controller.set.*` writes to closure state AND calls `onStateChange()`
 * - `onStateChange` signals WC to increment its single `@State _renderTick`
 * - WC becomes a thin shell: lifecycle + HTML attribute interface + single render trigger
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
//#region Adapter
export const createAdapter = (
  getters: LfToastAdapterControllerGetters,
  _onStateChange: () => void,
  getAdapter: () => LfToastAdapter,
): Omit<LfToastAdapter, "dispatcher"> => {
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL STATE (replaces @State in WC)
  // Toast currently doesn't need internal state beyond props, but the pattern
  // is set up for future extensions. Add closure variables here if needed.
  // ═══════════════════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPUTED - Derived predicates (from dedicated file)
  // ═══════════════════════════════════════════════════════════════════════════
  const computed = createComputed(getAdapter);

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTIONS - Complex multi-step operations (from dedicated file)
  // ═══════════════════════════════════════════════════════════════════════════
  const actions = createActions(getAdapter);

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

//#region Controller
export const createComputed = (
  getAdapter: () => LfToastAdapter,
): LfToastAdapterControllerComputed => {
  return prepToastComputed(getAdapter);
};

export const createActions = (
  getAdapter: () => LfToastAdapter,
): LfToastAdapterControllerActions => {
  return prepToastActions(getAdapter);
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfToastAdapter,
): LfToastAdapterJsx => {
  return prepToastJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfToastAdapter,
): LfToastAdapterHandlers => {
  return prepToastHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_TOAST_IDS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfToastAdapterRefs => {
  return {
    toast: null,
    icon: null,
    closeButton: null,
    message: null,
  };
};
//#endregion
