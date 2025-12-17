import {
  LfDataShapesMap,
  LfMasonryAdapter,
  LfMasonryAdapterControllerGetters,
  LfMasonryAdapterControllerSetters,
  LfMasonryAdapterHandlers,
  LfMasonryAdapterJsx,
  LfMasonryAdapterRefs,
  LfMasonrySelectedShape,
  LfMasonryView,
} from "@lf-widgets/foundations";
import { createActions } from "./actions.masonry";
import { createComputed } from "./computed.masonry";
import { prepControls } from "./elements.controls";
import { controlsHandlers } from "./handlers.controls";

/**
 * Initial state for the masonry adapter.
 */
export interface LfMasonryAdapterInitialState {
  selectedShape?: LfMasonrySelectedShape;
  shapes?: LfDataShapesMap;
  viewportWidth?: number;
}

/**
 * Creates the canonical adapter for lf-masonry.
 *
 * "Adapter as Core" Architecture:
 * - Adapter OWNS the runtime state (not the WC)
 * - State is stored in closure variables (e.g., `_selectedShape`, `_shapes`)
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
 * @param baseGetters - Base getters from createBaseGetters utility (excluding state getters)
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
    LfMasonryAdapterControllerGetters,
    "selectedIndex" | "selectedShape" | "shapes" | "viewportWidth"
  >,
  initialState: LfMasonryAdapterInitialState,
  onStateChange: () => void,
  getAdapter: () => LfMasonryAdapter,
): Omit<LfMasonryAdapter, "dispatcher"> => {
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL STATE (replaces @State in WC)
  // These closure variables ARE the single source of truth for component state
  // ═══════════════════════════════════════════════════════════════════════════
  let _selectedShape: LfMasonrySelectedShape = initialState.selectedShape ?? {};
  let _shapes: LfDataShapesMap = initialState.shapes ?? {};
  let _viewportWidth: number = initialState.viewportWidth ?? 0;

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE GETTERS - Read from closure
  // ═══════════════════════════════════════════════════════════════════════════
  const getters: LfMasonryAdapterControllerGetters = {
    ...baseGetters,
    selectedIndex: () => _selectedShape?.index,
    selectedShape: () => _selectedShape,
    shapes: () => _shapes,
    viewportWidth: () => _viewportWidth,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE SETTERS - Write to closure + trigger render
  // ═══════════════════════════════════════════════════════════════════════════
  const setters: LfMasonryAdapterControllerSetters = {
    selectedIndex: (index: number | undefined) => {
      if (index !== undefined) {
        const comp = baseGetters.compInstance();
        const shape = _shapes?.[comp.lfShape]?.[index];
        _selectedShape = shape ? { index, shape } : {};
      } else {
        _selectedShape = {};
      }
      onStateChange();
    },
    selectedShape: (shape: LfMasonrySelectedShape) => {
      _selectedShape = shape;
      onStateChange();
    },
    shapes: (shapes: LfDataShapesMap) => {
      _shapes = shapes;
      onStateChange();
    },
    view: (view: LfMasonryView) => {
      const comp = baseGetters.compInstance();
      comp.lfView = view;
      onStateChange();
    },
    viewportWidth: (width: number) => {
      _viewportWidth = width;
      onStateChange();
    },
  };

  return {
    controller: {
      get: getters,
      set: setters,
      computed: createComputed(getters),
      actions: createActions(getAdapter),
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
const createJsx = (getAdapter: () => LfMasonryAdapter): LfMasonryAdapterJsx => {
  return prepControls(getAdapter);
};
//#endregion

//#region Handlers
const createHandlers = (
  getAdapter: () => LfMasonryAdapter,
): LfMasonryAdapterHandlers => {
  return controlsHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_MASONRY_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
const createRefs = (): LfMasonryAdapterRefs => {
  return {
    addColumn: null,
    changeView: null,
    masonry: null,
    removeColumn: null,
    shapes: new Map<string, HTMLElement>(),
  };
};
//#endregion
