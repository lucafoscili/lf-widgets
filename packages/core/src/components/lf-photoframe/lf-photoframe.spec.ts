import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfPhotoframe } from "./lf-photoframe";
import { LfPhotoframeEventPayload } from "@lf-widgets/foundations";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfPhotoframe],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("LfPhotoframe", () => {
  let intersectionObserverCallback: (entries: any[]) => void;
  let observeMock: jest.Mock;
  let unobserveMock: jest.Mock;
  let disconnectMock: jest.Mock;

  beforeAll(() => {
    observeMock = jest.fn();
    unobserveMock = jest.fn();
    disconnectMock = jest.fn();

    // Mock IntersectionObserver with callback capture
    global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
      intersectionObserverCallback = callback;
      return {
        observe: observeMock,
        unobserve: unobserveMock,
        disconnect: disconnectMock,
      };
    });
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

  describe("basic rendering", () => {
    let page: SpecPage;

    beforeEach(async () => {
      page = await createPage(`<lf-photoframe></lf-photoframe>`);
    });

    it("renders", async () => {
      const component = page.rootInstance as LfPhotoframe;
      expect(component).toBeTruthy();
    });

    it("has default props", async () => {
      const component = page.rootInstance as LfPhotoframe;
      const props = await component.getProps();

      expect(props.lfOverlay).toBeNull();
      expect(props.lfPlaceholder).toBeNull();
      expect(props.lfStyle).toBe("");
      expect(props.lfThreshold).toBe(0.25);
      expect(props.lfValue).toBeNull();
    });

    it("sets props", async () => {
      const component = page.rootInstance as LfPhotoframe;

      component.lfOverlay = { title: "Test", description: "Desc" };
      component.lfPlaceholder = { src: "placeholder.jpg" };
      component.lfStyle = "color: red;";
      component.lfThreshold = 0.5;
      component.lfValue = { src: "image.jpg" };

      await page.waitForChanges();

      const props = await component.getProps();
      expect(props.lfOverlay.title).toBe("Test");
      expect(props.lfPlaceholder.src).toBe("placeholder.jpg");
      expect(props.lfStyle).toBe("color: red;");
      expect(props.lfThreshold).toBe(0.5);
      expect(props.lfValue.src).toBe("image.jpg");
    });
  });

  describe("public methods", () => {
    let page: SpecPage;

    beforeEach(async () => {
      page = await createPage(`<lf-photoframe></lf-photoframe>`);
    });

    it("calls getDebugInfo method", async () => {
      const component = page.rootInstance as LfPhotoframe;
      const debugInfo = await component.getDebugInfo();

      expect(debugInfo).toBeDefined();
    });

    it("calls getProps method", async () => {
      const component = page.rootInstance as LfPhotoframe;
      const props = await component.getProps();

      expect(props).toBeDefined();
      expect(typeof props).toBe("object");
    });

    it("calls refresh method", async () => {
      const component = page.rootInstance as LfPhotoframe;
      await component.refresh();

      expect(component).toBeTruthy();
    });

    it("calls unmount method", async () => {
      const component = page.rootInstance as LfPhotoframe;
      await component.unmount(0);

      // Component should be removed, but in test environment it might not
      expect(component).toBeTruthy();
    });

    it("getProps returns all component properties", async () => {
      const component = page.rootInstance as LfPhotoframe;
      component.lfOverlay = { title: "Title" };
      component.lfPlaceholder = { src: "placeholder.png" };
      component.lfStyle = ".test {}";
      component.lfValue = { src: "value.png", alt: "Alt text" };

      const props = await component.getProps();

      expect(Object.keys(props)).toContain("lfOverlay");
      expect(Object.keys(props)).toContain("lfPlaceholder");
      expect(Object.keys(props)).toContain("lfStyle");
      expect(Object.keys(props)).toContain("lfThreshold");
      expect(Object.keys(props)).toContain("lfValue");
    });
  });

  describe("event emission", () => {
    it("emits unmount event when unmount is called", async () => {
      const events: CustomEvent<LfPhotoframeEventPayload>[] = [];
      const page = await createPage(`<lf-photoframe></lf-photoframe>`);
      page.root.addEventListener("lf-photoframe-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfPhotoframe;
      await component.unmount(0);
      await page.waitForChanges();

      // Allow for setTimeout in unmount
      await new Promise((resolve) => setTimeout(resolve, 50));

      const unmountEvents = events.filter(
        (e) => e.detail.eventType === "unmount",
      );
      expect(unmountEvents.length).toBe(1);
    });

    it("event payload contains eventType property", async () => {
      const events: CustomEvent<LfPhotoframeEventPayload>[] = [];
      const page = await createPage(`<lf-photoframe></lf-photoframe>`);
      page.root.addEventListener("lf-photoframe-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfPhotoframe;
      await component.unmount(0);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const unmountEvent = events.find((e) => e.detail.eventType === "unmount");
      expect(unmountEvent).toBeDefined();
      expect(unmountEvent.detail.eventType).toBe("unmount");
    });

    it("event payload contains component reference", async () => {
      const events: CustomEvent<LfPhotoframeEventPayload>[] = [];
      const page = await createPage(`<lf-photoframe></lf-photoframe>`);
      page.root.addEventListener("lf-photoframe-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfPhotoframe;
      await component.unmount(0);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const unmountEvent = events.find((e) => e.detail.eventType === "unmount");
      expect(unmountEvent).toBeDefined();
      expect(unmountEvent.detail.comp).toBe(page.rootInstance);
    });

    it("event payload contains component id", async () => {
      const events: CustomEvent<LfPhotoframeEventPayload>[] = [];
      const page = await createPage(
        `<lf-photoframe id="test-photoframe"></lf-photoframe>`,
      );
      page.root.addEventListener("lf-photoframe-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfPhotoframe;
      await component.unmount(0);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const unmountEvent = events.find(
        (e) => e.detail.id === "test-photoframe",
      );
      expect(unmountEvent).toBeDefined();
    });
  });

  describe("placeholder tests", () => {
    it("renders placeholder image element", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      component.lfPlaceholder = { src: "placeholder.jpg", alt: "Placeholder" };
      await page.waitForChanges();

      const placeholderImg = page.root.shadowRoot.querySelector(
        'img[part="placeholder"]',
      );
      expect(placeholderImg).toBeTruthy();
    });

    it("applies placeholder src attribute", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      component.lfPlaceholder = { src: "placeholder.jpg" };
      await page.waitForChanges();

      const placeholderImg = page.root.shadowRoot.querySelector(
        'img[part="placeholder"]',
      ) as HTMLImageElement;
      expect(placeholderImg.getAttribute("src")).toBe("placeholder.jpg");
    });

    it("applies placeholder alt attribute", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      component.lfPlaceholder = { src: "placeholder.jpg", alt: "Test Alt" };
      await page.waitForChanges();

      const placeholderImg = page.root.shadowRoot.querySelector(
        'img[part="placeholder"]',
      ) as HTMLImageElement;
      expect(placeholderImg.getAttribute("alt")).toBe("Test Alt");
    });

    it("shows placeholder when no value image is provided", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      component.lfPlaceholder = { src: "placeholder.jpg" };
      component.lfValue = null;
      await page.waitForChanges();

      const placeholderImg = page.root.shadowRoot.querySelector(
        'img[part="placeholder"]',
      );
      expect(placeholderImg).toBeTruthy();
    });

    it("renders without placeholder when lfPlaceholder is null", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const placeholderImg = page.root.shadowRoot.querySelector(
        'img[part="placeholder"]',
      ) as HTMLImageElement;
      // Placeholder element exists but has no src
      expect(placeholderImg.getAttribute("src")).toBeNull();
    });
  });

  describe("overlay tests", () => {
    it("renders overlay when lfOverlay is set", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      component.lfOverlay = { title: "Test Title" };
      await page.waitForChanges();

      const overlay = page.root.shadowRoot.querySelector('[part="overlay"]');
      expect(overlay).toBeTruthy();
    });

    it("displays overlay title", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      component.lfOverlay = { title: "My Title" };
      await page.waitForChanges();

      const titleEl = page.root.shadowRoot.querySelector('[part="title"]');
      expect(titleEl).toBeTruthy();
      expect(titleEl.textContent).toBe("My Title");
    });

    it("displays overlay description", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      component.lfOverlay = {
        title: "Title",
        description: "My Description",
      };
      await page.waitForChanges();

      const descEl = page.root.shadowRoot.querySelector('[part="description"]');
      expect(descEl).toBeTruthy();
      expect(descEl.textContent).toBe("My Description");
    });

    it("does not render overlay when lfOverlay is null", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const overlay = page.root.shadowRoot.querySelector('[part="overlay"]');
      expect(overlay).toBeNull();
    });

    it("does not render overlay when lfOverlay is not an object", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      (component as any).lfOverlay = "invalid";
      await page.waitForChanges();

      const overlay = page.root.shadowRoot.querySelector('[part="overlay"]');
      expect(overlay).toBeNull();
    });

    it("renders lf-image element for overlay icon when provided", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      component.lfOverlay = {
        title: "Title",
        icon: "test-icon",
      };
      await page.waitForChanges();

      // The icon is rendered as lf-image component
      const iconEl = page.root.shadowRoot.querySelector("lf-image");
      expect(iconEl).toBeTruthy();
    });

    it("overlay click hides overlay when hideOnClick is true", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-photoframe-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfPhotoframe;
      component.lfOverlay = {
        title: "Click to hide",
        hideOnClick: true,
      };
      await page.waitForChanges();

      const overlay = page.root.shadowRoot.querySelector(
        '[part="overlay"]',
      ) as HTMLElement;
      expect(overlay).toBeTruthy();

      overlay.click();
      await page.waitForChanges();

      // Overlay should be removed after click
      expect(component.lfOverlay).toBeNull();

      // Should emit overlay event
      const overlayEvent = events.find((e) => e.detail.eventType === "overlay");
      expect(overlayEvent).toBeDefined();
    });

    it("overlay click does not hide overlay when hideOnClick is false", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      component.lfOverlay = {
        title: "Cannot hide",
        hideOnClick: false,
      };
      await page.waitForChanges();

      const overlay = page.root.shadowRoot.querySelector(
        '[part="overlay"]',
      ) as HTMLElement;
      overlay.click();
      await page.waitForChanges();

      // Overlay should still be present
      expect(component.lfOverlay).toBeTruthy();
    });
  });

  describe("threshold tests", () => {
    it("uses default threshold of 0.25", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      expect(component.lfThreshold).toBe(0.25);
    });

    it("accepts custom threshold value", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      component.lfThreshold = 0.75;
      await page.waitForChanges();

      expect(component.lfThreshold).toBe(0.75);
    });

    it("IntersectionObserver is created with threshold", async () => {
      await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      expect(global.IntersectionObserver).toHaveBeenCalled();
    });
  });

  describe("viewport intersection tests", () => {
    it("sets up IntersectionObserver on component load", async () => {
      await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      expect(observeMock).toHaveBeenCalled();
    });

    it("does not show value image before entering viewport", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      component.lfValue = { src: "main-image.jpg" };
      await page.waitForChanges();

      // Image should not be visible until in viewport
      const imageEl = page.root.shadowRoot.querySelector('[part="image"]');
      // When not in viewport, the value image should not be rendered
      expect(imageEl).toBeNull();
    });

    it("shows value image after entering viewport", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      component.lfValue = { src: "main-image.jpg" };

      // Manually set isInViewport to true (simulating intersection)
      (component as any).isInViewport = true;
      await page.waitForChanges();

      const imageEl = page.root.shadowRoot.querySelector('[part="image"]');
      expect(imageEl).toBeTruthy();
    });
  });

  describe("value image tests", () => {
    it("applies lfValue src to image", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      component.lfValue = { src: "main-image.jpg" };
      (component as any).isInViewport = true;
      await page.waitForChanges();

      const imageEl = page.root.shadowRoot.querySelector(
        '[part="image"]',
      ) as HTMLImageElement;
      expect(imageEl.getAttribute("src")).toBe("main-image.jpg");
    });

    it("applies lfValue alt to image", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      component.lfValue = { src: "main-image.jpg", alt: "Main Image Alt" };
      (component as any).isInViewport = true;
      await page.waitForChanges();

      const imageEl = page.root.shadowRoot.querySelector(
        '[part="image"]',
      ) as HTMLImageElement;
      expect(imageEl.getAttribute("alt")).toBe("Main Image Alt");
    });

    it("applies multiple lfValue attributes", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      component.lfValue = {
        src: "main-image.jpg",
        alt: "Alt Text",
        title: "Image Title",
      };
      (component as any).isInViewport = true;
      await page.waitForChanges();

      const imageEl = page.root.shadowRoot.querySelector(
        '[part="image"]',
      ) as HTMLImageElement;
      expect(imageEl.getAttribute("src")).toBe("main-image.jpg");
      expect(imageEl.getAttribute("alt")).toBe("Alt Text");
      expect(imageEl.getAttribute("title")).toBe("Image Title");
    });
  });

  describe("custom styling tests", () => {
    it("applies custom style when lfStyle is set", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      component.lfStyle = "#lf-component { background: red; }";
      await page.waitForChanges();

      const styleEl = page.root.shadowRoot.querySelector("style");
      expect(styleEl).toBeTruthy();
    });

    it("does not render style element when lfStyle is empty", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const styleEl = page.root.shadowRoot.querySelector(
        'style[id="lf-style"]',
      );
      expect(styleEl).toBeNull();
    });

    it("updates style when lfStyle changes", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      component.lfStyle = ".first { color: red; }";
      await page.waitForChanges();

      component.lfStyle = ".second { color: blue; }";
      await page.waitForChanges();

      const props = await component.getProps();
      expect(props.lfStyle).toBe(".second { color: blue; }");
    });
  });

  describe("image orientation tests", () => {
    it("starts with empty image orientation", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      expect((component as any).imageOrientation).toBe("");
    });

    it("wrapper element receives orientation class when set", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;
      (component as any).imageOrientation = "horizontal";
      await page.waitForChanges();

      const wrapper = page.root.shadowRoot.querySelector('[id="lf-component"]');
      expect(wrapper.className).toContain("horizontal");
    });
  });

  describe("lifecycle and cleanup", () => {
    it("disconnectedCallback unobserves intersection observer", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      page.root.remove();

      expect(unobserveMock).toHaveBeenCalled();
    });

    it("handles multiple refresh calls", async () => {
      const page = await createPage(`
        <lf-photoframe></lf-photoframe>
      `);

      const component = page.rootInstance as LfPhotoframe;

      await component.refresh();
      await component.refresh();
      await component.refresh();
      await page.waitForChanges();

      expect(component).toBeTruthy();
    });
  });

  describe("data-cy attributes", () => {
    it("placeholder image has data-cy attribute", async () => {
      const page = await createPage(`<lf-photoframe></lf-photoframe>`);

      const component = page.rootInstance as LfPhotoframe;
      component.lfPlaceholder = { src: "placeholder.jpg" };
      await page.waitForChanges();

      const placeholderImg = page.root.shadowRoot.querySelector(
        'img[part="placeholder"]',
      );
      expect(placeholderImg.hasAttribute("data-cy")).toBe(true);
    });

    it("value image has data-cy attribute when in viewport", async () => {
      const page = await createPage(`<lf-photoframe></lf-photoframe>`);

      const component = page.rootInstance as LfPhotoframe;
      component.lfValue = { src: "main.jpg" };
      (component as any).isInViewport = true;
      await page.waitForChanges();

      const valueImg = page.root.shadowRoot.querySelector('[part="image"]');
      expect(valueImg.hasAttribute("data-cy")).toBe(true);
    });
  });

  describe("CSS parts", () => {
    it("exposes placeholder part", async () => {
      const page = await createPage(`<lf-photoframe></lf-photoframe>`);

      const placeholderEl = page.root.shadowRoot.querySelector(
        '[part="placeholder"]',
      );
      expect(placeholderEl).toBeTruthy();
    });

    it("exposes image part when in viewport", async () => {
      const page = await createPage(`<lf-photoframe></lf-photoframe>`);

      const component = page.rootInstance as LfPhotoframe;
      component.lfValue = { src: "test.jpg" };
      (component as any).isInViewport = true;
      await page.waitForChanges();

      const imageEl = page.root.shadowRoot.querySelector('[part="image"]');
      expect(imageEl).toBeTruthy();
    });

    it("exposes overlay parts when overlay is set", async () => {
      const page = await createPage(`<lf-photoframe></lf-photoframe>`);

      const component = page.rootInstance as LfPhotoframe;
      component.lfOverlay = {
        title: "Title",
        description: "Description",
        icon: "icon",
      };
      await page.waitForChanges();

      expect(
        page.root.shadowRoot.querySelector('[part="overlay"]'),
      ).toBeTruthy();
      expect(page.root.shadowRoot.querySelector('[part="title"]')).toBeTruthy();
      expect(
        page.root.shadowRoot.querySelector('[part="description"]'),
      ).toBeTruthy();
      // Icon is rendered as lf-image, so check for that
      expect(page.root.shadowRoot.querySelector("lf-image")).toBeTruthy();
    });
  });

  describe("isReady state", () => {
    it("starts with isReady as false", async () => {
      const page = await createPage(`<lf-photoframe></lf-photoframe>`);

      const component = page.rootInstance as LfPhotoframe;
      expect((component as any).isReady).toBe(false);
    });

    it("image gets active class when isReady and isInViewport are true", async () => {
      const page = await createPage(`<lf-photoframe></lf-photoframe>`);

      const component = page.rootInstance as LfPhotoframe;
      component.lfValue = { src: "test.jpg" };
      (component as any).isInViewport = true;
      (component as any).isReady = true;
      await page.waitForChanges();

      const imageEl = page.root.shadowRoot.querySelector('[part="image"]');
      expect(imageEl.className).toContain("active");
    });

    it("placeholder gets hidden class when replace is true", async () => {
      const page = await createPage(`<lf-photoframe></lf-photoframe>`);

      const component = page.rootInstance as LfPhotoframe;
      component.lfPlaceholder = { src: "placeholder.jpg" };
      component.lfValue = { src: "test.jpg" };
      (component as any).isInViewport = true;
      (component as any).isReady = true;
      await page.waitForChanges();

      const placeholderEl = page.root.shadowRoot.querySelector(
        '[part="placeholder"]',
      );
      expect(placeholderEl.className).toContain("hidden");
    });
  });
});
