import {
  LfCodeAdapter,
  LfCodeAdapterControllerGetters,
  LfCodeAdapterControllerSetters,
  LfCodeAdapterJsx,
  LfCodeAdapterRefs,
} from "@lf-widgets/foundations";
import { prepCodeActions } from "./actions.code";
import { prepCodeComputed } from "./computed.code";
import { prepCodeJsx } from "./elements.code";

/**
 * Creates the canonical adapter for lf-code.
 *
 * "Adapter as Core" Architecture:
 * - Adapter OWNS the runtime state (not the WC)
 * - State is stored in closure variables (e.g., `_value`)
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
 * @param baseGetters - Base getters from createBaseGetters utility
 * @param initialValue - Initial formatted code value
 * @param onStateChange - Callback to trigger WC re-render (increments _renderTick)
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Complete adapter (without dispatcher - added by WC)
 *
 * @see Section 5 & 5.9 of 4_0_0_REFACTORING.md
 */
//#region Adapter Factory
export const createAdapter = (
  baseGetters: Omit<LfCodeAdapterControllerGetters, "value">,
  initialValue: string,
  onStateChange: () => void,
  getAdapter: () => LfCodeAdapter,
): Omit<LfCodeAdapter, "dispatcher"> => {
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL STATE (replaces @State in WC)
  // This closure variable IS the single source of truth for code state
  // ═══════════════════════════════════════════════════════════════════════════
  let _value: string = initialValue;

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE GETTERS - Read from closure
  // ═══════════════════════════════════════════════════════════════════════════
  const getters: LfCodeAdapterControllerGetters = {
    ...baseGetters,
    value: () => _value,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE SETTERS - Write to closure + trigger render
  // ═══════════════════════════════════════════════════════════════════════════
  const setters: LfCodeAdapterControllerSetters = {
    value: (v: string) => {
      if (_value !== v) {
        _value = v;
        onStateChange(); // Signal WC to re-render
      }
    },
  };

  return {
    controller: {
      get: getters,
      set: setters,
      computed: prepCodeComputed(getAdapter),
      actions: prepCodeActions(getAdapter),
    },
    elements: {
      jsx: createJsx(getAdapter),
      refs: createRefs(),
    },
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfCodeAdapter,
): LfCodeAdapterJsx => {
  return prepCodeJsx(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_CODE_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfCodeAdapterRefs => {
  return {
    copyButton: null,
    pre: null,
    wrapper: null,
  };
};
//#endregion
