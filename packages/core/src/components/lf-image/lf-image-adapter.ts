import {
  LfImageAdapter,
  LfImageAdapterControllerActions,
  LfImageAdapterControllerComputed,
  LfImageAdapterControllerGetters,
  LfImageAdapterControllerSetters,
  LfImageAdapterHandlers,
  LfImageAdapterJsx,
  LfImageAdapterRefs,
} from "@lf-widgets/foundations";
import { prepImageJsx } from "./elements.image";
import { prepImageHandlers } from "./handlers.image";

/**
 * Creates the canonical adapter for lf-image.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + resolvedFor
 * - controller.set: Simple setters (error, isLoaded, resolvedSpriteName, resolvedFor, imageRef)
 * - controller.computed: Derived predicates (isResourceUrl, resolvedSource)
 * - controller.actions: Complex operations (resolveSprite, resetState)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfImageAdapterControllerGetters,
  setters: LfImageAdapterControllerSetters,
  computed: LfImageAdapterControllerComputed,
  actions: LfImageAdapterControllerActions,
  getAdapter: () => LfImageAdapter,
): Omit<LfImageAdapter, "dispatcher"> => {
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
  getAdapter: () => LfImageAdapter,
): LfImageAdapterJsx => {
  return prepImageJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfImageAdapter,
): LfImageAdapterHandlers => {
  return prepImageHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_IMAGE_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfImageAdapterRefs => {
  return {
    image: null,
    img: null,
    icon: null,
  };
};
//#endregion
