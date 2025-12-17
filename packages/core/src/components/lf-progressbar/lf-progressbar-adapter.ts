import {
  LfProgressbarAdapter,
  LfProgressbarAdapterControllerGetters,
  LfProgressbarAdapterControllerSetters,
  LfProgressbarAdapterHandlers,
  LfProgressbarAdapterJsx,
  LfProgressbarAdapterRefs,
} from "@lf-widgets/foundations";
import { prepProgressbarJsx } from "./elements.progressbar";

/**
 * Creates the canonical adapter for lf-progressbar.
 *
 * "Adapter as Core" Architecture:
 * - Adapter OWNS the runtime state (not the WC)
 * - State is stored in closure variables (if any needed)
 * - `controller.get.*` reads from closure state or base getters
 * - `controller.set.*` writes to closure state AND calls `onStateChange()`
 * - `onStateChange` signals WC to increment its single `@State _renderTick`
 * - WC becomes a thin shell: lifecycle + HTML attribute interface + single render trigger
 *
 * Note: progressbar is a display-only component, so there's no internal state.
 * The onStateChange callback is provided for pattern consistency.
 *
 * Benefits:
 * - Predictable renders (explicit via onStateChange)
 * - Testable (adapter can be tested without DOM)
 * - Portable (adapter works with any renderer)
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
  baseGetters: LfProgressbarAdapterControllerGetters,
  _onStateChange: () => void,
  getAdapter: () => LfProgressbarAdapter,
): Omit<LfProgressbarAdapter, "dispatcher"> => {
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL STATE (none for display component)
  // For display components, all state comes from WC props
  // ═══════════════════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE GETTERS - Read from base getters (no additional state)
  // ═══════════════════════════════════════════════════════════════════════════
  const getters: LfProgressbarAdapterControllerGetters = {
    ...baseGetters,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE SETTERS - Empty for display component
  // ═══════════════════════════════════════════════════════════════════════════
  const setters: LfProgressbarAdapterControllerSetters = {};

  return {
    controller: {
      get: getters,
      set: setters,
      computed: createComputed(),
      actions: createActions(),
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
export const createComputed = () => ({});

export const createActions = () => ({});
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfProgressbarAdapter,
): LfProgressbarAdapterJsx => {
  return prepProgressbarJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (): LfProgressbarAdapterHandlers => {
  return {};
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_PROGRESSBAR_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfProgressbarAdapterRefs => {
  return {
    progressbar: null,
  };
};
//#endregion
