import { LfChartAdapter } from "@lf-widgets/foundations";
import {
  BarSeriesOption,
  EChartsOption,
  graphic,
  HeatmapSeriesOption,
  LineSeriesOption,
  ScatterSeriesOption,
  SeriesOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from "echarts";
import {
  getGlassBarEmphasisGradient,
  getGlassBarGradient,
  getGlassShadow,
} from "./helpers.utils";

//#region Basic
/**
 * Generates basic ECharts options configuration based on the provided chart adapter.
 *
 * @param getAdapter - A function that returns a LfChartAdapter instance containing chart configuration data
 * @returns An EChartsOption object containing the complete chart configuration
 *
 * The function handles configuration for multiple chart types including:
 * - Line charts (including area and gaussian variants)
 * - Bar charts (including stacked and horizontal variants)
 * - Scatter plots
 * - Heatmaps
 *
 * It processes:
 * - Multiple axes configuration (x and y)
 * - Series data and styling
 * - Color schemes and gradients
 * - Legend and tooltip settings
 * - Visual mapping for heatmaps
 *
 * @example
 * const options = basic(() => myChartAdapter);
 * // Use the returned options with ECharts instance
 */
export const basic = (getAdapter: () => LfChartAdapter) => {
  const { manager, mappedType, seriesData, style, xAxesData } =
    getAdapter().controller.get;
  const { axis, legend, seriesColor, theme, tooltip } = style;
  const { compute } = manager.color;
  const { background, font, text } = theme();

  const xAxes: XAXisComponentOption[] = [];
  const yAxes: YAXisComponentOption[] = [];

  const xAxisPositions: Array<"bottom" | "top"> = ["bottom", "top"];
  const yAxisPositions: Array<"left" | "right"> = ["left", "right"];

  for (let i = 0; i < xAxesData().length; i++) {
    const axisData = xAxesData()[i];
    const xAxisPosition = xAxisPositions[i % xAxisPositions.length];
    const yAxisPosition = yAxisPositions[i % yAxisPositions.length];

    xAxes.push({
      type: "category",
      data: axisData.data,
      position: xAxisPosition,
      offset: i * 30,
      axisLabel: {
        ...axis("x").axisLabel,
        interval: 0,
      },
      ...axis("x"),
    } as XAXisComponentOption);

    yAxes.push({
      type: "value",
      position: yAxisPosition,
      offset: i * 30,
      ...axis("y"),
    } as YAXisComponentOption);
  }

  const dataset = seriesData();

  const sColors = seriesColor(dataset.length);
  const seriesOptions: SeriesOption[] = dataset.map((s, index) => {
    const { axisIndex, data, name, type } = s;

    const color = sColors[index];
    const seriesType = mappedType(type);

    let seriesOption: SeriesOption;

    if (seriesType === "line") {
      seriesOption = {
        name: name,
        type: "line",
        data: data,
        xAxisIndex: axisIndex,
        yAxisIndex: axisIndex,
        itemStyle: {
          color: getGlassBarGradient(color, compute),
          borderWidth: 1,
          borderColor: `rgba(${compute(color).rgbValues}, 0.25)`,
          ...getGlassShadow(compute(background).rgbValues, 0.1),
        },
        emphasis: {
          itemStyle: {
            color: getGlassBarEmphasisGradient(color, compute),
            ...getGlassShadow(compute(text).rgbValues, 0.25),
          },
        },
      } as LineSeriesOption;

      if (type === "area") {
        (seriesOption as LineSeriesOption).areaStyle = {
          color: new graphic.LinearGradient(0, 0, 0, 0.25, [
            {
              offset: 0,
              color: `rgba(${compute(color).rgbValues}, 0.375)`,
            },
          ]),
        };
      }

      if (type === "gaussian") {
        (seriesOption as LineSeriesOption).smooth = true;
      }
    } else if (seriesType === "bar") {
      const isStacked = type === "sbar";

      seriesOption = {
        name: name,
        type: "bar",
        data: data,
        xAxisIndex: axisIndex,
        yAxisIndex: axisIndex,
        itemStyle: {
          color: getGlassBarGradient(color, compute),
          borderWidth: 1,
          borderColor: `rgba(${compute(color).rgbValues}, 0.25)`,
          ...getGlassShadow(compute(background).rgbValues, 0.1),
        },
        emphasis: {
          itemStyle: {
            color: getGlassBarEmphasisGradient(color, compute),
            ...getGlassShadow(compute(text).rgbValues, 0.25),
          },
        },
        stack: isStacked && "total",
      } as BarSeriesOption;

      if (type === "hbar") {
        xAxes[axisIndex].type = "value";
        yAxes[axisIndex].type = "category";
      }
    } else if (seriesType === "scatter") {
      seriesOption = {
        name: name,
        type: "scatter",
        data: data,
        xAxisIndex: axisIndex,
        yAxisIndex: axisIndex,
        itemStyle: {
          color: getGlassBarGradient(color, compute),
          borderWidth: 1,
          borderColor: `rgba(${compute(color).rgbValues}, 0.25)`,
          ...getGlassShadow(compute(background).rgbValues, 0.1),
        },
        emphasis: {
          itemStyle: {
            color: getGlassBarEmphasisGradient(color, compute),
            ...getGlassShadow(compute(text).rgbValues, 0.25),
          },
        },
      } as ScatterSeriesOption;
    } else if (seriesType === "heatmap") {
      seriesOption = {
        name: name,
        type: "heatmap",
        data: data,
        xAxisIndex: 0,
        yAxisIndex: 0,
        itemStyle: {
          color: getGlassBarGradient(color, compute),
          borderWidth: 1,
          borderColor: `rgba(${compute(color).rgbValues}, 0.25)`,
          ...getGlassShadow(compute(background).rgbValues, 0.1),
        },
        emphasis: {
          itemStyle: {
            color: getGlassBarEmphasisGradient(color, compute),
            ...getGlassShadow(compute(text).rgbValues, 0.25),
          },
        },
      } as unknown as HeatmapSeriesOption;
    } else {
      seriesOption = {
        name: name,
        type: type,
        data: data,
        xAxisIndex: axisIndex,
        yAxisIndex: axisIndex,
        itemStyle: {
          color: getGlassBarGradient(color, compute),
          borderWidth: 1,
          borderColor: `rgba(${compute(color).rgbValues}, 0.25)`,
          ...getGlassShadow(compute(background).rgbValues, 0.1),
        },
        emphasis: {
          itemStyle: {
            color: getGlassBarEmphasisGradient(color, compute),
            ...getGlassShadow(compute(text).rgbValues, 0.25),
          },
        },
      } as SeriesOption;
    }

    return seriesOption;
  });

  const hasVisualMap = seriesOptions.some((s) => s.type === "heatmap");

  const options: EChartsOption = {
    color: sColors,
    legend: legend(),
    tooltip: {
      ...tooltip(),
      trigger: "axis",
    },
    xAxis: xAxes,
    yAxis: yAxes,
    series: seriesOptions,
    visualMap: hasVisualMap && {
      min: Math.min(
        ...seriesOptions
          .filter((s) => s.type === "heatmap")
          .flatMap((s) =>
            s.data.map((d) => d[2 as keyof EChartsOption["visualMap"]]),
          ),
      ),
      max: Math.max(
        ...seriesOptions
          .filter((s) => s.type === "heatmap")
          .flatMap((s) =>
            s.data.map((d) => d[2 as keyof EChartsOption["visualMap"]]),
          ),
      ),
      calculable: true,
      orient: "vertical",
      left: "left",
      bottom: "15%",
      inRange: {
        color: ["#f6efa6", sColors[0]],
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
