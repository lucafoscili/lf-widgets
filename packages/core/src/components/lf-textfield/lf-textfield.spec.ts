import { newSpecPage } from "@stencil/core/testing";
import { LfTextfield } from "./lf-textfield";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfTextfield], html });
  await page.waitForChanges();
  return page;
};

describe("lf-textfield component", () => {
  it("renders with default props", async () => {
    const page = await createPage(`<lf-textfield></lf-textfield>`);
    expect(page.root).toBeDefined();
    const textfield = page.root.shadowRoot.querySelector(".textfield");
    expect(textfield).not.toBeNull();
  });

  it("displays label when lfLabel is set", async () => {
    const page = await createPage(
      `<lf-textfield lf-label="Test Label"></lf-textfield>`,
    );
    const label = page.root.shadowRoot.querySelector(".textfield__label");
    expect(label).not.toBeNull();
    expect(label.textContent).toBe("Test Label");
  });

  it("displays icon when lfIcon is set", async () => {
    const page = await createPage(
      `<lf-textfield lf-icon="search"></lf-textfield>`,
    );
    const icon = page.root.shadowRoot.querySelector(".textfield__icon");
    expect(icon).not.toBeNull();
  });

  it("applies trailing icon class when lfTrailingIcon is true", async () => {
    const page = await createPage(
      `<lf-textfield lf-icon="search" lf-trailing-icon="true"></lf-textfield>`,
    );
    const icon = page.root.shadowRoot.querySelector(".textfield__icon");
    expect(icon.classList.contains("textfield__icon--trailing")).toBe(true);
  });

  it("displays trailing icon action when lfTrailingIconAction is set", async () => {
    const page = await createPage(`<lf-textfield></lf-textfield>`);
    page.root.lfTrailingIconAction = "--lf-icon-search";
    await page.waitForChanges();
    const iconAction = page.root.shadowRoot.querySelector(
      ".textfield__icon-action",
    );
    expect(iconAction).not.toBeNull();
    // Verify it's an LfIcon by checking for SVG use element
    const svg = iconAction.querySelector("svg");
    expect(svg).not.toBeNull();
    const use = svg.querySelector("use");
    expect(use).not.toBeNull();
  });

  it("emits click event with iconType 'action' when trailing icon action is clicked", async () => {
    const page = await createPage(`<lf-textfield></lf-textfield>`);
    page.root.lfTrailingIconAction = "--lf-icon-search";
    await page.waitForChanges();
    const spy = jest.fn();
    page.root.addEventListener("lf-textfield-event", spy);
    const iconAction = page.root.shadowRoot.querySelector(
      ".textfield__icon-action",
    );
    iconAction.dispatchEvent(new Event("click", { bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          eventType: "click",
          iconType: "action",
        }),
      }),
    );
  });

  it("emits click event with iconType 'regular' when regular icon is clicked", async () => {
    const page = await createPage(
      `<lf-textfield lf-icon="search"></lf-textfield>`,
    );
    const spy = jest.fn();
    page.root.addEventListener("lf-textfield-event", spy);
    const icon = page.root.shadowRoot.querySelector(".textfield__icon");
    icon.dispatchEvent(new Event("click", { bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          eventType: "click",
          iconType: "regular",
        }),
      }),
    );
  });

  it("does not display trailing icon action when lfTrailingIconAction is null", async () => {
    const page = await createPage(`<lf-textfield></lf-textfield>`);
    const iconAction = page.root.shadowRoot.querySelector(
      '[part="icon-action"]',
    );
    expect(iconAction).toBeNull();
  });

  it("sets initial value when lfValue is provided", async () => {
    const page = await createPage(
      `<lf-textfield lf-value="initial value"></lf-textfield>`,
    );
    expect(await page.root.getValue()).toBe("initial value");
  });

  it("reflects stretch classes when lfStretchX and lfStretchY are set", async () => {
    const page = await createPage(
      `<lf-textfield lf-stretch-x="true" lf-stretch-y="true"></lf-textfield>`,
    );
    expect(page.root.hasAttribute("lf-stretch-x")).toBe(true);
    expect(page.root.hasAttribute("lf-stretch-y")).toBe(true);
  });

  it("applies outlined styling when lfStyling is outlined", async () => {
    const page = await createPage(
      `<lf-textfield lf-styling="outlined"></lf-textfield>`,
    );
    const textfield = page.root.shadowRoot.querySelector(".textfield");
    expect(textfield.classList.contains("textfield--outlined")).toBe(true);
  });

  it("applies textarea styling when lfStyling is textarea", async () => {
    const page = await createPage(
      `<lf-textfield lf-styling="textarea"></lf-textfield>`,
    );
    const textarea = page.root.shadowRoot.querySelector("textarea");
    expect(textarea).not.toBeNull();
  });

  it("emits lf-textfield-event on focus", async () => {
    const page = await createPage(`<lf-textfield></lf-textfield>`);
    const spy = jest.fn();
    page.root.addEventListener("lf-textfield-event", spy);
    const input = page.root.shadowRoot.querySelector("input");
    input.dispatchEvent(new Event("focus", { bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({ eventType: "focus" }),
      }),
    );
  });

  it("emits lf-textfield-event on blur", async () => {
    const page = await createPage(`<lf-textfield></lf-textfield>`);
    const spy = jest.fn();
    page.root.addEventListener("lf-textfield-event", spy);
    const input = page.root.shadowRoot.querySelector("input");
    input.dispatchEvent(new Event("blur", { bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({ eventType: "blur" }),
      }),
    );
  });

  it("emits lf-textfield-event on input change", async () => {
    const page = await createPage(`<lf-textfield></lf-textfield>`);
    const spy = jest.fn();
    page.root.addEventListener("lf-textfield-event", spy);
    const input = page.root.shadowRoot.querySelector("input");
    input.value = "test input";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({ eventType: "input" }),
      }),
    );
  });

  it("updates value when setValue is called", async () => {
    const page = await createPage(`<lf-textfield></lf-textfield>`);
    await page.root.setValue("new value");
    expect(await page.root.getValue()).toBe("new value");
  });

  it("returns input element when getElement is called", async () => {
    const page = await createPage(`<lf-textfield></lf-textfield>`);
    const element = await page.root.getElement();
    expect(element).toBeInstanceOf(HTMLInputElement);
  });

  it("focuses input when setFocus is called", async () => {
    const page = await createPage(`<lf-textfield></lf-textfield>`);
    const input = page.root.shadowRoot.querySelector("input");
    const focusSpy = jest.fn();
    input.addEventListener("focus", focusSpy);
    await page.root.setFocus();
    expect(focusSpy).toHaveBeenCalled();
  });

  it("blurs input when setBlur is called", async () => {
    const page = await createPage(`<lf-textfield></lf-textfield>`);
    const input = page.root.shadowRoot.querySelector("input");
    const blurSpy = jest.fn();
    input.addEventListener("blur", blurSpy);
    await page.root.setBlur();
    expect(blurSpy).toHaveBeenCalled();
  });

  it("returns props object when getProps is called", async () => {
    const page = await createPage(
      `<lf-textfield lf-label="test"></lf-textfield>`,
    );
    const props = await page.root.getProps();
    expect(props).toHaveProperty("lfLabel", "test");
    expect(props).toHaveProperty("lfValue", "");
  });

  it("returns debug info when getDebugInfo is called", async () => {
    const page = await createPage(`<lf-textfield></lf-textfield>`);
    const debugInfo = await page.root.getDebugInfo();
    expect(debugInfo).toHaveProperty("renderCount");
    expect(debugInfo).toHaveProperty("renderStart");
    expect(debugInfo).toHaveProperty("renderEnd");
  });

  describe("Keydown Events", () => {
    it("emits lf-textfield-event with keydown eventType and key information", async () => {
      const page = await createPage(`<lf-textfield></lf-textfield>`);
      const spy = jest.fn();
      page.root.addEventListener("lf-textfield-event", spy);

      const input = page.root.shadowRoot.querySelector("input");
      const keydownEvent = new KeyboardEvent("keydown", {
        key: "ArrowDown",
        code: "ArrowDown",
        keyCode: 40,
        bubbles: true,
      });

      input.dispatchEvent(keydownEvent);
      await page.waitForChanges();

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            eventType: "keydown",
            originalEvent: expect.objectContaining({
              key: "ArrowDown",
              code: "ArrowDown",
              keyCode: 40,
            }),
          }),
        }),
      );
    });

    it("emits keydown event for Enter key with correct payload", async () => {
      const page = await createPage(`<lf-textfield></lf-textfield>`);
      const spy = jest.fn();
      page.root.addEventListener("lf-textfield-event", spy);

      const input = page.root.shadowRoot.querySelector("input");
      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        bubbles: true,
      });

      input.dispatchEvent(enterEvent);
      await page.waitForChanges();

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            eventType: "keydown",
            originalEvent: expect.objectContaining({
              key: "Enter",
              code: "Enter",
              keyCode: 13,
            }),
          }),
        }),
      );
    });

    it("emits keydown event for Escape key with correct payload", async () => {
      const page = await createPage(`<lf-textfield></lf-textfield>`);
      const spy = jest.fn();
      page.root.addEventListener("lf-textfield-event", spy);

      const input = page.root.shadowRoot.querySelector("input");
      const escapeEvent = new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        bubbles: true,
      });

      input.dispatchEvent(escapeEvent);
      await page.waitForChanges();

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            eventType: "keydown",
            originalEvent: expect.objectContaining({
              key: "Escape",
              code: "Escape",
              keyCode: 27,
            }),
          }),
        }),
      );
    });

    it("emits keydown event for alphanumeric keys", async () => {
      const page = await createPage(`<lf-textfield></lf-textfield>`);
      const spy = jest.fn();
      page.root.addEventListener("lf-textfield-event", spy);

      const input = page.root.shadowRoot.querySelector("input");
      const keyEvent = new KeyboardEvent("keydown", {
        key: "a",
        code: "KeyA",
        keyCode: 65,
        bubbles: true,
      });

      input.dispatchEvent(keyEvent);
      await page.waitForChanges();

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            eventType: "keydown",
            originalEvent: expect.objectContaining({
              key: "a",
              code: "KeyA",
              keyCode: 65,
            }),
          }),
        }),
      );
    });
  });
});
