import { LfRadioAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfRadioFC } from "../lf-radio-fc";

//#region Props
export interface RadioFCProps {
  adapter: LfRadioAdapter;
}
//#endregion

/**
 * FC adapter wrapper for the radio component.
 * Per Section 5.9 "Mirroring Rule" - encapsulates radio UI.
 *
 * This is the adapter-aware wrapper that extracts what it needs
 * from the adapter and passes it to the pure presentational FC.
 */
export const RadioFC: FunctionalComponent<RadioFCProps> = ({ adapter }) => {
  const { controller, elements, handlers } = adapter;
  const { computed, get } = controller;

  const blocks = get.blocks();
  const { lfDataset, lfUiState } = get.compInstance();
  const framework = get.framework();
  const lf = get.lfAttributes();
  const parts = get.parts();

  const nodes = lfDataset?.nodes || [];

  if (!computed.hasNodes()) {
    return null;
  }

  return (
    <LfRadioFC
      blocks={blocks}
      computed={computed}
      framework={framework}
      handlers={handlers}
      lfAttributes={lf}
      nodes={nodes}
      parts={parts}
      refs={elements.refs}
      uiState={lfUiState}
    />
  );
};
