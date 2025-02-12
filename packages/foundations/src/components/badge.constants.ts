import { LfBadgePropsInterface } from "./badge.declarations";

//#region Blocks
export const LF_BADGE_BLOCKS = {
  badge: { _: "badge", image: "image", label: "label" },
} as const;
//#endregion

//#region Events
export const LF_BADGE_EVENTS = [
  "click",
  "lf-event",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_BADGE_PARTS = {
  badge: "badge",
  image: "image",
  label: "label",
} as const;
//#endregion

//#region Positions
export const LF_BADGE_POSITIONS = [
  "bottom-left",
  "bottom-right",
  "top-left",
  "top-right",
] as const;
//#endregion

//#region Props
export const LF_BADGE_PROPS = [
  "lfImageProps",
  "lfLabel",
  "lfPosition",
  "lfStyle",
  "lfUiState",
] as const satisfies (keyof LfBadgePropsInterface)[];
//#endregion
