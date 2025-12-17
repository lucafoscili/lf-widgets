import {
  LfHeaderAdapter,
  LfHeaderAdapterControllerGetters,
  LfHeaderAdapterJsx,
  LfHeaderAdapterRefs,
} from "@lf-widgets/foundations";
import { prepHeaderJsx } from "./elements.header";

/**
 * Creates the canonical adapter for lf-header.
 *
 * "Adapter as Core" Architecture:
 * - Adapter OWNS the runtime state (not the WC)
 * - State is stored in closure variables (none for display-only header)
 * - `controller.get.*` reads from closure state
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
 * Note: Header is a display-only component, so no state is stored in closure.
 * The onStateChange callback is received but not used since there's no mutable state.
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
  baseGetters: LfHeaderAdapterControllerGetters,
  _onStateChange: () => void,
  getAdapter: () => LfHeaderAdapter,
): Omit<LfHeaderAdapter, "dispatcher"> => {
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL STATE (replaces @State in WC)
  // Header is display-only, so no closure state is needed
  // ═══════════════════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE GETTERS - Read from closure (base getters only for header)
  // ═══════════════════════════════════════════════════════════════════════════
  const getters: LfHeaderAdapterControllerGetters = {
    ...baseGetters,
  };

  return {
    controller: {
      get: getters,
      set: {},
      computed: {},
      actions: {},
    },
    elements: {
      jsx: createJsx(getAdapter),
      refs: createRefs(),
    },
    handlers: {},
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfHeaderAdapter,
): LfHeaderAdapterJsx => {
  return prepHeaderJsx(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_HEADER_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfHeaderAdapterRefs => {
  return {
    header: null,
    section: null,
  };
};
//#endregion
