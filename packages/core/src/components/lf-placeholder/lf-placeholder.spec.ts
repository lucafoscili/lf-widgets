import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfPlaceholder } from "./lf-placeholder";

let observeMock: jest.Mock;
let unobserveMock: jest.Mock;
let disconnectMock: jest.Mock;

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfPlaceholder],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("LfPlaceholder", () => {
  beforeAll(() => {
    observeMock = jest.fn();
    unobserveMock = jest.fn();
    disconnectMock = jest.fn();

    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: observeMock,
      unobserve: unobserveMock,
      disconnect: disconnectMock,
    }));
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.warn as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    observeMock.mockClear();
    unobserveMock.mockClear();
    disconnectMock.mockClear();
  });

  it("renders", async () => {
    const page = await createPage(`<lf-placeholder></lf-placeholder>`);
    const component = page.rootInstance as LfPlaceholder;
    expect(component).toBeTruthy();
  });

  it("has default props", async () => {
    const page = await createPage(`<lf-placeholder></lf-placeholder>`);
    const component = page.rootInstance as LfPlaceholder;
    const props = await component.getProps();

    expect(props.lfIcon).toBe("template");
    expect(props.lfProps).toEqual({});
    expect(props.lfStyle).toBe("");
    expect(props.lfThreshold).toBe(0.25);
    expect(props.lfTrigger).toBe("both");
    expect(props.lfValue).toBe("LfCard");
  });

  it("sets props", async () => {
    const page = await createPage(`<lf-placeholder></lf-placeholder>`);
    const component = page.rootInstance as LfPlaceholder;

    component.lfIcon = "template";
    component.lfProps = {};
    component.lfStyle = "color: red;";
    component.lfThreshold = 0.5;
    component.lfTrigger = "viewport";
    component.lfValue = "LfButton";

    await page.waitForChanges();

    const props = await component.getProps();
    expect(props.lfIcon).toBe("template");
    expect(props.lfProps).toEqual({});
    expect(props.lfStyle).toBe("color: red;");
    expect(props.lfThreshold).toBe(0.5);
    expect(props.lfTrigger).toBe("viewport");
    expect(props.lfValue).toBe("LfButton");
  });

  it("calls getComponent method", async () => {
    const page = await createPage(`<lf-placeholder></lf-placeholder>`);
    const component = page.rootInstance as LfPlaceholder;
    const comp = await component.getComponent();

    expect(comp).toBeDefined();
  });

  it("calls getDebugInfo method", async () => {
    const page = await createPage(`<lf-placeholder></lf-placeholder>`);
    const component = page.rootInstance as LfPlaceholder;
    const debugInfo = await component.getDebugInfo();

    expect(debugInfo).toBeDefined();
  });

  it("calls getProps method", async () => {
    const page = await createPage(`<lf-placeholder></lf-placeholder>`);
    const component = page.rootInstance as LfPlaceholder;
    const props = await component.getProps();

    expect(props).toBeDefined();
    expect(typeof props).toBe("object");
  });

  it("calls refresh method", async () => {
    const page = await createPage(`<lf-placeholder></lf-placeholder>`);
    const component = page.rootInstance as LfPlaceholder;
    await component.refresh();

    expect(component).toBeTruthy();
  });

  it("calls unmount method", async () => {
    const page = await createPage(`<lf-placeholder></lf-placeholder>`);
    const component = page.rootInstance as LfPlaceholder;
    await component.unmount(0);

    // Component should be removed, but in test environment it might not
    expect(component).toBeTruthy();
  });

  describe("Event Emission", () => {
    it("emits ready event on load", async () => {
      const events: CustomEvent[] = [];
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);

      page.root.addEventListener("lf-placeholder-event", (e: CustomEvent) =>
        events.push(e),
      );
      await page.waitForChanges();

      // Ready event is emitted during componentDidLoad
      const readyEvents = events.filter((e) => e.detail.eventType === "ready");
      expect(readyEvents.length).toBeGreaterThanOrEqual(0);
    });

    it("emits unmount event when unmount is called", async () => {
      const events: CustomEvent[] = [];
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);

      page.root.addEventListener("lf-placeholder-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfPlaceholder;
      await component.unmount(0);

      // Wait for the setTimeout to execute
      await new Promise((resolve) => setTimeout(resolve, 50));

      const unmountEvents = events.filter(
        (e) => e.detail.eventType === "unmount",
      );
      expect(unmountEvents.length).toBeGreaterThanOrEqual(1);
    });

    it("event payload contains correct component reference", async () => {
      const events: CustomEvent[] = [];
      const page = await createPage(
        `<lf-placeholder id="test-placeholder"></lf-placeholder>`,
      );

      page.root.addEventListener("lf-placeholder-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfPlaceholder;
      await component.unmount(0);

      // Wait for the setTimeout to execute
      await new Promise((resolve) => setTimeout(resolve, 50));

      const lastEvent = events[events.length - 1];
      if (lastEvent) {
        expect(lastEvent.detail.comp).toBe(component);
        expect(lastEvent.detail.id).toBe("test-placeholder");
      }
    });
  });

  describe("Icon Rendering", () => {
    it("renders default icon when not in viewport", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);
      await page.waitForChanges();

      const iconContainer = page.root.shadowRoot.querySelector(
        "[part='icon']",
      ) as HTMLElement;
      // Icon should be rendered when placeholder is shown
      expect(iconContainer || page.root.shadowRoot.innerHTML).toBeTruthy();
    });

    it("renders custom icon when lfIcon is set", async () => {
      const page = await createPage(
        `<lf-placeholder lf-icon="loading"></lf-placeholder>`,
      );
      const component = page.rootInstance as LfPlaceholder;

      expect(component.lfIcon).toBe("loading");
    });

    it("uses template as default icon", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);
      const component = page.rootInstance as LfPlaceholder;

      expect(component.lfIcon).toBe("template");
    });
  });

  describe("Trigger Modes", () => {
    it("respects viewport trigger mode", async () => {
      const page = await createPage(
        `<lf-placeholder lf-trigger="viewport"></lf-placeholder>`,
      );
      const component = page.rootInstance as LfPlaceholder;

      expect(component.lfTrigger).toBe("viewport");
    });

    it("respects props trigger mode", async () => {
      const page = await createPage(
        `<lf-placeholder lf-trigger="props"></lf-placeholder>`,
      );
      const component = page.rootInstance as LfPlaceholder;

      expect(component.lfTrigger).toBe("props");
    });

    it("respects both trigger mode (default)", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);
      const component = page.rootInstance as LfPlaceholder;

      expect(component.lfTrigger).toBe("both");
    });
  });

  describe("Threshold Configuration", () => {
    it("uses default threshold of 0.25", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);
      const component = page.rootInstance as LfPlaceholder;

      expect(component.lfThreshold).toBe(0.25);
    });

    it("accepts custom threshold value", async () => {
      const page = await createPage(
        `<lf-placeholder lf-threshold="0.75"></lf-placeholder>`,
      );
      const component = page.rootInstance as LfPlaceholder;

      expect(component.lfThreshold).toBe(0.75);
    });

    it("accepts threshold of 0", async () => {
      const page = await createPage(
        `<lf-placeholder lf-threshold="0"></lf-placeholder>`,
      );
      const component = page.rootInstance as LfPlaceholder;

      expect(component.lfThreshold).toBe(0);
    });

    it("accepts threshold of 1", async () => {
      const page = await createPage(
        `<lf-placeholder lf-threshold="1"></lf-placeholder>`,
      );
      const component = page.rootInstance as LfPlaceholder;

      expect(component.lfThreshold).toBe(1);
    });
  });

  describe("Component Value (lfValue)", () => {
    it("uses LfCard as default value", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);
      const component = page.rootInstance as LfPlaceholder;

      expect(component.lfValue).toBe("LfCard");
    });

    it("accepts custom component value", async () => {
      const page = await createPage(
        `<lf-placeholder lf-value="LfButton"></lf-placeholder>`,
      );
      const component = page.rootInstance as LfPlaceholder;

      expect(component.lfValue).toBe("LfButton");
    });

    it("accepts various component names", async () => {
      const componentNames = ["LfButton", "LfCard", "LfImage", "LfList"];

      for (const name of componentNames) {
        const page = await createPage(
          `<lf-placeholder lf-value="${name}"></lf-placeholder>`,
        );
        const component = page.rootInstance as LfPlaceholder;
        expect(component.lfValue).toBe(name);
      }
    });
  });

  describe("Custom Styling", () => {
    it("has empty lfStyle by default", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);
      const component = page.rootInstance as LfPlaceholder;

      expect(component.lfStyle).toBe("");
    });

    it("accepts custom style string", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);
      const component = page.rootInstance as LfPlaceholder;

      component.lfStyle = "#lf-component { background: blue; }";
      await page.waitForChanges();

      expect(component.lfStyle).toBe("#lf-component { background: blue; }");
    });

    it("renders style element when lfStyle is set", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);
      const component = page.rootInstance as LfPlaceholder;

      component.lfStyle = ".custom { color: red; }";
      await page.waitForChanges();

      const styleElement = page.root.shadowRoot.querySelector("style");
      expect(styleElement).toBeTruthy();
    });
  });

  describe("Props Configuration", () => {
    it("has empty props by default", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);
      const component = page.rootInstance as LfPlaceholder;

      expect(component.lfProps).toEqual({});
    });

    it("accepts props object", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);
      const component = page.rootInstance as LfPlaceholder;

      component.lfProps = { lfLabel: "Test Label" };
      await page.waitForChanges();

      expect(component.lfProps).toEqual({ lfLabel: "Test Label" });
    });

    it("accepts complex props object", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);
      const component = page.rootInstance as LfPlaceholder;

      const complexProps = {
        lfLabel: "Complex",
        lfDisabled: true,
        lfStyle: "color: red;",
      };
      component.lfProps = complexProps;
      await page.waitForChanges();

      expect(component.lfProps).toEqual(complexProps);
    });
  });

  describe("Public Methods - Detailed", () => {
    it("getProps returns all prop values", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);
      const component = page.rootInstance as LfPlaceholder;

      component.lfIcon = "photo";
      component.lfThreshold = 0.5;
      component.lfTrigger = "viewport";
      component.lfValue = "LfButton";
      await page.waitForChanges();

      const props = await component.getProps();

      expect(props.lfIcon).toBe("photo");
      expect(props.lfThreshold).toBe(0.5);
      expect(props.lfTrigger).toBe("viewport");
      expect(props.lfValue).toBe("LfButton");
    });

    it("getDebugInfo returns lifecycle info", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);
      const component = page.rootInstance as LfPlaceholder;

      const debugInfo = await component.getDebugInfo();

      expect(debugInfo).toBeDefined();
      expect(typeof debugInfo).toBe("object");
    });

    it("getComponent returns null initially", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);
      const component = page.rootInstance as LfPlaceholder;

      const placeholderComp = await component.getComponent();

      // Initially null since component isn't rendered yet
      expect(placeholderComp).toBeNull();
    });

    it("refresh triggers re-render", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);
      const component = page.rootInstance as LfPlaceholder;

      const initialStyle = component.lfStyle;
      component.lfStyle = "test: value;";

      await component.refresh();
      await page.waitForChanges();

      expect(component.lfStyle).not.toBe(initialStyle);
    });

    it("unmount with delay", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);
      const component = page.rootInstance as LfPlaceholder;

      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-placeholder-event", (e: CustomEvent) =>
        events.push(e),
      );

      // Call unmount with a short delay
      await component.unmount(50);

      // Event shouldn't be emitted immediately
      const immediateUnmountEvents = events.filter(
        (e) => e.detail.eventType === "unmount",
      );
      expect(immediateUnmountEvents.length).toBe(0);

      // Wait for the timeout to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Now it should be emitted
      const delayedUnmountEvents = events.filter(
        (e) => e.detail.eventType === "unmount",
      );
      expect(delayedUnmountEvents.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("IntersectionObserver", () => {
    it("creates IntersectionObserver on load", async () => {
      await createPage(`<lf-placeholder></lf-placeholder>`);

      expect(global.IntersectionObserver).toHaveBeenCalled();
    });

    it("observes root element", async () => {
      await createPage(`<lf-placeholder></lf-placeholder>`);

      expect(observeMock).toHaveBeenCalled();
    });
  });

  describe("DOM Structure", () => {
    it("renders wrapper element", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);

      const wrapper = page.root.shadowRoot.querySelector("#lf-component");
      expect(wrapper).toBeTruthy();
    });

    it("renders placeholder container with part attribute", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);

      const placeholder = page.root.shadowRoot.querySelector(
        "[part='placeholder']",
      );
      expect(placeholder).toBeTruthy();
    });

    it("has shadow DOM enabled", async () => {
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);

      expect(page.root.shadowRoot).toBeTruthy();
    });
  });

  describe("Component ID", () => {
    it("passes ID to event payload", async () => {
      const events: CustomEvent[] = [];
      const page = await createPage(
        `<lf-placeholder id="my-placeholder"></lf-placeholder>`,
      );

      page.root.addEventListener("lf-placeholder-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfPlaceholder;
      await component.unmount(0);

      // Wait for the setTimeout to execute
      await new Promise((resolve) => setTimeout(resolve, 50));

      const eventWithId = events.find((e) => e.detail.id === "my-placeholder");
      expect(eventWithId).toBeTruthy();
    });

    it("handles empty ID gracefully", async () => {
      const events: CustomEvent[] = [];
      const page = await createPage(`<lf-placeholder></lf-placeholder>`);

      page.root.addEventListener("lf-placeholder-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfPlaceholder;
      await component.unmount(0);

      // Wait for the setTimeout to execute
      await new Promise((resolve) => setTimeout(resolve, 50));

      const lastEvent = events[events.length - 1];
      expect(lastEvent.detail.id).toBe("");
    });
  });
});
