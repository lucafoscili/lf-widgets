import {
  LfChartAdapter,
  LfChartTooltipArguments,
  LfChartTooltipDataDictionary,
} from "@lf-widgets/foundations";
import { EChartsOption, SankeySeriesOption } from "echarts";

//#region Sankey
/**
 * Generates configuration options for a Sankey chart using ECharts.
 *
 * @param getAdapter - A function that returns a LfChartAdapter instance to access chart configuration and data
 *
 * @returns An EChartsOption object containing the complete Sankey chart configuration
 *
 * The function:
 * - Extracts source, target and value mappings from the component instance
 * - Creates links between nodes using the provided data
 * - Configures tooltip formatting for both edges and nodes
 * - Sets up visual styling including colors, fonts and line styles
 * - Automatically generates a unique set of nodes from the link data
 *
 * @example
 * ```typescript
 * const chartOptions = sankey(() => myChartAdapter);
 * // Use the options with ECharts instance
 * ```
 */
export const sankey = (getAdapter: () => LfChartAdapter) => {
  const { compInstance, manager, style } = getAdapter().controller.get;
  const { lfAxis, lfDataset, lfSeries } = compInstance;
  const { seriesColor, theme, tooltip } = style;
  const { stringify } = manager.data.cell;
  const { font, text } = theme();

  const sourceKey = lfAxis[0];
  const targetKey = lfSeries[0];
  const valueKey = lfSeries[1];

  const links = lfDataset.nodes.map((node) => {
    return {
      source: stringify(node.cells[sourceKey]?.value || "Source"),
      target: stringify(node.cells[targetKey]?.value || "Target"),
      value: parseFloat(stringify(node.cells[valueKey]?.value) || "0"),
    };
  });

  const formatter = (
    params: LfChartTooltipArguments<LfChartTooltipDataDictionary>,
  ) => {
    if (params.dataType === "edge") {
      const { source, target, value } = params.data;
      return `
                  <strong>Flow:</strong><br/>
                  ${source} → ${target}<br/>
                  Value: ${value}
              `;
    } else {
      return `<strong>${params.name}</strong>`;
    }
  };
  const colors = seriesColor(links.length);
  const options: EChartsOption = {
    color: colors,
    series: [
      {
        type: "sankey",
        data: [
          ...new Set(links.flatMap((link) => [link.source, link.target])),
        ].map((name) => ({ name })),
        links: links,
        label: {
          show: true,
          color: text,
          fontFamily: font,
        },
        lineStyle: {
          color: "gradient",
          curveness: 0.5,
        },
      } as SankeySeriesOption,
    ],
    tooltip: tooltip(formatter),
  };

  return options;
};
//#endregion
