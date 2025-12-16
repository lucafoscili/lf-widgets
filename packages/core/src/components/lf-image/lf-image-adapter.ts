import {
  LfImageAdapter,
  LfImageAdapterControllerGetters,
  LfImageAdapterControllerSetters,
  LfImageAdapterHandlers,
  LfImageAdapterJsx,
  LfImageAdapterRefs,
} from "@lf-widgets/foundations";
import { prepImageActions } from "./actions.image";
import { prepImageComputed } from "./computed.image";
import { prepImageJsx } from "./elements.image";
import { prepImageHandlers } from "./handlers.image";

/**
 * Initial state values for lf-image adapter.
 */
export interface LfImageAdapterInitialState {
  error: boolean;
  imageRef: HTMLImageElement | SVGElement | null;
  isLoaded: boolean;
  resolvedFor: string | undefined;
  resolvedSpriteName: string | undefined;
}

/**
 * Creates the canonical adapter for lf-image.
 *
 * "Adapter as Core" Architecture:
 * - Adapter OWNS the runtime state (not the WC)
 * - State is stored in closure variables (e.g., `_error`, `_isLoaded`)
 * - `controller.get.*` reads from closure state
 * - `controller.set.*` writes to closure state AND calls `onStateChange()`
 * - `onStateChange` signals WC to increment its single `@State _renderTick`
 * - WC becomes a thin shell: lifecycle + HTML attribute interface + single render trigger
 *
 * Benefits:
 * - Predictable renders (explicit via onStateChange)
 * - Testable (adapter can be tested without DOM)
 * - Portable (adapter works with any renderer)
 * - Batch-friendly (actions can make multiple changes before calling onStateChange once)
 *
 * @param baseGetters - Base getters from createBaseGetters utility
 * @param initialState - Initial state values
 * @param onStateChange - Callback to trigger WC re-render (increments _renderTick)
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Complete adapter (without dispatcher - added by WC)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter Factory
export const createAdapter = (
  baseGetters: Omit<
    LfImageAdapterControllerGetters,
    "error" | "imageRef" | "isLoaded" | "resolvedFor" | "resolvedSpriteName"
  >,
  initialState: LfImageAdapterInitialState,
  onStateChange: () => void,
  getAdapter: () => LfImageAdapter,
): Omit<LfImageAdapter, "dispatcher"> => {
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL STATE (replaces @State in WC)
  // These closure variables ARE the single source of truth for image state
  // ═══════════════════════════════════════════════════════════════════════════
  let _error: boolean = initialState.error;
  let _imageRef: HTMLImageElement | SVGElement | null = initialState.imageRef;
  let _isLoaded: boolean = initialState.isLoaded;
  let _resolvedFor: string | undefined = initialState.resolvedFor;
  let _resolvedSpriteName: string | undefined = initialState.resolvedSpriteName;

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE GETTERS - Read from closure
  // ═══════════════════════════════════════════════════════════════════════════
  const getters: LfImageAdapterControllerGetters = {
    ...baseGetters,
    error: () => _error,
    imageRef: () => _imageRef,
    isLoaded: () => _isLoaded,
    resolvedFor: () => _resolvedFor,
    resolvedSpriteName: () => _resolvedSpriteName,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE SETTERS - Write to closure + trigger render
  // ═══════════════════════════════════════════════════════════════════════════
  const setters: LfImageAdapterControllerSetters = {
    error: (value: boolean) => {
      if (_error !== value) {
        _error = value;
        onStateChange();
      }
    },
    imageRef: (el: HTMLImageElement | SVGElement | null) => {
      // imageRef doesn't trigger re-render as it's just a reference
      _imageRef = el;
    },
    isLoaded: (value: boolean) => {
      if (_isLoaded !== value) {
        _isLoaded = value;
        onStateChange();
      }
    },
    resolvedFor: (value: string | undefined) => {
      // resolvedFor is internal tracking, doesn't need to trigger render
      _resolvedFor = value;
    },
    resolvedSpriteName: (value: string | undefined) => {
      if (_resolvedSpriteName !== value) {
        _resolvedSpriteName = value;
        onStateChange();
      }
    },
  };

  return {
    controller: {
      get: getters,
      set: setters,
      computed: prepImageComputed(getAdapter),
      actions: prepImageActions(getAdapter),
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
