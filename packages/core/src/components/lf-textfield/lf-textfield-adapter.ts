import {
  LfTextfieldAdapter,
  LfTextfieldAdapterControllerGetters,
  LfTextfieldAdapterControllerSetters,
  LfTextfieldAdapterHandlers,
  LfTextfieldAdapterJsx,
  LfTextfieldAdapterRefs,
  LfTextfieldModifiers,
} from "@lf-widgets/foundations";
import { prepTextfieldActions } from "./actions.textfield";
import { prepTextfieldComputed } from "./computed.textfield";
import { prepTextfieldElements } from "./elements.textfield";
import { prepTextfieldHandlers } from "./handlers.textfield";

/**
 * Creates the canonical adapter for lf-textfield.
 *
 * "Adapter as Core" Architecture:
 * - Adapter OWNS the runtime state (not the WC)
 * - State is stored in closure variables (e.g., `_value`, `_status`)
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
 * @param baseGetters - Base getters from createBaseGetters utility (excluding state getters)
 * @param initialValue - Initial textfield value
 * @param onStateChange - Callback to trigger WC re-render (increments _renderTick)
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Complete adapter (without dispatcher - added by WC)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter Factory
export const createAdapter = (
  baseGetters: Omit<LfTextfieldAdapterControllerGetters, "value" | "status">,
  initialValue: string,
  onStateChange: () => void,
  getAdapter: () => LfTextfieldAdapter,
): Omit<LfTextfieldAdapter, "dispatcher"> => {
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL STATE (replaces @State in WC)
  // These closure variables ARE the single source of truth for textfield state
  // ═══════════════════════════════════════════════════════════════════════════
  let _value: string = initialValue;
  let _status: Set<LfTextfieldModifiers> = new Set(
    initialValue ? ["filled"] : [],
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE GETTERS - Read from closure
  // ═══════════════════════════════════════════════════════════════════════════
  const getters: LfTextfieldAdapterControllerGetters = {
    ...baseGetters,
    value: () => _value,
    status: () => _status,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE SETTERS - Write to closure + trigger render
  // ═══════════════════════════════════════════════════════════════════════════
  const setters: LfTextfieldAdapterControllerSetters = {
    value: (val: string) => {
      if (_value !== val) {
        _value = val;
        onStateChange(); // Signal WC to re-render
      }
    },
    formattingError: (error: string) => {
      const comp = baseGetters.compInstance();
      // Store in component's private field (non-reactive state)
      (comp as any).formattingErrorValue = error;
    },
    status: (modifier: LfTextfieldModifiers, add: boolean) => {
      const hadModifier = _status.has(modifier);
      if (add && !hadModifier) {
        _status = new Set(_status);
        _status.add(modifier);
        onStateChange(); // Signal WC to re-render
      } else if (!add && hadModifier) {
        _status = new Set(_status);
        _status.delete(modifier);
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
export const createComputed = (getAdapter: () => LfTextfieldAdapter) => {
  return prepTextfieldComputed(getAdapter);
};

export const createActions = (getAdapter: () => LfTextfieldAdapter) => {
  return prepTextfieldActions(getAdapter);
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfTextfieldAdapter,
): LfTextfieldAdapterJsx => {
  return prepTextfieldElements(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfTextfieldAdapter,
): LfTextfieldAdapterHandlers => {
  return prepTextfieldHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_TEXTFIELD_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfTextfieldAdapterRefs => {
  return {
    icon: null,
    iconAction: null,
    input: null,
  };
};
//#endregion
