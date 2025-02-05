import { LfChartPropsInterface } from "./chart.declarations";

//#region Automatic CSS variables
export const LF_CHART_CSS_VARS = {
  height: "--lf_chart_height",
  width: "--lf_chart_width",
} as const;
//#endregion

//#region Axis Types
export const LF_CHART_AXES_TYPES = ["x", "y"] as const;
//#endregion

//#region Blocks
export const LF_CHART_BLOCKS = {
  chart: { _: "chart" },
} as const;
//#endregion

//#region Events
export const LF_CHART_EVENTS = ["click", "ready", "unmount"] as const;
//#endregion

//#region Legend Positions
export const LF_CHART_LEGEND_POSITIONS = [
  "bottom",
  "left",
  "hidden",
  "right",
  "top",
] as const;
//#endregion

//#region Parts
export const LF_CHART_PARTS = {
  chart: "chart",
} as const;
//#endregion

//#region Props
export const LF_CHART_PROPS = [
  "lfAxis",
  "lfColors",
  "lfDataset",
  "lfLegend",
  "lfSeries",
  "lfSizeX",
  "lfSizeY",
  "lfStyle",
  "lfTypes",
  "lfXAxis",
  "lfYAxis",
] as const satisfies (keyof LfChartPropsInterface)[];
//#endregion

//#region Types
export const LF_CHART_TYPES = [
  "area",
  "bar",
  "bubble",
  "calendar",
  "candlestick",
  "funnel",
  "gaussian",
  "hbar",
  "heatmap",
  "line",
  "pie",
  "radar",
  "sankey",
  "sbar",
  "scatter",
] as const;
//#endregion
