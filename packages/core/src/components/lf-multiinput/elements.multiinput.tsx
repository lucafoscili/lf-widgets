import {
  LfMultiInputAdapter,
  LfMultiInputAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";

export const prepMultiInputJsx = (
  getAdapter: () => LfMultiInputAdapter,
): LfMultiInputAdapterJsx => {
  return {
    //#region Chips
    chips: () => {
      const { controller, elements, handlers } = getAdapter();
      const { refs } = elements;
      const { blocks, cyAttributes, historyNodes, manager, parts } =
        controller.get;
      const { assignRef, sanitizeProps, theme } = manager;
      const { bemClass } = theme;
      const compInstance = controller.get.compInstance;
      const nodes = historyNodes();

      if (!nodes.length) {
        return null;
      }

      return (
        <lf-chip
          lfDataset={{ nodes }}
          lfStyling="filter"
          lfUiSize={compInstance.lfUiSize}
          lfUiState={compInstance.lfUiState}
          {...sanitizeProps(compInstance.lfChipProps, "LfChip")}
          class={bemClass(blocks.multiinput._, blocks.multiinput.chips)}
          data-cy={cyAttributes.node}
          lfValue={compInstance.lfValue?.split(",") || []}
          onLf-chip-event={handlers.chips}
          part={parts.chips}
          ref={assignRef(refs, "chips")}
        />
      );
    },
    //#endregion

    //#region Textfield
    textfield: () => {
      const { controller, elements, handlers } = getAdapter();
      const { refs } = elements;
      const { blocks, manager, parts } = controller.get;
      const { assignRef, sanitizeProps, theme } = manager;
      const { bemClass } = theme;
      const { textfield } = handlers;
      const compInstance = controller.get.compInstance;

      return (
        <lf-textfield
          class={bemClass(blocks.multiinput._, blocks.multiinput.textfield)}
          lfUiSize={compInstance.lfUiSize}
          lfUiState={compInstance.lfUiState}
          {...sanitizeProps(compInstance.lfTextfieldProps, "LfTextfield")}
          lfTrailingIconAction="--lf-icon-clear"
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
