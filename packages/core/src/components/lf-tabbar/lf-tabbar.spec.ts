import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfTabbar } from "./lf-tabbar";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfTabbar],
    html,
  });
  return page;
};

describe("LfTabbar", () => {
  let root: HTMLLfTabbarElement;

  beforeEach(async () => {
    const page = await createPage("<lf-tabbar></lf-tabbar>");
    root = page.root as HTMLLfTabbarElement;
    root.lfDataset = {
      nodes: [
        { id: "tab1", value: "Tab 1" },
        { id: "tab2", value: "Tab 2" },
      ],
    };
    await root.refresh();
  });

  it("renders", async () => {
    expect(root).toBeTruthy();
  });

  it("renders with default props", async () => {
    expect(root.lfAriaLabel).toBe("");
    expect(root.lfDataset).toEqual({
      nodes: [
        { id: "tab1", value: "Tab 1" },
        { id: "tab2", value: "Tab 2" },
      ],
    });
    expect(root.lfNavigation).toBe(false);
    expect(root.lfRipple).toBe(true);
    expect(root.lfStyle).toBe("");
    expect(root.lfUiSize).toBe("medium");
    expect(root.lfUiState).toBe("primary");
    expect(root.lfValue).toBe(null);
  });

  it("renders with custom props", async () => {
    root.lfAriaLabel = "Test Aria";
    root.lfNavigation = true;
    root.lfRipple = false;
    root.lfStyle = "color: red;";
    root.lfUiSize = "small";
    root.lfUiState = "secondary";
    root.lfValue = 1;
    await root.refresh();

    expect(root.lfAriaLabel).toBe("Test Aria");
    expect(root.lfNavigation).toBe(true);
    expect(root.lfRipple).toBe(false);
    expect(root.lfStyle).toBe("color: red;");
    expect(root.lfUiSize).toBe("small");
    expect(root.lfUiState).toBe("secondary");
    expect(root.lfValue).toBe(1);
  });

  it("methods work", async () => {
    const debugInfo = await root.getDebugInfo();
    expect(debugInfo).toBeDefined();

    const props = await root.getProps();
    expect(props).toBeDefined();
    expect(props.lfAriaLabel).toBe("");
    expect(props.lfValue).toBe(null);

    const value = await root.getValue();
    expect(value).toBe(null);

    const newValue = await root.setValue(1);
    expect(newValue).toEqual({
      index: 1,
      node: { id: "tab2", value: "Tab 2" },
    });

    const updatedValue = await root.getValue();
    expect(updatedValue).toEqual({
      index: 1,
      node: { id: "tab2", value: "Tab 2" },
    });

    await root.refresh();
    expect(root).toBeTruthy();

    await root.unmount(0);
    // Component should be removed, but in test it might not be immediate
  });
});
