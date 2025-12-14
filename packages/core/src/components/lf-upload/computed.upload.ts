import {
  LfUploadAdapter,
  LfUploadAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-upload.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepUploadComputed = (
  getAdapter: () => LfUploadAdapter,
): LfUploadAdapterControllerComputed => ({
  /**
   * Whether any files are currently selected.
   */
  hasSelectedFiles: () => {
    const { compInstance } = getAdapter().controller.get;
    return Boolean(compInstance().selectedFiles?.length);
  },

  /**
   * Formats a file size to human-readable string.
   * @param size - File size in bytes
   */
  formatFileSize: (size: number) => {
    const units = ["Bytes", "KB", "MB", "GB", "TB"];
    let unitIndex = 0;

    if (size > 10000) {
      size /= 1024;
      size /= 1024;
      unitIndex = 2;
    } else {
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  },

  /**
   * Gets the appropriate icon name for a file based on its type.
   * @param file - The file to get icon for
   */
  getFileIcon: (file: File) => {
    const { framework } = getAdapter().controller.get;
    const {
      file: fileIcon,
      movie,
      music,
      pdf,
      photo,
      zip,
    } = framework().theme.get.icons();

    const isLikelyImage =
      file.type.includes("image") ||
      file.type.includes("jpg") ||
      file.type.includes("png") ||
      file.type.includes("jpeg") ||
      file.type.includes("gif");

    const isLikelyAudio =
      file.type.includes("audio") ||
      file.type.includes("mp3") ||
      file.type.includes("wav") ||
      file.type.includes("ogg");

    const isLikelyVideo =
      file.type.includes("video") ||
      file.type.includes("mp4") ||
      file.type.includes("avi") ||
      file.type.includes("mov");

    const isLikelyZip =
      file.type.includes("7z") ||
      file.type.includes("zip") ||
      file.type.includes("application/zip") ||
      file.type.includes("application/x-zip-compressed");

    const isLikelyPdf = file.type.includes("pdf");

    return isLikelyImage
      ? photo
      : isLikelyAudio
        ? music
        : isLikelyVideo
          ? movie
          : isLikelyPdf
            ? pdf
            : isLikelyZip
              ? zip
              : fileIcon;
  },
});
