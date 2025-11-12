import { newSpecPage } from "@stencil/core/testing";
import { LfList } from "./lf-list";
import { LfDataDataset } from "@lf-widgets/foundations";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfList], html });
  await page.waitForChanges();
  return page;
};

// Sample dataset for testing
const sampleDataset: LfDataDataset = {
  nodes: [
    { id: "1", value: "Item 1", description: "First Item" },
    { id: "2", value: "Item 2", description: "Second Item" },
    { id: "3", value: "Item 3", description: "Third Item" },
  ],
};

describe("lf-list component", () => {
  it("renders with default props", async () => {
    const page = await createPage(`<lf-list></lf-list>`);
    expect(page.root).toBeDefined();
    const emptyData = page.root.shadowRoot.querySelector(".empty-data");
    expect(emptyData).not.toBeNull();
  });

  it("displays empty message when no dataset is provided", async () => {
    const page = await createPage(
      `<lf-list lf-empty="No items found"></lf-list>`,
    );
    const emptyData = page.root.shadowRoot.querySelector(".empty-data");
    expect(emptyData).not.toBeNull();
    expect(emptyData.textContent).toBe("No items found");
  });

  it("renders dataset items correctly", async () => {
    const page = await createPage(`<lf-list></lf-list>`);
    page.root.lfDataset = sampleDataset;
    await page.waitForChanges();

    const items = page.root.shadowRoot.querySelectorAll(".list__item");
    expect(items.length).toBe(3);

    const firstItem = items[0];
    expect(firstItem.textContent).toContain("Item 1");
  });

  it("reflects ui size attribute", async () => {
    const page = await createPage(`<lf-list lf-ui-size="small"></lf-list>`);
    expect(page.root.hasAttribute("lf-ui-size")).toBe(true);
    expect(page.root.getAttribute("lf-ui-size")).toBe("small");
  });

  it("returns props object when getProps is called", async () => {
    const page = await createPage(
      `<lf-list lf-empty="test empty" lf-selectable="true"></lf-list>`,
    );
    const props = await page.root.getProps();
    expect(props).toHaveProperty("lfEmpty", "test empty");
    expect(props).toHaveProperty("lfSelectable", true);
  });

  it("returns debug info when getDebugInfo is called", async () => {
    const page = await createPage(`<lf-list></lf-list>`);
    const debugInfo = await page.root.getDebugInfo();
    expect(debugInfo).toHaveProperty("renderCount");
    expect(debugInfo).toHaveProperty("renderStart");
    expect(debugInfo).toHaveProperty("renderEnd");
  });

  it("refresh method triggers re-render", async () => {
    const page = await createPage(`<lf-list></lf-list>`);
    page.root.lfDataset = sampleDataset;
    await page.waitForChanges();

    const initialItems =
      page.root.shadowRoot.querySelectorAll(".list__item").length;
    expect(initialItems).toBe(3);

    // Modify dataset
    page.root.lfDataset.nodes.push({
      id: "4",
      value: "Item 4",
      description: "Fourth Item",
    });

    // Refresh should update the DOM
    await page.root.refresh();
    await page.waitForChanges();

    const updatedItems =
      page.root.shadowRoot.querySelectorAll(".list__item").length;
    expect(updatedItems).toBe(4);
  });
});
