import { IDS, LfShapeeditorAdapter } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";

/**
 * Prepares the jump sub-block JSX (textfield + load button).
 * Part of the navigation panel.
 */
export const prepJump = (
  getAdapter: () => LfShapeeditorAdapter,
): (() => VNode) => {
  return () => {
    const { controller, elements, handlers } = getAdapter();
    const { blocks, cyAttributes, framework, parts } = controller.get;
    const { navigation } = elements.refs;
    const { load, textfield } = handlers.navigation;

    const b = blocks();
    const cy = cyAttributes();
    const p = parts();
    const mgr = framework();

    const { assignRef, theme } = mgr;
    const { bemClass } = theme;

    const jumpBlock = b.navigation.jump;
    const jumpParts = p.navigation;

    return (
      <div class={bemClass(jumpBlock._)} part={jumpParts.jump}>
        {/* Directory Textfield */}
        <lf-textfield
          class={bemClass(jumpBlock._, jumpBlock.textfield)}
          data-cy={cy.input}
          id={IDS.navigation.jump.textfield}
          lfIcon="folder"
          lfLabel="Directory"
          lfStretchX={true}
          lfStyling="flat"
          onLf-textfield-event={textfield}
          ref={assignRef(navigation.jump, "textfield")}
        ></lf-textfield>

        {/* Load Button */}
        <lf-button
          class={bemClass(jumpBlock._, jumpBlock.load)}
          data-cy={cy.button}
          id={IDS.navigation.jump.load}
          lfLabel="Load"
          lfStretchX={true}
          onLf-button-event={load}
          ref={assignRef(navigation.jump, "load")}
        >
          <lf-spinner
            lfActive={true}
            lfLayout="ring"
            slot="spinner"
          ></lf-spinner>
        </lf-button>
      </div>
    );
  };
};
