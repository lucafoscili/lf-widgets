import {
  LfRadioAdapter,
  LfRadioAdapterControllerActions,
  LfRadioAdapterControllerComputed,
  LfRadioAdapterControllerGetters,
  LfRadioAdapterControllerSetters,
  LfRadioAdapterHandlers,
  LfRadioAdapterJsx,
  LfRadioAdapterRefs,
} from "@lf-widgets/foundations";

import { prepRadio } from "./elements.radio";
import { prepRadioHandlers } from "./handlers.radio";

/**
 * Creates the canonical adapter for lf-radio.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.set: Simple setters (updateDataset)
 * - controller.computed: Derived predicates (isDisabled, hasNodes, isHorizontal, etc.)
 * - controller.actions: Complex operations (select, clear, focusNext, focusPrevious)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfRadioAdapterControllerGetters,
  setters: LfRadioAdapterControllerSetters,
  computed: LfRadioAdapterControllerComputed,
  actions: LfRadioAdapterControllerActions,
  getAdapter: () => LfRadioAdapter,
): Omit<LfRadioAdapter, "dispatcher"> => {
  return {
    controller: {
      get: getters,
      set: createSetters(setters, getAdapter),
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

//#region Controller
export const createSetters = (
  setters: LfRadioAdapterControllerSetters,
  getAdapter: () => LfRadioAdapter,
): LfRadioAdapterControllerSetters => {
  return {
    ...setters,
    updateDataset: (dataset) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;
      const { selectedId } = adapter.controller.computed;
      const comp = compInstance();

      const currentSelectedId = selectedId();
      comp.lfDataset = dataset;

      if (currentSelectedId) {
        const stillExists = dataset?.nodes?.some(
          (n) => n.id === currentSelectedId,
        );
        if (!stillExists) {
          adapter.controller.actions.clear();
        }
      }
    },
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfRadioAdapter,
): LfRadioAdapterJsx => {
  return prepRadio(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfRadioAdapter,
): LfRadioAdapterHandlers => {
  return prepRadioHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_RADIO_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfRadioAdapterRefs => {
  return {
    inputs: new Map(),
    items: new Map(),
  };
};
//#endregion
