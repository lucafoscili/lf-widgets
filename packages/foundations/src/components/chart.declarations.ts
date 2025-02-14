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
export interface LfChartInterface
  extends LfComponent<"LfChart">,
    LfChartPropsInterface {}
export interface LfChartElement
  extends HTMLStencilElement,
    Omit<LfChartInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
export interface LfChartAdapter extends LfComponentAdapter<LfChartInterface> {
  controller: {
    get: LfChartAdapterControllerGetters;
    set: LfChartAdapterControllerSetters;
  };
  handlers: LfChartAdapterHandlers;
}
export interface LfChartAdapterHandlers extends LfComponentAdapterHandlers {
  onClick: (e: ECElementEvent) => boolean | void;
}
export interface LfChartAdapterThemeStyle {
  background: string;
  border: string;
  danger: string;
  font: string;
  success: string;
  text: string;
}
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
export type LfChartAdapterInitializerSetters = Pick<
  LfChartAdapterControllerSetters,
  "style"
>;
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
export interface LfChartAdapterControllerSetters
  extends LfComponentAdapterSetters {
  style: {
    theme: () => void;
  };
}
//#endregion

//#region Events
export type LfChartEvent = (typeof LF_CHART_EVENTS)[number];
export interface LfChartEventPayload
  extends LfEventPayload<"LfChart", LfChartEvent> {
  data?: LfChartEventData;
}
export interface LfChartEventData {
  column: LfDataColumn;
  node: LfDataNode;
  x: number | string;
  y: number | string;
}
//#endregion

//#region Internal usage
export type LfChartAxesTypes = (typeof LF_CHART_AXES_TYPES)[number];
export type LfChartTooltipDataArray = number[];
export type LfChartTooltipDataDictionary = {
  name?: string;
  source?: string;
  target?: string;
  value?: number | string[];
};
export type LfChartTooltipData =
  | LfChartTooltipDataDictionary
  | LfChartTooltipDataArray;
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
export type LfChartType = (typeof LF_CHART_TYPES)[number];
export type LfChartLegendPlacement = (typeof LF_CHART_LEGEND_POSITIONS)[number];
export type LfChartXAxis = XAXisComponentOption;
export type LfChartYAxis = YAXisComponentOption;
export type LfChartAxis = string | string[];
export interface LfChartSeriesData {
  name: string;
  data: number[];
  axisIndex: number;
  type: LfChartType;
}
//#endregion
