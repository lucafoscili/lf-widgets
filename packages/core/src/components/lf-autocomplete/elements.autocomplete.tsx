import {
  LF_THEME_ICONS,
  LfAutocompleteAdapter,
  LfAutocompleteAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";

export const prepAutocompleteJsx = (
  getAdapter: () => LfAutocompleteAdapter,
): LfAutocompleteAdapterJsx => {
  return {
    //#region Dropdown
    dropdown: () => {
      const { controller, elements, handlers } = getAdapter();
      const { refs } = elements;
      const {
        blocks,
        cyAttributes,
        isLoading,
        lfAttributes,
        manager,
        parts,
        highlightedIndex,
      } = controller.get;
      const { assignRef, sanitizeProps, theme } = manager;
      const { bemClass } = theme;
      const { list } = handlers;
      const compInstance = controller.get.compInstance;
      const lfDataset = controller.get.lfDataset();

      const listProps = compInstance.lfListProps || {};
      const dropdownId = `${compInstance.rootElement?.id || "autocomplete"}-dropdown`;
      const hasQuery =
        controller.get.inputValue().length >= compInstance.lfMinChars;
      const hasResults = !!lfDataset?.nodes?.length;
      const showEmpty =
        !isLoading() && hasQuery && !hasResults && lfDataset !== null;
      const showList = lfDataset !== null;

      return (
        <div
          class={bemClass(blocks.dropdown._)}
          data-cy={cyAttributes.dropdownMenu}
          data-lf={lfAttributes.portal}
          id={dropdownId}
          part={parts.dropdown}
          ref={assignRef(refs, "dropdown")}
          role="listbox"
        >
          <lf-spinner
            lfBarVariant={true}
            lfDimensions="1em"
            lfStyle=":host { --lf-spinner-min-height: 0.25em; }"
            {...sanitizeProps(compInstance.lfSpinnerProps || {}, "LfSpinner")}
            class={bemClass(blocks.dropdown._, blocks.dropdown.spinner)}
            data-cy={cyAttributes.spinner}
            data-lf={lfAttributes.fadeIn}
            lfActive={isLoading()}
            part={parts.spinner}
            ref={assignRef(refs, "spinner")}
          />
          {showList && (
            <lf-list
              lfEmpty={showEmpty ? "Your search returned no results." : ""}
              lfUiSize={compInstance.lfUiSize}
              lfUiState={compInstance.lfUiState}
              {...sanitizeProps(listProps, "LfList")}
              class={bemClass(blocks.dropdown._, blocks.dropdown.list)}
              lfDataset={lfDataset}
              lfSelectable={true}
              lfValue={highlightedIndex()}
              onLf-list-event={list}
              part={parts.list}
              ref={assignRef(refs, "list")}
            />
          )}
        </div>
      );
    },
    //#endregion

    //#region Textfield
    textfield: () => {
      const { controller, elements, handlers } = getAdapter();
      const { refs } = elements;
      const {
        blocks,
        cyAttributes,
        hasCache,
        highlightedIndex,
        manager,
        parts,
      } = controller.get;
      const { assignRef, sanitizeProps, theme } = manager;
      const { bemClass } = theme;
      const { textfield } = handlers;
      const compInstance = controller.get.compInstance;

      const textfieldProps = compInstance.lfTextfieldProps || {};
      const htmlAttrs = textfieldProps?.lfHtmlAttributes || {};
      const dropdownId = `${compInstance.rootElement?.id || "autocomplete"}-dropdown`;
      const highlighted = highlightedIndex();
      const ariaAttrs = {
        "aria-autocomplete": "list",
        "aria-controls": dropdownId,
        ...(highlighted >= 0 && {
          "aria-activedescendant": `${dropdownId}-item-${highlighted}`,
        }),
      };
      const htmlSanitized = sanitizeProps({ ...htmlAttrs, ...ariaAttrs });

      return (
        <lf-textfield
          lfUiSize={compInstance.lfUiSize}
          lfUiState={compInstance.lfUiState}
          {...sanitizeProps(textfieldProps, "LfTextfield")}
          class={bemClass(blocks.autocomplete._, blocks.autocomplete.textfield)}
          data-cy={cyAttributes.input}
          lfHtmlAttributes={htmlSanitized}
          lfTrailingIconAction={hasCache() ? LF_THEME_ICONS.dropdown : null}
          lfValue={compInstance.lfValue}
          onLf-textfield-event={textfield}
          part={parts.textfield}
          ref={assignRef(refs, "textfield")}
        />
      );
    },
    //#endregion
  };
};
