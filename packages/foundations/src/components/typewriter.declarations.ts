import {
  LfComponentAdapter,
  LfComponentAdapterActions,
  LfComponentAdapterBaseGetters,
  LfComponentAdapterComputed,
  LfComponentAdapterDispatchDetail,
  LfComponentAdapterDispatcher,
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
import { LfThemeUISize } from "../framework/theme.declarations";
import {
  LF_TYPEWRITER_BLOCKS,
  LF_TYPEWRITER_CURSORS,
  LF_TYPEWRITER_EVENTS,
  LF_TYPEWRITER_IDS,
  LF_TYPEWRITER_PARTS,
  LF_TYPEWRITER_TAGS,
} from "./typewriter.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-typewriter` component. It merges the shared component contract with the component-specific props.
 */
export interface LfTypewriterInterface
  extends LfComponent<"LfTypewriter">,
    LfTypewriterPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfTypewriterEventPayload) => void;
  };
  /**
   * Internal runtime state for displayed text.
   */
  displayedText: string;
  /**
   * Internal runtime state for delete animation.
   */
  isDeleting: boolean;
  /**
   * Internal runtime state for current text index.
   */
  currentTextIndex: number;
}
/**
 * DOM element type for the custom element registered as `lf-typewriter`.
 */
export interface LfTypewriterElement
  extends HTMLStencilElement,
    Omit<LfTypewriterInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-typewriter` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (shouldShowCursor, currentText, texts)
 * - controller.actions: Animation control operations (start, reset, pause, resume)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfTypewriterAdapter
  extends LfComponentAdapter<
    LfTypewriterInterface,
    LfTypewriterEventPayload,
    never,
    LfTypewriterAdapterJsx,
    LfTypewriterAdapterRefs,
    LfTypewriterAdapterControllerGetters,
    never,
    LfTypewriterAdapterControllerComputed,
    LfTypewriterAdapterControllerActions
  > {
  controller: {
    get: LfTypewriterAdapterControllerGetters;
    computed: LfTypewriterAdapterControllerComputed;
    actions: LfTypewriterAdapterControllerActions;
  };
  elements: {
    jsx: LfTypewriterAdapterJsx;
    refs: LfTypewriterAdapterRefs;
  };
  dispatcher: LfTypewriterAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_TYPEWRITER_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfTypewriterAdapterRefs extends LfComponentAdapterRefs {
  cursor: HTMLSpanElement | null;
  text: HTMLElement | null;
  typewriter: HTMLDivElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfTypewriterAdapterJsx extends LfComponentAdapterJsx {
  typewriter: () => VNode;
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfTypewriterAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfTypewriterInterface,
    typeof LF_TYPEWRITER_BLOCKS,
    typeof LF_TYPEWRITER_IDS,
    typeof LF_TYPEWRITER_PARTS
  > {}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfTypewriterAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the cursor should be displayed based on lfCursor setting */
  shouldShowCursor: () => boolean;
  /** Get the current text being typed */
  currentText: () => string;
  /** Get all texts array */
  texts: () => string[];
}
/**
 * Complex multi-step actions for animation control.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfTypewriterAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Start the typing animation */
  start: () => void;
  /** Reset the typing animation */
  reset: () => void;
  /** Delete text with callback */
  deleteText: (callback: () => void) => void;
  /** Complete reset after deletion */
  completeReset: () => void;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfTypewriterAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfTypewriterEventPayload>;
export type LfTypewriterAdapterDispatcherDetailOverrides = {
  [E in LfTypewriterEvent]: E extends "ready" | "unmount"
    ? Omit<LfTypewriterAdapterDispatchDetailBase, "originalEvent"> & {
        originalEvent?: never;
      }
    : LfTypewriterAdapterDispatchDetailBase;
};
export type LfTypewriterAdapterDispatcher = LfComponentAdapterDispatcher<
  LfTypewriterEventPayload,
  LfTypewriterAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-typewriter`.
 */
export type LfTypewriterEvent = (typeof LF_TYPEWRITER_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-typewriter` events.
 */
export interface LfTypewriterEventPayload
  extends LfEventPayload<"LfTypewriter", LfTypewriterEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-typewriter` component.
 */
export interface LfTypewriterPropsInterface {
  lfCursor?: LfTypewriterCursor;
  lfDeleteSpeed?: number;
  lfLoop?: boolean;
  lfPause?: number;
  lfSpeed?: number;
  lfStyle?: string;
  lfTag?: LfTypewriterTag;
  lfUiSize?: LfThemeUISize;
  lfUpdatable?: boolean;
  lfValue?: LfTypewriterValue;
}
/**
 * Utility type used by the `lf-typewriter` component.
 */
export type LfTypewriterCursor = (typeof LF_TYPEWRITER_CURSORS)[number];
/**
 * Utility type used by the `lf-typewriter` component.
 */
export type LfTypewriterTag = (typeof LF_TYPEWRITER_TAGS)[number];
/**
 * Utility type used by the `lf-typewriter` component.
 */
export type LfTypewriterValue = string | string[];
//#endregion
