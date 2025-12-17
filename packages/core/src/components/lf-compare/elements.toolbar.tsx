import {
  LF_COMPARE_IDS,
  LfCompareAdapter,
  LfCompareAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { ButtonFC } from "../lf-button/fc/button-fc";
import { prepTreeDataset } from "./helpers.utils";
import { LfCompare } from "./lf-compare";

//#endregion
export const prepToolbarJsx = (
  getAdapter: () => LfCompareAdapter,
): LfCompareAdapterJsx => {
  return {
    //#region Change view
    changeView: () => {
      const { controller, elements, handlers } = getAdapter();
      const { get, computed } = controller;
      const { cyAttributes, framework, parts } = get;
      const { isOverlay } = computed;
      const { refs } = elements;
      const { button } = handlers;
      const { assignRef, theme } = framework();
      const { columns2, squareToggle } = theme.get.icons();

      return (
        <ButtonFC
          dataCy={cyAttributes().button}
          framework={framework()}
          icon={isOverlay() ? squareToggle : columns2}
          id={LF_COMPARE_IDS.changeView}
          onClick={(e) => button(e, LF_COMPARE_IDS.changeView, !isOverlay())}
          part={parts().changeView}
          buttonRef={assignRef(refs, "changeView")}
          styling="icon"
          title={
            isOverlay()
              ? "Click for split screen comparison."
              : "Click for overlay comparison"
          }
        />
      );
    },
    //#endregion

    //#region Left button
    leftButton: () => {
      const { controller, elements, handlers } = getAdapter();
      const { get, computed } = controller;
      const { cyAttributes, framework, parts } = get;
      const { isOverlay } = computed;
      const { refs } = elements;
      const { button } = handlers;
      const { assignRef, theme } = framework();
      const imageInPicture = theme.get.icon("imageInPicture");
      const { "--lf-icon-clear": clear } = theme.get.current().variables;

      return (
        <ButtonFC
          dataCy={cyAttributes().button}
          framework={framework()}
          icon={isOverlay() ? clear : imageInPicture}
          id={LF_COMPARE_IDS.leftButton}
          onClick={(e) => button(e, LF_COMPARE_IDS.leftButton)}
          part={parts().leftButton}
          buttonRef={assignRef(refs, "leftButton")}
          styling="icon"
          title={
            isOverlay()
              ? "Click to open the left panel."
              : "Click to close the left panel."
          }
        />
      );
    },
    //#endregion

    //#region Left tree
    leftTree: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, lfAttributes, framework, parts, shapes } =
        controller.get;
      const { refs } = elements;
      const { tree } = handlers;
      const { assignRef, theme } = framework();
      const { bemClass, get } = theme;
      const { "--lf-icon-success": icon } = get.current().variables;

      const comp = compInstance() as LfCompare;

      return (
        <lf-tree
          class={bemClass(blocks().toolbar._, blocks().toolbar.panel, {
            left: true,
          })}
          data-lf={lfAttributes().fadeIn}
          id={LF_COMPARE_IDS.leftTree}
          lfDataset={prepTreeDataset(comp.leftShape, icon, shapes())}
          lfFilter={false}
          onLf-tree-event={tree}
          part={parts().leftTree}
          ref={assignRef(refs, "leftTree")}
        ></lf-tree>
      );
    },
    //#endregion

    //#region Right button
    rightButton: () => {
      const { controller, elements, handlers } = getAdapter();
      const { get, computed } = controller;
      const { cyAttributes, framework, parts } = get;
      const { isOverlay } = computed;
      const { refs } = elements;
      const { button } = handlers;
      const { assignRef, theme } = framework();
      const imageInPicture = theme.get.icon("imageInPicture");
      const { "--lf-icon-clear": clear } = theme.get.current().variables;

      return (
        <ButtonFC
          dataCy={cyAttributes().button}
          framework={framework()}
          icon={isOverlay() ? clear : imageInPicture}
          id={LF_COMPARE_IDS.rightButton}
          onClick={(e) => button(e, LF_COMPARE_IDS.rightButton)}
          part={parts().rightButton}
          buttonRef={assignRef(refs, "rightButton")}
          styling="icon"
          title={
            isOverlay()
              ? "Click to open the right panel."
              : "Click to close the right panel."
          }
        />
      );
    },
    //#endregion

    //#region Right tree
    rightTree: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, lfAttributes, framework, parts, shapes } =
        controller.get;
      const { refs } = elements;
      const { tree } = handlers;
      const { assignRef, theme } = framework();
      const { bemClass, get } = theme;
      const { "--lf-icon-success": icon } = get.current().variables;

      const comp = compInstance() as LfCompare;

      return (
        <lf-tree
          class={bemClass(blocks().toolbar._, blocks().toolbar.panel, {
            right: true,
          })}
          data-lf={lfAttributes().fadeIn}
          id={LF_COMPARE_IDS.rightTree}
          lfDataset={prepTreeDataset(comp.rightShape, icon, shapes())}
          lfFilter={false}
          onLf-tree-event={tree}
          part={parts().rightTree}
          ref={assignRef(refs, "rightTree")}
        ></lf-tree>
      );
    },
    //#endregion
  };
};
