import {
  CY_ATTRIBUTES,
  LF_AUTOCOMPLETE_BLOCKS,
  LF_AUTOCOMPLETE_PARTS,
  LF_THEME_ICONS,
  LfAutocompleteAdapter,
  LfAutocompleteAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { LfTextfieldFC } from "../lf-textfield/lf-textfield-fc";

export const prepAutocompleteJsx = (
  getAdapter: () => LfAutocompleteAdapter,
): LfAutocompleteAdapterJsx => {
  return {
    //#region Dropdown
    dropdown: () => {
      const { controller, elements, handlers } = getAdapter();
      const { refs } = elements;
      const { compInstance, framework } = controller.get;
      const { computed } = controller;
      const { assignRef, sanitizeProps, theme } = framework();
      const { bemClass } = theme;
      const { list } = handlers;
      const comp = compInstance();
      const lfDataset = comp.lfDataset;

      const blocks = LF_AUTOCOMPLETE_BLOCKS;
      const parts = LF_AUTOCOMPLETE_PARTS;

      const listProps = comp.lfListProps || {};
      const dropdownId = `${comp.rootElement?.id || "autocomplete"}-dropdown`;
      const hasQuery = computed.inputValue().length >= comp.lfMinChars;
      const hasResults = !!lfDataset?.nodes?.length;
      const showEmpty =
        !computed.isLoading() && hasQuery && !hasResults && lfDataset !== null;
      const showList = lfDataset !== null;

      return (
        <div
          class={bemClass(blocks.dropdown._)}
          data-cy={CY_ATTRIBUTES.dropdownMenu}
          data-lf="portal"
          id={dropdownId}
          part={parts.dropdown}
          ref={assignRef(refs, "dropdown")}
          role="listbox"
        >
          <lf-spinner
            lfActive={computed.isLoading()}
            lfBarVariant={true}
            lfUiSize="xsmall"
            {...sanitizeProps(comp.lfSpinnerProps || {}, "LfSpinner")}
            class={bemClass(blocks.dropdown._, blocks.dropdown.spinner)}
            data-cy={CY_ATTRIBUTES.spinner}
            data-lf="fade-in"
            part={parts.spinner}
            ref={assignRef(refs, "spinner")}
          />
          {showList && (
            <lf-list
              lfEmpty={showEmpty ? "Your search returned no results." : ""}
              lfUiSize={comp.lfUiSize}
              lfUiState={comp.lfUiState}
              {...sanitizeProps(listProps, "LfList")}
              class={bemClass(blocks.dropdown._, blocks.dropdown.list)}
              lfDataset={lfDataset}
              lfSelectable={true}
              lfValue={computed.highlightedIndex()}
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
      const { compInstance, framework } = controller.get;
      const { computed } = controller;
      const mgr = framework();
      const { assignRef, sanitizeProps, theme } = mgr;
      const { bemClass } = theme;
      const {
        textfieldBlur,
        textfieldClick,
        textfieldIconClick,
        textfieldInput,
        textfieldKeydown,
      } = handlers;
      const comp = compInstance();

      const blocks = LF_AUTOCOMPLETE_BLOCKS;
      const parts = LF_AUTOCOMPLETE_PARTS;

      const textfieldProps = comp.lfTextfieldProps || {};
      const htmlAttrs = textfieldProps?.lfHtmlAttributes || {};
      const dropdownId = `${comp.rootElement?.id || "autocomplete"}-dropdown`;
      const highlighted = computed.highlightedIndex();
      const ariaAttrs = {
        "aria-autocomplete": "list",
        "aria-controls": dropdownId,
        ...(highlighted >= 0 && {
          "aria-activedescendant": `${dropdownId}-item-${highlighted}`,
        }),
      };
      const htmlSanitized = sanitizeProps({ ...htmlAttrs, ...ariaAttrs });

      return (
        <LfTextfieldFC
          className={bemClass(
            blocks.autocomplete._,
            blocks.autocomplete.textfield,
          )}
          framework={mgr}
          htmlAttributes={htmlSanitized}
          icon={textfieldProps.lfIcon || null}
          inputRef={(el) => assignRef(refs, "textfield")(el)}
          label={textfieldProps.lfLabel}
          onBlur={textfieldBlur}
          onClick={textfieldClick}
          onIconClick={textfieldIconClick}
          onInput={(value, e) => textfieldInput(e, value)}
          onKeyDown={textfieldKeydown}
          styling={textfieldProps.lfStyling || "flat"}
          trailingIconAction={
            computed.hasCache() ? LF_THEME_ICONS.dropdown : null
          }
          uiSize={comp.lfUiSize}
          uiState={comp.lfUiState}
          value={comp.inputValue || comp.lfValue || ""}
        />
      );
    },
    //#endregion
  };
};
