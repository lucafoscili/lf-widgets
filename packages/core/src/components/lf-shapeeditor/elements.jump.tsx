import { IDS, LfShapeeditorAdapter } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { ButtonFC } from "../lf-button/fc/button-fc";
import { LfTextfieldFC } from "../lf-textfield/lf-textfield-fc";

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
        <LfTextfieldFC
          className={bemClass(jumpBlock._, jumpBlock.textfield)}
          dataCy={cy.input}
          framework={mgr}
          icon="folder"
          id={IDS.navigation.jump.textfield}
          inputRef={assignRef(navigation.jump, "textfield")}
          label="Directory"
          onInput={(e, val) => textfield(e, val)}
          styling="flat"
        />

        {/* Load Button */}
        <ButtonFC
          className={bemClass(jumpBlock._, jumpBlock.load)}
          dataCy={cy.button}
          framework={mgr}
          id={IDS.navigation.jump.load}
          label="Load"
          onClick={(e) => load(e)}
          buttonRef={assignRef(navigation.jump, "load")}
          showSpinner={false}
        />
      </div>
    );
  };
};
