import { newSpecPage } from "@stencil/core/testing";
import { LfAccordion } from "./lf-accordion";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfAccordion], html });
  await page.waitForChanges();
  return page;
};

describe("lf-accordion component", () => {
  it("renders with default props", async () => {
    const page = await createPage(`<lf-accordion></lf-accordion>`);
    expect(page.root).toBeDefined();
    const accordion = page.root.shadowRoot.querySelector(".accordion");
    expect(accordion).not.toBeNull();
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

  it("applies ui size attribute", async () => {
    const page = await createPage(
      `<lf-accordion lf-ui-size="small"></lf-accordion>`,
    );
    expect(page.root.getAttribute("lf-ui-size")).toBe("small");
  });
});
