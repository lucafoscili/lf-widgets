import {
  LfArticleDataset,
  LfChartType,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfDataDataset,
  LfEventName,
  LfEventPayloadName,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import {
  randomNumber,
  randomString,
  randomStyle,
} from "../../helpers/fixtures.helpers";
import { LfShowcaseComponentFixture } from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfChart";
const EVENT_NAME: LfEventName<"LfChart"> = "lf-chart-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfChart"> = "LfChartEventPayload";
const TAG_NAME: LfComponentTag<"LfChart"> = "lf-chart";

export const getChartFixtures = (
  _framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-chart"> => {
  //#region mock data
  const lfAxis = "Department";
  const categories = [
    lfAxis,
    "Current budget",
    "Projected Budget",
    "Allocated budget",
    "Expenditures",
    "Savings",
  ];
  const today = new Date();
  const lfDataset: LfDataDataset = {
    columns: categories.map((c) => ({ id: c, title: c })),
    nodes: Array.from({ length: randomNumber(3, 5) }).map((_c, index) => ({
      cells: categories.reduce(
        (acc, category) => {
          acc[category] = {
            value:
              category === lfAxis
                ? randomString()
                : randomNumber(1000, 20000).toString(),
          };
          return acc;
        },
        {} as Record<string, { value: string }>,
      ),
      id: index.toString(),
    })),
  };
  const data: Partial<{
    [K in LfChartType]: () => LfDataDataset;
  }> = {
    bubble: () => ({
      columns: [
        { id: "X_Value", title: "X Axis Value" },
        { id: "Y_Value", title: "Y Axis Value" },
        { id: "Bubble_Size", title: "Bubble Size" },
      ],
      nodes: [
        ...Array.from({ length: randomNumber(3, 5) }).map((_c, index) => ({
          id: index.toString(),
          cells: {
            X_Value: { value: randomNumber(1, 100).toString() },
            Y_Value: { value: randomNumber(1, 100).toString() },
            Bubble_Size: { value: randomNumber(1, 100).toString() },
          },
        })),
      ],
    }),
    calendar: () => {
      const today = new Date();
      const dataPoints = 365;
      const nodes = [];

      for (let i = 0; i < dataPoints; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        nodes.push({
          id: i.toString(),
          cells: {
            Date: { value: date.toISOString().split("T")[0] },
            Value: {
              value: Math.floor(Math.random() * 100).toString(),
            },
          },
        });
      }

      return {
        columns: [
          { id: "Date", title: "Date" },
          { id: "Value", title: "Value" },
        ],
        nodes,
      };
    },
    candlestick: () => ({
      columns: [
        { id: "Date", title: "Date" },
        { id: "Open", title: "Open" },
        { id: "Close", title: "Close" },
        { id: "Low", title: "Low" },
        { id: "High", title: "High" },
      ],
      nodes: [
        ...Array.from({ length: randomNumber(3, 5) }).map((_c, index) => ({
          id: index.toString(),
          cells: {
            Date: {
              value: today.toLocaleTimeString(),
            },
            Open: { value: randomNumber(3, 50).toString() },
            Close: { value: randomNumber(40, 200).toString() },
            Low: { value: randomNumber(80, 200).toString() },
            High: { value: randomNumber(120, 200).toString() },
          },
        })),
      ],
    }),
    funnel: () => ({
      columns: [
        { id: "Stage", title: "Stage" },
        { id: "Value", title: "Value" },
        { id: "Revenue", title: "Revenue" },
      ],
      nodes: [
        ...Array.from({ length: randomNumber(3, 5) }).map((_c, index) => ({
          id: index.toString(),
          cells: {
            Stage: { value: randomString() },
            Value: { value: randomNumber(1, 100).toString() },
            Revenue: { value: randomNumber(100, 1000).toString() },
          },
        })),
      ],
    }),
    gaussian: () => ({
      columns: [
        { id: "X", title: "X Axis (Value)" },
        { id: "Frequency", title: "Frequency" },
      ],
      nodes: [
        ...Array.from({ length: 36 }).map((_c, index) => ({
          id: index.toString(),
          cells: {
            X: { value: (index - 18).toString() },
            Frequency: {
              value: (
                Math.exp(-Math.pow(index - 18, 2) / 2) / Math.sqrt(2 * Math.PI)
              ).toString(),
            },
          },
        })),
      ],
    }),
    heatmap: () => ({
      columns: [
        { id: "Source_Channel", title: "Source Channel Intensity" },
        { id: "Target_Channel", title: "Target Channel Intensity" },
        { id: "Mapping_Count", title: "Mapping Count" },
      ],
      nodes: [
        ...Array.from({ length: randomNumber(3, 5) }).map((_c, index) => ({
          id: index.toString(),
          cells: {
            Source_Channel: { value: randomNumber(1, 100).toString() },
            Target_Channel: { value: randomNumber(1, 100).toString() },
            Mapping_Count: { value: randomNumber(1, 100).toString() },
          },
        })),
      ],
    }),
    pie: () => ({}),
    radar: () => ({
      columns: [
        { id: "Name", title: "Name" },
        { id: "Speed", title: "Speed" },
        { id: "Agility", title: "Agility" },
        { id: "Strength", title: "Strength" },
        { id: "Endurance", title: "Endurance" },
        { id: "Intelligence", title: "Intelligence" },
      ],
      nodes: [
        ...Array.from({ length: randomNumber(3, 10) }).map((_c, index) => ({
          id: index.toString(),
          cells: {
            Name: { value: randomString() },
            Speed: { value: randomNumber(1, 100).toString() },
            Agility: { value: randomNumber(1, 100).toString() },
            Strength: { value: randomNumber(1, 100).toString() },
            Endurance: { value: randomNumber(1, 100).toString() },
            Intelligence: { value: randomNumber(1, 100).toString() },
          },
        })),
      ],
    }),
    sankey: () => ({
      columns: [
        { id: "Source", title: "Source" },
        { id: "Target", title: "Target" },
        { id: "Value", title: "Value" },
      ],
      nodes: [
        {
          id: "0",
          cells: {
            Source: { value: "Marketing" },
            Target: { value: "Sales" },
            Value: { value: "300" },
          },
        },

        {
          id: "1",
          cells: {
            Source: { value: "Sales" },
            Target: { value: "Support" },
            Value: { value: "150" },
          },
        },
        {
          id: "2",
          cells: {
            Source: { value: "Marketing" },
            Target: { value: "Development" },
            Value: { value: "200" },
          },
        },
        {
          id: "3",
          cells: {
            Source: { value: "Development" },
            Target: { value: "Operations" },
            Value: { value: "100" },
          },
        },
        {
          id: "4",
          cells: {
            Source: { value: "Operations" },
            Target: { value: "Support" },
            Value: { value: "50" },
          },
        },
      ],
    }),
    scatter: () => ({
      columns: [
        { id: "X", title: "X Axis" },
        { id: "Y", title: "Y Axis" },
      ],
      nodes: [
        ...Array.from({ length: randomNumber(3, 5) }).map((_c, index) => ({
          id: index.toString(),
          cells: {
            X: { value: randomNumber(1, 100).toString() },
            Y: { value: randomNumber(1, 100).toString() },
          },
        })),
      ],
    }),
  };

  const mixedHeatmap: () => LfDataDataset = () => {
    const xCategories = ["A", "B", "C", "D", "E"];
    const yCategories = ["W", "X", "Y", "Z"];
    const nodes = [];

    for (let i = 0; i < xCategories.length; i++) {
      for (let j = 0; j < yCategories.length; j++) {
        nodes.push({
          id: `${i}-${j}`,
          cells: {
            X: { value: xCategories[i] },
            Y: { value: yCategories[j] },
            Heat_Value: {
              value: Math.floor(Math.random() * 100).toString(),
            },
            Line_Value: { value: (i + j).toString() },
          },
        });
      }
    }

    return {
      columns: [
        { id: "X", title: "X Axis" },
        { id: "Y", title: "Y Axis" },
        { id: "Heat_Value", title: "Heatmap Value" },
        { id: "Line_Value", title: "Line Value" },
      ],
      nodes,
    };
  };
  //#endregion

  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "is designed to plot data on charts",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            data: JSON.stringify({
              columns: [
                { id: "my_column_1", title: "My column" },
                { id: "my_column_2", title: "My column (2)" },
              ],
              nodes: [
                { id: "my_node_1", value: 1 },
                { id: "my_node_2", value: 2 },
              ],
            } as LfDataDataset),
            tag: TAG_NAME,
          }),
          SECTION_FACTORY.props(TAG_NAME),
          SECTION_FACTORY.events(
            COMPONENT_NAME,
            PAYLOAD_NAME,
            [
              {
                type: "click",
                description: "emitted when the component is clicked",
              },
              {
                type: "ready",
                description:
                  "emitted when the component completes its first complete lifecycle",
              },
              {
                type: "unmount",
                description:
                  "emitted when the component is disconnected from the DOM",
              },
            ],
            EVENT_NAME,
          ),
          SECTION_FACTORY.methods(TAG_NAME),
          SECTION_FACTORY.styling(TAG_NAME),
        ],
      },
    ],
  };
  //#endregion

  return {
    //#region configuration
    configuration: {
      columns: {
        line: 3,
        bar: 3,
        bubble: 1,
        calendar: 1,
        candlestick: 1,
        dualAxis: 1,
        funnel: 1,
        mixed: 3,
        pie: 1,
        radar: 1,
        sankey: 1,
        scatter: 1,
        heatmap: 2,
        uncategorized: 1,
      },
    },
    documentation,
    examples: {
      //#region Line
      line: {
        simple: {
          description: "Line",
          props: {
            lfAxis,
            lfDataset,
            lfSizeY: "400px",
          },
        },
        area: {
          description: "Area",
          props: {
            lfAxis,
            lfDataset,
            lfSizeY: "400px",
            lfTypes: ["area"],
          },
        },
        gaussian: {
          description: "Gaussian",
          props: {
            lfAxis: "X",
            lfDataset: data.gaussian(),
            lfSeries: ["Frequency"],
            lfSizeY: "400px",
            lfTypes: ["gaussian"],
          },
        },
      },
      //#endregion

      //#region Bar
      bar: {
        simple: {
          description: "Vertical",
          props: {
            lfAxis,
            lfDataset,
            lfSizeY: "400px",
            lfTypes: ["bar"],
          },
        },
        stacked: {
          description: "Stacked Bar Chart",
          props: {
            lfAxis,
            lfDataset,
            lfSizeY: "400px",
            lfTypes: ["sbar", "sbar", "sbar"],
          },
        },
        hbar: {
          description: "Horizontal",
          props: {
            lfAxis,
            lfDataset,
            lfSizeY: "400px",
            lfTypes: ["hbar"],
          },
        },
      },
      //#endregion

      //#region Bubble
      bubble: {
        simple: {
          description: "Bubble",
          props: {
            lfAxis: ["X_Value", "Y_Value"],
            lfDataset: data.bubble(),
            lfSeries: ["Bubble_Size"],
            lfSizeY: "400px",
            lfTypes: ["bubble"],
          },
        },
      },
      //#endregion

      //#region Calendar
      calendar: {
        simple: {
          description: "Calendar",
          props: {
            lfAxis: "Date",
            lfDataset: data.calendar(),
            lfSeries: ["Value"],
            lfSizeY: "400px",
            lfTypes: ["calendar"],
          },
        },
      },
      //#endregion

      //#region Candlestick
      candlestick: {
        simple: {
          description: "Candlestick",
          props: {
            lfAxis: "Date",
            lfDataset: data.candlestick(),
            lfSeries: ["Open", "Close", "Low", "High"],
            lfSizeY: "400px",
            lfTypes: ["candlestick"],
          },
        },
      },
      //#endregion

      //#region Dual Axis
      dualAxis: {
        simple: {
          description: "Dual Axis Chart",
          props: {
            lfAxis: [lfAxis, lfAxis],
            lfDataset,
            lfSizeY: "400px",
            lfTypes: ["bar", "bar", "line", "line"],
          },
        },
      },
      //#endregion

      //#region Funnel
      funnel: {
        simple: {
          description: "Funnel",
          props: {
            lfAxis: "Stage",
            lfDataset: data.funnel(),
            lfSizeY: "400px",
            lfTypes: ["funnel"],
          },
        },
      },
      //#endregion

      //#region Heatmap
      heatmap: {
        simple: {
          description: "Heatmap",
          props: {
            lfAxis: "Source_Channel",
            lfDataset: data.heatmap(),
            lfSeries: ["Target_Channel", "Mapping_Count"],
            lfSizeY: "400px",
            lfTypes: ["heatmap"],
          },
        },
        heatmapWithLine: {
          description: "Heatmap with Line Overlay",
          props: {
            lfAxis: ["X", "Y"],
            lfDataset: mixedHeatmap(),
            lfSeries: ["Heat_Value", "Line_Value"],
            lfSizeY: "400px",
            lfTypes: ["heatmap", "line"],
          },
        },
      },
      //#endregion

      //#region Mixed
      mixed: {
        mixedLineBar: {
          description: "Mixed Line and Bar with Multiple Y-Axes",
          props: {
            lfAxis,
            lfDataset,
            lfSizeY: "400px",
            lfTypes: ["bar", "line", "bar", "line"],
          },
        },
        mixedTypesMultiAxis: {
          description: "Mixed Types with Multiple Axes",
          props: {
            lfAxis: [lfAxis, lfAxis],
            lfDataset,
            lfSizeY: "400px",
            lfTypes: ["bar", "line", "scatter", "line", "bar"],
          },
        },
        multiAxis: {
          description: "Multi-Axis Chart with Different Units",
          props: {
            lfAxis: [lfAxis, lfAxis],
            lfDataset,
            lfSizeY: "400px",
            lfTypes: ["line", "line", "line"],
          },
        },
        multiAxisLine: {
          description: "Multi-Axis Line Chart",
          props: {
            lfAxis: [lfAxis, lfAxis],
            lfDataset,
            lfSizeY: "400px",
            lfTypes: ["line", "line"],
          },
        },
      },
      //#endregion

      //#region Pie
      pie: {
        simple: {
          description: "Pie",
          props: {
            lfAxis,
            lfDataset,
            lfSizeY: "400px",
            lfTypes: ["pie"],
          },
        },
      },
      //#endregion

      //#region Radar
      radar: {
        simple: {
          description: "Radar",
          props: {
            lfAxis: "Name",
            lfDataset: data.radar(),
            lfSeries: [
              "Speed",
              "Agility",
              "Strength",
              "Endurance",
              "Intelligence",
            ],
            lfSizeY: "400px",
            lfTypes: ["radar"],
          },
        },
      },
      //#endregion

      //#region Sankey
      sankey: {
        simple: {
          description: "Sankey",
          props: {
            lfAxis: "Source",
            lfDataset: data.sankey(),
            lfSeries: ["Target", "Value"],
            lfSizeY: "400px",
            lfTypes: ["sankey"],
          },
        },
      },
      //#endregion

      //#region Scatter
      scatter: {
        simple: {
          description: "Scatter",
          props: {
            lfAxis: "X",
            lfDataset: data.scatter(),
            lfSeries: ["Y"],
            lfSizeY: "400px",
            lfTypes: ["scatter"],
          },
        },
      },
      //#endregion

      //#region Uncategorized
      uncategorized: {
        style: {
          description: "Bar chart with custom style",
          props: {
            lfAxis,
            lfDataset,
            lfSizeY: "400px",
            lfStyle: randomStyle(),
            lfTypes: ["bar"],
          },
        },
      },
      //#endregion
    },
  };
};
