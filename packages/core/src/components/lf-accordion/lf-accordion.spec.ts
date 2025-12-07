import { newSpecPage } from "@stencil/core/testing";
import { LfAccordion } from "./lf-accordion";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfAccordion], html });
  return page;
};

describe("lf-accordion component", () => {
  beforeAll(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.warn as jest.Mock).mockRestore();
  });

  describe("Basic Rendering", () => {
    it("renders with dataset", async () => {
      const page = await createPage(`<lf-accordion></lf-accordion>`);
      const component = page.rootInstance as LfAccordion;
      component.lfDataset = {
        nodes: [
          {
            id: "1",
            value: "Item 1",
            children: [{ id: "1.1", value: "Subitem 1" }],
          },
          { id: "2", value: "Item 2" },
        ],
      };
      await page.waitForChanges();
      expect(page.root).toBeDefined();
    });

    it("renders empty when no dataset", async () => {
      const page = await createPage(`<lf-accordion></lf-accordion>`);
      await page.waitForChanges();
      expect(page.root).toBeDefined();
      const nodes = page.root.shadowRoot.querySelectorAll(".node");
      expect(nodes.length).toBe(0);
    });

    it("renders nodes from dataset", async () => {
      const page = await createPage(`<lf-accordion></lf-accordion>`);
      page.rootInstance.lfDataset = {
        nodes: [
          { id: "1", value: "Item 1" },
          { id: "2", value: "Item 2" },
        ],
      };
      await page.waitForChanges();
      const nodes = page.root.shadowRoot.querySelectorAll(".node");
      expect(nodes.length).toBe(2);
      expect(nodes[0].textContent.trim()).toContain("Item 1");
      expect(nodes[1].textContent.trim()).toContain("Item 2");
    });
  });

  describe("Node Interactions", () => {
    it("expands expandable node on click", async () => {
      const page = await createPage(`<lf-accordion></lf-accordion>`);
      page.rootInstance.lfDataset = {
        nodes: [
          {
            id: "1",
            value: "Item 1",
            cells: { col1: { shape: "text", value: "Content" } },
          },
        ],
      };
      await page.waitForChanges();
      const header = page.root.shadowRoot.querySelector(".node__header");
      expect(header).not.toBeNull();

      // Initially not expanded
      let content = page.root.shadowRoot.querySelector(".node__content");
      expect(content).toBeNull();

      // Click to expand
      header.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      // Now should be expanded
      content = page.root.shadowRoot.querySelector(".node__content");
      expect(content).not.toBeNull();
    });

    it("selects non-expandable node on click", async () => {
      const page = await createPage(`<lf-accordion></lf-accordion>`);
      page.rootInstance.lfDataset = {
        nodes: [{ id: "1", value: "Item 1" }],
      };
      await page.waitForChanges();
      const header = page.root.shadowRoot.querySelector(".node__header");
      expect(header).not.toBeNull();

      // Initially not selected
      expect(header.classList.contains("node__header--selected")).toBe(false);

      // Click to select
      header.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      // Now should be selected
      expect(header.classList.contains("node__header--selected")).toBe(true);
    });

    it("toggles expansion state correctly", async () => {
      const page = await createPage(`<lf-accordion></lf-accordion>`);
      const component = page.rootInstance as LfAccordion;
      component.lfDataset = {
        nodes: [
          {
            id: "1",
            value: "Item 1",
            cells: { col1: { shape: "text", value: "Content" } },
          },
        ],
      };
      await page.waitForChanges();

      // Initially not expanded
      expect(component.expandedNodeIds.size).toBe(0);

      // Expand
      await component.toggleNode("1");
      expect(component.expandedNodeIds.size).toBe(1);

      // Expand again (should collapse)
      await component.toggleNode("1");
      expect(component.expandedNodeIds.size).toBe(0);
    });
  });

  describe("Events", () => {
    it("emits lf-accordion-event on click", async () => {
      const page = await createPage(`<lf-accordion></lf-accordion>`);
      page.rootInstance.lfDataset = {
        nodes: [{ id: "1", value: "Item 1" }],
      };
      await page.waitForChanges();
      const spy = jest.fn();
      page.root.addEventListener("lf-accordion-event", spy);
      const header = page.root.shadowRoot.querySelector(".node__header");
      header.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({ eventType: "click" }),
        }),
      );
    });
  });

  describe("Public Methods", () => {
    it("returns selected nodes via getSelectedNodes method", async () => {
      const page = await createPage(`<lf-accordion></lf-accordion>`);
      page.rootInstance.lfDataset = {
        nodes: [{ id: "1", value: "Item 1" }],
      };
      await page.waitForChanges();
      const header = page.root.shadowRoot.querySelector(".node__header");
      header.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      const selectedNodes = await page.rootInstance.getSelectedNodes();
      expect(selectedNodes.size).toBe(1);
      const nodeArray = Array.from(selectedNodes);
      expect((nodeArray[0] as any).id).toBe("1");
    });

    it("returns component props via getProps method", async () => {
      const page = await createPage(
        `<lf-accordion lf-ui-size="small" lf-ripple="false"></lf-accordion>`,
      );
      const props = await page.rootInstance.getProps();
      expect(props.lfUiSize).toBe("small");
      expect(props.lfRipple).toBe(false);
      expect(props.lfDataset).toBe(null);
    });

    it("returns debug info via getDebugInfo method", async () => {
      const page = await createPage(`<lf-accordion></lf-accordion>`);
      const debugInfo = await page.rootInstance.getDebugInfo();
      expect(debugInfo).toBeDefined();
      expect(typeof debugInfo).toBe("object");
    });

    it("refreshes component via refresh method", async () => {
      const page = await createPage(`<lf-accordion></lf-accordion>`);
      // The refresh method calls forceUpdate internally, we can just verify it doesn't throw
      await expect(page.rootInstance.refresh()).resolves.toBeUndefined();
    });

    it("unmounts component via unmount method", async () => {
      const page = await createPage(`<lf-accordion></lf-accordion>`);
      const spy = jest.fn();
      page.root.addEventListener("lf-accordion-event", spy);
      const removeSpy = jest.spyOn(page.root, "remove");

      await page.rootInstance.unmount(0);
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({ eventType: "unmount" }),
        }),
      );
      expect(removeSpy).toHaveBeenCalled();
    });
  });

  describe("Props and Attributes", () => {
    it("applies ui size attribute", async () => {
      const page = await createPage(
        `<lf-accordion lf-ui-size="small"></lf-accordion>`,
      );
      expect(page.root.getAttribute("lf-ui-size")).toBe("small");
    });

    it("applies ui state attribute", async () => {
      const page = await createPage(
        `<lf-accordion lf-ui-state="secondary"></lf-accordion>`,
      );
      expect(page.root.getAttribute("lf-ui-state")).toBe("secondary");
    });

    it("applies custom style", async () => {
      const page = await createPage(
        `<lf-accordion lf-style="color: red;"></lf-accordion>`,
      );
      const styleElement = page.root.shadowRoot.querySelector("style");
      expect(styleElement).toBeDefined();
      expect(styleElement.textContent).toContain("color: red");
    });

    it("handles ripple prop", async () => {
      const page = await createPage(
        `<lf-accordion lf-ripple="false"></lf-accordion>`,
      );
      expect(page.rootInstance.lfRipple).toBe(false);
    });
  });

  describe("Node Behavior", () => {
    it("handles expandable vs non-expandable nodes correctly", async () => {
      const page = await createPage(`<lf-accordion></lf-accordion>`);
      page.rootInstance.lfDataset = {
        nodes: [
          {
            id: "1",
            value: "Expandable Item",
            cells: { col1: { shape: "text", value: "Content" } },
          },
          { id: "2", value: "Non-expandable Item" },
        ],
      };
      await page.waitForChanges();

      const headers = page.root.shadowRoot.querySelectorAll(".node__header");
      expect(headers.length).toBe(2);

      // First node should have expand icon (expandable)
      const expandIcon = headers[0].querySelector(".node__expand");
      expect(expandIcon).toBeDefined();

      // Second node should not have expand icon (non-expandable)
      const noExpandIcon = headers[1].querySelector(".node__expand");
      expect(noExpandIcon).toBeNull();
    });

    it("maintains expansion state correctly", async () => {
      const page = await createPage(`<lf-accordion></lf-accordion>`);
      const component = page.rootInstance as LfAccordion;
      component.lfDataset = {
        nodes: [
          {
            id: "1",
            value: "Item 1",
            cells: { col1: { shape: "text", value: "Content" } },
          },
        ],
      };
      await page.waitForChanges();

      // Initially not expanded
      expect(component.expandedNodeIds.size).toBe(0);

      // Click to expand
      const header = page.root.shadowRoot.querySelector(".node__header");
      header.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      // Should be expanded now
      expect(component.expandedNodeIds.size).toBe(1);

      // Click again to collapse
      header.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      // Should be collapsed
      expect(component.expandedNodeIds.size).toBe(0);
    });

    it("maintains selection state for non-expandable nodes", async () => {
      const page = await createPage(`<lf-accordion></lf-accordion>`);
      const component = page.rootInstance as LfAccordion;
      component.lfDataset = {
        nodes: [{ id: "1", value: "Item 1" }],
      };
      await page.waitForChanges();

      // Initially not selected
      expect(component.selectedNodeIds.size).toBe(0);

      // Click to select
      const header = page.root.shadowRoot.querySelector(".node__header");
      header.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      // Should be selected
      expect(component.selectedNodeIds.size).toBe(1);

      // Click again to deselect
      header.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      // Should be deselected
      expect(component.selectedNodeIds.size).toBe(0);
    });
  });

  describe("Edge Cases", () => {
    it("handles toggleNode with invalid id", async () => {
      const page = await createPage(`<lf-accordion></lf-accordion>`);
      const component = page.rootInstance as LfAccordion;
      component.lfDataset = {
        nodes: [{ id: "1", value: "Item 1" }],
      };
      await page.waitForChanges();

      // Should not throw or change state
      await component.toggleNode("invalid-id");
      expect(component.selectedNodeIds.size).toBe(0);
      expect(component.expandedNodeIds.size).toBe(0);
    });

    it("renders nodes with icons", async () => {
      const page = await createPage(`<lf-accordion></lf-accordion>`);
      page.rootInstance.lfDataset = {
        nodes: [{ id: "1", value: "Item 1", icon: "test-icon" }],
      };
      await page.waitForChanges();

      const iconElement = page.root.shadowRoot.querySelector(".node__icon");
      expect(iconElement).toBeDefined();
    });

    it("renders expandable nodes with expand icon", async () => {
      const page = await createPage(`<lf-accordion></lf-accordion>`);
      page.rootInstance.lfDataset = {
        nodes: [
          {
            id: "1",
            value: "Item 1",
            cells: { col1: { shape: "text", value: "Content" } },
          },
        ],
      };
      await page.waitForChanges();

      const expandIcon = page.root.shadowRoot.querySelector(".node__expand");
      expect(expandIcon).toBeDefined();
    });

    it("renders header elements that can be used for ripple", async () => {
      const page = await createPage(
        `<lf-accordion lf-ripple="true"></lf-accordion>`,
      );
      page.rootInstance.lfDataset = {
        nodes: [
          {
            id: "1",
            value: "Item 1",
            cells: { col1: { shape: "text", value: "Content" } },
          },
        ],
      };
      await page.waitForChanges();

      // Verify the header element exists - ripple registration is handled in componentDidRender
      const header = page.root.shadowRoot.querySelector(".node__header");
      expect(header).not.toBeNull();
    });
  });
});
