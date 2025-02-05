import {
  LfChartAdapter,
  LfChartTooltipArguments,
  LfChartTooltipDataArray,
} from "@lf-widgets/foundations";
import { EChartsOption } from "echarts";

//#region Bubble
/**
 * Generates ECharts options for a bubble chart visualization.
 *
 * This function creates a configuration object for a bubble chart where:
 * - X-axis values are taken from the first axis definition
 * - Y-axis values are taken from the second axis definition
 * - Bubble sizes are determined by the first series definition
 *
 * The function handles data parsing, axis labeling, tooltip formatting, and styling configuration.
 *
 * @param getAdapter - A function that returns an LfChartAdapter instance providing access to chart controller and data
 * @returns {EChartsOption} An ECharts option object configured for bubble chart visualization
 *
 * @example
 * const options = bubble(() => myChartAdapter);
 */
export const bubble = (getAdapter: () => LfChartAdapter) => {
  const { get } = getAdapter().controller;
  const { columnById, compInstance, manager, style } = get;
  const { lfAxis, lfDataset, lfSeries } = compInstance;
  const { axis, seriesColor, theme, tooltip } = style;
  const { stringify } = manager.data.cell;
  const { font, text } = theme();

  const xAxisKey = lfAxis[0];
  const yAxisKey = lfAxis[1];
  const sizeKey = lfSeries[0];

  const xData = lfDataset.nodes.map((node) =>
    parseFloat(stringify(node.cells[xAxisKey]?.value) || "0"),
  );
  const yData = lfDataset.nodes.map((node) =>
    parseFloat(stringify(node.cells[yAxisKey]?.value) || "0"),
  );
  const sizeData = lfDataset.nodes.map((node) =>
    parseFloat(stringify(node.cells[sizeKey]?.value) || "0"),
  );

  const data = xData.map((x, index) => [x, yData[index], sizeData[index]]);

  const formatter = (
    params: LfChartTooltipArguments<LfChartTooltipDataArray>,
  ) => {
    const { data } = params;
    const [x, y, size] = data;
    const xAxisLabel = columnById(xAxisKey)?.title || xAxisKey;
    const yAxisLabel = columnById(yAxisKey)?.title || yAxisKey;
    const sizeLabel = columnById(sizeKey)?.title || sizeKey;

    return `
              ${xAxisLabel}: <strong>${x}</strong><br/>
              ${yAxisLabel}: <strong>${y}</strong><br/>
              ${sizeLabel}: <strong>${size}</strong>
          `;
  };

  const options: EChartsOption = {
    xAxis: {
      name: columnById(xAxisKey)?.title || xAxisKey,
      nameLocation: "middle",
      nameGap: 25,
      axisLabel: axis("x").axisLabel,
    },
    yAxis: {
      name: columnById(yAxisKey)?.title || yAxisKey,
      axisLabel: axis("y").axisLabel,
    },
    series: [
      {
        label: {
          color: text,
          fontFamily: font,
        },
        type: "scatter",
        data,
        symbolSize: (val) => val[2],
        itemStyle: {
          color: seriesColor(1)[0],
        },
      },
    ],
    tooltip: tooltip(formatter),
  };

  return options;
};
//#endregion
