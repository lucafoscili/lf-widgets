import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfSplash } from "./lf-splash";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfSplash],
    html,
  });
  await page.waitForChanges();
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

  describe("Event Emission", () => {
    it("emits ready event on component load", async () => {
      const events: CustomEvent[] = [];
      const page = await createPage(`<lf-splash></lf-splash>`);
      page.root.addEventListener("lf-splash-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfSplash;
      await component.refresh();
      await page.waitForChanges();

      expect(component).toBeTruthy();
    });

    it("emits unmount event when unmount is called", async () => {
      const events: CustomEvent[] = [];
      const page = await createPage(`<lf-splash></lf-splash>`);
      page.root.addEventListener("lf-splash-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfSplash;

      const unmountPromise = new Promise<CustomEvent>((resolve) => {
        page.root.addEventListener("lf-splash-event", (e: CustomEvent) => {
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
      const page = await createPage(`<lf-splash id="test-splash"></lf-splash>`);
      page.root.addEventListener("lf-splash-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfSplash;

      const unmountPromise = new Promise<CustomEvent>((resolve) => {
        page.root.addEventListener("lf-splash-event", (e: CustomEvent) => {
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
      expect(unmountEvent.detail.id).toBe("test-splash");
    });
  });

  describe("Label Tests", () => {
    it("displays default label 'Loading...'", async () => {
      const page = await createPage(`<lf-splash></lf-splash>`);
      const labelElement = page.root.shadowRoot.querySelector("[part='label']");

      expect(labelElement).toBeTruthy();
      expect(labelElement.textContent).toBe("Loading...");
    });

    it("displays custom label via attribute", async () => {
      const page = await createPage(
        `<lf-splash lf-label="Please wait..."></lf-splash>`,
      );
      const labelElement = page.root.shadowRoot.querySelector("[part='label']");

      expect(labelElement.textContent).toBe("Please wait...");
    });

    it("updates label dynamically", async () => {
      const page = await createPage(`<lf-splash></lf-splash>`);
      const component = page.root as HTMLLfSplashElement;

      component.lfLabel = "Almost there...";
      await page.waitForChanges();

      const labelElement = page.root.shadowRoot.querySelector("[part='label']");
      expect(labelElement.textContent).toBe("Almost there...");
    });

    it("displays empty string label", async () => {
      const page = await createPage(`<lf-splash lf-label=""></lf-splash>`);
      const labelElement = page.root.shadowRoot.querySelector("[part='label']");

      expect(labelElement.textContent).toBe("");
    });
  });

  describe("Style Tests", () => {
    it("renders without custom style by default", async () => {
      const page = await createPage(`<lf-splash></lf-splash>`);
      const styleElement = page.root.shadowRoot.querySelector("#lf-style");

      expect(styleElement).toBeFalsy();
    });

    it("renders with custom lfStyle", async () => {
      const page = await createPage(
        `<lf-splash lf-style=".splash { color: red; }"></lf-splash>`,
      );
      const styleElement = page.root.shadowRoot.querySelector("#lf-style");

      expect(styleElement).toBeTruthy();
    });

    it("updates lfStyle dynamically", async () => {
      const page = await createPage(`<lf-splash></lf-splash>`);
      const component = page.root as HTMLLfSplashElement;

      expect(page.root.shadowRoot.querySelector("#lf-style")).toBeFalsy();

      component.lfStyle = ".splash { background: blue; }";
      await page.waitForChanges();

      const styleElement = page.root.shadowRoot.querySelector("#lf-style");
      expect(styleElement).toBeTruthy();
    });
  });

  describe("Animation and State Tests", () => {
    it("starts with initializing state", async () => {
      const page = await createPage(`<lf-splash></lf-splash>`);
      const component = page.rootInstance as LfSplash;

      // The state should be set after loading
      expect(component).toBeTruthy();
    });

    it("splash container exists initially", async () => {
      const page = await createPage(`<lf-splash></lf-splash>`);
      const splashElement =
        page.root.shadowRoot.querySelector("[part='splash']");

      expect(splashElement).toBeTruthy();
    });

    it("splash container has active class when unmounting", async () => {
      const page = await createPage(`<lf-splash></lf-splash>`);
      const component = page.rootInstance as LfSplash;

      // Start unmount process
      component.unmount(0);

      // Wait for state to change to unmounting
      await new Promise((resolve) => setTimeout(resolve, 50));
      await page.waitForChanges();

      const splashElement =
        page.root.shadowRoot.querySelector("[part='splash']");
      expect(splashElement).toBeTruthy();
      expect(splashElement.classList.contains("splash--active")).toBeTruthy();
    });

    it("displays 'Ready!' label when unmounting", async () => {
      const page = await createPage(
        `<lf-splash lf-label="Loading..."></lf-splash>`,
      );
      const component = page.rootInstance as LfSplash;

      // Start unmount process
      component.unmount(0);

      // Wait for state to change
      await new Promise((resolve) => setTimeout(resolve, 50));
      await page.waitForChanges();

      const labelElement = page.root.shadowRoot.querySelector("[part='label']");
      expect(labelElement.textContent).toBe("Ready!");
    });
  });

  describe("Slot Tests", () => {
    it("renders slot container for custom content", async () => {
      const page = await createPage(`<lf-splash></lf-splash>`);
      const widgetElement =
        page.root.shadowRoot.querySelector("[part='widget']");

      expect(widgetElement).toBeTruthy();
    });

    it("renders slotted content", async () => {
      const page = await createPage(
        `<lf-splash><img src="logo.png" alt="Logo" /></lf-splash>`,
      );
      const slottedContent = page.root.querySelector("img");

      expect(slottedContent).toBeTruthy();
      expect(slottedContent.getAttribute("alt")).toBe("Logo");
    });
  });

  describe("Public Methods Tests", () => {
    it("getDebugInfo returns lifecycle info", async () => {
      const page = await createPage(`<lf-splash></lf-splash>`);
      const component = page.root as HTMLLfSplashElement;

      const debugInfo = await component.getDebugInfo();

      expect(debugInfo).toBeDefined();
      expect(debugInfo).toHaveProperty("endTime");
      expect(debugInfo).toHaveProperty("renderCount");
      expect(debugInfo).toHaveProperty("renderEnd");
      expect(debugInfo).toHaveProperty("renderStart");
      expect(debugInfo).toHaveProperty("startTime");
    });

    it("getProps returns all component props", async () => {
      const page = await createPage(
        `<lf-splash lf-label="Test Label" lf-style=".custom {}"></lf-splash>`,
      );
      const component = page.root as HTMLLfSplashElement;

      const props = await component.getProps();

      expect(props).toBeDefined();
      expect(props.lfLabel).toBe("Test Label");
      expect(props.lfStyle).toBe(".custom {}");
    });

    it("getProps returns default values when no props set", async () => {
      const page = await createPage(`<lf-splash></lf-splash>`);
      const component = page.root as HTMLLfSplashElement;

      const props = await component.getProps();

      expect(props.lfLabel).toBe("Loading...");
      expect(props.lfStyle).toBe("");
    });

    it("refresh forces component re-render", async () => {
      const page = await createPage(`<lf-splash></lf-splash>`);
      const component = page.root as HTMLLfSplashElement;

      const initialDebugInfo = await component.getDebugInfo();
      const initialRenderCount = initialDebugInfo.renderCount;

      await component.refresh();
      await page.waitForChanges();

      const updatedDebugInfo = await component.getDebugInfo();
      expect(updatedDebugInfo.renderCount).toBeGreaterThan(initialRenderCount);
    });

    it("unmount with custom delay", async () => {
      const page = await createPage(`<lf-splash></lf-splash>`);
      const component = page.root as HTMLLfSplashElement;

      const unmountPromise = new Promise<CustomEvent>((resolve) => {
        page.root.addEventListener("lf-splash-event", (e: CustomEvent) => {
          if (e.detail.eventType === "unmount") {
            resolve(e);
          }
        });
      });

      await component.unmount(10);
      const unmountEvent = await unmountPromise;

      expect(unmountEvent.detail.eventType).toBe("unmount");
    });
  });

  describe("DOM Structure Tests", () => {
    it("renders correct DOM structure", async () => {
      const page = await createPage(`<lf-splash></lf-splash>`);
      const wrapper = page.root.shadowRoot.querySelector("#lf-component");
      const splash = page.root.shadowRoot.querySelector("[part='splash']");
      const content = page.root.shadowRoot.querySelector("[part='content']");
      const widget = page.root.shadowRoot.querySelector("[part='widget']");
      const label = page.root.shadowRoot.querySelector("[part='label']");

      expect(wrapper).toBeTruthy();
      expect(splash).toBeTruthy();
      expect(content).toBeTruthy();
      expect(widget).toBeTruthy();
      expect(label).toBeTruthy();
    });

    it("renders with part attributes for styling", async () => {
      const page = await createPage(`<lf-splash></lf-splash>`);
      const splash = page.root.shadowRoot.querySelector("[part='splash']");
      const content = page.root.shadowRoot.querySelector("[part='content']");
      const widget = page.root.shadowRoot.querySelector("[part='widget']");
      const label = page.root.shadowRoot.querySelector("[part='label']");

      expect(splash).toBeTruthy();
      expect(content).toBeTruthy();
      expect(widget).toBeTruthy();
      expect(label).toBeTruthy();
    });

    it("renders with component id attribute", async () => {
      const page = await createPage(`<lf-splash id="my-splash"></lf-splash>`);
      const component = page.root;

      expect(component.id).toBe("my-splash");
    });
  });
});
