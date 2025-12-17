import { LfCompareAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfCompareFC } from "../lf-compare-fc";

//#region Props
export interface CompareFCProps {
  adapter: LfCompareAdapter;
}
//#endregion

/**
 * FC wrapper for the compare component.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfCompareFC (pure presentational) with adapter state.
 */
export const CompareFC: FunctionalComponent<CompareFCProps> = ({ adapter }) => {
  const { controller, elements } = adapter;
  const { get, computed } = controller;

  const framework = get.framework();
  const compInstance = get.compInstance();
  const { assignRef } = framework;
  const { refs } = elements;

  // Get values from adapter getters (not directly from compInstance)
  const isLeftPanelOpened = get.leftPanelOpened();
  const isRightPanelOpened = get.rightPanelOpened();
  const leftShape = get.leftShape();
  const rightShape = get.rightShape();
  const { lfShape, lfView } = compInstance;

  return (
    <LfCompareFC
      adapter={adapter}
      compareRef={assignRef(refs, "slider")}
      framework={framework}
      hasShapes={computed.hasShapes()}
      isLeftPanelOpened={isLeftPanelOpened}
      isOverlay={computed.isOverlay()}
      isRightPanelOpened={isRightPanelOpened}
      leftShape={leftShape}
      rightShape={rightShape}
      shape={lfShape}
      view={lfView}
    />
  );
};
