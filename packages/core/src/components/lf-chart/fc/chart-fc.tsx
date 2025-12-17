import { LfChartAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfChartFC } from "../lf-chart-fc";

//#region Props
export interface ChartFCProps {
  adapter: LfChartAdapter;
}
//#endregion

/**
 * FC for the chart component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfChartFC (pure presentational) with adapter state.
 *
 * Note: Chart is a complex component wrapping ECharts. The FC provides
 * the container div that ECharts will render into via a ref callback.
 */
export const ChartFC: FunctionalComponent<ChartFCProps> = ({ adapter }) => {
  const { controller, elements } = adapter;
  const { get } = controller;

  const framework = get.framework();
  const compInstance = get.compInstance();
  const { assignRef } = framework;
  const { refs } = elements;

  const { lfSizeX, lfSizeY } = compInstance;

  return (
    <LfChartFC
      chartRef={assignRef(refs, "chart")}
      framework={framework}
      sizeX={lfSizeX}
      sizeY={lfSizeY}
    />
  );
};
