import { LfTabbarPropsInterface } from "./tabbar.declarations";

//#region Blocks
export const LF_TABBAR_BLOCKS = {
  tab: {
    _: "tab",
    content: "content",
    icon: "icon",
    indicator: "indicator",
    indicatorContent: "indicator-content",
    label: "label",
  },
  tabbar: {
    _: "tabbar",
    scroll: "scroll",
  },
} as const;
//#endregion

//#region Events
export const LF_TABBAR_EVENTS = [
  "click",
  "pointerdown",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_TABBAR_PARTS = {
  tab: "tab",
  tabbbar: "tabbar",
} as const;
//#endregion

//#region Props
export const LF_TABBAR_PROPS = [
  "lfDataset",
  "lfNavigation",
  "lfRipple",
  "lfStyle",
  "lfUiSize",
  "lfUiState",
  "lfValue",
] as const satisfies (keyof LfTabbarPropsInterface)[];
//#endregion

//#region Scroll
export const LF_TABBAR_SCROLL = ["left", "right"] as const;
//#endregion
