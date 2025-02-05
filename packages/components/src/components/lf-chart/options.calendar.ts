import {
  LfChartAdapter,
  LfChartTooltipArguments,
  LfChartTooltipDataDictionary,
} from "@lf-widgets/foundations";
import { EChartsOption, HeatmapSeriesOption } from "echarts";

//#region Calendar
/**
 * Generates ECharts calendar visualization options based on the provided chart adapter.
 * Creates a calendar heatmap visualization where dates are mapped to values using a color scale.
 *
 * @param getAdapter - Function that returns a LfChartAdapter instance containing chart configuration and data
 *
 * @returns An ECharts option object configured for calendar visualization with:
 * - Calendar range set to the year of the earliest date in data
 * - Heatmap series mapping dates to values
 * - Visual map for color scaling between min/max values
 * - Styled tooltip showing date and value
 * - Themed styling for calendar elements (cells, labels, etc)
 *
 * @requires The adapter must provide:
 * - Component instance with axis, data and series configurations
 * - Style settings including colors, theme and tooltip
 * - Data management utilities
 */
export const calendar = (getAdapter: () => LfChartAdapter) => {
  const { compInstance, manager, style } = getAdapter().controller.get;
  const { lfAxis, lfDataset, lfSeries } = compInstance;
  const { seriesColor, theme, tooltip } = style;
  const { stringify } = manager.data.cell;
  const { background, border, font, text } = theme();

  const dateKey = lfAxis[0];
  const valueKey = lfSeries[0];

  const data = lfDataset.nodes.map((node) => {
    return [
      String(
        node.cells[dateKey]?.value || new Date().toISOString().split("T")[0],
      ),
      parseFloat(stringify(node.cells[valueKey]?.value) || "0"),
    ];
  });

  const year = new Date(
    Math.min(...data.map(([date]) => new Date(date).getTime())),
  ).getFullYear();

  const formatter = (
    params: LfChartTooltipArguments<LfChartTooltipDataDictionary>,
  ) => {
    const { value } = params;
    const date = (value as string)[0];
    const dataValue = (value as string)[1];
    return `
              <strong>Date:</strong> ${date}<br/>
              <strong>Value:</strong> ${dataValue}
          `;
  };
  const colors = seriesColor(1);
  const options: EChartsOption = {
    color: colors[0],
    calendar: {
      range: year,
      cellSize: ["auto", 24],
      itemStyle: {
        borderWidth: 1,
        borderColor: border,
        color: background,
      },
      dayLabel: {
        color: text,
        fontFamily: font,
      },
      monthLabel: {
        color: text,
        fontFamily: font,
      },
      yearLabel: {
        color: text,
        fontFamily: font,
      },
    },
    series: [
      {
        type: "heatmap",
        coordinateSystem: "calendar",
        data: data,
        label: {
          show: false,
        },
        itemStyle: {
          color: colors[0],
        },
      } as HeatmapSeriesOption,
    ],
    tooltip: tooltip(formatter),
    visualMap: {
      align: "auto",
      bottom: "bottom",
      inRange: {
        color: [background, colors[0]],
      },
      left: "center",
      max: Math.max(...data.map(([_, value]) => Number(value))),
      min: Math.min(...data.map(([_, value]) => Number(value))),
      orient: "horizontal",
      text: ["High", "Low"],
      textStyle: {
        color: text,
        fontFamily: font,
      },
    },
  };

  return options;
};
//#endregion
