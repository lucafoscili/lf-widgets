export { Build, getAssetPath, setAssetPath } from "@stencil/core";

import {
  LF_FRAMEWORK_EVENT_NAME,
  LF_FRAMEWORK_SYMBOL_ID,
  LfFrameworkEventPayload,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { Build } from "@stencil/core";
import { LfFramework } from "./lf-core/lf-core";

declare global {
  interface Window {
    [SYMBOL]: LfFrameworkInterface;
  }
}
/**
 * Symbol used to identify the LfFramework service.
 * This unique symbol serves as a dependency injection token.
 *
 * @const {unique symbol}
 */
export const SYMBOL: unique symbol = Symbol.for(LF_FRAMEWORK_SYMBOL_ID);
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

  if (Build.isDev) {
    console.log("Initializing LfFramework...");
  }

  if (lfFramework) {
    if (isDev) {
      console.warn(
        "LfFramework has already been initialized. This should only happen once.",
      );
      return;
    }
  }

  const isClient = typeof window !== "undefined";
  const framework = new LfFramework();
  lfFramework = framework;

  if (isClient) {
    window[SYMBOL] = framework;
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
