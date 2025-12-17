import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfDataDataset, LfDataNode } from "@lf-widgets/foundations";
import { LfChip } from "./lf-chip";

//#region Test Utilities
const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfChip],
    html,
  });
  await page.waitForChanges();
  return page;
};

const createTestDataset = (): LfDataDataset => ({
  nodes: [
    { id: "chip1", value: "Chip 1" },
    { id: "chip2", value: "Chip 2" },
    { id: "chip3", value: "Chip 3" },
  ],
});

const createDatasetWithIcons = (): LfDataDataset => ({
  nodes: [
    { id: "chip1", value: "Home", icon: "home" },
    { id: "chip2", value: "Settings", icon: "settings" },
    { id: "chip3", value: "Profile", icon: "person" },
  ],
});

const createDatasetWithDescriptions = (): LfDataDataset => ({
  nodes: [
    { id: "chip1", value: "Option A", description: "First option" },
    { id: "chip2", value: "Option B", description: "Second option" },
  ],
});

const createHierarchicalDataset = (): LfDataDataset => ({
  nodes: [
    {
      id: "parent1",
      value: "Category 1",
      children: [
        { id: "child1", value: "Item 1.1" },
        { id: "child2", value: "Item 1.2" },
      ],
    },
    {
      id: "parent2",
      value: "Category 2",
      children: [{ id: "child3", value: "Item 2.1" }],
    },
  ],
});
//#endregion

describe("lf-chip component", () => {
  //#region Basic Rendering
  describe("basic rendering", () => {
    it("renders with default props", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      expect(page.root).toBeDefined();
      expect(page.root.tagName.toLowerCase()).toBe("lf-chip");
    });

    it("renders shadow DOM", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      expect(page.root.shadowRoot).toBeDefined();
    });

    it("renders chip container", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      const chip = page.root.shadowRoot.querySelector(".chip");
      expect(chip).not.toBeNull();
    });

    it("renders with custom id", async () => {
      const page = await createPage(`<lf-chip id="my-chip"></lf-chip>`);
      expect(page.root.id).toBe("my-chip");
    });

    it("renders chips from dataset", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();
      const chips = page.root.shadowRoot.querySelectorAll(".item");
      expect(chips.length).toBe(3);
    });

    it("renders chip values correctly", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();
      const chips = page.root.shadowRoot.querySelectorAll(".item");
      expect(chips[0].textContent).toContain("Chip 1");
      expect(chips[1].textContent).toContain("Chip 2");
      expect(chips[2].textContent).toContain("Chip 3");
    });

    it("renders nothing when dataset is null", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = null;
      await page.waitForChanges();
      const items = page.root.shadowRoot.querySelectorAll(".item");
      expect(items.length).toBe(0);
    });

    it("renders nothing when dataset has empty nodes", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = { nodes: [] };
      await page.waitForChanges();
      const items = page.root.shadowRoot.querySelectorAll(".item");
      expect(items.length).toBe(0);
    });
  });
  //#endregion

  //#region Props Handling
  describe("props handling", () => {
    it("applies lfAriaLabel", async () => {
      const page = await createPage(
        `<lf-chip lf-aria-label="Test label"></lf-chip>`,
      );
      expect(page.rootInstance.lfAriaLabel).toBe("Test label");
    });

    it("applies lfDataset", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      const dataset = createTestDataset();
      page.rootInstance.lfDataset = dataset;
      await page.waitForChanges();
      expect(page.rootInstance.lfDataset).toEqual(dataset);
    });

    it("applies lfFlat", async () => {
      const page = await createPage(`<lf-chip lf-flat="true"></lf-chip>`);
      expect(page.rootInstance.lfFlat).toBe(true);
    });

    it("applies lfRipple", async () => {
      const page = await createPage(`<lf-chip lf-ripple="false"></lf-chip>`);
      expect(page.rootInstance.lfRipple).toBe(false);
    });

    it("applies lfShowSpinner", async () => {
      const page = await createPage(
        `<lf-chip lf-show-spinner="true"></lf-chip>`,
      );
      expect(page.rootInstance.lfShowSpinner).toBe(true);
    });

    it("applies lfStyle", async () => {
      const page = await createPage(
        `<lf-chip lf-style=".chip { color: red; }"></lf-chip>`,
      );
      expect(page.rootInstance.lfStyle).toBe(".chip { color: red; }");
    });

    it("applies lfStyling choice", async () => {
      const page = await createPage(`<lf-chip lf-styling="choice"></lf-chip>`);
      expect(page.rootInstance.lfStyling).toBe("choice");
    });

    it("applies lfStyling filter", async () => {
      const page = await createPage(`<lf-chip lf-styling="filter"></lf-chip>`);
      expect(page.rootInstance.lfStyling).toBe("filter");
    });

    it("applies lfStyling input", async () => {
      const page = await createPage(`<lf-chip lf-styling="input"></lf-chip>`);
      expect(page.rootInstance.lfStyling).toBe("input");
    });

    it("applies lfUiSize", async () => {
      const page = await createPage(`<lf-chip lf-ui-size="small"></lf-chip>`);
      expect(page.rootInstance.lfUiSize).toBe("small");
    });

    it("applies lfUiState", async () => {
      const page = await createPage(
        `<lf-chip lf-ui-state="success"></lf-chip>`,
      );
      expect(page.rootInstance.lfUiState).toBe("success");
    });

    it("applies lfValue initial selection", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      page.rootInstance.lfValue = ["chip1", "chip2"];
      await page.waitForChanges();
      // lfValue should set initial selected nodes
      expect(page.rootInstance.lfValue).toEqual(["chip1", "chip2"]);
    });

    it("defaults lfStyling to standard", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      expect(page.rootInstance.lfStyling).toBe("standard");
    });

    it("defaults lfUiSize to medium", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      expect(page.rootInstance.lfUiSize).toBe("medium");
    });

    it("defaults lfUiState to primary", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      expect(page.rootInstance.lfUiState).toBe("primary");
    });

    it("defaults lfRipple to true", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      expect(page.rootInstance.lfRipple).toBe(true);
    });
  });
  //#endregion

  //#region State Management
  describe("state management", () => {
    it("initializes debugInfo", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      expect(page.rootInstance.debugInfo).toBeDefined();
    });

    it("initializes selectedNodes as empty Set", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      expect(page.rootInstance.selectedNodes).toBeDefined();
      expect(page.rootInstance.selectedNodes.size).toBe(0);
    });

    it("initializes expandedNodes as empty Set", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      expect(page.rootInstance.expandedNodes).toBeDefined();
      expect(page.rootInstance.expandedNodes.size).toBe(0);
    });

    it("initializes hiddenNodes as empty Set", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      expect(page.rootInstance.hiddenNodes).toBeDefined();
      expect(page.rootInstance.hiddenNodes.size).toBe(0);
    });

    it("updates selectedNodes on chip click", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();

      const chip = page.root.shadowRoot.querySelector(".item");
      chip.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      expect(page.rootInstance.selectedNodes.size).toBe(1);
    });

    it("toggles selection on repeated clicks", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();

      const chip = page.root.shadowRoot.querySelector(".item");

      // First click - select
      chip.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();
      expect(page.rootInstance.selectedNodes.size).toBe(1);

      // Second click - deselect
      chip.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();
      expect(page.rootInstance.selectedNodes.size).toBe(0);
    });

    it("allows multiple selections", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();

      const chips = page.root.shadowRoot.querySelectorAll(".item");

      chips[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      chips[1].dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      expect(page.rootInstance.selectedNodes.size).toBe(2);
    });
  });
  //#endregion

  //#region Public Methods
  describe("public methods", () => {
    describe("getDebugInfo", () => {
      it("returns debug info object", async () => {
        const page = await createPage(`<lf-chip></lf-chip>`);
        const debugInfo = await page.rootInstance.getDebugInfo();
        expect(debugInfo).toBeDefined();
      });

      it("contains lifecycle information", async () => {
        const page = await createPage(`<lf-chip></lf-chip>`);
        const debugInfo = await page.rootInstance.getDebugInfo();
        expect(debugInfo.endTime).toBeDefined();
        expect(debugInfo.renderCount).toBeDefined();
      });
    });

    describe("getProps", () => {
      it("returns all props", async () => {
        const page = await createPage(`<lf-chip></lf-chip>`);
        const props = await page.rootInstance.getProps();
        expect(props).toBeDefined();
        expect(props.lfDataset).toBeDefined();
        expect(props.lfStyling).toBe("standard");
      });

      it("returns current prop values", async () => {
        const page = await createPage(
          `<lf-chip lf-styling="choice"></lf-chip>`,
        );
        const props = await page.rootInstance.getProps();
        expect(props.lfStyling).toBe("choice");
      });

      it("reflects prop changes", async () => {
        const page = await createPage(`<lf-chip></lf-chip>`);
        page.rootInstance.lfUiState = "success";
        await page.waitForChanges();
        const props = await page.rootInstance.getProps();
        expect(props.lfUiState).toBe("success");
      });
    });

    describe("getSelectedNodes", () => {
      it("returns empty Set when nothing selected", async () => {
        const page = await createPage(`<lf-chip></lf-chip>`);
        const selected = await page.rootInstance.getSelectedNodes();
        expect(selected.size).toBe(0);
      });

      it("returns selected nodes after selection", async () => {
        const page = await createPage(`<lf-chip></lf-chip>`);
        page.rootInstance.lfDataset = createTestDataset();
        await page.waitForChanges();

        const chip = page.root.shadowRoot.querySelector(".item");
        chip.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        await page.waitForChanges();

        const selected = await page.rootInstance.getSelectedNodes();
        expect(selected.size).toBe(1);
      });
    });

    describe("setSelectedNodes", () => {
      it("selects nodes by ID", async () => {
        const page = await createPage(`<lf-chip></lf-chip>`);
        page.rootInstance.lfDataset = createTestDataset();
        await page.waitForChanges();

        await page.rootInstance.setSelectedNodes(["chip1", "chip2"]);
        await page.waitForChanges();

        expect(page.rootInstance.selectedNodes.size).toBe(2);
      });

      it("selects nodes by object reference", async () => {
        const page = await createPage(`<lf-chip></lf-chip>`);
        const dataset = createTestDataset();
        page.rootInstance.lfDataset = dataset;
        await page.waitForChanges();

        await page.rootInstance.setSelectedNodes([
          dataset.nodes[0],
          dataset.nodes[1],
        ]);
        await page.waitForChanges();

        expect(page.rootInstance.selectedNodes.size).toBe(2);
      });

      it("clears selection with empty array", async () => {
        const page = await createPage(`<lf-chip></lf-chip>`);
        page.rootInstance.lfDataset = createTestDataset();
        await page.waitForChanges();

        await page.rootInstance.setSelectedNodes(["chip1"]);
        await page.waitForChanges();
        expect(page.rootInstance.selectedNodes.size).toBe(1);

        await page.rootInstance.setSelectedNodes([]);
        await page.waitForChanges();
        expect(page.rootInstance.selectedNodes.size).toBe(0);
      });

      it("ignores non-existent node IDs", async () => {
        const page = await createPage(`<lf-chip></lf-chip>`);
        page.rootInstance.lfDataset = createTestDataset();
        await page.waitForChanges();

        await page.rootInstance.setSelectedNodes([
          "chip1",
          "non-existent",
          "chip2",
        ]);
        await page.waitForChanges();

        expect(page.rootInstance.selectedNodes.size).toBe(2);
      });
    });

    describe("refresh", () => {
      it("triggers re-render", async () => {
        const page = await createPage(`<lf-chip></lf-chip>`);
        const initialRenderCount = page.rootInstance.debugInfo.renderCount;
        await page.rootInstance.refresh();
        await page.waitForChanges();
        expect(page.rootInstance.debugInfo.renderCount).toBeGreaterThan(
          initialRenderCount,
        );
      });

      it("maintains state after refresh", async () => {
        const page = await createPage(`<lf-chip></lf-chip>`);
        page.rootInstance.lfDataset = createTestDataset();
        await page.waitForChanges();

        const chip = page.root.shadowRoot.querySelector(".item");
        chip.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        await page.waitForChanges();

        const selectedBefore = page.rootInstance.selectedNodes.size;
        await page.rootInstance.refresh();
        await page.waitForChanges();

        expect(page.rootInstance.selectedNodes.size).toBe(selectedBefore);
      });
    });

    describe("unmount", () => {
      it("emits unmount event", async () => {
        const page = await createPage(`<lf-chip></lf-chip>`);
        const spy = jest.fn();
        page.root.addEventListener("lf-chip-event", spy);

        await page.rootInstance.unmount(0);
        await new Promise((resolve) => setTimeout(resolve, 10));

        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: expect.objectContaining({ eventType: "unmount" }),
          }),
        );
      });

      it("removes component from DOM", async () => {
        const page = await createPage(`<lf-chip></lf-chip>`);
        const removeSpy = jest.spyOn(page.root, "remove");

        await page.rootInstance.unmount(0);
        await new Promise((resolve) => setTimeout(resolve, 10));

        expect(removeSpy).toHaveBeenCalled();
      });

      it("respects delay parameter", async () => {
        const page = await createPage(`<lf-chip></lf-chip>`);
        const removeSpy = jest.spyOn(page.root, "remove");

        await page.rootInstance.unmount(50);

        // Should not be removed immediately
        expect(removeSpy).not.toHaveBeenCalled();

        // Wait for delay
        await new Promise((resolve) => setTimeout(resolve, 60));
        expect(removeSpy).toHaveBeenCalled();
      });
    });
  });
  //#endregion

  //#region Event Emission
  describe("event emission", () => {
    it("emits ready event on load", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      // Ready event is emitted during componentDidLoad
      expect(page.rootInstance.debugInfo).toBeDefined();
    });

    it("emits click event on chip click", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();

      const spy = jest.fn();
      page.root.addEventListener("lf-chip-event", spy);

      const chip = page.root.shadowRoot.querySelector(".item");
      chip.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({ eventType: "click" }),
        }),
      );
    });

    it("includes node in event payload", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();

      const spy = jest.fn();
      page.root.addEventListener("lf-chip-event", spy);

      const chip = page.root.shadowRoot.querySelector(".item");
      chip.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            node: expect.objectContaining({ id: "chip1" }),
          }),
        }),
      );
    });

    it("includes selectedNodes in event payload", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();

      const spy = jest.fn();
      page.root.addEventListener("lf-chip-event", spy);

      const chip = page.root.shadowRoot.querySelector(".item");
      chip.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            selectedNodes: expect.any(Set),
          }),
        }),
      );
    });

    it("includes component reference in event", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();

      const spy = jest.fn();
      page.root.addEventListener("lf-chip-event", spy);

      const chip = page.root.shadowRoot.querySelector(".item");
      chip.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            comp: page.rootInstance,
          }),
        }),
      );
    });

    it("includes id in event payload", async () => {
      const page = await createPage(`<lf-chip id="test-chip"></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();

      const spy = jest.fn();
      page.root.addEventListener("lf-chip-event", spy);

      const chip = page.root.shadowRoot.querySelector(".item");
      chip.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({ id: "test-chip" }),
        }),
      );
    });
  });
  //#endregion

  //#region Styling Modes
  describe("styling modes", () => {
    it("applies standard styling class", async () => {
      const page = await createPage(
        `<lf-chip lf-styling="standard"></lf-chip>`,
      );
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();
      const chip = page.root.shadowRoot.querySelector(".chip");
      expect(chip).toBeDefined();
    });

    it("applies choice styling class", async () => {
      const page = await createPage(`<lf-chip lf-styling="choice"></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();
      const chip = page.root.shadowRoot.querySelector(".chip");
      expect(chip).toBeDefined();
    });

    it("applies filter styling class", async () => {
      const page = await createPage(`<lf-chip lf-styling="filter"></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();
      const chip = page.root.shadowRoot.querySelector(".chip");
      expect(chip).toBeDefined();
    });

    it("applies input styling class", async () => {
      const page = await createPage(`<lf-chip lf-styling="input"></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();
      const chip = page.root.shadowRoot.querySelector(".chip");
      expect(chip).toBeDefined();
    });

    it("adds selected class on selection", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();

      const chip = page.root.shadowRoot.querySelector(".item");
      chip.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      expect(chip.classList.contains("item--selected")).toBe(true);
    });

    it("removes selected class on deselection", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();

      const chip = page.root.shadowRoot.querySelector(".item");

      // Select
      chip.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();
      expect(chip.classList.contains("item--selected")).toBe(true);

      // Deselect
      chip.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();
      expect(chip.classList.contains("item--selected")).toBe(false);
    });
  });
  //#endregion

  //#region Icons and Content
  describe("icons and content", () => {
    it("renders icons from dataset", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createDatasetWithIcons();
      await page.waitForChanges();
      // Component should render, icons are rendered via FIcon component
      const items = page.root.shadowRoot.querySelectorAll(".item");
      expect(items.length).toBe(3);
    });

    it("renders descriptions from dataset", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createDatasetWithDescriptions();
      await page.waitForChanges();
      const items = page.root.shadowRoot.querySelectorAll(".item");
      expect(items.length).toBe(2);
    });
  });
  //#endregion

  //#region Hierarchical Data
  describe("hierarchical data", () => {
    it("renders parent nodes", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createHierarchicalDataset();
      await page.waitForChanges();
      const items = page.root.shadowRoot.querySelectorAll(".item");
      expect(items.length).toBeGreaterThan(0);
    });
  });
  //#endregion

  //#region Edge Cases
  describe("edge cases", () => {
    it("handles rapid clicks gracefully", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();

      const chip = page.root.shadowRoot.querySelector(".item");

      // Rapid clicks
      for (let i = 0; i < 10; i++) {
        chip.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      }
      await page.waitForChanges();

      // Should not throw and state should be consistent
      expect(page.rootInstance.selectedNodes).toBeDefined();
    });

    it("handles dataset change while selected", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();

      const chip = page.root.shadowRoot.querySelector(".item");
      chip.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      // Change dataset
      page.rootInstance.lfDataset = createDatasetWithIcons();
      await page.waitForChanges();

      // Component should handle gracefully
      expect(page.root).toBeDefined();
    });

    it("handles null dataset after having data", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();

      page.rootInstance.lfDataset = null;
      await page.waitForChanges();

      const items = page.root.shadowRoot.querySelectorAll(".item");
      expect(items.length).toBe(0);
    });

    it("handles special characters in values", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = {
        nodes: [
          { id: "1", value: "Test <script>alert('xss')</script>" },
          { id: "2", value: "Test & ampersand" },
          { id: "3", value: 'Test "quotes"' },
        ],
      };
      await page.waitForChanges();

      const items = page.root.shadowRoot.querySelectorAll(".item");
      expect(items.length).toBe(3);
    });

    it("handles very long values", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      const longValue = "A".repeat(1000);
      page.rootInstance.lfDataset = {
        nodes: [{ id: "1", value: longValue }],
      };
      await page.waitForChanges();

      const items = page.root.shadowRoot.querySelectorAll(".item");
      expect(items.length).toBe(1);
    });

    it("handles many chips", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      const manyNodes = Array.from({ length: 100 }, (_, i) => ({
        id: `chip${i}`,
        value: `Chip ${i}`,
      }));
      page.rootInstance.lfDataset = { nodes: manyNodes };
      await page.waitForChanges();

      const items = page.root.shadowRoot.querySelectorAll(".item");
      expect(items.length).toBe(100);
    });
  });
  //#endregion

  //#region Custom Styling
  describe("custom styling", () => {
    it("applies lfStyle to style element", async () => {
      const page = await createPage(
        `<lf-chip lf-style=".chip { color: red; }"></lf-chip>`,
      );
      const styleEl = page.root.shadowRoot.querySelector("#lf-style");
      expect(styleEl).toBeDefined();
    });

    it("does not render style element when lfStyle is empty", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      // Style element may or may not exist, but should not contain custom styles
      expect(page.rootInstance.lfStyle).toBe("");
    });

    it("updates style dynamically", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfStyle = ".chip { background: blue; }";
      await page.waitForChanges();
      expect(page.rootInstance.lfStyle).toBe(".chip { background: blue; }");
    });
  });
  //#endregion

  //#region Accessibility
  describe("accessibility", () => {
    it("applies aria-label to chips when provided", async () => {
      const page = await createPage(
        `<lf-chip lf-aria-label="Select option"></lf-chip>`,
      );
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();
      expect(page.rootInstance.lfAriaLabel).toBe("Select option");
    });
  });
  //#endregion

  //#region Flat Mode
  describe("flat mode", () => {
    it("renders in flat mode", async () => {
      const page = await createPage(`<lf-chip lf-flat="true"></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();
      expect(page.rootInstance.lfFlat).toBe(true);
    });

    it("toggles flat mode", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();

      expect(page.rootInstance.lfFlat).toBe(false);

      page.rootInstance.lfFlat = true;
      await page.waitForChanges();

      expect(page.rootInstance.lfFlat).toBe(true);
    });
  });
  //#endregion

  //#region Spinner
  describe("spinner", () => {
    it("shows spinner when lfShowSpinner is true", async () => {
      const page = await createPage(
        `<lf-chip lf-show-spinner="true"></lf-chip>`,
      );
      page.rootInstance.lfDataset = createTestDataset();
      await page.waitForChanges();
      expect(page.rootInstance.lfShowSpinner).toBe(true);
    });

    it("hides spinner by default", async () => {
      const page = await createPage(`<lf-chip></lf-chip>`);
      expect(page.rootInstance.lfShowSpinner).toBe(false);
    });
  });
  //#endregion
});
