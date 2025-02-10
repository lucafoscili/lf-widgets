import { LfChartAdapter } from "@lf-widgets/foundations";
import { EChartsOption, RadarSeriesOption } from "echarts";
import { applyOpacity } from "./helpers.utils";

//#region Radar
/**
 * Generates ECharts radar chart configuration options based on the provided chart adapter.
 *
 * @param getAdapter - A function that returns the chart adapter instance containing component data and styling information
 * @returns {EChartsOption} Configuration object for ECharts radar chart
 *
 * The function processes the following data:
 * - Series data to determine axis indicators and their max values
 * - Node data to create data points
 * - Styling information including:
 *   - Colors for series and chart elements
 *   - Legend configuration
 *   - Radar chart specific styling (shape, axis, split areas/lines)
 *   - Tooltip configuration
 *
 * The resulting radar chart will display multiple data series in a circular layout
 * with customizable styling and interactive features.
 */
export const radar = (getAdapter: () => LfChartAdapter) => {
  const { compInstance, manager, seriesData, style } =
    getAdapter().controller.get;
  const { lfAxis, lfDataset, lfSeries } = compInstance;
  const { legend, seriesColor, theme, tooltip } = style;
  const { stringify } = manager.data.cell;
  const { font, text } = theme();

  const indicator = lfSeries.map((seriesName) => {
    const max =
      seriesData()
        .find((s) => s.name === seriesName)
        ?.data.reduce((a, b) => Math.max(a, b), 0) || 100;
    return {
      name: seriesName,
      max,
    };
  });

  const data = lfDataset.nodes.map((node) => {
    const name = stringify(node.cells[lfAxis[0]]?.value) || "Entity";
    const value = lfSeries.map((seriesName) =>
      parseFloat(stringify(node.cells[seriesName]?.value) || "0"),
    );
    return {
      name,
      value,
    };
  });

  const colors = seriesColor(data.length);
  const options: EChartsOption = {
    color: colors,
    legend: {
      ...legend(),
      data: data.map((item) => item.name),
    },
    radar: {
      indicator,
      shape: "circle",
      axisName: {
        color: text,
        fontFamily: font,
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: [applyOpacity(colors[0], "1A"), applyOpacity(colors[1], "0D")],
        },
      },
      splitLine: {
        lineStyle: {
          color: colors[2] || "rgba(128, 128, 128, 0.5)",
          type: "dashed",
        },
      },
      axisLine: {
        lineStyle: {
          color: colors[2] || "rgba(128, 128, 128, 0.5)",
        },
      },
      axisTick: { alignWithLabel: false, show: false },
    },
    series: [
      {
        areaStyle: {
          opacity: 0.2,
        },
        lineStyle: {
          width: 2,
        },
        symbol: "circle",
        symbolSize: 6,
        type: "radar",
        data,
      } as RadarSeriesOption,
    ],
    tooltip: tooltip(),
  };

  return options;
};
//#endregion
