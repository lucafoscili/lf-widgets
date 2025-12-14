import {
  LfProgressbarAdapter,
  LfProgressbarAdapterControllerActions,
  LfProgressbarAdapterControllerComputed,
  LfProgressbarAdapterControllerGetters,
  LfProgressbarAdapterControllerSetters,
  LfProgressbarAdapterHandlers,
  LfProgressbarAdapterJsx,
  LfProgressbarAdapterRefs,
} from "@lf-widgets/foundations";
import { prepProgressbarJsx } from "./elements.progressbar";

/**
 * Creates the canonical adapter for lf-progressbar.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.set: Simple setters (empty for display component)
 * - controller.computed: Derived predicates (empty for display component)
 * - controller.actions: Complex operations (empty for display component)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks (empty for display component)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfProgressbarAdapterControllerGetters,
  setters: LfProgressbarAdapterControllerSetters,
  computed: LfProgressbarAdapterControllerComputed,
  actions: LfProgressbarAdapterControllerActions,
  getAdapter: () => LfProgressbarAdapter,
): Omit<LfProgressbarAdapter, "dispatcher"> => {
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
    handlers: createHandlers(),
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfProgressbarAdapter,
): LfProgressbarAdapterJsx => {
  return prepProgressbarJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (): LfProgressbarAdapterHandlers => {
  return {};
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_PROGRESSBAR_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfProgressbarAdapterRefs => {
  return {
    progressbar: null,
  };
};
//#endregion
