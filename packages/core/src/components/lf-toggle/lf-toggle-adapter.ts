import {
  LfToggleAdapter,
  LfToggleAdapterControllerActions,
  LfToggleAdapterControllerComputed,
  LfToggleAdapterControllerGetters,
  LfToggleAdapterControllerSetters,
  LfToggleAdapterHandlers,
  LfToggleAdapterJsx,
  LfToggleAdapterRefs,
} from "@lf-widgets/foundations";
import { prepToggle } from "./elements.toggle";
import { prepToggleHandlers } from "./handlers.toggle";

/**
 * Creates the canonical adapter for lf-toggle.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.set: Simple setters
 * - controller.computed: Derived predicates (isDisabled, isOn)
 * - controller.actions: Complex operations (toggle)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfToggleAdapterControllerGetters,
  setters: LfToggleAdapterControllerSetters,
  computed: LfToggleAdapterControllerComputed,
  actions: LfToggleAdapterControllerActions,
  getAdapter: () => LfToggleAdapter,
): Omit<LfToggleAdapter, "dispatcher"> => {
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
    track: null,
  };
};
//#endregion
