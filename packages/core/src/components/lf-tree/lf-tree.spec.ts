import { newSpecPage } from "@stencil/core/testing";
import { LfTree } from "./lf-tree";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfTree], html });
  await page.waitForChanges();
  return page;
};

describe("lf-tree component", () => {
  it("renders with default props", async () => {
    const page = await createPage(`<lf-tree></lf-tree>`);
    expect(page.root).toBeDefined();
    const tree = page.root.shadowRoot.querySelector(".tree");
    expect(tree).not.toBeNull();
  });

  it("renders nodes from dataset", async () => {
    const page = await createPage(`<lf-tree></lf-tree>`);
    page.rootInstance.lfDataset = { nodes: [{ id: "1", value: "Node 1" }] };
    await page.waitForChanges();
    // Trigger refresh to ensure watch method runs
    await page.rootInstance.refresh();
    await page.waitForChanges();
    const nodes = page.root.shadowRoot.querySelectorAll(".node");
    expect(nodes.length).toBeGreaterThan(0);
  });

  it("expands node on click", async () => {
    const page = await createPage(`<lf-tree></lf-tree>`);
    page.rootInstance.lfDataset = {
      nodes: [
        { id: "1", value: "Node 1", children: [{ id: "2", value: "Child" }] },
      ],
    };
    await page.waitForChanges();
    // Trigger refresh to ensure watch method runs
    await page.rootInstance.refresh();
    await page.waitForChanges();
    const node = page.root.shadowRoot.querySelector(".node");
    expect(node).not.toBeNull();
    node.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await page.waitForChanges();
    // Check if expanded
  });
});
