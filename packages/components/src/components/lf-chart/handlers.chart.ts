import {
  LfChartAdapter,
  LfChartAdapterHandlers,
} from "@lf-widgets/foundations";
import { ECElementEvent } from "echarts";
import { LfChart } from "./lf-chart";

//#region prepChartHandlers
export const prepChartHandlers = (
  getAdapter: () => LfChartAdapter,
): LfChartAdapterHandlers => {
  return {
    onClick: (e: ECElementEvent) => {
      const { compInstance, seriesColumn } = getAdapter().controller.get;
      const { lfDataset } = compInstance;

      const comp = compInstance as LfChart;

      const seriesName = e.seriesName;
      const dataIndex = e.dataIndex;
      const node = lfDataset?.nodes?.[dataIndex] || {
        id: "*NOTFOUND*",
      };
      const column = seriesColumn(seriesName)?.[0] || {
        id: "*NOTFOUND*",
        title: seriesName,
      };
      const x = e.name;
      let y: string | number =
        typeof e.value !== "number" && typeof e.value !== "string"
          ? String(e.value).valueOf()
          : e.value;

      if (typeof y !== "string" && typeof y !== "number") {
        y = String(y);
      }

      comp.onLfEvent(new Event("click"), "click", {
        column,
        node,
        x,
        y,
      });
    },
  };
};
//#endregion
