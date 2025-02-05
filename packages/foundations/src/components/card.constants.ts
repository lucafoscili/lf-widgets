import {
  LfCardAdapter,
  LfCardLayout,
  LfCardPropsInterface,
} from "./card.declarations";
import { LF_ATTRIBUTES } from "../foundations/components.constants";
import {
  LfDataCell,
  LfDataShapeDefaults,
} from "../framework/data.declarations";

//#region Automatic CSS variables
export const LF_CARD_CSS_VARS = {
  height: "--lf_card_height",
  width: "--lf_card_width",
} as const;
//#endregion

//#region Blocks
export const LF_CARD_BLOCKS = {
  card: "card",
  debugLayout: {
    _: "debug-layout",
    section1: "section-1",
    section2: "section-2",
    section3: "section-3",
    section4: "section-4",
  },
  keywordsLayout: {
    _: "keywords-layout",
    section1: "section-1",
    section2: "section-2",
    section3: "section-3",
  },
  materialLayout: {
    _: "material-layout",
    actionsSection: "actions-section",
    coverSection: "cover-section",
    textSection: "text-section",
  },
  textContent: {
    _: "text-content",
    title: "title",
    subtitle: "subtitle",
    description: "description",
  },
  uploadLayout: {
    _: "upload-layout",
    section1: "section-1",
    section2: "section-2",
  },
} as const;
//#endregion

//#region Defaults
export const LF_CARD_DEFAULTS: (getAdapter: () => LfCardAdapter) => {
  [L in LfCardLayout]: LfDataShapeDefaults;
} = (getAdapter) => {
  return {
    debug: {
      button: (): LfDataCell<"button">[] => {
        const { current, themes } =
          getAdapter().controller.get.manager.theme.get;
        const { "--lf-icon-clear": clear } = current().variables;

        return [
          {
            htmlProps: {
              id: LF_CARD_IDS.clear,
            },
            lfIcon: clear,
            lfLabel: "Clear logs",
            lfStretchX: true,
            lfUiState: "danger",
            shape: "button",
            value: "",
          },
          {
            htmlProps: {
              id: LF_CARD_IDS.theme,
            },
            lfDataset: themes().asDataset,
            lfStretchX: true,
            shape: "button",
            value: "",
          },
        ];
      },
      code: (): LfDataCell<"code">[] => [
        { lfLanguage: "markdown", shape: "code", value: "" },
      ],
      toggle: (): LfDataCell<"toggle">[] => {
        const { debug } = getAdapter().controller.get.manager;

        return [
          {
            lfLeadingLabel: true,
            lfLabel: "Toggle debug",
            lfValue: debug.isEnabled(),
            shape: "toggle",
            value: false,
          },
        ];
      },
    },
    keywords: {
      button: (): LfDataCell<"button">[] => {
        const { "--lf-icon-copy": copy } =
          getAdapter().controller.get.manager.theme.get.current().variables;

        return [
          {
            lfIcon: copy,
            lfLabel: "Copy selected",
            lfStretchX: true,
            lfStyling: "flat",
            shape: "button",
            value: "",
          },
        ];
      },
      chart: (): LfDataCell<"chart">[] => [
        {
          lfLegend: "hidden",
          lfTypes: ["bar"],
          shape: "chart",
          value: "",
        },
      ],
      chip: (): LfDataCell<"chip">[] => [
        {
          lfStyle: "#lf-component .chip-set { height: auto; }",
          lfStyling: "filter",
          shape: "chip",
          value: "",
        },
      ],
    },
    material: {
      image: (): LfDataCell<"image">[] => [
        {
          htmlProps: {
            dataset: { lf: LF_ATTRIBUTES.fadeIn },
          },
          lfSizeX: "100%",
          lfSizeY: "100%",
          shape: "image",
          value: "",
        },
      ],
    },
    upload: {
      button: (): LfDataCell<"button">[] => [
        {
          lfIcon: "upload",
          lfLabel: "Upload",
          lfStretchX: true,
          shape: "button",
          value: "",
        },
      ],
    },
  };
};
//#endregion

//#region Events
export const LF_CARD_EVENTS = [
  "click",
  "contextmenu",
  "lf-event",
  "pointerdown",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Ids
export const LF_CARD_IDS = {
  clear: "clear",
  theme: "theme",
} as const;
//#endregion

//#region Layouts
export const LF_CARD_LAYOUTS = [
  "debug",
  "keywords",
  "material",
  "upload",
] as const;
//#endregion

//#region Parts
export const LF_CARD_PARTS = {
  card: "card",
  debugLayout: "debug-layout",
  keywordsLayout: "keywords-layout",
  materialLayout: "material-layout",
  uploadLayout: "upload-layout",
} as const;

//#region Props
export const LF_CARD_PROPS = [
  "lfDataset",
  "lfLayout",
  "lfSizeX",
  "lfSizeY",
  "lfStyle",
] as const satisfies (keyof LfCardPropsInterface)[];
//#endregion
