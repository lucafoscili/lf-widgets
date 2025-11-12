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
      const { blocks, compInstance, isOpen, manager, parts } = controller.get;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;
      const { list } = handlers;
      const { lfDataset } = compInstance;

      if (!isOpen()) {
        return null;
      }

      return lfDataset?.nodes ? (
        <lf-list
          class={bemClass(blocks._, blocks.list)}
          lfDataset={lfDataset}
          lfNavigation={false}
          lfRipple={false}
          lfSelectable={false}
          onLf-list-event={list}
          part={parts.list}
          ref={assignRef(refs, "list")}
        />
      ) : null;
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
          class={bemClass(blocks._, blocks.textfield)}
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
