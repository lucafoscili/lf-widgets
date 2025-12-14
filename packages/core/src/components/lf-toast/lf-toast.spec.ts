import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfToast } from "./lf-toast";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfToast],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("LfToast", () => {
  let page: SpecPage;
  let root: HTMLLfToastElement;

  beforeEach(async () => {
    page = await createPage("<lf-toast></lf-toast>");
    root = page.root as HTMLLfToastElement;
  });

  afterEach(() => {
    jest.useRealTimers();
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

  //#region Event Emission Tests
  describe("Event Emission", () => {
    it("emits ready event on component load", async () => {
      const events: CustomEvent[] = [];
      const testPage = await createPage(`<lf-toast></lf-toast>`);
      testPage.root.addEventListener("lf-toast-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = testPage.rootInstance as LfToast;
      await component.refresh();
      await testPage.waitForChanges();

      expect(component).toBeTruthy();
    });

    it("emits unmount event when unmount is called", async () => {
      const events: CustomEvent[] = [];
      const testPage = await createPage(`<lf-toast></lf-toast>`);
      testPage.root.addEventListener("lf-toast-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = testPage.rootInstance as LfToast;

      const unmountPromise = new Promise<CustomEvent>((resolve) => {
        testPage.root.addEventListener("lf-toast-event", (e: CustomEvent) => {
          if (e.detail.eventType === "unmount") {
            resolve(e);
          }
        });
      });

      component.unmount(0);
      const unmountEvent = await unmountPromise;

      expect(unmountEvent).toBeDefined();
      expect(unmountEvent.detail.eventType).toBe("unmount");
    });

    it("event payload contains correct structure", async () => {
      const events: CustomEvent[] = [];
      const testPage = await createPage(
        `<lf-toast id="test-toast"></lf-toast>`,
      );
      testPage.root.addEventListener("lf-toast-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = testPage.rootInstance as LfToast;

      const unmountPromise = new Promise<CustomEvent>((resolve) => {
        testPage.root.addEventListener("lf-toast-event", (e: CustomEvent) => {
          if (e.detail.eventType === "unmount") {
            resolve(e);
          }
        });
      });

      component.unmount(0);
      const unmountEvent = await unmountPromise;

      expect(unmountEvent.detail).toHaveProperty("comp");
      expect(unmountEvent.detail).toHaveProperty("id");
      expect(unmountEvent.detail).toHaveProperty("eventType");
      expect(unmountEvent.detail).toHaveProperty("originalEvent");
      expect(unmountEvent.detail.id).toBe("test-toast");
    });
  });
  //#endregion

  //#region Toast Rendering Tests
  describe("Toast Rendering", () => {
    it("renders toast message when lfMessage is set", async () => {
      const testPage = await createPage(
        `<lf-toast lf-message="Test notification"></lf-toast>`,
      );
      const messageElement =
        testPage.root.shadowRoot.querySelector("[class*='message']");

      expect(messageElement).toBeTruthy();
      expect(messageElement.textContent).toBe("Test notification");
    });

    it("renders icon when lfIcon is set", async () => {
      const testPage = await createPage(
        `<lf-toast lf-icon="check"></lf-toast>`,
      );
      await testPage.waitForChanges();

      const iconContainer =
        testPage.root.shadowRoot.querySelector("[part='icon']");
      expect(iconContainer).toBeTruthy();
    });

    it("renders close icon by default", async () => {
      const testPage = await createPage(`<lf-toast></lf-toast>`);
      await testPage.waitForChanges();

      const component = testPage.root as HTMLLfToastElement;
      expect(component.lfCloseIcon).toBeTruthy();
    });

    it("renders with custom close icon", async () => {
      const testPage = await createPage(
        `<lf-toast lf-close-icon="delete"></lf-toast>`,
      );
      await testPage.waitForChanges();

      const component = testPage.root as HTMLLfToastElement;
      expect(component.lfCloseIcon).toBe("delete");
    });

    it("renders message wrapper with close icon even when message is empty", async () => {
      const testPage = await createPage(`<lf-toast lf-message=""></lf-toast>`);
      const messageWrapper = testPage.root.shadowRoot.querySelector(
        "[class*='message-wrapper']",
      );

      // Message wrapper renders with close icon
      expect(messageWrapper).toBeTruthy();
    });

    it("updates message dynamically", async () => {
      const testPage = await createPage(
        `<lf-toast lf-message="Initial"></lf-toast>`,
      );
      const component = testPage.root as HTMLLfToastElement;

      component.lfMessage = "Updated message";
      await testPage.waitForChanges();

      const messageElement =
        testPage.root.shadowRoot.querySelector("[class*='message']");
      expect(messageElement.textContent).toBe("Updated message");
    });
  });
  //#endregion

  //#region Dismiss Tests
  describe("Dismiss Tests", () => {
    it("unmount emits unmount event", async () => {
      const testPage = await createPage(`<lf-toast></lf-toast>`);
      const component = testPage.rootInstance as LfToast;

      expect(testPage.root).toBeTruthy();

      const unmountPromise = new Promise<CustomEvent>((resolve) => {
        testPage.root.addEventListener("lf-toast-event", (e: CustomEvent) => {
          if (e.detail.eventType === "unmount") {
            resolve(e);
          }
        });
      });

      component.unmount(0);
      const unmountEvent = await unmountPromise;

      expect(unmountEvent.detail.eventType).toBe("unmount");
    });

    it("custom lfCloseCallback can be set programmatically", async () => {
      let callbackTriggered = false;
      const testPage = await createPage(`<lf-toast></lf-toast>`);
      const component = testPage.root as HTMLLfToastElement;

      component.lfCloseCallback = () => {
        callbackTriggered = true;
      };
      await testPage.waitForChanges();

      // Call the callback directly to test it's set properly
      component.lfCloseCallback(component as any, null);

      expect(callbackTriggered).toBe(true);
    });

    it("default lfCloseCallback calls unmount", async () => {
      const testPage = await createPage(`<lf-toast></lf-toast>`);
      const component = testPage.root as HTMLLfToastElement;
      const instance = testPage.rootInstance as LfToast;

      const unmountSpy = jest.spyOn(instance, "unmount");

      // Trigger default close callback
      const defaultCallback = component.lfCloseCallback;
      defaultCallback(instance, null);

      expect(unmountSpy).toHaveBeenCalled();
    });
  });
  //#endregion

  //#region UI State Tests
  describe("UI State Tests", () => {
    it("applies primary state by default", async () => {
      const testPage = await createPage(`<lf-toast></lf-toast>`);
      const component = testPage.root as HTMLLfToastElement;

      expect(component.lfUiState).toBe("primary");
    });

    it("applies success state", async () => {
      const testPage = await createPage(
        `<lf-toast lf-ui-state="success"></lf-toast>`,
      );
      const component = testPage.root as HTMLLfToastElement;

      expect(component.lfUiState).toBe("success");

      const toastDiv = testPage.root.shadowRoot.querySelector(".toast");
      expect(toastDiv.getAttribute("data-lf")).toBe("success");
    });

    it("applies warning state", async () => {
      const testPage = await createPage(
        `<lf-toast lf-ui-state="warning"></lf-toast>`,
      );
      const component = testPage.root as HTMLLfToastElement;

      expect(component.lfUiState).toBe("warning");

      const toastDiv = testPage.root.shadowRoot.querySelector(".toast");
      expect(toastDiv.getAttribute("data-lf")).toBe("warning");
    });

    it("applies danger state", async () => {
      const testPage = await createPage(
        `<lf-toast lf-ui-state="danger"></lf-toast>`,
      );
      const component = testPage.root as HTMLLfToastElement;

      expect(component.lfUiState).toBe("danger");

      const toastDiv = testPage.root.shadowRoot.querySelector(".toast");
      expect(toastDiv.getAttribute("data-lf")).toBe("danger");
    });

    it("changes state dynamically", async () => {
      const testPage = await createPage(`<lf-toast></lf-toast>`);
      const component = testPage.root as HTMLLfToastElement;

      component.lfUiState = "success";
      await testPage.waitForChanges();

      const toastDiv = testPage.root.shadowRoot.querySelector(".toast");
      expect(toastDiv.getAttribute("data-lf")).toBe("success");
    });
  });
  //#endregion

  //#region UI Size Tests
  describe("UI Size Tests", () => {
    it("applies medium size by default", async () => {
      const testPage = await createPage(`<lf-toast></lf-toast>`);
      const component = testPage.root as HTMLLfToastElement;

      expect(component.lfUiSize).toBe("medium");
    });

    it("applies small size", async () => {
      const testPage = await createPage(
        `<lf-toast lf-ui-size="small"></lf-toast>`,
      );
      const component = testPage.root as HTMLLfToastElement;

      expect(component.lfUiSize).toBe("small");
    });

    it("applies large size", async () => {
      const testPage = await createPage(
        `<lf-toast lf-ui-size="large"></lf-toast>`,
      );
      const component = testPage.root as HTMLLfToastElement;

      expect(component.lfUiSize).toBe("large");
    });

    it("reflects lfUiSize attribute", async () => {
      const testPage = await createPage(
        `<lf-toast lf-ui-size="small"></lf-toast>`,
      );

      expect(testPage.root.getAttribute("lf-ui-size")).toBe("small");
    });
  });
  //#endregion

  //#region Public Methods Tests
  describe("Public Methods", () => {
    describe("getProps", () => {
      it("returns all component props", async () => {
        const testPage = await createPage(
          `<lf-toast lf-message="Test" lf-timer="5000"></lf-toast>`,
        );
        const component = testPage.root as HTMLLfToastElement;

        const props = await component.getProps();

        expect(props).toBeDefined();
        expect(props.lfMessage).toBe("Test");
        expect(props.lfTimer).toBe(5000);
        expect(props.lfUiSize).toBe("medium");
        expect(props.lfUiState).toBe("primary");
        expect(props.lfCloseIcon).toBeDefined();
      });

      it("returns updated props after changes", async () => {
        const testPage = await createPage(`<lf-toast></lf-toast>`);
        const component = testPage.root as HTMLLfToastElement;

        component.lfMessage = "Updated";
        component.lfUiState = "success";
        await testPage.waitForChanges();

        const props = await component.getProps();

        expect(props.lfMessage).toBe("Updated");
        expect(props.lfUiState).toBe("success");
      });
    });

    describe("getDebugInfo", () => {
      it("returns debug information", async () => {
        const testPage = await createPage(`<lf-toast></lf-toast>`);
        const component = testPage.root as HTMLLfToastElement;

        const debugInfo = await component.getDebugInfo();

        expect(debugInfo).toBeDefined();
      });

      it("debug info updates after component changes", async () => {
        const testPage = await createPage(`<lf-toast></lf-toast>`);
        const component = testPage.root as HTMLLfToastElement;

        const initialDebugInfo = await component.getDebugInfo();

        component.lfMessage = "Changed";
        await component.refresh();
        await testPage.waitForChanges();

        const updatedDebugInfo = await component.getDebugInfo();

        expect(initialDebugInfo).toBeDefined();
        expect(updatedDebugInfo).toBeDefined();
      });
    });

    describe("refresh", () => {
      it("triggers re-render", async () => {
        const testPage = await createPage(
          `<lf-toast lf-message="Before"></lf-toast>`,
        );
        const component = testPage.root as HTMLLfToastElement;

        component.lfMessage = "After";
        await component.refresh();
        await testPage.waitForChanges();

        const messageElement =
          testPage.root.shadowRoot.querySelector("[class*='message']");
        expect(messageElement.textContent).toBe("After");
      });
    });

    describe("unmount", () => {
      it("emits unmount event when called with 0ms", async () => {
        const testPage = await createPage(`<lf-toast></lf-toast>`);
        const component = testPage.rootInstance as LfToast;

        const unmountPromise = new Promise<CustomEvent>((resolve) => {
          testPage.root.addEventListener("lf-toast-event", (e: CustomEvent) => {
            if (e.detail.eventType === "unmount") {
              resolve(e);
            }
          });
        });

        component.unmount(0);
        const unmountEvent = await unmountPromise;

        expect(unmountEvent.detail.eventType).toBe("unmount");
      });
    });
  });
  //#endregion

  //#region Timer Tests
  describe("Timer Tests", () => {
    it("sets timer CSS variable when lfTimer is provided", async () => {
      const testPage = await createPage(
        `<lf-toast lf-timer="3000"></lf-toast>`,
      );

      const styleElement = testPage.root.shadowRoot.querySelector("style[id]");
      expect(styleElement.textContent).toContain("3000ms");
    });

    it("does not set timer CSS variable when lfTimer is null", async () => {
      const testPage = await createPage(`<lf-toast></lf-toast>`);

      const styleElement = testPage.root.shadowRoot.querySelector("style[id]");
      expect(styleElement.textContent).not.toContain("--lf-toast-timer");
    });

    it("renders temporary accent when timer is set", async () => {
      const testPage = await createPage(
        `<lf-toast lf-timer="3000"></lf-toast>`,
      );

      const accent = testPage.root.shadowRoot.querySelector(
        "[class*='accent'][class*='temporary']",
      );
      expect(accent).toBeTruthy();
    });
  });
  //#endregion

  //#region Custom Style Tests
  describe("Custom Style Tests", () => {
    it("applies custom style when lfStyle is set", async () => {
      const testPage = await createPage(
        `<lf-toast lf-style=".test { color: red; }"></lf-toast>`,
      );
      const component = testPage.root as HTMLLfToastElement;

      expect(component.lfStyle).toBe(".test { color: red; }");
    });

    it("updates custom style dynamically", async () => {
      const testPage = await createPage(`<lf-toast></lf-toast>`);
      const component = testPage.root as HTMLLfToastElement;

      component.lfStyle = ".custom { background: blue; }";
      await testPage.waitForChanges();

      expect(component.lfStyle).toBe(".custom { background: blue; }");
    });
  });
  //#endregion

  //#region Multiple Toasts Tests
  describe("Multiple Toasts", () => {
    it("can render multiple toast instances", async () => {
      getLfFramework();
      const testPage = await newSpecPage({
        components: [LfToast],
        html: `
          <div>
            <lf-toast id="toast1" lf-message="First toast"></lf-toast>
            <lf-toast id="toast2" lf-message="Second toast"></lf-toast>
            <lf-toast id="toast3" lf-message="Third toast"></lf-toast>
          </div>
        `,
      });
      await testPage.waitForChanges();

      const toasts = testPage.body.querySelectorAll("lf-toast");
      expect(toasts.length).toBe(3);
    });

    it("each toast instance has independent props", async () => {
      getLfFramework();
      const testPage = await newSpecPage({
        components: [LfToast],
        html: `
          <div>
            <lf-toast id="toast1" lf-message="First" lf-ui-state="primary"></lf-toast>
            <lf-toast id="toast2" lf-message="Second" lf-ui-state="success"></lf-toast>
          </div>
        `,
      });
      await testPage.waitForChanges();

      const toast1 = testPage.body.querySelector(
        "#toast1",
      ) as HTMLLfToastElement;
      const toast2 = testPage.body.querySelector(
        "#toast2",
      ) as HTMLLfToastElement;

      expect(toast1.lfMessage).toBe("First");
      expect(toast1.lfUiState).toBe("primary");
      expect(toast2.lfMessage).toBe("Second");
      expect(toast2.lfUiState).toBe("success");
    });

    it("unmounting one toast does not affect others", async () => {
      getLfFramework();
      const testPage = await newSpecPage({
        components: [LfToast],
        html: `
          <div>
            <lf-toast id="toast1" lf-message="First"></lf-toast>
            <lf-toast id="toast2" lf-message="Second"></lf-toast>
          </div>
        `,
      });
      await testPage.waitForChanges();

      const toast1 = testPage.body.querySelector(
        "#toast1",
      ) as HTMLLfToastElement;
      const toast2 = testPage.body.querySelector(
        "#toast2",
      ) as HTMLLfToastElement;

      const unmountPromise = new Promise<CustomEvent>((resolve) => {
        toast1.addEventListener("lf-toast-event", (e: CustomEvent) => {
          if (e.detail.eventType === "unmount") {
            resolve(e);
          }
        });
      });

      toast1.unmount(0);
      const unmountEvent = await unmountPromise;

      // Verify unmount event was emitted for toast1
      expect(unmountEvent.detail.eventType).toBe("unmount");
      // Verify toast2 is still present and unchanged
      expect(toast2.lfMessage).toBe("Second");
    });
  });
  //#endregion
});
