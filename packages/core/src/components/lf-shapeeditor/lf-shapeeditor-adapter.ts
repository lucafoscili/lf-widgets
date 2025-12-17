import {
  LF_SHAPEEDITOR_BLOCKS,
  LfMasonrySelectedShape,
  LfShapeeditorAdapter,
  LfShapeeditorAdapterControllerActions,
  LfShapeeditorAdapterControllerComputed,
  LfShapeeditorAdapterControllerGetters,
  LfShapeeditorAdapterControllerSetters,
  LfShapeeditorAdapterHandlers,
  LfShapeeditorAdapterJsx,
  LfShapeeditorAdapterRefs,
  LfShapeeditorBehavior,
  LfShapeeditorCommitTrigger,
  LfShapeeditorConfigSettings,
  LfShapeeditorControlConfig,
  LfShapeeditorHistory,
  LfShapeeditorLayout,
  LfShapeeditorProgressbarState,
  LfShapeeditorSnackbarState,
} from "@lf-widgets/foundations";
import { prepNavigation } from "./elements.navigation";
import { prepPreview } from "./elements.preview";
import { prepSettings } from "./elements.settings";
import { prepNavigationHandlers } from "./handlers.navigation";
import { prepPreviewHandlers } from "./handlers.preview";
import { prepSettingsHandlers } from "./handlers.settings";

//#region Types
/**
 * Initial state for lf-shapeeditor closure variables.
 * These values are captured at adapter creation time and owned by the adapter.
 */
export interface LfShapeeditorInitialState {
  currentShape: LfMasonrySelectedShape;
  history: LfShapeeditorHistory;
  historyIndex: number | null;
  isNavigationTreeOpen: boolean;
  isSpinnerActive: boolean;
  configControls: LfShapeeditorControlConfig[];
  configLayout: LfShapeeditorLayout | undefined;
  configSettings: LfShapeeditorConfigSettings;
  expandedSettingsGroups: string[];
  previewValue: string | null;
  progressbarState: LfShapeeditorProgressbarState;
  isHistoryPopupOpen: boolean;
  snackbarState: LfShapeeditorSnackbarState;
  resetKey: number;
  configBehavior: LfShapeeditorBehavior | undefined;
  configCommitTrigger: LfShapeeditorCommitTrigger | undefined;
  configShowApplyButton: boolean | undefined;
  configShowResetButton: boolean;
  configEnablePreview: boolean | undefined;
}

/**
 * Base getters that are passed in (not derived from closure state).
 * These read from the WC instance directly (blocks, framework, ids, etc.)
 */
export type LfShapeeditorBaseGetters = Pick<
  LfShapeeditorAdapterControllerGetters,
  | "blocks"
  | "compInstance"
  | "cyAttributes"
  | "framework"
  | "ids"
  | "lfAttributes"
  | "parts"
>;
//#endregion

/**
 * Creates the canonical adapter for lf-shapeeditor using "Adapter as Core" pattern.
 *
 * v4.0.0 + Section 5.9 Architecture:
 * - **Closure State**: All runtime state lives in adapter closure variables (19 states)
 * - **Single @State**: WC has only `_renderTick` - incremented by `onStateChange()`
 * - **Explicit Renders**: Only `onStateChange()` triggers re-render
 * - controller.get: Pure state reads from closure
 * - controller.set: Writes to closure + calls `onStateChange()`
 * - controller.computed: Derived values, predicates (pure functions)
 * - controller.actions: Multi-step operations (async ops, toggles)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (added by WC after creation)
 * - handlers: Event callbacks grouped by domain
 *
 * @see Section 5.9 of 4_0_0_REFACTORING.md ("Adapter as Core" Pattern)
 */
//#region Adapter
export const createAdapter = (
  baseGetters: LfShapeeditorBaseGetters,
  initialState: LfShapeeditorInitialState,
  onStateChange: () => void,
  getAdapter: () => LfShapeeditorAdapter,
): Omit<LfShapeeditorAdapter, "dispatcher"> => {
  // ═══════════════════════════════════════════════════════════════
  // CLOSURE STATE - The single source of truth (replaces @State)
  // 19 state variables moved from WC
  // ═══════════════════════════════════════════════════════════════
  let _currentShape: LfMasonrySelectedShape = initialState.currentShape;
  let _history: LfShapeeditorHistory = initialState.history;
  let _historyIndex: number | null = initialState.historyIndex;
  let _isNavigationTreeOpen: boolean = initialState.isNavigationTreeOpen;
  let _isSpinnerActive: boolean = initialState.isSpinnerActive;
  let _configControls: LfShapeeditorControlConfig[] =
    initialState.configControls;
  let _configLayout: LfShapeeditorLayout | undefined =
    initialState.configLayout;
  let _configSettings: LfShapeeditorConfigSettings =
    initialState.configSettings;
  let _expandedSettingsGroups: string[] = initialState.expandedSettingsGroups;
  let _previewValue: string | null = initialState.previewValue;
  let _progressbarState: LfShapeeditorProgressbarState =
    initialState.progressbarState;
  let _isHistoryPopupOpen: boolean = initialState.isHistoryPopupOpen;
  let _snackbarState: LfShapeeditorSnackbarState = initialState.snackbarState;
  let _resetKey: number = initialState.resetKey;
  let _configBehavior: LfShapeeditorBehavior | undefined =
    initialState.configBehavior;
  let _configCommitTrigger: LfShapeeditorCommitTrigger | undefined =
    initialState.configCommitTrigger;
  let _configShowApplyButton: boolean | undefined =
    initialState.configShowApplyButton;
  let _configShowResetButton: boolean = initialState.configShowResetButton;
  let _configEnablePreview: boolean | undefined =
    initialState.configEnablePreview;

  // ═══════════════════════════════════════════════════════════════
  // HELPER - Get selected shape value (moved from WC)
  // ═══════════════════════════════════════════════════════════════
  const getSelectedShapeValue = (
    selectedShape: LfMasonrySelectedShape,
  ): { shape: LfMasonrySelectedShape; value: string } | null => {
    const mgr = baseGetters.framework();
    const { data } = mgr;
    const { cell } = data;
    const { stringify } = cell;

    if (selectedShape?.index !== undefined) {
      const value =
        selectedShape.shape?.value || (selectedShape.shape as any)?.lfValue;
      return {
        shape: selectedShape,
        value: stringify(value),
      };
    }

    return null;
  };

  // ═══════════════════════════════════════════════════════════════
  // GETTERS - Read from closure
  // ═══════════════════════════════════════════════════════════════
  const getters: LfShapeeditorAdapterControllerGetters = {
    ...baseGetters,
    blocks: () => LF_SHAPEEDITOR_BLOCKS.shapeeditor,
    config: {
      behavior: () => _configBehavior,
      commitTrigger: () => _configCommitTrigger,
      controls: () => _configControls,
      enablePreview: () => _configEnablePreview,
      expandedGroups: () => _expandedSettingsGroups,
      layout: () => _configLayout,
      settings: () => _configSettings,
      showApplyButton: () => _configShowApplyButton,
      showResetButton: () => _configShowResetButton,
    },
    currentShape: () => getSelectedShapeValue(_currentShape),
    history: {
      current: () => _history[_currentShape?.index],
      full: () => _history,
      index: () => _historyIndex,
      isPopupOpen: () => _isHistoryPopupOpen,
    },
    navigation: {
      isTreeOpen: () => _isNavigationTreeOpen,
    },
    previewValue: () => _previewValue,
    progressbar: () => _progressbarState,
    resetKey: () => _resetKey,
    snackbar: () => _snackbarState,
    spinnerStatus: () => _isSpinnerActive,
  };

  // ═══════════════════════════════════════════════════════════════
  // SETTERS - Write to closure + trigger re-render
  // ═══════════════════════════════════════════════════════════════
  const setters: LfShapeeditorAdapterControllerSetters = {
    config: {
      behavior: (behavior?: LfShapeeditorBehavior) => {
        _configBehavior = behavior;
        onStateChange();
      },
      commitTrigger: (trigger?: LfShapeeditorCommitTrigger) => {
        _configCommitTrigger = trigger;
        onStateChange();
      },
      controls: (controls: LfShapeeditorControlConfig[]) => {
        _configControls = controls || [];
        onStateChange();
      },
      enablePreview: (enable?: boolean) => {
        _configEnablePreview = enable;
        onStateChange();
      },
      expandedGroups: (groups: string[]) => {
        _expandedSettingsGroups = groups || [];
        onStateChange();
      },
      layout: (layout?: LfShapeeditorLayout) => {
        _configLayout = layout;
        onStateChange();
      },
      settings: (settings: LfShapeeditorConfigSettings) => {
        _configSettings = { ...(settings || {}) };
        onStateChange();
      },
      showApplyButton: (show?: boolean) => {
        _configShowApplyButton = show;
        onStateChange();
      },
      showResetButton: (show?: boolean) => {
        _configShowResetButton = show;
        onStateChange();
      },
    },
    currentShape: (node: LfMasonrySelectedShape) => {
      _currentShape = node;
      onStateChange();
    },
    history: {
      index: (index: number) => {
        _historyIndex = index;
        onStateChange();
      },
      isPopupOpen: (open: boolean) => {
        _isHistoryPopupOpen = open;
        onStateChange();
      },
    },
    navigation: {
      isTreeOpen: (open: boolean) => {
        _isNavigationTreeOpen = open;
        onStateChange();
      },
    },
    previewValue: (value: string | null) => {
      _previewValue = value;
      onStateChange();
    },
    progressbar: (state: Partial<LfShapeeditorProgressbarState>) => {
      _progressbarState = { ..._progressbarState, ...state };
      onStateChange();
    },
    snackbar: (state: Partial<LfShapeeditorSnackbarState>) => {
      _snackbarState = { ..._snackbarState, ...state };
      onStateChange();
    },
    spinnerStatus: (active: boolean) => {
      _isSpinnerActive = active;
      // Also update the spinner component ref if available
      const adapter = getAdapter();
      if (adapter?.elements?.refs?.preview?.spinner) {
        adapter.elements.refs.preview.spinner.lfActive = active;
      }
      onStateChange();
    },
  };

  // ═══════════════════════════════════════════════════════════════
  // COMPUTED - Derived values (pure functions)
  // ═══════════════════════════════════════════════════════════════
  const computed: LfShapeeditorAdapterControllerComputed = {
    history: {
      currentSnapshot: () => {
        if (_historyIndex === null) {
          return null;
        }

        const snapshot = _history[_currentShape?.index]?.[_historyIndex];
        if (!snapshot) {
          return null;
        }

        return getSelectedShapeValue(snapshot);
      },
    },
    navigation: {
      hasNav: () => {
        const comp = baseGetters.compInstance();
        return Boolean(comp?.lfNavigation?.treeProps?.lfDataset);
      },
    },
  };

  // ═══════════════════════════════════════════════════════════════
  // ACTIONS - Multi-step operations
  // ═══════════════════════════════════════════════════════════════
  const actions: LfShapeeditorAdapterControllerActions = {
    history: {
      new: (selectedShape: LfMasonrySelectedShape, isSnapshot = false) => {
        const historyByIndex = _history?.[selectedShape.index] || [];

        if (_historyIndex < historyByIndex.length - 1) {
          historyByIndex.splice(_historyIndex + 1);
        }

        if (historyByIndex?.length && !isSnapshot) {
          historyByIndex[0] = selectedShape;
          onStateChange();
          return;
        }

        historyByIndex.push(selectedShape);
        _history[selectedShape.index] = historyByIndex;
        _historyIndex = historyByIndex.length - 1;
        onStateChange();
      },
      pop: (index?: number) => {
        if (index !== null && index !== undefined) {
          _history[index] = [_history[index]?.[0]].filter(Boolean);
          if (_historyIndex === 0) {
            // Force refresh by toggling state
            onStateChange();
          } else {
            _historyIndex = 0;
            onStateChange();
          }
        } else {
          _history = {};
          _historyIndex = null;
          onStateChange();
        }
      },
      toggle: () => {
        _isHistoryPopupOpen = !_isHistoryPopupOpen;
        onStateChange();
      },
    },
    navigation: {
      toggle: () => {
        _isNavigationTreeOpen = !_isNavigationTreeOpen;
        onStateChange();
      },
    },
    incrementResetKey: () => {
      _resetKey++;
      onStateChange();
    },
  };

  return {
    controller: {
      get: getters,
      set: setters,
      computed,
      actions,
    },
    elements: {
      jsx: createElementsJsx(getAdapter),
      refs: createRefs(),
    },
    handlers: createHandlers(getAdapter),
  };
};
//#endregion

//#region Elements
export const createElementsJsx = (
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapterJsx => {
  return {
    navigation: prepNavigation(getAdapter),
    preview: prepPreview(getAdapter),
    settings: prepSettings(getAdapter),
  };
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapterHandlers => {
  return {
    navigation: prepNavigationHandlers(getAdapter),
    preview: prepPreviewHandlers(getAdapter),
    settings: prepSettingsHandlers(getAdapter),
  };
};
//#endregion

//#region Refs
export const createRefs = (): LfShapeeditorAdapterRefs => {
  return {
    navigation: {
      explorer: {
        tree: null,
        expander: null,
      },
      jump: {
        textfield: null,
        load: null,
      },
      masonry: null,
    },
    preview: {
      history: {
        list: null,
      },
      shape: null,
      spinner: null,
    },
    settings: {
      actions: {
        delete: null,
        badge: null,
        clear: null,
        redo: null,
        undo: null,
        commit: null,
      },
      progressbar: null,
      tree: null,
      controls: {
        snackbar: null,
        items: {
          accordion: null,
          infoIcons: new Map<string, HTMLElement>(),
        },
        controlActions: {
          apply: null,
          reset: null,
        },
      },
    },
  };
};
//#endregion
