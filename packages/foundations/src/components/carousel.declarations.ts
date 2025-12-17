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
import { LfFrameworkInterface } from "../framework/framework.declarations";
import {
  LfDataDataset,
  LfDataShapes,
  LfDataShapesMap,
} from "../framework/data.declarations";

import {
  LF_CAROUSEL_BLOCKS,
  LF_CAROUSEL_EVENTS,
  LF_CAROUSEL_IDS,
  LF_CAROUSEL_PARTS,
} from "./carousel.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-carousel` component. It merges the shared component contract with the component-specific props.
 */
export interface LfCarouselInterface
  extends LfComponent<"LfCarousel">,
    LfCarouselPropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-carousel`.
 */
export interface LfCarouselElement
  extends HTMLStencilElement,
    Omit<LfCarouselInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-carousel` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Pure state reads (ALL must be functions `() => T`)
 * - controller.set: Simple single-value assignments
 * - controller.computed: Derived values, predicates (pure functions)
 * - controller.actions: Multi-step operations (toggles, batch changes)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfCarouselAdapter
  extends LfComponentAdapter<
    LfCarouselInterface,
    LfCarouselEventPayload,
    LfCarouselAdapterHandlers,
    LfCarouselAdapterJsx,
    LfCarouselAdapterRefs,
    LfCarouselAdapterControllerGetters,
    LfCarouselAdapterControllerSetters,
    LfCarouselAdapterControllerComputed,
    LfCarouselAdapterControllerActions
  > {
  controller: {
    get: LfCarouselAdapterControllerGetters;
    set: LfCarouselAdapterControllerSetters;
    computed: LfCarouselAdapterControllerComputed;
    actions: LfCarouselAdapterControllerActions;
  };
  dispatcher: LfCarouselAdapterDispatcher;
  elements: {
    jsx: LfCarouselAdapterJsx;
    refs: LfCarouselAdapterRefs;
  };
  handlers: LfCarouselAdapterHandlers;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfCarouselAdapterJsx extends LfComponentAdapterJsx {
  back: () => VNode;
  forward: () => VNode;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 */
export interface LfCarouselAdapterRefs extends LfComponentAdapterRefs {
  back: HTMLButtonElement;
  carousel: HTMLDivElement;
  forward: HTMLButtonElement;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfCarouselAdapterHandlers extends LfComponentAdapterHandlers {
  button: (e: MouseEvent, id: string) => void;
}
/**
 * Read-only controller surface exposed by the adapter for integration code.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 * Contains ONLY pure state reads - predicates go in `computed`.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfCarouselAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfCarouselInterface,
    (typeof LF_CAROUSEL_BLOCKS)["carousel"],
    typeof LF_CAROUSEL_IDS,
    typeof LF_CAROUSEL_PARTS
  > {
  /** Current slide index */
  currentIndex: () => number;
  /** Autoplay interval timer */
  interval: () => NodeJS.Timeout;
  /** Shapes map with slide data */
  shapes: () => LfDataShapesMap;
  /** Total number of slides */
  totalSlides: () => number;
}
/**
 * Simple single-value assignments exposed by the adapter.
 * Each setter performs exactly ONE state change.
 * Multi-step operations go in `actions`.
 */
export interface LfCarouselAdapterControllerSetters
  extends LfComponentAdapterSetters {
  /** Set current slide index directly */
  currentIndex: (value: number) => void;
  /** Set autoplay interval timer */
  interval: (value: NodeJS.Timeout) => void;
}
/**
 * Derived values and predicates computed from state.
 * Pure functions with no side effects.
 */
export interface LfCarouselAdapterControllerComputed {
  /** Predicate: can navigate to next slide */
  hasNext: () => boolean;
  /** Predicate: can navigate to previous slide */
  hasPrev: () => boolean;
  /** Predicate: has slides to display */
  hasSlides: () => boolean;
}
/**
 * Multi-step operations that may batch changes or toggle state.
 * May have side effects.
 */
export interface LfCarouselAdapterControllerActions {
  /** Navigation actions */
  navigation: {
    /** Go to next slide (wraps around) */
    next: () => void;
    /** Go to previous slide (wraps around) */
    prev: () => void;
    /** Go to specific slide by index with validation */
    goTo: (index: number) => void;
  };
  /** Autoplay actions */
  autoplay: {
    /** Start autoplay if conditions met */
    start: () => void;
    /** Stop autoplay and clear interval */
    stop: () => void;
  };
}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-carousel`.
 */
export type LfCarouselEvent = (typeof LF_CAROUSEL_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-carousel` events.
 */
export interface LfCarouselEventPayload
  extends LfEventPayload<"LfCarousel", LfCarouselEvent> {}
//#endregion

//#region Dispatcher
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfCarouselAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfCarouselEventPayload>;
export type LfCarouselAdapterDispatcherDetailOverrides = {
  [E in LfCarouselEvent]: E extends "lf-event"
    ? LfCarouselAdapterDispatchDetailBase & {
        originalEvent: CustomEvent;
      }
    : E extends "ready" | "unmount"
      ? Omit<LfCarouselAdapterDispatchDetailBase, "originalEvent"> & {
          originalEvent?: never;
        }
      : LfCarouselAdapterDispatchDetailBase;
};
export type LfCarouselAdapterDispatcher = LfComponentAdapterDispatcher<
  LfCarouselEventPayload,
  LfCarouselAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-carousel` component.
 */
export interface LfCarouselPropsInterface {
  lfAutoPlay?: boolean;
  lfDataset?: LfDataDataset;
  lfInterval?: number;
  lfLightbox?: boolean;
  lfNavigation?: boolean;
  lfShape?: LfDataShapes;
  lfStyle?: string;
}
//#endregion

//#region FC Props
/**
 * Props interface for the LfCarouselFC functional component.
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfCarouselFCProps {
  /** Reference callback for the carousel container element */
  carouselRef?: (el: HTMLDivElement | null) => void;
  /** Assigned class for custom styling */
  className?: string;
  /** Current slide index being displayed */
  currentIndex: number;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Unique identifier for the component */
  id?: string;
  /** Whether lightbox mode is enabled (adds pointer cursor) */
  lightbox?: boolean;
  /** Whether navigation buttons are visible */
  navigation?: boolean;
  /** Callback fired when back button is clicked */
  onBack?: () => void;
  /** Callback fired when forward button is clicked */
  onForward?: () => void;
  /** Callback fired when a segment (indicator) is clicked */
  onSegmentClick?: (index: number) => void;
  /** Callback fired on LfShape event dispatch */
  onShapeEvent?: (e: CustomEvent) => void;
  /** Shape type for rendering slides */
  shape: LfDataShapes;
  /** Shapes map containing slide data */
  shapes: LfDataShapesMap;
  /** Custom CSS styles to apply (object format for Stencil JSX) */
  style?: { [key: string]: string };
  /** Total number of slides */
  totalSlides: number;
}
//#endregion
