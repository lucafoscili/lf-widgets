import { LfChartAdapter } from "@lf-widgets/foundations";
import { EChartsOption } from "echarts";

//#region Heatmap
/**
 * Generates ECharts configuration options for a heatmap visualization.
 *
 * @param getAdapter - A function that returns a LfChartAdapter instance containing chart configuration and data
 * @returns An EChartsOption object configured for heatmap visualization with the following features:
 * - X and Y axes with categories derived from data
 * - Heatmap series with customizable colors and borders
 * - Interactive tooltip
 * - Visual map legend for color scaling
 * - Theme-consistent styling (colors, fonts, borders)
 *
 * The heatmap is constructed using:
 * - First axis value as X categories
 * - First series value as Y categories
 * - Second series value as heat intensity
 *
 * Data is automatically normalized and mapped to the appropriate coordinates.
 */
export const heatmap = (getAdapter: () => LfChartAdapter) => {
  const { compInstance, manager, style } = getAdapter().controller.get;
  const { lfAxis, lfDataset, lfSeries } = compInstance;
  const { seriesColor, theme, tooltip } = style;
  const { stringify } = manager.data.cell;
  const { border, font, text } = theme();

  const xAxisKey = lfAxis[0];
  const yAxisKey = lfSeries[0];
  const valueKey = lfSeries[1];

  const xCategories: Set<string> = new Set();
  const yCategories: Set<string> = new Set();

  const data = lfDataset.nodes.map((node) => {
    const xValue = stringify(node.cells[xAxisKey]?.value) || "";
    const yValue = stringify(node.cells[yAxisKey]?.value) || "";
    const value = parseFloat(stringify(node.cells[valueKey]?.value) || "0");

    xCategories.add(xValue);
    yCategories.add(yValue);

    return [xValue, yValue, value];
  });

  const xCategoriesArray = Array.from(xCategories);
  const yCategoriesArray = Array.from(yCategories);

  const xMap = new Map(xCategoriesArray.map((value, index) => [value, index]));
  const yMap = new Map(yCategoriesArray.map((value, index) => [value, index]));

  const heatmapData = data.map(([xValue, yValue, value]) => [
    xMap.get(stringify(xValue)),
    yMap.get(stringify(yValue)),
    value,
  ]);

  const colors = seriesColor(1);
  const options: EChartsOption = {
    color: colors[0],
    xAxis: {
      type: "category",
      data: xCategoriesArray,
      axisLabel: {
        color: text,
        fontFamily: font,
      },
    },
    yAxis: {
      type: "category",
      data: yCategoriesArray,
      axisLabel: {
        color: text,
        fontFamily: font,
      },
    },
    series: [
      {
        type: "heatmap",
        data: heatmapData,
        label: {
          show: false,
        },
        itemStyle: {
          borderColor: border,
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
    tooltip: tooltip(),
    visualMap: {
      min: Math.min(...heatmapData.map((item) => Number(item[2]))),
      max: Math.max(...heatmapData.map((item) => Number(item[2]))),
      calculable: true,
      orient: "vertical",
      left: "left",
      bottom: "15%",
      inRange: {
        color: ["#f6efa6", colors[0]],
      },
      text: ["High", "Low"],
      textStyle: {
        color: text,
        fontFamily: font,
      },
    },
  };

  return options;
};
//#endregion
