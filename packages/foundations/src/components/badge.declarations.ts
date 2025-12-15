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
import { LfFrameworkInterface } from "../framework/framework.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LF_BADGE_BLOCKS,
  LF_BADGE_EVENTS,
  LF_BADGE_IDS,
  LF_BADGE_PARTS,
  LF_BADGE_POSITIONS,
} from "./badge.constants";
import { LfImagePropsInterface } from "./image.declarations";

//#region Class
/**
 * Primary interface implemented by the `lf-badge` component. It merges the shared component contract with the component-specific props.
 */
export interface LfBadgeInterface
  extends LfComponent<"LfBadge">,
    LfBadgePropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-badge`.
 */
export interface LfBadgeElement
  extends HTMLStencilElement,
    Omit<LfBadgeInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-badge` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.set: Simple assignments (empty for badge)
 * - controller.computed: Derived predicates (empty for badge)
 * - controller.actions: Complex operations (empty for badge)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfBadgeAdapter
  extends LfComponentAdapter<
    LfBadgeInterface,
    LfBadgeEventPayload,
    LfBadgeAdapterHandlers,
    LfBadgeAdapterJsx,
    LfBadgeAdapterRefs,
    LfBadgeAdapterControllerGetters,
    LfBadgeAdapterControllerSetters,
    LfBadgeAdapterControllerComputed,
    LfBadgeAdapterControllerActions
  > {
  controller: {
    get: LfBadgeAdapterControllerGetters;
    set: LfBadgeAdapterControllerSetters;
    computed: LfBadgeAdapterControllerComputed;
    actions: LfBadgeAdapterControllerActions;
  };
  elements: {
    jsx: LfBadgeAdapterJsx;
    refs: LfBadgeAdapterRefs;
  };
  handlers: LfBadgeAdapterHandlers;
  dispatcher: LfBadgeAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 */
export interface LfBadgeAdapterRefs extends LfComponentAdapterRefs {
  badge: HTMLDivElement;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfBadgeAdapterJsx extends LfComponentAdapterJsx {
  badge: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfBadgeAdapterHandlers extends LfComponentAdapterHandlers {}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfBadgeAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfBadgeInterface,
    typeof LF_BADGE_BLOCKS,
    typeof LF_BADGE_IDS,
    typeof LF_BADGE_PARTS
  > {}
/**
 * Simple single-value setters.
 * Badge is a simple component with no setters.
 */
export interface LfBadgeAdapterControllerSetters
  extends LfComponentAdapterSetters {}
/**
 * Derived values and predicates computed from state.
 * Pure functions with no side effects.
 * Badge is a simple component with no computed values.
 */
export interface LfBadgeAdapterControllerComputed
  extends LfComponentAdapterComputed {}
/**
 * Multi-step operations that may batch changes or toggle state.
 * May have side effects.
 * Badge is a simple component with no actions.
 */
export interface LfBadgeAdapterControllerActions
  extends LfComponentAdapterActions {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-badge`.
 */
export type LfBadgeEvent = (typeof LF_BADGE_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-badge` events.
 */
export interface LfBadgeEventPayload
  extends LfEventPayload<"LfBadge", LfBadgeEvent> {}
//#endregion

//#region Dispatcher
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfBadgeAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfBadgeEventPayload>;
export type LfBadgeAdapterDispatcherDetailOverrides = {
  [E in LfBadgeEvent]: E extends "click"
    ? LfBadgeAdapterDispatchDetailBase & {
        originalEvent: MouseEvent | PointerEvent;
      }
    : E extends "ready" | "unmount"
      ? Omit<LfBadgeAdapterDispatchDetailBase, "originalEvent"> & {
          originalEvent?: never;
        }
      : LfBadgeAdapterDispatchDetailBase;
};
export type LfBadgeAdapterDispatcher = LfComponentAdapterDispatcher<
  LfBadgeEventPayload,
  LfBadgeAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-badge` component.
 */
export interface LfBadgePropsInterface {
  lfImageProps?: LfImagePropsInterface;
  lfLabel?: string;
  lfPosition?: LfBadgePositions;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
}
/**
 * Utility type used by the `lf-badge` component.
 */
export type LfBadgePositions = (typeof LF_BADGE_POSITIONS)[number];
//#endregion

//#region Functional Component
/**
 * Props interface for the `LfBadgeFC` functional component.
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfBadgeFCProps {
  /** Reference callback for the badge element */
  badgeRef?: (el: HTMLDivElement | null) => void;
  /** Assigned class for custom styling */
  className?: string;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Unique identifier for the component */
  id?: string;
  /** Props for an image to display inside the badge */
  imageProps?: LfImagePropsInterface;
  /** Text label displayed inside the badge */
  label?: string;
  /** Callback fired on click event */
  onClick?: (e: MouseEvent | PointerEvent) => void;
  /** Position of the badge relative to its container */
  position?: LfBadgePositions;
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
