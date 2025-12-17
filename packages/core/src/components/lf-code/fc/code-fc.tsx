import { LfCodeAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfCodeFC } from "../lf-code-fc";

//#region Props
export interface CodeFCProps {
  adapter: LfCodeAdapter;
}
//#endregion

/**
 * FC for the code component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfCodeFC (pure presentational) with adapter state.
 */
export const CodeFC: FunctionalComponent<CodeFCProps> = ({ adapter }) => {
  const { controller, elements } = adapter;
  const { get, computed } = controller;

  const framework = get.framework();
  const compInstance = get.compInstance();
  const { assignRef } = framework;
  const { refs } = elements;

  const {
    lfFadeIn,
    lfLanguage,
    lfShowCopy,
    lfShowHeader,
    lfStickyHeader,
    lfUiSize,
    lfUiState,
    lfValue,
  } = compInstance;

  const { formattedCode, shouldPreserveSpace } = computed;

  return (
    <LfCodeFC
      codeRef={assignRef(refs, "wrapper")}
      fadeIn={lfFadeIn}
      formattedCode={formattedCode()}
      framework={framework}
      language={lfLanguage}
      preRef={assignRef(refs, "pre")}
      preserveSpace={shouldPreserveSpace()}
      showCopy={lfShowCopy}
      showHeader={lfShowHeader}
      stickyHeader={lfStickyHeader}
      uiSize={lfUiSize}
      uiState={lfUiState}
      value={lfValue}
    />
  );
};
