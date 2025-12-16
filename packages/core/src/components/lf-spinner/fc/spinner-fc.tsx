import {
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfSpinnerAdapter,
} from "@lf-widgets/foundations";
import { Fragment, FunctionalComponent, h } from "@stencil/core";

//#region Props
export interface SpinnerFCProps {
  adapter: LfSpinnerAdapter;
}
//#endregion

/**
 * FC for the spinner component.
 * Per Section 5.9 "Mirroring Rule" - encapsulates spinner UI.
 */
export const SpinnerFC: FunctionalComponent<SpinnerFCProps> = ({ adapter }) => {
  const { controller, elements } = adapter;
  const { get } = controller;

  const { theme } = get.framework();
  const comp = get.compInstance();
  const lf = get.lfAttributes();

  const { setLfStyle } = theme;
  const { lfStyle, lfUiState } = comp;

  return (
    <Fragment>
      {lfStyle && <style id={LF_STYLE_ID}>{setLfStyle(comp)}</style>}
      <div data-lf={lf[lfUiState]} id={LF_WRAPPER_ID}>
        {elements.jsx.spinner()}
      </div>
    </Fragment>
  );
};
