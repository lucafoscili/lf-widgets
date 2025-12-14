import { LfIconType } from "../foundations";
import {
  LfComponentAdapter,
  LfComponentAdapterBaseGetters,
  LfComponentAdapterDispatchDetail,
  LfComponentAdapterDispatcher,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
  LfComponentAdapterSetters,
} from "../foundations/adapter.declarations";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset, LfDataShapes } from "../framework/data.declarations";
import { LfThemeUIState } from "../framework/theme.declarations";
import { LfAccordionEventPayload } from "./accordion.declarations";
import { LfButtonElement, LfButtonEventPayload } from "./button.declarations";
import { LfListElement, LfListEventPayload } from "./list.declarations";
import {
  LfMasonryElement,
  LfMasonryEventPayload,
  LfMasonrySelectedShape,
} from "./masonry.declarations";
import { LfProgressbarElement } from "./progressbar.declarations";
import {
  LF_SHAPEEDITOR_BLOCKS,
  LF_SHAPEEDITOR_EVENTS,
  LF_SHAPEEDITOR_IDS,
  LF_SHAPEEDITOR_PARTS,
} from "./shapeeditor.constants";
import { LfSnackbarElement } from "./snackbar.declarations";
import { LfSpinnerElement } from "./spinner.declarations";
import {
  LfTextfieldElement,
  LfTextfieldEventPayload,
} from "./textfield.declarations";
import {
  LfTreeElement,
  LfTreeEventPayload,
  LfTreePropsInterface,
} from "./tree.declarations";

//#region Class
/**
 * Primary interface implemented by the `lf-shapeeditor` component.
 * A universal 3-panel interactive explorer that transforms any LfShape type
 * into an explorable, configurable, and previewable experience.
 */
export interface LfShapeeditorInterface
  extends LfComponent<"LfShapeeditor">,
    LfShapeeditorPropsInterface {
  addSnapshot: (props: Record<string, unknown>) => Promise<void>;
  clearHistory: (index?: number) => Promise<void>;
  clearSelection: () => Promise<void>;
  getComponents: () => Promise<LfShapeeditorAdapterRefs>;
  getCurrentSnapshot: () => Promise<{
    shape: LfMasonrySelectedShape;
    value: string;
  }>;
  getDsl: () => Promise<LfShapeeditorConfigDsl | null>;
  getSettings: () => Promise<LfShapeeditorConfigSettings>;
  getShapeElement: () => Promise<Element | null>;
  reset: () => Promise<void>;
  resetControls: () => Promise<void>;
  setPreviewValue: (value: string | null) => Promise<void>;
  setProgressbar: (
    state: Partial<LfShapeeditorProgressbarState>,
  ) => Promise<void>;
  setSettings: (
    settings: LfShapeeditorConfigSettings,
    replace?: boolean,
  ) => Promise<void>;
  setSnackbar: (state: Partial<LfShapeeditorSnackbarState>) => Promise<void>;
  setSpinnerStatus: (status: boolean) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-shapeeditor`.
 */
export interface LfShapeeditorElement
  extends HTMLStencilElement,
    Omit<LfShapeeditorInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-shapeeditor` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + component state
 * - controller.set: Simple assignments (config, history, navigation, etc.)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks grouped by panel
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfShapeeditorAdapter
  extends LfComponentAdapter<
    LfShapeeditorInterface,
    LfShapeeditorEventPayload,
    LfShapeeditorAdapterHandlers,
    LfShapeeditorAdapterJsx,
    LfShapeeditorAdapterRefs,
    LfShapeeditorAdapterControllerGetters,
    LfShapeeditorAdapterControllerSetters
  > {
  controller: {
    get: LfShapeeditorAdapterControllerGetters;
    set: LfShapeeditorAdapterControllerSetters;
  };
  dispatcher: LfShapeeditorAdapterDispatcher;
  elements: {
    jsx: LfShapeeditorAdapterJsx;
    refs: LfShapeeditorAdapterRefs;
  };
  handlers: LfShapeeditorAdapterHandlers;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 * Organized by DOM block hierarchy.
 */
export interface LfShapeeditorAdapterJsx extends LfComponentAdapterJsx {
  /** Navigation panel JSX */
  navigation: {
    /** Explorer sub-block containing tree and expander */
    explorer: () => VNode;
    /** Jump sub-block containing textfield and load button */
    jump: () => VNode;
    /** Masonry gallery */
    masonry: () => VNode;
  };
  /** Preview panel JSX */
  preview: {
    /** History sidebar with snapshot list */
    history: () => VNode;
    /** Shape display area */
    shape: () => VNode;
    /** Loading spinner overlay */
    spinner: () => VNode;
  };
  /** Settings panel JSX */
  settings: {
    /** Actions bar with history controls */
    actions: () => VNode;
    /** Controls container with snackbar, items, and control actions */
    controls: () => VNode;
    /** Progress bar overlay */
    progressbar: () => VNode;
    /** Settings tree (DSL selector) */
    tree: () => VNode;
  };
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Mirrors the DOM hierarchy for lower cognitive load.
 */
export interface LfShapeeditorAdapterRefs extends LfComponentAdapterRefs {
  /** Navigation panel refs */
  navigation: {
    /** Explorer sub-block refs */
    explorer: {
      /** Navigation tree component */
      tree: LfTreeElement;
      /** Tree toggle button */
      expander: LfButtonElement;
    };
    /** Jump sub-block refs */
    jump: {
      /** Directory path input */
      textfield: LfTextfieldElement;
      /** Load button */
      load: LfButtonElement;
    };
    /** Masonry gallery component */
    masonry: LfMasonryElement;
  };
  /** Preview panel refs */
  preview: {
    /** History sub-block refs */
    history: {
      /** History list component */
      list: LfListElement;
    };
    /** Shape container element */
    shape: HTMLElement;
    /** Spinner component */
    spinner: LfSpinnerElement;
  };
  /** Settings panel refs */
  settings: {
    /** Actions sub-block refs */
    actions: {
      /** Delete shape button */
      delete: LfButtonElement;
      /** History toggle button */
      badge: LfButtonElement;
      /** Clear history button */
      clear: LfButtonElement;
      /** Redo button */
      redo: LfButtonElement;
      /** Undo button */
      undo: LfButtonElement;
      /** Commit/save button */
      commit: LfButtonElement;
    };
    /** Progress bar component */
    progressbar: LfProgressbarElement;
    /** Settings tree component */
    tree: LfTreeElement;
    /** Controls sub-block refs */
    controls: {
      /** Snackbar notification component */
      snackbar: LfSnackbarElement;
      /** Items sub-block refs */
      items: {
        /** Accordion component for grouped controls */
        accordion: HTMLElement;
        /** Info icons map for tooltips */
        infoIcons: Map<string, HTMLElement>;
      };
      /** Control actions sub-block refs */
      controlActions: {
        /** Apply button */
        apply: LfButtonElement;
        /** Reset button */
        reset: LfButtonElement;
      };
    };
  };
}
/**
 * Handler map consumed by the adapter to react to framework events.
 * Organized by panel/block.
 */
export interface LfShapeeditorAdapterHandlers
  extends LfComponentAdapterHandlers {
  /** Navigation panel handlers */
  navigation: {
    /** Explorer button handler (expander) */
    expander: (e: CustomEvent<LfButtonEventPayload>) => Promise<void>;
    /** Jump button handler (load) */
    load: (e: CustomEvent<LfButtonEventPayload>) => Promise<void>;
    /** Masonry selection handler */
    masonry: (e: CustomEvent<LfMasonryEventPayload>) => void;
    /** Textfield input handler */
    textfield: (e: CustomEvent<LfTextfieldEventPayload>) => void;
    /** Tree navigation handler */
    tree: (e: CustomEvent<LfTreeEventPayload>) => void;
  };
  /** Preview panel handlers */
  preview: {
    /** History list handler */
    historyList: (e: CustomEvent<LfListEventPayload>) => Promise<void>;
    /** Shape event handler */
    shape: (e: CustomEvent) => void;
  };
  /** Settings panel handlers */
  settings: {
    /** Actions button handler */
    actionsButton: (e: CustomEvent<LfButtonEventPayload>) => Promise<void>;
    /** Settings tree handler */
    tree: (e: CustomEvent<LfTreeEventPayload>) => void;
    /** Accordion toggle handler */
    accordionToggle: (e: CustomEvent<LfAccordionEventPayload>) => Promise<void>;
    /** Control change handler (internal - called by type-specific handlers) */
    controlChange: (
      e: CustomEvent | Event,
      controlId: string,
      value: unknown,
      eventType: LfShapeeditorControlEventType,
    ) => void;
    /** Control actions button handler */
    controlActionsButton: (
      e: CustomEvent<LfButtonEventPayload>,
    ) => Promise<void>;
    /** Control-specific handlers by type */
    controls: {
      checkbox: (e: CustomEvent, controlId: string) => void;
      colorpicker: (e: CustomEvent, controlId: string) => void;
      multiinput: (e: CustomEvent, controlId: string) => void;
      number: (e: CustomEvent, controlId: string) => void;
      select: (e: CustomEvent, controlId: string) => void;
      slider: (e: CustomEvent, controlId: string) => void;
      textfield: (e: CustomEvent, controlId: string) => void;
      toggle: (e: CustomEvent, controlId: string) => void;
    };
  };
}
/**
 * Read-only controller surface exposed by the adapter for integration code.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfShapeeditorAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfShapeeditorInterface,
    (typeof LF_SHAPEEDITOR_BLOCKS)["shapeeditor"],
    (typeof LF_SHAPEEDITOR_IDS)["shapeeditor"],
    (typeof LF_SHAPEEDITOR_PARTS)["shapeeditor"]
  > {
  /** Configuration state reads */
  config: {
    behavior: () => LfShapeeditorBehavior | undefined;
    commitTrigger: () => LfShapeeditorCommitTrigger | undefined;
    controls: () => LfShapeeditorControlConfig[];
    enablePreview: () => boolean | undefined;
    expandedGroups: () => string[];
    layout: () => LfShapeeditorLayout | undefined;
    settings: () => LfShapeeditorConfigSettings;
    showApplyButton: () => boolean | undefined;
    showResetButton: () => boolean | undefined;
  };
  /** Current shape being edited */
  currentShape: () => { shape: LfMasonrySelectedShape; value: string };
  /** History state reads */
  history: {
    current: () => LfMasonrySelectedShape[];
    currentSnapshot: () => {
      shape: LfMasonrySelectedShape;
      value: string;
    };
    full: () => LfShapeeditorHistory;
    index: () => number;
    isPopupOpen: () => boolean;
  };
  /** Navigation panel state reads */
  navigation: { hasNav: () => boolean; isTreeOpen: () => boolean };
  /** Preview panel value */
  previewValue: () => string | null;
  /** Progress bar state */
  progressbar: () => LfShapeeditorProgressbarState;
  /** Key for forcing re-renders */
  resetKey: () => number;
  /** Snackbar notification state */
  snackbar: () => LfShapeeditorSnackbarState;
  /** Spinner visibility */
  spinnerStatus: () => boolean;
}
/**
 * Imperative controller callbacks exposed by the adapter.
 */
export interface LfShapeeditorAdapterControllerSetters
  extends LfComponentAdapterSetters {
  config: {
    behavior: (behavior?: LfShapeeditorBehavior) => void;
    commitTrigger: (trigger?: LfShapeeditorCommitTrigger) => void;
    controls: (controls: LfShapeeditorControlConfig[]) => void;
    enablePreview: (enable?: boolean) => void;
    expandedGroups: (groups: string[]) => void;
    layout: (layout?: LfShapeeditorLayout) => void;
    settings: (settings: LfShapeeditorConfigSettings) => void;
    showApplyButton: (show?: boolean) => void;
    showResetButton: (show?: boolean) => void;
  };
  currentShape: (node: LfMasonrySelectedShape) => void;
  history: {
    index: (index: number) => void;
    new: (shape: LfMasonrySelectedShape, isSnapshot?: boolean) => void;
    pop: (index?: number) => void;
    togglePopup: () => void;
  };
  navigation: { isTreeOpen: (open: boolean) => void; toggleTree: () => void };
  previewValue: (value: string | null) => void;
  progressbar: (state: Partial<LfShapeeditorProgressbarState>) => void;
  resetKey: () => void;
  snackbar: (state: Partial<LfShapeeditorSnackbarState>) => void;
  spinnerStatus: (active: boolean) => void;
}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-shapeeditor`.
 */
export type LfShapeeditorEvent = (typeof LF_SHAPEEDITOR_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-shapeeditor` events.
 */
export interface LfShapeeditorEventPayload
  extends LfEventPayload<"LfShapeeditor", LfShapeeditorEvent> {}
//#endregion

//#region Dispatcher
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfShapeeditorAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfShapeeditorEventPayload>;
export type LfShapeeditorAdapterDispatcherDetailOverrides = {
  [E in LfShapeeditorEvent]: E extends "lf-event"
    ? LfShapeeditorAdapterDispatchDetailBase & {
        originalEvent: CustomEvent;
      }
    : E extends "ready" | "unmount"
      ? Omit<LfShapeeditorAdapterDispatchDetailBase, "originalEvent"> & {
          originalEvent?: never;
        }
      : LfShapeeditorAdapterDispatchDetailBase;
};
export type LfShapeeditorAdapterDispatcher = LfComponentAdapterDispatcher<
  LfShapeeditorEventPayload,
  LfShapeeditorAdapterDispatcherDetailOverrides
>;
//#endregion

//#region State
/**
 * History snapshot maintained by the component to enable undo/redo flows.
 */
export type LfShapeeditorHistory = {
  [index: number]: Array<LfMasonrySelectedShape>;
};

/**
 * Event type discriminator for control interactions.
 * - `input`: Real-time changes during interaction (e.g., sliding a slider)
 * - `change`: Value commit on interaction end (e.g., mouse release after slider drag)
 */
export type LfShapeeditorControlEventType = "input" | "change";

/**
 * State for the inline snackbar notification.
 */
export interface LfShapeeditorSnackbarState {
  message: string;
  uiState: LfThemeUIState;
  visible: boolean;
}

/**
 * State for the absolute-positioned progress bar.
 */
export interface LfShapeeditorProgressbarState {
  uiState: LfThemeUIState;
  value: number;
  visible: boolean;
}

/**
 * Primitive value supported by shapeeditor configuration controls.
 */
export type LfShapeeditorControlValue = string | number | boolean;

/**
 * Settings map for a configuration context, keyed by control id.
 */
export type LfShapeeditorConfigSettings = Record<
  string,
  LfShapeeditorControlValue
>;

/**
 * Control types supported in shapeeditor configuration panels.
 */
export type LfShapeeditorControlType =
  | "checkbox"
  | "colorpicker"
  | "multiinput"
  | "number"
  | "select"
  | "slider"
  | "textfield"
  | "toggle";

/**
 * Base configuration for a shapeeditor control.
 */
export interface LfShapeeditorControlConfigBase<
  T extends LfShapeeditorControlType,
> {
  /** Unique control identifier. */
  id: string;
  /** Control type discriminator. */
  type: T;
  /** Display label for the control. */
  label: string;
  /** Optional description/tooltip for the control. */
  description?: string;
}

/**
 * Checkbox control configuration.
 */
export interface LfShapeeditorCheckboxConfig
  extends LfShapeeditorControlConfigBase<"checkbox"> {
  defaultValue: boolean;
}

/**
 * Multiinput control configuration.
 */
export interface LfShapeeditorMultiinputConfig
  extends LfShapeeditorControlConfigBase<"multiinput"> {
  defaultValue: string;
  placeholder?: string;
}

/**
 * Slider control configuration.
 */
export interface LfShapeeditorSliderConfig
  extends LfShapeeditorControlConfigBase<"slider"> {
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  /** Optional unit suffix (e.g., "px", "%", "ms"). */
  unit?: string;
}

/**
 * Toggle control configuration.
 */
export interface LfShapeeditorToggleConfig
  extends LfShapeeditorControlConfigBase<"toggle"> {
  defaultValue: boolean;
}

/**
 * Textfield control configuration.
 */
export interface LfShapeeditorTextfieldConfig
  extends LfShapeeditorControlConfigBase<"textfield"> {
  defaultValue: string;
  placeholder?: string;
  pattern?: string;
}

/**
 * Colorpicker control configuration.
 */
export interface LfShapeeditorColorpickerConfig
  extends LfShapeeditorControlConfigBase<"colorpicker"> {
  defaultValue: string;
  swatches?: string[];
}

/**
 * Select control configuration.
 */
export interface LfShapeeditorSelectConfig
  extends LfShapeeditorControlConfigBase<"select"> {
  options: Array<{ value: string; label: string }>;
  defaultValue: string;
}

/**
 * Number control configuration.
 */
export interface LfShapeeditorNumberConfig
  extends LfShapeeditorControlConfigBase<"number"> {
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number;
}

/**
 * Union of all control configurations.
 */
export type LfShapeeditorControlConfig =
  | LfShapeeditorCheckboxConfig
  | LfShapeeditorColorpickerConfig
  | LfShapeeditorMultiinputConfig
  | LfShapeeditorNumberConfig
  | LfShapeeditorSelectConfig
  | LfShapeeditorSliderConfig
  | LfShapeeditorTextfieldConfig
  | LfShapeeditorToggleConfig;

/**
 * Layout group used to organise configuration controls into accordion sections.
 */
export interface LfShapeeditorLayoutGroup {
  id: string;
  label: string;
  icon?: LfIconType;
  controlIds: string[];
}

/**
 * Standalone control reference - renders a single control without accordion wrapper.
 * Use this for controls that should appear outside of grouped sections.
 */
export interface LfShapeeditorLayoutControl {
  /** The ID of the control to render standalone */
  controlId: string;
}

/**
 * Layout item - either a group (accordion section) or a standalone control.
 * Items are rendered in array order, allowing flexible mixing of groups and standalone controls.
 */
export type LfShapeeditorLayoutItem =
  | LfShapeeditorLayoutGroup
  | LfShapeeditorLayoutControl;

/**
 * Type guard to check if a layout item is a group (accordion section).
 */
export const isLayoutGroup = (
  item: LfShapeeditorLayoutItem,
): item is LfShapeeditorLayoutGroup => "controlIds" in item;

/**
 * Type guard to check if a layout item is a standalone control.
 */
export const isLayoutControl = (
  item: LfShapeeditorLayoutItem,
): item is LfShapeeditorLayoutControl =>
  "controlId" in item && !("controlIds" in item);

/**
 * Linear layout definition for the configuration panel.
 * Supports mixed groups (accordion sections) and standalone controls.
 *
 * @example
 * ```typescript
 * const layout: LfShapeeditorLayout = [
 *   { controlId: "effect_enabled" },  // standalone toggle at top
 *   { id: "appearance", label: "Appearance", controlIds: ["color", "opacity"] },
 *   { controlId: "advanced_mode" },   // standalone toggle between groups
 *   { id: "animation", label: "Animation", controlIds: ["duration", "easing"] },
 * ];
 * ```
 */
export type LfShapeeditorLayout = LfShapeeditorLayoutItem[];

/**
 * Internal render item used by the settings panel to process layout configuration.
 * Either a group (accordion section) or a standalone control.
 */
export type LfShapeeditorLayoutRenderItem =
  | {
      type: "group";
      group: LfShapeeditorLayoutGroup;
      controls: LfShapeeditorControlConfig[];
    }
  | { type: "control"; control: LfShapeeditorControlConfig };

/**
 * Internal render segment used by the settings panel for grouping consecutive accordion sections.
 * Standalone controls break accordion continuity and are rendered separately.
 */
export type LfShapeeditorRenderSegment =
  | { type: "standalone"; control: LfShapeeditorControlConfig }
  | {
      type: "accordion";
      groups: Array<{
        group: LfShapeeditorLayoutGroup;
        controls: LfShapeeditorControlConfig[];
      }>;
    };

//#region Behavioral Semantics
/**
 * Declares the default preview/commit semantics for a DSL configuration.
 * This is CONSUMER-FACING metadata - shapeeditor emits events but does not interpret behaviors.
 *
 * - `live`: Control events drive preview/commit. Preview on input, commit on change.
 *   Example: brightness slider, vignette intensity.
 *
 * - `configure`: Controls are configuration-only; another trigger commits.
 *   The `commitTrigger` field specifies what event triggers the commit.
 *   Example: brush (stroke ends → commit), inpaint (stroke ends → API → commit).
 *
 * - `manual`: No auto-preview/commit; requires explicit Apply button click.
 *   Example: resize, background remover.
 */
export type LfShapeeditorBehavior = "live" | "configure" | "manual";

/**
 * Declares what event triggers a commit for "configure" behaviors.
 * References events that bubble through the `lf-event` event type.
 */
export interface LfShapeeditorCommitTrigger {
  /**
   * The source component type that emits the trigger.
   * - `shape`: The preview shape component (canvas, image, chart, etc.)
   * - `control`: A specific control in the config panel
   * - `button`: A button element (typically Apply)
   */
  source: "shape" | "control" | "button";

  /**
   * The event type from the source component that triggers a commit.
   * For canvas: "stroke" (brush up), "clear", etc.
   * For controls: "change"
   * For button: "click"
   */
  eventType: string;

  /**
   * Optional: specific event property to match for disambiguation.
   * Example: { key: "id", value: "apply-btn" }
   */
  match?: { key: string; value: string };
}

/**
 * Type guard to check if a DSL has a commit trigger defined.
 */
export const hasCommitTrigger = (
  dsl: LfShapeeditorConfigDsl,
): dsl is LfShapeeditorConfigDsl & {
  commitTrigger: LfShapeeditorCommitTrigger;
} => dsl.commitTrigger !== undefined;
//#endregion

//#region Configuration DSL
/**
 * Shapeeditor-agnostic configuration DSL.
 * Consumers provide control definitions, optional layout, defaults, and behavioral metadata.
 *
 * The behavioral metadata (`behavior`, `commitTrigger`, `showApplyButton`, `enablePreview`)
 * is CONSUMER-FACING - the shapeeditor component does NOT interpret these values.
 * Instead, consumers use them to decide how to handle shapeeditor events.
 *
 * @example
 * ```typescript
 * // Live behavior: preview on input, commit on change
 * const brightnessDsl: LfShapeeditorConfigDsl = {
 *   controls: [...],
 *   behavior: "live",
 *   enablePreview: true,
 * };
 *
 * // Configure behavior: controls are config, stroke triggers commit
 * const brushDsl: LfShapeeditorConfigDsl = {
 *   controls: [...],
 *   behavior: "configure",
 *   commitTrigger: { source: "shape", eventType: "stroke" },
 * };
 *
 * // Manual behavior: no auto-preview, requires Apply button
 * const resizeDsl: LfShapeeditorConfigDsl = {
 *   controls: [...],
 *   behavior: "manual",
 *   showApplyButton: true,
 *   enablePreview: false,
 * };
 * ```
 */
export interface LfShapeeditorConfigDsl {
  /** Control definitions for the configuration panel. */
  controls: LfShapeeditorControlConfig[];

  /** Initial/default values for controls, keyed by control id. */
  defaultSettings?: LfShapeeditorConfigSettings;

  /** Optional layout grouping for controls. */
  layout?: LfShapeeditorLayout;

  // ─── Behavioral Metadata (Consumer-Facing) ────────────────────────────────

  /**
   * Default behavior for this DSL. Guides consumer on how to handle events.
   * - `live`: Preview on input, commit on change (default)
   * - `configure`: Controls are config-only, commitTrigger specifies commit event
   * - `manual`: No auto-preview/commit, requires Apply button
   * @default "live"
   */
  behavior?: LfShapeeditorBehavior;

  /**
   * What triggers a commit for "configure" behaviors.
   * Ignored if behavior is "live" or "manual".
   */
  commitTrigger?: LfShapeeditorCommitTrigger;

  /**
   * If true, shapeeditor should display the Apply button.
   * Typically used with behavior: "manual".
   * @default false
   */
  showApplyButton?: boolean;

  /**
   * If true, shapeeditor should display the Reset button.
   * Allows resetting controls to their default values.
   * @default true
   */
  showResetButton?: boolean;

  /**
   * If true, consumer should enable live preview during control interaction.
   * Typically used with behavior: "live".
   * @default true for "live", false otherwise
   */
  enablePreview?: boolean;
}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-shapeeditor` component.
 */
export interface LfShapeeditorPropsInterface {
  lfDataset?: LfDataDataset;
  lfLoadCallback?: LfShapeeditorLoadCallback;
  lfNavigation?: LfShapeeditorNavigation;
  lfShape?: LfDataShapes;
  lfStyle?: string;
  lfValue?: LfDataDataset;
}
/**
 * Callback invoked when the component finishes loading assets or data.
 */
export type LfShapeeditorLoadCallback = (
  shapeeditor: LfShapeeditorInterface,
  dir: string,
) => Promise<void>;
/**
 * Configuration options for the navigation panel.
 * @property isTreeOpen - When true, the navigation tree panel is expanded by default.
 * @property treeProps - Additional props to pass to the underlying `lf-tree` component.
 */
export interface LfShapeeditorNavigation {
  isTreeOpen?: boolean;
  treeProps?: Partial<LfTreePropsInterface>;
}
//#endregion
