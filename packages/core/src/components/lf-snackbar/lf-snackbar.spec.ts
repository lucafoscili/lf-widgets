import { getLfFramework } from "@lf-widgets/framework";
import { newSpecPage } from "@stencil/core/testing";
import { LfSnackbar } from "./lf-snackbar";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfSnackbar],
    html,
  });
  return page;
};

describe("LfSnackbar", () => {
  let root: HTMLLfSnackbarElement;

  beforeEach(async () => {
    const page = await createPage("<lf-snackbar></lf-snackbar>");
    root = page.root as HTMLLfSnackbarElement;
  });

  it("renders", async () => {
    expect(root).toBeTruthy();
  });

  it("renders with default props", async () => {
    expect(root.lfAction).toBeUndefined();
    expect(root.lfActionCallback).toBeDefined();
    expect(root.lfCloseIcon).toBeDefined(); // Set in componentWillLoad
    expect(root.lfDuration).toBe(4000);
    expect(root.lfIcon).toBe(null);
    expect(root.lfMessage).toBe("");
    expect(root.lfPosition).toBe("bottom-center");
    expect(root.lfStyle).toBe("");
    expect(root.lfUiSize).toBe("medium");
    expect(root.lfUiState).toBe("primary");
  });

  it("renders with custom props", async () => {
    root.lfAction = "Undo";
    root.lfDuration = 5000;
    root.lfIcon = "check";
    root.lfMessage = "Test message";
    root.lfPosition = "bottom-left";
    root.lfStyle = "color: red;";
    root.lfUiSize = "small";
    root.lfUiState = "success";
    await root.refresh();

    expect(root.lfAction).toBe("Undo");
    expect(root.lfDuration).toBe(5000);
    expect(root.lfIcon).toBe("check");
    expect(root.lfMessage).toBe("Test message");
    expect(root.lfPosition).toBe("bottom-left");
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
    expect(props.lfDuration).toBe(4000);

    await root.refresh();
    expect(root).toBeTruthy();

    await root.unmount(0);
    // Component should be removed, but in test it might not be immediate
  });

  it("renders message when provided", async () => {
    const page = await createPage(
      '<lf-snackbar lf-message="Hello World"></lf-snackbar>',
    );
    root = page.root as HTMLLfSnackbarElement;
    await page.waitForChanges();

    const message = root.shadowRoot.querySelector('[part="message"]');
    expect(message).toBeTruthy();
    expect(message.textContent).toContain("Hello World");
  });

  it("renders action button when lfAction is provided", async () => {
    const page = await createPage(
      '<lf-snackbar lf-action="Undo"></lf-snackbar>',
    );
    root = page.root as HTMLLfSnackbarElement;
    await page.waitForChanges();

    const actionButton = root.shadowRoot.querySelector(
      '[part="action-button"]',
    );
    expect(actionButton).toBeTruthy();
    expect(actionButton.textContent).toContain("Undo");
  });

  it("does not render action button when lfAction is not provided", async () => {
    const actionButton = root.shadowRoot.querySelector(
      '[part="action-button"]',
    );
    expect(actionButton).toBeFalsy();
  });
});
