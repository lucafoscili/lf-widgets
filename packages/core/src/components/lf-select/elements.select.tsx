import {
  LF_THEME_ICONS,
  LfSelectAdapter,
  LfSelectAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { LfTextfieldFC } from "../lf-textfield/lf-textfield-fc";
import { SelectFC } from "./fc/select-fc";

export const prepSelectJsx = (
  getAdapter: () => LfSelectAdapter,
): LfSelectAdapterJsx => {
  return {
    //#region List
    list: () => {
      const { controller, elements, handlers } = getAdapter();
      const { refs } = elements;
      const {
        blocks,
        compInstance,
        cyAttributes,
        framework,
        indexById,
        lfAttributes,
        parts,
        selectedNode,
      } = controller.get;
      const { assignRef, sanitizeProps, theme } = framework();
      const { bemClass } = theme;
      const { list } = handlers;
      const comp = compInstance();
      const { lfDataset } = comp;

      const selectedN = selectedNode();
      const selectedIndex = selectedN ? indexById(selectedN.id) : -1;

      return (
        <lf-list
          lfUiSize={comp.lfUiSize}
          lfUiState={comp.lfUiState}
          {...sanitizeProps(comp.lfListProps, "LfList")}
          class={bemClass(blocks().select._, blocks().select.list)}
          data-cy={cyAttributes().dropdownMenu}
          data-lf={lfAttributes().portal}
          lfDataset={lfDataset}
          lfSelectable={true}
          lfValue={selectedIndex !== -1 ? selectedIndex : null}
          onLf-list-event={list}
          part={parts().list}
          ref={assignRef(refs, "list")}
        />
      );
    },
    //#endregion

    //#region Select (FC-based)
    select: () => {
      const adapter = getAdapter();
      return <SelectFC adapter={adapter} />;
    },
    //#endregion

    //#region Textfield
    textfield: () => {
      const { controller, elements, handlers } = getAdapter();
      const { refs } = elements;
      const { blocks, compInstance, framework, selectedNode } = controller.get;
      const mgr = framework();
      const { assignRef, theme } = mgr;
      const { bemClass } = theme;
      const { textfieldClick, textfieldKeydown, textfieldIconClick } = handlers;
      const comp = compInstance();

      // Map lfTextfieldProps to FC props
      const textfieldProps = comp.lfTextfieldProps || {};
      const icon = textfieldProps.lfIcon;
      const label = textfieldProps.lfLabel;
      const styling = textfieldProps.lfStyling || "flat";

      return (
        <LfTextfieldFC
          className={bemClass(blocks().select._, blocks().select.textfield)}
          framework={mgr}
          htmlAttributes={{
            autocomplete: "off",
            readonly: true,
            role: "combobox",
          }}
          icon={icon}
          inputRef={(el) => assignRef(refs, "textfield")(el)}
          label={label}
          onClick={(e) => textfieldClick(e)}
          onIconClick={(e) => textfieldIconClick(e)}
          onKeyDown={(e) => textfieldKeydown(e)}
          styling={styling}
          trailingIcon={false}
          trailingIconAction={LF_THEME_ICONS.dropdown}
          uiSize={comp.lfUiSize}
          uiState={comp.lfUiState}
          value={String(selectedNode()?.value || "")}
        />
      );
    },
    //#endregion
  };
};
