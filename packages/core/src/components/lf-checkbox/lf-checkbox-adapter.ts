import {
  LfCheckboxAdapter,
  LfCheckboxAdapterControllerActions,
  LfCheckboxAdapterControllerComputed,
  LfCheckboxAdapterControllerGetters,
  LfCheckboxAdapterControllerSetters,
  LfCheckboxAdapterHandlers,
  LfCheckboxAdapterJsx,
  LfCheckboxAdapterRefs,
} from "@lf-widgets/foundations";
import { prepCheckboxElements } from "./elements.checkbox";
import { prepCheckboxHandlers } from "./handlers.checkbox";

/**
 * Creates the canonical adapter for lf-checkbox.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.set: Simple setters (none for checkbox)
 * - controller.computed: Derived predicates (isChecked, isDisabled, isIndeterminate)
 * - controller.actions: Complex operations (toggle)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfCheckboxAdapterControllerGetters,
  setters: LfCheckboxAdapterControllerSetters,
  computed: LfCheckboxAdapterControllerComputed,
  actions: LfCheckboxAdapterControllerActions,
  getAdapter: () => LfCheckboxAdapter,
): Omit<LfCheckboxAdapter, "dispatcher"> => {
  return {
    controller: {
      get: getters,
      set: setters,
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

//#region Elements
export const createJsx = (
  getAdapter: () => LfCheckboxAdapter,
): LfCheckboxAdapterJsx => {
  return prepCheckboxElements(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfCheckboxAdapter,
): LfCheckboxAdapterHandlers => {
  return prepCheckboxHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_CHECKBOX_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfCheckboxAdapterRefs => {
  return {
    input: null,
    label: null,
    surface: null,
  };
};
//#endregion
