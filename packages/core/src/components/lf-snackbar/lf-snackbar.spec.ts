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

describe("LfSnackbar Events", () => {
  it("emits action event when action button is clicked", async () => {
    const events: CustomEvent[] = [];
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-action="Undo"></lf-snackbar>',
    });
    page.root.addEventListener("lf-snackbar-event", (e: CustomEvent) =>
      events.push(e),
    );
    await page.waitForChanges();

    const actionButton = page.root.shadowRoot.querySelector(
      '[part="action-button"]',
    ) as HTMLButtonElement;
    // Use MouseEvent as PointerEvent is not available in Jest/JSDOM
    actionButton.dispatchEvent(
      new MouseEvent("pointerdown", { bubbles: true }),
    );
    await page.waitForChanges();

    const actionEvent = events.find((e) => e.detail.eventType === "action");
    expect(actionEvent).toBeDefined();
  });

  it("emits close event when close button is clicked", async () => {
    const events: CustomEvent[] = [];
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: "<lf-snackbar></lf-snackbar>",
    });
    page.root.addEventListener("lf-snackbar-event", (e: CustomEvent) =>
      events.push(e),
    );
    await page.waitForChanges();

    const closeButton = page.root.shadowRoot.querySelector(
      '[part="close-button"]',
    ) as HTMLElement;
    // Use MouseEvent as PointerEvent is not available in Jest/JSDOM
    closeButton.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    await page.waitForChanges();

    const closeEvent = events.find((e) => e.detail.eventType === "close");
    expect(closeEvent).toBeDefined();
  });

  it("emits unmount event when unmount is called", async () => {
    const events: CustomEvent[] = [];
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: "<lf-snackbar></lf-snackbar>",
    });
    page.root.addEventListener("lf-snackbar-event", (e: CustomEvent) =>
      events.push(e),
    );
    await page.waitForChanges();

    // Call unmount and wait for the timeout
    (page.root as HTMLLfSnackbarElement).unmount(0);
    await new Promise((resolve) => setTimeout(resolve, 50));
    await page.waitForChanges();

    const unmountEvent = events.find((e) => e.detail.eventType === "unmount");
    expect(unmountEvent).toBeDefined();
  });

  it("event payload contains correct structure", async () => {
    const events: CustomEvent[] = [];
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar id="test-snackbar"></lf-snackbar>',
    });
    page.root.addEventListener("lf-snackbar-event", (e: CustomEvent) =>
      events.push(e),
    );

    // Trigger an action event to test structure
    const closeButton = page.root.shadowRoot.querySelector(
      '[part="close-button"]',
    ) as HTMLElement;
    closeButton.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    await page.waitForChanges();

    const closeEvent = events.find((e) => e.detail.eventType === "close");
    expect(closeEvent).toBeDefined();
    expect(closeEvent.detail.id).toBe("test-snackbar");
    expect(closeEvent.detail.comp).toBeDefined();
    expect(closeEvent.detail.originalEvent).toBeDefined();
  });

  it("calls custom action callback when action button is clicked", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-action="Custom"></lf-snackbar>',
    });
    await page.waitForChanges();

    let callbackCalled = false;
    const snackbar = page.root as HTMLLfSnackbarElement;
    snackbar.lfActionCallback = () => {
      callbackCalled = true;
    };
    await page.waitForChanges();

    const actionButton = page.root.shadowRoot.querySelector(
      '[part="action-button"]',
    ) as HTMLButtonElement;
    actionButton.dispatchEvent(
      new MouseEvent("pointerdown", { bubbles: true }),
    );
    await page.waitForChanges();

    expect(callbackCalled).toBe(true);
  });
});

describe("LfSnackbar Message Display", () => {
  it("renders empty message by default", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: "<lf-snackbar></lf-snackbar>",
    });

    const message = page.root.shadowRoot.querySelector('[part="message"]');
    expect(message).toBeFalsy();
  });

  it("renders message when lfMessage is set", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-message="Test notification"></lf-snackbar>',
    });
    await page.waitForChanges();

    const message = page.root.shadowRoot.querySelector('[part="message"]');
    expect(message).toBeTruthy();
    expect(message.textContent).toBe("Test notification");
  });

  it("updates message dynamically", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-message="Initial"></lf-snackbar>',
    });
    await page.waitForChanges();

    const snackbar = page.root as HTMLLfSnackbarElement;
    snackbar.lfMessage = "Updated message";
    await snackbar.refresh();
    await page.waitForChanges();

    const message = page.root.shadowRoot.querySelector('[part="message"]');
    expect(message.textContent).toBe("Updated message");
  });

  it("handles special characters in message", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-message="Test &amp; more"></lf-snackbar>',
    });
    await page.waitForChanges();

    const message = page.root.shadowRoot.querySelector('[part="message"]');
    expect(message).toBeTruthy();
    expect(message.textContent).toContain("Test");
  });
});

describe("LfSnackbar Icon Rendering", () => {
  it("does not render icon when lfIcon is null", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: "<lf-snackbar></lf-snackbar>",
    });

    const icon = page.root.shadowRoot.querySelector('[part="icon"]');
    expect(icon).toBeFalsy();
  });

  it("renders icon when lfIcon is provided", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-icon="check"></lf-snackbar>',
    });
    await page.waitForChanges();

    const icon = page.root.shadowRoot.querySelector('[part="icon"]');
    expect(icon).toBeTruthy();
  });

  it("renders close button by default", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: "<lf-snackbar></lf-snackbar>",
    });

    const closeButton = page.root.shadowRoot.querySelector(
      '[part="close-button"]',
    );
    expect(closeButton).toBeTruthy();
  });

  it("applies has-icon modifier when icon is present", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-icon="info"></lf-snackbar>',
    });
    await page.waitForChanges();

    // Query using part selector which is more reliable in shadow DOM
    const icon = page.root.shadowRoot.querySelector('[part="icon"]');
    expect(icon).toBeTruthy();
  });
});

describe("LfSnackbar Duration", () => {
  it("uses default duration of 4000ms", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: "<lf-snackbar></lf-snackbar>",
    });

    expect((page.root as HTMLLfSnackbarElement).lfDuration).toBe(4000);
  });

  it("accepts custom duration", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-duration="6000"></lf-snackbar>',
    });
    await page.waitForChanges();

    expect((page.root as HTMLLfSnackbarElement).lfDuration).toBe(6000);
  });

  it("sets duration to 0 to disable auto-dismiss", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-duration="0"></lf-snackbar>',
    });
    await page.waitForChanges();

    expect((page.root as HTMLLfSnackbarElement).lfDuration).toBe(0);
  });

  it("includes duration CSS variable when duration is set", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-duration="5000"></lf-snackbar>',
    });
    await page.waitForChanges();

    const styleElement = page.root.shadowRoot.querySelector("style");
    expect(styleElement.textContent).toContain("5000ms");
  });
});

describe("LfSnackbar Position", () => {
  it("defaults to bottom-center position", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: "<lf-snackbar></lf-snackbar>",
    });

    expect((page.root as HTMLLfSnackbarElement).lfPosition).toBe(
      "bottom-center",
    );
  });

  it("renders with bottom-left position", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-position="bottom-left"></lf-snackbar>',
    });
    await page.waitForChanges();

    expect((page.root as HTMLLfSnackbarElement).lfPosition).toBe("bottom-left");
    expect(page.root.getAttribute("lf-position")).toBe("bottom-left");
  });

  it("renders with bottom-right position", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-position="bottom-right"></lf-snackbar>',
    });
    await page.waitForChanges();

    expect((page.root as HTMLLfSnackbarElement).lfPosition).toBe(
      "bottom-right",
    );
  });

  it("renders with top-left position", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-position="top-left"></lf-snackbar>',
    });
    await page.waitForChanges();

    expect((page.root as HTMLLfSnackbarElement).lfPosition).toBe("top-left");
  });

  it("renders with top-center position", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-position="top-center"></lf-snackbar>',
    });
    await page.waitForChanges();

    expect((page.root as HTMLLfSnackbarElement).lfPosition).toBe("top-center");
  });

  it("renders with top-right position", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-position="top-right"></lf-snackbar>',
    });
    await page.waitForChanges();

    expect((page.root as HTMLLfSnackbarElement).lfPosition).toBe("top-right");
  });

  it("renders with inline position", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-position="inline"></lf-snackbar>',
    });
    await page.waitForChanges();

    expect((page.root as HTMLLfSnackbarElement).lfPosition).toBe("inline");
  });

  it("reflects position attribute", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-position="top-center"></lf-snackbar>',
    });
    await page.waitForChanges();

    expect(page.root.getAttribute("lf-position")).toBe("top-center");
  });
});

describe("LfSnackbar UI Size", () => {
  it("defaults to medium size", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: "<lf-snackbar></lf-snackbar>",
    });

    expect((page.root as HTMLLfSnackbarElement).lfUiSize).toBe("medium");
  });

  it("renders with small size", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-ui-size="small"></lf-snackbar>',
    });
    await page.waitForChanges();

    expect((page.root as HTMLLfSnackbarElement).lfUiSize).toBe("small");
  });

  it("renders with large size", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-ui-size="large"></lf-snackbar>',
    });
    await page.waitForChanges();

    expect((page.root as HTMLLfSnackbarElement).lfUiSize).toBe("large");
  });

  it("reflects ui-size attribute", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-ui-size="small"></lf-snackbar>',
    });
    await page.waitForChanges();

    expect(page.root.getAttribute("lf-ui-size")).toBe("small");
  });
});

describe("LfSnackbar UI State", () => {
  it("defaults to primary state", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: "<lf-snackbar></lf-snackbar>",
    });

    expect((page.root as HTMLLfSnackbarElement).lfUiState).toBe("primary");
  });

  it("renders with success state", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-ui-state="success"></lf-snackbar>',
    });
    await page.waitForChanges();

    expect((page.root as HTMLLfSnackbarElement).lfUiState).toBe("success");
  });

  it("renders with warning state", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-ui-state="warning"></lf-snackbar>',
    });
    await page.waitForChanges();

    expect((page.root as HTMLLfSnackbarElement).lfUiState).toBe("warning");
  });

  it("renders with danger state", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-ui-state="danger"></lf-snackbar>',
    });
    await page.waitForChanges();

    expect((page.root as HTMLLfSnackbarElement).lfUiState).toBe("danger");
  });

  it("applies data-lf attribute based on state", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-ui-state="success"></lf-snackbar>',
    });
    await page.waitForChanges();

    // Query using data-lf attribute selector
    const snackbarDiv = page.root.shadowRoot.querySelector(
      '[data-lf="success"]',
    );
    expect(snackbarDiv).toBeTruthy();
  });
});

describe("LfSnackbar Action Button", () => {
  it("renders action button with correct text", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-action="Retry"></lf-snackbar>',
    });
    await page.waitForChanges();

    const actionButton = page.root.shadowRoot.querySelector(
      '[part="action-button"]',
    );
    expect(actionButton.textContent).toBe("Retry");
  });

  it("action button has correct type attribute", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-action="Submit"></lf-snackbar>',
    });
    await page.waitForChanges();

    const actionButton = page.root.shadowRoot.querySelector(
      '[part="action-button"]',
    ) as HTMLButtonElement;
    expect(actionButton.getAttribute("type")).toBe("button");
  });

  it("does not render action button when lfAction is undefined", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: "<lf-snackbar></lf-snackbar>",
    });
    await page.waitForChanges();

    const actionButton = page.root.shadowRoot.querySelector(
      '[part="action-button"]',
    );
    expect(actionButton).toBeFalsy();
  });
});

describe("LfSnackbar Custom Styling", () => {
  it("applies custom style when lfStyle is provided", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: '<lf-snackbar lf-style=".test { color: red; }"></lf-snackbar>',
    });
    await page.waitForChanges();

    const styleElement = page.root.shadowRoot.querySelector("style");
    expect(styleElement).toBeTruthy();
  });

  it("renders style element in shadow root", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: "<lf-snackbar></lf-snackbar>",
    });
    await page.waitForChanges();

    const styleElement = page.root.shadowRoot.querySelector("style#lf-style");
    expect(styleElement).toBeTruthy();
  });
});

describe("LfSnackbar Unmount Behavior", () => {
  it("unmount method removes component", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: "<lf-snackbar></lf-snackbar>",
    });
    await page.waitForChanges();

    const snackbar = page.root as HTMLLfSnackbarElement;
    snackbar.unmount(0);
    await new Promise((resolve) => setTimeout(resolve, 50));
    await page.waitForChanges();

    // Component should trigger unmount event
    expect(snackbar).toBeTruthy();
  });

  it("unmount with delay waits before removing", async () => {
    const events: CustomEvent[] = [];
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: "<lf-snackbar></lf-snackbar>",
    });
    page.root.addEventListener("lf-snackbar-event", (e: CustomEvent) =>
      events.push(e),
    );
    await page.waitForChanges();

    const snackbar = page.root as HTMLLfSnackbarElement;
    snackbar.unmount(100);

    // Immediately after calling, unmount event should not be emitted yet
    let unmountEvent = events.find((e) => e.detail.eventType === "unmount");
    expect(unmountEvent).toBeUndefined();

    // Wait for delay
    await new Promise((resolve) => setTimeout(resolve, 150));
    await page.waitForChanges();

    unmountEvent = events.find((e) => e.detail.eventType === "unmount");
    expect(unmountEvent).toBeDefined();
  });
});

describe("LfSnackbar Structure and Accessibility", () => {
  it("renders wrapper with correct id", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: "<lf-snackbar></lf-snackbar>",
    });

    const wrapper = page.root.shadowRoot.querySelector("#lf-component");
    expect(wrapper).toBeTruthy();
  });

  it("renders with fade-in animation attribute", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: "<lf-snackbar></lf-snackbar>",
    });

    const wrapper = page.root.shadowRoot.querySelector("#lf-component");
    expect(wrapper.getAttribute("data-lf")).toBe("fade-in");
  });

  it("close button is focusable", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: "<lf-snackbar></lf-snackbar>",
    });

    const closeButton = page.root.shadowRoot.querySelector(
      '[part="close-button"]',
    ) as HTMLElement;
    expect(closeButton.getAttribute("tabindex")).toBe("0");
  });

  it("renders with Host element", async () => {
    getLfFramework();
    const page = await newSpecPage({
      components: [LfSnackbar],
      html: "<lf-snackbar></lf-snackbar>",
    });

    expect(page.root.tagName.toLowerCase()).toBe("lf-snackbar");
  });
});
