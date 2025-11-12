import { newSpecPage } from "@stencil/core/testing";
import { LfToggle } from "./lf-toggle";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfToggle], html });
  await page.waitForChanges();
  return page;
};

describe("lf-toggle component", () => {
  it("renders with default props", async () => {
    const page = await createPage(`<lf-toggle></lf-toggle>`);
    expect(page.root).toBeDefined();
    const toggle = page.root.shadowRoot.querySelector(".toggle");
    expect(toggle).not.toBeNull();
  });

  it("displays label when lfLabel is set", async () => {
    const page = await createPage(
      `<lf-toggle lf-label="Test Label"></lf-toggle>`,
    );
    const label = page.root.shadowRoot.querySelector(".form-field__label");
    expect(label).not.toBeNull();
    expect(label.textContent.trim()).toBe("Test Label");
  });

  it("toggles value on click", async () => {
    const page = await createPage(`<lf-toggle></lf-toggle>`);
    expect(await page.root.getValue()).toBe("off");
    const toggle = page.root.shadowRoot.querySelector(
      "input.toggle__native-control",
    );
    expect(toggle).not.toBeNull();
    // Simulate checkbox change by setting checked and dispatching change event
    (toggle as HTMLInputElement).checked = true;
    toggle.dispatchEvent(new Event("change", { bubbles: true }));
    await page.waitForChanges();
    expect(await page.root.getValue()).toBe("on");
  });

  it("emits lf-toggle-event on click", async () => {
    const page = await createPage(`<lf-toggle></lf-toggle>`);
    const spy = jest.fn();
    page.root.addEventListener("lf-toggle-event", spy);
    const toggle = page.root.shadowRoot.querySelector(
      "input.toggle__native-control",
    );
    // Simulate checkbox change by setting checked and dispatching change event
    (toggle as HTMLInputElement).checked = true;
    toggle.dispatchEvent(new Event("change", { bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({ eventType: "change" }),
      }),
    );
  });
});
