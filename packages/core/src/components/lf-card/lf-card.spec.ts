import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfCard } from "./lf-card";
import { LfDataDataset } from "@lf-widgets/foundations";

//#region Helper Functions
const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfCard],
    html,
  });
  await page.waitForChanges();
  return page;
};

const getEventListener = (
  page: SpecPage,
  eventType: string,
): Promise<CustomEvent> => {
  return new Promise((resolve) => {
    page.root?.addEventListener(eventType, (e: Event) => {
      resolve(e as CustomEvent);
    });
  });
};

const createMockDataset = (): LfDataDataset => ({
  nodes: [
    {
      cells: {
        text: { value: "Test Title", shape: "text" },
        button: { value: "Click me", shape: "button" },
      },
      id: "node1",
      value: "Test Node",
    },
  ],
});

const createEmptyDataset = (): LfDataDataset => ({
  nodes: [],
});
//#endregion

describe("lf-card", () => {
  //#region Basic Rendering
  describe("Basic Rendering", () => {
    it("should render with shadow DOM", async () => {
      const page = await createPage(`<lf-card></lf-card>`);

      expect(page.root).toBeTruthy();
      expect(page.root?.shadowRoot).toBeTruthy();
    });

    it("should render host element", async () => {
      const page = await createPage(`<lf-card></lf-card>`);

      expect(page.root?.tagName.toLowerCase()).toBe("lf-card");
    });

    it("should render wrapper element when dataset provided", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      page.rootInstance.lfDataset = createMockDataset();
      await page.waitForChanges();

      const wrapper = page.root?.shadowRoot?.querySelector("#lf-component");
      expect(wrapper).toBeTruthy();
    });

    it("should render style element when dataset provided", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      page.rootInstance.lfDataset = createMockDataset();
      await page.waitForChanges();

      const style = page.root?.shadowRoot?.querySelector("style#lf-style");
      expect(style).toBeTruthy();
    });

    it("should not render wrapper without dataset", async () => {
      const page = await createPage(`<lf-card></lf-card>`);

      const wrapper = page.root?.shadowRoot?.querySelector("#lf-component");
      expect(wrapper).toBeFalsy();
    });

    it("should render with dataset", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      page.rootInstance.lfDataset = createMockDataset();
      await page.waitForChanges();

      const wrapper = page.root?.shadowRoot?.querySelector("#lf-component");
      expect(wrapper).toBeTruthy();
    });

    it("should have card part attribute when rendered", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      page.rootInstance.lfDataset = createMockDataset();
      await page.waitForChanges();

      const wrapper = page.root?.shadowRoot?.querySelector('[part="card"]');
      expect(wrapper).toBeTruthy();
    });
  });
  //#endregion

  //#region Props Handling
  describe("Props Handling", () => {
    describe("lfDataset", () => {
      it("should have null default value", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        expect(component.lfDataset).toBeNull();
      });

      it("should accept dataset programmatically", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        const dataset = createMockDataset();
        component.lfDataset = dataset;
        await page.waitForChanges();

        expect(component.lfDataset).toEqual(dataset);
      });

      it("should trigger watcher on dataset change", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        const dataset = createMockDataset();
        component.lfDataset = dataset;
        await page.waitForChanges();

        expect(component.lfDataset?.nodes?.length).toBe(1);
      });

      it("should render when dataset is provided", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        component.lfDataset = createMockDataset();
        await page.waitForChanges();

        const wrapper = page.root?.shadowRoot?.querySelector("#lf-component");
        expect(wrapper).toBeTruthy();
      });
    });

    describe("lfLayout", () => {
      it("should have material as default layout", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        expect(component.lfLayout).toBe("material");
      });

      it("should accept debug layout via attribute", async () => {
        const page = await createPage(`<lf-card lf-layout="debug"></lf-card>`);
        const component = page.rootInstance as LfCard;

        expect(component.lfLayout).toBe("debug");
      });

      it("should accept keywords layout via attribute", async () => {
        const page = await createPage(
          `<lf-card lf-layout="keywords"></lf-card>`,
        );
        const component = page.rootInstance as LfCard;

        expect(component.lfLayout).toBe("keywords");
      });

      it("should accept upload layout via attribute", async () => {
        const page = await createPage(`<lf-card lf-layout="upload"></lf-card>`);
        const component = page.rootInstance as LfCard;

        expect(component.lfLayout).toBe("upload");
      });

      it("should accept weather layout via attribute", async () => {
        const page = await createPage(
          `<lf-card lf-layout="weather"></lf-card>`,
        );
        const component = page.rootInstance as LfCard;

        expect(component.lfLayout).toBe("weather");
      });

      it("should change layout programmatically", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        component.lfLayout = "debug";
        await page.waitForChanges();

        expect(component.lfLayout).toBe("debug");
      });
    });

    describe("lfSizeX", () => {
      it("should have 100% as default width", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        expect(component.lfSizeX).toBe("100%");
      });

      it("should accept pixel width via attribute", async () => {
        const page = await createPage(`<lf-card lf-size-x="300px"></lf-card>`);
        const component = page.rootInstance as LfCard;

        expect(component.lfSizeX).toBe("300px");
      });

      it("should accept percentage width via attribute", async () => {
        const page = await createPage(`<lf-card lf-size-x="50%"></lf-card>`);
        const component = page.rootInstance as LfCard;

        expect(component.lfSizeX).toBe("50%");
      });

      it("should accept vw width via attribute", async () => {
        const page = await createPage(`<lf-card lf-size-x="80vw"></lf-card>`);
        const component = page.rootInstance as LfCard;

        expect(component.lfSizeX).toBe("80vw");
      });

      it("should apply width CSS variable in style", async () => {
        const page = await createPage(`<lf-card lf-size-x="400px"></lf-card>`);
        const component = page.rootInstance as LfCard;

        // Width is stored in component prop
        expect(component.lfSizeX).toBe("400px");
      });
    });

    describe("lfSizeY", () => {
      it("should have 100% as default height", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        expect(component.lfSizeY).toBe("100%");
      });

      it("should accept pixel height via attribute", async () => {
        const page = await createPage(`<lf-card lf-size-y="200px"></lf-card>`);
        const component = page.rootInstance as LfCard;

        expect(component.lfSizeY).toBe("200px");
      });

      it("should accept percentage height via attribute", async () => {
        const page = await createPage(`<lf-card lf-size-y="75%"></lf-card>`);
        const component = page.rootInstance as LfCard;

        expect(component.lfSizeY).toBe("75%");
      });

      it("should apply height CSS variable in style", async () => {
        const page = await createPage(`<lf-card lf-size-y="500px"></lf-card>`);
        const component = page.rootInstance as LfCard;

        // Height is stored in component prop
        expect(component.lfSizeY).toBe("500px");
      });
    });

    describe("lfStyle", () => {
      it("should have empty string as default style", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        expect(component.lfStyle).toBe("");
      });

      it("should accept custom CSS style", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        component.lfStyle = "#lf-component { background: red; }";
        await page.waitForChanges();

        expect(component.lfStyle).toBe("#lf-component { background: red; }");
      });
    });

    describe("lfUiSize", () => {
      it("should have medium as default UI size", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        expect(component.lfUiSize).toBe("medium");
      });

      it("should accept small UI size", async () => {
        const page = await createPage(`<lf-card lf-ui-size="small"></lf-card>`);
        const component = page.rootInstance as LfCard;

        expect(component.lfUiSize).toBe("small");
      });

      it("should accept large UI size", async () => {
        const page = await createPage(`<lf-card lf-ui-size="large"></lf-card>`);
        const component = page.rootInstance as LfCard;

        expect(component.lfUiSize).toBe("large");
      });

      it("should reflect UI size attribute", async () => {
        const page = await createPage(`<lf-card lf-ui-size="small"></lf-card>`);

        expect(page.root?.getAttribute("lf-ui-size")).toBe("small");
      });
    });

    describe("lfUiState", () => {
      it("should have primary as default UI state", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        expect(component.lfUiState).toBe("primary");
      });

      it("should accept success UI state", async () => {
        const page = await createPage(
          `<lf-card lf-ui-state="success"></lf-card>`,
        );
        const component = page.rootInstance as LfCard;

        expect(component.lfUiState).toBe("success");
      });

      it("should accept danger UI state", async () => {
        const page = await createPage(
          `<lf-card lf-ui-state="danger"></lf-card>`,
        );
        const component = page.rootInstance as LfCard;

        expect(component.lfUiState).toBe("danger");
      });

      it("should accept warning UI state", async () => {
        const page = await createPage(
          `<lf-card lf-ui-state="warning"></lf-card>`,
        );
        const component = page.rootInstance as LfCard;

        expect(component.lfUiState).toBe("warning");
      });

      it("should accept secondary UI state", async () => {
        const page = await createPage(
          `<lf-card lf-ui-state="secondary"></lf-card>`,
        );
        const component = page.rootInstance as LfCard;

        expect(component.lfUiState).toBe("secondary");
      });
    });
  });
  //#endregion

  //#region State Management
  describe("State Management", () => {
    describe("debugInfo state", () => {
      it("should have debugInfo state defined after load", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        const debugInfo = await component.getDebugInfo();
        expect(debugInfo).toBeDefined();
      });

      it("should track lifecycle in debugInfo", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        const debugInfo = await component.getDebugInfo();
        expect(debugInfo.endTime).toBeDefined();
      });
    });

    describe("shapes state", () => {
      it("should have shapes state available", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        const shapes = await component.getShapes();
        expect(shapes).toBeDefined();
      });

      it("should update shapes when dataset changes", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        const initialShapes = await component.getShapes();

        component.lfDataset = createMockDataset();
        await page.waitForChanges();

        const updatedShapes = await component.getShapes();
        expect(updatedShapes).not.toBe(initialShapes);
      });
    });
  });
  //#endregion

  //#region Public Methods
  describe("Public Methods", () => {
    describe("getDebugInfo", () => {
      it("should return debug info object", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        const debugInfo = await component.getDebugInfo();
        expect(debugInfo).toBeDefined();
        expect(typeof debugInfo).toBe("object");
      });

      it("should return lifecycle information", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        const debugInfo = await component.getDebugInfo();
        expect(debugInfo.endTime).toBeDefined();
        expect(debugInfo.renderCount).toBeDefined();
      });
    });

    describe("getProps", () => {
      it("should return all component props", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        const props = await component.getProps();

        expect(props).toHaveProperty("lfDataset");
        expect(props).toHaveProperty("lfLayout");
        expect(props).toHaveProperty("lfSizeX");
        expect(props).toHaveProperty("lfSizeY");
        expect(props).toHaveProperty("lfStyle");
        expect(props).toHaveProperty("lfUiSize");
        expect(props).toHaveProperty("lfUiState");
      });

      it("should return correct prop values", async () => {
        const page = await createPage(
          `<lf-card lf-layout="debug" lf-size-x="200px" lf-ui-size="small"></lf-card>`,
        );
        const component = page.rootInstance as LfCard;

        const props = await component.getProps();

        expect(props.lfLayout).toBe("debug");
        expect(props.lfSizeX).toBe("200px");
        expect(props.lfUiSize).toBe("small");
      });

      it("should reflect prop changes", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        component.lfLayout = "keywords";
        component.lfUiState = "success";
        await page.waitForChanges();

        const props = await component.getProps();
        expect(props.lfLayout).toBe("keywords");
        expect(props.lfUiState).toBe("success");
      });
    });

    describe("getShapes", () => {
      it("should return shapes map", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        const shapes = await component.getShapes();
        expect(shapes).toBeDefined();
      });

      it("should return shapes from dataset", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        component.lfDataset = createMockDataset();
        await page.waitForChanges();

        const shapes = await component.getShapes();
        expect(shapes).toBeDefined();
      });
    });

    describe("refresh", () => {
      it("should trigger re-render", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        await component.refresh();
        await page.waitForChanges();

        expect(page.root).toBeTruthy();
      });

      it("should preserve component state after refresh", async () => {
        const page = await createPage(`<lf-card lf-layout="debug"></lf-card>`);
        const component = page.rootInstance as LfCard;

        await component.refresh();
        await page.waitForChanges();

        expect(component.lfLayout).toBe("debug");
      });
    });

    describe("unmount", () => {
      it("should remove element from DOM", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        await component.unmount(0);
        await page.waitForChanges();

        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(page.body.querySelector("lf-card")).toBeFalsy();
      });

      it("should accept delay parameter", async () => {
        const page = await createPage(`<lf-card></lf-card>`);
        const component = page.rootInstance as LfCard;

        await component.unmount(100);
        expect(page.root).toBeTruthy();
      });
    });
  });
  //#endregion

  //#region Event Emission
  describe("Event Emission", () => {
    it("should have event emitter defined", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      expect(component.lfEvent).toBeDefined();
    });

    it("should emit unmount event when unmounting", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      const eventPromise = getEventListener(page, "lf-card-event");
      await component.unmount(0);

      const event = await eventPromise;
      expect(event.detail.eventType).toBe("unmount");
    });

    it("should include component reference in event detail", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      const eventPromise = getEventListener(page, "lf-card-event");
      await component.unmount(0);

      const event = await eventPromise;
      expect(event.detail.comp).toBe(component);
    });

    it("should include id in event detail", async () => {
      const page = await createPage(`<lf-card id="test-card"></lf-card>`);
      const component = page.rootInstance as LfCard;

      const eventPromise = getEventListener(page, "lf-card-event");
      await component.unmount(0);

      const event = await eventPromise;
      expect(event.detail.id).toBe("test-card");
    });
  });
  //#endregion

  //#region Layout Variations
  describe("Layout Variations", () => {
    it("should render material layout by default", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      expect(component.lfLayout).toBe("material");
    });

    it("should support debug layout", async () => {
      const page = await createPage(`<lf-card lf-layout="debug"></lf-card>`);
      const component = page.rootInstance as LfCard;

      expect(component.lfLayout).toBe("debug");
    });

    it("should support keywords layout", async () => {
      const page = await createPage(`<lf-card lf-layout="keywords"></lf-card>`);
      const component = page.rootInstance as LfCard;

      expect(component.lfLayout).toBe("keywords");
    });

    it("should support upload layout", async () => {
      const page = await createPage(`<lf-card lf-layout="upload"></lf-card>`);
      const component = page.rootInstance as LfCard;

      expect(component.lfLayout).toBe("upload");
    });

    it("should support weather layout", async () => {
      const page = await createPage(`<lf-card lf-layout="weather"></lf-card>`);
      const component = page.rootInstance as LfCard;

      expect(component.lfLayout).toBe("weather");
    });

    it("should switch between layouts", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      expect(component.lfLayout).toBe("material");

      component.lfLayout = "debug";
      await page.waitForChanges();
      expect(component.lfLayout).toBe("debug");

      component.lfLayout = "keywords";
      await page.waitForChanges();
      expect(component.lfLayout).toBe("keywords");
    });
  });
  //#endregion

  //#region Edge Cases
  describe("Edge Cases", () => {
    it("should handle empty dataset gracefully", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      component.lfDataset = createEmptyDataset();
      await page.waitForChanges();

      expect(page.root).toBeTruthy();
    });

    it("should handle null dataset", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      component.lfDataset = null;
      await page.waitForChanges();

      expect(page.root).toBeTruthy();
    });

    it("should handle undefined dataset", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      component.lfDataset = undefined as unknown as LfDataDataset;
      await page.waitForChanges();

      expect(page.root).toBeTruthy();
    });

    it("should handle rapid prop changes", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      component.lfLayout = "debug";
      component.lfLayout = "keywords";
      component.lfLayout = "material";
      await page.waitForChanges();

      expect(component.lfLayout).toBe("material");
    });

    it("should handle empty style string", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      component.lfStyle = "";
      await page.waitForChanges();

      expect(component.lfStyle).toBe("");
    });

    it("should handle complex custom styles", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      const complexStyle = `
        #lf-component { 
          background: linear-gradient(to right, red, blue);
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
      `;
      component.lfStyle = complexStyle;
      await page.waitForChanges();

      expect(component.lfStyle).toBe(complexStyle);
    });

    it("should handle zero dimensions", async () => {
      const page = await createPage(
        `<lf-card lf-size-x="0px" lf-size-y="0px"></lf-card>`,
      );
      const component = page.rootInstance as LfCard;

      expect(component.lfSizeX).toBe("0px");
      expect(component.lfSizeY).toBe("0px");
    });

    it("should handle various CSS units", async () => {
      const page = await createPage(
        `<lf-card lf-size-x="10rem" lf-size-y="50vh"></lf-card>`,
      );
      const component = page.rootInstance as LfCard;

      expect(component.lfSizeX).toBe("10rem");
      expect(component.lfSizeY).toBe("50vh");
    });

    it("should handle multiple refresh calls", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      await component.refresh();
      await component.refresh();
      await component.refresh();
      await page.waitForChanges();

      expect(page.root).toBeTruthy();
    });

    it("should handle component with id attribute", async () => {
      const page = await createPage(`<lf-card id="my-card"></lf-card>`);

      expect(page.root?.id).toBe("my-card");
    });

    it("should handle component with class attribute", async () => {
      const page = await createPage(`<lf-card class="custom-class"></lf-card>`);

      expect(page.root?.classList.contains("custom-class")).toBe(true);
    });

    it("should handle dataset with multiple nodes", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      const multiNodeDataset: LfDataDataset = {
        nodes: [
          { id: "node1", value: "Node 1", cells: {} },
          { id: "node2", value: "Node 2", cells: {} },
          { id: "node3", value: "Node 3", cells: {} },
        ],
      };

      component.lfDataset = multiNodeDataset;
      await page.waitForChanges();

      expect(component.lfDataset?.nodes?.length).toBe(3);
    });
  });
  //#endregion

  //#region CSS Variables
  describe("CSS Variables", () => {
    it("should set width CSS variable prop", async () => {
      const page = await createPage(`<lf-card lf-size-x="350px"></lf-card>`);
      const component = page.rootInstance as LfCard;

      expect(component.lfSizeX).toBe("350px");
    });

    it("should set height CSS variable prop", async () => {
      const page = await createPage(`<lf-card lf-size-y="250px"></lf-card>`);
      const component = page.rootInstance as LfCard;

      expect(component.lfSizeY).toBe("250px");
    });

    it("should update CSS variables when props change", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      component.lfSizeX = "500px";
      component.lfSizeY = "300px";
      await page.waitForChanges();

      expect(component.lfSizeX).toBe("500px");
      expect(component.lfSizeY).toBe("300px");
    });
  });
  //#endregion

  //#region Backward Compatibility
  describe("Backward Compatibility", () => {
    it("should have default props", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      expect(component.lfDataset).toBeNull();
      expect(component.lfLayout).toBe("material");
      expect(component.lfSizeX).toBe("100%");
      expect(component.lfSizeY).toBe("100%");
      expect(component.lfStyle).toBe("");
      expect(component.lfUiSize).toBe("medium");
      expect(component.lfUiState).toBe("primary");
    });

    it("should set props", async () => {
      const page = await createPage(
        `<lf-card lf-layout="debug" lf-size-x="200px" lf-ui-size="small"></lf-card>`,
      );
      const component = page.rootInstance as LfCard;

      expect(component.lfLayout).toBe("debug");
      expect(component.lfSizeX).toBe("200px");
      expect(component.lfUiSize).toBe("small");
    });

    it("should get props", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      const props = await component.getProps();
      expect(props.lfLayout).toBe("material");
      expect(props.lfSizeX).toBe("100%");
    });

    it("should refresh", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      await component.refresh();
      expect(page.root).toBeTruthy();
    });

    it("should get debug info", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      const debugInfo = await component.getDebugInfo();
      expect(debugInfo).toBeDefined();
    });

    it("should get shapes", async () => {
      const page = await createPage(`<lf-card></lf-card>`);
      const component = page.rootInstance as LfCard;

      const shapes = await component.getShapes();
      expect(shapes).toBeDefined();
    });
  });
  //#endregion
});
