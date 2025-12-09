import { newSpecPage } from "@stencil/core/testing";
import { LF_CODE_BLOCKS } from "@lf-widgets/foundations";
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
    const framework = getLfFramework();
    const headerClass = framework.theme.bemClass(LF_CODE_BLOCKS.code._);
    const code = page.root.shadowRoot.querySelector(`.${headerClass}`);
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

    const framework = getLfFramework();
    const { bemClass } = framework.theme;
    const blocks = LF_CODE_BLOCKS.code;

    const headerClass = bemClass(blocks.header._);
    const titleClass = bemClass(blocks.header._, blocks.header.title);

    const header = page.root.shadowRoot.querySelector(
      `.${headerClass}`,
    ) as HTMLElement | null;
    expect(header).not.toBeNull();

    const title = header!.querySelector(`.${titleClass}`) as HTMLElement | null;
    expect(title).not.toBeNull();
    expect(title!.textContent!.trim()).toBe("typescript");
  });

  it("hides header when lfShowHeader is false", async () => {
    const page = await createPage(`<lf-code></lf-code>`);
    page.rootInstance.lfShowHeader = false;
    await page.waitForChanges();

    const framework = getLfFramework();
    const { bemClass } = framework.theme;
    const blocks = LF_CODE_BLOCKS.code;
    const headerClass = bemClass(blocks.header._);

    const header = page.root.shadowRoot.querySelector(`.${headerClass}`);
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

  it("sets props programmatically", async () => {
    const page = await createPage(`<lf-code></lf-code>`);
    const component = page.rootInstance as LfCode;

    component.lfValue = "console.log('test');";
    component.lfLanguage = "javascript";
    component.lfShowHeader = true;
    component.lfShowCopy = true;
    component.lfStyle = "border: 1px solid black;";
    await page.waitForChanges();

    const props = await component.getProps();
    expect(props.lfValue).toBe("console.log('test');");
    expect(props.lfLanguage).toBe("javascript");
    expect(props.lfShowHeader).toBe(true);
    expect(props.lfShowCopy).toBe(true);
    expect(props.lfStyle).toBe("border: 1px solid black;");
  });

  it("calls getDebugInfo method", async () => {
    const page = await createPage(`<lf-code></lf-code>`);
    const component = page.rootInstance as LfCode;
    const debugInfo = await component.getDebugInfo();
    expect(debugInfo).toBeDefined();
  });

  it("calls refresh method", async () => {
    const page = await createPage(`<lf-code></lf-code>`);
    const component = page.rootInstance as LfCode;
    await component.refresh();
    expect(page.root).toBeTruthy();
  });

  it("handles empty value", async () => {
    const page = await createPage(`<lf-code></lf-code>`);
    page.rootInstance.lfValue = "";
    await page.waitForChanges();
    const pre = page.root.shadowRoot.querySelector("pre");
    expect(pre).not.toBeNull();
    expect(pre.textContent.trim()).toBe("");
  });

  it("renders with custom theme", async () => {
    const page = await createPage(
      `<lf-code lf-ui-state="secondary"></lf-code>`,
    );
    expect(page.root.getAttribute("lf-ui-state")).toBe("secondary");
  });
});
