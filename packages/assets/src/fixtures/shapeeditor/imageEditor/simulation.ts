/**
 * Image Editor API Simulation
 *
 * Simulates backend API responses for the image editor.
 * Useful for:
 * - Showcase demos without a real backend
 * - Testing the history/snapshot functionality
 * - Development/prototyping without ComfyUI
 *
 * The simulation applies CSS filters to preview effects client-side,
 * then returns the "processed" image as a data URL.
 */

import type { LfShapeeditorConfigSettings } from "@lf-widgets/foundations";

import type { ImageEditorFilterType } from "./settings";

//#region Types
/**
 * Simulated API response matching the real backend structure.
 */
export interface ImageEditorApiResponse {
  status: "success" | "error";
  message?: string;
  /** Base64-encoded result image */
  data: string;
  /** Optional mask preview (for inpaint) */
  mask?: string;
  /** Optional cutout preview (for background remover) */
  cutout?: string;
  /** Optional processing statistics */
  stats?: {
    processingTimeMs: number;
    inputSize: { width: number; height: number };
    outputSize: { width: number; height: number };
  };
  /** Optional WD14 tags (for AI tagging) */
  wd14_tags?: string[];
  wd14_backend?: string;
}

/**
 * Options for the API simulation.
 */
export interface ImageEditorSimulationOptions {
  /** Simulated processing delay in ms (default: 500) */
  delayMs?: number;
  /** Whether to simulate random failures (default: false) */
  simulateErrors?: boolean;
  /** Error rate when simulateErrors is true (0-1, default: 0.1) */
  errorRate?: number;
  /** Whether to log simulation details (default: false) */
  verbose?: boolean;
}

/**
 * History entry for undo/redo functionality.
 */
export interface ImageEditorHistoryEntry {
  timestamp: number;
  filterType: ImageEditorFilterType;
  settings: LfShapeeditorConfigSettings;
  imageData: string;
  description: string;
}

/**
 * History manager for tracking image edits.
 */
export interface ImageEditorHistoryManager {
  /** All history entries */
  entries: ImageEditorHistoryEntry[];
  /** Current position in history (for undo/redo) */
  currentIndex: number;
  /** Maximum entries to keep */
  maxEntries: number;

  /** Add a new entry (clears redo stack) */
  push: (entry: Omit<ImageEditorHistoryEntry, "timestamp">) => void;
  /** Undo to previous state */
  undo: () => ImageEditorHistoryEntry | null;
  /** Redo to next state */
  redo: () => ImageEditorHistoryEntry | null;
  /** Check if undo is available */
  canUndo: () => boolean;
  /** Check if redo is available */
  canRedo: () => boolean;
  /** Clear all history */
  clear: () => void;
  /** Get current entry */
  current: () => ImageEditorHistoryEntry | null;
}
//#endregion

//#region CSS Filter Simulation
/**
 * Maps filter settings to CSS filter strings for client-side preview.
 * Note: These are approximations - real processing happens server-side.
 */
const filterToCss: Record<
  string,
  (settings: LfShapeeditorConfigSettings) => string
> = {
  brightness: (s) => {
    const strength = (s["brightness_strength"] as number) ?? 0;
    // CSS brightness: 1 is normal, 0 is black, 2 is double
    const cssValue = 1 + strength;
    return `brightness(${cssValue})`;
  },

  contrast: (s) => {
    const strength = (s["contrast_strength"] as number) ?? 0;
    // CSS contrast: 1 is normal
    const cssValue = 1 + strength;
    return `contrast(${cssValue})`;
  },

  saturation: (s) => {
    const intensity = (s["saturation_intensity"] as number) ?? 1;
    return `saturate(${intensity})`;
  },

  desaturate: (s) => {
    const strength = (s["desaturate_strength"] as number) ?? 0;
    // Grayscale: 0 is color, 1 is fully desaturated
    return `grayscale(${strength})`;
  },

  sepia: (s) => {
    const intensity = (s["sepia_intensity"] as number) ?? 0;
    return `sepia(${intensity})`;
  },

  gaussian_blur: (s) => {
    const sigma = (s["gaussianBlur_sigma"] as number) ?? 0;
    return `blur(${sigma}px)`;
  },

  vibrance: (s) => {
    // Approximate vibrance with saturation
    const intensity = (s["vibrance_intensity"] as number) ?? 0;
    const cssValue = 1 + intensity * 0.5;
    return `saturate(${cssValue})`;
  },

  // Effects that can't be easily simulated with CSS filters
  blend: () => "",
  bloom: () => "",
  film_grain: () => "",
  split_tone: () => "",
  tilt_shift: () => "",
  vignette: () => "",
  clarity: () => "",
  unsharp_mask: () => "",

  // These require server-side processing
  inpaint: () => "",
  outpaint: () => "",
  background_remover: () => "",
  resize_edge: () => "",
  resize_free: () => "",
  brush: () => "",
  line: () => "",
};

/**
 * Applies simulated filter effects to an image using Canvas.
 */
const applyFilterToCanvas = async (
  imageData: string,
  filterType: ImageEditorFilterType,
  settings: LfShapeeditorConfigSettings,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Apply CSS filter if available
      const cssFilter = filterToCss[filterType];
      if (cssFilter) {
        ctx.filter = cssFilter(settings) || "none";
      }

      ctx.drawImage(img, 0, 0);

      // Reset filter for any additional drawing
      ctx.filter = "none";

      // Apply vignette manually if needed
      if (filterType === "vignette") {
        const intensity = (settings["vignette_intensity"] as number) ?? 0;
        const radius = (settings["vignette_radius"] as number) ?? 0;

        if (intensity > 0) {
          const gradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            canvas.width * (0.3 + radius * 0.4),
            canvas.width / 2,
            canvas.height / 2,
            canvas.width * 0.8,
          );

          const color = (settings["vignette_color"] as string) ?? "#000000";
          gradient.addColorStop(0, "transparent");
          gradient.addColorStop(
            1,
            color +
              Math.round(intensity * 255)
                .toString(16)
                .padStart(2, "0"),
          );

          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }

      // Apply blend if needed
      if (filterType === "blend") {
        const opacity = (settings["blend_opacity"] as number) ?? 0;
        const color = (settings["blend_color"] as string) ?? "#ff0000";

        if (opacity > 0) {
          ctx.globalAlpha = opacity;
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1;
        }
      }

      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = imageData;
  });
};
//#endregion

//#region API Simulation
/**
 * Creates a simulated API client for image processing.
 *
 * @example
 * ```typescript
 * const api = createImageEditorApi({ delayMs: 300, verbose: true });
 *
 * const result = await api.process(imageBase64, "brightness", {
 *   brightness_strength: 0.5,
 *   brightness_gamma: 1.2,
 * });
 *
 * if (result.status === "success") {
 *   previewImage.src = result.data;
 * }
 * ```
 */
export const createImageEditorApi = (
  options: ImageEditorSimulationOptions = {},
) => {
  const {
    delayMs = 500,
    simulateErrors = false,
    errorRate = 0.1,
    verbose = false,
  } = options;

  const log = (...args: unknown[]) => {
    if (verbose) {
      console.log("[ImageEditor Simulation]", ...args);
    }
  };

  return {
    /**
     * Simulates processing an image with the specified filter.
     */
    process: async (
      imageData: string,
      filterType: ImageEditorFilterType,
      settings: LfShapeeditorConfigSettings,
    ): Promise<ImageEditorApiResponse> => {
      const startTime = performance.now();
      log(`Processing ${filterType}`, settings);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      // Simulate random errors
      if (simulateErrors && Math.random() < errorRate) {
        return {
          status: "error",
          message: `Simulated error processing ${filterType}`,
          data: imageData,
        };
      }

      try {
        // Apply filter simulation
        const processedData = await applyFilterToCanvas(
          imageData,
          filterType,
          settings,
        );

        const endTime = performance.now();

        log(`Completed ${filterType} in ${Math.round(endTime - startTime)}ms`);

        return {
          status: "success",
          data: processedData,
          stats: {
            processingTimeMs: Math.round(endTime - startTime),
            inputSize: { width: 0, height: 0 }, // Would be populated from actual image
            outputSize: { width: 0, height: 0 },
          },
        };
      } catch (error) {
        return {
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
          data: imageData,
        };
      }
    },

    /**
     * Simulates an inpaint operation (just returns the original for now).
     */
    inpaint: async (
      imageData: string,
      maskData: string,
      settings: LfShapeeditorConfigSettings,
    ): Promise<ImageEditorApiResponse> => {
      log("Inpaint simulation (no-op)", {
        maskData: maskData.slice(0, 50) + "...",
      });

      await new Promise((resolve) => setTimeout(resolve, delayMs * 2));

      // In a real scenario, this would call the diffusion backend
      // For simulation, we just return the original image
      return {
        status: "success",
        data: imageData,
        mask: maskData,
        message: "Inpaint simulation - no actual processing",
        wd14_tags: settings["inpaint_wd14Tagging"]
          ? ["1girl", "portrait", "realistic"]
          : undefined,
        wd14_backend: settings["inpaint_wd14Tagging"]
          ? "simulation"
          : undefined,
      };
    },

    /**
     * Simulates background removal (returns original with note).
     */
    removeBackground: async (
      imageData: string,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _settings: LfShapeeditorConfigSettings,
    ): Promise<ImageEditorApiResponse> => {
      log("Background removal simulation (no-op)");

      await new Promise((resolve) => setTimeout(resolve, delayMs * 3));

      return {
        status: "success",
        data: imageData,
        message: "Background removal simulation - no actual processing",
      };
    },
  };
};
//#endregion

//#region History Manager
/**
 * Creates a history manager for tracking image edits.
 *
 * @example
 * ```typescript
 * const history = createHistoryManager({ maxEntries: 50 });
 *
 * // After each edit
 * history.push({
 *   filterType: "brightness",
 *   settings: { brightness_strength: 0.5 },
 *   imageData: currentImageBase64,
 *   description: "Increased brightness",
 * });
 *
 * // Undo
 * if (history.canUndo()) {
 *   const previous = history.undo();
 *   displayImage(previous.imageData);
 * }
 * ```
 */
export const createHistoryManager = (
  options: { maxEntries?: number } = {},
): ImageEditorHistoryManager => {
  const { maxEntries = 100 } = options;

  const state = {
    entries: [] as ImageEditorHistoryEntry[],
    currentIndex: -1,
  };

  return {
    get entries() {
      return [...state.entries];
    },

    get currentIndex() {
      return state.currentIndex;
    },

    get maxEntries() {
      return maxEntries;
    },

    push(entry) {
      // Clear any redo entries
      if (state.currentIndex < state.entries.length - 1) {
        state.entries = state.entries.slice(0, state.currentIndex + 1);
      }

      // Add new entry
      const fullEntry: ImageEditorHistoryEntry = {
        ...entry,
        timestamp: Date.now(),
      };
      state.entries.push(fullEntry);
      state.currentIndex = state.entries.length - 1;

      // Trim if over max
      if (state.entries.length > maxEntries) {
        state.entries = state.entries.slice(-maxEntries);
        state.currentIndex = state.entries.length - 1;
      }
    },

    undo() {
      if (!this.canUndo()) return null;
      state.currentIndex--;
      return state.entries[state.currentIndex] ?? null;
    },

    redo() {
      if (!this.canRedo()) return null;
      state.currentIndex++;
      return state.entries[state.currentIndex] ?? null;
    },

    canUndo() {
      return state.currentIndex > 0;
    },

    canRedo() {
      return state.currentIndex < state.entries.length - 1;
    },

    clear() {
      state.entries = [];
      state.currentIndex = -1;
    },

    current() {
      return state.entries[state.currentIndex] ?? null;
    },
  };
};
//#endregion

//#region Convenience Functions
/**
 * Loads an image and returns it as a base64 data URL.
 * Useful for initializing the editor with a local or remote image.
 */
export const loadImageAsDataUrl = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`));
    };

    img.src = src;
  });
};

/**
 * Generates a description string for a filter operation.
 */
export const describeFilterOperation = (
  filterType: ImageEditorFilterType,
  settings: LfShapeeditorConfigSettings,
): string => {
  const descriptions: Record<
    string,
    (s: LfShapeeditorConfigSettings) => string
  > = {
    brightness: (s) =>
      `Brightness: ${((s["brightness_strength"] as number) ?? 0) > 0 ? "+" : ""}${Math.round(((s["brightness_strength"] as number) ?? 0) * 100)}%`,
    contrast: (s) =>
      `Contrast: ${((s["contrast_strength"] as number) ?? 0) > 0 ? "+" : ""}${Math.round(((s["contrast_strength"] as number) ?? 0) * 100)}%`,
    saturation: (s) =>
      `Saturation: ${Math.round(((s["saturation_intensity"] as number) ?? 1) * 100)}%`,
    gaussian_blur: (s) => `Blur: ${(s["gaussianBlur_sigma"] as number) ?? 0}px`,
    sepia: (s) =>
      `Sepia: ${Math.round(((s["sepia_intensity"] as number) ?? 0) * 100)}%`,
    vignette: (s) =>
      `Vignette: ${Math.round(((s["vignette_intensity"] as number) ?? 0) * 100)}%`,
    inpaint: () => "Inpaint masked area",
    outpaint: (s) => `Outpaint: +${(s["outpaint_amount"] as number) ?? 256}px`,
    resize_edge: (s) =>
      `Resize to ${(s["resize_edge_target"] as number) ?? 1024}px edge`,
    resize_free: (s) =>
      `Resize to ${(s["resize_free_width"] as number) ?? 832}×${(s["resize_free_height"] as number) ?? 1216}px`,
  };

  const describe = descriptions[filterType];
  if (describe) {
    return describe(settings);
  }

  // Fallback: just capitalize the filter type
  return filterType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};
//#endregion
