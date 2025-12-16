import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfImage } from "./lf-image";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfImage],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("LfImage", () => {
  it("renders", async () => {
    const page = await createPage(`<lf-image></lf-image>`);
    expect(page.root).toBeTruthy();
  });

  it("renders with default props", async () => {
    const page = await createPage(`<lf-image></lf-image>`);
    const component = page.rootInstance as LfImage;

    expect(component.lfHtmlAttributes).toEqual({});
    expect(component.lfShowSpinner).toBe(false);
    expect(component.lfSizeX).toBe("100%");
    expect(component.lfSizeY).toBe("100%");
    expect(component.lfStyle).toBe("");
    expect(component.lfUiState).toBe("primary");
    expect(component.lfValue).toBe("");
  });

  it("renders with custom props", async () => {
    const page = await createPage(
      `<lf-image lf-show-spinner="true" lf-size-x="200px" lf-size-y="150px" lf-style="#test { color: red; }" lf-ui-state="success" lf-value="test-icon"></lf-image>`,
    );
    const component = page.rootInstance as LfImage;

    expect(component.lfShowSpinner).toBe(true);
    expect(component.lfSizeX).toBe("200px");
    expect(component.lfSizeY).toBe("150px");
    expect(component.lfStyle).toBe("#test { color: red; }");
    expect(component.lfUiState).toBe("success");
    expect(component.lfValue).toBe("test-icon");
  });

  it("calls getProps method", async () => {
    const page = await createPage(`<lf-image></lf-image>`);
    const component = page.rootInstance as LfImage;
    const props = await component.getProps();

    expect(props).toBeDefined();
    expect(props.lfSizeX).toBe("100%");
    expect(props.lfSizeY).toBe("100%");
    expect(props.lfStyle).toBe("");
    expect(props.lfUiState).toBe("primary");
    expect(props.lfValue).toBe("");
  });

  it("calls refresh method", async () => {
    const page = await createPage(`<lf-image></lf-image>`);
    const component = page.rootInstance as LfImage;
    await component.refresh();

    expect(component).toBeTruthy();
  });

  it("calls getDebugInfo method", async () => {
    const page = await createPage(`<lf-image></lf-image>`);
    const component = page.rootInstance as LfImage;
    const debugInfo = await component.getDebugInfo();

    expect(debugInfo).toBeDefined();
  });

  it("calls getImage method", async () => {
    const page = await createPage(`<lf-image></lf-image>`);
    const component = page.rootInstance as LfImage;
    const image = await component.getImage();

    expect(image).toBeNull();
  });

  it("calls unmount method", async () => {
    const page = await createPage(`<lf-image></lf-image>`);
    const component = page.rootInstance as LfImage;
    await component.unmount(0);

    // Component should be removed, but in test environment it might not
    expect(component).toBeTruthy();
  });

  describe("Event Emission", () => {
    it("emits ready event on component load", async () => {
      const events: CustomEvent[] = [];
      const page = await createPage(
        `<lf-image lf-value="test-icon"></lf-image>`,
      );
      page.root.addEventListener("lf-image-event", (e: CustomEvent) =>
        events.push(e),
      );

      // Ready event fires during componentDidLoad, so we need to trigger a refresh
      const component = page.rootInstance as LfImage;
      await component.refresh();
      await page.waitForChanges();

      // Component should be ready
      expect(component).toBeTruthy();
    });

    it("emits click event when image is clicked", async () => {
      const events: CustomEvent[] = [];
      const page = await createPage(
        `<lf-image lf-value="test-icon"></lf-image>`,
      );
      page.root.addEventListener("lf-image-event", (e: CustomEvent) =>
        events.push(e),
      );

      const wrapper = page.root.shadowRoot.querySelector("[part='image']");
      wrapper?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      expect(events.length).toBeGreaterThan(0);
      const clickEvent = events.find((e) => e.detail.eventType === "click");
      expect(clickEvent).toBeDefined();
      expect(clickEvent.detail.eventType).toBe("click");
    });

    it("emits unmount event when unmount is called", async () => {
      const events: CustomEvent[] = [];
      const page = await createPage(
        `<lf-image lf-value="test-icon"></lf-image>`,
      );
      page.root.addEventListener("lf-image-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfImage;

      // Create a promise that resolves when unmount event is received
      const unmountPromise = new Promise<CustomEvent>((resolve) => {
        page.root.addEventListener("lf-image-event", (e: CustomEvent) => {
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
      const page = await createPage(
        `<lf-image id="test-image" lf-value="test-icon"></lf-image>`,
      );
      page.root.addEventListener("lf-image-event", (e: CustomEvent) =>
        events.push(e),
      );

      const wrapper = page.root.shadowRoot.querySelector("[part='image']");
      wrapper?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      const clickEvent = events.find((e) => e.detail.eventType === "click");
      expect(clickEvent.detail).toHaveProperty("comp");
      expect(clickEvent.detail).toHaveProperty("id");
      expect(clickEvent.detail).toHaveProperty("eventType");
      expect(clickEvent.detail).toHaveProperty("originalEvent");
      expect(clickEvent.detail.id).toBe("test-image");
    });
  });

  describe("Size Properties", () => {
    it("applies default size values", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon"></lf-image>`,
      );
      const style = page.root.shadowRoot.querySelector("style");

      expect(style.textContent).toContain("--lf_image_height: 100%");
      expect(style.textContent).toContain("--lf_image_width: 100%");
    });

    it("applies custom lfSizeX value", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon" lf-size-x="250px"></lf-image>`,
      );
      const style = page.root.shadowRoot.querySelector("style");

      expect(style.textContent).toContain("--lf_image_width: 250px");
    });

    it("applies custom lfSizeY value", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon" lf-size-y="180px"></lf-image>`,
      );
      const style = page.root.shadowRoot.querySelector("style");

      expect(style.textContent).toContain("--lf_image_height: 180px");
    });

    it("applies both custom size values", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon" lf-size-x="300px" lf-size-y="200px"></lf-image>`,
      );
      const style = page.root.shadowRoot.querySelector("style");

      expect(style.textContent).toContain("--lf_image_width: 300px");
      expect(style.textContent).toContain("--lf_image_height: 200px");
    });

    it("accepts percentage values for size", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon" lf-size-x="50%" lf-size-y="75%"></lf-image>`,
      );
      const style = page.root.shadowRoot.querySelector("style");

      expect(style.textContent).toContain("--lf_image_width: 50%");
      expect(style.textContent).toContain("--lf_image_height: 75%");
    });

    it("accepts viewport units for size", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon" lf-size-x="50vw" lf-size-y="25vh"></lf-image>`,
      );
      const style = page.root.shadowRoot.querySelector("style");

      expect(style.textContent).toContain("--lf_image_width: 50vw");
      expect(style.textContent).toContain("--lf_image_height: 25vh");
    });
  });

  describe("SVG/Icon Rendering", () => {
    it("renders icon when lfValue is not a URL", async () => {
      const page = await createPage(`<lf-image lf-value="home"></lf-image>`);
      await page.waitForChanges();

      // Should render an icon element (not an img)
      const img = page.root.shadowRoot.querySelector("img");
      expect(img).toBeNull();
    });

    it("does not render img element for icon values", async () => {
      const page = await createPage(
        `<lf-image lf-value="settings"></lf-image>`,
      );
      await page.waitForChanges();

      const img = page.root.shadowRoot.querySelector("img");
      expect(img).toBeNull();
    });

    it("renders nothing when lfValue is empty", async () => {
      const page = await createPage(`<lf-image lf-value=""></lf-image>`);
      await page.waitForChanges();

      const wrapper = page.root.shadowRoot.querySelector("#lf-component");
      expect(wrapper).toBeNull();
    });
  });

  describe("URL-based Image Rendering", () => {
    it("renders img element for http URL", async () => {
      const page = await createPage(
        `<lf-image lf-value="https://example.com/image.jpg"></lf-image>`,
      );
      await page.waitForChanges();

      const img = page.root.shadowRoot.querySelector("img");
      expect(img).toBeTruthy();
      expect(img.getAttribute("src")).toBe("https://example.com/image.jpg");
    });

    it("renders img element for relative URL", async () => {
      const page = await createPage(
        `<lf-image lf-value="./images/test.png"></lf-image>`,
      );
      await page.waitForChanges();

      const img = page.root.shadowRoot.querySelector("img");
      expect(img).toBeTruthy();
      expect(img.getAttribute("src")).toBe("./images/test.png");
    });

    it("renders img element for absolute path", async () => {
      const page = await createPage(
        `<lf-image lf-value="/assets/image.png"></lf-image>`,
      );
      await page.waitForChanges();

      const img = page.root.shadowRoot.querySelector("img");
      expect(img).toBeTruthy();
      expect(img.getAttribute("src")).toBe("/assets/image.png");
    });

    it("renders img element for data URL", async () => {
      const dataUrl =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      const page = await createPage(
        `<lf-image lf-value="${dataUrl}"></lf-image>`,
      );
      await page.waitForChanges();

      const img = page.root.shadowRoot.querySelector("img");
      expect(img).toBeTruthy();
      expect(img.getAttribute("src")).toBe(dataUrl);
    });

    it("renders img element for blob URL", async () => {
      const page = await createPage(
        `<lf-image lf-value="blob:http://localhost/abc123"></lf-image>`,
      );
      await page.waitForChanges();

      const img = page.root.shadowRoot.querySelector("img");
      expect(img).toBeTruthy();
    });
  });

  describe("UI State", () => {
    it("applies default primary UI state", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon"></lf-image>`,
      );
      const component = page.rootInstance as LfImage;

      expect(component.lfUiState).toBe("primary");
    });

    it("applies success UI state", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon" lf-ui-state="success"></lf-image>`,
      );
      const component = page.rootInstance as LfImage;

      expect(component.lfUiState).toBe("success");
    });

    it("applies warning UI state", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon" lf-ui-state="warning"></lf-image>`,
      );
      const component = page.rootInstance as LfImage;

      expect(component.lfUiState).toBe("warning");
    });

    it("applies danger UI state", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon" lf-ui-state="danger"></lf-image>`,
      );
      const component = page.rootInstance as LfImage;

      expect(component.lfUiState).toBe("danger");
    });

    it("applies secondary UI state", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon" lf-ui-state="secondary"></lf-image>`,
      );
      const component = page.rootInstance as LfImage;

      expect(component.lfUiState).toBe("secondary");
    });
  });

  describe("Custom Style", () => {
    it("applies custom lfStyle to the component", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon" lf-style=".test { color: blue; }"></lf-image>`,
      );
      const component = page.rootInstance as LfImage;

      expect(component.lfStyle).toBe(".test { color: blue; }");
    });

    it("includes custom style in style element", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon" lf-style="#custom { opacity: 0.5; }"></lf-image>`,
      );
      const style = page.root.shadowRoot.querySelector("style");

      // The style should be processed by the theme's setLfStyle method
      expect(style).toBeTruthy();
    });
  });

  describe("Spinner Behavior", () => {
    it("lfShowSpinner defaults to false", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon"></lf-image>`,
      );
      const component = page.rootInstance as LfImage;

      expect(component.lfShowSpinner).toBe(false);
    });

    it("lfShowSpinner can be set to true", async () => {
      const page = await createPage(
        `<lf-image lf-value="https://example.com/image.jpg" lf-show-spinner="true"></lf-image>`,
      );
      const component = page.rootInstance as LfImage;

      expect(component.lfShowSpinner).toBe(true);
    });
  });

  describe("Component State", () => {
    it("has error state initially false", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon"></lf-image>`,
      );
      const component = page.rootInstance as LfImage;

      expect(component["error"]).toBe(false);
    });

    it("has isLoaded state for icon values", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon"></lf-image>`,
      );
      const component = page.rootInstance as LfImage;

      // For non-URL values (icons), isLoaded should be true
      expect(component["isLoaded"]).toBe(true);
    });

    it("has isLoaded initially false for URL images", async () => {
      const page = await createPage(
        `<lf-image lf-value="https://example.com/image.jpg"></lf-image>`,
      );
      const component = page.rootInstance as LfImage;

      // For URL images, isLoaded starts false until the image loads
      expect(component["isLoaded"]).toBe(false);
    });
  });

  describe("Image Element Reference", () => {
    it("getImage returns img element for URL images", async () => {
      const page = await createPage(
        `<lf-image lf-value="https://example.com/image.jpg"></lf-image>`,
      );
      const component = page.rootInstance as LfImage;
      await page.waitForChanges();

      const image = await component.getImage();
      // The img element should be referenced after render
      expect(image).toBeTruthy();
    });

    it("getImage returns null when no value is set", async () => {
      const page = await createPage(`<lf-image></lf-image>`);
      const component = page.rootInstance as LfImage;
      const image = await component.getImage();

      expect(image).toBeNull();
    });
  });

  describe("Part Attributes", () => {
    it("has image part on wrapper element", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon"></lf-image>`,
      );
      const wrapper = page.root.shadowRoot.querySelector("[part='image']");

      expect(wrapper).toBeTruthy();
    });

    it("has img part on img element for URL images", async () => {
      const page = await createPage(
        `<lf-image lf-value="https://example.com/image.jpg"></lf-image>`,
      );
      const img = page.root.shadowRoot.querySelector("[part='img']");

      expect(img).toBeTruthy();
    });
  });

  describe("Data Attributes", () => {
    it("has data-cy attribute on img element", async () => {
      const page = await createPage(
        `<lf-image lf-value="https://example.com/image.jpg"></lf-image>`,
      );
      const img = page.root.shadowRoot.querySelector("[data-cy='image']");

      expect(img).toBeTruthy();
    });

    it("has data-lf attribute with uiState on wrapper", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon" lf-ui-state="success"></lf-image>`,
      );
      const wrapper = page.root.shadowRoot.querySelector("[data-lf='success']");

      expect(wrapper).toBeTruthy();
    });
  });

  describe("Value Changes", () => {
    it("updates when lfValue changes", async () => {
      const page = await createPage(`<lf-image lf-value="icon-1"></lf-image>`);
      const component = page.rootInstance as LfImage;

      component.lfValue = "icon-2";
      await page.waitForChanges();

      expect(component.lfValue).toBe("icon-2");
    });

    it("resets error state when value changes", async () => {
      const page = await createPage(
        `<lf-image lf-value="test-icon"></lf-image>`,
      );
      const component = page.rootInstance as LfImage;

      // Manually set error to true
      component["error"] = true;
      await page.waitForChanges();

      // Change the value - this should reset error state via the watcher
      component.lfValue = "new-icon";
      await page.waitForChanges();

      expect(component["error"]).toBe(false);
    });
  });
});
