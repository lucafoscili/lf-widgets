import {
  LfUploadAdapter,
  LfUploadAdapterControllerActions,
  LfUploadAdapterControllerComputed,
  LfUploadAdapterControllerGetters,
  LfUploadAdapterHandlers,
  LfUploadAdapterJsx,
  LfUploadAdapterRefs,
} from "@lf-widgets/foundations";
import { prepUploadJsx } from "./elements.upload";
import { prepUploadHandlers } from "./handlers.upload";

/**
 * Creates the canonical adapter for lf-upload.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (hasSelectedFiles, formatFileSize, getFileIcon)
 * - controller.actions: Complex operations (handleFiles, deleteFile)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfUploadAdapterControllerGetters,
  computed: LfUploadAdapterControllerComputed,
  actions: LfUploadAdapterControllerActions,
  getAdapter: () => LfUploadAdapter,
): Omit<LfUploadAdapter, "dispatcher"> => {
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
  getAdapter: () => LfUploadAdapter,
): LfUploadAdapterJsx => {
  return prepUploadJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfUploadAdapter,
): LfUploadAdapterHandlers => {
  return prepUploadHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_UPLOAD_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfUploadAdapterRefs => {
  return {
    input: null,
    label: null,
    fileInfo: null,
    upload: null,
  };
};
//#endregion
