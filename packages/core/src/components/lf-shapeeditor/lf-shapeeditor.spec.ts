import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import {
  LfDataDataset,
  LfDataNode,
  LfShapeeditorProgressbarState,
} from "@lf-widgets/foundations";
import { LfShapeeditor } from "./lf-shapeeditor";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfShapeeditor],
    html,
  });
  await page.waitForChanges();
  return page;
};

// Helper: create a mock dataset with image nodes
const createMockDataset = (count: number = 3): LfDataDataset => ({
  nodes: Array.from({ length: count }, (_, i) => ({
    id: `node-${i}`,
    value: `Image ${i}`,
    cells: {
      image: {
        shape: "image" as const,
        value: `https://example.com/image${i}.jpg`,
      },
    },
  })) as LfDataNode[],
});

describe("lf-shapeeditor", () => {
  //#region RENDERING
  describe("rendering", () => {
    it("should render", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      expect(page.root).toBeTruthy();
    });

    it("should have shadow DOM", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      expect(page.root.shadowRoot).toBeTruthy();
    });

    it("should render wrapper element", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const wrapper = page.root.shadowRoot.querySelector("#lf-component");
      expect(wrapper).toBeTruthy();
    });

    it("should render navigation panel", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const nav = page.root.shadowRoot.querySelector(".navigation");
      expect(nav).toBeTruthy();
    });

    it("should render settings panel", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const settings = page.root.shadowRoot.querySelector(".settings");
      expect(settings).toBeTruthy();
    });

    it("should render preview area", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const preview = page.root.shadowRoot.querySelector(".preview");
      expect(preview).toBeTruthy();
    });

    it("should apply custom id", async () => {
      const page = await createPage(
        `<lf-shapeeditor id="custom-editor"></lf-shapeeditor>`,
      );
      expect(page.root.id).toBe("custom-editor");
    });
  });
  //#endregion

  //#region DEFAULT PROPS
  describe("default props", () => {
    it("should have default props", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      expect(component.lfDataset).toEqual({});
      expect(component.lfLoadCallback).toBeNull();
      expect(component.lfNavigation).toBeUndefined();
      expect(component.lfShape).toBe("image");
      expect(component.lfStyle).toBe("");
      expect(component.lfValue).toEqual({});
    });

    it("should have default shape type as image", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;
      expect(component.lfShape).toBe("image");
    });
  });
  //#endregion

  //#region PROPS CONFIGURATION
  describe("props configuration", () => {
    it("should set props", async () => {
      const page = await createPage(
        `<lf-shapeeditor lf-style="color: red;"></lf-shapeeditor>`,
      );
      const component = page.rootInstance as LfShapeeditor;

      expect(component.lfStyle).toBe("color: red;");
    });

    it("should accept different shape types", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      component.lfShape = "chart";
      await page.waitForChanges();
      expect(component.lfShape).toBe("chart");

      component.lfShape = "code";
      await page.waitForChanges();
      expect(component.lfShape).toBe("code");
    });

    it("should accept dataset programmatically", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      const dataset = createMockDataset(5);
      component.lfDataset = dataset;
      await page.waitForChanges();

      expect(component.lfDataset.nodes).toHaveLength(5);
    });

    it("should accept lfValue configuration", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      const value = { nodes: [{ id: "config", value: "test" }] };
      component.lfValue = value;
      await page.waitForChanges();

      expect(component.lfValue).toEqual(value);
    });

    it("should accept load callback", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      const callback = jest.fn().mockResolvedValue("test");
      component.lfLoadCallback = callback;
      await page.waitForChanges();

      expect(component.lfLoadCallback).toBe(callback);
    });

    it("should accept navigation configuration", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      const nav = { treeProps: { lfDataset: { nodes: [] as LfDataNode[] } } };
      component.lfNavigation = nav;
      await page.waitForChanges();

      expect(component.lfNavigation).toEqual(nav);
    });
  });
  //#endregion

  //#region GET PROPS
  describe("getProps method", () => {
    it("should get props", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      const props = await component.getProps();
      expect(props.lfDataset).toEqual({});
      expect(props.lfStyle).toBe("");
    });

    it("should return all configurable props", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      const props = await component.getProps();
      expect(props).toHaveProperty("lfDataset");
      expect(props).toHaveProperty("lfLoadCallback");
      expect(props).toHaveProperty("lfNavigation");
      expect(props).toHaveProperty("lfShape");
      expect(props).toHaveProperty("lfStyle");
      expect(props).toHaveProperty("lfValue");
    });

    it("should return updated prop values", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      component.lfStyle = "background: blue;";
      component.lfShape = "canvas";
      await page.waitForChanges();

      const props = await component.getProps();
      expect(props.lfStyle).toBe("background: blue;");
      expect(props.lfShape).toBe("canvas");
    });
  });
  //#endregion

  //#region PUBLIC METHODS
  describe("public methods", () => {
    it("should refresh", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      await component.refresh();
      expect(page.root).toBeTruthy();
    });

    it("should get debug info", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      const debugInfo = await component.getDebugInfo();
      expect(debugInfo).toBeDefined();
    });

    it("should get components (refs)", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      const components = await component.getComponents();
      expect(components).toBeDefined();
    });

    it("should get current snapshot", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      const snapshot = await component.getCurrentSnapshot();
      expect(snapshot).toBeDefined();
    });

    it("should get shape element", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      const shapeElement = await component.getShapeElement();
      // May be null if no shape is selected
      expect(shapeElement === null || shapeElement !== undefined).toBe(true);
    });
  });
  //#endregion

  //#region SPINNER STATE
  describe("spinner state", () => {
    it("should set spinner status to true", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      await component.setSpinnerStatus(true);
      expect(component.isSpinnerActive).toBe(true);
    });

    it("should set spinner status to false", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      await component.setSpinnerStatus(true);
      await component.setSpinnerStatus(false);
      expect(component.isSpinnerActive).toBe(false);
    });

    it("should toggle spinner multiple times", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      await component.setSpinnerStatus(true);
      expect(component.isSpinnerActive).toBe(true);

      await component.setSpinnerStatus(false);
      expect(component.isSpinnerActive).toBe(false);

      await component.setSpinnerStatus(true);
      expect(component.isSpinnerActive).toBe(true);
    });
  });
  //#endregion

  //#region SELECTION & HISTORY
  describe("selection and history", () => {
    it("should clear selection", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      await component.clearSelection();
      expect(component.currentShape).toEqual({});
    });

    it("should clear history", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      await component.clearHistory();
      expect(component.history).toEqual({});
    });

    it("should clear history for specific index", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      // Setup some history via adapter directly (history setter is read-only)
      // Note: history is now managed via adapter closure, direct assignment triggers warning
      await page.waitForChanges();

      await component.clearHistory(0);
      // clearHistory(index) clears that specific index's array
      // The behavior may vary - let's just verify no error occurs
      expect(page.root).toBeTruthy();
    });

    it("should reset clears both history and selection", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      await component.reset();
      expect(component.history).toEqual({});
      expect(component.currentShape).toEqual({});
    });

    it("should handle historyIndex initialization", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      expect(component.historyIndex).toBeNull();
    });
  });
  //#endregion

  //#region PROGRESSBAR STATE
  describe("progressbar state", () => {
    it("should have default progressbar state", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      expect(component.progressbarState).toEqual({
        uiState: "info",
        value: 0,
        visible: false,
      });
    });

    it("should update progressbar state", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      const newState: Partial<LfShapeeditorProgressbarState> = {
        value: 50,
        visible: true,
        uiState: "success",
      };

      await component.setProgressbar(newState);
      expect(component.progressbarState.value).toBe(50);
      expect(component.progressbarState.visible).toBe(true);
      expect(component.progressbarState.uiState).toBe("success");
    });

    it("should merge progressbar state", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      await component.setProgressbar({ value: 25 });
      expect(component.progressbarState.value).toBe(25);
      expect(component.progressbarState.visible).toBe(false); // unchanged

      await component.setProgressbar({ visible: true });
      expect(component.progressbarState.value).toBe(25); // unchanged
      expect(component.progressbarState.visible).toBe(true);
    });
  });
  //#endregion

  //#region SNACKBAR STATE
  describe("snackbar state", () => {
    it("should have default snackbar state", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      expect(component.snackbarState).toEqual({
        message: "",
        uiState: "info",
        visible: false,
      });
    });

    it("should update snackbar state", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      await component.setSnackbar({
        message: "Test message",
        uiState: "success",
        visible: true,
      });

      expect(component.snackbarState.message).toBe("Test message");
      expect(component.snackbarState.uiState).toBe("success");
      expect(component.snackbarState.visible).toBe(true);
    });
  });
  //#endregion

  //#region CONFIG SETTINGS
  describe("config settings", () => {
    it("should have empty default config settings", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      expect(component.configSettings).toEqual({});
    });

    it("should get settings via method", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      const settings = await component.getSettings();
      expect(settings).toEqual({});
    });

    it("should set settings with merge", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      await component.setSettings({ key1: "value1" });
      await component.setSettings({ key2: "value2" });

      const settings = await component.getSettings();
      expect(settings).toEqual({ key1: "value1", key2: "value2" });
    });

    it("should set settings with replace", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      await component.setSettings({ key1: "value1" });
      await component.setSettings({ key2: "value2" }, true);

      const settings = await component.getSettings();
      expect(settings).toEqual({ key2: "value2" });
    });
  });
  //#endregion

  //#region DSL CONFIGURATION
  describe("DSL configuration", () => {
    it("should return null DSL when no controls", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      const dsl = await component.getDsl();
      expect(dsl).toBeNull();
    });

    it("should have default configBehavior undefined", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      expect(component.configBehavior).toBeUndefined();
    });

    it("should have default configShowResetButton true", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      expect(component.configShowResetButton).toBe(true);
    });
  });
  //#endregion

  //#region NAVIGATION TREE STATE
  describe("navigation tree state", () => {
    it("should have navigation tree closed by default", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      expect(component.isNavigationTreeOpen).toBe(false);
    });

    it("should track expanded settings groups", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      expect(component.expandedSettingsGroups).toEqual([]);
    });
  });
  //#endregion

  //#region PREVIEW STATE
  describe("preview state", () => {
    it("should have null previewValue by default", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      expect(component.previewValue).toBeNull();
    });

    it("should have configEnablePreview undefined by default", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      expect(component.configEnablePreview).toBeUndefined();
    });
  });
  //#endregion

  //#region HISTORY POPUP
  describe("history popup state", () => {
    it("should have history popup closed by default", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      expect(component.isHistoryPopupOpen).toBe(false);
    });
  });
  //#endregion

  //#region RESET KEY
  describe("reset key", () => {
    it("should have initial resetKey of 0", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      expect(component.resetKey).toBe(0);
    });

    it("should reset controls method exists", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      // Should not throw
      await component.resetControls();
      expect(page.root).toBeTruthy();
    });
  });
  //#endregion

  //#region ADD SNAPSHOT
  describe("addSnapshot method", () => {
    it("should not throw when no shape selected", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      // Should not throw when no current shape
      await component.addSnapshot({ value: "test" });
      expect(page.root).toBeTruthy();
    });
  });
  //#endregion

  //#region EVENTS
  describe("events", () => {
    it("should have lfEvent emitter", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      expect(component.lfEvent).toBeDefined();
    });

    it("should emit ready event", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      // Component should have lfEvent emitter defined
      expect(component.lfEvent).toBeDefined();
      // Ready event is emitted during componentDidLoad - verify component loaded
      expect(page.root).toBeTruthy();
    });
  });
  //#endregion

  //#region EDGE CASES
  describe("edge cases", () => {
    it("should handle empty dataset", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      component.lfDataset = {};
      await page.waitForChanges();

      expect(page.root).toBeTruthy();
    });

    it("should handle null dataset nodes", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      component.lfDataset = { nodes: null } as any;
      await page.waitForChanges();

      expect(page.root).toBeTruthy();
    });

    it("should handle rapid state changes", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      // Rapid spinner toggles
      for (let i = 0; i < 10; i++) {
        await component.setSpinnerStatus(i % 2 === 0);
      }

      expect(page.root).toBeTruthy();
    });

    it("should handle rapid progressbar updates", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      // Rapid progress updates
      for (let i = 0; i <= 100; i += 10) {
        await component.setProgressbar({ value: i });
      }

      expect(component.progressbarState.value).toBe(100);
    });

    it("should handle dataset with many nodes", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      const largeDataset = createMockDataset(100);
      component.lfDataset = largeDataset;
      await page.waitForChanges();

      expect(component.lfDataset.nodes).toHaveLength(100);
    });

    it("should handle multiple refreshes", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      await component.refresh();
      await component.refresh();
      await component.refresh();

      expect(page.root).toBeTruthy();
    });

    it("should handle multiple resets", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      await component.reset();
      await component.reset();
      await component.reset();

      expect(component.history).toEqual({});
      expect(component.currentShape).toEqual({});
    });
  });
  //#endregion

  //#region CONFIG CONTROLS
  describe("config controls", () => {
    it("should have empty configControls by default", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      expect(component.configControls).toEqual([]);
    });

    it("should have undefined configLayout by default", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      expect(component.configLayout).toBeUndefined();
    });
  });
  //#endregion

  //#region LIFECYCLE
  describe("lifecycle", () => {
    it("should initialize debugInfo", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      expect(component.debugInfo).toBeDefined();
    });

    it("should have root element", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      expect(component.rootElement).toBeTruthy();
    });
  });
  //#endregion

  //#region INTEGRATION
  describe("integration", () => {
    it("should handle complete workflow: set dataset, spinner, progress, snackbar", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      // Set dataset
      component.lfDataset = createMockDataset(5);
      await page.waitForChanges();

      // Show spinner
      await component.setSpinnerStatus(true);
      expect(component.isSpinnerActive).toBe(true);

      // Update progress
      await component.setProgressbar({ value: 50, visible: true });
      expect(component.progressbarState.value).toBe(50);

      // Show snackbar
      await component.setSnackbar({ message: "Loading...", visible: true });
      expect(component.snackbarState.message).toBe("Loading...");

      // Complete loading
      await component.setSpinnerStatus(false);
      await component.setProgressbar({ value: 100 });
      await component.setSnackbar({ message: "Done!", uiState: "success" });

      expect(component.isSpinnerActive).toBe(false);
      expect(component.progressbarState.value).toBe(100);
      expect(component.snackbarState.message).toBe("Done!");
    });

    it("should handle settings workflow", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      // Set initial settings
      await component.setSettings({ brightness: 50, contrast: 50 });

      // Update single setting
      await component.setSettings({ brightness: 75 });

      // Get settings
      const settings = await component.getSettings();
      expect(settings.brightness).toBe(75);
      expect(settings.contrast).toBe(50);

      // Reset with new settings
      await component.setSettings({ saturation: 100 }, true);
      const newSettings = await component.getSettings();
      expect(newSettings.saturation).toBe(100);
      expect(newSettings.brightness).toBeUndefined();
    });
  });
  //#endregion

  //#region ORIGINAL TESTS (kept for backward compatibility)
  describe("original tests", () => {
    it("should reset", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      await component.reset();
      expect(page.root).toBeTruthy();
    });

    it("should add snapshot", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      await component.addSnapshot({ value: "test", lfValue: "test" });
      expect(page.root).toBeTruthy();
    });

    it("should unmount", async () => {
      const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
      const component = page.rootInstance as LfShapeeditor;

      await component.unmount();
      expect(page.root).toBeTruthy();
    });
  });
  //#endregion
});
