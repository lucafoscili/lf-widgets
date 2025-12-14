import { LfUploadPropsInterface } from "./upload.declarations";

//#region Blocks
/**
 * BEM block structure for the upload component.
 * Maps directly to CSS classes and DOM refs.
 * @see Section 6.3 of 4_0_0_REFACTORING.md
 */
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

//#region IDs
/**
 * DOM element IDs used by the upload component.
 * Structure mirrors BLOCKS for consistency.
 */
export const LF_UPLOAD_IDS = {
  input: "upload-input",
  label: "upload-label",
  fileInfo: "file-info",
  upload: "upload",
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
  "lfHtmlAttributes",
  "lfLabel",
  "lfRipple",
  "lfStyle",
  "lfValue",
] as const satisfies (keyof LfUploadPropsInterface)[];
//#endregion
