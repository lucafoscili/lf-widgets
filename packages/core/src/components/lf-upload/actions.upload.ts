import {
  LfUploadAdapter,
  LfUploadAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-upload.
 *
 * Actions are complex multi-step operations that may:
 * - Have side effects
 * - Trigger re-renders
 * - Batch multiple state changes
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Actions object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepUploadActions = (
  getAdapter: () => LfUploadAdapter,
): LfUploadAdapterControllerActions => ({
  /**
   * Handles files from input change event.
   * Updates the selectedFiles state with the new file list.
   * @param files - FileList from the input element or null
   */
  handleFiles: (files: FileList | null) => {
    const adapter = getAdapter();
    const { compInstance } = adapter.controller.get;
    const comp = compInstance();

    if (files) {
      comp.selectedFiles = Array.from(files);
    } else {
      comp.selectedFiles = [];
    }

    adapter.dispatcher.emit("upload", { selectedFiles: comp.selectedFiles });
  },

  /**
   * Deletes a specific file from the selection.
   * @param file - The file to remove from selection
   */
  deleteFile: (file: File) => {
    const adapter = getAdapter();
    const { compInstance } = adapter.controller.get;
    const comp = compInstance();

    comp.selectedFiles = comp.selectedFiles.filter((f: File) => f !== file);
  },
});
