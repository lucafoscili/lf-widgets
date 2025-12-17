import { LfSplashAdapter, LfSplashAdapterJsx } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { SplashFC } from "./fc/splash-fc";

/**
 * Prepares JSX factory functions for the splash component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (isUnmounting)
 * - Routes all events through dispatcher
 * - Delegates rendering to SplashFC which composes LfSplashFC
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepSplashJsx = (
  getAdapter: () => LfSplashAdapter,
): LfSplashAdapterJsx => {
  return {
    //#region Splash
    splash: (): VNode => {
      const adapter = getAdapter();
      return <SplashFC adapter={adapter} />;
    },
    //#endregion
  };
};
