import {
  LfToggleAdapter,
  LfToggleAdapterControllerGetters,
  LfToggleAdapterControllerSetters,
  LfToggleAdapterHandlers,
  LfToggleAdapterJsx,
  LfToggleAdapterRefs,
  LfToggleState,
} from "@lf-widgets/foundations";
import { prepToggleActions } from "./actions.toggle";
import { prepToggleComputed } from "./computed.toggle";
import { prepToggle } from "./elements.toggle";
import { prepToggleHandlers } from "./handlers.toggle";

/**
 * Creates the canonical adapter for lf-toggle.
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
 * @param initialValue - Initial toggle state
 * @param onStateChange - Callback to trigger WC re-render (increments _renderTick)
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Complete adapter (without dispatcher - added by WC)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter Factory
export const createAdapter = (
  baseGetters: Omit<LfToggleAdapterControllerGetters, "value">,
  initialValue: LfToggleState,
  onStateChange: () => void,
  getAdapter: () => LfToggleAdapter,
): Omit<LfToggleAdapter, "dispatcher"> => {
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL STATE (replaces @State in WC)
  // This closure variable IS the single source of truth for toggle state
  // ═══════════════════════════════════════════════════════════════════════════
  let _value: LfToggleState = initialValue;

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE GETTERS - Read from closure
  // ═══════════════════════════════════════════════════════════════════════════
  const getters: LfToggleAdapterControllerGetters = {
    ...baseGetters,
    value: () => _value,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE SETTERS - Write to closure + trigger render
  // ═══════════════════════════════════════════════════════════════════════════
  const setters: LfToggleAdapterControllerSetters = {
    value: (state: LfToggleState) => {
      const comp = baseGetters.compInstance();
      const isDisabled = comp.lfUiState === "disabled";
      const isValid = state === "on" || state === "off";

      if (!isDisabled && isValid && _value !== state) {
        _value = state;
        onStateChange(); // Signal WC to re-render
      }
    },
  };

  return {
    controller: {
      get: getters,
      set: setters,
      computed: createComputed(getAdapter),
      actions: createActions(getAdapter),
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
export const createComputed = (getAdapter: () => LfToggleAdapter) => {
  return prepToggleComputed(getAdapter);
};

export const createActions = (getAdapter: () => LfToggleAdapter) => {
  return prepToggleActions(getAdapter);
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfToggleAdapter,
): LfToggleAdapterJsx => {
  return prepToggle(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfToggleAdapter,
): LfToggleAdapterHandlers => {
  return prepToggleHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_TOGGLE_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfToggleAdapterRefs => {
  return {
    input: null,
    label: null,
    thumb: null,
    thumbUnderlay: null,
    track: null,
  };
};
//#endregion
