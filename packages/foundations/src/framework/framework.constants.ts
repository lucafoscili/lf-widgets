import { LfFrameworkInterface } from "./framework.declarations";

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

//#region Framework Ready Promise
/**
 * Internal resolver for the framework readiness promise.
 */
let _resolveFrameworkReady: ((framework: LfFrameworkInterface) => void) | null =
  null;
/**
 * Global Promise that resolves when LfFramework is ready.
 * Components and downstream modules should await this promise in their async lifecycle hooks.
 */
export const onFrameworkReady = new Promise<LfFrameworkInterface>((resolve) => {
  _resolveFrameworkReady = resolve;
});
/**
 * Marks when the framework has been successfully initialized.
 * It resolves the onFrameworkReady promise and clears the internal resolver to ensure it's only called once.
 */
export function markFrameworkReady(framework: LfFrameworkInterface): void {
  if (_resolveFrameworkReady) {
    _resolveFrameworkReady(framework);
    _resolveFrameworkReady = null;
  }
}
//#endregion
