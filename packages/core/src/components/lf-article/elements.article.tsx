import { LfArticleAdapter, LfArticleAdapterJsx } from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { ArticleFC } from "./fc/article-fc";

/**
 * Prepares JSX factory functions for the article component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (hasNodes)
 * - Uses handlers for LfShape event forwarding
 * - Routes all events through dispatcher
 * - Delegates rendering to ArticleFC (pure presentational component)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepArticleJsx = (
  getAdapter: () => LfArticleAdapter,
): LfArticleAdapterJsx => {
  //#region Main JSX factory
  return {
    article: () => {
      const adapter = getAdapter();
      return <ArticleFC adapter={adapter} />;
    },
  };
  //#endregion
};
