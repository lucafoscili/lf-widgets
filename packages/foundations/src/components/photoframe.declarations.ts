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
import { LfFrameworkAllowedKeysMap } from "../framework/framework.declarations";
import {
  LF_PHOTOFRAME_BLOCKS,
  LF_PHOTOFRAME_EVENTS,
  LF_PHOTOFRAME_IDS,
  LF_PHOTOFRAME_ORIENTATION,
  LF_PHOTOFRAME_PARTS,
} from "./photoframe.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-photoframe` component. It merges the shared component contract with the component-specific props.
 */
export interface LfPhotoframeInterface
  extends LfComponent<"LfPhotoframe">,
    LfPhotoframePropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfPhotoframeEventPayload) => void;
  };
  /**
   * Internal runtime state: image orientation after placeholder loads.
   */
  imageOrientation: LfPhotoframeOrientation;
  /**
   * Internal runtime state: whether the component is in the viewport.
   */
  isInViewport: boolean;
  /**
   * Internal runtime state: whether the value image has loaded.
   */
  isReady: boolean;
}
/**
 * DOM element type for the custom element registered as `lf-photoframe`.
 */
export interface LfPhotoframeElement
  extends HTMLStencilElement,
    Omit<LfPhotoframeInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-photoframe` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (isInViewport, showPlaceholder, isReady)
 * - controller.actions: Complex operations (triggerLoad)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfPhotoframeAdapter
  extends LfComponentAdapter<
    LfPhotoframeInterface,
    LfPhotoframeEventPayload,
    LfPhotoframeAdapterHandlers,
    LfPhotoframeAdapterJsx,
    LfPhotoframeAdapterRefs,
    LfPhotoframeAdapterControllerGetters,
    Record<string, never>,
    LfPhotoframeAdapterControllerComputed,
    LfPhotoframeAdapterControllerActions
  > {
  controller: {
    get: LfPhotoframeAdapterControllerGetters;
    computed: LfPhotoframeAdapterControllerComputed;
    actions: LfPhotoframeAdapterControllerActions;
  };
  elements: {
    jsx: LfPhotoframeAdapterJsx;
    refs: LfPhotoframeAdapterRefs;
  };
  handlers: LfPhotoframeAdapterHandlers;
  dispatcher: LfPhotoframeAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_PHOTOFRAME_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfPhotoframeAdapterRefs extends LfComponentAdapterRefs {
  image: HTMLImageElement | null;
  overlay: HTMLDivElement | null;
  placeholder: HTMLImageElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfPhotoframeAdapterJsx extends LfComponentAdapterJsx {
  overlay: () => VNode | null;
  photoframe: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfPhotoframeAdapterHandlers
  extends LfComponentAdapterHandlers {
  overlay: {
    click: (e: MouseEvent) => void;
  };
  load: {
    placeholder: (e: Event) => void;
    image: (e: Event) => void;
  };
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfPhotoframeAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfPhotoframeInterface,
    typeof LF_PHOTOFRAME_BLOCKS,
    typeof LF_PHOTOFRAME_IDS,
    typeof LF_PHOTOFRAME_PARTS
  > {}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfPhotoframeAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the component is currently in the viewport */
  isInViewport: () => boolean;
  /** Whether to show the placeholder (before value image is ready) */
  showPlaceholder: () => boolean;
  /** Whether the value image has loaded and is ready to display */
  isReady: () => boolean;
  /** Whether the images should be replaced (in viewport and ready) */
  shouldReplace: () => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfPhotoframeAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Manually trigger the load sequence by setting isInViewport to true */
  triggerLoad: () => void;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfPhotoframeAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfPhotoframeEventPayload>;
export type LfPhotoframeAdapterDispatcherDetailOverrides = {
  [E in LfPhotoframeEvent]: E extends "load"
    ? LfPhotoframeAdapterDispatchDetailBase & {
        originalEvent: Event;
        isPlaceholder: boolean;
      }
    : E extends "overlay"
      ? LfPhotoframeAdapterDispatchDetailBase & { originalEvent: MouseEvent }
      : E extends "ready" | "unmount"
        ? Omit<LfPhotoframeAdapterDispatchDetailBase, "originalEvent"> & {
            originalEvent?: never;
          }
        : LfPhotoframeAdapterDispatchDetailBase;
};
export type LfPhotoframeAdapterDispatcher = LfComponentAdapterDispatcher<
  LfPhotoframeEventPayload,
  LfPhotoframeAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-photoframe`.
 */
export type LfPhotoframeEvent = (typeof LF_PHOTOFRAME_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-photoframe` events.
 */
export interface LfPhotoframeEventPayload
  extends LfEventPayload<"LfPhotoframe", LfPhotoframeEvent> {
  isPlaceholder?: boolean;
}
//#endregion

//#region States
/**
 * Utility type used by the `lf-photoframe` component.
 */
export type LfPhotoframeOrientation =
  (typeof LF_PHOTOFRAME_ORIENTATION)[number];
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-photoframe` component.
 */
export interface LfPhotoframePropsInterface {
  lfOverlay?: LfPhotoframeOverlay;
  lfPlaceholder?: Partial<LfFrameworkAllowedKeysMap>;
  lfStyle?: string;
  lfThreshold?: number;
  lfValue?: Partial<LfFrameworkAllowedKeysMap>;
}
/**
 * Utility interface used by the `lf-photoframe` component.
 */
export interface LfPhotoframeOverlay {
  description?: string;
  icon?: string;
  hideOnClick?: boolean;
  title?: string;
}
//#endregion
