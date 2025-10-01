import {
  LF_FRAMEWORK_EVENT_NAME,
  LF_FRAMEWORK_SYMBOL,
  LfFrameworkEventPayload,
  LfFrameworkInterface,
  markFrameworkReady,
} from "@lf-widgets/foundations";
import { LfFramework } from "./lf-framework/lf-framework";

export * from "./lf-syntax/languages/prism.css.highlight";
export * from "./lf-syntax/languages/prism.javascript.highlight";
export * from "./lf-syntax/languages/prism.json.highlight";
export * from "./lf-syntax/languages/prism.jsx.highlight";
export * from "./lf-syntax/languages/prism.markdown.highlight";
export * from "./lf-syntax/languages/prism.markup.highlight";
export * from "./lf-syntax/languages/prism.python.highlight";
export * from "./lf-syntax/languages/prism.regex.highlight";
export * from "./lf-syntax/languages/prism.scss.highlight";
export * from "./lf-syntax/languages/prism.tsx.highlight";
export * from "./lf-syntax/languages/prism.typescript.highlight";

declare global {
  interface Window {
    [symbol: symbol]: LfFrameworkInterface;
  }
}
const isClient = typeof window !== "undefined";
let lfFramework: LfFramework | null = null;

//#region getLfFramework
/**
 * Retrieves an instance of the global LfFramework. If it has not yet been created,
 * this function initializes it before returning the instance.
 *
 * @returns The current LfFramework instance.
 *
 * @example
 * ```typescript
 * const lfFramework = getLfFramework();
 * ```
 */
export function getLfFramework(): LfFramework {
  if (!lfFramework) {
    initLfFramework();
    if (!lfFramework) {
      throw new Error("Failed to initialize LfFramework.");
    }
  }
  return lfFramework;
}
//#endregion

//#region Helpers
function initLfFramework() {
  const isInitialized =
    (isClient && window[LF_FRAMEWORK_SYMBOL]) || lfFramework;

  if (isInitialized) {
    return;
  }

  const framework = new LfFramework();
  lfFramework = framework;

  if (isClient) {
    finalize(framework);
  }
}
const finalize = (framework: LfFrameworkInterface) => {
  window[LF_FRAMEWORK_SYMBOL] = framework;
  markFrameworkReady(framework);

  const ev = new CustomEvent<LfFrameworkEventPayload>(LF_FRAMEWORK_EVENT_NAME, {
    detail: { lfFramework: framework },
  });

  document.dispatchEvent(ev);
};
//#endregion
