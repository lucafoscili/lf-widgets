import { newSpecPage } from "@stencil/core/testing";
import { LfChip } from "./lf-chip";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfChip], html });
  await page.waitForChanges();
  return page;
};

describe("lf-chip component", () => {
  it("renders with default props", async () => {
    const page = await createPage(`<lf-chip></lf-chip>`);
    expect(page.root).toBeDefined();
    const chip = page.root.shadowRoot.querySelector(".chip");
    expect(chip).not.toBeNull();
  });

  it("renders chips from dataset", async () => {
    const page = await createPage(`<lf-chip></lf-chip>`);
    page.rootInstance.lfDataset = { nodes: [{ id: "1", value: "Item 1" }] };
    await page.waitForChanges();
    const chips = page.root.shadowRoot.querySelectorAll(".item");
    expect(chips.length).toBe(1);
    expect(chips[0].textContent.trim()).toContain("Item 1");
  });

  it("selects chip on click", async () => {
    const page = await createPage(`<lf-chip></lf-chip>`);
    page.rootInstance.lfDataset = { nodes: [{ id: "1", value: "Item 1" }] };
    await page.waitForChanges();
    const chip = page.root.shadowRoot.querySelector(".item");
    expect(chip).not.toBeNull();
    chip.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await page.waitForChanges();
    expect(chip.classList.contains("item--selected")).toBe(true);
  });

  it("emits lf-chip-event on selection", async () => {
    const page = await createPage(`<lf-chip></lf-chip>`);
    page.rootInstance.lfDataset = { nodes: [{ id: "1", value: "Item 1" }] };
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
});
