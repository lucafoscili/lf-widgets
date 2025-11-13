import { LfSelectAdapter, LfSelectAdapterJsx } from "@lf-widgets/foundations";
import { h } from "@stencil/core";

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
        indexById,
        lfAttributes,
        manager,
        parts,
        selectedNode,
      } = controller.get;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;
      const { list } = handlers;
      const { lfDataset } = compInstance;

      const selectedN = selectedNode();
      const selectedIndex = selectedN ? indexById(selectedN.id) : -1;

      return (
        <lf-list
          {...compInstance.lfListProps}
          class={bemClass(blocks.select._, blocks.select.list)}
          data-cy={cyAttributes.dropdownMenu}
          data-lf={lfAttributes.portal}
          lfDataset={lfDataset}
          lfSelectable={true}
          lfValue={selectedIndex !== -1 ? selectedIndex : null}
          onLf-list-event={list}
          part={parts.list}
          ref={assignRef(refs, "list")}
        />
      );
    },
    //#endregion

    //#region Textfield
    textfield: () => {
      const { controller, elements, handlers } = getAdapter();
      const { refs } = elements;
      const {
        blocks,
        compInstance,
        cyAttributes,
        manager,
        parts,
        selectedNode,
      } = controller.get;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;
      const { textfield } = handlers;

      const htmlAttrs = compInstance.lfTextfieldProps?.lfHtmlAttributes || {};
      htmlAttrs.readonly = true;

      return (
        <lf-textfield
          {...compInstance.lfTextfieldProps}
          class={bemClass(blocks.select._, blocks.select.textfield)}
          data-cy={cyAttributes.input}
          lfHtmlAttributes={htmlAttrs}
          lfValue={String(selectedNode()?.value || "")}
          onLf-textfield-event={textfield}
          part={parts.textfield}
          ref={assignRef(refs, "textfield")}
        />
      );
    },
    //#endregion
  };
};
