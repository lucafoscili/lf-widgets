import {
  LfSplashAdapter,
  LfSplashAdapterControllerGetters,
  LfSplashAdapterControllerSetters,
  LfSplashAdapterHandlers,
  LfSplashAdapterJsx,
  LfSplashAdapterRefs,
  LfSplashStates,
} from "@lf-widgets/foundations";
import { prepSplashActions } from "./actions.splash";
import { prepSplashComputed } from "./computed.splash";
import { prepSplashJsx } from "./elements.splash";

/**
 * Creates the canonical adapter for lf-splash.
 *
 * "Adapter as Core" Architecture:
 * - Adapter OWNS the runtime state (not the WC)
 * - State is stored in closure variables (e.g., `_state`)
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
 * @param initialState - Initial splash state
 * @param onStateChange - Callback to trigger WC re-render (increments _renderTick)
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Complete adapter (without dispatcher - added by WC)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter Factory
export const createAdapter = (
  baseGetters: Omit<LfSplashAdapterControllerGetters, "state">,
  initialState: LfSplashStates,
  onStateChange: () => void,
  getAdapter: () => LfSplashAdapter,
): Omit<LfSplashAdapter, "dispatcher"> => {
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL STATE (replaces @State in WC)
  // This closure variable IS the single source of truth for splash state
  // ═══════════════════════════════════════════════════════════════════════════
  let _state: LfSplashStates = initialState;

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE GETTERS - Read from closure
  // ═══════════════════════════════════════════════════════════════════════════
  const getters: LfSplashAdapterControllerGetters = {
    ...baseGetters,
    state: () => _state,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE SETTERS - Write to closure + trigger render
  // ═══════════════════════════════════════════════════════════════════════════
  const setters: LfSplashAdapterControllerSetters = {
    state: (state: LfSplashStates) => {
      if (_state !== state) {
        _state = state;
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
    handlers: createHandlers(),
  };
};
//#endregion

//#region Controller
export const createComputed = (getAdapter: () => LfSplashAdapter) => {
  return prepSplashComputed(getAdapter);
};

export const createActions = (getAdapter: () => LfSplashAdapter) => {
  return prepSplashActions(getAdapter);
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfSplashAdapter,
): LfSplashAdapterJsx => {
  return prepSplashJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (): LfSplashAdapterHandlers => {
  return {};
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_SPLASH_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfSplashAdapterRefs => {
  return {
    splash: null,
    content: null,
    label: null,
    widget: null,
  };
};
//#endregion
