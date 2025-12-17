import { LfSelectAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfSelectFC } from "../lf-select-fc";

//#region Props
export interface SelectFCProps {
  adapter: LfSelectAdapter;
}
//#endregion

/**
 * FC for the select component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfSelectFC (pure presentational) with adapter state.
 */
export const SelectFC: FunctionalComponent<SelectFCProps> = ({ adapter }) => {
  const { controller, elements, handlers } = adapter;
  const { get } = controller;

  const framework = get.framework();
  const compInstance = get.compInstance();
  const { assignRef } = framework;
  const { refs } = elements;
  const { cyAttributes, lfAttributes, parts, selectedNode, indexById } = get;

  const { lfDataset, lfListProps, lfTextfieldProps, lfUiSize, lfUiState } =
    compInstance;

  const selectedN = selectedNode();
  const selectedIndex = selectedN ? indexById(selectedN.id) : -1;

  return (
    <LfSelectFC
      cyAttribute={cyAttributes().node}
      dataset={lfDataset}
      disabled={controller.computed.isDisabled()}
      framework={framework}
      lfAttribute={lfAttributes()[lfUiState]}
      listProps={lfListProps}
      listRef={assignRef(refs, "list")}
      onListEvent={handlers.list}
      onTextfieldEvent={handlers.textfield}
      part={parts().select}
      selectedIndex={selectedIndex}
      selectedNode={selectedN}
      selectRef={assignRef(refs, "select")}
      textfieldProps={lfTextfieldProps}
      textfieldRef={assignRef(refs, "textfield")}
      uiSize={lfUiSize}
      uiState={lfUiState}
    />
  );
};
