import { LfShapeeditorAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfShapeeditorFC } from "../lf-shapeeditor-fc";

//#region Props
export interface ShapeeditorFCProps {
  adapter: LfShapeeditorAdapter;
}
//#endregion

/**
 * FC for the shapeeditor component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfShapeeditorFC (pure presentational) with adapter state.
 *
 * v4.0.0 Architecture:
 * - Adapter provides all state via controller.get
 * - Handlers wire events to adapter.dispatcher
 * - JSX factories handle panel rendering
 */
export const ShapeeditorFC: FunctionalComponent<ShapeeditorFCProps> = ({
  adapter,
}) => {
  const { controller, elements } = adapter;
  const { get, computed } = controller;

  const framework = get.framework();
  const compInstance = get.compInstance();
  const blocks = get.blocks();
  const parts = get.parts();

  const currentShape = get.currentShape();
  const historyIsPopupOpen = get.history.isPopupOpen();
  const isNavigationTreeOpen = get.navigation.isTreeOpen();
  const hasNav = computed.navigation.hasNav();

  const { lfLoadCallback, lfNavigation } = compInstance;

  // Determine panel visibility
  const shouldShowLoad = Boolean(lfLoadCallback);
  const shouldShowExpander =
    hasNav && Boolean(lfNavigation?.treeProps?.lfDataset);
  const shouldShowTree = shouldShowExpander && isNavigationTreeOpen;
  const shouldShowHistory = historyIsPopupOpen;
  const hasSelection = !!currentShape;

  // Get JSX factories
  const { navigation, preview, settings } = elements.jsx;
  const { explorer, jump, masonry } = navigation;
  const { history, shape, spinner } = preview;
  const { actions, controls, progressbar, tree } = settings;

  return (
    <LfShapeeditorFC
      blocks={blocks}
      explorerJsx={shouldShowExpander ? explorer : undefined}
      framework={framework}
      hasSelection={hasSelection}
      jumpJsx={shouldShowLoad ? jump : undefined}
      masonryJsx={masonry}
      parts={parts}
      shouldShowHistory={shouldShowHistory}
      shouldShowLoad={shouldShowLoad}
      shouldShowTree={shouldShowTree}
      historyJsx={shouldShowHistory ? history : undefined}
      shapeJsx={shape}
      spinnerJsx={spinner}
      actionsJsx={actions}
      controlsJsx={controls}
      progressbarJsx={progressbar}
      treeJsx={tree}
    />
  );
};
