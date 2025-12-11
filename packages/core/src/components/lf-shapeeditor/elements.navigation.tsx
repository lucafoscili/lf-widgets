import {
  IDS,
  LfShapeeditorAdapter,
  LfShapeeditorAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { prepExplorer } from "./elements.explorer";
import { prepJump } from "./elements.jump";

/**
 * Prepares the navigation panel JSX functions.
 * Contains explorer (tree + expander), jump (textfield + load), and masonry.
 */
export const prepNavigation = (
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapterJsx["navigation"] => {
  return {
    //#region Explorer (tree + expander sub-block)
    explorer: prepExplorer(getAdapter),
    //#endregion

    //#region Jump (textfield + load sub-block)
    jump: prepJump(getAdapter),
    //#endregion

    //#region Masonry
    masonry: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, manager, parts } = controller.get;
      const { navigation } = elements.refs;
      const { masonry } = handlers.navigation;
      const { lfDataset, lfShape } = compInstance;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      const navBlock = blocks.navigation;
      const navParts = parts.navigation;

      return (
        <lf-masonry
          class={bemClass(navBlock._, navBlock.masonry)}
          id={IDS.navigation.masonry}
          lfActions={true}
          lfDataset={lfDataset}
          lfSelectable={true}
          lfShape={lfShape}
          onLf-masonry-event={masonry}
          part={navParts.masonry}
          ref={assignRef(navigation, "masonry")}
        ></lf-masonry>
      );
    },
    //#endregion
  };
};
