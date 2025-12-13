import {
  LfTextfieldAdapter,
  LfTextfieldAdapterControllerActions,
  LfTextfieldAdapterControllerComputed,
  LfTextfieldAdapterControllerGetters,
  LfTextfieldAdapterControllerSetters,
  LfTextfieldAdapterHandlers,
  LfTextfieldAdapterJsx,
  LfTextfieldAdapterRefs,
} from "@lf-widgets/foundations";
import { prepTextfieldElements } from "./elements.textfield";
import { prepTextfieldHandlers } from "./handlers.textfield";

/**
 * Creates the canonical adapter for lf-textfield.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + styling
 * - controller.set: Simple setters (value, formattingError, status)
 * - controller.computed: Derived predicates (isDisabled, isOutlined, isTextarea)
 * - controller.actions: Complex operations (focus, blur, updateState, formatJSON)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfTextfieldAdapterControllerGetters,
  setters: LfTextfieldAdapterControllerSetters,
  computed: LfTextfieldAdapterControllerComputed,
  actions: LfTextfieldAdapterControllerActions,
  getAdapter: () => LfTextfieldAdapter,
): Omit<LfTextfieldAdapter, "dispatcher"> => {
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
