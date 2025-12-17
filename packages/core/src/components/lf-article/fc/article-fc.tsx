import { LfArticleAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfArticleFC } from "../lf-article-fc";

//#region Props
export interface ArticleFCProps {
  adapter: LfArticleAdapter;
}
//#endregion

/**
 * FC for the article component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfArticleFC (pure presentational) with adapter state.
 */
export const ArticleFC: FunctionalComponent<ArticleFCProps> = ({ adapter }) => {
  const { controller } = adapter;
  const { get, computed } = controller;

  const framework = get.framework();
  const compInstance = get.compInstance();

  const { lfDataset, lfEmpty } = compInstance;

  return (
    <LfArticleFC
      adapter={adapter}
      dataset={lfDataset}
      empty={lfEmpty}
      framework={framework}
      hasNodes={computed.hasNodes}
    />
  );
};
