import { LfMasonryPropsInterface } from "./masonry.declarations";

//#region Automatic CSS Variables
export const LF_MASONRY_CSS_VARS = { columns: "--lf_masonry_columns" } as const;
//#endregion

//#region Blocks
export const LF_MASONRY_BLOCKS = {
  grid: {
    _: "grid",
    actions: "actions",
    addColumn: "add-column",
    capture: "capture",
    changeViewe: "change-view",
    column: "column",
    removeColumn: "remove-column",
    sub: "sub",
  },
  masonry: { _: "masonry" },
} as const;
//#endregion

//#region Defaults
export const LF_MASONRY_DEFAULT_COLUMNS = [640, 768, 1024, 1920, 2560] as const;
//#endregion

//#region Events
export const LF_MASONRY_EVENTS = [
  "click",
  "lf-event",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Ids
export const LF_MASONRY_IDS = {
  addColumn: "add-column",
  horizontal: "horizontal",
  masonry: "masonry",
  removeColumn: "remove-column",
  vertical: "vertical",
} as const;
//#endregion

//#region Parts
export const LF_MASONRY_PARTS = {
  addColumn: "add-column",
  changeView: "change-view",
  masonry: "masonry",
  removeColumn: "remove-column",
} as const;
//#endregion

//#region Props
export const LF_MASONRY_PROPS = [
  "lfActions",
  "lfCollapseColumns",
  "lfColumns",
  "lfDataset",
  "lfSelectable",
  "lfShape",
  "lfStyle",
  "lfView",
] as const satisfies (keyof LfMasonryPropsInterface)[];
//#endregion

//#region Views
export const LF_MASONRY_VIEWS = ["horizontal", "main", "vertical"] as const;
//#endregion
