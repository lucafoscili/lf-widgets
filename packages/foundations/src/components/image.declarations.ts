import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
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
import { LfFrameworkAllowedKeysMap } from "../framework/framework.declarations";
import {
  LF_IMAGE_BLOCKS,
  LF_IMAGE_EVENTS,
  LF_IMAGE_IDS,
  LF_IMAGE_PARTS,
} from "./image.constants";
import {
  LfThemeUIState,
  LfThemeIconVariable,
} from "../framework/theme.declarations";

//#region Class
/**
 * Primary interface implemented by the `lf-image` component. It merges the shared component contract with the component-specific props.
 */
export interface LfImageInterface
  extends LfComponent<"LfImage">,
    LfImagePropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfImageEventPayload) => void;
  };
  /**
   * Whether an error occurred during image loading.
   */
  error: boolean;
  /**
   * Whether the image has been successfully loaded.
   */
  isLoaded: boolean;
  /**
   * The resolved sprite name to be used for the image.
   */
  resolvedSpriteName?: string;
  getImage: () => Promise<HTMLImageElement | SVGElement | null>;
}
/**
 * DOM element type for the custom element registered as `lf-image`.
 */
export interface LfImageElement
  extends HTMLStencilElement,
    Omit<LfImageInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-image` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.set: Simple assignments (error, isLoaded, resolvedSpriteName)
 * - controller.computed: Derived predicates (isResourceUrl, resolvedSource)
 * - controller.actions: Complex operations (resolveSprite)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfImageAdapter
  extends LfComponentAdapter<
    LfImageInterface,
    LfImageEventPayload,
    LfImageAdapterHandlers,
    LfImageAdapterJsx,
    LfImageAdapterRefs,
    LfImageAdapterControllerGetters,
    LfImageAdapterControllerSetters,
    LfImageAdapterControllerComputed,
    LfImageAdapterControllerActions
  > {
  controller: {
    get: LfImageAdapterControllerGetters;
    set: LfImageAdapterControllerSetters;
    computed: LfImageAdapterControllerComputed;
    actions: LfImageAdapterControllerActions;
  };
  elements: {
    jsx: LfImageAdapterJsx;
    refs: LfImageAdapterRefs;
  };
  handlers: LfImageAdapterHandlers;
  dispatcher: LfImageAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_IMAGE_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfImageAdapterRefs extends LfComponentAdapterRefs {
  image: HTMLDivElement | null;
  img: HTMLImageElement | null;
  icon: HTMLElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfImageAdapterJsx extends LfComponentAdapterJsx {
  image: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfImageAdapterHandlers extends LfComponentAdapterHandlers {
  click: (e: MouseEvent) => void;
  contextmenu: (e: MouseEvent) => void;
  error: (e: Event) => void;
  load: (e: Event) => void;
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfImageAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfImageInterface,
    typeof LF_IMAGE_BLOCKS,
    typeof LF_IMAGE_IDS,
    typeof LF_IMAGE_PARTS
  > {
  /** The resolved sprite name for tracking resolution state */
  resolvedFor: () => string | undefined;
}
/**
 * Simple single-value setters.
 * Each setter performs exactly ONE state change.
 */
export interface LfImageAdapterControllerSetters
  extends LfComponentAdapterSetters {
  /** Set the error state */
  error: (value: boolean) => void;
  /** Set the loaded state */
  isLoaded: (value: boolean) => void;
  /** Set the resolved sprite name */
  resolvedSpriteName: (value: string | undefined) => void;
  /** Set the resolved-for tracking value */
  resolvedFor: (value: string | undefined) => void;
  /** Set the image reference */
  imageRef: (el: HTMLImageElement | SVGElement | null) => void;
}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfImageAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the lfValue is a resource URL (http, data:, blob:, etc.) */
  isResourceUrl: () => boolean;
  /** Get the resolved source for the image/icon */
  resolvedSource: () => string | LfThemeIconVariable | undefined;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfImageAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Resolve sprite icon from theme */
  resolveSprite: (value?: LfThemeIconVariable) => Promise<void>;
  /** Reset state when lfValue changes */
  resetState: (newVal?: string) => Promise<void>;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfImageAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfImageEventPayload>;
export type LfImageAdapterDispatcherDetailOverrides = {
  [E in LfImageEvent]: E extends "click" | "contextmenu"
    ? LfImageAdapterDispatchDetailBase & { originalEvent: MouseEvent }
    : E extends "error" | "load"
      ? LfImageAdapterDispatchDetailBase & { originalEvent: Event }
      : E extends "ready" | "unmount"
        ? Omit<LfImageAdapterDispatchDetailBase, "originalEvent"> & {
            originalEvent?: never;
          }
        : LfImageAdapterDispatchDetailBase;
};
export type LfImageAdapterDispatcher = LfComponentAdapterDispatcher<
  LfImageEventPayload,
  LfImageAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-image`.
 */
export type LfImageEvent = (typeof LF_IMAGE_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-image` events.
 */
export interface LfImageEventPayload
  extends LfEventPayload<"LfImage", LfImageEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-image` component.
 */
export interface LfImagePropsInterface {
  lfHtmlAttributes?: Partial<LfFrameworkAllowedKeysMap>;
  lfShowSpinner?: boolean;
  lfSizeX?: string;
  lfSizeY?: string;
  lfStyle?: string;
  lfUiState?: LfThemeUIState;
  lfValue?: string;
}
//#endregion
