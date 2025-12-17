import { LfSplashAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfSplashFC } from "../lf-splash-fc";

//#region Props
export interface SplashFCProps {
  adapter: LfSplashAdapter;
}
//#endregion

/**
 * FC for the splash component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfSplashFC (pure presentational) with adapter state.
 */
export const SplashFC: FunctionalComponent<SplashFCProps> = ({ adapter }) => {
  const { controller, elements } = adapter;
  const { get, computed } = controller;

  const framework = get.framework();
  const compInstance = get.compInstance();
  const { assignRef } = framework;
  const { refs } = elements;

  const { lfLabel } = compInstance;

  return (
    <LfSplashFC
      contentRef={assignRef(refs, "content")}
      framework={framework}
      isUnmounting={computed.isUnmounting()}
      label={lfLabel}
      labelRef={assignRef(refs, "label")}
      splashRef={assignRef(refs, "splash")}
      widgetRef={assignRef(refs, "widget")}
    />
  );
};
