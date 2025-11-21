import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfSplash } from "./lf-splash";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfSplash],
    html,
  });
  return page;
};

describe("LfSplash", () => {
  let root: HTMLLfSplashElement;

  beforeEach(async () => {
    const page = await createPage("<lf-splash></lf-splash>");
    root = page.root as HTMLLfSplashElement;
  });

  it("renders", async () => {
    expect(root).toBeTruthy();
  });

  it("renders with default props", async () => {
    expect(root.lfLabel).toBe("Loading...");
    expect(root.lfStyle).toBe("");
  });

  it("renders with custom props", async () => {
    root.lfLabel = "Custom Loading...";
    root.lfStyle = "color: red;";
    await root.refresh();

    expect(root.lfLabel).toBe("Custom Loading...");
    expect(root.lfStyle).toBe("color: red;");
  });

  it("methods work", async () => {
    const debugInfo = await root.getDebugInfo();
    expect(debugInfo).toBeDefined();

    const props = await root.getProps();
    expect(props).toBeDefined();
    expect(props.lfLabel).toBe("Loading...");
    expect(props.lfStyle).toBe("");

    await root.refresh();
    expect(root).toBeTruthy();

    await root.unmount(0);
    // Component should be removed, but in test it might not be immediate
  });
});
