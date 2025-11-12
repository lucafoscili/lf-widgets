import { newSpecPage } from "@stencil/core/testing";
import { LfBadge } from "./lf-badge";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfBadge], html });
  await page.waitForChanges();
  return page;
};

describe("lf-badge component", () => {
  it("renders with default props", async () => {
    const page = await createPage(`<lf-badge></lf-badge>`);
    expect(page.root).toBeDefined();
    console.log("Shadow root HTML:", page.root.shadowRoot.innerHTML);
    expect(page.root.shadowRoot.children.length).toBeGreaterThan(0);
    const badge = page.root.shadowRoot.querySelector(`.badge`);
    expect(badge).not.toBeNull();
  });

  it("displays label when lfLabel is set", async () => {
    const page = await createPage(
      `<lf-badge lf-label="Test Label"></lf-badge>`,
    );
    const label = page.root.shadowRoot.querySelector(".badge__label");
    expect(label).not.toBeNull();
    expect(label.textContent).toBe("Test Label");
  });

  it("applies position class when lfPosition is set", async () => {
    const page = await createPage(
      `<lf-badge lf-position="top-left"></lf-badge>`,
    );
    const badge = page.root.shadowRoot.querySelector(".badge");
    expect(badge.classList.contains("badge--top-left")).toBe(true);
  });

  it("renders image when lfImageProps is set", async () => {
    const page = await createPage(
      `<lf-badge lf-image-props='{"lfValue": "test.png"}'></lf-badge>`,
    );
    const image = page.root.shadowRoot.querySelector("lf-image");
    expect(image).not.toBeNull();
  });
});
