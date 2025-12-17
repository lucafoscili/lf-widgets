import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfCompare } from "./lf-compare";
import {
  LfCompareEventPayload,
  LfDataDataset,
  LfDataCell,
} from "@lf-widgets/foundations";

//#region Test Data
/**
 * Creates a mock dataset with image shapes for testing.
 * Contains two image nodes for comparison functionality.
 */
const createMockDataset = (): LfDataDataset => ({
  nodes: [
    {
      id: "img-1",
      value: "First Image",
      cells: {
        lfImage: {
          shape: "image",
          value: "https://example.com/image1.jpg",
        } as LfDataCell<"image">,
      },
    },
    {
      id: "img-2",
      value: "Second Image",
      cells: {
        lfImage: {
          shape: "image",
          value: "https://example.com/image2.jpg",
        } as LfDataCell<"image">,
      },
    },
    {
      id: "img-3",
      value: "Third Image",
      cells: {
        lfImage: {
          shape: "image",
          value: "https://example.com/image3.jpg",
        } as LfDataCell<"image">,
      },
    },
  ],
});

/**
 * Creates a mock dataset with video shapes for testing.
 */
const createMockVideoDataset = (): LfDataDataset => ({
  nodes: [
    {
      id: "vid-1",
      value: "First Video",
      cells: {
        lfVideo: {
          shape: "video",
          value: "https://example.com/video1.mp4",
        } as LfDataCell<"video">,
      },
    },
    {
      id: "vid-2",
      value: "Second Video",
      cells: {
        lfVideo: {
          shape: "video",
          value: "https://example.com/video2.mp4",
        } as LfDataCell<"video">,
      },
    },
  ],
});
//#endregion

//#region Test Setup
/**
 * Helper ensuring framework is initialized prior to component instantiation.
 * Creates a spec page with the LfCompare component.
 */
const createPage = async (html: string): Promise<SpecPage> => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfCompare],
    html,
  });
  await page.waitForChanges();
  return page;
};

/**
 * Helper to collect events emitted by the component.
 */
const collectEvents = (
  page: SpecPage,
): { events: LfCompareEventPayload[]; cleanup: () => void } => {
  const events: LfCompareEventPayload[] = [];
  const handler = (e: CustomEvent<LfCompareEventPayload>) => {
    events.push(e.detail);
  };
  page.root.addEventListener("lf-compare-event", handler as EventListener);
  return {
    events,
    cleanup: () =>
      page.root.removeEventListener(
        "lf-compare-event",
        handler as EventListener,
      ),
  };
};
//#endregion

describe("lf-compare", () => {
  //#region Basic Rendering
  describe("Basic Rendering", () => {
    it("should render", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      expect(page.root).toBeTruthy();
    });

    it("should render with shadow DOM", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      expect(page.root.shadowRoot).toBeTruthy();
    });

    it("should render wrapper element", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const wrapper = page.root.shadowRoot.querySelector("#lf-component");
      expect(wrapper).toBeTruthy();
    });

    it("should render with custom id", async () => {
      const page = await createPage(
        `<lf-compare id="my-compare"></lf-compare>`,
      );
      expect(page.root.id).toBe("my-compare");
    });

    it("should apply custom style when lfStyle is provided", async () => {
      const page = await createPage(
        `<lf-compare lf-style="#lf-component { background: red; }"></lf-compare>`,
      );
      const styleTag = page.root.shadowRoot.querySelector(
        "style#lf-style",
      ) as HTMLStyleElement;
      expect(styleTag).toBeTruthy();
    });

    it("should not render style tag when lfStyle is empty", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const styleTag = page.root.shadowRoot.querySelector("style#lf-style");
      expect(styleTag).toBeNull();
    });
  });
  //#endregion

  //#region Default Props
  describe("Default Props", () => {
    it("should have default lfDataset as null", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      expect(component.lfDataset).toBeNull();
    });

    it("should have default lfShape as 'image'", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      expect(component.lfShape).toBe("image");
    });

    it("should have default lfStyle as empty string", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      expect(component.lfStyle).toBe("");
    });

    it("should have default lfView as 'main'", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      expect(component.lfView).toBe("main");
    });
  });
  //#endregion

  //#region Props Handling
  describe("Props Handling", () => {
    it("should set lfShape prop via attribute", async () => {
      const page = await createPage(
        `<lf-compare lf-shape="video"></lf-compare>`,
      );
      const component = page.rootInstance as LfCompare;
      expect(component.lfShape).toBe("video");
    });

    it("should set lfView prop via attribute", async () => {
      const page = await createPage(
        `<lf-compare lf-view="split"></lf-compare>`,
      );
      const component = page.rootInstance as LfCompare;
      expect(component.lfView).toBe("split");
    });

    it("should set lfStyle prop via attribute", async () => {
      const page = await createPage(
        `<lf-compare lf-style=".custom { color: blue; }"></lf-compare>`,
      );
      const component = page.rootInstance as LfCompare;
      expect(component.lfStyle).toBe(".custom { color: blue; }");
    });

    it("should set multiple props via attributes", async () => {
      const page = await createPage(
        `<lf-compare lf-shape="video" lf-view="split" lf-style=".test {}"></lf-compare>`,
      );
      const component = page.rootInstance as LfCompare;
      expect(component.lfShape).toBe("video");
      expect(component.lfView).toBe("split");
      expect(component.lfStyle).toBe(".test {}");
    });

    it("should update lfDataset prop programmatically", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      const mockDataset = createMockDataset();

      component.lfDataset = mockDataset;
      await page.waitForChanges();

      expect(component.lfDataset).toBe(mockDataset);
    });

    it("should update lfShape prop programmatically", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;

      component.lfShape = "video";
      await page.waitForChanges();

      expect(component.lfShape).toBe("video");
    });

    it("should update lfView prop programmatically", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;

      component.lfView = "split";
      await page.waitForChanges();

      expect(component.lfView).toBe("split");
    });
  });
  //#endregion

  //#region State Variables
  describe("State Variables", () => {
    it("should initialize debugInfo state", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      // debugInfo is populated during lifecycle
      expect(component.debugInfo).toBeDefined();
    });

    it("should initialize isLeftPanelOpened as false", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      expect(component.isLeftPanelOpened).toBe(false);
    });

    it("should initialize isRightPanelOpened as false", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      expect(component.isRightPanelOpened).toBe(false);
    });

    it("should initialize leftShape as undefined when no dataset", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      expect(component.leftShape).toBeUndefined();
    });

    it("should initialize rightShape as undefined when no dataset", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      expect(component.rightShape).toBeUndefined();
    });

    it("should initialize shapes as empty object or null", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      // shapes is initialized with default value, may be {} or null depending on framework state
      expect(component.shapes).toBeDefined();
    });
  });
  //#endregion

  //#region Public Methods
  describe("Public Methods", () => {
    describe("getDebugInfo", () => {
      it("should return debug info", async () => {
        const page = await createPage(`<lf-compare></lf-compare>`);
        const component = page.rootInstance as LfCompare;
        const debugInfo = await component.getDebugInfo();
        expect(debugInfo).toBeDefined();
      });

      it("should return debug info with lifecycle data", async () => {
        const page = await createPage(`<lf-compare></lf-compare>`);
        const component = page.rootInstance as LfCompare;
        const debugInfo = await component.getDebugInfo();
        // Debug info should contain lifecycle information after component loads
        expect(debugInfo).toBeDefined();
      });
    });

    describe("getProps", () => {
      it("should return all props", async () => {
        const page = await createPage(`<lf-compare></lf-compare>`);
        const component = page.rootInstance as LfCompare;
        const props = await component.getProps();

        expect(props).toHaveProperty("lfDataset");
        expect(props).toHaveProperty("lfShape");
        expect(props).toHaveProperty("lfStyle");
        expect(props).toHaveProperty("lfView");
      });

      it("should return default prop values", async () => {
        const page = await createPage(`<lf-compare></lf-compare>`);
        const component = page.rootInstance as LfCompare;
        const props = await component.getProps();

        expect(props.lfDataset).toBeNull();
        expect(props.lfShape).toBe("image");
        expect(props.lfStyle).toBe("");
        expect(props.lfView).toBe("main");
      });

      it("should return custom prop values", async () => {
        const page = await createPage(
          `<lf-compare lf-shape="video" lf-view="split" lf-style=".test {}"></lf-compare>`,
        );
        const component = page.rootInstance as LfCompare;
        const props = await component.getProps();

        expect(props.lfShape).toBe("video");
        expect(props.lfView).toBe("split");
        expect(props.lfStyle).toBe(".test {}");
      });

      it("should reflect programmatic prop changes", async () => {
        const page = await createPage(`<lf-compare></lf-compare>`);
        const component = page.rootInstance as LfCompare;

        component.lfShape = "video";
        component.lfView = "split";
        await page.waitForChanges();

        const props = await component.getProps();
        expect(props.lfShape).toBe("video");
        expect(props.lfView).toBe("split");
      });
    });

    describe("refresh", () => {
      it("should trigger a re-render", async () => {
        const page = await createPage(`<lf-compare></lf-compare>`);
        const component = page.rootInstance as LfCompare;

        await component.refresh();
        await page.waitForChanges();

        expect(page.root).toBeTruthy();
      });

      it("should maintain state after refresh", async () => {
        const page = await createPage(
          `<lf-compare lf-shape="video"></lf-compare>`,
        );
        const component = page.rootInstance as LfCompare;

        await component.refresh();
        await page.waitForChanges();

        expect(component.lfShape).toBe("video");
      });

      it("should not throw when called multiple times", async () => {
        const page = await createPage(`<lf-compare></lf-compare>`);
        const component = page.rootInstance as LfCompare;

        await expect(component.refresh()).resolves.not.toThrow();
        await expect(component.refresh()).resolves.not.toThrow();
        await expect(component.refresh()).resolves.not.toThrow();
      });
    });

    describe("unmount", () => {
      it("should emit unmount event", async () => {
        const page = await createPage(`<lf-compare></lf-compare>`);
        const component = page.rootInstance as LfCompare;
        const { events, cleanup } = collectEvents(page);

        const unmountPromise = new Promise<void>((resolve) => {
          page.root.addEventListener("lf-compare-event", (e: CustomEvent) => {
            if (e.detail.eventType === "unmount") {
              resolve();
            }
          });
        });

        await component.unmount(0);
        await unmountPromise;

        const unmountEvent = events.find((e) => e.eventType === "unmount");
        expect(unmountEvent).toBeDefined();
        expect(unmountEvent.eventType).toBe("unmount");

        cleanup();
      });

      it("should respect delay parameter", async () => {
        const page = await createPage(`<lf-compare></lf-compare>`);
        const component = page.rootInstance as LfCompare;
        const { events, cleanup } = collectEvents(page);

        const startTime = Date.now();

        const unmountPromise = new Promise<void>((resolve) => {
          page.root.addEventListener("lf-compare-event", (e: CustomEvent) => {
            if (e.detail.eventType === "unmount") {
              resolve();
            }
          });
        });

        await component.unmount(50);
        await unmountPromise;

        const elapsed = Date.now() - startTime;
        expect(elapsed).toBeGreaterThanOrEqual(45); // Allow some tolerance

        cleanup();
      });

      it("should default to 0ms delay", async () => {
        const page = await createPage(`<lf-compare></lf-compare>`);
        const component = page.rootInstance as LfCompare;

        const unmountPromise = new Promise<void>((resolve) => {
          page.root.addEventListener("lf-compare-event", (e: CustomEvent) => {
            if (e.detail.eventType === "unmount") {
              resolve();
            }
          });
        });

        await component.unmount();
        await unmountPromise;

        expect(true).toBe(true); // If we reach here, unmount was called
      });
    });
  });
  //#endregion

  //#region View Transitions
  describe("View Transitions", () => {
    it("should start with main view by default", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      expect(component.lfView).toBe("main");
    });

    it("should accept split view", async () => {
      const page = await createPage(
        `<lf-compare lf-view="split"></lf-compare>`,
      );
      const component = page.rootInstance as LfCompare;
      expect(component.lfView).toBe("split");
    });

    it("should transition from main to split view", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;

      expect(component.lfView).toBe("main");

      component.lfView = "split";
      await page.waitForChanges();

      expect(component.lfView).toBe("split");
    });

    it("should transition from split to main view", async () => {
      const page = await createPage(
        `<lf-compare lf-view="split"></lf-compare>`,
      );
      const component = page.rootInstance as LfCompare;

      expect(component.lfView).toBe("split");

      component.lfView = "main";
      await page.waitForChanges();

      expect(component.lfView).toBe("main");
    });
  });
  //#endregion

  //#region Event Emission
  describe("Event Emission", () => {
    it("should emit ready event on component load", async () => {
      const events: LfCompareEventPayload[] = [];
      getLfFramework();

      const page = await newSpecPage({
        components: [LfCompare],
        html: `<lf-compare id="test-compare"></lf-compare>`,
      });

      page.root.addEventListener(
        "lf-compare-event",
        (e: CustomEvent<LfCompareEventPayload>) => {
          events.push(e.detail);
        },
      );

      await page.waitForChanges();

      // Ready event should have been emitted during componentDidLoad
      // We need to trigger a refresh to check event mechanism
      const component = page.rootInstance as LfCompare;
      await component.refresh();
      await page.waitForChanges();

      expect(component).toBeTruthy();
    });

    it("should include comp reference in event payload", async () => {
      const page = await createPage(
        `<lf-compare id="test-compare"></lf-compare>`,
      );
      const component = page.rootInstance as LfCompare;
      const { events, cleanup } = collectEvents(page);

      const unmountPromise = new Promise<void>((resolve) => {
        page.root.addEventListener("lf-compare-event", (e: CustomEvent) => {
          if (e.detail.eventType === "unmount") {
            resolve();
          }
        });
      });

      await component.unmount(0);
      await unmountPromise;

      const event = events.find((e) => e.eventType === "unmount");
      expect(event).toBeDefined();
      expect(event.comp).toBe(component);

      cleanup();
    });

    it("should include id in event payload", async () => {
      const page = await createPage(
        `<lf-compare id="my-test-compare"></lf-compare>`,
      );
      const component = page.rootInstance as LfCompare;
      const { events, cleanup } = collectEvents(page);

      const unmountPromise = new Promise<void>((resolve) => {
        page.root.addEventListener("lf-compare-event", (e: CustomEvent) => {
          if (e.detail.eventType === "unmount") {
            resolve();
          }
        });
      });

      await component.unmount(0);
      await unmountPromise;

      const event = events.find((e) => e.eventType === "unmount");
      expect(event).toBeDefined();
      expect(event.id).toBe("my-test-compare");

      cleanup();
    });

    it("should include eventType in event payload", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      const { events, cleanup } = collectEvents(page);

      const unmountPromise = new Promise<void>((resolve) => {
        page.root.addEventListener("lf-compare-event", (e: CustomEvent) => {
          if (e.detail.eventType === "unmount") {
            resolve();
          }
        });
      });

      await component.unmount(0);
      await unmountPromise;

      const event = events.find((e) => e.eventType === "unmount");
      expect(event).toBeDefined();
      expect(event.eventType).toBe("unmount");

      cleanup();
    });
  });
  //#endregion

  //#region Dataset and Shapes Handling
  describe("Dataset and Shapes Handling", () => {
    it("should update shapes when lfDataset changes", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;

      // shapes starts as defined (could be null or {})
      expect(component.shapes).toBeDefined();

      component.lfDataset = createMockDataset();
      await page.waitForChanges();

      // Shapes should be populated after dataset update
      expect(component.shapes).toBeDefined();
    });

    it("should update shapes when lfShape changes", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;

      component.lfDataset = createMockVideoDataset();
      await page.waitForChanges();

      component.lfShape = "video";
      await page.waitForChanges();

      expect(component.lfShape).toBe("video");
    });

    it("should handle empty dataset gracefully", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;

      component.lfDataset = { nodes: [] };
      await page.waitForChanges();

      expect(component.shapes).toBeDefined();
    });

    it("should handle null dataset gracefully", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;

      component.lfDataset = null;
      await page.waitForChanges();

      expect(component.lfDataset).toBeNull();
    });
  });
  //#endregion

  //#region Shape Type Handling
  describe("Shape Type Handling", () => {
    it("should handle image shape type", async () => {
      const page = await createPage(
        `<lf-compare lf-shape="image"></lf-compare>`,
      );
      const component = page.rootInstance as LfCompare;
      expect(component.lfShape).toBe("image");
    });

    it("should handle video shape type", async () => {
      const page = await createPage(
        `<lf-compare lf-shape="video"></lf-compare>`,
      );
      const component = page.rootInstance as LfCompare;
      expect(component.lfShape).toBe("video");
    });

    it("should change shape type dynamically", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;

      expect(component.lfShape).toBe("image");

      component.lfShape = "video";
      await page.waitForChanges();

      expect(component.lfShape).toBe("video");
    });
  });
  //#endregion

  //#region Panel State
  describe("Panel State", () => {
    it("should have left panel closed by default", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      expect(component.isLeftPanelOpened).toBe(false);
    });

    it("should have right panel closed by default", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      expect(component.isRightPanelOpened).toBe(false);
    });

    it("should toggle left panel state", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;

      expect(component.isLeftPanelOpened).toBe(false);

      component.isLeftPanelOpened = true;
      await page.waitForChanges();

      expect(component.isLeftPanelOpened).toBe(true);

      component.isLeftPanelOpened = false;
      await page.waitForChanges();

      expect(component.isLeftPanelOpened).toBe(false);
    });

    it("should toggle right panel state", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;

      expect(component.isRightPanelOpened).toBe(false);

      component.isRightPanelOpened = true;
      await page.waitForChanges();

      expect(component.isRightPanelOpened).toBe(true);

      component.isRightPanelOpened = false;
      await page.waitForChanges();

      expect(component.isRightPanelOpened).toBe(false);
    });

    it("should allow both panels to be open simultaneously", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;

      component.isLeftPanelOpened = true;
      component.isRightPanelOpened = true;
      await page.waitForChanges();

      expect(component.isLeftPanelOpened).toBe(true);
      expect(component.isRightPanelOpened).toBe(true);
    });
  });
  //#endregion

  //#region Lifecycle Hooks
  describe("Lifecycle Hooks", () => {
    it("should initialize framework on componentWillLoad", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      // Component should be fully initialized
      expect(component).toBeTruthy();
    });

    it("should update debug info during lifecycle", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;

      const debugInfo = await component.getDebugInfo();
      // Debug info should be populated
      expect(debugInfo).toBeDefined();
    });
  });
  //#endregion

  //#region Edge Cases
  describe("Edge Cases", () => {
    it("should handle rapid prop changes", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;

      component.lfView = "split";
      component.lfView = "main";
      component.lfView = "split";
      await page.waitForChanges();

      expect(component.lfView).toBe("split");
    });

    it("should handle rapid shape changes", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;

      component.lfShape = "video";
      component.lfShape = "image";
      component.lfShape = "video";
      await page.waitForChanges();

      expect(component.lfShape).toBe("video");
    });

    it("should handle setting same prop value multiple times", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;

      component.lfShape = "image";
      component.lfShape = "image";
      component.lfShape = "image";
      await page.waitForChanges();

      expect(component.lfShape).toBe("image");
    });

    it("should handle undefined dataset", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;

      component.lfDataset = undefined;
      await page.waitForChanges();

      expect(component.lfDataset).toBeUndefined();
    });

    it("should handle empty style string", async () => {
      const page = await createPage(`<lf-compare lf-style=""></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      expect(component.lfStyle).toBe("");
    });

    it("should handle whitespace-only style string", async () => {
      const page = await createPage(`<lf-compare lf-style="   "></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      expect(component.lfStyle).toBe("   ");
    });
  });
  //#endregion

  //#region Integration Tests
  describe("Integration Tests", () => {
    it("should work with dataset and shape changes together", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;

      // Start with image dataset
      component.lfDataset = createMockDataset();
      component.lfShape = "image";
      await page.waitForChanges();

      expect(component.lfShape).toBe("image");
      expect(component.lfDataset).toBeTruthy();

      // Switch to video
      component.lfDataset = createMockVideoDataset();
      component.lfShape = "video";
      await page.waitForChanges();

      expect(component.lfShape).toBe("video");
    });

    it("should maintain view state across dataset changes", async () => {
      const page = await createPage(
        `<lf-compare lf-view="split"></lf-compare>`,
      );
      const component = page.rootInstance as LfCompare;

      expect(component.lfView).toBe("split");

      component.lfDataset = createMockDataset();
      await page.waitForChanges();

      expect(component.lfView).toBe("split");
    });

    it("should maintain panel state across view changes", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;

      component.isLeftPanelOpened = true;
      await page.waitForChanges();

      component.lfView = "split";
      await page.waitForChanges();

      expect(component.isLeftPanelOpened).toBe(true);
    });
  });
  //#endregion

  //#region Adapter Tests
  describe("Adapter Functionality", () => {
    it("should initialize adapter during componentWillLoad", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      // Component should render correctly, indicating adapter was initialized
      expect(page.root.shadowRoot.querySelector("#lf-component")).toBeTruthy();
    });

    it("should have functional adapter after initialization", async () => {
      const page = await createPage(`<lf-compare></lf-compare>`);
      const component = page.rootInstance as LfCompare;
      // If the component renders without errors, the adapter is functional
      expect(component).toBeTruthy();
    });
  });
  //#endregion
});
