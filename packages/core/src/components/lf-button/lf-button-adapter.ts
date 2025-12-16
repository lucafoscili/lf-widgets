import {
  LfButtonAdapter,
  LfButtonAdapterControllerGetters,
  LfButtonAdapterControllerSetters,
  LfButtonAdapterHandlers,
  LfButtonAdapterJsx,
  LfButtonAdapterRefs,
  LfButtonState,
} from "@lf-widgets/foundations";
import { prepButtonActions } from "./actions.button";
import { prepButtonComputed } from "./computed.button";
import { prepButton } from "./elements.button";
import { prepButtonHandlers } from "./handlers.button";

/**
 * Creates the canonical adapter for lf-button.
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
 * @param baseGetters - Base getters from createBaseGetters utility + styling
 * @param initialValue - Initial button state
 * @param onStateChange - Callback to trigger WC re-render (increments _renderTick)
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Complete adapter (without dispatcher - added by WC)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter Factory
export const createAdapter = (
  baseGetters: Omit<LfButtonAdapterControllerGetters, "value">,
  initialValue: LfButtonState,
  onStateChange: () => void,
  getAdapter: () => LfButtonAdapter,
): Omit<LfButtonAdapter, "dispatcher"> => {
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL STATE (replaces @State in WC)
  // This closure variable IS the single source of truth for button state
  // ═══════════════════════════════════════════════════════════════════════════
  let _value: LfButtonState = initialValue;

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE GETTERS - Read from closure
  // ═══════════════════════════════════════════════════════════════════════════
  const getters: LfButtonAdapterControllerGetters = {
    ...baseGetters,
    value: () => _value,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE SETTERS - Write to closure + trigger render
  // ═══════════════════════════════════════════════════════════════════════════
  const setters: LfButtonAdapterControllerSetters = {
    value: (state: LfButtonState) => {
      const comp = baseGetters.compInstance();
      const isDisabled = comp.lfUiState === "disabled";
      const isToggable = comp.lfToggable;
      const isValid = state === "on" || state === "off";

      if (isToggable && !isDisabled && isValid && _value !== state) {
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
export const createComputed = (getAdapter: () => LfButtonAdapter) => {
  return prepButtonComputed(getAdapter);
};

export const createActions = (getAdapter: () => LfButtonAdapter) => {
  return prepButtonActions(getAdapter);
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterJsx => {
  return prepButton(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterHandlers => {
  return prepButtonHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_BUTTON_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfButtonAdapterRefs => {
  return {
    button: null,
    dropdown: null,
    icon: null,
    label: null,
    list: null,
    spinner: null,
  };
};
//#endregion
