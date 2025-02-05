import type { VNode } from "@stencil/core";
import {
  LfComponentAdapter,
  LfComponentAdapterGetters,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
  LfComponentAdapterSetters,
} from "../foundations/adapter.declarations";
import { CY_ATTRIBUTES } from "../foundations/components.constants";
import { HTMLStencilElement, LfComponent } from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfCoreInterface } from "../framework/core.declarations";
import { LfDataDataset, LfDataShapes } from "../framework/data.declarations";
import { LfButtonElement, LfButtonEventPayload } from "./button.declarations";
import {
  LF_CAROUSEL_BLOCKS,
  LF_CAROUSEL_EVENTS,
  LF_CAROUSEL_PARTS,
} from "./carousel.constants";

//#region Class
export interface LfCarouselInterface
  extends LfComponent<"LfCarousel">,
    LfCarouselPropsInterface {}
export interface LfCarouselElement
  extends HTMLStencilElement,
    LfCarouselInterface {}
//#endregion

//#region Adapter
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
export interface LfCarouselAdapterJsx extends LfComponentAdapterJsx {
  back: () => VNode;
  forward: () => VNode;
}
export interface LfCarouselAdapterRefs extends LfComponentAdapterRefs {
  back: LfButtonElement;
  forward: LfButtonElement;
}
export interface LfCarouselAdapterHandlers extends LfComponentAdapterHandlers {
  button: (e: CustomEvent<LfButtonEventPayload>) => void;
}
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
export type LfCarouselAdapterInitializerSetters = Pick<
  LfCarouselAdapterControllerSetters,
  "index" | "interval"
>;
export interface LfCarouselAdapterControllerGetters
  extends LfComponentAdapterGetters<LfCarouselInterface> {
  blocks: typeof LF_CAROUSEL_BLOCKS;
  compInstance: LfCarouselInterface;
  cyAttributes: typeof CY_ATTRIBUTES;
  index: {
    current: () => number;
  };
  interval: () => NodeJS.Timeout;
  manager: LfCoreInterface;
  parts: typeof LF_CAROUSEL_PARTS;
  totalSlides: () => number;
}
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
export type LfCarouselEvent = (typeof LF_CAROUSEL_EVENTS)[number];
export interface LfCarouselEventPayload
  extends LfEventPayload<"LfCarousel", LfCarouselEvent> {}
//#endregion

//#region Props
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
