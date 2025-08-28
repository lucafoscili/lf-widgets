import { LfImagePropsInterface } from "./image.declarations";

//#region Automatic CSS variables
export const LF_IMAGE_CSS_VARS = {
  brokenImage: "--lf_broken_image",
  height: "--lf_image_height",
  mask: "--lf_image_mask",
  width: "--lf_image_width",
} as const;
//#endregion

//#region Blocks
export const LF_IMAGE_BLOCKS = {
  image: { _: "image", icon: "icon", img: "img" },
} as const;
//#endregion

//#region Events
export const LF_IMAGE_EVENTS = [
  "click",
  "contextmenu",
  "error",
  "load",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_IMAGE_PARTS = {
  icon: "icon",
  image: "image",
  img: "img",
} as const;
//#endregion

//#region Props
export const LF_IMAGE_PROPS = [
  "lfHtmlAttributes",
  "lfSizeX",
  "lfSizeY",
  "lfStyle",
  "lfUiState",
  "lfValue",
  "lfMode",
] as const satisfies (keyof LfImagePropsInterface)[];
//#endregion
