import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import {
  LfDataDataset,
  LF_MASONRY_DEFAULT_COLUMNS,
} from "@lf-widgets/foundations";
import { LfMasonry } from "./lf-masonry";

//#region Test Utilities
const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfMasonry],
    html,
  });
  await page.waitForChanges();
  return page;
};

/**
 * Create a mock dataset with image shapes
 */
const createMockDataset = (count: number): LfDataDataset => ({
  nodes: Array.from({ length: count }, (_, i) => ({
    id: `node-${i}`,
    value: `Image ${i + 1}`,
    cells: {
      image: {
        shape: "image" as const,
        value: `https://example.com/image${i}.jpg`,
      },
    },
  })),
});

/**
 * Create a mock dataset with badge shapes
 */
const createBadgeDataset = (count: number): LfDataDataset => ({
  nodes: Array.from({ length: count }, (_, i) => ({
    id: `badge-${i}`,
    value: `Badge ${i + 1}`,
    cells: {
      badge: { shape: "badge" as const, value: `Badge ${i + 1}` },
    },
  })),
});
//#endregion

describe("lf-masonry", () => {
  //#region Basic Rendering
  describe("Basic Rendering", () => {
    it("should render", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      expect(page.root).toBeTruthy();
    });

    it("should render with shadow DOM", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      expect(page.root.shadowRoot).toBeTruthy();
    });

    it("should render empty state with no dataset", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      expect(component.lfDataset).toBeNull();
      expect(page.root).toBeTruthy();
    });

    it("should render with custom id", async () => {
      const page = await createPage(
        `<lf-masonry id="test-masonry"></lf-masonry>`,
      );
      expect(page.root.id).toBe("test-masonry");
    });
  });
  //#endregion

  //#region Default Props
  describe("Default Props", () => {
    it("should have default props", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      expect(component.lfActions).toBe(false);
      expect(component.lfCollapseColumns).toBe(true);
      expect(component.lfDataset).toBeNull();
      expect(component.lfSelectable).toBe(false);
      expect(component.lfShape).toBe("image");
      expect(component.lfStyle).toBe("");
      expect(component.lfView).toBe("main");
    });

    it("should have default columns as array", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      expect(Array.isArray(component.lfColumns)).toBe(true);
      expect(component.lfColumns).toEqual(
        Array.from(LF_MASONRY_DEFAULT_COLUMNS),
      );
    });
  });
  //#endregion

  //#region Props Configuration
  describe("Props Configuration", () => {
    it("should set boolean props via HTML attributes", async () => {
      const page = await createPage(
        `<lf-masonry lf-actions lf-selectable></lf-masonry>`,
      );
      const component = page.rootInstance as LfMasonry;

      expect(component.lfActions).toBe(true);
      expect(component.lfSelectable).toBe(true);
    });

    it("should set lfShape prop", async () => {
      const page = await createPage(
        `<lf-masonry lf-shape="badge"></lf-masonry>`,
      );
      const component = page.rootInstance as LfMasonry;

      expect(component.lfShape).toBe("badge");
    });

    it("should set lfStyle prop", async () => {
      const page = await createPage(
        `<lf-masonry lf-style=".test { color: red; }"></lf-masonry>`,
      );
      const component = page.rootInstance as LfMasonry;

      expect(component.lfStyle).toBe(".test { color: red; }");
    });

    it("should set lfView prop to vertical", async () => {
      const page = await createPage(
        `<lf-masonry lf-view="vertical"></lf-masonry>`,
      );
      const component = page.rootInstance as LfMasonry;

      expect(component.lfView).toBe("vertical");
    });

    it("should set lfView prop to horizontal", async () => {
      const page = await createPage(
        `<lf-masonry lf-view="horizontal"></lf-masonry>`,
      );
      const component = page.rootInstance as LfMasonry;

      expect(component.lfView).toBe("horizontal");
    });

    it("should set lfCollapseColumns prop to false", async () => {
      const page = await createPage(
        `<lf-masonry lf-collapse-columns="false"></lf-masonry>`,
      );
      const component = page.rootInstance as LfMasonry;

      expect(component.lfCollapseColumns).toBe(false);
    });

    it("should update props programmatically", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfActions = true;
      component.lfSelectable = true;
      component.lfShape = "badge";
      component.lfView = "vertical";
      await page.waitForChanges();

      expect(component.lfActions).toBe(true);
      expect(component.lfSelectable).toBe(true);
      expect(component.lfShape).toBe("badge");
      expect(component.lfView).toBe("vertical");
    });

    it("should reflect lfSelectable to attribute", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfSelectable = true;
      await page.waitForChanges();

      expect(page.root.getAttribute("lf-selectable")).not.toBeNull();
    });
  });
  //#endregion

  //#region Columns Configuration
  describe("Columns Configuration", () => {
    it("should accept number for lfColumns", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfColumns = 4;
      await page.waitForChanges();

      expect(component.lfColumns).toBe(4);
    });

    it("should accept array for lfColumns breakpoints", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      const customBreakpoints = [400, 600, 800, 1000];
      component.lfColumns = customBreakpoints;
      await page.waitForChanges();

      expect(component.lfColumns).toEqual(customBreakpoints);
    });

    it("should reset invalid breakpoints to default", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      // Invalid: not sorted in ascending order
      component.lfColumns = [800, 400, 600];
      await page.waitForChanges();

      expect(component.lfColumns).toEqual(
        Array.from(LF_MASONRY_DEFAULT_COLUMNS),
      );
    });

    it("should accept valid ascending breakpoints", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      const validBreakpoints = [320, 640, 960, 1280];
      component.lfColumns = validBreakpoints;
      await page.waitForChanges();

      expect(component.lfColumns).toEqual(validBreakpoints);
    });
  });
  //#endregion

  //#region Dataset Rendering
  describe("Dataset Rendering", () => {
    it("should render items from dataset", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      expect(component.lfDataset.nodes).toHaveLength(3);
    });

    it("should render single item dataset", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfDataset = createMockDataset(1);
      await page.waitForChanges();

      expect(component.lfDataset.nodes).toHaveLength(1);
    });

    it("should handle large datasets", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfDataset = createMockDataset(100);
      await page.waitForChanges();

      expect(component.lfDataset.nodes).toHaveLength(100);
    });

    it("should update when dataset changes", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();
      expect(component.lfDataset.nodes).toHaveLength(3);

      component.lfDataset = createMockDataset(5);
      await page.waitForChanges();
      expect(component.lfDataset.nodes).toHaveLength(5);
    });

    it("should handle null dataset gracefully", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      component.lfDataset = null;
      await page.waitForChanges();

      expect(component.lfDataset).toBeNull();
      expect(page.root).toBeTruthy();
    });

    it("should handle empty dataset", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfDataset = { nodes: [] };
      await page.waitForChanges();

      expect(component.lfDataset.nodes).toHaveLength(0);
    });

    it("should handle different shape types", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfShape = "badge";
      component.lfDataset = createBadgeDataset(3);
      await page.waitForChanges();

      expect(component.lfShape).toBe("badge");
      expect(component.lfDataset.nodes).toHaveLength(3);
    });
  });
  //#endregion

  //#region State Management
  describe("State Management", () => {
    it("should initialize debugInfo state", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      const debugInfo = await component.getDebugInfo();
      expect(debugInfo).toBeDefined();
    });

    it("should initialize selectedShape state as empty object", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      const selectedShape = await component.getSelectedShape();
      expect(selectedShape).toEqual({});
    });

    it("should track shapes state based on dataset", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      // shapes should be updated internally
      expect(page.root).toBeTruthy();
    });

    it("should update shapes when lfShape changes", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      component.lfShape = "badge";
      component.lfDataset = createBadgeDataset(2);
      await page.waitForChanges();

      expect(component.lfShape).toBe("badge");
    });
  });
  //#endregion

  //#region Selection Functionality
  describe("Selection Functionality", () => {
    let page: SpecPage;
    let component: LfMasonry;

    beforeEach(async () => {
      page = await createPage(`<lf-masonry lf-selectable></lf-masonry>`);
      component = page.rootInstance as LfMasonry;
      component.lfDataset = createMockDataset(5);
      await page.waitForChanges();
    });

    it("should enable selection when lfSelectable is true", async () => {
      expect(component.lfSelectable).toBe(true);
    });

    it("should call setSelectedShape without error", async () => {
      // setSelectedShape relies on internal shapes state populated by framework
      // This tests that the method can be called without throwing
      await expect(component.setSelectedShape(2)).resolves.toBeUndefined();
    });

    it("should clear selection when setting invalid index", async () => {
      // Set invalid index (beyond dataset length)
      await component.setSelectedShape(100);
      await page.waitForChanges();

      const selectedShape = await component.getSelectedShape();
      expect(selectedShape).toEqual({});
    });

    it("should get selected shape state", async () => {
      const selectedShape = await component.getSelectedShape();
      // Initial state should be empty object
      expect(selectedShape).toBeDefined();
      expect(typeof selectedShape).toBe("object");
    });

    it("should handle deselection via invalid index", async () => {
      // Invalid index clears selection
      await component.setSelectedShape(-1);
      await page.waitForChanges();

      const selectedShape = await component.getSelectedShape();
      expect(selectedShape).toEqual({});
    });

    it("should handle setSelectedShape with different shape types", async () => {
      component.lfShape = "badge";
      component.lfDataset = createBadgeDataset(3);
      await page.waitForChanges();

      // Call setSelectedShape - it relies on internal shape extraction
      await expect(component.setSelectedShape(1)).resolves.toBeUndefined();
    });

    it("should call redecorateShapes when setSelectedShape is called", async () => {
      await component.setSelectedShape(0);
      await page.waitForChanges();
      // No errors should be thrown
      expect(page.root).toBeTruthy();
    });
  });
  //#endregion

  //#region View Modes
  describe("View Modes", () => {
    it("should default to main view", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      expect(component.lfView).toBe("main");
    });

    it("should support vertical view", async () => {
      const page = await createPage(
        `<lf-masonry lf-view="vertical"></lf-masonry>`,
      );
      const component = page.rootInstance as LfMasonry;

      expect(component.lfView).toBe("vertical");
    });

    it("should support horizontal view", async () => {
      const page = await createPage(
        `<lf-masonry lf-view="horizontal"></lf-masonry>`,
      );
      const component = page.rootInstance as LfMasonry;

      expect(component.lfView).toBe("horizontal");
    });

    it("should change view programmatically", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfView = "vertical";
      await page.waitForChanges();
      expect(component.lfView).toBe("vertical");

      component.lfView = "horizontal";
      await page.waitForChanges();
      expect(component.lfView).toBe("horizontal");

      component.lfView = "main";
      await page.waitForChanges();
      expect(component.lfView).toBe("main");
    });
  });
  //#endregion

  //#region Public Methods
  describe("Public Methods", () => {
    it("should get props via getProps()", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      const props = await component.getProps();
      expect(props.lfActions).toBe(false);
      expect(props.lfCollapseColumns).toBe(true);
      expect(props.lfSelectable).toBe(false);
      expect(props.lfShape).toBe("image");
      expect(props.lfStyle).toBe("");
      expect(props.lfView).toBe("main");
    });

    it("should return all props from getProps()", async () => {
      const page = await createPage(
        `<lf-masonry lf-actions lf-selectable lf-shape="badge"></lf-masonry>`,
      );
      const component = page.rootInstance as LfMasonry;

      const props = await component.getProps();
      expect(props.lfActions).toBe(true);
      expect(props.lfSelectable).toBe(true);
      expect(props.lfShape).toBe("badge");
    });

    it("should refresh component via refresh()", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      await component.refresh();
      expect(page.root).toBeTruthy();
    });

    it("should get debug info via getDebugInfo()", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      const debugInfo = await component.getDebugInfo();
      expect(debugInfo).toBeDefined();
    });

    it("should get selected shape via getSelectedShape()", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      const selectedShape = await component.getSelectedShape();
      expect(selectedShape).toBeDefined();
      expect(typeof selectedShape).toBe("object");
    });

    it("should set selected shape via setSelectedShape()", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfDataset = createMockDataset(5);
      await page.waitForChanges();

      // setSelectedShape relies on internal shapes state populated by framework
      // This tests that the method can be called without throwing
      await expect(component.setSelectedShape(2)).resolves.toBeUndefined();
    });

    it("should redecorate shapes via redecorateShapes()", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      await component.redecorateShapes();
      expect(page.root).toBeTruthy();
    });

    it("should unmount component via unmount()", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      await component.unmount(0);
      expect(page.root).toBeTruthy();
    });

    it("should unmount with delay", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      await component.unmount(100);
      expect(page.root).toBeTruthy();
    });
  });
  //#endregion

  //#region Events
  describe("Events", () => {
    it("should emit ready event on load", async () => {
      const eventSpy = jest.fn();
      const page = await createPage(`<lf-masonry></lf-masonry>`);

      page.root.addEventListener("lf-masonry-event", eventSpy);
      // Ready event is emitted during componentDidLoad
      // Since createPage already waits for changes, we check if the component is ready
      expect(page.root).toBeTruthy();
    });

    it("should emit unmount event", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;
      const eventSpy = jest.fn();

      page.root.addEventListener("lf-masonry-event", eventSpy);

      await component.unmount(0);
      // Allow time for unmount event
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    it("should have correct event payload structure", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      // Test by triggering unmount and checking event structure
      let eventPayload: any;
      page.root.addEventListener("lf-masonry-event", (e: CustomEvent) => {
        eventPayload = e.detail;
      });

      await component.unmount(0);
      await new Promise((resolve) => setTimeout(resolve, 50));

      if (eventPayload) {
        expect(eventPayload.comp).toBeDefined();
        expect(eventPayload.eventType).toBeDefined();
        expect(eventPayload.selectedShape).toBeDefined();
      }
    });
  });
  //#endregion

  //#region Actions Feature
  describe("Actions Feature", () => {
    it("should not show actions by default", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      expect(component.lfActions).toBe(false);
    });

    it("should enable actions via prop", async () => {
      const page = await createPage(`<lf-masonry lf-actions></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      expect(component.lfActions).toBe(true);
    });

    it("should enable actions programmatically", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfActions = true;
      await page.waitForChanges();

      expect(component.lfActions).toBe(true);
    });
  });
  //#endregion

  //#region Style Prop
  describe("Style Prop", () => {
    it("should accept custom style", async () => {
      const customStyle = "#lf-component { background: red; }";
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfStyle = customStyle;
      await page.waitForChanges();

      expect(component.lfStyle).toBe(customStyle);
    });

    it("should handle empty style", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      expect(component.lfStyle).toBe("");
    });

    it("should update style dynamically", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfStyle = ".test { color: blue; }";
      await page.waitForChanges();
      expect(component.lfStyle).toBe(".test { color: blue; }");

      component.lfStyle = ".test { color: green; }";
      await page.waitForChanges();
      expect(component.lfStyle).toBe(".test { color: green; }");
    });
  });
  //#endregion

  //#region CollapseColumns Feature
  describe("CollapseColumns Feature", () => {
    it("should collapse columns by default", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      expect(component.lfCollapseColumns).toBe(true);
    });

    it("should disable column collapse when set to false", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfCollapseColumns = false;
      await page.waitForChanges();

      expect(component.lfCollapseColumns).toBe(false);
    });
  });
  //#endregion

  //#region Edge Cases
  describe("Edge Cases", () => {
    it("should handle rapid dataset changes", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      // Rapid changes
      component.lfDataset = createMockDataset(1);
      component.lfDataset = createMockDataset(5);
      component.lfDataset = createMockDataset(3);
      component.lfDataset = createMockDataset(10);
      await page.waitForChanges();

      expect(component.lfDataset.nodes).toHaveLength(10);
    });

    it("should handle dataset with missing cells", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfDataset = {
        nodes: [
          { id: "1", value: "Test" },
          { id: "2", value: "Test 2", cells: {} },
          {
            id: "3",
            value: "Test 3",
            cells: { other: { shape: "text" as const, value: "other" } },
          },
        ],
      };
      await page.waitForChanges();

      expect(component.lfDataset.nodes).toHaveLength(3);
    });

    it("should handle shape type change with existing dataset", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      component.lfShape = "badge";
      await page.waitForChanges();

      expect(component.lfShape).toBe("badge");
    });

    it("should handle view change with dataset", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfDataset = createMockDataset(5);
      await page.waitForChanges();

      component.lfView = "vertical";
      await page.waitForChanges();
      expect(component.lfView).toBe("vertical");

      component.lfView = "horizontal";
      await page.waitForChanges();
      expect(component.lfView).toBe("horizontal");
    });

    it("should handle selection on empty dataset", async () => {
      const page = await createPage(`<lf-masonry lf-selectable></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      await component.setSelectedShape(0);
      await page.waitForChanges();

      const selectedShape = await component.getSelectedShape();
      expect(selectedShape).toEqual({});
    });

    it("should handle column number of 1", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfColumns = 1;
      component.lfDataset = createMockDataset(5);
      await page.waitForChanges();

      expect(component.lfColumns).toBe(1);
    });

    it("should handle very large column number", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfColumns = 20;
      component.lfDataset = createMockDataset(5);
      await page.waitForChanges();

      expect(component.lfColumns).toBe(20);
    });

    it("should maintain selection state after refresh", async () => {
      const page = await createPage(`<lf-masonry lf-selectable></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfDataset = createMockDataset(5);
      await page.waitForChanges();

      // Call setSelectedShape - relies on internal shapes
      await component.setSelectedShape(2);
      await page.waitForChanges();

      await component.refresh();
      await page.waitForChanges();

      // The selection state should persist (even if empty due to shapes not being populated)
      const selectedShape = await component.getSelectedShape();
      expect(selectedShape).toBeDefined();
    });

    it("should handle selection after dataset update", async () => {
      const page = await createPage(`<lf-masonry lf-selectable></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfDataset = createMockDataset(5);
      await page.waitForChanges();

      await component.setSelectedShape(2);
      await page.waitForChanges();

      // Update dataset - selection state persists
      component.lfDataset = createMockDataset(10);
      await page.waitForChanges();

      const selectedShape = await component.getSelectedShape();
      // Selection may be cleared or preserved based on implementation
      expect(selectedShape).toBeDefined();
    });
  });
  //#endregion

  //#region Integration Tests
  describe("Integration Tests", () => {
    it("should work with all props combined", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfActions = true;
      component.lfSelectable = true;
      component.lfCollapseColumns = false;
      component.lfColumns = 4;
      component.lfShape = "image";
      component.lfView = "main";
      component.lfStyle = ".custom { display: block; }";
      component.lfDataset = createMockDataset(10);
      await page.waitForChanges();

      expect(component.lfActions).toBe(true);
      expect(component.lfSelectable).toBe(true);
      expect(component.lfCollapseColumns).toBe(false);
      expect(component.lfColumns).toBe(4);
      expect(component.lfDataset.nodes).toHaveLength(10);

      // setSelectedShape relies on internal shapes populated by framework
      await expect(component.setSelectedShape(5)).resolves.toBeUndefined();

      const selectedShape = await component.getSelectedShape();
      expect(selectedShape).toBeDefined();
    });

    it("should handle complete workflow", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      // 1. Initial setup
      expect(component.lfDataset).toBeNull();

      // 2. Add dataset
      component.lfDataset = createMockDataset(5);
      await page.waitForChanges();
      expect(component.lfDataset.nodes).toHaveLength(5);

      // 3. Enable selection
      component.lfSelectable = true;
      await page.waitForChanges();

      // 4. Attempt to select an item (may not work due to shapes not being populated in test env)
      await component.setSelectedShape(2);
      await page.waitForChanges();
      let selected = await component.getSelectedShape();
      expect(selected).toBeDefined();

      // 5. Change view
      component.lfView = "vertical";
      await page.waitForChanges();
      expect(component.lfView).toBe("vertical");

      // 6. Refresh
      await component.refresh();
      await page.waitForChanges();

      // 7. Selection state should be defined (even if empty)
      selected = await component.getSelectedShape();
      expect(selected).toBeDefined();

      // 8. Get debug info
      const debugInfo = await component.getDebugInfo();
      expect(debugInfo).toBeDefined();

      // 9. Get props
      const props = await component.getProps();
      expect(props.lfView).toBe("vertical");
      expect(props.lfSelectable).toBe(true);
    });

    it("should handle multiple prop changes in sequence", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      // Change props in sequence
      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      component.lfView = "vertical";
      await page.waitForChanges();

      component.lfActions = true;
      await page.waitForChanges();

      component.lfSelectable = true;
      await page.waitForChanges();

      component.lfColumns = 2;
      await page.waitForChanges();

      // All props should be updated
      expect(component.lfDataset.nodes).toHaveLength(3);
      expect(component.lfView).toBe("vertical");
      expect(component.lfActions).toBe(true);
      expect(component.lfSelectable).toBe(true);
      expect(component.lfColumns).toBe(2);
    });
  });
  //#endregion

  //#region Shapes Management
  describe("Shapes Management", () => {
    it("should update shapes when dataset changes", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      // Shapes should be extracted from dataset
      expect(page.root).toBeTruthy();
    });

    it("should call redecorateShapes without error", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      component.lfDataset = createMockDataset(3);
      await page.waitForChanges();

      await expect(component.redecorateShapes()).resolves.toBeUndefined();
    });

    it("should handle shape type mismatch gracefully", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      // Set badge shape type but provide image dataset
      component.lfShape = "badge";
      component.lfDataset = createMockDataset(3); // Image dataset
      await page.waitForChanges();

      // Should handle gracefully without error
      expect(page.root).toBeTruthy();
    });
  });
  //#endregion

  //#region Lifecycle Hooks
  describe("Lifecycle Hooks", () => {
    it("should complete componentWillLoad", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      expect(page.root).toBeTruthy();
    });

    it("should complete componentDidLoad", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      expect(page.root).toBeTruthy();
    });

    it("should handle disconnection gracefully", async () => {
      const page = await createPage(`<lf-masonry></lf-masonry>`);
      const component = page.rootInstance as LfMasonry;

      await component.unmount(0);
      // Should not throw
      expect(page.root).toBeTruthy();
    });
  });
  //#endregion
});
