import { newSpecPage } from "@stencil/core/testing";
import { LfCode } from "./lf-code";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfCode], html });
  await page.waitForChanges();
  return page;
};

describe("lf-code component", () => {
  it("renders with default props", async () => {
    const page = await createPage(`<lf-code></lf-code>`);
    expect(page.root).toBeDefined();
    const code = page.root.shadowRoot.querySelector(".code");
    expect(code).not.toBeNull();
  });

  it("displays code value", async () => {
    const page = await createPage(`<lf-code></lf-code>`);
    page.rootInstance.lfValue = "const test = 'hello';";
    await page.waitForChanges();
    const pre = page.root.shadowRoot.querySelector("pre");
    expect(pre).not.toBeNull();
    expect(pre.textContent.trim()).toBe("const test = 'hello';");
  });

  it("shows header with language", async () => {
    const page = await createPage(`<lf-code></lf-code>`);
    page.rootInstance.lfLanguage = "typescript";
    await page.waitForChanges();
    const header = page.root.shadowRoot.querySelector(".code__header");
    expect(header).not.toBeNull();
    const title = header.querySelector(".code__title");
    expect(title).not.toBeNull();
    expect(title.textContent.trim()).toBe("typescript");
  });

  it("hides header when lfShowHeader is false", async () => {
    const page = await createPage(`<lf-code></lf-code>`);
    page.rootInstance.lfShowHeader = false;
    await page.waitForChanges();
    const header = page.root.shadowRoot.querySelector(".code__header");
    expect(header).toBeNull();
  });

  it("shows copy button by default", async () => {
    const page = await createPage(`<lf-code></lf-code>`);
    const button = page.root.shadowRoot.querySelector("lf-button");
    expect(button).not.toBeNull();
  });

  it("hides copy button when lfShowCopy is false", async () => {
    const page = await createPage(`<lf-code></lf-code>`);
    page.rootInstance.lfShowCopy = false;
    await page.waitForChanges();
    const button = page.root.shadowRoot.querySelector("lf-button");
    expect(button).toBeNull();
  });

  it("applies language class", async () => {
    const page = await createPage(`<lf-code></lf-code>`);
    page.rootInstance.lfLanguage = "python";
    await page.waitForChanges();
    const pre = page.root.shadowRoot.querySelector("pre");
    expect(pre.classList.contains("language-python")).toBe(true);
  });

  it("applies ui size attribute", async () => {
    const page = await createPage(`<lf-code lf-ui-size="small"></lf-code>`);
    expect(page.root.getAttribute("lf-ui-size")).toBe("small");
  });
});
