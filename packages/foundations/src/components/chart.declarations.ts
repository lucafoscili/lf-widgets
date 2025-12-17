import type {
  ECElementEvent,
  EChartsOption,
  LegendComponentOption,
  SeriesOption,
  TooltipComponentFormatterCallback,
  TooltipComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from "echarts";
import {
  LfComponentAdapter,
  LfComponentAdapterBaseGetters,
  LfComponentAdapterDispatchDetail,
  LfComponentAdapterDispatcher,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
  LfComponentAdapterSetters,
} from "../foundations/adapter.declarations";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import {
  LfDataColumn,
  LfDataDataset,
  LfDataNode,
} from "../framework/data.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import {
  LF_CHART_AXES_TYPES,
  LF_CHART_BLOCKS,
  LF_CHART_EVENTS,
  LF_CHART_LEGEND_POSITIONS,
  LF_CHART_PARTS,
  LF_CHART_TYPES,
} from "./chart.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-chart` component. It merges the shared component contract with the component-specific props.
 */
export interface LfChartInterface
  extends LfComponent<"LfChart">,
    LfChartPropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-chart`.
 */
export interface LfChartElement
  extends HTMLStencilElement,
    Omit<LfChartInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-chart` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Pure state reads (ALL must be functions `() => T`)
 * - controller.set: Simple single-value assignments
 * - controller.computed: Derived values, predicates, option builders (pure functions)
 * - controller.actions: Multi-step operations (lifecycle, data updates)
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfChartAdapter
  extends LfComponentAdapter<
    LfChartInterface,
    LfChartEventPayload,
    LfChartAdapterHandlers,
    LfChartAdapterJsx,
    LfChartAdapterRefs,
    LfChartAdapterControllerGetters,
    LfChartAdapterControllerSetters,
    LfChartAdapterControllerComputed,
    LfChartAdapterControllerActions
  > {
  controller: {
    get: LfChartAdapterControllerGetters;
    set: LfChartAdapterControllerSetters;
    computed: LfChartAdapterControllerComputed;
    actions: LfChartAdapterControllerActions;
  };
  elements: {
    jsx: LfChartAdapterJsx;
    refs: LfChartAdapterRefs;
  };
  dispatcher: LfChartAdapterDispatcher;
  handlers: LfChartAdapterHandlers;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 */
export interface LfChartAdapterRefs extends LfComponentAdapterRefs {
  chart: HTMLDivElement;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfChartAdapterJsx extends LfComponentAdapterJsx {
  chart: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfChartAdapterHandlers extends LfComponentAdapterHandlers {
  onClick: (e: ECElementEvent) => boolean | void;
}
/**
 * Utility interface used by the `lf-chart` component.
 */
export interface LfChartAdapterThemeStyle {
  background: string;
  border: string;
  danger: string;
  font: string;
  success: string;
  text: string;
}
/**
 * Read-only controller surface exposed by the adapter for integration code.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 * Contains ONLY pure state reads - computed values go in `computed`.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfChartAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfChartInterface,
    (typeof LF_CHART_BLOCKS)["chart"],
    Record<string, string>,
    (typeof LF_CHART_PARTS)["chart"]
  > {
  /** Chart axis configuration */
  axis: () => LfChartAxis;
  /** Custom color overrides */
  colors: () => string[];
  /** Chart dataset */
  dataset: () => LfDataDataset;
  /** Legend placement */
  legend: () => LfChartLegendPlacement;
  /** Series identifiers */
  series: () => string[];
  /** Chart width */
  sizeX: () => string;
  /** Chart height */
  sizeY: () => string;
  /** Custom styling */
  style: () => string;
  /** Chart type(s) */
  types: () => LfChartType[];
  /** X-Axis configuration */
  xAxis: () => LfChartXAxis;
  /** Y-Axis configuration */
  yAxis: () => LfChartYAxis;
}
/**
 * Derived values, predicates, and option builders computed from state.
 * Pure functions with no side effects.
 * Contains option builders that COMPUTE complex ECharts configurations.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfChartAdapterControllerComputed {
  /** Chart type predicates */
  is: {
    areaChart: () => boolean;
    barChart: () => boolean;
    bubbleChart: () => boolean;
    calendarChart: () => boolean;
    candlestickChart: () => boolean;
    funnelChart: () => boolean;
    gaussianChart: () => boolean;
    hbarChart: () => boolean;
    heatmapChart: () => boolean;
    lineChart: () => boolean;
    pieChart: () => boolean;
    radarChart: () => boolean;
    sankeyChart: () => boolean;
    sbarChart: () => boolean;
    scatterChart: () => boolean;
  };
  /** ECharts option builders - COMPUTE complex options from state */
  options: LfChartAdapterOptions;
  /** Finds a column by its ID */
  columnById: (id: string) => LfDataColumn | undefined;
  /** Maps chart type to ECharts series type */
  mappedType: (type: LfChartType) => SeriesOption["type"];
  /** Finds columns matching a series name */
  seriesColumn: (seriesName: string) => LfDataColumn[];
  /** Derives series data from dataset */
  seriesData: () => LfChartSeriesData[];
  /** Style builders for chart elements */
  style: LfChartAdapterStyle;
  /** Derives x-axes data from dataset */
  xAxesData: () => { id: string; data: string[] }[];
}
/**
 * Multi-step operations that may batch changes or trigger ECharts.
 * May have side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfChartAdapterControllerActions {
  /** Disposes the ECharts instance */
  dispose: () => void;
  /** Triggers a data refresh and re-render */
  refresh: () => void;
  /** Re-renders the chart */
  render: () => void;
  /** Resizes the chart to fit container */
  resize: () => void;
}
/**
 * Simple single-value assignments exposed by the adapter.
 * Each setter performs exactly ONE state change.
 */
export interface LfChartAdapterControllerSetters
  extends LfComponentAdapterSetters {
  style: {
    theme: () => void;
  };
}
/**
 * Style configuration helpers for chart elements.
 */
export interface LfChartAdapterStyle {
  axis: (
    axisType: LfChartAxesTypes,
  ) => XAXisComponentOption | YAXisComponentOption;
  label: () => EChartsOption;
  legend: () => LegendComponentOption;
  theme: () => LfChartAdapterThemeStyle;
  tooltip: (
    formatter?: TooltipComponentFormatterCallback<unknown>,
  ) => TooltipComponentOption;
  seriesColor: (amount: number) => string[];
}
/**
 * ECharts option builders for each supported chart type.
 * These are COMPUTED values - they build complex options from state.
 */
export interface LfChartAdapterOptions {
  basic: () => EChartsOption;
  bubble: () => EChartsOption;
  calendar: () => EChartsOption;
  candlestick: () => EChartsOption;
  funnel: () => EChartsOption;
  heatmap: () => EChartsOption;
  pie: () => EChartsOption;
  radar: () => EChartsOption;
  sankey: () => EChartsOption;
}
//#endregion

//#region Dispatcher
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfChartAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfChartEventPayload>;
export type LfChartAdapterDispatcherDetailOverrides = {
  [E in LfChartEvent]: E extends "click"
    ? LfChartAdapterDispatchDetailBase & {
        data: LfChartEventData;
      }
    : E extends "ready" | "unmount"
      ? Omit<LfChartAdapterDispatchDetailBase, "originalEvent"> & {
          originalEvent?: never;
        }
      : LfChartAdapterDispatchDetailBase;
};
export type LfChartAdapterDispatcher = LfComponentAdapterDispatcher<
  LfChartEventPayload,
  LfChartAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-chart`.
 */
export type LfChartEvent = (typeof LF_CHART_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-chart` events.
 */
export interface LfChartEventPayload
  extends LfEventPayload<"LfChart", LfChartEvent> {
  data?: LfChartEventData;
}
/**
 * Data structure representing the event within `lf-chart`.
 */
export interface LfChartEventData {
  column: LfDataColumn;
  node: LfDataNode;
  x: number | string;
  y: number | string;
}
//#endregion

//#region Internal usage
/**
 * Union derived from `LF_CHART_AXES_TYPES`.
 */
export type LfChartAxesTypes = (typeof LF_CHART_AXES_TYPES)[number];
/**
 * Utility type used by the `lf-chart` component.
 */
export type LfChartTooltipDataArray = number[];
/**
 * Utility type used by the `lf-chart` component.
 */
export type LfChartTooltipDataDictionary = {
  name?: string;
  source?: string;
  target?: string;
  value?: number | string[];
};
/**
 * Data structure representing the tooltip within `lf-chart`.
 */
export type LfChartTooltipData =
  | LfChartTooltipDataDictionary
  | LfChartTooltipDataArray;
/**
 * Utility interface used by the `lf-chart` component.
 */
export interface LfChartTooltipArguments<D extends LfChartTooltipData> {
  data: D;
  dataType: string;
  name: string;
  percent: number;
  seriesName: string;
  source: D extends {
    name?: string;
    source?: string;
    target?: string;
    value?: number;
  }
    ? string
    : undefined;
  target: D extends {
    name?: string;
    source?: string;
    target?: string;
    value?: number;
  }
    ? string
    : undefined;
  value: D extends {
    name?: string;
    source?: string;
    target?: string;
    value?: number;
  }
    ? number
    : undefined;
}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-chart` component.
 */
export interface LfChartPropsInterface {
  lfAxis?: LfChartAxis;
  lfColors?: string[];
  lfDataset?: LfDataDataset;
  lfLegend?: LfChartLegendPlacement;
  lfSeries?: string[];
  lfSizeX?: string;
  lfSizeY?: string;
  lfStyle?: string;
  lfTypes?: LfChartType[];
  lfXAxis?: LfChartXAxis;
  lfYAxis?: LfChartYAxis;
}
/**
 * Union of type identifiers defined in `LF_CHART_TYPES`.
 */
export type LfChartType = (typeof LF_CHART_TYPES)[number];
/**
 * Utility type used by the `lf-chart` component.
 */
export type LfChartLegendPlacement = (typeof LF_CHART_LEGEND_POSITIONS)[number];
/**
 * Utility type used by the `lf-chart` component.
 */
export type LfChartXAxis = XAXisComponentOption;
/**
 * Utility type used by the `lf-chart` component.
 */
export type LfChartYAxis = YAXisComponentOption;
/**
 * Utility type used by the `lf-chart` component.
 */
export type LfChartAxis = string | string[];
/**
 * Data structure representing the series within `lf-chart`.
 */
export interface LfChartSeriesData {
  name: string;
  data: number[];
  axisIndex: number;
  type: LfChartType;
}
//#endregion

//#region Functional Component
/**
 * Props interface for the `LfChartFC` functional component.
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * Note: Chart is a wrapper around ECharts. The FC provides the container
 * div that ECharts will render into via the chartRef callback.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfChartFCProps {
  /** Reference callback for the chart container element */
  chartRef?: (el: HTMLDivElement | null) => void;
  /** Assigned class for custom styling */
  className?: string;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Unique identifier for the component */
  id?: string;
  /** Chart width - passed to ECharts for proper sizing */
  sizeX?: string;
  /** Chart height - passed to ECharts for proper sizing */
  sizeY?: string;
  /** Custom CSS styles to apply (object format for Stencil JSX) */
  style?: { [key: string]: string };
}
//#endregion
