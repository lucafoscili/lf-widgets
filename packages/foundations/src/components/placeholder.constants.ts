import { LfPlaceholderPropsInterface } from "./placeholder.declarations";

//#region Blocks
export const LF_PLACEHOLDER_BLOCKS = {
  placeholder: { _: "placeholder", icon: "icon" },
} as const;
//#endregion

//#region Events
export const LF_PLACEHOLDER_EVENTS = ["lf-event", "load", "ready", "unmount"] as const;
//#endregion

//#region Parts
export const LF_PLACEHOLDER_PARTS = {
  icon: "icon",
  placeholder: "placeholder",
} as const;
//#endregion

//#region Props
export const LF_PLACEHOLDER_PROPS = [
  "lfValue",
  "lfProps",
  "lfTrigger",
  "lfIcon",
  "lfStyle",
  "lfThreshold",
] as const satisfies (keyof LfPlaceholderPropsInterface)[];
//#endregion

//#region Triggers
export const LF_PLACEHOLDER_TRIGGERS = ["both", "props", "viewport"] as const;
//#endregion
