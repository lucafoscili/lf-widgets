import { LfAutocompleteAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfAutocompleteFC } from "../lf-autocomplete-fc";

//#region Props
export interface AutocompleteFCProps {
  adapter: LfAutocompleteAdapter;
}
//#endregion

/**
 * FC for the autocomplete component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfAutocompleteFC (pure presentational) with adapter state.
 */
export const AutocompleteFC: FunctionalComponent<AutocompleteFCProps> = ({
  adapter,
}) => {
  const { controller, elements, handlers } = adapter;
  const { computed, get } = controller;
  const { refs } = elements;

  const framework = get.framework();
  const compInstance = get.compInstance();
  const { assignRef } = framework;

  const {
    lfDataset,
    lfListProps,
    lfMinChars,
    lfSpinnerProps,
    lfTextfieldProps,
    lfUiSize,
    lfUiState,
    lfValue,
    rootElement,
  } = compInstance;

  // Compute dropdown id
  const dropdownId = `${rootElement?.id || "autocomplete"}-dropdown`;

  // Compute derived states
  const inputValue = computed.inputValue();
  const hasQuery = inputValue.length >= lfMinChars;
  const hasResults = !!lfDataset?.nodes?.length;
  const showEmpty =
    !computed.isLoading() && hasQuery && !hasResults && lfDataset !== null;
  const showList = lfDataset !== null;
  const isExpanded = framework.portal.isInPortal(refs.dropdown);

  return (
    <LfAutocompleteFC
      autocompleteRef={assignRef(refs, "autocomplete")}
      dataset={lfDataset}
      dropdownId={dropdownId}
      dropdownRef={assignRef(refs, "dropdown")}
      framework={framework}
      hasCache={computed.hasCache()}
      highlightedIndex={computed.highlightedIndex()}
      isExpanded={isExpanded}
      isLoading={computed.isLoading()}
      listProps={lfListProps}
      listRef={assignRef(refs, "list")}
      minChars={lfMinChars}
      onListEvent={handlers.list}
      onTextfieldEvent={handlers.textfield}
      showEmpty={showEmpty}
      showList={showList}
      spinnerProps={lfSpinnerProps}
      spinnerRef={assignRef(refs, "spinner")}
      textfieldProps={lfTextfieldProps}
      textfieldRef={assignRef(refs, "textfield")}
      uiSize={lfUiSize}
      uiState={lfUiState}
      value={lfValue}
    />
  );
};
