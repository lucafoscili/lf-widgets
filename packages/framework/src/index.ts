import {
  LF_FRAMEWORK_EVENT_NAME,
  LF_FRAMEWORK_SYMBOL,
  LfFrameworkEventPayload,
  LfFrameworkInterface,
  markFrameworkReady,
} from "@lf-widgets/foundations";
import { LfFramework } from "./lf-framework/lf-framework";

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
