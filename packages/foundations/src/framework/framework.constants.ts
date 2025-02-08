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

//#region Modules
export const LF_FRAMEWORK_MODULES = [
  "lf-core",
  "lf-framework",
  "lf-showcase",
] as const;
//#endregion

//#region Symbol
/**
 * Symbol used to identify the LfFramework service.
 * This unique symbol serves as a dependency injection token.
 *
 * @const {unique symbol}
 */
export const LF_FRAMEWORK_SYMBOL_KEY = "__LfFramework__" as const;
export const LF_FRAMEWORK_SYMBOL: unique symbol = Symbol.for(
  LF_FRAMEWORK_SYMBOL_KEY,
);
//#endregion
