import {
  LfChartAdapter,
  LfChartTooltipArguments,
  LfChartTooltipDataDictionary,
} from "@lf-widgets/foundations";
import { EChartsOption, FunnelSeriesOption } from "echarts";

//#region Funnel
/**
 * Generates ECharts options for a funnel chart configuration.
 *
 * @param getAdapter - A function that returns a LfChartAdapter instance, providing access to chart configuration and data
 * @returns ECharts option object configured for funnel chart visualization
 *
 * The function:
 * - Extracts chart data and styling from the adapter
 * - Calculates total values for each series
 * - Configures tooltip formatting with name, value and percentage
 * - Sets up chart appearance including colors, legend, labels and borders
 * - Creates a descending funnel chart with the processed data
 */
export const funnel = (getAdapter: () => LfChartAdapter) => {
  const { compInstance, manager, style } = getAdapter().controller.get;
  const { lfDataset, lfSeries } = compInstance;
  const { legend, seriesColor, theme, tooltip } = style;
  const { stringify } = manager.data.cell;
  const { compute } = manager.color;
  const { border, font, text } = theme();

  const data = lfSeries.map((seriesName) => {
    const totalValue = lfDataset.nodes.reduce((sum, node) => {
      return sum + parseFloat(stringify(node.cells[seriesName]?.value) || "0");
    }, 0);
    return {
      name: String(seriesName),
      value: totalValue,
    };
  });

  const formatter = (
    params: LfChartTooltipArguments<LfChartTooltipDataDictionary>,
  ) => {
    const { name, value, percent } = params;
    return `
              <strong>${name}</strong><br/>
              Value: ${value}<br/>
              Percent: ${percent}%
          `;
  };

  const colors = seriesColor(data.length);
  const options: EChartsOption = {
    color: colors.map((color) => {
      const { rgbValues } = compute(color);
      return `rgba(${rgbValues}, 0.475)`;
    }),
    legend: {
      ...legend(),
      data: data.map((item) => item.name),
    },
    series: [
      {
        type: "funnel",
        data: data,
        sort: "descending",
        label: {
          show: true,
          position: "outer",
          color: text,
          fontFamily: font,
        },
        itemStyle: {
          borderColor: border,
          borderWidth: 1,
        },
      } as FunnelSeriesOption,
    ],
    tooltip: tooltip(formatter),
  };

  return options;
};
//#endregion
