import {
  LfChartAdapter,
  LfChartTooltipArguments,
  LfChartTooltipDataDictionary,
} from "@lf-widgets/foundations";
import { EChartsOption, PieSeriesOption } from "echarts";

//#region Pie
/**
 * Generates ECharts options configuration for a pie chart
 * @param getAdapter - Function that returns a LfChartAdapter instance
 * @returns {EChartsOption} ECharts configuration object for pie chart visualization
 *
 * The function:
 * - Extracts chart data and configuration from the adapter
 * - Maps series data to pie chart format
 * - Configures tooltip formatting with name, value and percentage
 * - Sets up chart colors, labels, legend and tooltip
 * - Returns complete ECharts options for pie chart rendering
 */
export const pie = (getAdapter: () => LfChartAdapter) => {
  const { columnById, compInstance, manager, seriesData, style } =
    getAdapter().controller.get;
  const { lfAxis } = compInstance;
  const { compute } = manager.color;
  const { label, legend, seriesColor, tooltip } = style;

  const data = seriesData().map((s) => ({
    name: s.name,
    value: s.data.reduce((a, b) => a + b, 0),
  }));

  const formatter = (
    params: LfChartTooltipArguments<LfChartTooltipDataDictionary>,
  ) => {
    const {
      data: { name, value },
      percent,
      seriesName,
    } = params;
    const title = columnById(seriesName).title || seriesName;
    return `<strong>${title}</strong><br/>${name}: ${value.toLocaleString()} (${percent.toFixed(2)}%)`;
  };

  const colors = seriesColor(data.length);
  const options: EChartsOption = {
    color: colors.map((color) => {
      const { rgbValues } = compute(color);
      return `rgba(${rgbValues}, 0.475)`;
    }),
    label: label(),
    legend: legend(),
    tooltip: {
      ...tooltip(formatter),
      trigger: "item",
    },
    series: [
      {
        name: lfAxis[0] || "Data",
        type: "pie",
        data,
      } as PieSeriesOption,
    ],
  };

  return options;
};
//#endregion
