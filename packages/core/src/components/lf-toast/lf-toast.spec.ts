import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfToast } from "./lf-toast";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfToast],
    html,
  });
  return page;
};

describe("LfToast", () => {
  let root: HTMLLfToastElement;

  beforeEach(async () => {
    const page = await createPage("<lf-toast></lf-toast>");
    root = page.root as HTMLLfToastElement;
  });

  it("renders", async () => {
    expect(root).toBeTruthy();
  });

  it("renders with default props", async () => {
    expect(root.lfCloseIcon).toBeDefined(); // Set in componentWillLoad
    expect(root.lfIcon).toBeUndefined();
    expect(root.lfTimer).toBe(null);
    expect(root.lfMessage).toBe("");
    expect(root.lfStyle).toBe("");
    expect(root.lfUiSize).toBe("medium");
    expect(root.lfUiState).toBe("primary");
  });

  it("renders with custom props", async () => {
    root.lfCloseIcon = "close";
    root.lfIcon = "check";
    root.lfTimer = 3000;
    root.lfMessage = "Test message";
    root.lfStyle = "color: red;";
    root.lfUiSize = "small";
    root.lfUiState = "success";
    await root.refresh();

    expect(root.lfCloseIcon).toBe("close");
    expect(root.lfIcon).toBe("check");
    expect(root.lfTimer).toBe(3000);
    expect(root.lfMessage).toBe("Test message");
    expect(root.lfStyle).toBe("color: red;");
    expect(root.lfUiSize).toBe("small");
    expect(root.lfUiState).toBe("success");
  });

  it("methods work", async () => {
    const debugInfo = await root.getDebugInfo();
    expect(debugInfo).toBeDefined();

    const props = await root.getProps();
    expect(props).toBeDefined();
    expect(props.lfMessage).toBe("");
    expect(props.lfTimer).toBe(null);

    await root.refresh();
    expect(root).toBeTruthy();

    await root.unmount(0);
    // Component should be removed, but in test it might not be immediate
  });
});
