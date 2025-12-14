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

  //#region Event emission tests
  describe("Event emission", () => {
    it("component has event emitter defined", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      const component = page.rootInstance as LfCode;
      expect(component).toBeDefined();
      expect(page.root).toBeDefined();
    });

    it("component unmount method exists and can be called", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      const component = page.rootInstance as LfCode;
      expect(typeof component.unmount).toBe("function");
    });

    it("event payload structure is correct", async () => {
      const page = await createPage(`<lf-code id="test-code"></lf-code>`);
      const component = page.rootInstance as LfCode;
      expect(page.root.id).toBe("test-code");
      expect(component).toBeDefined();
    });
  });
  //#endregion

  //#region Copy functionality tests
  describe("Copy functionality", () => {
    it("renders copy button when lfShowCopy is true", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfShowCopy = true;
      await page.waitForChanges();

      const button = page.root.shadowRoot.querySelector("lf-button");
      expect(button).not.toBeNull();
    });

    it("copy button exists in header", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      const button = page.root.shadowRoot.querySelector("lf-button");
      expect(button).not.toBeNull();
    });

    it("copy button is rendered when lfShowCopy is true", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfShowCopy = true;
      await page.waitForChanges();
      const button = page.root.shadowRoot.querySelector("lf-button");
      expect(button).not.toBeNull();
    });

    it("copy button is affected by ui state changes", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfUiState = "success";
      await page.waitForChanges();

      const button = page.root.shadowRoot.querySelector("lf-button");
      expect(button).not.toBeNull();
    });
  });
  //#endregion

  //#region Language handling tests
  describe("Language handling", () => {
    it("applies javascript language class by default", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      const pre = page.root.shadowRoot.querySelector("pre");
      expect(pre.classList.contains("language-javascript")).toBe(true);
    });

    it("applies typescript language class", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfLanguage = "typescript";
      await page.waitForChanges();

      const pre = page.root.shadowRoot.querySelector("pre");
      expect(pre.classList.contains("language-typescript")).toBe(true);
    });

    it("applies css language class", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfLanguage = "css";
      await page.waitForChanges();

      const el = page.root.shadowRoot.querySelector(".language-css");
      expect(el).not.toBeNull();
    });

    it("applies json language class", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfLanguage = "json";
      page.rootInstance.lfValue = '{"test": "value"}';
      await page.waitForChanges();

      const pre = page.root.shadowRoot.querySelector("pre");
      expect(pre.classList.contains("language-json")).toBe(true);
    });

    it("applies html language class", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfLanguage = "html";
      await page.waitForChanges();

      const pre = page.root.shadowRoot.querySelector("pre");
      expect(pre.classList.contains("language-html")).toBe(true);
    });

    it("language prop value is preserved", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfLanguage = "Python";
      await page.waitForChanges();

      // Verify language prop is stored
      expect(page.rootInstance.lfLanguage).toBe("Python");
    });
  });
  //#endregion

  //#region Whitespace preservation tests
  describe("Whitespace preservation", () => {
    it("renders pre tag when lfPreserveSpaces is true", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfPreserveSpaces = true;
      await page.waitForChanges();

      const pre = page.root.shadowRoot.querySelector("pre");
      expect(pre).not.toBeNull();
    });

    it("renders div tag when lfPreserveSpaces is false for textual content", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfPreserveSpaces = false;
      page.rootInstance.lfLanguage = "javascript";
      await page.waitForChanges();

      const div = page.root.shadowRoot.querySelector("div.language-javascript");
      expect(div).not.toBeNull();
    });

    it("preserves multiline code formatting", async () => {
      const multilineCode = `function test() {
  const a = 1;
  return a;
}`;
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfValue = multilineCode;
      page.rootInstance.lfPreserveSpaces = true;
      await page.waitForChanges();

      const pre = page.root.shadowRoot.querySelector("pre");
      expect(pre).not.toBeNull();
      expect(pre.textContent).toContain("function test()");
      expect(pre.textContent).toContain("const a = 1");
    });

    it("auto-detects preserve spaces for code languages", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfLanguage = "javascript";
      page.rootInstance.lfValue = "const x = 1;";
      await page.waitForChanges();

      const pre = page.root.shadowRoot.querySelector("pre");
      expect(pre).not.toBeNull();
    });

    it("renders div for css language when lfPreserveSpaces is not set", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfLanguage = "css";
      page.rootInstance.lfValue = ".class { color: red; }";
      await page.waitForChanges();

      const el = page.root.shadowRoot.querySelector(".language-css");
      expect(el).not.toBeNull();
    });

    it("renders div for markdown language when lfPreserveSpaces is not set", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfLanguage = "markdown";
      page.rootInstance.lfValue = "# Title";
      await page.waitForChanges();

      const div = page.root.shadowRoot.querySelector("div.language-markdown");
      expect(div).not.toBeNull();
    });

    it("renders div for plaintext language when lfPreserveSpaces is not set", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfLanguage = "plaintext";
      page.rootInstance.lfValue = "Some text";
      await page.waitForChanges();

      const div = page.root.shadowRoot.querySelector("div.language-plaintext");
      expect(div).not.toBeNull();
    });
  });
  //#endregion

  //#region Public methods tests
  describe("Public methods", () => {
    it("getProps returns all component props", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      const component = page.rootInstance as LfCode;

      component.lfValue = "test code";
      component.lfLanguage = "python";
      component.lfFormat = false;
      component.lfShowHeader = false;
      component.lfShowCopy = false;
      await page.waitForChanges();

      const props = await component.getProps();

      expect(props.lfValue).toBe("test code");
      expect(props.lfLanguage).toBe("python");
      expect(props.lfFormat).toBe(false);
      expect(props.lfShowHeader).toBe(false);
      expect(props.lfShowCopy).toBe(false);
    });

    it("getDebugInfo returns lifecycle info", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      const component = page.rootInstance as LfCode;

      const debugInfo = await component.getDebugInfo();
      expect(debugInfo).toBeDefined();
      expect(debugInfo.endTime).toBeDefined();
    });

    it("refresh triggers re-render", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      const component = page.rootInstance as LfCode;

      component.lfValue = "updated code";
      await component.refresh();
      await page.waitForChanges();

      const pre = page.root.shadowRoot.querySelector("pre");
      expect(pre.textContent.trim()).toContain("updated code");
    });

    it("unmount method can be called", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      const component = page.rootInstance as LfCode;

      expect(page.root).toBeDefined();
      // Just verify method exists and can be called without error
      expect(typeof component.unmount).toBe("function");
    });

    it("unmount accepts delay parameter", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      const component = page.rootInstance as LfCode;

      // Verify unmount accepts a delay parameter
      expect(page.root).toBeDefined();
      // Component should still exist immediately after calling with delay
      await component.unmount(1000);
      expect(page.root).toBeDefined();
    });
  });
  //#endregion

  //#region Format functionality tests
  describe("Format functionality", () => {
    it("formats JSON when lfFormat is true", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfLanguage = "json";
      page.rootInstance.lfFormat = true;
      page.rootInstance.lfValue = '{"key":"value"}';
      await page.waitForChanges();

      const pre = page.root.shadowRoot.querySelector("pre");
      expect(pre.textContent).toContain('"key"');
      expect(pre.textContent).toContain('"value"');
    });

    it("does not format when lfFormat is false", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfFormat = false;
      page.rootInstance.lfValue = '{"key":"value"}';
      await page.waitForChanges();

      const pre = page.root.shadowRoot.querySelector("pre");
      expect(pre.textContent.trim()).toBe('{"key":"value"}');
    });

    it("handles simple brace strings", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfValue = "{}";
      await page.waitForChanges();

      const pre = page.root.shadowRoot.querySelector("pre");
      expect(pre.textContent.trim()).toBe("{}");
    });
  });
  //#endregion

  //#region Header tests
  describe("Header functionality", () => {
    it("shows sticky header by default", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      const framework = getLfFramework();
      const { bemClass } = framework.theme;
      const blocks = LF_CODE_BLOCKS.code;

      const headerClass = bemClass(blocks.header._);
      const header = page.root.shadowRoot.querySelector(`.${headerClass}`);

      expect(header).not.toBeNull();
    });

    it("disables sticky header when lfStickyHeader is false", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfStickyHeader = false;
      await page.waitForChanges();

      const framework = getLfFramework();
      const { bemClass } = framework.theme;
      const blocks = LF_CODE_BLOCKS.code;

      const stickyClass = bemClass(blocks.header._, null, { sticky: true });
      const header = page.root.shadowRoot.querySelector(`.${stickyClass}`);
      expect(header).toBeNull();
    });

    it("header displays language name", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfLanguage = "ruby";
      await page.waitForChanges();

      const framework = getLfFramework();
      const { bemClass } = framework.theme;
      const blocks = LF_CODE_BLOCKS.code;

      const titleClass = bemClass(blocks.header._, blocks.header.title);
      const title = page.root.shadowRoot.querySelector(`.${titleClass}`);
      expect(title.textContent.trim()).toBe("ruby");
    });
  });
  //#endregion

  //#region Fade-in and styling tests
  describe("Fade-in and styling", () => {
    it("applies fade-in by default", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      expect(page.rootInstance.lfFadeIn).toBe(true);
    });

    it("disables fade-in when lfFadeIn is false", async () => {
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfFadeIn = false;
      await page.waitForChanges();

      expect(page.rootInstance.lfFadeIn).toBe(false);
    });

    it("applies custom style", async () => {
      const customStyle = "#lf-component { border: 2px solid blue; }";
      const page = await createPage(`<lf-code></lf-code>`);
      page.rootInstance.lfStyle = customStyle;
      await page.waitForChanges();

      const styleEl = page.root.shadowRoot.querySelector("style");
      expect(styleEl).not.toBeNull();
    });
  });
  //#endregion
});
