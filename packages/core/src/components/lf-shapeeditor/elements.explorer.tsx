import { IDS, LfShapeeditorAdapter } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";

/**
 * Prepares the explorer sub-block JSX (tree + expander).
 * Part of the navigation panel.
 */
export const prepExplorer = (
  getAdapter: () => LfShapeeditorAdapter,
): (() => VNode) => {
  return () => {
    const { controller, elements, handlers } = getAdapter();
    const { blocks, compInstance, cyAttributes, framework, parts } =
      controller.get;
    const { navigation } = elements.refs;
    const { expander, tree } = handlers.navigation;

    const b = blocks();
    const cy = cyAttributes();
    const p = parts();
    const mgr = framework();
    const comp = compInstance();

    const { assignRef, sanitizeProps, theme } = mgr;
    const { bemClass } = theme;

    const { "--lf-icon-next": right, "--lf-icon-previous": left } =
      theme.get.current().variables;

    const isOpen = controller.get.navigation.isTreeOpen();
    const nav = comp.lfNavigation || {};

    const explorerBlock = b.navigation.explorer;
    const explorerParts = p.navigation;

    return (
      <div
        class={bemClass(explorerBlock._, undefined, {
          "has-drawer": isOpen,
        })}
        part={explorerParts.explorer}
      >
        {/* Navigation Tree */}
        {isOpen && (
          <lf-tree
            class={bemClass(explorerBlock._, explorerBlock.tree)}
            id={IDS.navigation.explorer.tree}
            onLf-tree-event={tree}
            ref={assignRef(navigation.explorer, "tree")}
            {...sanitizeProps(nav.treeProps, "LfTree")}
          ></lf-tree>
        )}

        {/* Expander Button */}
        <lf-button
          class={bemClass(explorerBlock._, explorerBlock.expander)}
          data-cy={cy.button}
          id={IDS.navigation.explorer.expander}
          lfAriaLabel={
            isOpen ? "Collapse navigation tree" : "Expand navigation tree"
          }
          lfIcon={isOpen ? left : right}
          lfStretchY={true}
          onLf-button-event={expander}
          ref={assignRef(navigation.explorer, "expander")}
          title={isOpen ? "Collapse" : "Expand"}
        ></lf-button>
      </div>
    );
  };
};
