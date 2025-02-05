import { LfPhotoframePropsInterface } from "./photoframe.declarations";

//#region Blocks
export const LF_PHOTOFRAME_BLOCKS = {
  overlay: {
    _: "overlay",
    content: "content",
    description: "description",
    icon: "icon",
    title: "title",
  },
  photoframe: {
    _: "photoframe",
    image: "image",
    placeholder: "placeholder",
  },
} as const;
//#endregion

//#region Events
export const LF_PHOTOFRAME_EVENTS = [
  "load",
  "overlay",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Orientation
export const LF_PHOTOFRAME_ORIENTATION = [
  "",
  "horizontal",
  "vertical",
] as const;
//#endregion

//#region Parts
export const LF_PHOTOFRAME_PARTS = {
  description: "description",
  icon: "icon",
  image: "image",
  overlay: "overlay",
  photoframe: "photoframe",
  placeholder: "placeholder",
  title: "title",
} as const;
//#endregion

//#region Props
export const LF_PHOTOFRAME_PROPS = [
  "lfOverlay",
  "lfPlaceholder",
  "lfStyle",
  "lfThreshold",
  "lfValue",
] as const satisfies (keyof LfPhotoframePropsInterface)[];
//#endregion
