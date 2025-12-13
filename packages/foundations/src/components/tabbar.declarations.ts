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
} from "../foundations/adapter.declarations";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LF_TABBAR_BLOCKS,
  LF_TABBAR_EVENTS,
  LF_TABBAR_PARTS,
  LF_TABBAR_SCROLL,
} from "./tabbar.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-tabbar` component. It merges the shared component contract with the component-specific props.
 */
export interface LfTabbarInterface
  extends LfComponent<"LfTabbar">,
    LfTabbarPropsInterface {
  /**
   * Internal runtime state: the currently selected tab.
   */
  value: LfTabbarState | null;
}
/**
 * DOM element type for the custom element registered as `lf-tabbar`.
 */
export interface LfTabbarElement
  extends HTMLStencilElement,
    Omit<LfTabbarInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-tabbar`.
 */
export type LfTabbarEvent = (typeof LF_TABBAR_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-tabbar` events.
 */
export interface LfTabbarEventPayload
  extends LfEventPayload<"LfTabbar", LfTabbarEvent> {
  index?: number;
  node?: LfDataNode;
}
//#endregion

//#region States
/**
 * Utility type used by the `lf-tabbar` component.
 */
export type LfTabbarScroll = (typeof LF_TABBAR_SCROLL)[number];
/**
 * Union of runtime states supported by `lf-tabbar`.
 */
export interface LfTabbarState {
  index?: number;
  node?: LfDataNode;
}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-tabbar` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (isSelected, hasNodes)
 * - controller.actions: Complex operations (select, scroll)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfTabbarAdapter
  extends LfComponentAdapter<
    LfTabbarInterface,
    LfTabbarEventPayload,
    LfTabbarAdapterHandlers,
    LfTabbarAdapterJsx,
    LfTabbarAdapterRefs,
    LfTabbarAdapterControllerGetters,
    never,
    LfTabbarAdapterControllerComputed,
    LfTabbarAdapterControllerActions
  > {
  controller: {
    get: LfTabbarAdapterControllerGetters;
    computed: LfTabbarAdapterControllerComputed;
    actions: LfTabbarAdapterControllerActions;
  };
  elements: {
    jsx: LfTabbarAdapterJsx;
    refs: LfTabbarAdapterRefs;
  };
  handlers: LfTabbarAdapterHandlers;
  dispatcher: LfTabbarAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfTabbarAdapterRefs extends LfComponentAdapterRefs {
  scrollContainer: HTMLDivElement | null;
  tabs: Map<string, HTMLButtonElement>;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfTabbarAdapterJsx extends LfComponentAdapterJsx {
  tabbar: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfTabbarAdapterHandlers extends LfComponentAdapterHandlers {
  tab: (
    e: Event | CustomEvent,
    eventType: LfTabbarEvent,
    index: number,
    node: LfDataNode,
  ) => void;
  navigation: (e?: Event, direction?: "left" | "right") => void;
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfTabbarAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfTabbarInterface,
    typeof LF_TABBAR_BLOCKS,
    never,
    typeof LF_TABBAR_PARTS
  > {}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfTabbarAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether a specific node is the currently selected tab */
  isSelected: (nodeIndex: number) => boolean;
  /** Whether the tabbar has any valid nodes to display */
  hasNodes: () => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfTabbarAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Select a tab by index and node */
  select: (index: number, node: LfDataNode) => void;
  /** Scroll the tab container in the specified direction */
  scroll: (direction: "left" | "right") => void;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfTabbarAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfTabbarEventPayload>;
export type LfTabbarAdapterDispatcherDetailOverrides = {
  [E in LfTabbarEvent]: E extends "click" | "pointerdown"
    ? LfTabbarAdapterDispatchDetailBase & {
        originalEvent: Event | CustomEvent;
        index?: number;
        node?: LfDataNode;
      }
    : E extends "ready" | "unmount"
      ? Omit<LfTabbarAdapterDispatchDetailBase, "originalEvent"> & {
          originalEvent?: never;
        }
      : LfTabbarAdapterDispatchDetailBase;
};
export type LfTabbarAdapterDispatcher = LfComponentAdapterDispatcher<
  LfTabbarEventPayload,
  LfTabbarAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-tabbar` component.
 */
export interface LfTabbarPropsInterface {
  lfAriaLabel?: string;
  lfDataset?: LfDataDataset;
  lfNavigation?: boolean;
  lfRipple?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: number | string;
}
//#endregion
