import { LfTypewriterAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfTypewriterFC } from "../lf-typewriter-fc";

//#region Props
export interface TypewriterFCProps {
  adapter: LfTypewriterAdapter;
}
//#endregion

/**
 * FC for the typewriter component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfTypewriterFC (pure presentational) with adapter state.
 */
export const TypewriterFC: FunctionalComponent<TypewriterFCProps> = ({
  adapter,
}) => {
  const { controller, elements } = adapter;
  const { get, computed } = controller;

  const framework = get.framework();
  const compInstance = get.compInstance();
  const parts = get.parts();
  const blocks = get.blocks();
  const { assignRef } = framework;
  const { refs } = elements;

  const { displayedText, lfTag } = compInstance;

  return (
    <LfTypewriterFC
      blocks={blocks}
      cursorRef={assignRef(refs, "cursor")}
      displayedText={displayedText}
      framework={framework}
      parts={parts}
      shouldShowCursor={computed.shouldShowCursor()}
      tag={lfTag}
      textRef={assignRef(refs, "text")}
      typewriterRef={assignRef(refs, "typewriter")}
    />
  );
};
