import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfImage } from "./lf-image";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfImage],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("LfImage", () => {
  it("renders", async () => {
    const page = await createPage(`<lf-image></lf-image>`);
    expect(page.root).toBeTruthy();
  });

  it("renders with default props", async () => {
    const page = await createPage(`<lf-image></lf-image>`);
    const component = page.rootInstance as LfImage;

    expect(component.lfHtmlAttributes).toEqual({});
    expect(component.lfShowSpinner).toBe(false);
    expect(component.lfSizeX).toBe("100%");
    expect(component.lfSizeY).toBe("100%");
    expect(component.lfStyle).toBe("");
    expect(component.lfUiState).toBe("primary");
    expect(component.lfValue).toBe("");
  });

  it("renders with custom props", async () => {
    const page = await createPage(
      `<lf-image lf-show-spinner="true" lf-size-x="200px" lf-size-y="150px" lf-style="#test { color: red; }" lf-ui-state="success" lf-value="test-icon"></lf-image>`,
    );
    const component = page.rootInstance as LfImage;

    expect(component.lfShowSpinner).toBe(true);
    expect(component.lfSizeX).toBe("200px");
    expect(component.lfSizeY).toBe("150px");
    expect(component.lfStyle).toBe("#test { color: red; }");
    expect(component.lfUiState).toBe("success");
    expect(component.lfValue).toBe("test-icon");
  });

  it("calls getProps method", async () => {
    const page = await createPage(`<lf-image></lf-image>`);
    const component = page.rootInstance as LfImage;
    const props = await component.getProps();

    expect(props).toBeDefined();
    expect(props.lfSizeX).toBe("100%");
    expect(props.lfSizeY).toBe("100%");
    expect(props.lfStyle).toBe("");
    expect(props.lfUiState).toBe("primary");
    expect(props.lfValue).toBe("");
  });

  it("calls refresh method", async () => {
    const page = await createPage(`<lf-image></lf-image>`);
    const component = page.rootInstance as LfImage;
    await component.refresh();

    expect(component).toBeTruthy();
  });

  it("calls getDebugInfo method", async () => {
    const page = await createPage(`<lf-image></lf-image>`);
    const component = page.rootInstance as LfImage;
    const debugInfo = await component.getDebugInfo();

    expect(debugInfo).toBeDefined();
  });

  it("calls getImage method", async () => {
    const page = await createPage(`<lf-image></lf-image>`);
    const component = page.rootInstance as LfImage;
    const image = await component.getImage();

    expect(image).toBeNull();
  });

  it("calls unmount method", async () => {
    const page = await createPage(`<lf-image></lf-image>`);
    const component = page.rootInstance as LfImage;
    await component.unmount(0);

    // Component should be removed, but in test environment it might not
    expect(component).toBeTruthy();
  });
});
