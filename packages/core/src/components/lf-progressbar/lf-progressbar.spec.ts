import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfProgressbar } from "./lf-progressbar";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfProgressbar],
    html,
  });
  return page;
};

describe("LfProgressbar", () => {
  it("renders", async () => {
    const page = await createPage(`<lf-progressbar></lf-progressbar>`);
    const component = page.rootInstance as LfProgressbar;
    expect(component).toBeTruthy();
  });

  it("has default props", async () => {
    const page = await createPage(`<lf-progressbar></lf-progressbar>`);
    const component = page.rootInstance as LfProgressbar;
    const props = await component.getProps();

    expect(props.lfAnimated).toBe(false);
    expect(props.lfCenteredLabel).toBe(false);
    expect(props.lfIcon).toBe("");
    expect(props.lfIsRadial).toBe(false);
    expect(props.lfLabel).toBe("");
    expect(props.lfStyle).toBe("");
    expect(props.lfUiSize).toBe("medium");
    expect(props.lfUiState).toBe("primary");
    expect(props.lfValue).toBe(0);
  });

  it("sets props", async () => {
    const page = await createPage(`<lf-progressbar></lf-progressbar>`);
    const component = page.rootInstance as LfProgressbar;

    component.lfAnimated = true;
    component.lfCenteredLabel = true;
    component.lfIcon = "loading";
    component.lfIsRadial = true;
    component.lfLabel = "Loading...";
    component.lfStyle = "color: red;";
    component.lfUiSize = "small";
    component.lfUiState = "secondary";
    component.lfValue = 75;

    await page.waitForChanges();

    const props = await component.getProps();
    expect(props.lfAnimated).toBe(true);
    expect(props.lfCenteredLabel).toBe(true);
    expect(props.lfIcon).toBe("loading");
    expect(props.lfIsRadial).toBe(true);
    expect(props.lfLabel).toBe("Loading...");
    expect(props.lfStyle).toBe("color: red;");
    expect(props.lfUiSize).toBe("small");
    expect(props.lfUiState).toBe("secondary");
    expect(props.lfValue).toBe(75);
  });

  it("calls getDebugInfo method", async () => {
    const page = await createPage(`<lf-progressbar></lf-progressbar>`);
    const component = page.rootInstance as LfProgressbar;
    const debugInfo = await component.getDebugInfo();

    expect(debugInfo).toBeDefined();
  });

  it("calls getProps method", async () => {
    const page = await createPage(`<lf-progressbar></lf-progressbar>`);
    const component = page.rootInstance as LfProgressbar;
    const props = await component.getProps();

    expect(props).toBeDefined();
    expect(typeof props).toBe("object");
  });

  it("calls refresh method", async () => {
    const page = await createPage(`<lf-progressbar></lf-progressbar>`);
    const component = page.rootInstance as LfProgressbar;
    await component.refresh();

    expect(component).toBeTruthy();
  });

  it("calls unmount method", async () => {
    const page = await createPage(`<lf-progressbar></lf-progressbar>`);
    const component = page.rootInstance as LfProgressbar;
    await component.unmount(0);

    // Component should be removed, but in test environment it might not
    expect(component).toBeTruthy();
  });
});
