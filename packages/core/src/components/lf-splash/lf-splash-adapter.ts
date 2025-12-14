import {
  LfSplashAdapter,
  LfSplashAdapterControllerActions,
  LfSplashAdapterControllerComputed,
  LfSplashAdapterControllerGetters,
  LfSplashAdapterHandlers,
  LfSplashAdapterJsx,
  LfSplashAdapterRefs,
} from "@lf-widgets/foundations";
import { prepSplashJsx } from "./elements.splash";

/**
 * Creates the canonical adapter for lf-splash.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (isUnmounting)
 * - controller.actions: Complex operations (none for this simple component)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks (none for this simple component)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfSplashAdapterControllerGetters,
  computed: LfSplashAdapterControllerComputed,
  actions: LfSplashAdapterControllerActions,
  getAdapter: () => LfSplashAdapter,
): Omit<LfSplashAdapter, "dispatcher"> => {
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
    handlers: createHandlers(),
  };
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
