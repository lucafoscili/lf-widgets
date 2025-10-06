import {
  LfComponentAdapter,
  LfComponentAdapterGetters,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
  LfComponentAdapterSetters,
} from "../foundations/adapter.declarations";
import { CY_ATTRIBUTES } from "../foundations/components.constants";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset, LfDataShapes } from "../framework/data.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import { LfButtonElement, LfButtonEventPayload } from "./button.declarations";
import {
  LF_CAROUSEL_BLOCKS,
  LF_CAROUSEL_EVENTS,
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
 */
export interface LfCarouselAdapter
  extends LfComponentAdapter<LfCarouselInterface> {
  controller: {
    get: LfCarouselAdapterControllerGetters;
    set: LfCarouselAdapterControllerSetters;
  };
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
  back: LfButtonElement;
  forward: LfButtonElement;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfCarouselAdapterHandlers extends LfComponentAdapterHandlers {
  button: (e: CustomEvent<LfButtonEventPayload>) => void;
}
/**
 * Subset of adapter getters required during initialisation.
 */
export type LfCarouselAdapterInitializerGetters = Pick<
  LfCarouselAdapterControllerGetters,
  | "blocks"
  | "compInstance"
  | "cyAttributes"
  | "index"
  | "interval"
  | "manager"
  | "parts"
  | "totalSlides"
>;
/**
 * Subset of adapter setters required during initialisation.
 */
export type LfCarouselAdapterInitializerSetters = Pick<
  LfCarouselAdapterControllerSetters,
  "index" | "interval"
>;
/**
 * Read-only controller surface exposed by the adapter for integration code.
 */
export interface LfCarouselAdapterControllerGetters
  extends LfComponentAdapterGetters<LfCarouselInterface> {
  blocks: typeof LF_CAROUSEL_BLOCKS;
  compInstance: LfCarouselInterface;
  cyAttributes: typeof CY_ATTRIBUTES;
  index: {
    current: () => number;
  };
  interval: () => NodeJS.Timeout;
  manager: LfFrameworkInterface;
  parts: typeof LF_CAROUSEL_PARTS;
  totalSlides: () => number;
}
/**
 * Imperative controller callbacks exposed by the adapter.
 */
export interface LfCarouselAdapterControllerSetters
  extends LfComponentAdapterSetters {
  autoplay: {
    start: () => void;
    stop: () => void;
  };
  index: {
    current: (value: number) => void;
    next: () => void;
    previous: () => void;
  };
  interval: (value: NodeJS.Timeout) => void;
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
