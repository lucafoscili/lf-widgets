import {
  LfUploadAdapter,
  LfUploadAdapterHandlers,
} from "@lf-widgets/foundations";

/**
 * Prepares event handlers for the upload component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.actions` for complex operations (handleFiles, deleteFile)
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepUploadHandlers = (
  getAdapter: () => LfUploadAdapter,
): LfUploadAdapterHandlers => {
  return {
    /**
     * Handles file deletion.
     * Routes through actions and emits delete event.
     */
    delete: (e: Event, file: File) => {
      const adapter = getAdapter();
      const { actions } = adapter.controller;
      const { compInstance } = adapter.controller.get;

      actions.deleteFile(file);
      adapter.dispatcher.emit("delete", {
        originalEvent: e,
        selectedFiles: compInstance().selectedFiles,
      });
    },

    /**
     * Handles pointerdown event on the label.
     * Emits pointerdown event through dispatcher.
     */
    pointerdown: (e: PointerEvent) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;

      adapter.dispatcher.emit("pointerdown", {
        originalEvent: e,
        selectedFiles: compInstance().selectedFiles,
      });
    },

    /**
     * Handles file upload/change event.
     * Delegates to actions for file handling.
     */
    upload: () => {
      const adapter = getAdapter();
      const { actions } = adapter.controller;
      const { input } = adapter.elements.refs;

      if (input) {
        actions.handleFiles(input.files);
      }
    },
  };
};
