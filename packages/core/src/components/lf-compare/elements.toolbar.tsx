import {
  LF_COMPARE_IDS,
  LfCompareAdapter,
  LfCompareAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
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
      const { cyAttributes, isOverlay, manager, parts } = controller.get;
      const { refs } = elements;
      const { button } = handlers;
      const { assignRef, theme } = manager;
      const { columns2, squareToggle } = theme.get.icons();

      return (
        <lf-button
          data-cy={cyAttributes.button}
          id={LF_COMPARE_IDS.changeView}
          lfIcon={squareToggle}
          lfIconOff={columns2}
          lfStyling="icon"
          lfToggable={true}
          lfValue={!isOverlay()}
          onLf-button-event={button}
          part={parts.changeView}
          ref={assignRef(refs, "changeView")}
          title={
            isOverlay()
              ? "Click for split screen comparison."
              : "Click for overlay comparison"
          }
        ></lf-button>
      );
    },
    //#endregion

    //#region Left button
    leftButton: () => {
      const { controller, elements, handlers } = getAdapter();
      const { cyAttributes, isOverlay, manager, parts } = controller.get;
      const { refs } = elements;
      const { button } = handlers;
      const { assignRef, theme } = manager;
      const imageInPicture = theme.get.icon("imageInPicture");
      const { "--lf-icon-clear": clear } = theme.get.current().variables;

      return (
        <lf-button
          data-cy={cyAttributes.button}
          id={LF_COMPARE_IDS.leftButton}
          lfIcon={clear}
          lfIconOff={imageInPicture}
          lfStyling={"icon"}
          lfToggable={true}
          onLf-button-event={button}
          part={parts.leftButton}
          ref={assignRef(refs, "leftButton")}
          title={
            isOverlay()
              ? "Click to open the left panel."
              : "Click to close the left panel."
          }
        ></lf-button>
      );
    },
    //#endregion

    //#region Left tree
    leftTree: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, lfAttributes, manager, parts, shapes } =
        controller.get;
      const { refs } = elements;
      const { tree } = handlers;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;
      const { "--lf-icon-success": icon } = get.current().variables;

      const comp = compInstance as LfCompare;

      return (
        <lf-tree
          class={bemClass(blocks.toolbar._, blocks.toolbar.panel, {
            left: true,
          })}
          data-lf={lfAttributes.fadeIn}
          id={LF_COMPARE_IDS.leftTree}
          lfDataset={prepTreeDataset(comp.leftShape, icon, shapes())}
          lfFilter={false}
          onLf-tree-event={tree}
          part={parts.leftTree}
          ref={assignRef(refs, "leftTree")}
        ></lf-tree>
      );
    },
    //#endregion

    //#region Right button
    rightButton: () => {
      const { controller, elements, handlers } = getAdapter();
      const { cyAttributes, isOverlay, manager, parts } = controller.get;
      const { refs } = elements;
      const { button } = handlers;
      const { assignRef, theme } = manager;
      const imageInPicture = theme.get.icon("imageInPicture");
      const { "--lf-icon-clear": clear } = theme.get.current().variables;

      return (
        <lf-button
          data-cy={cyAttributes.button}
          id={LF_COMPARE_IDS.rightButton}
          lfIcon={clear}
          lfIconOff={imageInPicture}
          lfStyling={"icon"}
          lfToggable={true}
          onLf-button-event={button}
          part={parts.rightButton}
          ref={assignRef(refs, "rightButton")}
          title={
            isOverlay()
              ? "Click to open the right panel."
              : "Click to close the right panel."
          }
        ></lf-button>
      );
    },
    //#endregion

    //#region Right tree
    rightTree: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, lfAttributes, manager, parts, shapes } =
        controller.get;
      const { refs } = elements;
      const { tree } = handlers;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;
      const { "--lf-icon-success": icon } = get.current().variables;

      const comp = compInstance as LfCompare;

      return (
        <lf-tree
          class={bemClass(blocks.toolbar._, blocks.toolbar.panel, {
            right: true,
          })}
          data-lf={lfAttributes.fadeIn}
          id={LF_COMPARE_IDS.rightTree}
          lfDataset={prepTreeDataset(comp.rightShape, icon, shapes())}
          lfFilter={false}
          onLf-tree-event={tree}
          part={parts.rightTree}
          ref={assignRef(refs, "rightTree")}
        ></lf-tree>
      );
    },
    //#endregion
  };
};
