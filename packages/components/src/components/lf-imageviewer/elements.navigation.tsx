import {
  IDS,
  LfImageviewerAdapter,
  LfImageviewerAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";

export const prepNavigation = (
  getAdapter: () => LfImageviewerAdapter,
): LfImageviewerAdapterJsx["navigation"] => {
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
      const { lfDataset } = compInstance;
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
          onLf-masonry-event={masonry}
          ref={assignRef(navigation, "masonry")}
        ></lf-masonry>
      );
    },
    // #endregion

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
  };
};
