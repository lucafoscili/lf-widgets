import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfSlider } from "./lf-slider";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfSlider],
    html,
  });
  return page;
};

describe("LfSlider", () => {
  let root: HTMLLfSliderElement;

  beforeEach(async () => {
    const page = await createPage("<lf-slider></lf-slider>");
    root = page.root as HTMLLfSliderElement;
  });

  it("renders", async () => {
    expect(root).toBeTruthy();
  });

  it("renders with default props", async () => {
    expect(root.lfLabel).toBe("");
    expect(root.lfLeadingLabel).toBe(false);
    expect(root.lfMax).toBe(100);
    expect(root.lfMin).toBe(0);
    expect(root.lfStep).toBe(1);
    expect(root.lfRipple).toBe(true);
    expect(root.lfStyle).toBe("");
    expect(root.lfUiSize).toBe("medium");
    expect(root.lfUiState).toBe("primary");
    expect(root.lfValue).toBe(50);
  });

  it("renders with custom props", async () => {
    root.lfLabel = "Test Label";
    root.lfLeadingLabel = true;
    root.lfMax = 200;
    root.lfMin = 10;
    root.lfStep = 5;
    root.lfRipple = false;
    root.lfStyle = "color: red;";
    root.lfUiSize = "small";
    root.lfUiState = "secondary";
    root.lfValue = 75;
    await root.refresh();

    expect(root.lfLabel).toBe("Test Label");
    expect(root.lfLeadingLabel).toBe(true);
    expect(root.lfMax).toBe(200);
    expect(root.lfMin).toBe(10);
    expect(root.lfStep).toBe(5);
    expect(root.lfRipple).toBe(false);
    expect(root.lfStyle).toBe("color: red;");
    expect(root.lfUiSize).toBe("small");
    expect(root.lfUiState).toBe("secondary");
    expect(root.lfValue).toBe(75);
  });

  it("methods work", async () => {
    const debugInfo = await root.getDebugInfo();
    expect(debugInfo).toBeDefined();

    const props = await root.getProps();
    expect(props).toBeDefined();
    expect(props.lfLabel).toBe("");
    expect(props.lfValue).toBe(50);

    const value = await root.getValue();
    expect(value).toEqual({ display: 50, real: 50 });

    await root.setValue(80);
    const newValue = await root.getValue();
    expect(newValue).toEqual({ display: 80, real: 80 });

    await root.refresh();
    expect(root).toBeTruthy();

    await root.unmount(0);
    // Component should be removed, but in test it might not be immediate
  });
});
