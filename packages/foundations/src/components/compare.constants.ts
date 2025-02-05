import {
  LfCompareAdapterDefaults,
  LfComparePropsInterface,
} from "./compare.declarations";
import { LF_ATTRIBUTES } from "../foundations/components.constants";
import { LfDataCell } from "../framework/data.declarations";

//#region Automatic CSS variables
export const LF_COMPARE_CSS_VARS = {
  overlayWidth: "--lf_compare_overlay_width",
} as const;
//#endregion

//#region Blocks
export const LF_COMPARE_BLOCKS = {
  compare: { _: "compare", grid: "grid" },
  toolbar: {
    _: "toolbar",
    panel: "panel",
  },
  view: {
    _: "view",
    input: "input",
    left: "left",
    right: "right",
    slider: "slider",
  },
} as const;
//#endregion

//#region Defaults
export const LF_COMPARE_DEFAULTS = (): LfCompareAdapterDefaults => {
  return {
    left: {
      image: (): LfDataCell<"image">[] => [
        {
          htmlProps: {
            dataset: {
              lf: LF_ATTRIBUTES.fadeIn,
            },
          },
          lfSizeX: "100%",
          lfSizeY: "100%",
          shape: "image",
          value: "",
        },
      ],
    },
    right: {
      image: (): LfDataCell<"image">[] => [
        {
          htmlProps: {
            dataset: {
              lf: LF_ATTRIBUTES.fadeIn,
            },
          },
          lfSizeX: "100%",
          lfSizeY: "100%",
          shape: "image",
          value: "",
        },
      ],
    },
  };
};
//#endregion

//#region Events
export const LF_COMPARE_EVENTS = ["lf-event", "ready", "unmount"] as const;
//#endregion

//#region Ids
export const LF_COMPARE_IDS = {
  leftButton: "toggle-left-button",
  leftTree: "toggle-left-tree",
  rightButton: "toggle-right-button",
  rightTree: "toggle-right-tree",
  changeView: "change-view",
} as const;
//#endregion

//#region Parts
export const LF_COMPARE_PARTS = {
  changeView: "changeView",
  compare: "compare",
  leftButton: "leftButton",
  leftTree: "leftTree",
  rightButton: "rightButton",
  rightTree: "rightTree",
} as const;
//#endregion

//#region Props
export const LF_COMPARE_PROPS = [
  "lfDataset",
  "lfShape",
  "lfStyle",
  "lfView",
] as const satisfies (keyof LfComparePropsInterface)[];
//#endregion

//#region Views
export const LF_COMPARE_VIEWS = ["main", "split"] as const;
//#endregion
