import {
  LF_CORE_EVENT_NAME,
  LF_CORE_SYMBOL_ID,
  type LfCoreEventPayload,
  type LfCoreInterface,
} from "@lf-widgets/foundations";
import { LfCore } from "./lf-core/lf-core";

declare global {
  interface Window {
    [SYMBOL]: LfCoreInterface;
  }
}
/**
 * Symbol used to identify the LfCore service.
 * This unique symbol serves as a dependency injection token.
 *
 * @const {unique symbol}
 */
export const SYMBOL: unique symbol = Symbol.for(LF_CORE_SYMBOL_ID);
let lfCore: LfCore | null = null;

//#region getLfCore
/**
 * Retrieves an instance of the global LfCore. If it has not yet been created,
 * this function initializes it before returning the instance.
 *
 * @returns The current LfCore instance.
 *
 * @example
 * ```typescript
 * const lfCore = getLfCore();
 * ```
 */
export function getLfCore(): LfCore {
  const isDev = process.env.NODE_ENV === "development";

  if (!lfCore) {
    if (isDev) {
      console.warn(
        "Initializing LfCore for the first time. This should only happen once.",
      );
    }
    initLfCore();
    if (!lfCore) {
      throw new Error("Failed to initialize LfCore.");
    }
  }
  return lfCore;
}
//#endregion

//#region initLfCore
function initLfCore() {
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    console.log("Initializing LfCore...");
  }

  if (lfCore) {
    if (isDev) {
      console.warn(
        "LfCore has already been initialized. This should only happen once.",
      );
      return;
    }
  }

  const isClient = typeof window !== "undefined";
  const core = new LfCore();
  lfCore = core;

  if (isClient) {
    window[SYMBOL] = core;
    const ev = new CustomEvent<LfCoreEventPayload>(LF_CORE_EVENT_NAME, {
      detail: { lfCore: core },
    });

    document.dispatchEvent(ev);
    if (isDev) {
      console.log("LfCore initialized and dispatched to window.", core);
    }
  } else {
    if (isDev) {
      console.warn("LfCore initialized but not dispatched to window.", core);
    }
  }
}

//#endregion
