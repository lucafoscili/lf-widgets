import { LfUploadPropsInterface } from "./upload.declarations";

//#region Blocks
export const LF_UPLOAD_BLOCKS = {
  fileInfo: {
    _: "file-info",
    clear: "clear",
    icon: "icon",
    item: "item",
    name: "name",
    size: "size",
  },
  fileUpload: {
    _: "file-upload",
    input: "input",
    label: "label",
    text: "text",
  },
  upload: { _: "upload" },
} as const;
//#endregion

//#region Events
export const LF_UPLOAD_EVENTS = [
  "delete",
  "pointerdown",
  "ready",
  "unmount",
  "upload",
] as const;
//#endregion

//#region Parts
export const LF_UPLOAD_PARTS = {
  fileInfo: "file-info",
  icon: "icon",
  upload: "upload",
} as const;
//#endregion

//#region Props
export const LF_UPLOAD_PROPS = [
  "lfLabel",
  "lfRipple",
  "lfStyle",
  "lfValue",
] as const satisfies (keyof LfUploadPropsInterface)[];
//#endregion
