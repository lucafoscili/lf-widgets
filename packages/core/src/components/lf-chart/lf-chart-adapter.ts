import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_CHART_BLOCKS,
  LF_CHART_PARTS,
  LfChartAdapter,
  LfChartAdapterControllerActions,
  LfChartAdapterControllerComputed,
  LfChartAdapterControllerGetters,
  LfChartAdapterControllerSetters,
  LfChartAdapterHandlers,
  LfChartAdapterThemeStyle,
  LfChartInterface,
  LfChartSeriesData,
} from "@lf-widgets/foundations";
import { prepChartActions } from "./actions.chart";
import { prepChartComputed } from "./computed.chart";
import { prepChartHandlers } from "./handlers.chart";

/**
 * Creates the canonical adapter for lf-chart.
 *
 * v4.0.0 Architecture:
 * - controller.get: Pure state reads (ALL must be functions `() => T`)
 * - controller.set: Simple single-value assignments
 * - controller.computed: Derived values, predicates, option builders (pure functions)
 * - controller.actions: Multi-step operations (lifecycle, ECharts triggers)
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfChartAdapterControllerGetters,
  setters: LfChartAdapterControllerSetters,
  getSeriesData: () => LfChartSeriesData[],
  getAxesData: () => { id: string; data: string[] }[],
  getThemeValues: () => LfChartAdapterThemeStyle,
  getAdapter: () => LfChartAdapter,
): Omit<LfChartAdapter, "dispatcher"> => {
  return {
    controller: {
      get: getters,
      set: setters,
      computed: createComputed(
        getAdapter,
        getSeriesData,
        getAxesData,
        getThemeValues,
      ),
      actions: createActions(getAdapter),
    },
    handlers: createHandlers(getAdapter),
  };
};
//#endregion

//#region Controller
export const createGetters = (
  compInstance: LfChartInterface,
  getFramework: () => any,
): LfChartAdapterControllerGetters => {
  return {
    blocks: () => LF_CHART_BLOCKS.chart,
    compInstance: () => compInstance,
    cyAttributes: () => CY_ATTRIBUTES,
    framework: () => getFramework(),
    ids: () => ({}),
    lfAttributes: () => LF_ATTRIBUTES,
    parts: () => LF_CHART_PARTS.chart,
    axis: () => compInstance.lfAxis,
    colors: () => compInstance.lfColors,
    dataset: () => compInstance.lfDataset,
    legend: () => compInstance.lfLegend,
    series: () => compInstance.lfSeries,
    sizeX: () => compInstance.lfSizeX,
    sizeY: () => compInstance.lfSizeY,
    style: () => compInstance.lfStyle,
    types: () => compInstance.lfTypes,
    xAxis: () => compInstance.lfXAxis,
    yAxis: () => compInstance.lfYAxis,
  };
};

export const createSetters = (
  updateThemeColors: () => void,
): LfChartAdapterControllerSetters => {
  return {
    style: {
      theme: () => updateThemeColors(),
    },
  };
};

export const createComputed = (
  getAdapter: () => LfChartAdapter,
  getSeriesData: () => LfChartSeriesData[],
  getAxesData: () => { id: string; data: string[] }[],
  getThemeValues: () => LfChartAdapterThemeStyle,
): LfChartAdapterControllerComputed => {
  return prepChartComputed(
    getAdapter,
    getSeriesData,
    getAxesData,
    getThemeValues,
  );
};

export const createActions = (
  getAdapter: () => LfChartAdapter,
): LfChartAdapterControllerActions => {
  return prepChartActions(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfChartAdapter,
): LfChartAdapterHandlers => {
  return prepChartHandlers(getAdapter);
};
//#endregion
