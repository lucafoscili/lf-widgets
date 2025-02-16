import {
  LF_MASONRY_IDS,
  LfMasonryAdapter,
  LfMasonryAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";

export const prepControls = (
  getAdapter: () => LfMasonryAdapter,
): LfMasonryAdapterJsx => {
  return {
    //#region Add column
    addColumn: () => {
      const { controller, elements, handlers } = getAdapter();
      const { refs } = elements;
      const { button } = handlers;
      const { blocks, cyAttributes, lfAttributes, manager, parts } =
        controller.get;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;
      const { "--lf-icon-plus": plus } = get.current().variables;

      return (
        <lf-button
          class={bemClass(blocks.grid._, blocks.grid.addColumn)}
          data-cy={cyAttributes.button}
          data-lf={lfAttributes.fadeIn}
          id={LF_MASONRY_IDS.addColumn}
          key={LF_MASONRY_IDS.addColumn}
          lfIcon={plus}
          lfStyling={"floating"}
          lfUiSize="xxsmall"
          onLf-button-event={button}
          part={parts.addColumn}
          ref={assignRef(refs, "addColumn")}
          title="Click to add a column to the masonry."
        ></lf-button>
      );
    },
    //#endregion

    //#region Remove column
    removeColumn: () => {
      const { controller, elements, handlers } = getAdapter();
      const { refs } = elements;
      const { button } = handlers;
      const { blocks, cyAttributes, lfAttributes, manager, parts } =
        controller.get;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;
      const { "--lf-icon-minus": minus } = get.current().variables;

      return (
        <lf-button
          class={bemClass(blocks.grid._, blocks.grid.removeColumn)}
          data-cy={cyAttributes.button}
          data-lf={lfAttributes.fadeIn}
          id={LF_MASONRY_IDS.removeColumn}
          key={LF_MASONRY_IDS.removeColumn}
          lfIcon={minus}
          lfStyling={"floating"}
          lfUiSize="xxsmall"
          onLf-button-event={button}
          part={parts.removeColumn}
          ref={assignRef(refs, "removeColumn")}
          title="Click to remove a column from the masonry."
        ></lf-button>
      );
    },
    //#endregion

    //#region Change view
    changeView: () => {
      const { controller, elements, handlers } = getAdapter();
      const { refs } = elements;
      const { blocks, cyAttributes, isMasonry, isVertical, manager, parts } =
        controller.get;
      const { button } = handlers;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;
      const { layoutBoardSplit, viewportTall, viewportWide } = get.icons();

      return (
        <lf-button
          class={bemClass(blocks.grid._, blocks.grid.changeViewe)}
          data-cy={cyAttributes.button}
          id={LF_MASONRY_IDS.masonry}
          key={LF_MASONRY_IDS.masonry}
          lfIcon={
            isMasonry()
              ? viewportTall
              : isVertical()
                ? viewportWide
                : layoutBoardSplit
          }
          lfStyling={"floating"}
          lfUiSize="xsmall"
          onLf-button-event={button}
          part={parts.changeView}
          ref={assignRef(refs, "changeView")}
          title={
            isMasonry()
              ? "Click to view the images arranged vertically."
              : isVertical()
                ? "Click to view the images arranged horizontally."
                : "Click to view the images arranged in a masonry."
          }
        ></lf-button>
      );
    },
    //#endregion
  };
};
