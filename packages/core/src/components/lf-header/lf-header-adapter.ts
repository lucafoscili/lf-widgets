import {
  LfHeaderAdapter,
  LfHeaderAdapterControllerActions,
  LfHeaderAdapterControllerComputed,
  LfHeaderAdapterControllerGetters,
  LfHeaderAdapterControllerSetters,
  LfHeaderAdapterJsx,
  LfHeaderAdapterRefs,
} from "@lf-widgets/foundations";
import { prepHeaderJsx } from "./elements.header";

/**
 * Creates the canonical adapter for lf-header.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.set: Empty for display-only component
 * - controller.computed: Empty for display-only component
 * - controller.actions: Empty for display-only component
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfHeaderAdapterControllerGetters,
  setters: LfHeaderAdapterControllerSetters,
  computed: LfHeaderAdapterControllerComputed,
  actions: LfHeaderAdapterControllerActions,
  getAdapter: () => LfHeaderAdapter,
): Omit<LfHeaderAdapter, "dispatcher"> => {
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
    handlers: {},
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfHeaderAdapter,
): LfHeaderAdapterJsx => {
  return prepHeaderJsx(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_HEADER_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfHeaderAdapterRefs => {
  return {
    header: null,
    section: null,
  };
};
//#endregion
