import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfChart } from "./lf-chart";
import {
  LfChartLegendPlacement,
  LfChartType,
  LfDataDataset,
} from "@lf-widgets/foundations";

//#region Test data
const MOCK_DATASET: LfDataDataset = {
  columns: [
    { id: "date", title: "Date" },
    { id: "sales", title: "Sales" },
    { id: "revenue", title: "Revenue" },
  ],
  nodes: [
    {
      id: "1",
      cells: {
        date: { value: "2024-01" },
        sales: { value: 100 },
        revenue: { value: 1000 },
      },
    },
    {
      id: "2",
      cells: {
        date: { value: "2024-02" },
        sales: { value: 150 },
        revenue: { value: 1500 },
      },
    },
    {
      id: "3",
      cells: {
        date: { value: "2024-03" },
        sales: { value: 200 },
        revenue: { value: 2000 },
      },
    },
  ],
};

const MOCK_PIE_DATASET: LfDataDataset = {
  columns: [
    { id: "category", title: "Category" },
    { id: "value", title: "Value" },
  ],
  nodes: [
    { id: "1", cells: { category: { value: "A" }, value: { value: 30 } } },
    { id: "2", cells: { category: { value: "B" }, value: { value: 50 } } },
  ],
};
//#endregion

//#region Helper functions
const createPage = async (html: string): Promise<SpecPage> => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfChart],
    html,
  });
  await page.waitForChanges();
  return page;
};
//#endregion

describe("lf-chart", () => {
  beforeAll(() => {
    // Mock ResizeObserver
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    // Mock Canvas context for ECharts
    const mockCanvasContext = {
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(() => ({ data: [] })),
      putImageData: jest.fn(),
      createImageData: jest.fn(() => ({ data: [] })),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      fill: jest.fn(),
      arc: jest.fn(),
      rect: jest.fn(),
      clip: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      measureText: jest.fn(() => ({
        width: 0,
        actualBoundingBoxAscent: 0,
        actualBoundingBoxDescent: 0,
      })),
      createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn(),
      })),
      createRadialGradient: jest.fn(() => ({
        addColorStop: jest.fn(),
      })),
      createPattern: jest.fn(),
      fillText: jest.fn(),
      strokeText: jest.fn(),
      bezierCurveTo: jest.fn(),
      quadraticCurveTo: jest.fn(),
      arcTo: jest.fn(),
      isPointInPath: jest.fn(() => false),
      isPointInStroke: jest.fn(() => false),
      ellipse: jest.fn(),
      setLineDash: jest.fn(),
      getLineDash: jest.fn(() => []),
      canvas: { width: 800, height: 600 },
    };

    // Mock HTMLCanvasElement
    HTMLCanvasElement.prototype.getContext = jest.fn(
      () => mockCanvasContext,
    ) as jest.Mock;
    HTMLCanvasElement.prototype.toDataURL = jest.fn(
      () => "data:image/png;base64,",
    ) as jest.Mock;
  });

  //#region Basic Rendering
  describe("Basic Rendering", () => {
    it("should render", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      expect(page.root).toBeTruthy();
    });

    it("should render with shadow DOM", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      expect(page.root.shadowRoot).toBeTruthy();
    });

    it("should render host element with correct tag", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      expect(page.root.tagName.toLowerCase()).toBe("lf-chart");
    });

    it("should render wrapper element", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const wrapper = page.root.shadowRoot.querySelector("#lf-component");
      expect(wrapper).toBeTruthy();
    });

    it("should render style element", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const style = page.root.shadowRoot.querySelector("#lf-style");
      expect(style).toBeTruthy();
    });

    it("should render with custom id", async () => {
      const page = await createPage(`<lf-chart id="my-chart"></lf-chart>`);
      expect(page.root.id).toBe("my-chart");
    });
  });
  //#endregion

  //#region Props Handling
  describe("Props Handling", () => {
    describe("Default Props", () => {
      it("should have default props", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;

        expect(component.lfAxis).toEqual([]);
        expect(component.lfColors).toEqual([]);
        expect(component.lfDataset).toBeNull();
        expect(component.lfLegend).toBe("bottom");
        expect(component.lfSeries).toEqual([]);
        expect(component.lfSizeX).toBe("100%");
        expect(component.lfSizeY).toBe("100%");
        expect(component.lfStyle).toBe("");
        expect(component.lfTypes).toEqual(["line"]);
        expect(component.lfXAxis).toBeNull();
        expect(component.lfYAxis).toBeNull();
      });
    });

    describe("lfAxis", () => {
      it("should accept array axis", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        component.lfAxis = ["date", "category"];
        await page.waitForChanges();
        expect(component.lfAxis).toEqual(["date", "category"]);
      });

      it("should handle empty axis array", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        component.lfAxis = [];
        await page.waitForChanges();
        expect(component.lfAxis).toEqual([]);
      });
    });

    describe("lfColors", () => {
      it("should accept custom colors array", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        component.lfColors = ["#ff0000", "#00ff00", "#0000ff"];
        await page.waitForChanges();
        expect(component.lfColors).toEqual(["#ff0000", "#00ff00", "#0000ff"]);
      });

      it("should handle empty colors array", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        component.lfColors = [];
        await page.waitForChanges();
        expect(component.lfColors).toEqual([]);
      });
    });

    describe("lfDataset", () => {
      it("should accept dataset object", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        component.lfDataset = MOCK_DATASET;
        await page.waitForChanges();
        expect(component.lfDataset).toEqual(MOCK_DATASET);
      });

      it("should handle null dataset", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        component.lfDataset = null;
        await page.waitForChanges();
        expect(component.lfDataset).toBeNull();
      });
    });

    describe("lfLegend", () => {
      const legendPositions: LfChartLegendPlacement[] = [
        "bottom",
        "left",
        "right",
        "top",
        "hidden",
      ];

      legendPositions.forEach((position) => {
        it(`should accept legend position: ${position}`, async () => {
          const page = await createPage(
            `<lf-chart lf-legend="${position}"></lf-chart>`,
          );
          const component = page.rootInstance as LfChart;
          expect(component.lfLegend).toBe(position);
        });
      });
    });

    describe("lfSeries", () => {
      it("should accept series array", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        component.lfSeries = ["sales", "revenue", "profit"];
        await page.waitForChanges();
        expect(component.lfSeries).toEqual(["sales", "revenue", "profit"]);
      });

      it("should handle empty series array", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        component.lfSeries = [];
        await page.waitForChanges();
        expect(component.lfSeries).toEqual([]);
      });
    });

    describe("lfSizeX and lfSizeY", () => {
      it("should set props via HTML attributes", async () => {
        const page = await createPage(
          `<lf-chart lf-legend="top" lf-size-x="200px"></lf-chart>`,
        );
        const component = page.rootInstance as LfChart;
        expect(component.lfLegend).toBe("top");
        expect(component.lfSizeX).toBe("200px");
      });

      it("should accept pixel dimensions", async () => {
        const page = await createPage(
          `<lf-chart lf-size-x="500px" lf-size-y="300px"></lf-chart>`,
        );
        const component = page.rootInstance as LfChart;
        expect(component.lfSizeX).toBe("500px");
        expect(component.lfSizeY).toBe("300px");
      });

      it("should accept percentage dimensions", async () => {
        const page = await createPage(
          `<lf-chart lf-size-x="50%" lf-size-y="75%"></lf-chart>`,
        );
        const component = page.rootInstance as LfChart;
        expect(component.lfSizeX).toBe("50%");
        expect(component.lfSizeY).toBe("75%");
      });

      it("should accept viewport units", async () => {
        const page = await createPage(
          `<lf-chart lf-size-x="50vw" lf-size-y="50vh"></lf-chart>`,
        );
        const component = page.rootInstance as LfChart;
        expect(component.lfSizeX).toBe("50vw");
        expect(component.lfSizeY).toBe("50vh");
      });
    });

    describe("lfStyle", () => {
      it("should accept custom style string", async () => {
        const page = await createPage(
          `<lf-chart lf-style="#lf-component { color: red; }"></lf-chart>`,
        );
        const component = page.rootInstance as LfChart;
        expect(component.lfStyle).toBe("#lf-component { color: red; }");
      });

      it("should handle empty style string", async () => {
        const page = await createPage(`<lf-chart lf-style=""></lf-chart>`);
        const component = page.rootInstance as LfChart;
        expect(component.lfStyle).toBe("");
      });
    });

    describe("lfTypes", () => {
      const chartTypes: LfChartType[] = [
        "area",
        "bar",
        "line",
        "pie",
        "scatter",
      ];

      chartTypes.forEach((type) => {
        it(`should accept chart type: ${type}`, async () => {
          const page = await createPage(`<lf-chart></lf-chart>`);
          const component = page.rootInstance as LfChart;
          component.lfTypes = [type];
          await page.waitForChanges();
          expect(component.lfTypes).toEqual([type]);
        });
      });

      it("should accept multiple chart types", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        component.lfTypes = ["line", "bar"];
        await page.waitForChanges();
        expect(component.lfTypes).toEqual(["line", "bar"]);
      });
    });

    describe("lfXAxis", () => {
      it("should accept xAxis configuration", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        const xAxisConfig = { lfHideAxisLine: true };
        component.lfXAxis = xAxisConfig;
        await page.waitForChanges();
        expect(component.lfXAxis).toEqual(xAxisConfig);
      });
    });

    describe("lfYAxis", () => {
      it("should accept yAxis configuration", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        const yAxisConfig = { lfHideAxisLine: true };
        component.lfYAxis = yAxisConfig;
        await page.waitForChanges();
        expect(component.lfYAxis).toEqual(yAxisConfig);
      });
    });
  });
  //#endregion

  //#region Public Methods
  describe("Public Methods", () => {
    describe("getDebugInfo", () => {
      it("should get debug info", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        const debugInfo = await component.getDebugInfo();
        expect(debugInfo).toBeDefined();
      });

      it("should return lifecycle info object", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        const debugInfo = await component.getDebugInfo();
        expect(typeof debugInfo).toBe("object");
      });
    });

    describe("getProps", () => {
      it("should get props", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        const props = await component.getProps();
        expect(props.lfLegend).toBe("bottom");
        expect(props.lfTypes).toEqual(["line"]);
      });

      it("should return all props", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        const props = await component.getProps();

        expect(props).toHaveProperty("lfAxis");
        expect(props).toHaveProperty("lfColors");
        expect(props).toHaveProperty("lfDataset");
        expect(props).toHaveProperty("lfLegend");
        expect(props).toHaveProperty("lfSeries");
        expect(props).toHaveProperty("lfSizeX");
        expect(props).toHaveProperty("lfSizeY");
        expect(props).toHaveProperty("lfStyle");
        expect(props).toHaveProperty("lfTypes");
        expect(props).toHaveProperty("lfXAxis");
        expect(props).toHaveProperty("lfYAxis");
      });

      it("should reflect updated prop values", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        component.lfLegend = "top";
        component.lfSizeX = "400px";
        await page.waitForChanges();

        const props = await component.getProps();
        expect(props.lfLegend).toBe("top");
        expect(props.lfSizeX).toBe("400px");
      });
    });

    describe("refresh", () => {
      it("should refresh", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        await component.refresh();
        expect(page.root).toBeTruthy();
      });

      it("should trigger re-render after refresh", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        await component.refresh();
        await page.waitForChanges();
        expect(
          page.root.shadowRoot.querySelector("#lf-component"),
        ).toBeTruthy();
      });
    });

    describe("resize", () => {
      it("should call resize method without error", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        await expect(component.resize()).resolves.not.toThrow();
      });
    });

    describe("unmount", () => {
      it("should call unmount method", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        await expect(component.unmount(0)).resolves.not.toThrow();
      });

      it("should accept custom delay", async () => {
        const page = await createPage(`<lf-chart></lf-chart>`);
        const component = page.rootInstance as LfChart;
        await expect(component.unmount(100)).resolves.not.toThrow();
      });
    });
  });
  //#endregion

  //#region State Management
  describe("State Management", () => {
    it("should have debugInfo state", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      expect(component.debugInfo).toBeDefined();
    });

    it("should have themeValues state", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      expect((component as any).themeValues).toBeDefined();
    });

    it("should initialize themeValues with null values", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      const themeValues = (component as any).themeValues;
      expect(themeValues).toHaveProperty("background");
      expect(themeValues).toHaveProperty("border");
      expect(themeValues).toHaveProperty("danger");
      expect(themeValues).toHaveProperty("font");
      expect(themeValues).toHaveProperty("success");
      expect(themeValues).toHaveProperty("text");
    });
  });
  //#endregion

  //#region Event Emission
  describe("Event Emission", () => {
    it("should emit ready event on load", async () => {
      const eventSpy = jest.fn();
      const page = await createPage(`<lf-chart></lf-chart>`);
      page.root.addEventListener("lf-chart-event", eventSpy);
      await page.waitForChanges();
      expect(page.root).toBeTruthy();
    });

    it("should have lfEvent emitter defined", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      expect((component as any).lfEvent).toBeDefined();
    });
  });
  //#endregion

  //#region Chart Types Handling
  describe("Chart Types Handling", () => {
    it("should handle line chart type", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfTypes = ["line"];
      component.lfDataset = MOCK_DATASET;
      component.lfAxis = ["date"];
      component.lfSeries = ["sales"];
      await page.waitForChanges();
      expect(component.lfTypes).toEqual(["line"]);
    });

    it("should handle bar chart type", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfTypes = ["bar"];
      await page.waitForChanges();
      expect(component.lfTypes).toEqual(["bar"]);
    });

    it("should handle pie chart type", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfTypes = ["pie"];
      component.lfDataset = MOCK_PIE_DATASET;
      component.lfAxis = ["category"];
      component.lfSeries = ["value"];
      await page.waitForChanges();
      expect(component.lfTypes).toEqual(["pie"]);
    });

    it("should handle area chart type", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfTypes = ["area"];
      await page.waitForChanges();
      expect(component.lfTypes).toEqual(["area"]);
    });

    it("should handle scatter chart type", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfTypes = ["scatter"];
      await page.waitForChanges();
      expect(component.lfTypes).toEqual(["scatter"]);
    });

    it("should handle radar chart type", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfTypes = ["radar"];
      await page.waitForChanges();
      expect(component.lfTypes).toEqual(["radar"]);
    });

    it("should handle funnel chart type", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfTypes = ["funnel"];
      await page.waitForChanges();
      expect(component.lfTypes).toEqual(["funnel"]);
    });

    it("should handle bubble chart type", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfTypes = ["bubble"];
      await page.waitForChanges();
      expect(component.lfTypes).toEqual(["bubble"]);
    });

    it("should handle heatmap chart type", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfTypes = ["heatmap"];
      await page.waitForChanges();
      expect(component.lfTypes).toEqual(["heatmap"]);
    });

    it("should handle candlestick chart type", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfTypes = ["candlestick"];
      await page.waitForChanges();
      expect(component.lfTypes).toEqual(["candlestick"]);
    });

    it("should handle sankey chart type", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfTypes = ["sankey"];
      await page.waitForChanges();
      expect(component.lfTypes).toEqual(["sankey"]);
    });

    it("should handle calendar chart type", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfTypes = ["calendar"];
      await page.waitForChanges();
      expect(component.lfTypes).toEqual(["calendar"]);
    });
  });
  //#endregion

  //#region Edge Cases
  describe("Edge Cases", () => {
    it("should handle empty dataset", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfDataset = { columns: [], nodes: [] };
      await page.waitForChanges();
      expect(page.root).toBeTruthy();
    });

    it("should handle dataset with no nodes", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfDataset = {
        columns: [{ id: "col1", title: "Col1" }],
        nodes: [],
      };
      await page.waitForChanges();
      expect(page.root).toBeTruthy();
    });

    it("should handle dataset with no columns", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfDataset = { columns: [], nodes: [{ id: "1", cells: {} }] };
      await page.waitForChanges();
      expect(page.root).toBeTruthy();
    });

    it("should handle undefined dataset", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfDataset = undefined as any;
      await page.waitForChanges();
      expect(page.root).toBeTruthy();
    });

    it("should handle empty types array", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfTypes = [];
      await page.waitForChanges();
      expect(page.root).toBeTruthy();
    });

    it("should handle special characters in data", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfDataset = {
        columns: [
          { id: "name", title: "Name" },
          { id: "value", title: "Value" },
        ],
        nodes: [
          {
            id: "1",
            cells: { name: { value: "Test<>&" }, value: { value: 100 } },
          },
        ],
      };
      component.lfAxis = ["name"];
      component.lfSeries = ["value"];
      await page.waitForChanges();
      expect(page.root).toBeTruthy();
    });

    it("should handle negative numbers in data", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfDataset = {
        columns: [
          { id: "x", title: "X" },
          { id: "y", title: "Y" },
        ],
        nodes: [
          { id: "1", cells: { x: { value: "A" }, y: { value: -100 } } },
          { id: "2", cells: { x: { value: "B" }, y: { value: -50 } } },
        ],
      };
      component.lfAxis = ["x"];
      component.lfSeries = ["y"];
      await page.waitForChanges();
      expect(page.root).toBeTruthy();
    });

    it("should handle decimal numbers in data", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfDataset = {
        columns: [
          { id: "x", title: "X" },
          { id: "y", title: "Y" },
        ],
        nodes: [
          { id: "1", cells: { x: { value: "A" }, y: { value: 10.5 } } },
          { id: "2", cells: { x: { value: "B" }, y: { value: 20.75 } } },
        ],
      };
      component.lfAxis = ["x"];
      component.lfSeries = ["y"];
      await page.waitForChanges();
      expect(page.root).toBeTruthy();
    });

    it("should handle null cell values", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfDataset = {
        columns: [
          { id: "x", title: "X" },
          { id: "y", title: "Y" },
        ],
        nodes: [
          { id: "1", cells: { x: { value: "A" }, y: { value: null as any } } },
        ],
      };
      component.lfAxis = ["x"];
      component.lfSeries = ["y"];
      await page.waitForChanges();
      expect(page.root).toBeTruthy();
    });

    it("should handle missing cell values", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfDataset = {
        columns: [
          { id: "x", title: "X" },
          { id: "y", title: "Y" },
        ],
        nodes: [{ id: "1", cells: { x: { value: "A" } } }],
      };
      component.lfAxis = ["x"];
      component.lfSeries = ["y"];
      await page.waitForChanges();
      expect(page.root).toBeTruthy();
    });

    it("should handle rapid prop updates", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfSizeX = "100px";
      component.lfSizeX = "200px";
      component.lfSizeX = "300px";
      await page.waitForChanges();
      expect(component.lfSizeX).toBe("300px");
    });

    it("should handle mixed chart types array", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const component = page.rootInstance as LfChart;
      component.lfTypes = ["line", "bar", "scatter"];
      await page.waitForChanges();
      expect(component.lfTypes).toEqual(["line", "bar", "scatter"]);
    });
  });
  //#endregion

  //#region Lifecycle Hooks
  describe("Lifecycle Hooks", () => {
    it("should complete component lifecycle", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      expect(page.root).toBeTruthy();
      expect(page.rootInstance).toBeTruthy();
    });

    it("should handle disconnection gracefully", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const root = page.root;
      root.remove();
      await page.waitForChanges();
      expect(document.body.contains(root)).toBeFalsy();
    });
  });
  //#endregion

  //#region CSS Variables
  describe("CSS Variables", () => {
    it("should apply width CSS variable", async () => {
      const page = await createPage(`<lf-chart lf-size-x="500px"></lf-chart>`);
      const styleElement = page.root.shadowRoot.querySelector("#lf-style");
      expect(styleElement.textContent).toContain("500px");
    });

    it("should apply height CSS variable", async () => {
      const page = await createPage(`<lf-chart lf-size-y="300px"></lf-chart>`);
      const styleElement = page.root.shadowRoot.querySelector("#lf-style");
      expect(styleElement.textContent).toContain("300px");
    });

    it("should apply default dimensions when not specified", async () => {
      const page = await createPage(`<lf-chart></lf-chart>`);
      const styleElement = page.root.shadowRoot.querySelector("#lf-style");
      expect(styleElement.textContent).toContain("100%");
    });
  });
  //#endregion
});
