import { LfCodeInterface } from "../components/code.declarations";
import { LfToggleInterface } from "../components/toggle.declarations";
import {
  LfComponent,
  LfComponentName,
} from "../foundations/components.declarations";
import { LfColorInterface } from "./color.declarations";
import { LfDataInterface } from "./data.declarations";
import {
  LF_DEBUG_CATEGORIES,
  LF_DEBUG_LIFECYCLES,
  LF_DEBUG_LOG_TYPES,
} from "./debug.constants";
import { LfDragInterface } from "./drag.declarations";
import { LfEffectsInterface } from "./effects.declarations";
import { LfFrameworkInterface } from "./framework.declarations";
import { LfLLMInterface } from "./llm.declarations";
import { LfPortalInterface } from "./portal.declarations";
import { LfThemeInterface } from "./theme.declarations";
import { LfTooltipInterface } from "./tooltip.declarations";

//#region Class
/**
 * Primary interface exposing the debug tooling.
 */
export interface LfDebugInterface {
  /**
   * Lifecycle instrumentation helpers. `create` initialises tracking data, while `update` records
   * specific checkpoints (will-render, did-render, etc.).
   */
  info: {
    /** Creates a fresh lifecycle info object seeded with timestamps. */
    create: () => LfDebugLifecycleInfo;
    /** Persists lifecycle timestamps/log entries for the supplied component. */
    update: (
      comp: LfComponent<LfComponentName>,
      lifecycle: LfDebugLifecycles,
    ) => Promise<void>;
  };
  /** Debug log facility responsible for storing and printing entries. */
  logs: LfDebugLogFactory;
  /** Indicates whether debug mode is currently enabled. */
  isEnabled: () => boolean;
  /** Registers a debug-aware component (code viewer, toggle) so it receives updates. */
  register: (comp: LfDebugManagedComponents) => void;
  /** Enables or disables debug mode; optionally dispatches state to registered components. */
  toggle: (value?: boolean, dispatch?: boolean) => boolean;
  /** Toggles or sets the auto-print feature. */
  toggleAutoPrint: (value?: boolean) => void;
  /** Unregisters a previously registered debug component. */
  unregister: (comp: LfDebugManagedComponents) => void;
}
//#endregion

//#region Utilities
/**
 * Utility interface used by the debug tooling.
 */
export interface LfDebugLifecycleInfo {
  /** Timestamp when the component finished initialisation (did-load). */
  endTime: number;
  /** Number of renders performed since mount. */
  renderCount: number;
  /** Timestamp captured after render completes. */
  renderEnd: number;
  /** Timestamp captured before render begins. */
  renderStart: number;
  /** Timestamp when the component started loading. */
  startTime: number;
}
/**
 * Utility interface used by the debug tooling.
 */
export interface LfDebugLogFactory {
  /** Clears stored logs and resets any attached debug components. */
  dump: () => void;
  /** Type guard that verifies the log source is a component with a root element. */
  fromComponent(comp: LfDebugLogClass): comp is LfComponent;
  /** Records a log entry under the given category. */
  new: (
    comp: LfDebugLogClass,
    message: string,
    category?: LfDebugCategory,
  ) => Promise<void>;
  /** Prints all buffered log entries grouped by type. */
  print: () => void;
}
/**
 * Utility type used by the debug tooling.
 */
/** Components that the debug manager knows how to keep in sync (code viewer, toggle switch). */
export type LfDebugManagedComponents = LfCodeInterface | LfToggleInterface;
/**
 * Utility interface used by the debug tooling.
 */
export interface LfDebugLog {
  /** Category applied to the log entry (informational, warning, etc.). */
  category: LfDebugCategory;
  /** Component or service that emitted the log. */
  class: LfDebugLogClass;
  /** Timestamp when the log was created. */
  date: Date;
  /** Unique identifier assigned to the log entry. */
  id: string;
  /** Human readable message. */
  message: string;
  /** Logical grouping used when printing (lifecycle, misc, etc.). */
  type: LfDebugLogType;
}
/**
 * Utility type used by the debug tooling.
 */
export type LfDebugLogToPrintEntry = {
  /** Source of the log entry. */
  class: LfDebugLogClass;
  /** Normalised date string for console output. */
  date: string;
  /** Textual log message. */
  message: string;
};
/**
 * Utility type used by the debug tooling.
 */
/** Union of classes that can emit debug log entries. */
export type LfDebugLogClass =
  | LfColorInterface
  | LfComponent
  | LfDataInterface
  | LfDebugInterface
  | LfDragInterface
  | LfLLMInterface
  | LfFrameworkInterface
  | LfPortalInterface
  | LfEffectsInterface
  | LfThemeInterface
  | LfTooltipInterface;
/**
 * Utility type used by the debug tooling.
 */
export type LfDebugLogsToPrint = {
  /** Grouped log mapping keyed by log type (load, render, etc.). */
  [index in LfDebugLogType]: LfDebugLogToPrintEntry[];
};
/**
 * Utility type used by the debug tooling.
 */
/** Allowed categories for debug log entries. */
export type LfDebugCategory = (typeof LF_DEBUG_CATEGORIES)[number];
/**
 * Utility type used by the debug tooling.
 */
/** Lifecycle checkpoints recorded by the debug manager. */
export type LfDebugLifecycles = (typeof LF_DEBUG_LIFECYCLES)[number];
/**
 * Utility type used by the debug tooling.
 */
/** Logical buckets used when printing logs (load, render, misc, etc.). */
export type LfDebugLogType = (typeof LF_DEBUG_LOG_TYPES)[number];
//#endregion
