import { LfHeaderAdapter, LF_HEADER_SLOT } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

//#region Props
export interface HeaderFCProps {
  adapter: LfHeaderAdapter;
}
//#endregion

/**
 * FC for the header component.
 * Per Section 5.9 "Mirroring Rule" - encapsulates header UI.
 */
export const HeaderFC: FunctionalComponent<HeaderFCProps> = ({ adapter }) => {
  const { controller, elements } = adapter;
  const { get } = controller;

  const blocks = get.blocks();
  const framework = get.framework();
  const parts = get.parts();

  const { assignRef, theme } = framework;
  const { bemClass } = theme;
  const { refs } = elements;

  const { header } = blocks;

  return (
    <header
      class={bemClass(header._)}
      part={parts.header}
      ref={assignRef(refs, "header")}
    >
      <section
        class={bemClass(header._, header.section)}
        part={parts.section}
        ref={assignRef(refs, "section")}
      >
        <slot name={LF_HEADER_SLOT}></slot>
      </section>
    </header>
  );
};
