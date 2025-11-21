import { LfDataDataset, LfTextfieldElement } from "@lf-widgets/foundations";
import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfChip } from "../lf-chip/lf-chip";
import { LfTextfield } from "../lf-textfield/lf-textfield";
import { LfMultiInput } from "./lf-multiinput";

const sampleDataset: LfDataDataset = {
  nodes: [
    { id: "1", value: "First" },
    { id: "2", value: "Second" },
    { id: "3", value: "Third" },
  ],
};

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfMultiInput, LfChip, LfTextfield],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("lf-multiinput", () => {
  it("should render", async () => {
    const page = await createPage(`<lf-multiinput></lf-multiinput>`);
    expect(page.root).toBeTruthy();
  });

  it("should initialize value from lfValue", async () => {
    const page = await createPage(
      `<lf-multiinput lf-value="initial"></lf-multiinput>`,
    );
    const component = page.rootInstance as LfMultiInput;
    expect(await component.getValue()).toBe("initial");
  });

  it("should set and get value programmatically", async () => {
    const page = await createPage(`<lf-multiinput></lf-multiinput>`);
    const component = page.rootInstance as LfMultiInput;

    await component.setValue("updated");
    expect(await component.getValue()).toBe("updated");
  });

  it("should respect max history and deduplicate entries", async () => {
    const page = await createPage(`<lf-multiinput></lf-multiinput>`);
    const component = page.rootInstance as LfMultiInput;
    component.lfMaxHistory = 2;
    await page.waitForChanges();

    await component.setHistory(["one", "two", "one", "three"]);
    expect(await component.getHistory()).toEqual(["one", "two"]);
  });

  it("should add to history and preserve order", async () => {
    const page = await createPage(`<lf-multiinput></lf-multiinput>`);
    const component = page.rootInstance as LfMultiInput;

    await component.addToHistory("alpha");
    await component.addToHistory("beta");

    expect(await component.getHistory()).toEqual(["beta", "alpha"]);
  });

  it("should emit input event while typing", async () => {
    const page = await createPage(`<lf-multiinput></lf-multiinput>`);
    const component = page.rootInstance as LfMultiInput;
    const spy = jest.fn();
    page.root.addEventListener("lf-multiinput-event", spy);

    const textfield = page.root.shadowRoot.querySelector("lf-textfield");
    textfield.dispatchEvent(
      new CustomEvent("lf-textfield-event", {
        detail: { eventType: "input", inputValue: "hello" },
      }),
    );
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          eventType: "input",
          value: "hello",
        }),
      }),
    );
    expect(await component.getValue()).toBe("hello");
  });

  it("should emit change event and update history on commit", async () => {
    const page = await createPage(`<lf-multiinput></lf-multiinput>`);
    const component = page.rootInstance as LfMultiInput;
    const spy = jest.fn();
    page.root.addEventListener("lf-multiinput-event", spy);

    const textfield =
      page.root.shadowRoot.querySelector("lf-textfield") as LfTextfieldElement;
    textfield.dispatchEvent(
      new CustomEvent("lf-textfield-event", {
        detail: {
          eventType: "keydown",
          inputValue: "committed",
          originalEvent: { key: "Enter" },
        },
      }),
    );
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          eventType: "change",
          value: "committed",
        }),
      }),
    );

    expect(await component.getHistory()).toEqual(["committed"]);
    expect(await component.getValue()).toBe("committed");
    expect(await textfield.getValue()).toBe("");
  });

  it("should emit select-history when a chip is clicked", async () => {
    const page = await createPage(`<lf-multiinput></lf-multiinput>`);
    const component = page.rootInstance as LfMultiInput;
    await component.setHistory(["chip-value"]);
    await page.waitForChanges();

    const spy = jest.fn();
    page.root.addEventListener("lf-multiinput-event", spy);
    const chip = page.root.shadowRoot.querySelector("lf-chip");
    const node = component.lfDataset.nodes[0];

    chip.dispatchEvent(
      new CustomEvent("lf-chip-event", {
        detail: { eventType: "click", node },
      }),
    );
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          eventType: "select-history",
          node,
          value: "chip-value",
        }),
      }),
    );
    expect(await component.getHistory()).toEqual(["chip-value"]);
  });

  it("should support tag selection via chips in tags mode", async () => {
    const page = await createPage(`<lf-multiinput></lf-multiinput>`);
    const component = page.rootInstance as LfMultiInput;
    component.lfMode = "tags";
    await component.setHistory(["tag1", "tag2"]);
    await page.waitForChanges();

    const chip = page.root.shadowRoot.querySelector("lf-chip");
    const [node1, node2] = component.lfDataset.nodes;

    chip.dispatchEvent(
      new CustomEvent("lf-chip-event", {
        detail: { eventType: "click", node: node1 },
      }),
    );
    await page.waitForChanges();
    expect(await component.getValue()).toBe("tag1");
    expect(await component.getHistory()).toEqual(["tag1", "tag2"]);

    chip.dispatchEvent(
      new CustomEvent("lf-chip-event", {
        detail: { eventType: "click", node: node2 },
      }),
    );
    await page.waitForChanges();
    expect(await component.getValue()).toBe("tag1, tag2");
    expect(await component.getHistory()).toEqual(["tag1", "tag2"]);

    chip.dispatchEvent(
      new CustomEvent("lf-chip-event", {
        detail: { eventType: "click", node: node1 },
      }),
    );
    await page.waitForChanges();
    expect(await component.getValue()).toBe("tag2");
    expect(await component.getHistory()).toEqual(["tag1", "tag2"]);
  });

  it("should emit clear-history when clearing", async () => {
    const page = await createPage(`<lf-multiinput></lf-multiinput>`);
    const component = page.rootInstance as LfMultiInput;
    await component.setHistory(["keep"]);
    await page.waitForChanges();

    const spy = jest.fn();
    page.root.addEventListener("lf-multiinput-event", spy);

    const textfield = page.root.shadowRoot.querySelector("lf-textfield");
    textfield.dispatchEvent(
      new CustomEvent("lf-textfield-event", {
        detail: {
          eventType: "click",
          iconType: "action",
          inputValue: "",
        },
      }),
    );
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          eventType: "clear-history",
        }),
      }),
    );
    expect(await component.getHistory()).toEqual([]);
  });

  it("should reject invalid commits when free input is disabled", async () => {
    const page = await createPage(`<lf-multiinput></lf-multiinput>`);
    const component = page.rootInstance as LfMultiInput;
    component.lfAllowFreeInput = false;
    component.lfDataset = sampleDataset;
    await page.waitForChanges();

    const textfield = page.root.shadowRoot.querySelector("lf-textfield");
    textfield.dispatchEvent(
      new CustomEvent("lf-textfield-event", {
        detail: {
          eventType: "keydown",
          inputValue: "unknown",
          originalEvent: { key: "Enter" },
        },
      }),
    );
    await page.waitForChanges();

    expect(await component.getValue()).toBe("");
    expect(await component.getHistory()).toEqual([
      "First",
      "Second",
      "Third",
    ]);
  });

  it("should parse comma-separated tags in tags mode", async () => {
    const page = await createPage(`<lf-multiinput></lf-multiinput>`);
    const component = page.rootInstance as LfMultiInput;
    component.lfMode = "tags";
    await page.waitForChanges();

    const textfield = page.root.shadowRoot.querySelector("lf-textfield");
    textfield.dispatchEvent(
      new CustomEvent("lf-textfield-event", {
        detail: {
          eventType: "keydown",
          inputValue: "tag1, tag2, tag1",
          originalEvent: { key: "Enter" },
        },
      }),
    );
    await page.waitForChanges();

    expect(await component.getValue()).toBe("tag1, tag2");
    expect(await component.getHistory()).toEqual(["tag1", "tag2"]);
  });

  it("should drop unknown tags when free input is disabled in tags mode", async () => {
    const page = await createPage(`<lf-multiinput></lf-multiinput>`);
    const component = page.rootInstance as LfMultiInput;
    component.lfMode = "tags";
    component.lfAllowFreeInput = false;
    component.lfDataset = sampleDataset;
    await page.waitForChanges();

    const textfield = page.root.shadowRoot.querySelector("lf-textfield");
    textfield.dispatchEvent(
      new CustomEvent("lf-textfield-event", {
        detail: {
          eventType: "keydown",
          inputValue: "First, Unknown",
          originalEvent: { key: "Enter" },
        },
      }),
    );
    await page.waitForChanges();

    expect(await component.getValue()).toBe("First");
    expect(await component.getHistory()).toEqual(["First", "Second", "Third"]);
  });

  it("should not emit input/change while disabled", async () => {
    const page = await createPage(`<lf-multiinput lf-ui-state="disabled"></lf-multiinput>`);
    const spy = jest.fn();
    page.root.addEventListener("lf-multiinput-event", spy);

    const textfield = page.root.shadowRoot.querySelector("lf-textfield");
    textfield.dispatchEvent(
      new CustomEvent("lf-textfield-event", {
        detail: { eventType: "input", inputValue: "try" },
      }),
    );
    await page.waitForChanges();

    expect(
      spy.mock.calls.find(
        (call) => call[0]?.detail?.eventType === "input",
      ),
    ).toBeUndefined();
  });
});
