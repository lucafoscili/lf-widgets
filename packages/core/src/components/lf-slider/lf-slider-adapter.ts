import {
  LfSliderAdapter,
  LfSliderAdapterControllerGetters,
  LfSliderAdapterControllerSetters,
  LfSliderAdapterJsx,
  LfSliderAdapterRefs,
  LfSliderValue,
} from "@lf-widgets/foundations";
import { prepSliderActions } from "./actions.slider";
import { prepSliderComputed } from "./computed.slider";
import { prepSliderJsx } from "./elements.slider";
import { prepSliderHandlers } from "./handlers.slider";

/**
 * Creates the canonical adapter for lf-slider.
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
 * @param initialValue - Initial slider value
 * @param onStateChange - Callback to trigger WC re-render (increments _renderTick)
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Complete adapter (without dispatcher - added by WC)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter Factory
export const createAdapter = (
  baseGetters: Omit<LfSliderAdapterControllerGetters, "value">,
  initialValue: LfSliderValue,
  onStateChange: () => void,
  getAdapter: () => LfSliderAdapter,
): Omit<LfSliderAdapter, "dispatcher"> => {
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL STATE (replaces @State in WC)
  // This closure variable IS the single source of truth for slider state
  // ═══════════════════════════════════════════════════════════════════════════
  let _value: LfSliderValue = initialValue;

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE GETTERS - Read from closure
  // ═══════════════════════════════════════════════════════════════════════════
  const getters: LfSliderAdapterControllerGetters = {
    ...baseGetters,
    value: () => _value,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE SETTERS - Write to closure + trigger render
  // ═══════════════════════════════════════════════════════════════════════════
  const setters: LfSliderAdapterControllerSetters = {
    value: (newValue: LfSliderValue) => {
      const comp = baseGetters.compInstance();
      const isDisabled = comp.lfUiState === "disabled";

      if (!isDisabled) {
        _value = newValue;
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
export const createComputed = (getAdapter: () => LfSliderAdapter) => {
  return prepSliderComputed(getAdapter);
};

export const createActions = (getAdapter: () => LfSliderAdapter) => {
  return prepSliderActions(getAdapter);
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfSliderAdapter,
): LfSliderAdapterJsx => {
  return prepSliderJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (getAdapter: () => LfSliderAdapter) => {
  return prepSliderHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_SLIDER_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfSliderAdapterRefs => {
  return {
    input: null,
    thumb: null,
    thumbUnderlay: null,
    track: null,
  };
};
//#endregion
