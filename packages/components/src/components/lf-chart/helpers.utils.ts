import {
  LF_THEME_COLORS_DATA_PREFIX,
  LfChartAdapter,
  LfColorInput,
  LfThemeColorDataVariables,
} from "@lf-widgets/foundations";
import {
  EChartsOption,
  graphic,
  LegendComponentOption,
  TooltipComponentFormatterCallback,
  TooltipComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from "echarts";

//#region baseAxis
const baseAxis = (
  getAdapter: () => LfChartAdapter,
): XAXisComponentOption | YAXisComponentOption => {
  const adapter = getAdapter();
  const { manager, style } = adapter.controller.get;
  const { border, font, text } = style.theme();
  const { compute } = manager.color;

  return {
    alignTicks: false,
    axisLabel: {
      color: text,
      fontFamily: font,
      hideOverlap: true,
      margin: 12,
      overflow: "truncate",
    },
    axisLine: {
      lineStyle: {
        color: `rgba(${compute(text).rgbValues}, 0.25)`,
        width: 1,
      },
    },
    axisPointer: { label: { color: text } },
    axisTick: { lineStyle: { color: border } },
    boundaryGap: ["0%", "0%"],
    nameGap: 20,
    nameTextStyle: { color: text, fontFamily: font },
    splitLine: {
      lineStyle: {
        color: `rgba(${compute(text).rgbValues}, 0.25)`,
      },
    },
  };
};
//#endregion

//#region applyOpacity
/**
 * Combines a color string with an opacity value to create a color with transparency.
 * @param color - The base color string (e.g., '#FF0000', 'rgb(255,0,0)')
 * @param opacity - The opacity value to append (e.g., '80' for 50% opacity)
 * @returns A string combining the color and opacity
 */
export const applyOpacity = (color: string, opacity: string) =>
  `${color}${opacity}`;
//#endregion

//#region prepAxis
/**
 * Prepares the axis configuration for a chart by applying common settings.
 *
 * @param getAdapter - A function that returns a LfChartAdapter instance used for chart configuration
 * @returns The configured common axis settings
 */
export const prepAxis = (getAdapter: () => LfChartAdapter) => {
  const commonAxis = baseAxis(getAdapter);

  return commonAxis;
};
//#endregion

//#region prepLabel
/**
 * Prepares and returns a label configuration object for ECharts charts.
 * @param getAdapter - A function that returns a LfChartAdapter instance used to access theme styling
 * @returns An EChartsOption object containing label configuration with styling based on the theme
 */
export const prepLabel = (getAdapter: () => LfChartAdapter) => {
  const { font, text } = getAdapter().controller.get.style.theme();

  const label: EChartsOption = {
    show: true,
    formatter: "{b|{b}}",
    rich: {
      b: {
        color: text,
        fontFamily: font,
        textShadow: "none",
      },
    },
    textShadowColor: "transparent",
    textShadowOffsetX: 0,
    textShadowOffsetY: 0,
    textShadowBlur: 0,
  };
  return label;
};
//#endregion

//#region prepLegend
/**
 * Prepares and returns the legend configuration for a chart.
 * @param getAdapter - A function that returns the chart adapter instance
 * @returns {LegendComponentOption | null} The legend configuration object or null if legend is hidden
 *
 * @remarks
 * This function uses the chart adapter to:
 * - Get component instance settings
 * - Get series data
 * - Get style configuration
 *
 * The returned legend includes:
 * - Series names as legend data
 * - Position based on lfLegend setting
 * - Text styling from theme
 */
export const prepLegend = (getAdapter: () => LfChartAdapter) => {
  const { compInstance, seriesData, style } = getAdapter().controller.get;
  const { lfLegend } = compInstance;
  const { font, text } = style.theme();

  if (lfLegend === "hidden") {
    return null;
  }

  const data = seriesData().map((s) => s.name);
  const legend: LegendComponentOption = {
    data,
    itemGap: 12,
    [lfLegend]: 0,
    textStyle: {
      color: text,
      fontFamily: font,
    },
  };
  return legend;
};
//#endregion

//#region prepSeries
/**
 * Prepares an array of color strings for chart series based on provided configuration.
 * Colors are determined in the following order:
 * 1. Uses custom colors if provided via lfColors
 * 2. Uses theme CSS variables following pattern --lf-chart-color-{n}
 * 3. Generates random colors to fill remaining slots
 *
 * @param getAdapter - Function that returns the chart adapter instance
 * @param amount - Number of colors needed
 * @returns Array of hex color strings with length equal to amount parameter
 *
 * @example
 * const colors = prepSeries(() => chartAdapter, 5);
 * // Returns: ['#ff0000', '#00ff00', '#0000ff', '#random1', '#random2']
 */
export const prepSeries = (
  getAdapter: () => LfChartAdapter,
  amount: number,
) => {
  const { compInstance, manager } = getAdapter().controller.get;
  const { lfColors } = compInstance;
  const { compute, random } = manager.color;
  const { variables } = manager.theme.get.current();

  const colorArray: LfColorInput[] = [];

  if (lfColors?.length > 0) {
    colorArray.push(...lfColors.map((c) => compute(c).hexColor));
  } else {
    let index = 1;
    let colorVar =
      `${LF_THEME_COLORS_DATA_PREFIX}${index}` as keyof LfThemeColorDataVariables;
    while (variables[colorVar]) {
      colorArray.push(compute(String(variables[colorVar])).hexColor);
      index++;
      colorVar = `${LF_THEME_COLORS_DATA_PREFIX}${index}`;
    }
  }

  while (colorArray.length < amount) {
    colorArray.push(random(128));
  }

  return colorArray.slice(0, amount);
};
//#endregion

//#region prepTooltip
/**
 * Prepares and returns a tooltip configuration object for an echarts chart.
 * @param getAdapter - A function that returns an LfChartAdapter instance to access theme styling
 * @param formatter - Optional callback function to format the tooltip content
 * @returns {TooltipComponentOption} A configured tooltip object with background, formatting, and text styling
 */
export const prepTooltip = (
  getAdapter: () => LfChartAdapter,
  formatter?: TooltipComponentFormatterCallback<any>,
) => {
  const adapter = getAdapter();
  const { manager, style } = adapter.controller.get;
  const { background, border, font, text } = style.theme();
  const { compute } = manager.color;

  const tooltip: TooltipComponentOption = {
    backgroundColor: `rgba(${compute(background).rgbValues}, 0.575)`,
    formatter,
    textStyle: {
      color: text,
      fontFamily: font,
      textShadowColor: `rgba(${compute(background).rgbValues}, 0.5)`,
      textShadowBlur: 2,
    },
    borderWidth: 1,
    borderColor: `rgba(${compute(border).rgbValues}, 0.25)`,
  };
  return tooltip;
};
//#endregion

export function getGlassBarGradient(
  color: string,
  compute: (c: string) => { rgbValues: string },
) {
  const gradient = new graphic.LinearGradient(0, 0, 0, 1, [
    {
      offset: 0,
      color: `rgba(${compute(color).rgbValues}, 0.25)`,
    },
    {
      offset: 0.5,
      color: `rgba(${compute(color).rgbValues}, 0.45)`,
    },
    {
      offset: 1,
      color: `rgba(${compute(color).rgbValues}, 0.6)`,
    },
  ]);
  return gradient as graphic.LinearGradient;
}

export function getGlassBarEmphasisGradient(
  color: string,
  compute: (c: string) => { rgbValues: string },
) {
  const gradient = new graphic.LinearGradient(0, 0, 0, 1, [
    {
      offset: 0,
      color: `rgba(${compute(color).rgbValues}, 0.4)`,
    },
    {
      offset: 0.5,
      color: `rgba(${compute(color).rgbValues}, 0.65)`,
    },
    {
      offset: 1,
      color: `rgba(${compute(color).rgbValues}, 0.4)`,
    },
  ]);
  return gradient as graphic.LinearGradient;
}

export function getGlassShadow(color: string, alpha = 0.15) {
  return {
    shadowBlur: 10,
    shadowColor: `rgba(${color}, ${alpha})`,
    shadowOffsetX: 3,
    shadowOffsetY: 3,
  };
}
