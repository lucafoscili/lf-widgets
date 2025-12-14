import {
  LfPhotoframeAdapter,
  LfPhotoframeAdapterControllerActions,
  LfPhotoframeAdapterControllerComputed,
  LfPhotoframeAdapterControllerGetters,
  LfPhotoframeAdapterHandlers,
  LfPhotoframeAdapterJsx,
  LfPhotoframeAdapterRefs,
} from "@lf-widgets/foundations";
import { prepPhotoframeJsx } from "./elements.photoframe";
import { prepPhotoframeHandlers } from "./handlers.photoframe";

/**
 * Creates the canonical adapter for lf-photoframe.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (isInViewport, showPlaceholder, isReady, shouldReplace)
 * - controller.actions: Complex operations (triggerLoad)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfPhotoframeAdapterControllerGetters,
  computed: LfPhotoframeAdapterControllerComputed,
  actions: LfPhotoframeAdapterControllerActions,
  getAdapter: () => LfPhotoframeAdapter,
): Omit<LfPhotoframeAdapter, "dispatcher"> => {
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
    handlers: createHandlers(getAdapter),
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfPhotoframeAdapter,
): LfPhotoframeAdapterJsx => {
  return prepPhotoframeJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfPhotoframeAdapter,
): LfPhotoframeAdapterHandlers => {
  return prepPhotoframeHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_PHOTOFRAME_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfPhotoframeAdapterRefs => {
  return {
    image: null,
    overlay: null,
    placeholder: null,
  };
};
//#endregion
