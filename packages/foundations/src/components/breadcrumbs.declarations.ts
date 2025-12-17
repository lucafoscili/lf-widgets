import {
  LfComponentAdapter,
  LfComponentAdapterActions,
  LfComponentAdapterBaseGetters,
  LfComponentAdapterComputed,
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
import { LfFrameworkInterface, LfThemeUIState } from "../framework";
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfThemeUISize } from "../framework/theme.declarations";
import {
  LF_BREADCRUMBS_BLOCKS,
  LF_BREADCRUMBS_EVENTS,
  LF_BREADCRUMBS_IDS,
  LF_BREADCRUMBS_PARTS,
} from "./breadcrumbs.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-breadcrumbs` component.
 * It merges the shared component contract with the component-specific props.
 */
export interface LfBreadcrumbsInterface
  extends LfComponent<"LfBreadcrumbs">,
    LfBreadcrumbsPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfBreadcrumbsEventPayload) => void;
  };
  /**
   * Internal runtime state for the current node ID.
   */
  currentNodeId: string | null;
  /**
   * Internal runtime state for expanded/collapsed view.
   */
  expanded: boolean;
  setCurrentNode: (nodeId: string) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-breadcrumbs`.
 */
export interface LfBreadcrumbsElement
  extends HTMLStencilElement,
    Omit<LfBreadcrumbsInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
export type LfBreadcrumbsEvent = (typeof LF_BREADCRUMBS_EVENTS)[number];
export type LfBreadcrumbsEventArguments = {
  node?: LfDataNode;
  index?: number;
};
export type LfBreadcrumbsEventPayload = LfEventPayload<
  "LfBreadcrumbs",
  LfBreadcrumbsEvent
> &
  LfBreadcrumbsEventArguments;
//#endregion

//#region Types
export type LfBreadcrumbsRenderable =
  | LfDataNode
  | {
      isTruncation: true;
    };
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-breadcrumbs` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + component state
 * - controller.set: Simple assignments (currentNode, expanded)
 * - controller.computed: Derived predicates (isInteractive, isExpanded, isEmpty)
 * - controller.actions: Complex operations (toggleExpand, setCurrentNode)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfBreadcrumbsAdapter
  extends LfComponentAdapter<
    LfBreadcrumbsInterface,
    LfBreadcrumbsEventPayload,
    LfBreadcrumbsAdapterHandlers,
    LfBreadcrumbsAdapterJsx,
    LfBreadcrumbsAdapterRefs,
    LfBreadcrumbsAdapterControllerGetters,
    LfBreadcrumbsAdapterControllerSetters,
    LfBreadcrumbsAdapterControllerComputed,
    LfBreadcrumbsAdapterControllerActions
  > {
  controller: {
    get: LfBreadcrumbsAdapterControllerGetters;
    set: LfBreadcrumbsAdapterControllerSetters;
    computed: LfBreadcrumbsAdapterControllerComputed;
    actions: LfBreadcrumbsAdapterControllerActions;
  };
  elements: {
    jsx: LfBreadcrumbsAdapterJsx;
    refs: LfBreadcrumbsAdapterRefs;
  };
  handlers: LfBreadcrumbsAdapterHandlers;
  dispatcher: LfBreadcrumbsAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_BREADCRUMBS_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfBreadcrumbsAdapterRefs extends LfComponentAdapterRefs {
  items: Map<string, HTMLElement | null>;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfBreadcrumbsAdapterJsx extends LfComponentAdapterJsx {
  icon: (node: LfDataNode) => VNode | null;
  item: (node: LfDataNode, index: number, totalItems: number) => VNode[];
  items: () => VNode | null;
  separator: (index: number) => VNode | null;
  truncation: (index: number, totalItems: number) => VNode[];
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfBreadcrumbsAdapterHandlers
  extends LfComponentAdapterHandlers {
  item: {
    click: (e: MouseEvent, node: LfDataNode, index: number) => Promise<void>;
    keydown: (
      e: KeyboardEvent,
      node: LfDataNode,
      index: number,
    ) => Promise<void>;
    pointerdown: (e: PointerEvent, node: LfDataNode, index: number) => void;
  };
  truncation: {
    click: (e: MouseEvent) => Promise<void>;
    keydown: (e: KeyboardEvent) => Promise<void>;
  };
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfBreadcrumbsAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfBreadcrumbsInterface,
    typeof LF_BREADCRUMBS_BLOCKS,
    typeof LF_BREADCRUMBS_IDS,
    typeof LF_BREADCRUMBS_PARTS
  > {
  /** Current dataset */
  dataset: () => LfDataDataset;
  /** Current breadcrumb path nodes */
  path: () => LfDataNode[];
  /** Current separator character */
  separator: () => string;
  /** Current UI size */
  uiSize: () => LfThemeUISize;
}
/**
 * Simple single-value setters.
 * Each setter performs exactly ONE state change.
 */
export interface LfBreadcrumbsAdapterControllerSetters
  extends LfComponentAdapterSetters {
  /** Set the current node by ID */
  currentNode: (nodeId: string) => Promise<void>;
  /** Set the expanded state */
  expanded: (value: boolean) => Promise<void>;
}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfBreadcrumbsAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the breadcrumbs are interactive */
  isInteractive: () => boolean;
  /** Whether the breadcrumbs are expanded (showing all items) */
  isExpanded: () => boolean;
  /** Whether the dataset is empty */
  isEmpty: () => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfBreadcrumbsAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Toggle the expanded state */
  toggleExpand: () => void;
  /** Set the current node by ID */
  setCurrentNode: (nodeId: string) => void;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfBreadcrumbsAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfBreadcrumbsEventPayload>;
export type LfBreadcrumbsAdapterDispatcherDetailOverrides = {
  [E in LfBreadcrumbsEvent]: E extends "click" | "expand"
    ? LfBreadcrumbsAdapterDispatchDetailBase & { originalEvent: MouseEvent }
    : E extends "pointerdown"
      ? LfBreadcrumbsAdapterDispatchDetailBase & { originalEvent: PointerEvent }
      : E extends "ready" | "unmount"
        ? Omit<LfBreadcrumbsAdapterDispatchDetailBase, "originalEvent"> & {
            originalEvent?: never;
          }
        : LfBreadcrumbsAdapterDispatchDetailBase;
};
export type LfBreadcrumbsAdapterDispatcher = LfComponentAdapterDispatcher<
  LfBreadcrumbsEventPayload,
  LfBreadcrumbsAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Props
export interface LfBreadcrumbsPropsInterface {
  lfDataset?: LfDataDataset;
  lfEmpty?: string;
  lfInteractive?: boolean;
  lfMaxItems?: number;
  lfRipple?: boolean;
  lfSeparator?: string;
  lfShowRoot?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: string;
}
//#endregion

//#region Functional Component
/**
 * Props interface for the `LfBreadcrumbsFC` functional component.
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfBreadcrumbsFCProps {
  /** Reference callback for the breadcrumbs element */
  breadcrumbsRef?: (el: HTMLElement | null) => void;
  /** Assigned class for custom styling */
  className?: string;
  /** Cypress attributes for testing */
  cyAttributes: ReturnType<
    LfBreadcrumbsAdapterControllerGetters["cyAttributes"]
  >;
  /** Message displayed when the dataset is empty */
  empty: string;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Unique identifier for the component */
  id?: string;
  /** Whether the view is expanded (showing all items) */
  isExpanded: boolean;
  /** Whether breadcrumb items are interactive */
  isInteractive: boolean;
  /** Maximum number of items to show before truncation */
  maxItems?: number;
  /** Callback fired when a breadcrumb item is clicked */
  onItemClick?: (e: MouseEvent, node: LfDataNode, index: number) => void;
  /** Callback fired on item keydown */
  onItemKeydown?: (e: KeyboardEvent, node: LfDataNode, index: number) => void;
  /** Callback fired on item pointerdown */
  onItemPointerdown?: (
    e: PointerEvent,
    node: LfDataNode,
    index: number,
  ) => void;
  /** Callback fired when truncation indicator is clicked */
  onTruncationClick?: (e: MouseEvent) => void;
  /** Callback fired on truncation keydown */
  onTruncationKeydown?: (e: KeyboardEvent) => void;
  /** Current breadcrumb path nodes */
  path: LfDataNode[];
  /** Reference callback for individual items */
  refItems: Map<string, HTMLElement | null>;
  /** Separator string between items */
  separator: string;
  /** Custom CSS styles to apply (object format for Stencil JSX) */
  style?: { [key: string]: string };
  /**
   * UI size multiplier for the component.
   * Controls font-size scaling. Required for composed usage where
   * CSS inheritance from :host doesn't work (e.g., portaled content).
   * @default "medium"
   */
  uiSize?: LfThemeUISize;
  /**
   * UI state for theming (primary, success, warning, danger, etc.).
   * Controls color scheme. Required for composed usage where
   * CSS cascade doesn't work (e.g., portaled content).
   * @default "primary"
   */
  uiState?: LfThemeUIState;
}
//#endregion
