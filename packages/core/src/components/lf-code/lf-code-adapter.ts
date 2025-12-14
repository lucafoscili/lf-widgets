import {
  LfCodeAdapter,
  LfCodeAdapterControllerActions,
  LfCodeAdapterControllerComputed,
  LfCodeAdapterControllerGetters,
  LfCodeAdapterJsx,
  LfCodeAdapterRefs,
} from "@lf-widgets/foundations";
import { prepCodeJsx } from "./elements.code";

/**
 * Creates the canonical adapter for lf-code.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived values (formattedCode, shouldPreserveSpace)
 * - controller.actions: Complex operations (highlight, copyToClipboard, loadLanguage)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfCodeAdapterControllerGetters,
  computed: LfCodeAdapterControllerComputed,
  actions: LfCodeAdapterControllerActions,
  getAdapter: () => LfCodeAdapter,
): Omit<LfCodeAdapter, "dispatcher"> => {
  return {
    controller: {
      get: getters,
      computed,
      actions,
    },
    elements: {
      jsx: createJsx(getAdapter),
      refs: createRefs(),
    },
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfCodeAdapter,
): LfCodeAdapterJsx => {
  return prepCodeJsx(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_CODE_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfCodeAdapterRefs => {
  return {
    copyButton: null,
    pre: null,
    wrapper: null,
  };
};
//#endregion
