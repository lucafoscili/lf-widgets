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
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LF_SLIDER_BLOCKS,
  LF_SLIDER_EVENTS,
  LF_SLIDER_IDS,
  LF_SLIDER_PARTS,
} from "./slider.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-slider` component. It merges the shared component contract with the component-specific props.
 */
export interface LfSliderInterface
  extends LfComponent<"LfSlider">,
    LfSliderPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfSliderEventPayload) => void;
  };
  /**
   * Internal runtime state mirrored by the component implementation.
   */
  value: LfSliderValue;
}
/**
 * DOM element type for the custom element registered as `lf-slider`.
 */
export interface LfSliderElement
  extends HTMLStencilElement,
    Omit<LfSliderInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-slider` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.set: N/A for slider
 * - controller.computed: Derived predicates (isDisabled, valuePercentage)
 * - controller.actions: Complex operations (setValue)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks (blur, change, focus, input, pointerdown)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfSliderAdapter
  extends LfComponentAdapter<
    LfSliderInterface,
    LfSliderEventPayload,
    LfSliderAdapterHandlers,
    LfSliderAdapterJsx,
    LfSliderAdapterRefs,
    LfSliderAdapterControllerGetters,
    never,
    LfSliderAdapterControllerComputed,
    LfSliderAdapterControllerActions
  > {
  controller: {
    get: LfSliderAdapterControllerGetters;
    computed: LfSliderAdapterControllerComputed;
    actions: LfSliderAdapterControllerActions;
  };
  elements: {
    jsx: LfSliderAdapterJsx;
    refs: LfSliderAdapterRefs;
  };
  handlers: LfSliderAdapterHandlers;
  dispatcher: LfSliderAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_SLIDER_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfSliderAdapterRefs extends LfComponentAdapterRefs {
  input: HTMLInputElement | null;
  thumb: HTMLElement | null;
  track: HTMLElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfSliderAdapterJsx extends LfComponentAdapterJsx {
  slider: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfSliderAdapterHandlers extends LfComponentAdapterHandlers {
  blur: (e: FocusEvent) => void;
  change: (e: Event) => void;
  focus: (e: FocusEvent) => void;
  input: (e: Event) => void;
  pointerdown: (e: PointerEvent) => void;
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfSliderAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfSliderInterface,
    typeof LF_SLIDER_BLOCKS,
    typeof LF_SLIDER_IDS,
    typeof LF_SLIDER_PARTS
  > {}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfSliderAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the slider is disabled based on lfUiState */
  isDisabled: () => boolean;
  /** Calculates the percentage of current value within min/max range */
  valuePercentage: () => number;
  /** Normalizes a value to be within min/max bounds */
  normalizeValue: (value: number) => number;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfSliderAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Sets the slider value (both display and real) */
  setValue: (value: number) => void;
  /** Updates only the display value (used during drag) */
  setDisplayValue: (value: number) => void;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfSliderAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfSliderEventPayload>;
export type LfSliderAdapterDispatcherDetailOverrides = {
  [E in LfSliderEvent]: E extends "blur" | "focus"
    ? LfSliderAdapterDispatchDetailBase & { originalEvent: FocusEvent }
    : E extends "change" | "input"
      ? LfSliderAdapterDispatchDetailBase & { originalEvent: Event }
      : E extends "pointerdown"
        ? LfSliderAdapterDispatchDetailBase & { originalEvent: PointerEvent }
        : E extends "ready" | "unmount"
          ? Omit<LfSliderAdapterDispatchDetailBase, "originalEvent"> & {
              originalEvent?: never;
            }
          : LfSliderAdapterDispatchDetailBase;
};
export type LfSliderAdapterDispatcher = LfComponentAdapterDispatcher<
  LfSliderEventPayload,
  LfSliderAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-slider`.
 */
export type LfSliderEvent = (typeof LF_SLIDER_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-slider` events.
 */
export interface LfSliderEventPayload
  extends LfEventPayload<"LfSlider", LfSliderEvent> {
  value: LfSliderValue;
}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-slider` component.
 */
export interface LfSliderPropsInterface {
  lfLabel?: string;
  lfLeadingLabel?: boolean;
  lfMax?: number;
  lfMin?: number;
  lfRipple?: boolean;
  lfStep?: number;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: number;
}
//#endregion

//#region State
/**
 * Utility interface used by the `lf-slider` component.
 */
export interface LfSliderValue {
  display: number;
  real: number;
}
//#endregion
