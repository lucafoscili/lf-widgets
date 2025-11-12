import { LfListAdapter, LfListAdapterJsx } from "@lf-widgets/foundations";
import { h } from "@stencil/core";

export const prepList = (getAdapter: () => LfListAdapter): LfListAdapterJsx => {
  return {
    filter: () => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const {
        blocks,
        compInstance,
        cyAttributes,
        lfAttributes,
        manager,
        parts,
      } = controller.get;
      const { lfFilterPlaceholder, lfUiSize, lfUiState } = compInstance;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;
      const { refs } = elements;

      return (
        <div
          class={bemClass(blocks.list._, blocks.filter._)}
          part={parts.filter}
        >
          <lf-textfield
            data-cy={cyAttributes.filter}
            data-lf={lfAttributes[lfUiState]}
            lfIcon="search"
            lfHtmlAttributes={{ placeholder: lfFilterPlaceholder }}
            lfStretchX={true}
            lfStyling="outlined"
            lfUiSize={lfUiSize}
            lfUiState={lfUiState}
            onLf-textfield-event={adapter.handlers.filter}
            ref={assignRef(refs, "filter")}
          ></lf-textfield>
        </div>
      );
    },
  };
};
