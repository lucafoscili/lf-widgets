import {
  IDS,
  LfShapeeditorAdapter,
  LfShapeeditorAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";

export const prepNavigation = (
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapterJsx["navigation"] => {
  return {
    // #region Load
    load: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, manager } = controller.get;
      const { navigation } = elements.refs;
      const { button } = handlers.navigation;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <lf-button
          class={bemClass(
            blocks.navigationGrid._,
            blocks.navigationGrid.button,
          )}
          data-cy={cyAttributes.button}
          id={IDS.navigation.load}
          lfLabel="Load"
          lfStretchX={true}
          onLf-button-event={button}
          ref={assignRef(navigation, "load")}
        >
          <lf-spinner
            lfActive={true}
            lfDimensions="2px"
            lfLayout={1}
            slot="spinner"
          ></lf-spinner>
        </lf-button>
      );
    },
    // #endregion

    // #region Masonry
    masonry: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, manager } = controller.get;
      const { navigation } = elements.refs;
      const { masonry } = handlers.navigation;
      const { lfDataset, lfShape } = compInstance;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <lf-masonry
          class={bemClass(
            blocks.navigationGrid._,
            blocks.navigationGrid.masonry,
          )}
          id={IDS.navigation.masonry}
          lfActions={true}
          lfDataset={lfDataset}
          lfSelectable={true}
          lfShape={lfShape}
          onLf-masonry-event={masonry}
          ref={assignRef(navigation, "masonry")}
        ></lf-masonry>
      );
    },
    // #endregion

    //#region navToggle
    navToggle: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, manager } = controller.get;
      const { navigation } = elements.refs;
      const { navToggle } = handlers.navigation;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;
      const { "--lf-icon-next": right, "--lf-icon-previous": left } =
        theme.get.current().variables;

      const isOpen = controller.get.navigation.isTreeOpen();

      return (
        <lf-button
          class={bemClass(
            blocks.navigationGrid._,
            blocks.navigationGrid.navToggle,
          )}
          data-cy={cyAttributes.button}
          id={IDS.navigation.navToggle}
          lfAriaLabel={
            isOpen ? "Collapse navigation tree" : "Expand navigation tree"
          }
          lfIcon={isOpen ? left : right}
          lfStretchY={true}
          onLf-button-event={navToggle}
          ref={assignRef(navigation, "navToggle")}
          title={isOpen ? "Collapse" : "Expand"}
        ></lf-button>
      );
    },
    //#endregion

    // #region Textfield
    textfield: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, manager } = controller.get;
      const { navigation } = elements.refs;
      const { textfield } = handlers.navigation;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <lf-textfield
          class={bemClass(
            blocks.navigationGrid._,
            blocks.navigationGrid.textfield,
          )}
          data-cy={cyAttributes.input}
          id={IDS.navigation.textfield}
          lfIcon="folder"
          lfLabel="Directory"
          lfStretchX={true}
          lfStyling="flat"
          onLf-textfield-event={textfield}
          ref={assignRef(navigation, "textfield")}
        ></lf-textfield>
      );
    },
    // #endregion

    // #region Tree
    tree: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, manager } = controller.get;
      const { navigation } = elements.refs;
      const { tree } = handlers.navigation;
      const { assignRef, sanitizeProps, theme } = manager;
      const { bemClass } = theme;

      const nav = compInstance.lfNavigation || {};

      return (
        <lf-tree
          class={bemClass(blocks.navigationGrid._, blocks.navigationGrid.tree)}
          id={IDS.navigation.tree}
          onLf-tree-event={tree}
          ref={assignRef(navigation, "tree")}
          {...sanitizeProps(nav.treeProps, "LfTree")}
        ></lf-tree>
      );
    },
    // #endregion
  };
};
