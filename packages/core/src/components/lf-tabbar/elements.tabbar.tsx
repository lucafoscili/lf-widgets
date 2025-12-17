import { LfTabbarAdapter, LfTabbarAdapterJsx } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { TabbarFC } from "./fc/tabbar-fc";

/**
 * Prepares JSX factory functions for the tabbar component.
 *
 * v4.0.0 Architecture:
 * - Uses FC-first architecture via TabbarFC wrapper
 * - TabbarFC composes LfTabbarFC (pure presentational) with adapter state
 * - Routes all events through handlers
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepTabbarElements = (
  getAdapter: () => LfTabbarAdapter,
): LfTabbarAdapterJsx => {
  return {
    //#region Tabbar
    tabbar: (): VNode => {
      const adapter = getAdapter();
      return <TabbarFC adapter={adapter} />;
    },
    //#endregion
  };
};
