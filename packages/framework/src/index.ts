import {
  LF_FRAMEWORK_EVENT_NAME,
  LF_FRAMEWORK_SYMBOL,
  LfFrameworkEventPayload,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { Build } from "@stencil/core";
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
  const { isDev } = Build;

  if (!lfFramework) {
    if (isDev) {
      console.warn(
        "Initializing LfFramework for the first time. This should only happen once.",
      );
    }
    initLfFramework();
    if (!lfFramework) {
      throw new Error("Failed to initialize LfFramework.");
    }
  }
  return lfFramework;
}
//#endregion

//#region initLfFramework
function initLfFramework() {
  const { isDev } = Build;
  const isInitialized =
    (isClient && window[LF_FRAMEWORK_SYMBOL]) || lfFramework;

  if (isDev) {
    console.log("Initializing LfFramework...");
  }

  if (isInitialized) {
    if (isDev) {
      console.warn(
        "LfFramework has already been initialized. This should only happen once.",
      );
      return;
    }
  }

  const framework = new LfFramework();
  lfFramework = framework;

  if (isClient) {
    window[LF_FRAMEWORK_SYMBOL] = framework;
    const ev = new CustomEvent<LfFrameworkEventPayload>(
      LF_FRAMEWORK_EVENT_NAME,
      {
        detail: { lfFramework: framework },
      },
    );

    document.dispatchEvent(ev);
    if (isDev) {
      console.log(
        "LfFramework initialized and dispatched to window.",
        framework,
      );
    }
  } else {
    if (isDev) {
      console.warn(
        "LfFramework initialized but not dispatched to window.",
        framework,
      );
    }
  }
}

//#endregion
