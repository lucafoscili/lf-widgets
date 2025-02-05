import { LfSpinnerPropsInterface } from "./spinner.declarations";

//#region Events
export const LF_SPINNER_EVENTS = ["ready", "unmount"] as const;
//#endregion

//#region Props
export const LF_SPINNER_PROPS = [
  "lfActive",
  "lfBarVariant",
  "lfDimensions",
  "lfFader",
  "lfFaderTimeout",
  "lfFullScreen",
  "lfLayout",
  "lfStyle",
  "lfTimeout",
] as const satisfies (keyof LfSpinnerPropsInterface)[];
//#endregion
