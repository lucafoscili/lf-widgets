import { LfChartAdapter } from "@lf-widgets/foundations";
import { CandlestickSeriesOption, EChartsOption } from "echarts";
import {
  getGlassBarEmphasisGradient,
  getGlassBarGradient,
  getGlassShadow,
} from "./helpers.utils";

//#region Candlestick
/**
 * Generates ECharts options configuration for a candlestick chart
 *
 * @param getAdapter - A function that returns a LfChartAdapter instance to access chart configuration and data
 *
 * @returns EChartsOption - Configuration object for ECharts candlestick chart containing:
 * - Color scheme based on theme
 * - X-axis configuration with category data
 * - Y-axis configuration with value type
 * - Candlestick series with OHLC (Open-High-Low-Close) data
 * - Tooltip configuration
 *
 * @remarks
 * The function expects the data to have 'Open', 'Close', 'Low', and 'High' columns.
 * It uses the first axis definition as the x-axis category.
 * Theme colors are applied for styling up/down candlesticks and axes.
 */
export const candlestick = (getAdapter: () => LfChartAdapter) => {
  const { compInstance, manager, style } = getAdapter().controller.get;
  const { lfAxis, lfDataset } = compInstance;
  const { theme, tooltip } = style;
  const { stringify } = manager.data.cell;
  const { compute } = manager.color;
  const { border, danger, font, success, text } = theme();

  const xAxisKey = lfAxis[0];

  const data = lfDataset.nodes.map((node) => {
    const open = parseFloat(stringify(node.cells["Open"]?.value) || "0");
    const close = parseFloat(stringify(node.cells["Close"]?.value) || "0");
    const low = parseFloat(stringify(node.cells["Low"]?.value) || "0");
    const high = parseFloat(stringify(node.cells["High"]?.value) || "0");
    return [open, close, low, high];
  });

  const xAxisData = lfDataset.nodes.map((node) =>
    stringify(node.cells[xAxisKey]?.value || ""),
  );

  const options: EChartsOption = {
    color: [success, danger],
    xAxis: {
      type: "category",
      data: xAxisData,
      axisLabel: {
        color: text,
        fontFamily: font,
      },
      axisLine: {
        lineStyle: {
          color: border,
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: text,
        fontFamily: font,
      },
      axisLine: {
        lineStyle: {
          color: border,
        },
      },
      splitLine: {
        lineStyle: {
          color: border,
        },
      },
    },
    series: [
      {
        type: "candlestick",
        data: data,
        itemStyle: {
          color: getGlassBarGradient(success, compute),
          borderColor: `rgba(${compute(success).rgbValues}, 0.25)`,
          color0: getGlassBarGradient(danger, compute),
          borderColor0: `rgba(${compute(danger).rgbValues}, 0.25)`,
          borderWidth: 1,
          ...getGlassShadow(compute(border).rgbValues, 0.1),
        },
        emphasis: {
          itemStyle: {
            color: getGlassBarEmphasisGradient(success, compute),
            color0: getGlassBarEmphasisGradient(danger, compute),
            ...getGlassShadow(compute(text).rgbValues, 0.25),
          },
        },
      } as CandlestickSeriesOption,
    ],
    tooltip: tooltip(),
  };

  return options;
};
//#endregion
