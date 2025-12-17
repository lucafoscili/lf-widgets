import {
  LF_MASONRY_IDS,
  LfMasonryAdapter,
  LfMasonryAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { ButtonFC } from "../lf-button/fc/button-fc";

export const prepControls = (
  getAdapter: () => LfMasonryAdapter,
): LfMasonryAdapterJsx => {
  return {
    //#region Add column
    addColumn: () => {
      const { controller, elements, handlers } = getAdapter();
      const { refs } = elements;
      const { button } = handlers;
      const { blocks, cyAttributes, framework, lfAttributes, parts } =
        controller.get;
      const { assignRef, theme } = framework();
      const { bemClass, get } = theme;
      const { "--lf-icon-plus": plus } = get.current().variables;

      return (
        <ButtonFC
          className={bemClass(blocks().grid._, blocks().grid.addColumn)}
          dataCy={cyAttributes().button}
          dataLf={lfAttributes().fadeIn}
          framework={framework()}
          icon={plus}
          id={LF_MASONRY_IDS.addColumn}
          key={LF_MASONRY_IDS.addColumn}
          onClick={(e) => button(e, LF_MASONRY_IDS.addColumn)}
          part={parts().addColumn}
          buttonRef={assignRef(refs, "addColumn")}
          styling="floating"
          title="Click to add a column to the masonry."
          uiSize="xxsmall"
        />
      );
    },
    //#endregion

    //#region Remove column
    removeColumn: () => {
      const { controller, elements, handlers } = getAdapter();
      const { refs } = elements;
      const { button } = handlers;
      const { blocks, cyAttributes, framework, lfAttributes, parts } =
        controller.get;
      const { assignRef, theme } = framework();
      const { bemClass, get } = theme;
      const { "--lf-icon-minus": minus } = get.current().variables;

      return (
        <ButtonFC
          className={bemClass(blocks().grid._, blocks().grid.removeColumn)}
          dataCy={cyAttributes().button}
          dataLf={lfAttributes().fadeIn}
          framework={framework()}
          icon={minus}
          id={LF_MASONRY_IDS.removeColumn}
          key={LF_MASONRY_IDS.removeColumn}
          onClick={(e) => button(e, LF_MASONRY_IDS.removeColumn)}
          part={parts().removeColumn}
          buttonRef={assignRef(refs, "removeColumn")}
          styling="floating"
          title="Click to remove a column from the masonry."
          uiSize="xxsmall"
        />
      );
    },
    //#endregion

    //#region Change view
    changeView: () => {
      const { controller, elements, handlers } = getAdapter();
      const { refs } = elements;
      const { get, computed } = controller;
      const { blocks, cyAttributes, framework, parts } = get;
      const { isMasonry, isVertical } = computed;
      const { button } = handlers;
      const { assignRef, theme } = framework();
      const { bemClass, get: themeGet } = theme;
      const { layoutBoardSplit, viewportTall, viewportWide } = themeGet.icons();

      return (
        <ButtonFC
          className={bemClass(blocks().grid._, blocks().grid.changeViewe)}
          dataCy={cyAttributes().button}
          framework={framework()}
          icon={
            isMasonry()
              ? viewportTall
              : isVertical()
                ? viewportWide
                : layoutBoardSplit
          }
          id={LF_MASONRY_IDS.masonry}
          key={LF_MASONRY_IDS.masonry}
          onClick={(e) => button(e, LF_MASONRY_IDS.masonry)}
          part={parts().changeView}
          buttonRef={assignRef(refs, "changeView")}
          styling="floating"
          title={
            isMasonry()
              ? "Click to view the images arranged vertically."
              : isVertical()
                ? "Click to view the images arranged horizontally."
                : "Click to view the images arranged in a masonry."
          }
          uiSize="xsmall"
        />
      );
    },
    //#endregion
  };
};
