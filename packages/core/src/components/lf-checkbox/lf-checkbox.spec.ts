import { newSpecPage } from "@stencil/core/testing";
import { LfCheckbox } from "./lf-checkbox";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfCheckbox], html });
  await page.waitForChanges();
  return page;
};

describe("lf-checkbox component", () => {
  it("initializes with off state by default", async () => {
    const page = await createPage(`<lf-checkbox></lf-checkbox>`);
    expect(await page.root.getValue()).toBe("off");
  });

  it("initializes with on state when lfValue is true", async () => {
    const page = await createPage(
      `<lf-checkbox lf-value="true"></lf-checkbox>`,
    );
    expect(await page.root.getValue()).toBe("on");
  });

  it("initializes with indeterminate state when setValue is called", async () => {
    const page = await createPage(`<lf-checkbox></lf-checkbox>`);
    await page.root.setValue("indeterminate");
    await page.waitForChanges();
    expect(await page.root.getValue()).toBe("indeterminate");
  });

  it("toggles from off to on on click", async () => {
    const page = await createPage(`<lf-checkbox></lf-checkbox>`);
    expect(await page.root.getValue()).toBe("off");
    const checkbox = page.root.shadowRoot.querySelector("div[data-cy='input']");
    expect(checkbox).not.toBeNull();
    checkbox!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await page.waitForChanges();
    expect(await page.root.getValue()).toBe("on");
  });

  it("toggles from on to off on click", async () => {
    const page = await createPage(
      `<lf-checkbox lf-value="true"></lf-checkbox>`,
    );
    expect(await page.root.getValue()).toBe("on");
    const checkbox = page.root.shadowRoot.querySelector("div[data-cy='input']");
    expect(checkbox).not.toBeNull();
    checkbox!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await page.waitForChanges();
    expect(await page.root.getValue()).toBe("off");
  });

  it("toggles from indeterminate to on on click", async () => {
    const page = await createPage(`<lf-checkbox></lf-checkbox>`);
    await page.root.setValue("indeterminate");
    await page.waitForChanges();
    expect(await page.root.getValue()).toBe("indeterminate");
    const checkbox = page.root.shadowRoot.querySelector("div[data-cy='input']");
    expect(checkbox).not.toBeNull();
    checkbox!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await page.waitForChanges();
    expect(await page.root.getValue()).toBe("on");
  });

  it("does not toggle when disabled", async () => {
    const page = await createPage(
      `<lf-checkbox lf-ui-state="disabled"></lf-checkbox>`,
    );
    expect(await page.root.getValue()).toBe("off");
    const checkbox = page.root.shadowRoot.querySelector("div[data-cy='input']");
    expect(checkbox).not.toBeNull();
    checkbox!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await page.waitForChanges();
    expect(await page.root.getValue()).toBe("off");
  });

  it("emits lf-checkbox-event with eventType change on click", async () => {
    const page = await createPage(`<lf-checkbox></lf-checkbox>`);
    const events: any[] = [];
    page.root.addEventListener("lf-checkbox-event", (e: CustomEvent) => {
      events.push(e.detail);
    });
    const checkbox = page.root.shadowRoot.querySelector("div[data-cy='input']");
    expect(checkbox).not.toBeNull();
    checkbox!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await page.waitForChanges();
    expect(events.length).toBeGreaterThan(0);
    const changeEvent = events.find((e) => e.eventType === "change");
    expect(changeEvent).toBeTruthy();
    expect(changeEvent.value).toBe("on");
    expect(changeEvent.valueAsBoolean).toBe(true);
    expect(changeEvent.isIndeterminate).toBe(false);
  });

  it("emits lf-checkbox-event with eventType pointerdown on pointerdown", async () => {
    const page = await createPage(`<lf-checkbox></lf-checkbox>`);
    const events: any[] = [];
    page.root.addEventListener("lf-checkbox-event", (e: CustomEvent) => {
      events.push(e.detail);
    });
    const checkbox = page.root.shadowRoot.querySelector("div[data-cy='input']");
    expect(checkbox).not.toBeNull();
    checkbox!.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    await page.waitForChanges();
    expect(events.length).toBeGreaterThan(0);
    const pointerdownEvent = events.find((e) => e.eventType === "pointerdown");
    expect(pointerdownEvent).toBeTruthy();
  });

  it("renders label when lfLabel is set", async () => {
    const page = await createPage(
      `<lf-checkbox lf-label="Test Label"></lf-checkbox>`,
    );
    const label = page.root.shadowRoot.querySelector("label");
    expect(label).not.toBeNull();
    expect(label!.textContent).toBe("Test Label");
  });

  it("does not render label when lfLabel is empty", async () => {
    const page = await createPage(`<lf-checkbox></lf-checkbox>`);
    const label = page.root.shadowRoot.querySelector("label");
    expect(label).toBeNull();
  });

  it("applies leading class when lfLeadingLabel is true", async () => {
    const page = await createPage(
      `<lf-checkbox lf-label="Test"></lf-checkbox>`,
    );
    page.root.lfLeadingLabel = true;
    await page.waitForChanges();
    const formField = page.root.shadowRoot.querySelector("div[data-lf]");
    expect(formField).not.toBeNull();
    expect(formField!.classList.contains("form-field--leading")).toBe(true);
  });

  it("setValue method sets state correctly", async () => {
    const page = await createPage(`<lf-checkbox></lf-checkbox>`);
    await page.root.setValue(true);
    await page.waitForChanges();
    expect(await page.root.getValue()).toBe("on");
    await page.root.setValue(false);
    await page.waitForChanges();
    expect(await page.root.getValue()).toBe("off");
    await page.root.setValue("indeterminate");
    await page.waitForChanges();
    expect(await page.root.getValue()).toBe("indeterminate");
  });

  it("getProps returns component properties", async () => {
    const page = await createPage(
      `<lf-checkbox lf-label="Test"></lf-checkbox>`,
    );
    const props = await page.root.getProps();
    expect(props.lfLabel).toBe("Test");
    expect(props.lfUiSize).toBe("medium");
  });
});
