import { LfTreeAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfTreeFC } from "../lf-tree-fc";

//#region Props
export interface TreeFCProps {
  adapter: LfTreeAdapter;
}
//#endregion

/**
 * FC for the tree component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfTreeFC (pure presentational) with adapter state.
 */
export const TreeFC: FunctionalComponent<TreeFCProps> = ({ adapter }) => {
  const { controller, elements, handlers } = adapter;
  const { get, computed } = controller;

  const framework = get.framework();
  const compInstance = get.compInstance();
  const blocks = get.blocks();
  const parts = get.parts();

  const {
    lfAccordionLayout,
    lfDataset,
    lfEmpty,
    lfFilter,
    lfGrid,
    lfSelectable,
    lfUiSize,
  } = compInstance;

  const filterValue = get.filterValue();
  const columns = get.columns();
  const isEmpty = !lfDataset?.nodes?.length;

  return (
    <LfTreeFC
      accordionLayout={lfAccordionLayout}
      blocks={blocks}
      columns={columns}
      computed={computed}
      dataset={lfDataset}
      elements={elements}
      emptyText={lfEmpty}
      filterValue={filterValue}
      framework={framework}
      grid={lfGrid}
      handlers={handlers}
      isEmpty={isEmpty}
      parts={parts}
      selectable={lfSelectable}
      showFilter={lfFilter}
      uiSize={lfUiSize}
    />
  );
};
