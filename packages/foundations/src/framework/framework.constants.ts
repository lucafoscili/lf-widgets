//#region Allowed attributes
export const LF_FRAMEWORK_ALLOWED_ATTRS = [
  "alt",
  "autocomplete",
  "autofocus",
  "checked",
  "class",
  "disabled",
  "href",
  "htmlProps",
  "id",
  "max",
  "maxLength",
  "min",
  "minLength",
  "multiple",
  "name",
  "placeholder",
  "readonly",
  "role",
  "src",
  "srcset",
  "step",
  "title",
  "type",
  "value",
] as const;
//#endregion

//#region Allowed prefixes
export const LF_FRAMEWORK_ALLOWED_PREFIXES = ["aria", "data"] as const;
//#endregion

//#region Event
export const LF_FRAMEWORK_EVENT_NAME = "lf-core-event" as const;
//#endregion

//#region Symbol
export const LF_FRAMEWORK_SYMBOL_ID = "__LfFramework__" as const;
//#endregion
