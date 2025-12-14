import {
  LfChartAdapter,
  LfChartAdapterControllerComputed,
  LfChartSeriesData,
  LfChartType,
} from "@lf-widgets/foundations";
import { LegendComponentOption } from "echarts";
import {
  prepAxis,
  prepLabel,
  prepLegend,
  prepSeries,
  prepTooltip,
} from "./helpers.utils";
import { basic } from "./options.basic";
import { bubble } from "./options.bubble";
import { calendar } from "./options.calendar";
import { candlestick } from "./options.candlestick";
import { funnel } from "./options.funnel";
import { heatmap } from "./options.heatmap";
import { pie } from "./options.pie";
import { radar } from "./options.radar";
import { sankey } from "./options.sankey";

/**
 * Prepares the computed domain for the lf-chart adapter.
 * Contains derived values, predicates, and option builders.
 *
 * Option builders are placed here because they COMPUTE complex
 * ECharts options from state, rather than simply reading state.
 *
 * @param getAdapter - Factory function to retrieve the adapter instance
 * @param getSeriesData - Factory function to retrieve series data (internal state)
 * @param getAxesData - Factory function to retrieve axes data (internal state)
 * @param getThemeValues - Factory function to retrieve theme values (internal state)
 * @returns The computed controller interface
 */
export const prepChartComputed = (
  getAdapter: () => LfChartAdapter,
  getSeriesData: () => LfChartSeriesData[],
  getAxesData: () => { id: string; data: string[] }[],
  getThemeValues: () => any,
): LfChartAdapterControllerComputed => {
  //#region Helpers
  /**
   * Checks if the first chart type matches the given type.
   */
  const isChartType = (type: LfChartType): boolean => {
    const types = getAdapter().controller.get.types();
    return types?.[0] === type;
  };
  //#endregion

  return {
    //#region Type predicates
    is: {
      areaChart: () => isChartType("area"),
      barChart: () => isChartType("bar"),
      bubbleChart: () => isChartType("bubble"),
      calendarChart: () => isChartType("calendar"),
      candlestickChart: () => isChartType("candlestick"),
      funnelChart: () => isChartType("funnel"),
      gaussianChart: () => isChartType("gaussian"),
      hbarChart: () => isChartType("hbar"),
      heatmapChart: () => isChartType("heatmap"),
      lineChart: () => isChartType("line"),
      pieChart: () => isChartType("pie"),
      radarChart: () => isChartType("radar"),
      sankeyChart: () => isChartType("sankey"),
      sbarChart: () => isChartType("sbar"),
      scatterChart: () => isChartType("scatter"),
    },
    //#endregion

    //#region Option builders
    options: {
      basic: () => basic(getAdapter),
      bubble: () => bubble(getAdapter),
      calendar: () => calendar(getAdapter),
      candlestick: () => candlestick(getAdapter),
      funnel: () => funnel(getAdapter),
      heatmap: () => heatmap(getAdapter),
      pie: () => pie(getAdapter),
      radar: () => radar(getAdapter),
      sankey: () => sankey(getAdapter),
    },
    //#endregion

    //#region Data derivations
    columnById: (id: string) => {
      const { framework, dataset } = getAdapter().controller.get;
      return framework().data.column.find(dataset(), { id })[0];
    },

    mappedType: (type: LfChartType) => {
      switch (type) {
        case "area":
        case "gaussian":
          return "line";
        case "calendar":
        case "hbar":
        case "sbar":
          return "bar";
        case "bubble":
          return "scatter";
        default:
          return type;
      }
    },

    seriesColumn: (seriesName: string) => {
      const { framework, dataset } = getAdapter().controller.get;
      return framework().data.column.find(dataset(), { title: seriesName });
    },

    seriesData: () => getSeriesData(),

    xAxesData: () => getAxesData(),
    //#endregion

    //#region Style builders
    style: {
      axis: (axisType) => prepAxis(getAdapter, axisType),
      label: () => prepLabel(getAdapter),
      legend: () => prepLegend(getAdapter) as LegendComponentOption,
      seriesColor: (amount: number) => prepSeries(getAdapter, amount),
      theme: () => getThemeValues(),
      tooltip: (formatter) => prepTooltip(getAdapter, formatter),
    },
    //#endregion
  };
};
