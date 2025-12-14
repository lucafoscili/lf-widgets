import {
  LfChartAdapter,
  LfChartAdapterHandlers,
} from "@lf-widgets/foundations";
import { ECElementEvent } from "echarts";

//#region prepChartHandlers
export const prepChartHandlers = (
  getAdapter: () => LfChartAdapter,
): LfChartAdapterHandlers => {
  return {
    onClick: (e: ECElementEvent) => {
      const adapter = getAdapter();
      const { dataset } = adapter.controller.get;
      const { seriesColumn } = adapter.controller.computed;

      const lfDataset = dataset();

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

      adapter.dispatcher.emit("click", {
        originalEvent: new Event("click"),
        data: {
          column,
          node,
          x,
          y,
        },
      });
    },
  };
};
//#endregion
