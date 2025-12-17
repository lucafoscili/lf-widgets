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

  // Extract FC handlers with proper types
  const textfieldClick = handlers.textfieldClick as (e: MouseEvent) => void;
  const textfieldKeydown = handlers.textfieldKeydown as (
    e: KeyboardEvent,
  ) => void;
  const textfieldIconClick = handlers.textfieldIconClick as (
    e: MouseEvent,
  ) => void;

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
      onTextfieldClick={(e) => textfieldClick(e)}
      onTextfieldKeydown={(e) => textfieldKeydown(e)}
      onTextfieldIconClick={(e) => textfieldIconClick(e)}
      part={parts().select}
      selectedIndex={selectedIndex}
      selectedNode={selectedN}
      selectRef={assignRef(refs, "select")}
      textfieldProps={lfTextfieldProps}
      textfieldRef={(el) => assignRef(refs, "textfield")(el)}
      uiSize={lfUiSize}
      uiState={lfUiState}
    />
  );
};
