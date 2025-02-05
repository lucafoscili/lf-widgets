import { LfCarouselPropsInterface } from "./carousel.declarations";

//#region Blocks
export const LF_CAROUSEL_BLOCKS = {
  carousel: {
    _: "carousel",
    back: "back",
    forward: "forward",
    slide: "slide",
    track: "track",
  },
  slideBar: {
    _: "slide-bar",
    segment: "segment",
  },
} as const;
//#endregion

//#region Events
export const LF_CAROUSEL_EVENTS = ["lf-event", "ready", "unmount"] as const;
//#endregion

//#region Ids
export const LF_CAROUSEL_IDS = {
  back: "back-button",
  forward: "forward-button",
} as const;
//#endregion

//#region Parts
export const LF_CAROUSEL_PARTS = {
  back: "back",
  carousel: "carousel",
  forward: "forward",
  segment: "segment",
  slideBar: "slide-bar",
  track: "track",
} as const;
//#endregion

//#region Props
export const LF_CAROUSEL_PROPS = [
  "lfAutoPlay",
  "lfDataset",
  "lfInterval",
  "lfLightbox",
  "lfNavigation",
  "lfShape",
  "lfStyle",
] as const satisfies (keyof LfCarouselPropsInterface)[];
//#endregion
