import { newSpecPage } from "@stencil/core/testing";
import { LfRadio } from "./lf-radio";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfRadio], html });
  await page.waitForChanges();
  return page;
};

// Test dataset
const testDataset = {
  nodes: [
    { id: "option1", value: "Option 1" },
    { id: "option2", value: "Option 2" },
    { id: "option3", value: "Option 3" },
  ],
};

describe("lf-radio component", () => {
  it("renders radio group with dataset", async () => {
    const page = await createPage(`<lf-radio></lf-radio>`);
    page.rootInstance.lfDataset = testDataset;
    // Trigger refresh to ensure watch method runs
    await page.rootInstance.refresh();
    await page.waitForChanges();
    console.log("Shadow root HTML:", page.root.shadowRoot.innerHTML);
    const radioGroup = page.root.shadowRoot.querySelector(".radio");
    expect(radioGroup).not.toBeNull();
  });

  it("renders correct number of radio items", async () => {
    const page = await createPage(`<lf-radio></lf-radio>`);
    page.rootInstance.lfDataset = testDataset;
    await page.waitForChanges();
    // Trigger refresh to ensure watch method runs
    await page.rootInstance.refresh();
    await page.waitForChanges();
    const radioItems = page.root.shadowRoot.querySelectorAll(".item");
    expect(radioItems.length).toBe(3);
  });

  it("initializes with no selection by default", async () => {
    const page = await createPage(`<lf-radio></lf-radio>`);
    page.rootInstance.lfDataset = testDataset;
    await page.waitForChanges();
    // Trigger refresh to ensure watch method runs
    await page.rootInstance.refresh();
    await page.waitForChanges();
    const selectedNode = await page.root.getSelectedNode();
    expect(selectedNode).toBeUndefined();
  });

  it("initializes with selected item when lfValue is set", async () => {
    const page = await createPage(`<lf-radio></lf-radio>`);
    page.rootInstance.lfDataset = testDataset;
    page.rootInstance.value = "option2"; // Set the internal state directly
    await page.waitForChanges();
    // Trigger refresh to ensure watch method runs
    await page.rootInstance.refresh();
    await page.waitForChanges();
    const selectedNode = await page.root.getSelectedNode();
    expect(selectedNode?.id).toBe("option2");
    expect(selectedNode?.value).toBe("Option 2");
  });

  it("selects item on click", async () => {
    const page = await createPage(`<lf-radio></lf-radio>`);
    page.rootInstance.lfDataset = testDataset;
    await page.waitForChanges();
    // Trigger refresh to ensure watch method runs
    await page.rootInstance.refresh();
    await page.waitForChanges();
    await page.root.selectItem("option1");
    await page.waitForChanges();

    const selectedNode = await page.root.getSelectedNode();
    expect(selectedNode?.id).toBe("option1");
  });

  it("changes selection when clicking different item", async () => {
    const page = await createPage(`<lf-radio></lf-radio>`);
    page.rootInstance.lfDataset = testDataset;
    await page.waitForChanges();
    // Trigger refresh to ensure watch method runs
    await page.rootInstance.refresh();
    await page.waitForChanges();
    // Click first item
    const firstItem = page.root.shadowRoot.querySelectorAll(".item")[0];
    firstItem.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await page.waitForChanges();

    let selectedNode = await page.root.getSelectedNode();
    expect(selectedNode?.id).toBe("option1");

    // Click second item
    const secondItem = page.root.shadowRoot.querySelectorAll(".item")[1];
    secondItem.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await page.waitForChanges();

    selectedNode = await page.root.getSelectedNode();
    expect(selectedNode?.id).toBe("option2");
  });

  it("emits click event on item click", async () => {
    const page = await createPage(`<lf-radio></lf-radio>`);
    page.rootInstance.lfDataset = testDataset;
    await page.waitForChanges();
    // Trigger refresh to ensure watch method runs
    await page.rootInstance.refresh();
    await page.waitForChanges();
    const events: any[] = [];
    page.root.addEventListener("lf-radio-event", (e: CustomEvent) => {
      events.push(e.detail);
    });

    const firstItem = page.root.shadowRoot.querySelector(".item");
    firstItem!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await page.waitForChanges();

    expect(events.length).toBe(1); // click event
    const clickEvents = events.filter((e) => e.eventType === "click");
    expect(clickEvents.length).toBe(1);
    expect(clickEvents[0].eventType).toBe("click");
    expect(clickEvents[0].value).toBe("option1");
    expect(clickEvents[0].previousValue).toBe(null);
  });

  it("emits item-click event on click", async () => {
    const page = await createPage(`<lf-radio></lf-radio>`);
    page.rootInstance.lfDataset = testDataset;
    await page.waitForChanges();
    // Trigger refresh to ensure watch method runs
    await page.rootInstance.refresh();
    await page.waitForChanges();
    const events: any[] = [];
    page.root.addEventListener("lf-radio-event", (e: CustomEvent) => {
      events.push(e.detail);
    });

    const firstItem = page.root.shadowRoot.querySelector(".item");
    firstItem!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await page.waitForChanges();

    const clickEvents = events.filter((e) => e.eventType === "click");
    expect(clickEvents.length).toBe(1);
    expect(clickEvents[0].node?.id).toBe("option1");
  });

  it("supports horizontal orientation", async () => {
    const page = await createPage(
      `<lf-radio lf-orientation="horizontal"></lf-radio>`,
    );
    page.rootInstance.lfDataset = testDataset;
    await page.waitForChanges();
    const radioGroup = page.root.shadowRoot.querySelector(".radio");
    expect(radioGroup).toHaveClass("radio--horizontal");
  });

  it("supports vertical orientation by default", async () => {
    const page = await createPage(`<lf-radio></lf-radio>`);
    page.rootInstance.lfDataset = testDataset;
    await page.waitForChanges();
    // Trigger refresh to ensure watch method runs
    await page.rootInstance.refresh();
    await page.waitForChanges();
    const radioGroup = page.root.shadowRoot.querySelector(".radio");
    expect(radioGroup).not.toHaveClass("horizontal");
  });

  it("supports leading labels", async () => {
    const page = await createPage(`<lf-radio lf-leading-label></lf-radio>`);
    page.rootInstance.lfDataset = testDataset;
    await page.waitForChanges();
    const firstItem = page.root.shadowRoot.querySelector(".item");
    expect(firstItem).toHaveClass("item--leading");
  });

  it("programmatically selects item via selectItem method", async () => {
    const page = await createPage(`<lf-radio></lf-radio>`);
    page.rootInstance.lfDataset = testDataset;
    await page.waitForChanges();
    // Trigger refresh to ensure watch method runs
    await page.rootInstance.refresh();
    await page.waitForChanges();

    await page.root.selectItem("option3");
    await page.waitForChanges();

    const selectedNode = await page.root.getSelectedNode();
    expect(selectedNode?.id).toBe("option3");
  });

  it("clears selection via clearSelection method", async () => {
    const page = await createPage(`<lf-radio></lf-radio>`);
    page.rootInstance.lfDataset = testDataset;
    await page.root.selectItem("option1");
    await page.waitForChanges();

    let selectedNode = await page.root.getSelectedNode();
    expect(selectedNode?.id).toBe("option1");

    await page.root.clearSelection();
    await page.waitForChanges();

    selectedNode = await page.root.getSelectedNode();
    expect(selectedNode).toBeUndefined();
  });

  it("supports keyboard navigation with arrow keys", async () => {
    const page = await createPage(`<lf-radio></lf-radio>`);
    page.rootInstance.lfDataset = testDataset;
    await page.waitForChanges();
    // Trigger refresh to ensure watch method runs
    await page.rootInstance.refresh();
    await page.waitForChanges();

    // Select first item
    await page.root.selectItem("option1");
    await page.waitForChanges();

    // Focus the component
    page.root.focus();

    // Press arrow down on the group
    const radioGroup = page.root.shadowRoot.querySelector(".radio");
    radioGroup.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    await page.waitForChanges();

    const selectedNode = await page.root.getSelectedNode();
    expect(selectedNode?.id).toBe("option2");
  });
});
