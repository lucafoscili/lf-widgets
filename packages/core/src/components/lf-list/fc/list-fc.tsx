import { LfListAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfListFC } from "../lf-list-fc";

//#region Props
export interface ListFCProps {
  adapter: LfListAdapter;
}
//#endregion

/**
 * FC for the list component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfListFC (pure presentational) with adapter state.
 *
 * This wrapper bridges the adapter pattern (used by the Web Component)
 * with the pure functional component. It extracts state from the adapter
 * and passes it as props to LfListFC.
 */
export const ListFC: FunctionalComponent<ListFCProps> = ({ adapter }) => {
  const { controller, handlers } = adapter;
  const { get, computed } = controller;
  const { refs } = adapter.elements;

  const framework = get.framework();
  const compInstance = get.compInstance();
  const { assignRef } = framework;

  const {
    lfDataset,
    lfEmpty,
    lfEnableDeletions,
    lfSelectable,
    lfUiSize,
    lfUiState,
  } = compInstance;

  // Get the selected index from original dataset
  const selected = get.selected();
  const focused = get.focused();

  // Get visible (filtered) nodes
  const hiddenNodes = get.hiddenNodes();
  const visibleNodes =
    lfDataset?.nodes?.filter((node) => !hiddenNodes.has(node)) || [];

  // Check if filtered list is empty
  const isFilteredEmpty = computed.isFilteredEmpty();
  const isEmpty = computed.isEmpty();

  // Determine the empty message
  const emptyMessage = isFilteredEmpty
    ? "No items match your filter."
    : lfEmpty;

  // Find the visible index that corresponds to the selected original index
  const selectedVisibleIndex =
    selected !== null && selected !== undefined
      ? visibleNodes.findIndex(
          (node) =>
            lfDataset?.nodes?.findIndex((n) => n.id === node.id) === selected,
        )
      : undefined;

  return (
    <LfListFC
      emptyMessage={emptyMessage}
      enableDeletions={lfEnableDeletions}
      focusedIndex={focused}
      framework={framework}
      items={isEmpty || isFilteredEmpty ? [] : visibleNodes}
      listRef={assignRef(refs, "node")}
      onDeleteClick={(e, node, _index) => {
        handlers.deleteIcon(e, node);
      }}
      onItemBlur={(e, node, index) => {
        handlers.node.blur(e, node, index);
      }}
      onItemClick={(e, node, index) => {
        handlers.node.click(e, node, index);
      }}
      onItemFocus={(e, node, index) => {
        handlers.node.focus(e, node, index);
      }}
      onItemPointerDown={(e, node, index) => {
        handlers.node.pointerdown(e, node, index);
      }}
      selectable={lfSelectable}
      selectedIndex={selectedVisibleIndex}
      uiSize={lfUiSize}
      uiState={lfUiState}
    />
  );
};
