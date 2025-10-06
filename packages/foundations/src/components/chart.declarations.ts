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
  LfComponentAdapterGetters,
  LfComponentAdapterHandlers,
  LfComponentAdapterSetters,
} from "../foundations/adapter.declarations";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import {
  LfDataColumn,
  LfDataDataset,
  LfDataNode,
} from "../framework/data.declarations";
import {
  LF_CHART_AXES_TYPES,
  LF_CHART_EVENTS,
  LF_CHART_LEGEND_POSITIONS,
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
 */
export interface LfChartAdapter extends LfComponentAdapter<LfChartInterface> {
  controller: {
    get: LfChartAdapterControllerGetters;
    set: LfChartAdapterControllerSetters;
  };
  handlers: LfChartAdapterHandlers;
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
 * Utility interface used by the `lf-chart` component.
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
 * Configuration options for the adapter within `lf-chart`.
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
/**
 * Subset of adapter getters required during initialisation.
 */
export type LfChartAdapterInitializerGetters = Pick<
  LfChartAdapterControllerGetters,
  | "compInstance"
  | "columnById"
  | "manager"
  | "mappedType"
  | "seriesColumn"
  | "seriesData"
  | "style"
  | "xAxesData"
>;
/**
 * Subset of adapter setters required during initialisation.
 */
export type LfChartAdapterInitializerSetters = Pick<
  LfChartAdapterControllerSetters,
  "style"
>;
/**
 * Read-only controller surface exposed by the adapter for integration code.
 */
export interface LfChartAdapterControllerGetters
  extends LfComponentAdapterGetters<LfChartInterface> {
  compInstance: LfChartInterface;
  columnById: (id: string) => LfDataColumn;
  manager: LfFrameworkInterface;
  mappedType: (type: LfChartType) => SeriesOption["type"];
  options: LfChartAdapterOptions;
  seriesColumn: (seriesName: string) => LfDataColumn[];
  seriesData: () => LfChartSeriesData[];
  style: LfChartAdapterStyle;
  xAxesData: () => { id: string; data: string[] }[];
}
/**
 * Imperative controller callbacks exposed by the adapter.
 */
export interface LfChartAdapterControllerSetters
  extends LfComponentAdapterSetters {
  style: {
    theme: () => void;
  };
}
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
