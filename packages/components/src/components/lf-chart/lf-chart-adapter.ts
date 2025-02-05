import {
  LfChartAdapter,
  LfChartAdapterControllerGetters,
  LfChartAdapterControllerSetters,
  LfChartAdapterHandlers,
  LfChartAdapterInitializerGetters,
  LfChartAdapterInitializerSetters,
} from "@lf-widgets/foundations";
import { prepChartHandlers } from "./handlers.chart";
import { basic } from "./options.basic";
import { bubble } from "./options.bubble";
import { calendar } from "./options.calendar";
import { candlestick } from "./options.candlestick";
import { funnel } from "./options.funnel";
import { heatmap } from "./options.heatmap";
import { pie } from "./options.pie";
import { radar } from "./options.radar";
import { sankey } from "./options.sankey";

export const createAdapter = (
  getters: LfChartAdapterInitializerGetters,
  setters: LfChartAdapterInitializerSetters,
  getAdapter: () => LfChartAdapter,
): LfChartAdapter => {
  return {
    controller: {
      get: createGetters(getters, getAdapter),
      set: createSetters(setters),
    },
    handlers: createHandlers(getAdapter),
  };
};
//#endregion

//#region Controller
export const createGetters = (
  getters: LfChartAdapterInitializerGetters,
  getAdapter: () => LfChartAdapter,
): LfChartAdapterControllerGetters => {
  return {
    ...getters,
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
  };
};
export const createSetters = (
  setters: LfChartAdapterInitializerSetters,
): LfChartAdapterControllerSetters => {
  return setters;
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfChartAdapter,
): LfChartAdapterHandlers => {
  return prepChartHandlers(getAdapter);
};
//#endregion
