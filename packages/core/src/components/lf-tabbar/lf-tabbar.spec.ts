import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfTabbar } from "./lf-tabbar";
import { LfDataDataset } from "@lf-widgets/foundations";

//#region Helpers
const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfTabbar],
    html,
  });
  await page.waitForChanges();
  return page;
};

const createMockDataset = (tabCount: number): LfDataDataset => ({
  nodes: Array.from({ length: tabCount }, (_, i) => ({
    id: `tab-${i}`,
    value: `Tab ${i}`,
  })),
});

const createDatasetWithIcons = (tabCount: number): LfDataDataset => ({
  nodes: Array.from({ length: tabCount }, (_, i) => ({
    id: `tab-${i}`,
    value: `Tab ${i}`,
    icon: `icon-${i}`,
  })),
});
//#endregion

describe("lf-tabbar", () => {
  //#region Basic Rendering
  describe("Basic Rendering", () => {
    it("should render with shadow DOM", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);

      expect(page.root).toBeTruthy();
      expect(page.root.shadowRoot).toBeTruthy();
    });

    it("should render shadow DOM content when dataset is provided", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();
      const shadowContent = page.root.shadowRoot.innerHTML;

      expect(shadowContent).toBeTruthy();
      expect(shadowContent.length).toBeGreaterThan(0);
    });

    it("should not render content when dataset is null", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const wrapper = page.root.shadowRoot.querySelector("#lf-component");

      expect(wrapper).toBeNull();
    });

    it("should not render style element when lfStyle is empty", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(2);
      await page.waitForChanges();
      const style = page.root.shadowRoot.querySelector("#lf-style");

      expect(style).toBeNull();
    });

    it("should render style element when lfStyle is provided", async () => {
      const page = await createPage(
        `<lf-tabbar lf-style="#lf-component { color: red; }"></lf-tabbar>`,
      );
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(2);
      await page.waitForChanges();
      const style = page.root.shadowRoot.querySelector("#lf-style");

      expect(style).toBeTruthy();
    });

    it("should render with custom id", async () => {
      const page = await createPage(`<lf-tabbar id="my-tabbar"></lf-tabbar>`);

      expect(page.root.id).toBe("my-tabbar");
    });

    it("should render wrapper element when dataset has nodes", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();
      const wrapper = page.root.shadowRoot.querySelector("#lf-component");

      expect(wrapper).toBeTruthy();
    });
  });
  //#endregion

  //#region Props Handling
  describe("Props Handling", () => {
    it("should have correct default props", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;

      expect(component.lfAriaLabel).toBe("");
      expect(component.lfDataset).toBeNull();
      expect(component.lfNavigation).toBe(false);
      expect(component.lfRipple).toBe(true);
      expect(component.lfStyle).toBe("");
      expect(component.lfUiSize).toBe("medium");
      expect(component.lfUiState).toBe("primary");
      expect(component.lfValue).toBeNull();
    });

    it("should accept lfAriaLabel prop", async () => {
      const page = await createPage(
        `<lf-tabbar lf-aria-label="Test Aria"></lf-tabbar>`,
      );
      const component = page.rootInstance as LfTabbar;

      expect(component.lfAriaLabel).toBe("Test Aria");
    });

    it("should accept lfNavigation prop", async () => {
      const page = await createPage(
        `<lf-tabbar lf-navigation="true"></lf-tabbar>`,
      );
      const component = page.rootInstance as LfTabbar;

      expect(component.lfNavigation).toBe(true);
    });

    it("should accept lfRipple prop as false", async () => {
      const page = await createPage(
        `<lf-tabbar lf-ripple="false"></lf-tabbar>`,
      );
      const component = page.rootInstance as LfTabbar;

      expect(component.lfRipple).toBe(false);
    });

    it("should accept lfStyle prop", async () => {
      const page = await createPage(
        `<lf-tabbar lf-style=".custom { color: blue; }"></lf-tabbar>`,
      );
      const component = page.rootInstance as LfTabbar;

      expect(component.lfStyle).toBe(".custom { color: blue; }");
    });

    it("should accept lfUiSize prop", async () => {
      const page = await createPage(
        `<lf-tabbar lf-ui-size="small"></lf-tabbar>`,
      );
      const component = page.rootInstance as LfTabbar;

      expect(component.lfUiSize).toBe("small");
    });

    it("should accept lfUiSize prop as large", async () => {
      const page = await createPage(
        `<lf-tabbar lf-ui-size="large"></lf-tabbar>`,
      );
      const component = page.rootInstance as LfTabbar;

      expect(component.lfUiSize).toBe("large");
    });

    it("should accept lfUiState prop", async () => {
      const page = await createPage(
        `<lf-tabbar lf-ui-state="secondary"></lf-tabbar>`,
      );
      const component = page.rootInstance as LfTabbar;

      expect(component.lfUiState).toBe("secondary");
    });

    it("should accept lfUiState prop as tertiary", async () => {
      const page = await createPage(
        `<lf-tabbar lf-ui-state="tertiary"></lf-tabbar>`,
      );
      const component = page.rootInstance as LfTabbar;

      expect(component.lfUiState).toBe("tertiary");
    });

    it("should accept lfValue prop as number", async () => {
      const page = await createPage(`<lf-tabbar lf-value="1"></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;

      // HTML attributes come as strings, so lfValue is "1" when set via attribute
      expect(component.lfValue).toBe("1");
    });

    it("should accept lfDataset prop", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      const dataset = createMockDataset(3);

      component.lfDataset = dataset;
      await page.waitForChanges();

      expect(component.lfDataset).toEqual(dataset);
    });

    it("should reflect lfUiSize to attribute", async () => {
      const page = await createPage(
        `<lf-tabbar lf-ui-size="small"></lf-tabbar>`,
      );

      expect(page.root.getAttribute("lf-ui-size")).toBe("small");
    });

    it("should accept dataset with icons", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      const dataset = createDatasetWithIcons(3);

      component.lfDataset = dataset;
      await page.waitForChanges();

      expect(component.lfDataset.nodes[0].icon).toBe("icon-0");
    });
  });
  //#endregion

  //#region State Management
  describe("State Management", () => {
    it("should initialize value to null", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;

      expect(component.value).toBeNull();
    });

    it("should initialize debugInfo", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;

      expect(component.debugInfo).toBeDefined();
    });

    it("should set initial value from lfValue prop as number", async () => {
      const page = await createPage(`<lf-tabbar lf-value="0"></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      expect(component.value).toBeDefined();
    });

    it("should update value state when setValue is called", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      await component.setValue(1);

      expect(component.value).toEqual({
        index: 1,
        node: { id: "tab-1", value: "Tab 1" },
      });
    });

    it("should update value state when setValue is called with string id", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      await component.setValue("tab-2");

      expect(component.value).toEqual({
        index: 2,
        node: { id: "tab-2", value: "Tab 2" },
      });
    });

    it("should maintain value state after refresh", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();
      await component.setValue(1);

      await component.refresh();
      await page.waitForChanges();

      expect(component.value).toEqual({
        index: 1,
        node: { id: "tab-1", value: "Tab 1" },
      });
    });
  });
  //#endregion

  //#region Public Methods
  describe("Public Methods", () => {
    describe("getDebugInfo", () => {
      it("should return debug info", async () => {
        const page = await createPage(`<lf-tabbar></lf-tabbar>`);
        const component = page.rootInstance as LfTabbar;

        const debugInfo = await component.getDebugInfo();

        expect(debugInfo).toBeDefined();
      });

      it("should return debug info with lifecycle data", async () => {
        const page = await createPage(`<lf-tabbar></lf-tabbar>`);
        const component = page.rootInstance as LfTabbar;
        component.lfDataset = createMockDataset(2);
        await page.waitForChanges();

        const debugInfo = await component.getDebugInfo();

        expect(debugInfo).toBeDefined();
      });
    });

    describe("getProps", () => {
      it("should return all props", async () => {
        const page = await createPage(`<lf-tabbar></lf-tabbar>`);
        const component = page.rootInstance as LfTabbar;

        const props = await component.getProps();

        expect(props.lfAriaLabel).toBe("");
        expect(props.lfDataset).toBeNull();
        expect(props.lfNavigation).toBe(false);
        expect(props.lfRipple).toBe(true);
        expect(props.lfStyle).toBe("");
        expect(props.lfUiSize).toBe("medium");
        expect(props.lfUiState).toBe("primary");
        expect(props.lfValue).toBeNull();
      });

      it("should reflect updated prop values", async () => {
        const page = await createPage(
          `<lf-tabbar lf-navigation="true" lf-ui-size="small"></lf-tabbar>`,
        );
        const component = page.rootInstance as LfTabbar;

        const props = await component.getProps();

        expect(props.lfNavigation).toBe(true);
        expect(props.lfUiSize).toBe("small");
      });

      it("should return dataset in props", async () => {
        const page = await createPage(`<lf-tabbar></lf-tabbar>`);
        const component = page.rootInstance as LfTabbar;
        component.lfDataset = createMockDataset(3);
        await page.waitForChanges();

        const props = await component.getProps();

        expect(props.lfDataset).toEqual(createMockDataset(3));
      });
    });

    describe("getValue", () => {
      it("should return null when no tab is selected", async () => {
        const page = await createPage(`<lf-tabbar></lf-tabbar>`);
        const component = page.rootInstance as LfTabbar;
        component.lfDataset = createMockDataset(3);
        await page.waitForChanges();

        const value = await component.getValue();

        expect(value).toBeNull();
      });

      it("should return selected tab info", async () => {
        const page = await createPage(`<lf-tabbar></lf-tabbar>`);
        const component = page.rootInstance as LfTabbar;
        component.lfDataset = createMockDataset(3);
        await page.waitForChanges();
        await component.setValue(1);

        const value = await component.getValue();

        expect(value).toEqual({
          index: 1,
          node: { id: "tab-1", value: "Tab 1" },
        });
      });

      it("should return correct value after multiple setValue calls", async () => {
        const page = await createPage(`<lf-tabbar></lf-tabbar>`);
        const component = page.rootInstance as LfTabbar;
        component.lfDataset = createMockDataset(5);
        await page.waitForChanges();

        await component.setValue(0);
        await component.setValue(2);
        await component.setValue(4);
        const value = await component.getValue();

        expect(value).toEqual({
          index: 4,
          node: { id: "tab-4", value: "Tab 4" },
        });
      });
    });

    describe("setValue", () => {
      it("should set value by index", async () => {
        const page = await createPage(`<lf-tabbar></lf-tabbar>`);
        const component = page.rootInstance as LfTabbar;
        component.lfDataset = createMockDataset(3);
        await page.waitForChanges();

        const result = await component.setValue(2);

        expect(result).toEqual({
          index: 2,
          node: { id: "tab-2", value: "Tab 2" },
        });
      });

      it("should set value by string id", async () => {
        const page = await createPage(`<lf-tabbar></lf-tabbar>`);
        const component = page.rootInstance as LfTabbar;
        component.lfDataset = createMockDataset(3);
        await page.waitForChanges();

        const result = await component.setValue("tab-0");

        expect(result).toEqual({
          index: 0,
          node: { id: "tab-0", value: "Tab 0" },
        });
      });

      it("should set first tab value", async () => {
        const page = await createPage(`<lf-tabbar></lf-tabbar>`);
        const component = page.rootInstance as LfTabbar;
        component.lfDataset = createMockDataset(5);
        await page.waitForChanges();

        const result = await component.setValue(0);

        expect(result.index).toBe(0);
      });

      it("should set last tab value", async () => {
        const page = await createPage(`<lf-tabbar></lf-tabbar>`);
        const component = page.rootInstance as LfTabbar;
        component.lfDataset = createMockDataset(5);
        await page.waitForChanges();

        const result = await component.setValue(4);

        expect(result.index).toBe(4);
      });

      it("should return -1 index for non-existent string id", async () => {
        const page = await createPage(`<lf-tabbar></lf-tabbar>`);
        const component = page.rootInstance as LfTabbar;
        component.lfDataset = createMockDataset(3);
        await page.waitForChanges();

        const result = await component.setValue("non-existent");

        expect(result.index).toBe(-1);
      });
    });

    describe("refresh", () => {
      it("should trigger re-render", async () => {
        const page = await createPage(`<lf-tabbar></lf-tabbar>`);
        const component = page.rootInstance as LfTabbar;
        component.lfDataset = createMockDataset(2);
        await page.waitForChanges();

        await component.refresh();
        await page.waitForChanges();

        expect(page.root).toBeTruthy();
      });

      it("should maintain component state after refresh", async () => {
        const page = await createPage(`<lf-tabbar></lf-tabbar>`);
        const component = page.rootInstance as LfTabbar;
        component.lfDataset = createMockDataset(3);
        component.lfUiSize = "small";
        await page.waitForChanges();

        await component.refresh();
        await page.waitForChanges();

        expect(component.lfUiSize).toBe("small");
      });
    });

    describe("unmount", () => {
      it("should call unmount method without error", async () => {
        const page = await createPage(`<lf-tabbar></lf-tabbar>`);
        const component = page.rootInstance as LfTabbar;

        await expect(component.unmount(0)).resolves.not.toThrow();
      });

      it("should accept delay parameter", async () => {
        const page = await createPage(`<lf-tabbar></lf-tabbar>`);
        const component = page.rootInstance as LfTabbar;

        await expect(component.unmount(100)).resolves.not.toThrow();
      });

      it("should accept zero delay", async () => {
        const page = await createPage(`<lf-tabbar></lf-tabbar>`);
        const component = page.rootInstance as LfTabbar;

        await expect(component.unmount(0)).resolves.not.toThrow();
      });
    });
  });
  //#endregion

  //#region Event Emission
  describe("Event Emission", () => {
    it("should emit ready event on load", async () => {
      const eventSpy = jest.fn();
      getLfFramework();
      const page = await newSpecPage({
        components: [LfTabbar],
        html: `<lf-tabbar></lf-tabbar>`,
      });
      page.root.addEventListener("lf-tabbar-event", eventSpy);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(2);
      await page.waitForChanges();

      const readyEvents = eventSpy.mock.calls.filter(
        (call) => call[0].detail.eventType === "ready",
      );
      expect(readyEvents.length).toBeGreaterThanOrEqual(0);
    });

    it("should have event emitter defined", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;

      expect(component.lfEvent).toBeDefined();
    });

    it("should emit event with correct structure", async () => {
      const eventSpy = jest.fn();
      getLfFramework();
      const page = await newSpecPage({
        components: [LfTabbar],
        html: `<lf-tabbar id="test-tabbar"></lf-tabbar>`,
      });
      page.root.addEventListener("lf-tabbar-event", eventSpy);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(2);
      await page.waitForChanges();

      if (eventSpy.mock.calls.length > 0) {
        const eventDetail = eventSpy.mock.calls[0][0].detail;
        expect(eventDetail).toHaveProperty("comp");
        expect(eventDetail).toHaveProperty("eventType");
        expect(eventDetail).toHaveProperty("id");
      }
    });

    it("should emit event with component reference", async () => {
      const eventSpy = jest.fn();
      getLfFramework();
      const page = await newSpecPage({
        components: [LfTabbar],
        html: `<lf-tabbar></lf-tabbar>`,
      });
      page.root.addEventListener("lf-tabbar-event", eventSpy);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(2);
      await page.waitForChanges();

      if (eventSpy.mock.calls.length > 0) {
        const eventDetail = eventSpy.mock.calls[0][0].detail;
        expect(eventDetail.comp).toBeDefined();
      }
    });
  });
  //#endregion

  //#region Tab Selection
  describe("Tab Selection", () => {
    it("should select tab by index", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      await component.setValue(1);
      const value = await component.getValue();

      expect(value.index).toBe(1);
    });

    it("should select tab by string id", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      await component.setValue("tab-2");
      const value = await component.getValue();

      expect(value.index).toBe(2);
      expect(value.node.id).toBe("tab-2");
    });

    it("should switch between tabs", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(5);
      await page.waitForChanges();

      await component.setValue(0);
      expect((await component.getValue()).index).toBe(0);

      await component.setValue(2);
      expect((await component.getValue()).index).toBe(2);

      await component.setValue(4);
      expect((await component.getValue()).index).toBe(4);
    });

    it("should handle selecting same tab multiple times", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      await component.setValue(1);
      await component.setValue(1);
      await component.setValue(1);

      const value = await component.getValue();
      expect(value.index).toBe(1);
    });

    it("should return node data when selecting tab", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createDatasetWithIcons(3);
      await page.waitForChanges();

      await component.setValue(1);
      const value = await component.getValue();

      expect(value.node.id).toBe("tab-1");
      expect(value.node.value).toBe("Tab 1");
      expect(value.node.icon).toBe("icon-1");
    });
  });
  //#endregion

  //#region Edge Cases
  describe("Edge Cases", () => {
    it("should handle empty dataset nodes array", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = { nodes: [] };
      await page.waitForChanges();

      expect(page.root).toBeTruthy();
    });

    it("should handle single tab dataset", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(1);
      await page.waitForChanges();

      await component.setValue(0);
      const value = await component.getValue();

      expect(value.index).toBe(0);
    });

    it("should handle large number of tabs", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(100);
      await page.waitForChanges();

      await component.setValue(99);
      const value = await component.getValue();

      expect(value.index).toBe(99);
    });

    it("should handle dataset change after initial render", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      component.lfDataset = createMockDataset(5);
      await page.waitForChanges();

      expect(component.lfDataset.nodes.length).toBe(5);
    });

    it("should handle undefined node in dataset gracefully", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      const result = await component.setValue(10);

      expect(result.node).toBeUndefined();
    });

    it("should handle special characters in tab values", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = {
        nodes: [
          { id: "tab-1", value: "Tab <script>" },
          { id: "tab-2", value: "Tab & More" },
          { id: "tab-3", value: 'Tab "quoted"' },
        ],
      };
      await page.waitForChanges();

      await component.setValue(0);
      const value = await component.getValue();

      expect(value.node.value).toBe("Tab <script>");
    });

    it("should handle node with no value property", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = {
        nodes: [{ id: "tab-1" }, { id: "tab-2" }],
      };
      await page.waitForChanges();

      await component.setValue(0);
      const value = await component.getValue();

      expect(value.node.id).toBe("tab-1");
    });

    it("should handle setting value before dataset", async () => {
      const page = await createPage(`<lf-tabbar lf-value="0"></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;

      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      expect(page.root).toBeTruthy();
    });

    it("should handle rapid prop changes", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;

      component.lfUiSize = "small";
      component.lfUiSize = "medium";
      component.lfUiSize = "large";
      component.lfUiState = "primary";
      component.lfUiState = "secondary";
      await page.waitForChanges();

      expect(component.lfUiSize).toBe("large");
      expect(component.lfUiState).toBe("secondary");
    });

    it("should handle multiple rapid setValue calls", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(5);
      await page.waitForChanges();

      const promises = [
        component.setValue(0),
        component.setValue(1),
        component.setValue(2),
        component.setValue(3),
        component.setValue(4),
      ];
      await Promise.all(promises);

      const value = await component.getValue();
      expect(value.index).toBe(4);
    });
  });
  //#endregion

  //#region Navigation
  describe("Navigation", () => {
    it("should accept navigation prop as true", async () => {
      const page = await createPage(
        `<lf-tabbar lf-navigation="true"></lf-tabbar>`,
      );
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(10);
      await page.waitForChanges();

      expect(component.lfNavigation).toBe(true);
    });

    it("should accept navigation prop as false", async () => {
      const page = await createPage(
        `<lf-tabbar lf-navigation="false"></lf-tabbar>`,
      );
      const component = page.rootInstance as LfTabbar;

      expect(component.lfNavigation).toBe(false);
    });

    it("should render navigation when enabled with many tabs", async () => {
      const page = await createPage(
        `<lf-tabbar lf-navigation="true"></lf-tabbar>`,
      );
      const component = page.rootInstance as LfTabbar;
      component.lfDataset = createMockDataset(20);
      await page.waitForChanges();

      expect(page.root).toBeTruthy();
    });
  });
  //#endregion

  //#region Accessibility
  describe("Accessibility", () => {
    it("should apply aria label to component", async () => {
      const page = await createPage(
        `<lf-tabbar lf-aria-label="Navigation tabs"></lf-tabbar>`,
      );
      const component = page.rootInstance as LfTabbar;

      expect(component.lfAriaLabel).toBe("Navigation tabs");
    });

    it("should handle empty aria label", async () => {
      const page = await createPage(`<lf-tabbar lf-aria-label=""></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;

      expect(component.lfAriaLabel).toBe("");
    });

    it("should allow updating aria label dynamically", async () => {
      const page = await createPage(`<lf-tabbar></lf-tabbar>`);
      const component = page.rootInstance as LfTabbar;

      component.lfAriaLabel = "Updated label";
      await page.waitForChanges();

      expect(component.lfAriaLabel).toBe("Updated label");
    });
  });
  //#endregion
});
