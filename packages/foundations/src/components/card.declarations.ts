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
import { LfThemeUISize, LfThemeUIState } from "../framework";
import {
  LfDataDataset,
  LfDataShapeDefaults,
  LfDataShapesMap,
} from "../framework/data.declarations";
import { LfButtonElement, LfButtonEventPayload } from "./button.declarations";
import {
  LF_CARD_BLOCKS,
  LF_CARD_EVENTS,
  LF_CARD_IDS,
  LF_CARD_LAYOUTS,
  LF_CARD_PARTS,
} from "./card.constants";
import { LfChipElement } from "./chip.declarations";
import { LfCodeElement, LfCodeEventPayload } from "./code.declarations";
import { LfListEventPayload } from "./list.declarations";
import { LfToggleElement, LfToggleEventPayload } from "./toggle.declarations";

//#region Class
/**
 * Primary interface implemented by the `lf-card` component. It merges the shared component contract with the component-specific props.
 */
export interface LfCardInterface
  extends LfComponent<"LfCard">,
    LfCardPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfCardEventPayload) => void;
  };
  /**
   * Internal runtime state mirrored by the component implementation.
   */
  shapes: LfDataShapesMap;
}
/**
 * DOM element type for the custom element registered as `lf-card`.
 */
export interface LfCardElement
  extends HTMLStencilElement,
    Omit<LfCardInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-card` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + component state
 * - controller.set: Simple assignments (currently none)
 * - controller.computed: Derived predicates (hasDataset, hasSlotChildren, shouldRender)
 * - controller.actions: Complex operations (updateShapes, registerRipple, unregisterRipple)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfCardAdapter
  extends LfComponentAdapter<
    LfCardInterface,
    LfCardEventPayload,
    LfCardAdapterHandlers,
    LfCardAdapterJsx,
    LfCardAdapterRefs,
    LfCardAdapterControllerGetters,
    LfCardAdapterControllerSetters,
    LfCardAdapterControllerComputed,
    LfCardAdapterControllerActions
  > {
  controller: {
    get: LfCardAdapterControllerGetters;
    set: LfCardAdapterControllerSetters;
    computed: LfCardAdapterControllerComputed;
    actions: LfCardAdapterControllerActions;
  };
  elements: {
    jsx: LfCardAdapterJsx;
    refs: LfCardAdapterRefs;
  };
  handlers: LfCardAdapterHandlers;
  dispatcher: LfCardAdapterDispatcher;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfCardAdapterJsx extends LfComponentAdapterJsx {
  layouts: { [K in LfCardLayout]: () => VNode };
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_CARD_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfCardAdapterRefs extends LfComponentAdapterRefs {
  layouts: {
    debug: {
      button: LfButtonElement | null;
      code: LfCodeElement | null;
      toggle: LfToggleElement | null;
    };
    keywords: {
      button: LfButtonElement | null;
      chip: LfChipElement | null;
    };
    /** Reference to the material layout element for ripple registration */
    material: HTMLDivElement | null;
  };
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfCardAdapterHandlers extends LfComponentAdapterHandlers {
  layouts: {
    debug: {
      button: (e: CustomEvent<LfButtonEventPayload>) => void;
      code: (e: CustomEvent<LfCodeEventPayload>) => void;
      list: (e: CustomEvent<LfListEventPayload>) => void;
      toggle: (e: CustomEvent<LfToggleEventPayload>) => void;
    };
    keywords: {
      button: (e: CustomEvent<LfButtonEventPayload>) => void;
    };
  };
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfCardAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfCardInterface,
    typeof LF_CARD_BLOCKS,
    typeof LF_CARD_IDS,
    typeof LF_CARD_PARTS
  > {
  /** Component defaults used when instantiating adapter-managed layouts */
  defaults: () => LfCardAdapterDefaults;
  /** Current shapes derived from dataset */
  shapes: () => LfDataShapesMap;
}
/**
 * Simple single-value setters.
 * Each setter performs exactly ONE state change.
 */
export interface LfCardAdapterControllerSetters
  extends LfComponentAdapterSetters {}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfCardAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the card has a valid dataset */
  hasDataset: () => boolean;
  /** Whether the card has slot children */
  hasSlotChildren: () => boolean;
  /** Whether the card should render (has content) */
  shouldRender: () => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfCardAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Update shapes from current dataset */
  updateShapes: () => void;
  /** Register ripple effect on material layout */
  registerRipple: () => void;
  /** Unregister ripple effect from material layout */
  unregisterRipple: () => void;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfCardAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfCardEventPayload>;
export type LfCardAdapterDispatcherDetailOverrides = {
  [E in LfCardEvent]: E extends "click" | "contextmenu" | "pointerdown"
    ? LfCardAdapterDispatchDetailBase & { originalEvent: Event }
    : E extends "lf-event"
      ? LfCardAdapterDispatchDetailBase & {
          originalEvent: Event | CustomEvent;
        }
      : E extends "ready" | "unmount"
        ? Omit<LfCardAdapterDispatchDetailBase, "originalEvent"> & {
            originalEvent?: never;
          }
        : LfCardAdapterDispatchDetailBase;
};
export type LfCardAdapterDispatcher = LfComponentAdapterDispatcher<
  LfCardEventPayload,
  LfCardAdapterDispatcherDetailOverrides
>;
/**
 * Component-specific defaults used when instantiating adapter-managed layouts.
 */
export type LfCardAdapterDefaults = {
  [K in LfCardLayout]: LfDataShapeDefaults;
};
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-card`.
 */
export type LfCardEvent = (typeof LF_CARD_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-card` events.
 */
export interface LfCardEventPayload
  extends LfEventPayload<"LfCard", LfCardEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-card` component.
 */
export interface LfCardPropsInterface {
  lfDataset?: LfDataDataset;
  lfLayout?: LfCardLayout;
  lfSizeX?: string;
  lfSizeY?: string;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
}
/**
 * Union of layouts listed in `LF_CARD_LAYOUTS`.
 */
export type LfCardLayout = (typeof LF_CARD_LAYOUTS)[number];
//#endregion
