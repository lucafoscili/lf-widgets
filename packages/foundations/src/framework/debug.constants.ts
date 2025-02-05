//#region Categories
export const LF_DEBUG_CATEGORIES = [
  "informational",
  "warning",
  "error",
  "success",
] as const;
//#endregion

//#region Lifecycles
export const LF_DEBUG_LIFECYCLES = [
  "custom",
  "did-load",
  "did-render",
  "will-render",
] as const;
//#endregion

//#region Log types
export const LF_DEBUG_LOG_TYPES = ["load", "misc", "render", "resize"] as const;
//#endregion
