import {
  LfTypewriterAdapter,
  LfTypewriterAdapterControllerActions,
  LfTypewriterAdapterControllerComputed,
  LfTypewriterAdapterControllerGetters,
  LfTypewriterAdapterJsx,
  LfTypewriterAdapterRefs,
} from "@lf-widgets/foundations";
import { prepTypewriterJsx } from "./elements.typewriter";

/**
 * Creates the canonical adapter for lf-typewriter.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (shouldShowCursor, currentText, texts)
 * - controller.actions: Animation control operations (start, reset, deleteText, completeReset)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfTypewriterAdapterControllerGetters,
  computed: LfTypewriterAdapterControllerComputed,
  actions: LfTypewriterAdapterControllerActions,
  getAdapter: () => LfTypewriterAdapter,
): Omit<LfTypewriterAdapter, "dispatcher"> => {
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
  getAdapter: () => LfTypewriterAdapter,
): LfTypewriterAdapterJsx => {
  return prepTypewriterJsx(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_TYPEWRITER_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfTypewriterAdapterRefs => {
  return {
    cursor: null,
    text: null,
    typewriter: null,
  };
};
//#endregion
